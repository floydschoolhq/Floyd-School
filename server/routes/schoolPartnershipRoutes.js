const express = require('express');
const router = express.Router();
const schoolPartnershipController = require('../controllers/schoolPartnershipController');

// POST /api/school-partnership/lead - Submit new partnership request
router.post('/lead', schoolPartnershipController.saveSchoolPartnershipLead);

// GET /api/school-partnership/leads - Get all leads (admin)
router.get('/leads', schoolPartnershipController.getAllSchoolPartnershipLeads);

// GET /api/school-partnership/lead/:id - Get single lead
router.get('/lead/:id', schoolPartnershipController.getSchoolPartnershipLeadById);

// PUT /api/school-partnership/lead/:id/status - Update lead status
router.put('/lead/:id/status', schoolPartnershipController.updateSchoolPartnershipLeadStatus);

// DELETE /api/school-partnership/lead/:id - Delete lead
router.delete('/lead/:id', schoolPartnershipController.deleteSchoolPartnershipLead);

// GET /api/school-partnership/stats - Get statistics
router.get('/stats', schoolPartnershipController.getSchoolPartnershipStats);

module.exports = router;