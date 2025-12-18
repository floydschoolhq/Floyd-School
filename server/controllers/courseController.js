const Course = require('../models/Course');
const Notification = require('../models/Notification');

// Get all courses (filtered by role)
exports.getCourses = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let courses;

        if (role === 'student') {
            // Students see courses they're enrolled in or can enroll
            courses = await Course.find({ isActive: true })
                .populate('instructor', 'name email')
                .select('-__v');
        } else if (role === 'mentor') {
            // Mentors see their own courses
            courses = await Course.find({ instructor: _id })
                .populate('enrolledStudents', 'name email')
                .select('-__v');
        } else {
            // Admins see all courses
            courses = await Course.find()
                .populate('instructor', 'name email')
                .populate('enrolledStudents', 'name email')
                .select('-__v');
        }

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name email')
            .populate('enrolledStudents', 'name email');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new course (mentor/admin only)
exports.createCourse = async (req, res) => {
    try {
        const { title, description, modules, category, difficulty, duration } = req.body;

        const course = await Course.create({
            title,
            description,
            modules,
            category,
            difficulty,
            duration,
            instructor: req.user._id
        });

        // Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            io.emit('course:created', course);
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'school-admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Notify enrolled students
        const io = req.app.get('io');
        if (io && course.enrolledStudents && course.enrolledStudents.length > 0) {
            course.enrolledStudents.forEach(studentId => {
                Notification.createAndEmit({
                    recipient: studentId,
                    type: 'course_updated',
                    title: 'Course Updated',
                    message: `${course.title} has been updated`,
                    relatedId: course._id,
                    relatedModel: 'Course'
                }, io);
            });
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete course (admin only)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.deleteOne();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Enroll student in course
exports.enrollStudent = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.enrollStudent(req.user._id);

        const io = req.app.get('io');

        // Create notification
        await Notification.createAndEmit({
            recipient: req.user._id,
            type: 'course_enrolled',
            title: 'Enrollment Successful',
            message: `You have been enrolled in ${course.title}`,
            relatedId: course._id,
            relatedModel: 'Course'
        }, io);

        // Notify instructor
        await Notification.createAndEmit({
            recipient: course.instructor,
            type: 'general',
            title: 'New Enrollment',
            message: `A student has enrolled in ${course.title}`,
            relatedId: course._id,
            relatedModel: 'Course'
        }, io);

        res.json({ message: 'Enrolled successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
