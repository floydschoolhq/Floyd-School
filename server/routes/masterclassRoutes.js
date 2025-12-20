const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const masterclassController = require('../controllers/masterclassController');

// Public routes
router.get('/', masterclassController.getAllMasterclasses);
router.get('/:id', masterclassController.getMasterclass);

// Student routes
router.post('/:id/register', protect, masterclassController.registerStudent);
router.post('/:id/unregister', protect, masterclassController.unregisterStudent);

// Mentor/Admin routes
router.post('/', protect, authorize('mentor', 'admin'), masterclassController.createMasterclass);
router.put('/:id', protect, authorize('mentor', 'admin'), masterclassController.updateMasterclass);
router.patch('/:id/status', protect, authorize('mentor', 'admin'), masterclassController.updateStatus);
router.get('/:id/attendees', protect, authorize('mentor', 'admin'), masterclassController.getAttendees);

// Admin only
router.delete('/:id', protect, authorize('admin'), masterclassController.deleteMasterclass);

module.exports = router;
