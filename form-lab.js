/* Independent of the original contact form and playground JavaScript. */
(() => {
  'use strict';

  const RECIPIENT = 'davinderpalbrar401@gmail.com';
  const config = window.BRAVIO_FORMS || {};
  const forms = [...document.querySelectorAll('.lab-form')];

  function status(form, message, state = 'info') {
    const output = form.querySelector('.lab-status');
    output.textContent = message;
    output.dataset.state = state;
  }

  function identifier(value, pattern) {
    return typeof value === 'string' && pattern.test(value.trim()) ? value.trim() : '';
  }

  function connect(form) {
    const provider = form.dataset.provider;
    let action = '';
    if (provider === 'web3forms') {
      const key = identifier(config.web3formsAccessKey, /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i);
      if (!key) return false;
      form.elements.namedItem('access_key').value = key;
      action = 'https://api.web3forms.com/submit';
    } else if (provider === 'formspree') {
      const id = identifier(config.formspreeFormId, /^[a-z0-9]{6,64}$/i);
      if (!id) return false;
      action = 'https://formspree.io/f/' + id;
    } else if (provider === 'formspark') {
      const id = identifier(config.formsparkFormId, /^[a-z0-9_-]{6,100}$/i);
      if (!id) return false;
      action = 'https://submit-form.com/' + id;
    } else {
      return ['instant', 'attachment', 'email-app'].includes(provider);
    }
    form.action = action;
    const card = form.closest('.lab-card');
    const badge = card.querySelector('.lab-badge');
    badge.textContent = 'Ready to test';
    badge.dataset.state = 'ready';
    card.querySelector('.lab-availability').hidden = true;
    card.querySelector('summary').textContent = 'Try this method';
    return true;
  }

  function validate(form) {
    for (const name of ['name', 'message']) {
      const field = form.elements.namedItem(name);
      field.setCustomValidity(field.value.trim() ? '' : 'Please enter ' + (name === 'name' ? 'your name.' : 'a message.'));
    }
    const attachment = form.elements.namedItem('attachment');
    if (attachment) {
      const file = attachment.files[0];
      let error = '';
      if (file && file.size > 10000000) error = 'Please choose a file no larger than 10 MB.';
      if (file && !/\.(png|jpe?g|pdf)$/i.test(file.name)) error = 'Please choose a JPG, PNG, or PDF file.';
      attachment.setCustomValidity(error);
    }
    return form.reportValidity();
  }

  function stamp(form) {
    const random = typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    const reference = 'BRV-' + Date.now().toString(36).toUpperCase() + '-' + random.toUpperCase();
    form.elements.namedItem('test_reference').value = reference;
    const subject = form.querySelector('[data-subject]');
    if (subject) subject.value = '[Bravio form lab] ' + form.dataset.method + ' · ' + reference;
    return reference;
  }

  async function sendInstant(form, reference) {
    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.textContent;
    const fields = form.querySelector('fieldset');
    // Capture before disabling the fieldset; disabled controls aren't submitted.
    const payload = Object.fromEntries(new FormData(form).entries());
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    form.dataset.sending = 'true';
    fields.disabled = true;
    button.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status(form, 'Sending your test to FormSubmit…');
    try {
      const response = await fetch('https://formsubmit.co/ajax/' + RECIPIENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        credentials: 'omit'
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error('unconfirmed');
      }
      const providerMessage = typeof result?.message === 'string' ? result.message : '';
      if (/activat|verif(?:y|ication).*email|confirm.*email/i.test(providerMessage)) {
        status(form, 'FormSubmit is asking for inbox activation. Davinder needs to check its verification email, then this test can be sent again. Your message is still here.', 'error');
      } else if (response.ok && (result?.success === true || result?.success === 'true')) {
        status(form, 'FormSubmit accepted your message. Reference: ' + reference + '. Davinder can now check that the email arrived.', 'success');
        form.reset();
      } else if (response.status === 429) {
        status(form, 'FormSubmit’s sending limit was reached. Wait a little before trying again. Your message is still here.', 'error');
      } else {
        status(form, 'FormSubmit did not confirm this submission. Your message is still here. Try the original contact form above, which includes a spam check.', 'error');
      }
    } catch {
      status(form, 'We could not confirm the result. Reference: ' + reference + '. It may have reached FormSubmit, so check with Davinder before retrying. Your message is still here.', 'error');
    } finally {
      window.clearTimeout(timeout);
      fields.disabled = false;
      button.textContent = originalLabel;
      form.dataset.sending = 'false';
      form.removeAttribute('aria-busy');
    }
  }

  function openEmail(form, reference) {
    const data = new FormData(form);
    const body = [
      'Content Bravio form lab — Email app',
      'Reference: ' + reference,
      'Name: ' + data.get('name'),
      'Reply email: ' + data.get('email'),
      'Testing on: ' + data.get('device'),
      '',
      String(data.get('message'))
    ].join('\n');
    const subject = '[Bravio form lab] Email app · ' + reference;
    window.location.href = 'mailto:' + RECIPIENT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status(form, 'Your email app should open with a draft. Press Send there to deliver it. If nothing opens, use the direct email link above. This website has not sent an email for you.');
  }

  for (const form of forms) {
    const ready = connect(form);
    const fields = form.querySelector('fieldset');
    // Install guards before enabling any form that depends on this script.
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    });
    form.addEventListener('change', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    });
    form.addEventListener('submit', event => {
      if (!ready || form.dataset.sending === 'true') {
        event.preventDefault();
        return;
      }
      const trap = form.querySelector('[data-honeypot]');
      const trapped = trap && (trap.type === 'checkbox' ? trap.checked : trap.value.trim());
      if (trapped) {
        event.preventDefault();
        status(form, 'This submission was blocked by the spam check.', 'error');
        return;
      }
      if (!validate(form)) {
        event.preventDefault();
        return;
      }
      const reference = stamp(form);
      if (form.dataset.kind === 'ajax') {
        event.preventDefault();
        void sendInstant(form, reference);
      } else if (form.dataset.kind === 'mailto') {
        event.preventDefault();
        openEmail(form, reference);
      } else {
        // Leave native POST and provider CAPTCHA/confirmation pages intact.
        status(form, 'Continuing to ' + form.dataset.method.split(' · ')[0] + '. Follow the next page to finish. Reference: ' + reference + '.');
      }
    });
    fields.disabled = !ready;
  }
})();
