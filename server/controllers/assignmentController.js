const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc    Get assignments (filtered by role)
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
    try {
        const { role, _id } = req.user;
        const { courseId } = req.query;
        let query = {};

        if (courseId) {
            query.course = courseId;
        }

        if (role === 'student') {
            // Fetch enrolled courses
            const courses = await Course.find({ enrolledStudents: _id }).select('_id');
            const courseIds = courses.map(c => c._id);

            // Fetch granted courses for classroom users
            const User = require('../models/User');
            const studentUser = await User.findById(_id).select('permissions.grantedCourses');
            const grantedCourseIds = studentUser?.permissions?.grantedCourses || [];

            // Combine both sets of course IDs
            const allCourseIds = [...new Set([
                ...courseIds.map(id => id.toString()),
                ...grantedCourseIds.map(id => id.toString())
            ])];

            query.course = { $in: allCourseIds };
            query.status = 'published';
        } else if (role === 'mentor') {
            // Mentors see assignments they created
            query.createdBy = _id;
        }

        const assignments = await Assignment.find(query)
            .populate('course', 'title')
            .populate('createdBy', 'name email')
            .sort({ dueDate: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error(`[AssignmentController:getAssignments] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve assignments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Create assignment
// @route   POST /api/assignments
// @access  Private (Mentor)
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, course, module, dueDate, maxPoints, attachments } = req.body;

        if (!title || !course || !dueDate) {
            return res.status(400).json({ success: false, message: 'Missing required assignment fields' });
        }

        const assignment = await Assignment.create({
            title,
            description,
            course,
            module: (module === '' || module === 'null' || !module) ? null : module,
            dueDate,
            maxPoints,
            attachments,
            createdBy: req.user._id
        });

        // Notify enrolled students
        const courseDoc = await Course.findById(course);
        const io = req.app.get('io');

        if (courseDoc?.enrolledStudents?.length > 0 && io) {
            courseDoc.enrolledStudents.forEach(studentId => {
                Notification.createAndEmit({
                    recipient: studentId,
                    type: 'assignment_created',
                    title: 'New Deployment',
                    message: `Initial technical specs published: ${title}`,
                    relatedId: assignment._id,
                    relatedModel: 'Assignment'
                }, io);
            });
        }

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        console.error(`[AssignmentController:createAssignment] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Assignment initialization failed' });
    }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
    try {
        const { content, attachments } = req.body;
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId).populate('course');
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment node not found' });
        }

        const course = await Course.findById(assignment.course._id);
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied: Navigation not authorized' });
        }

        const existingSubmission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id
        });

        if (existingSubmission) {
            return res.status(400).json({ success: false, message: 'Spec already submitted for this node' });
        }

        const submission = await Submission.create({
            assignment: assignmentId,
            student: req.user._id,
            content,
            attachments
        });

        const io = req.app.get('io');
        if (io) {
            await Notification.createAndEmit({
                recipient: assignment.createdBy,
                type: 'submission_received',
                title: 'Data Received',
                message: `New transmission for ${assignment.title} detected`,
                relatedId: submission._id,
                relatedModel: 'Submission'
            }, io);
        }

        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        console.error(`[AssignmentController:submitAssignment] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Submission transmission failed' });
    }
};

// @desc    Grade assignment
// @route   POST /api/submissions/:id/grade
// @access  Private (Mentor)
exports.gradeAssignment = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        const submissionId = req.params.id;

        const submission = await Submission.findById(submissionId).populate('assignment');
        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission record not found' });
        }

        if (submission.assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized for this operation' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedBy = req.user._id;
        submission.gradedAt = new Date();
        await submission.save();

        const io = req.app.get('io');
        if (io) {
            await Notification.createAndEmit({
                recipient: submission.student,
                type: 'assignment_graded',
                title: 'Assessment Complete',
                message: `Your technical specs for ${submission.assignment.title} have been verified`,
                relatedId: submission._id,
                relatedModel: 'Submission'
            }, io);
        }

        res.status(200).json({ success: true, data: submission });
    } catch (error) {
        console.error(`[AssignmentController:gradeAssignment] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Grading operation failed' });
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private (Mentor/Admin)
exports.getSubmissions = async (req, res) => {
    try {
        const assignmentId = req.params.id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment node not found' });
        }

        if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized for this retrieval' });
        }

        const submissions = await Submission.find({ assignment: assignmentId })
            .populate('student', 'name email')
            .sort({ submittedAt: -1 });

        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        console.error(`[AssignmentController:getSubmissions] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to retrieve transmissions' });
    }
};
// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Mentor/Admin)
exports.updateAssignment = async (req, res) => {
    try {
        let assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Check ownership
        if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this assignment' });
        }

        const updateData = { ...req.body };
        if ('module' in updateData && (updateData.module === '' || updateData.module === 'null')) {
            updateData.module = null;
        }

        assignment = await Assignment.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: assignment });
    } catch (error) {
        console.error(`[AssignmentController:updateAssignment] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to update assignment' });
    }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Mentor/Admin)
exports.deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Check ownership
        if (assignment.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this assignment' });
        }

        await assignment.deleteOne();

        res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
    } catch (error) {
        console.error(`[AssignmentController:deleteAssignment] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to delete assignment' });
    }
};

// @desc    Get assignments for a specific course
// @route   GET /api/assignments/course/:courseId
// @access  Private
exports.getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId })
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch course assignments' });
    }
};
