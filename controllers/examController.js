const db = require('../config/db');

// Faculty adds exam record (with optional scanned paper)
exports.addExamRecord = (req, res) => {
  const { student_id, subject_id, exam_type, marks_obtained, max_marks } = req.body;
  const uploaded_by = req.user.user_id;
  const paper_scan_path = req.file ? req.file.path : null;

  if (!student_id || !subject_id || !exam_type || marks_obtained === undefined) {
    return res.status(400).json({ message: 'student_id, subject_id, exam_type, and marks_obtained are required' });
  }

  const sql = 'INSERT INTO exam_records (student_id, subject_id, exam_type, marks_obtained, max_marks, paper_scan_path, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [student_id, subject_id, exam_type, marks_obtained, max_marks || 100, paper_scan_path, uploaded_by], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error saving exam record', error: err.message });
    res.status(201).json({ message: 'Exam record added successfully', exam_id: result.insertId });
  });
};

// Student views their own exam records
exports.getMyExamRecords = (req, res) => {
  const student_user_id = req.user.user_id;

  db.query('SELECT student_id FROM students WHERE user_id = ?', [student_user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Student profile not found' });

    const student_id = results[0].student_id;
    db.query('SELECT * FROM exam_records WHERE student_id = ?', [student_id], (err2, results2) => {
      if (err2) return res.status(500).json({ message: 'Server error', error: err2.message });
      res.json(results2);
    });
  });
};

// Faculty views exam records for a specific student
exports.getExamRecordsByStudent = (req, res) => {
  const { student_id } = req.params;
  db.query('SELECT * FROM exam_records WHERE student_id = ?', [student_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching exam records', error: err.message });
    res.json(results);
  });
};