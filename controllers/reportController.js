const db = require('../config/db');

// Submission report for a specific assignment
exports.getAssignmentReport = (req, res) => {
  const { assignment_id } = req.params;

  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM submissions WHERE assignment_id = ?) AS total_submitted,
      (SELECT COUNT(*) FROM submissions WHERE assignment_id = ? AND status = 'late') AS late_submissions,
      (SELECT AVG(e.marks) FROM evaluations e JOIN submissions s ON e.submission_id = s.submission_id WHERE s.assignment_id = ?) AS average_marks
  `;
  db.query(sql, [assignment_id, assignment_id, assignment_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error generating report', error: err.message });
    res.json(results[0]);
  });
};

// Compare assignment marks vs exam marks for a student (your transparency feature)
exports.getPerformanceComparison = (req, res) => {
  const { student_id } = req.params;

  const sql = `
    SELECT 
      (SELECT AVG(e.marks) FROM evaluations e 
       JOIN submissions s ON e.submission_id = s.submission_id 
       WHERE s.student_id = ?) AS avg_assignment_marks,
      (SELECT AVG(marks_obtained) FROM exam_records WHERE student_id = ?) AS avg_exam_marks
  `;
  db.query(sql, [student_id, student_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error generating report', error: err.message });
    res.json(results[0]);
  });
};