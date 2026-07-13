const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Redirect to login if not logged in or not faculty
if (!token || !user || user.role !== 'faculty') {
  window.location.href = 'login.html';
}

document.getElementById('facultyName').textContent = user.name;
document.getElementById('avatarInitial').textContent = user.name.charAt(0).toUpperCase();

// Post new assignment
document.getElementById('assignmentForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const subject_id = document.getElementById('subject_id').value;
  const topic = document.getElementById('topic').value;
  const deadline = document.getElementById('deadline').value;
  const messageEl = document.getElementById('assignMessage');

  const formData = new FormData();
  formData.append('subject_id', subject_id);
  formData.append('topic', topic);
  formData.append('deadline', deadline);

  try {
    const response = await fetch('/api/assignments/', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message || 'Error posting assignment';
      messageEl.style.color = '#D33A3A';
      return;
    }

    messageEl.textContent = 'Assignment posted successfully!';
    messageEl.style.color = '#1E8E5A';
    document.getElementById('assignmentForm').reset();
    loadAssignments();

  } catch (error) {
    messageEl.textContent = 'Server error';
    console.error(error);
  }
});

// Load all assignments
async function loadAssignments() {
  try {
    const response = await fetch('/api/assignments/', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();

    const listEl = document.getElementById('assignmentsList');
    listEl.innerHTML = '';

    if (data.length === 0) {
      listEl.innerHTML = '<p class="empty-state">No assignments posted yet. Create your first one above.</p>';
      return;
    }

    data.forEach(a => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <h4>${a.topic}</h4>
        <p>Deadline: ${new Date(a.deadline).toLocaleDateString()}</p>
        <p>Subject ID: ${a.subject_id} &nbsp;•&nbsp; Assignment ID: ${a.assignment_id}</p>
      `;
      listEl.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

loadAssignments();