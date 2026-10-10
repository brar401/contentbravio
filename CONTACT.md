# Contact form

The Contact me section appears below every playground page. The navigation, home
hero, and footer link to it. A direct email link is also available.

Messages are sent to **davinderpalbrar401@gmail.com** through a standard HTML POST
to FormSubmit. The visitor's `email` field supplies the reply-to address. No Gmail
password, API key, or running FastAPI backend is needed.

## One-time activation

1. Publish these changes to the live site.
2. Open https://contentbravio.com/#contact and submit a short test message.
3. Complete FormSubmit's spam check. Check davinderpalbrar401@gmail.com (including
   spam) for the FormSubmit activation email and click its confirmation link.
4. Submit another test message and confirm it arrives. Reply to it to verify the
   visitor's email address is used.

The form is not ready to receive normal enquiries until activation is complete.
Only the inbox owner can finish this step. Browser checks alone do not confirm
email delivery.

## Submission behavior

- Name, email, and message are required; fields have length limits.
- Native form submission keeps FormSubmit's default reCAPTCHA enabled, followed
  by its confirmation or error page. The website does not show a false success
  message or clear the visitor's input before a submission.
- A hidden honeypot adds spam filtering.
- Form contents are processed by FormSubmit, as disclosed beside the submit
  button. If the service is unavailable, visitors can use the direct email link.
- The contact form remains visible and can submit when JavaScript is disabled.

Service setup and behavior: https://formsubmit.co/ and
https://formsubmit.co/documentation.
