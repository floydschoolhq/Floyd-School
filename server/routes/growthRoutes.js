const express = require('express');
const router = express.Router();
const { getAllStudents, getEscalations } = require('../controllers/growthController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('growth_associate', 'admin'));

router.get('/students', getAllStudents);
router.get('/escalations', getEscalations);

module.exports = router;
