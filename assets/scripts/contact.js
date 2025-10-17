const contactForm = document.getElementById('contact-form');
const addressForm = document.getElementById('change-shipping-address-form');
const passwordForm = document.getElementById('change-password-form');

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const PreferredContactTime = document.getElementById('PreferredContactTime');
const message = document.getElementById('message');
const addressLine1 = document.getElementById('addressLine1');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');

// errors
const errorText = {
  firstName:            ['Enter first name.'],
  lastName:             ['Enter last name.'],
  email:                ['Enter email address.','Enter valid email address.'],
  phone:                ['Enter phone.','Enter valid phone number.'],
  PreferredContactTime: ['Enter address preferred contact time.'],
  message:              ['Enter message.'],
  addressLine1:         ['Enter address.'],
  currentPassword:      ['Enter password.'],
  newPassword:          ['Enter new password.','Enter valid new password.'],
  confirmPassword:      ['Enter confirm password.','Enter valid confirm password.', 'Password does not match.']
};

function setErr(id, msg){
  const el = document.getElementById(id);
  const p = document.querySelector(`.error[data-for="${id}"]`);
  if (p) p.textContent = msg || '';
  if (el){
    if (msg){ el.classList.add('is-invalid'); el.setAttribute('aria-invalid','true'); }
    else { el.classList.remove('is-invalid'); el.removeAttribute('aria-invalid'); }
  }
}

function validateEmail(){
  const v = email.value.trim();
  if (!v){ setErr('email', errorText.email[0]); return false; }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v)){ setErr('email', errorText.email[1]); return false; }
  setErr('email',''); return true;
}

function validatePhone(){
  phone.value = phone.value.replace(/\D/g,'').slice(0,10);
  const v = phone.value.trim();
  if (!v){ setErr('phone', errorText.phone[0]); return false; }
  if (!/^\d{10}$/.test(v)){ setErr('phone', errorText.phone[1]); return false; }
  setErr('phone',''); return true;
}

function validateNewPassword(){
  const v = newPassword.value.trim();
  if (!v){ setErr('newPassword', errorText.newPassword[0]); return false; }

  const pattern = /^(?=(?:.*[A-Z]){2,})(?=.*[^A-Za-z0-9]).{9,}$/;
  if (!pattern.test(v)){ setErr('newPassword', errorText.newPassword[1]); return false; }
  setErr('newPassword',''); return true;
}

function validateConfirmPassword(){
  const v = confirmPassword.value.trim();
  if (!v){ setErr('confirmPassword', errorText.confirmPassword[0]); return false; }

  const pattern = /^(?=(?:.*[A-Z]){2,})(?=.*[^A-Za-z0-9]).{9,}$/;
  if (!pattern.test(v)){ setErr('confirmPassword', errorText.confirmPassword[1]); return false; }

  if (v !== newPassword.value.trim()){ setErr('confirmPassword', errorText.confirmPassword[2]); return false; }
  setErr('confirmPassword',''); return true;
}



const required = [
   'firstName'
  ,'lastName'
  ,'email'
  ,'phone'
  ,'PreferredContactTime'
  ,'message'
  ,'addressLine1'
  ,'currentPassword'
  ,'newPassword'
  ,'confirmPassword'
]

const contactForm_required = [
   'firstName'
  ,'lastName'
  ,'email'
  ,'phone'
  ,'PreferredContactTime'
  ,'message'
];

const addressForm_required = [
  'addressLine1'
];

const passwordForm_required = [
   'currentPassword'
  ,'newPassword'
  ,'confirmPassword'
];

function validateRequired(required){
  let ok = true;
  for (const id of required){
    const el = document.getElementById(id);
    if (!el.value.trim()){ setErr(id, errorText[id][0]); ok = false; }
    else setErr(id,'');
  }
  return ok;
}

// live listeners
email.addEventListener('input', validateEmail);
phone.addEventListener('input', validatePhone);
newPassword.addEventListener('input', validateNewPassword);
confirmPassword.addEventListener('input', validateConfirmPassword);

for (const id of required){
  const el = document.getElementById(id);
  el.addEventListener('input', ()=> setErr(id,''));
  el.addEventListener('change', ()=> setErr(id,''));
}

contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const ok = validateRequired(contactForm_required) & validateEmail() & validatePhone();
  if (ok){
    alert('Your message has been sent.');
    contactForm.reset();
  }
});

addressForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const ok = validateRequired(addressForm_required);
  if (ok){
    alert('Your address has been updated.');
    addressForm.reset();
  }
});

passwordForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const ok = validateRequired(passwordForm_required) & validateNewPassword() & validateConfirmPassword();
  if (ok){
    alert('Your password has been updated.');
    passwordForm.reset();
  }
});


function togglePassword(id) {  
  var x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}


// expose functions to global scope
window.togglePassword = togglePassword;
