const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// Faculty adds exam record (with optional scanned paper)
router.post('/', verifyToken, checkRole('faculty'), upload.single('file'), examController.addExamRecord);

// Student views their own exam records
router.get('/my', verifyToken, checkRole('student'), examController.getMyExamRecords);

// Faculty views exam records for a specific student
router.get('/student/:student_id', verifyToken, checkRole('faculty'), examController.getExamRecordsByStudent);

module.exports = router;