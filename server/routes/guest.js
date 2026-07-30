const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult, query } = require('express-validator');
const rateLimit = require('express-rate-limit');
const GuestDetail = require('../models/GuestDetail');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─── Rate Limiter for Guest Creation ───
const guestCreateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { message: 'Too many guest registrations from this IP. Please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// ─── Helper: Parse User-Agent ───
const parseUserAgent = (ua) => {
    if (!ua) return { device: 'Unknown', browser: 'Unknown' };

    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    let device = 'Desktop';
    if (ua.includes('Mobile')) device = 'Mobile';
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';

    return { device, browser };
};

// ─── POST /api/guest/create ─── Public (rate-limited)
router.post('/create',
    guestCreateLimiter,
    [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
        body('mobile')
            .trim()
            .notEmpty().withMessage('Mobile number is required')
            .matches(/^\d{10}$/).withMessage('Mobile must be exactly 10 digits'),
        body('class')
            .trim()
            .notEmpty().withMessage('Class is required')
            .isIn(['6', '7', '8', '9', '10', '11', '12', 'College', 'Other']).withMessage('Invalid class'),
        body('section')
            .trim()
            .notEmpty().withMessage('Section is required'),
        body('school').optional().trim(),
        body('city').optional().trim()
    ],
    async (req, res) => {
        try {
            // Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
                });
            }

            const { name, mobile, class: studentClass, section, school, city } = req.body;

            // Duplicate prevention: same mobile within 10 minutes
            const recentGuest = await GuestDetail.findOne({
                mobile,
                createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
            });

            if (recentGuest) {
                // Return existing token instead of error (better UX)
                const token = jwt.sign(
                    { id: recentGuest._id, role: 'guest', name: recentGuest.name },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                return res.json({
                    token,
                    guest: {
                        id: recentGuest._id,
                        name: recentGuest.name,
                        role: 'guest',
                        class: recentGuest.class
                    }
                });
            }

            // Parse device info
            const userAgent = req.headers['user-agent'] || '';
            const { device, browser } = parseUserAgent(userAgent);
            const ipAddress = req.ip || req.connection?.remoteAddress || '';

            // Create guest
            const guest = new GuestDetail({
                name,
                mobile,
                class: studentClass,
                section,
                school: school || '',
                city: city || '',
                ipAddress,
                device,
                browser
            });

            await guest.save();

            // Generate guest JWT (24h expiry)
            const token = jwt.sign(
                { id: guest._id, role: 'guest', name: guest.name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                token,
                guest: {
                    id: guest._id,
                    name: guest.name,
                    role: 'guest',
                    class: guest.class
                }
            });
        } catch (err) {
            console.error('Guest creation error:', err);
            res.status(500).json({ message: 'Server error creating guest' });
        }
    }
);

// ─── GET /api/guest/stats ─── Admin only
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [total, today, thisWeek, thisMonth] = await Promise.all([
            GuestDetail.countDocuments(),
            GuestDetail.countDocuments({ createdAt: { $gte: todayStart } }),
            GuestDetail.countDocuments({ createdAt: { $gte: weekStart } }),
            GuestDetail.countDocuments({ createdAt: { $gte: monthStart } })
        ]);

        res.json({ total, today, thisWeek, thisMonth });
    } catch (err) {
        console.error('Guest stats error:', err);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

// ─── GET /api/guest/export ─── Admin only (CSV)
router.get('/export', protect, adminOnly, async (req, res) => {
    try {
        const guests = await GuestDetail.find().sort({ createdAt: -1 }).lean();

        const csvHeader = 'Name,Mobile,Class,Section,School,City,Status,Device,Browser,IP Address,Created At,Last Login\n';
        const csvRows = guests.map(g =>
            `"${g.name}","${g.mobile}","${g.class}","${g.section}","${g.school || ''}","${g.city || ''}","${g.status}","${g.device || ''}","${g.browser || ''}","${g.ipAddress || ''}","${new Date(g.createdAt).toLocaleString()}","${new Date(g.lastLogin).toLocaleString()}"`
        ).join('\n');

        const csv = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=guest-details-${Date.now()}.csv`);
        res.send(csv);
    } catch (err) {
        console.error('Guest export error:', err);
        res.status(500).json({ message: 'Server error exporting guests' });
    }
});

// ─── GET /api/guest ─── Admin only (with pagination, search, filters)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            classFilter = '',
            status = '',
            startDate = '',
            endDate = ''
        } = req.query;

        const filter = {};

        // Search by name, mobile, or class
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } },
                { class: { $regex: search, $options: 'i' } }
            ];
        }

        // Class filter
        if (classFilter) {
            filter.class = classFilter;
        }

        // Status filter
        if (status) {
            filter.status = status;
        }

        // Date range filter
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [guests, total] = await Promise.all([
            GuestDetail.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            GuestDetail.countDocuments(filter)
        ]);

        res.json({
            guests,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error('Guest list error:', err);
        res.status(500).json({ message: 'Server error fetching guests' });
    }
});

// ─── GET /api/guest/:id ─── Admin only
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const guest = await GuestDetail.findById(req.params.id);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        res.json(guest);
    } catch (err) {
        console.error('Guest detail error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── PATCH /api/guest/:id ─── Admin only
router.patch('/:id', protect, adminOnly, async (req, res) => {
    try {
        const allowedUpdates = ['name', 'mobile', 'class', 'section', 'school', 'city', 'status'];
        const updates = {};

        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const guest = await GuestDetail.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        res.json(guest);
    } catch (err) {
        console.error('Guest update error:', err);
        res.status(500).json({ message: 'Server error updating guest' });
    }
});

// ─── DELETE /api/guest/:id ─── Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const guest = await GuestDetail.findByIdAndDelete(req.params.id);
        if (!guest) return res.status(404).json({ message: 'Guest not found' });
        res.json({ message: 'Guest deleted successfully' });
    } catch (err) {
        console.error('Guest delete error:', err);
        res.status(500).json({ message: 'Server error deleting guest' });
    }
});

module.exports = router;
