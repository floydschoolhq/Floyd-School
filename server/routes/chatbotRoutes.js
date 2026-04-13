const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// POST /api/chatbot/lead - Save new chatbot lead
router.post('/lead', chatbotController.saveChatbotLead);

// GET /api/chatbot/leads - Get all chatbot leads (admin)
router.get('/leads', chatbotController.getAllChatbotLeads);

// GET /api/chatbot/lead/:id - Get single lead
router.get('/lead/:id', chatbotController.getChatbotLeadById);

// PUT /api/chatbot/lead/:id/status - Update lead status
router.put('/lead/:id/status', chatbotController.updateLeadStatus);

// DELETE /api/chatbot/lead/:id - Delete lead
router.delete('/lead/:id', chatbotController.deleteChatbotLead);

// GET /api/chatbot/stats - Get chatbot statistics
router.get('/stats', chatbotController.getChatbotStats);

module.exports = router;
