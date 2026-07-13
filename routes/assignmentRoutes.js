const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

// Faculty creates assignment (file optional)
router.post('/', verifyToken, checkRole('faculty'), upload.single('file'), assignmentController.createAssignment);

// Anyone logged in can view assignments
router.get('/', verifyToken, assignmentController.getAssignments);
router.get('/:id', verifyToken, assignmentController.getAssignmentById);

module.exports = router;