document.addEventListener('DOMContentLoaded', function () {
  const headerContainer = document.getElementById('header-placeholder');

  function checkLoggedInUser() {
    const sessionToken = localStorage.getItem('sessionToken');
    const username = localStorage.getItem('username');

    if (sessionToken && username) {
      renderLoggedInHeader(username);
    } else {
      renderLoggedOutHeader();
    }
  }

  function renderLoggedInHeader(username) {
    headerContainer.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="#">Task Manager</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <button id="profile-button" class="btn btn-outline-light">${username}</button>
              </li>
              <li class="nav-item">
                <button id="logout-button" class="btn btn-outline-light">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    const profileButton = document.getElementById('profile-button');
    profileButton.addEventListener('click', redirectToUserProfile);

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', logoutUser);

    const taskListButton = document.getElementById('task-list-button');
    taskListButton.addEventListener('click', function(event) {

      event.preventDefault();

      const sessionToken = localStorage.getItem('sessionToken');

      if (!sessionToken) {
        alert('Você não está logado. Por favor, faça o login para acessar a lista de tarefas.');
      } else {
        window.location.href = '/html/task-list.html';
      }
    });

  }

  function renderLoggedOutHeader() {
    headerContainer.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" href="#">Task Manager</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <button id="login-button" class="btn btn-outline-light">Login</button>
              </li>
              <li class="nav-item">
                <button id="register-button" class="btn btn-outline-light">Register</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', redirectToLoginPage);

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', redirectToRegisterPage);

    const taskListButton = document.getElementById('task-list-button');
    taskListButton.disabled = true;
    taskListButton.addEventListener('click', showLoginAlert);
  }

  function redirectToLoginPage() {
    window.location.href = 'login-page.html';
  }

  function redirectToRegisterPage() {
    window.location.href = 'user-registration.html';
  }

  function redirectToUserProfile() {
    window.location.href = 'user-profile.html';
  }

  function logoutUser() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('username');
    window.location.href = 'landing-page.html';
  }

  function showLoginAlert() {
    alert('Você precisa estar logado para acessar a lista de tarefas.');
  }

  checkLoggedInUser();
  document.addEventListener('userRegistered', checkLoggedInUser);
});