const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Faculty evaluates a submission
router.post('/', verifyToken, checkRole('faculty'), evaluationController.evaluateSubmission);

// Student views their own marks + feedback
router.get('/my', verifyToken, checkRole('student'), evaluationController.getMyEvaluations);

module.exports = router;