const express = require('express');
const router = express.Router();
const { createTicket, getTickets, addMessage, closeTicket } = require('../controllers/supportTicketController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

router.use(protect);

router.post('/tickets', createTicket);
router.get('/tickets', authorize('student', 'growth_associate', 'mentor', 'admin'), getTickets);
router.post('/tickets/:id/messages', validate(schemas.supportMessage), addMessage);
router.put('/tickets/:id/close', closeTicket);

module.exports = router;
