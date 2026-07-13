const db = require('../config/db');

// Student submits an assignment
exports.submitAssignment = (req, res) => {
  const { assignment_id } = req.body;
  const student_user_id = req.user.user_id; // from token
  const file_path = req.file ? req.file.path : null;

  if (!assignment_id || !file_path) {
    return res.status(400).json({ message: 'assignment_id and file are required' });
  }

  // First, find the student_id linked to this logged-in user
  db.query('SELECT student_id FROM students WHERE user_id = ?', [student_user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student profile not found. Contact admin.' });
    }

    const student_id = results[0].student_id;

    // Check deadline
    db.query('SELECT deadline FROM assignments WHERE assignment_id = ?', [assignment_id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Server error', error: err2.message });
      if (results2.length === 0) return res.status(404).json({ message: 'Assignment not found' });

      const deadline = new Date(results2[0].deadline);
      const now = new Date();
      const status = now > deadline ? 'late' : 'submitted';

      const sql = 'INSERT INTO submissions (assignment_id, student_id, file_path, status) VALUES (?, ?, ?, ?)';
      db.query(sql, [assignment_id, student_id, file_path, status], (err3, result) => {
        if (err3) return res.status(500).json({ message: 'Error submitting assignment', error: err3.message });
        res.status(201).json({ message: `Assignment submitted successfully (${status})`, submission_id: result.insertId });
      });
    });
  });
};

// Faculty views all submissions for a specific assignment
exports.getSubmissionsByAssignment = (req, res) => {
  const { assignment_id } = req.params;
  const sql = `
    SELECT s.submission_id, s.file_path, s.submitted_at, s.status, 
           st.roll_number, u.name AS student_name
    FROM submissions s
    JOIN students st ON s.student_id = st.student_id
    JOIN users u ON st.user_id = u.user_id
    WHERE s.assignment_id = ?
  `;
  db.query(sql, [assignment_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching submissions', error: err.message });
    res.json(results);
  });
};

// Student views their own submissions
exports.getMySubmissions = (req, res) => {
  const student_user_id = req.user.user_id;

  db.query('SELECT student_id FROM students WHERE user_id = ?', [student_user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Student profile not found' });

    const student_id = results[0].student_id;
    db.query('SELECT * FROM submissions WHERE student_id = ?', [student_id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Server error', error: err2.message });
      res.json(results2);
    });
  });
};