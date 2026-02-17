const express = require('express');
const router = express.Router();
const {
    getDoubtsByClass,
    createDoubt,
    resolveDoubt,
    getMyDoubt,
    deleteDoubt
} = require('../controllers/doubtController');
const { protect, authorize, checkPermission } = require('../middleware/authMiddleware');

router.post('/', protect, checkPermission('canAccessCommunity'), createDoubt);
router.get('/:classId', protect, checkPermission('canAccessCommunity'), getDoubtsByClass);
router.get('/:classId/my', protect, checkPermission('canAccessCommunity'), getMyDoubt);
router.put('/:id/resolve', protect, authorize('mentor', 'admin'), resolveDoubt);
router.delete('/:id', protect, checkPermission('canAccessCommunity'), deleteDoubt);

module.exports = router;
