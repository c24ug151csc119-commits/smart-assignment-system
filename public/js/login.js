document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const messageEl = document.getElementById('message');

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message || 'Login failed';
      return;
    }

    // Save token and user info in browser storage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect based on role
    if (data.user.role === 'faculty') {
      window.location.href = 'faculty-dashboard.html';
    } else if (data.user.role === 'student') {
      window.location.href = 'student-dashboard.html';
    } else {
      messageEl.textContent = 'Unknown role';
    }

  } catch (error) {
    messageEl.textContent = 'Server error. Please try again.';
    console.error(error);
  }
});