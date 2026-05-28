const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');

// ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────
// Anyone can submit forms publicly.
router.post('/school-lead', hackathonController.saveSchoolLead);
router.post('/participant-lead', hackathonController.saveParticipantLead);

// ─── ADMIN GOVERNANCE ENDPOINTS ───────────────────────────────────
// These will be protected using JWT & admin security middleware.
router.get('/school-leads', hackathonController.getSchoolLeads);
router.get('/participant-leads', hackathonController.getParticipantLeads);
router.put('/school-lead/:id/status', hackathonController.updateSchoolLeadStatus);
router.put('/participant-lead/:id/status', hackathonController.updateParticipantLeadStatus);
router.delete('/school-lead/:id', hackathonController.deleteSchoolLead);
router.delete('/participant-lead/:id', hackathonController.deleteParticipantLead);
router.get('/stats', hackathonController.getHackathonStats);

module.exports = router;
