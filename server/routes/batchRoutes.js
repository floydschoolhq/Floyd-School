const express = require('express');
const router = express.Router();
const { getBatches, createBatch, updateBatch, deleteBatch } = require('../controllers/batchController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getBatches);
router.post('/', protect, authorize('admin', 'mentor'), createBatch);
router.put('/:id', protect, authorize('admin', 'mentor'), updateBatch);
router.delete('/:id', protect, authorize('admin'), deleteBatch);

module.exports = router;
