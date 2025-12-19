const express = require('express');
const router = express.Router();
const {
    getCommentsByModule,
    createComment,
    addReply,
    getAllComments,
    markResolved,
    confirmResolved
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/all', protect, authorize('growth_associate', 'mentor', 'admin'), getAllComments);
router.get('/:moduleId', protect, getCommentsByModule);
router.post('/', protect, createComment);
router.post('/:id/replies', protect, addReply);
router.patch('/:id/resolve', protect, authorize('growth_associate', 'mentor', 'admin'), markResolved);
router.patch('/:id/confirm', protect, confirmResolved);

module.exports = router;
