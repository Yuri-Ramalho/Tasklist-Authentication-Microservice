document.addEventListener('DOMContentLoaded', function () {
  const resetPasswordForm = document.getElementById('resetPasswordForm');
  const emailInput = document.getElementById('email');
  const resetAlert = document.getElementById('resetAlert');

  resetPasswordForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      const email = emailInput.value.trim();


      if (!email) {
        throw new Error('Please enter your email address.');
      }

      await resetPassword(email);


      showAlert('Password reset email sent successfully!', 'success');
    } catch (error) {

      showAlert('Error sending password reset email: ' + error.message, 'danger');
    }
  });

  async function resetPassword(email) {
    const response = await fetch('/api/users/requestPasswordReset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {

      throw new Error('Failed to reset password.');
    }


    return true;
  }

  function showAlert(message, category = 'success') {

    resetAlert.innerHTML = `
      <div class="alert alert-${category}" role="alert">
        ${message}
      </div>
    `;
    resetAlert.style.display = 'block';
  }
});