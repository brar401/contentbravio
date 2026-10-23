
const contactDialog=document.getElementById('contact-options');
document.querySelectorAll('[data-contact-menu]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();contactDialog.showModal();}));
contactDialog.querySelector('.contact-close').addEventListener('click',()=>contactDialog.close());
contactDialog.addEventListener('click',event=>{if(event.target!==contactDialog)return;const r=contactDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)contactDialog.close();});
document.getElementById('enquiry').addEventListener('submit',function(event){event.preventDefault();if(!this.reportValidity())return;document.getElementById('result').textContent='Demo only. Nothing has been sent or stored.';});
