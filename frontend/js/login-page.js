document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginMessage = document.getElementById('login-message');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();


      if (!username || !password) {
        throw new Error('Please enter both username and password.');
      }

      const userData = await loginUser(username, password);


      localStorage.setItem('sessionToken', userData.user.sessionToken);
      localStorage.setItem('username', userData.user.username);


      showAlert('Login successful!', 'success');

      setTimeout(() => {
        window.location.href = 'landing-page.html';
      }, 2000);
    } catch (error) {

      showAlert('Error logging in: ' + error.message, 'danger');
    }
  });

  async function loginUser(username, password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }

    return await response.json();
  }

  function showAlert(message, category = 'danger') {
    loginMessage.className = `alert alert-${category}`;
    loginMessage.textContent = message;
    loginMessage.style.display = 'block';
  }



});
