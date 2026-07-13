const db = require('../config/db');

// Add a new course
exports.addCourse = (req, res) => {
  const { course_name } = req.body;
  if (!course_name) {
    return res.status(400).json({ message: 'Course name is required' });
  }
  const sql = 'INSERT INTO courses (course_name) VALUES (?)';
  db.query(sql, [course_name], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding course', error: err.message });
    res.status(201).json({ message: 'Course added successfully', course_id: result.insertId });
  });
};

// Get all courses
exports.getCourses = (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching courses', error: err.message });
    res.json(results);
  });
};

// Add a semester
exports.addSemester = (req, res) => {
  const { course_id, semester_number, year } = req.body;
  if (!course_id || !semester_number || !year) {
    return res.status(400).json({ message: 'course_id, semester_number, and year are required' });
  }
  const sql = 'INSERT INTO semesters (course_id, semester_number, year) VALUES (?, ?, ?)';
  db.query(sql, [course_id, semester_number, year], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding semester', error: err.message });
    res.status(201).json({ message: 'Semester added successfully', semester_id: result.insertId });
  });
};

// Get all semesters
exports.getSemesters = (req, res) => {
  db.query('SELECT * FROM semesters', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching semesters', error: err.message });
    res.json(results);
  });
};

// Add a subject
exports.addSubject = (req, res) => {
  const { subject_name, semester_id, faculty_id } = req.body;
  if (!subject_name || !semester_id || !faculty_id) {
    return res.status(400).json({ message: 'subject_name, semester_id, and faculty_id are required' });
  }
  const sql = 'INSERT INTO subjects (subject_name, semester_id, faculty_id) VALUES (?, ?, ?)';
  db.query(sql, [subject_name, semester_id, faculty_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding subject', error: err.message });
    res.status(201).json({ message: 'Subject added successfully', subject_id: result.insertId });
  });
};

// Get all subjects
exports.getSubjects = (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching subjects', error: err.message });
    res.json(results);
  });
};
