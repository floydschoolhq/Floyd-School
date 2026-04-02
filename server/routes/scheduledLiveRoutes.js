const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    uploadVideo,
    createScheduledLiveFromEmbed,
    createScheduledLive,
    getAllScheduledLives,
    getUpcomingScheduledLives,
    getScheduledLiveById,
    updateScheduledLive,
    deleteScheduledLive,
    startLiveNow,
    endLive
} = require('../controllers/scheduledLiveController');
const { protect, authorize, checkPermission } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/videos');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const videoFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
};

const upload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024
    },
    fileFilter: videoFilter
});

router.use(protect);
router.use(checkMaintenance('scheduledLive'));

router.post('/upload', protect, authorize('mentor', 'admin'), upload.single('video'), uploadVideo);

router.post('/from-embed', protect, authorize('mentor', 'admin'), createScheduledLiveFromEmbed);

router.post('/', protect, authorize('mentor', 'admin'), createScheduledLive);

router.get('/', protect, getAllScheduledLives);

router.get('/upcoming', protect, checkPermission('canAccessClassroom'), getUpcomingScheduledLives);

router.get('/:id', protect, checkPermission('canAccessClassroom'), getScheduledLiveById);

router.put('/:id', protect, authorize('mentor', 'admin'), updateScheduledLive);

router.delete('/:id', protect, authorize('mentor', 'admin'), deleteScheduledLive);

router.put('/:id/start', protect, authorize('mentor', 'admin'), startLiveNow);

router.put('/:id/end', protect, authorize('mentor', 'admin'), endLive);

module.exports = router;