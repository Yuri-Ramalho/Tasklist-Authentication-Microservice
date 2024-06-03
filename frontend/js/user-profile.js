
document.addEventListener('DOMContentLoaded', async function () {
  const usernameField = document.getElementById('username');
  const emailField = document.getElementById('email');
  const profileAlert = document.getElementById('profileAlert');


  const sessionToken = localStorage.getItem('sessionToken');


  if (!sessionToken) {
    window.location.href = 'login-page.html';
    return;
  }

  async function fetchUserProfile() {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        headers: {
          'x-parse-session-token': sessionToken,
        },
      });

      if (response.ok) {
        const userProfile = await response.json();
        usernameField.textContent = userProfile.username;
        emailField.textContent = userProfile.email;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user profile.');
      }
    } catch (error) {
      showAlert(error.message, 'danger');
    }
  }

  function showAlert(message, category) {
    profileAlert.innerHTML = `
      <div class="alert alert-${category} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  fetchUserProfile();
});
