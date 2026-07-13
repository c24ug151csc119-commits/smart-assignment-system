const db = require('../config/db');

// Faculty evaluates a submission
exports.evaluateSubmission = (req, res) => {
  const { submission_id, marks, feedback } = req.body;

  if (!submission_id || marks === undefined) {
    return res.status(400).json({ message: 'submission_id and marks are required' });
  }

  const sql = 'INSERT INTO evaluations (submission_id, marks, feedback) VALUES (?, ?, ?)';
  db.query(sql, [submission_id, marks, feedback || null], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error saving evaluation', error: err.message });
    res.status(201).json({ message: 'Evaluation saved successfully', evaluation_id: result.insertId });
  });
};

// Student views their marks + feedback (for their submissions)
exports.getMyEvaluations = (req, res) => {
  const student_user_id = req.user.user_id;

  const sql = `
    SELECT a.topic, sub.submitted_at, sub.status, e.marks, e.feedback
    FROM submissions sub
    JOIN students st ON sub.student_id = st.student_id
    JOIN assignments a ON sub.assignment_id = a.assignment_id
    LEFT JOIN evaluations e ON sub.submission_id = e.submission_id
    WHERE st.user_id = ?
  `;
  db.query(sql, [student_user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching evaluations', error: err.message });
    res.json(results);
  });
};