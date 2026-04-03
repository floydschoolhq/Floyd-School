const express = require('express');
const router = express.Router();
const {
    getDoubtsByClass,
    createDoubt,
    resolveDoubt,
    getMyDoubt,
    deleteDoubt
} = require('../controllers/doubtController');
const { protect, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');

router.post('/', classroomProtect, checkPermission('canAccessCommunity'), createDoubt);
router.get('/:classId', classroomProtect, checkPermission('canAccessCommunity'), getDoubtsByClass);
router.get('/:classId/my', classroomProtect, checkPermission('canAccessCommunity'), getMyDoubt);
router.put('/:id/resolve', protect, authorize('mentor', 'admin'), resolveDoubt);
router.delete('/:id', classroomProtect, checkPermission('canAccessCommunity'), deleteDoubt);

module.exports = router;
