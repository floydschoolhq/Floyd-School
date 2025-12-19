const SupportTicket = require('../models/SupportTicket');

/**
 * @desc    Create a support ticket (Student)
 * @route   POST /api/support/tickets
 * @access  Private
 */
exports.createTicket = async (req, res) => {
    try {
        const { subject, issue, priority } = req.body;

        const ticket = await SupportTicket.create({
            student: req.user.id,
            subject,
            issue,
            priority,
            messages: [{
                sender: req.user.id,
                text: issue
            }]
        });

        // Real-time notification for associates
        const io = req.app.get('io');
        if (io) {
            io.emit('support:ticket_new', ticket);
        }

        res.status(201).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all tickets (Associate/Admin)
 * @route   GET /api/support/tickets
 * @access  Private (Associate/Admin)
 */
exports.getTickets = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'student') {
            query.student = req.user.id;
        }

        const tickets = await SupportTicket.find(query)
            .populate('student', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Add message to ticket
 * @route   POST /api/support/tickets/:id/messages
 * @access  Private
 */
exports.addMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        ticket.messages.push({
            sender: req.user.id,
            text
        });

        // Auto update status if associate replies
        if (req.user.role === 'growth_associate' || req.user.role === 'admin') {
            ticket.status = 'in-progress';
            ticket.assignedTo = req.user.id;
        }

        await ticket.save();

        // Real-time message transfer
        const io = req.app.get('io');
        if (io) {
            const lastMessage = ticket.messages[ticket.messages.length - 1];
            io.emit('support:message_received', {
                ticketId: ticket._id,
                message: lastMessage,
                studentId: ticket.student
            });
        }

        res.status(200).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Close/Resolve a support ticket
 * @route   PUT /api/support/tickets/:id/close
 * @access  Private
 */
exports.closeTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Allow student (owner) or associate/admin to close
        if (ticket.student.toString() !== req.user.id && !['growth_associate', 'admin'].includes(req.user.role)) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        ticket.status = 'closed';
        await ticket.save();

        res.status(200).json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
