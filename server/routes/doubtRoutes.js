const express = require('express');
const router = express.Router();
const {
    getDoubtsByClass,
    createDoubt,
    resolveDoubt,
    getMyDoubt,
    deleteDoubt
} = require('../controllers/doubtController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createDoubt);
router.get('/:classId', protect, getDoubtsByClass);
router.get('/:classId/my', protect, getMyDoubt);
router.put('/:id/resolve', protect, authorize('mentor', 'admin'), resolveDoubt);
router.delete('/:id', protect, deleteDoubt);

module.exports = router;
