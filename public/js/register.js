document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  const department = document.getElementById('department').value;
  const rollOrStaffId = document.getElementById('rollOrStaffId').value;
  const collegeName = document.getElementById('collegeName').value;
  const course_id = document.getElementById('course_id').value;
  const semester_id = document.getElementById('semester_id').value;
  const messageEl = document.getElementById('message');

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, email, password, role, department,
        rollOrStaffId, collegeName, course_id, semester_id
      })
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message || 'Registration failed';
      messageEl.style.color = 'red';
      return;
    }

    messageEl.textContent = 'Registration successful! Redirecting to login...';
    messageEl.style.color = 'green';

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);

  } catch (error) {
    messageEl.textContent = 'Server error. Please try again.';
    console.error(error);
  }
});