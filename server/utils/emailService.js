const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Check if we are using placeholder credentials
    const isPlaceholder = !process.env.SMTP_EMAIL || process.env.SMTP_EMAIL === 'your_smtp_user' || process.env.SMTP_EMAIL === 'user';

    if (isPlaceholder) {
        console.log('--- EMAIL SERVICE (MOCK) ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('--- Content ---');
        console.log(options.html || options.text);
        console.log('----------------------------');
        console.log('NOTE: Real email not sent. Configure SMTP credentials in .env to enable.');
        return;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
        replyTo:options.replyTo,
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

const sendDemoBookingEmail = async (bookingDetails) => {
    const message = `
        <h1>New Demo Class Booking</h1>
        <p><strong>Name:</strong> ${bookingDetails.name}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Email:</strong> ${bookingDetails.email || 'Not provided'}</p>
    `;

    try {
        await sendEmail({
            email: process.env.ADMIN_EMAIL || 'admin@thinkskool.com',
            subject: 'New Demo Class Booking',
            html: message,
        });
        console.log('Demo booking email sent');
    } catch (error) {
        console.error('Error sending demo booking email:', error);
    }
};

module.exports = { sendEmail, sendDemoBookingEmail };