const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/assignment/:assignment_id', verifyToken, checkRole('faculty'), reportController.getAssignmentReport);
router.get('/performance/:student_id', verifyToken, checkRole('faculty'), reportController.getPerformanceComparison);

module.exports = router;