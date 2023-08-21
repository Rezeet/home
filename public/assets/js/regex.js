
const disallowedDomains = [
    'gmail\\.com',
    'yahoo\\.com',
    'yahoo\\.co\\.uk',
    'yahoo\\.ca',
    'yahoo\\.de',
    'yahoo\\.fr',
    'icloud\\.com',
    'protonmail\\.com',
    'zoho\\.com',
    'yandex\\.com',
    'gmx\\.com',
    'hubspot\\.com',
    'mail\\.com',
    'tutanota\\.com',
    'mail2world\\.com',
    'juno\\.com',
    'inbox\\.com'
];

const nextBtn = document.getElementById('next');
const subBtn = document.getElementById('submitBtn');
nextBtn.disabled = true;

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');

emailInput.addEventListener('input', function () {
    const inputValue = emailInput.value.trim();
    const isValid = disallowedDomains.every(domain => !new RegExp(domain, 'i').test(inputValue));

    if (!isValid) {
        emailInput.setCustomValidity('Emails from Gmail, Yahoo, and Outlook domains are not allowed.');
        emailError.textContent = 'Only business emails address are allowed.';
        nextBtn.disabled = true;
    } else {
        emailInput.addEventListener('blur', async (event) =>  {
        const emailValue = event.target.value;
        console.log('request is not the problem')
   
        try {
            const response = await fetch(`/check-email?email=${encodeURIComponent(emailValue)}`);
            const data = await response.json();
          
            if (response.status == 200) {
              emailError.textContent = '';
              nextBtn.disabled = false;
              emailInput.setCustomValidity('');
              emailError.textContent = '';
            }
            else if (response.status == 401) {
              emailError.textContent = 'This email is already registered';
              nextBtn.disabled = true;
              emailInput.setCustomValidity('');
            } else {
              emailError.textContent = data.message;
              nextBtn.disabled = true;
            }
          } catch (error) {
            emailError.textContent = 'An error occurred while checking the email...';
            nextBtn.disabled = true;
          }
         });
    
    }
});


    const passwordEye = document.getElementById('eye');
    const passwordInput = document.getElementById('password');

    passwordEye.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });

    const passwordEye2 = document.getElementById('eye2');
    const passwordInput2 = document.getElementById('password2')
    const passwordError = document.getElementById('password-error');
    const passwordError1 = document.getElementById('password-error1');

    passwordEye2.addEventListener('click', ()=>{
        if(passwordInput2.type === 'password'){
            passwordInput2.type = 'text';
        }else{
            passwordInput2.type = 'password';
        }
    });

    passwordInput2.addEventListener('input', () => {
        subBtn.disabled = true;
        if(passwordInput2.value == passwordInput.value){
            passwordError.textContent = '';
            subBtn.disabled = false;
        }else{
            passwordError.textContent = 'Passwords do not match';
            subBtn.disabled = true;
        }
    });
    passwordInput.addEventListener('input', () => {
        const validPassword = passwordInput.value;
        if(validPassword.length >= 8){
            passwordError1.textContent = '';
            subBtn.disabled = false;
        }else{
            passwordError1.textContent = 'Passwords must be at least 8 characters';
            subBtn.disabled = true;
        }
        if(passwordInput2.value == passwordInput.value){
            passwordError.textContent = '';
            subBtn.disabled = false;
        }else{
            passwordError.textContent = 'Passwords do not match';
            subBtn.disabled = true;
        }
    });



