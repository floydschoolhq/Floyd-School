const Batch = require('../models/Batch');

exports.getBatches = async (req, res) => {
    try {
        const { courseId } = req.query;
        const query = courseId ? { course: courseId } : {};
        const batches = await Batch.find(query)
            .populate('instructor', 'name email')
            .populate('course', 'title');
        res.status(200).json({ success: true, batches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createBatch = async (req, res) => {
    try {
        const batch = await Batch.create(req.body);
        res.status(201).json({ success: true, batch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, batch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBatch = async (req, res) => {
    try {
        await Batch.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Batch purged from system' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
