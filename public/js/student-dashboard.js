const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Redirect to login if not logged in or not student
if (!token || !user || user.role !== 'student') {
  window.location.href = 'login.html';
}

document.getElementById('studentName').textContent = user.name;
document.getElementById('avatarInitial').textContent = user.name.charAt(0).toUpperCase();

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
      listEl.innerHTML = '<p class="empty-state">No assignments posted yet.</p>';
      return;
    }

    data.forEach(a => {
      const div = document.createElement('div');
      div.className = 'item-card';
      div.innerHTML = `
        <h4>${a.topic}</h4>
        <p>Deadline: ${new Date(a.deadline).toLocaleDateString()}</p>
        <p>Assignment ID: ${a.assignment_id}</p>
      `;
      listEl.appendChild(div);
    });
  } catch (error) {
    console.error(error);
  }
}

// Submit assignment
document.getElementById('submitForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const assignment_id = document.getElementById('assignment_id').value;
  const fileInput = document.getElementById('file');
  const messageEl = document.getElementById('submitMessage');

  const formData = new FormData();
  formData.append('assignment_id', assignment_id);
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('/api/submissions/', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      messageEl.textContent = data.message || 'Error submitting assignment';
      messageEl.style.color = '#D33A3A';
      return;
    }

    messageEl.textContent = data.message;
    messageEl.style.color = '#1E8E5A';
    document.getElementById('submitForm').reset();

  } catch (error) {
    messageEl.textContent = 'Server error';
    console.error(error);
  }
});

// Load marks & feedback
async function loadEvaluations() {
  try {
    const response = await fetch('/api/evaluations/my', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();

    const listEl = document.getElementById('evaluationsList');
    listEl.innerHTML = '';

    if (data.length === 0) {
      listEl.innerHTML = '<p class="empty-state">No submissions evaluated yet.</p>';
      return;
    }

    data.forEach(e => {
      const div = document.createElement('div');
      const statusClass = e.status === 'late' ? 'status-late' : 'status-submitted';
      div.className = 'item-card ' + statusClass;
      const badgeClass = e.status === 'late' ? 'late' : 'submitted';
      div.innerHTML = `
        <h4>${e.topic}</h4>
        <span class="badge ${badgeClass}">${e.status}</span>
        <p>Marks: ${e.marks !== null ? e.marks : 'Not evaluated yet'}</p>
        <p>Feedback: ${e.feedback || 'No feedback yet'}</p>
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
loadEvaluations();