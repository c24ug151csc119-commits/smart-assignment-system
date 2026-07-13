const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// Student submits assignment (file required)
router.post('/', verifyToken, checkRole('student'), upload.single('file'), submissionController.submitAssignment);

// Faculty views submissions for a specific assignment
router.get('/assignment/:assignment_id', verifyToken, checkRole('faculty'), submissionController.getSubmissionsByAssignment);

// Student views their own submissions
router.get('/my', verifyToken, checkRole('student'), submissionController.getMySubmissions);

module.exports = router;