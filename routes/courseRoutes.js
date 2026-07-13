const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Courses
router.post('/courses', verifyToken, checkRole('faculty'), courseController.addCourse);
router.get('/courses', verifyToken, courseController.getCourses);

// Semesters
router.post('/semesters', verifyToken, checkRole('faculty'), courseController.addSemester);
router.get('/semesters', verifyToken, courseController.getSemesters);

// Subjects
router.post('/subjects', verifyToken, checkRole('faculty'), courseController.addSubject);
router.get('/subjects', verifyToken, courseController.getSubjects);

module.exports = router;