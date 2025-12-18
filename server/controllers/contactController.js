const { sendDemoBookingEmail } = require('../utils/emailService');

// @desc    Book a demo class
// @route   POST /api/contact/book-demo
// @access  Public
const bookDemo = async (req, res) => {
    const { name, date, email } = req.body;

    if (!name || !date) {
        return res.status(400).json({ message: 'Please provide name and date' });
    }

    try {
        // Send email notification
        await sendDemoBookingEmail({ name, date,email});

        // Emit socket event
        const io = req.app.get('io');
        io.emit('new-booking', { name, date ,email});

        res.status(200).json({ message: 'Demo booked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { bookDemo };
