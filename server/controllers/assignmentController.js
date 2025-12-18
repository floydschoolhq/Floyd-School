const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// Get assignments (filtered by role)
exports.getAssignments = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const { courseId } = req.query;
        let query = {};

        if (courseId) {
            query.course = courseId;
        }

        if (role === 'student') {
            // Students see published assignments for their enrolled courses
            const courses = await Course.find({ enrolledStudents: _id }).select('_id');
            const courseIds = courses.map(c => c._id);
            query.course = { $in: courseIds };
            query.status = 'published';
        } else if (role === 'mentor') {
            // Mentors see assignments they created
            query.createdBy = _id;
        }

        const assignments = await Assignment.find(query)
            .populate('course', 'title')
            .populate('createdBy', 'name email')
            .sort({ dueDate: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create assignment (mentor only)
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, course, dueDate, maxPoints, attachments } = req.body;

        const assignment = await Assignment.create({
            title,
            description,
            course,
            dueDate,
            maxPoints,
            attachments,
            createdBy: req.user._id
        });

        // Get enrolled students and notify them
        const courseDoc = await Course.findById(course);
        const io = req.app.get('io');

        if (courseDoc && io && courseDoc.enrolledStudents && courseDoc.enrolledStudents.length > 0) {
            courseDoc.enrolledStudents.forEach(studentId => {
                Notification.createAndEmit({
                    recipient: studentId,
                    type: 'assignment_created',
                    title: 'New Assignment',
                    message: `New assignment: ${title}`,
                    relatedId: assignment._id,
                    relatedModel: 'Assignment'
                }, io);
            });
        }

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Submit assignment (student only)
exports.submitAssignment = async (req, res) => {
    try {
        const { content, attachments } = req.body;
        const assignmentId = req.params.id;

        // Check if assignment exists
        const assignment = await Assignment.findById(assignmentId).populate('course');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if student is enrolled in the course
        const course = await Course.findById(assignment.course._id);
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
        }

        // Check if already submitted
        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id
        });

        if (existingSubmission) {
            return res.status(400).json({ message: 'Assignment already submitted' });
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            content,
            attachments
        });

        // Notify mentor
        const io = req.app.get('io');
        if (io) {
            await Notification.createAndEmit({
                recipient: assignment.createdBy,
                type: 'submission_received',
                title: 'New Submission',
                message: `New submission for ${assignment.title}`,
                relatedId: submission._id,
                relatedModel: 'Submission'
            }, io);
        }

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Grade assignment (mentor only)
exports.gradeAssignment = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submissionId = req.params.id;

        const submission = await Submission.findById(submissionId)
            .populate('assignment');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check if user created the assignment
        if (submission.assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to grade this submission' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedBy = req.user._id;
        submission.gradedAt = new Date();
        await submission.save();

        // Notify student
        const io = req.app.get('io');
        if (io) {
            await Notification.createAndEmit({
                recipient: submission.student,
                type: 'assignment_graded',
                title: 'Assignment Graded',
                message: `Your submission for ${submission.assignment.title} has been graded`,
                relatedId: submission._id,
                relatedModel: 'Submission'
            }, io);
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get submissions for an assignment (mentor only)
exports.getSubmissions = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if user created the assignment
        if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'school-admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate('student', 'name email')
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
