
document.addEventListener('DOMContentLoaded', function () {
  const registrationForm = document.getElementById('registrationForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const emailInput = document.getElementById('email');

  registrationForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      const confirmPassword = confirmPasswordInput.value.trim();
      const email = emailInput.value.trim();


      if (!username || !password || !confirmPassword || !email) {
        throw new Error('Please fill out all required fields.');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      await registerUser(username, password, email);

  
      const registrationEvent = new Event('userRegistered');
      document.dispatchEvent(registrationEvent);


      showAlert('User registered successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'login-page.html';
      }, 2000);
    } catch (error) {

      showAlert('Error registering user: ' + error.message, 'danger');
    }
  });

  async function registerUser(username, password, email) {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    const userData = await response.json();

    localStorage.setItem('sessionToken', userData.sessionToken);
  }

  function showAlert(message, category = 'success') {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', `alert-${category}`, 'alert-dismissible', 'fade', 'show');
    alertBox.setAttribute('role', 'alert');
    alertBox.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertPlaceholder.appendChild(alertBox);
  }
});
