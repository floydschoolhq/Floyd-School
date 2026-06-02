const Course = require('../models/Course');
const Notification = require('../models/Notification');

// Get all courses (filtered by role)
exports.getCourses = async (req, res) => {
    try {
        let courses;

        // If user is not authenticated, return all active courses (public view)
        if (!req.user) {
            courses = await Course.find({ isActive: true, status: 'published' })
                .populate('instructor', 'name email')
                .select('-__v');
            return res.json(courses);
        }

        const { role, _id } = req.user;

        if (role === 'student') {
            // Fetch the student's granted course list
            const User = require('../models/User');
            const studentUser = await User.findById(_id).select('permissions.grantedCourses');
            const grantedIds = studentUser?.permissions?.grantedCourses || [];

            if (grantedIds.length === 0) {
                // No courses granted → return empty list
                return res.json([]);
            }

            // Only return the explicitly granted courses
            const rawCourses = await Course.find({
                _id: { $in: grantedIds },
                isActive: true,
                status: 'published'
            })
                .populate('instructor', 'name email')
                .select('-__v');

            // Fetch and inject personalized student progress
            const UserProgress = require('../models/UserProgress');
            const progresses = await UserProgress.find({ student: _id, course: { $in: grantedIds } });
            const progressMap = new Map();
            progresses.forEach(p => {
                if (p && p.course) {
                    progressMap.set(p.course.toString(), (p.completedModules || []).map(m => m.toString()));
                }
            });

            courses = rawCourses.map(c => {
                const courseObj = c.toObject();
                const completedList = progressMap.get(courseObj._id.toString()) || [];
                if (courseObj.modules && Array.isArray(courseObj.modules)) {
                    courseObj.modules = courseObj.modules.map(m => ({
                        ...m,
                        completed: completedList.includes(m._id.toString())
                    }));
                }
                return courseObj;
            });
        } else if (role === 'mentor') {
            // Mentors see their own courses
            courses = await Course.find({ instructor: _id })
                .populate('enrolledStudents', 'name email')
                .select('-__v');
        } else {
            // Admins see all courses with aggregated revenue
            const Course = require('../models/Course');
            const Enrollment = require('../models/Enrollment');
            
            const rawCourses = await Course.find()
                .populate('instructor', 'name email')
                .populate('enrolledStudents', 'name email')
                .select('-__v');

            // Aggregate revenue for each course
            courses = await Promise.all(rawCourses.map(async (c) => {
                const aggregations = await Enrollment.aggregate([
                    { $match: { course: c._id, paymentStatus: 'completed' } },
                    { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
                ]);
                
                const courseObj = c.toObject();
                courseObj.totalRevenue = aggregations[0]?.totalRevenue || 0;
                return courseObj;
            }));
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

        const courseObj = course.toObject();

        // Inject personalized progress for students
        if (req.user && req.user.role === 'student') {
            const UserProgress = require('../models/UserProgress');
            const progress = await UserProgress.findOne({ student: req.user._id, course: course._id });
            const completedList = progress ? (progress.completedModules || []).map(m => m.toString()) : [];
            if (courseObj.modules && Array.isArray(courseObj.modules)) {
                courseObj.modules = courseObj.modules.map(m => ({
                    ...m,
                    completed: completedList.includes(m._id.toString())
                }));
            }
        }

        res.json(courseObj);
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
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        // Create update object from body
        const updateData = { ...req.body };

        // Protect critical fields: mentors cannot approve their own courses
        // or change the instructor assignment
        if (req.user.role !== 'admin') {
            delete updateData.status;
            delete updateData.instructor;
            delete updateData.isActive;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            updateData,
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

// Delete course (mentor/admin only)
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is instructor or admin
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        // Production Safety: Block deletion if students are enrolled
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            return res.status(400).json({
                message: 'Cannot decommission course node with active learners. Please migrate or offboard students first.'
            });
        }

        await course.deleteOne();
        res.json({ message: 'Course node decommissioned successfully' });
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

// Update course modules (curriculum)
exports.updateModules = async (req, res) => {
    try {
        const { modules } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is instructor, mentor or admin
        const isInstructor = course.instructor && course.instructor.toString() === (req.user._id || req.user.id).toString();

        if (!isInstructor && req.user.role !== 'mentor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this course curriculum' });
        }

        course.modules = modules;
        await course.save();

        res.json({ message: 'Curriculum updated successfully', modules: course.modules });
    } catch (error) {
        console.error('Curriculum Sync Error:', error);
        res.status(500).json({
            message: 'Server failed to synchronize curriculum',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get roster of all students enrolled in mentor's courses
exports.getMentorRoster = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user._id })
            .populate('enrolledStudents', 'name email createdAt');

        // Consolidate students and map to courses
        const studentMap = new Map();

        courses.forEach(course => {
            course.enrolledStudents.forEach(student => {
                const studentId = student._id.toString();
                if (!studentMap.has(studentId)) {
                    studentMap.set(studentId, {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        joinedAt: student.createdAt,
                        courses: []
                    });
                }
                studentMap.get(studentId).courses.push({
                    _id: course._id,
                    title: course.title
                });
            });
        });

        const roster = Array.from(studentMap.values());
        res.json(roster);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a course-wide announcement
exports.createAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message } = req.body;

        const course = await Course.findById(id).populate('enrolledStudents');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Auth check
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const io = req.app.get('io');
        const notifications = [];

        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            for (const student of course.enrolledStudents) {
                const notification = await Notification.createAndEmit({
                    recipient: student._id,
                    type: 'general',
                    title: `Announcement: ${course.title}`,
                    message: `${title}: ${message}`,
                    relatedId: course._id,
                    relatedModel: 'Course'
                }, io);
                notifications.push(notification);
            }
        }

        res.json({ message: `Announcement sent to ${notifications.length} students` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update course enrollment stats (admin/mentor)
exports.updateEnrollmentStats = async (req, res) => {
    try {
        const { totalSeats, manualEnrollmentCount, price, originalPrice } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Auth check - handled by middleware but added here for double safety
        if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (totalSeats !== undefined) course.totalSeats = totalSeats;
        if (manualEnrollmentCount !== undefined) course.manualEnrollmentCount = manualEnrollmentCount;
        if (price !== undefined) course.price = price;
        if (originalPrice !== undefined) course.originalPrice = originalPrice;

        await course.save();

        res.json({
            message: 'Enrollment statistics updated successfully',
            course: {
                _id: course._id,
                totalSeats: course.totalSeats,
                manualEnrollmentCount: course.manualEnrollmentCount,
                price: course.price,
                originalPrice: course.originalPrice
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};// Get public enrollment stats for marketing site
exports.getPublicCourseStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Known MongoDB ObjectIds for hardcoded frontend course IDs
        const courseIdMap = {
            '1': '69ff38141cad938780ccdbeb',
            '2': '69ff38141cad938780ccdbec',
            '3': '69ff38141cad938780ccdbed',
            '4': '69ff38141cad938780ccdbee',
            '5': '69ff38141cad938780ccdbef'
        };

        const courseTitlePatterns = {
            '1': 'foundation of ai|artificial intelligence|machine learning|ai.*ml',
            '2': 'foundation of web|web dev|full stack|development',
            '3': 'foundation of iot|robotics|internet of things',
            '4': 'foundation of cyber|cyber security|ethical hacking',
            '5': 'summer builder program|bootcamp'
        };

        let course = null;

        if (courseIdMap[id]) {
            // Try direct ObjectId first
            try {
                course = await Course.findById(courseIdMap[id]).select('totalSeats manualEnrollmentCount enrolledStudents title price originalPrice status isActive');
            } catch (e) { /* fall through */ }
            // Regex fallback
            if (!course && courseTitlePatterns[id]) {
                course = await Course.findOne({ title: { $regex: courseTitlePatterns[id], $options: 'i' } })
                    .select('totalSeats manualEnrollmentCount enrolledStudents title price originalPrice status isActive');
            }
        } else if (id.length > 20) {
            course = await Course.findById(id).select('totalSeats manualEnrollmentCount enrolledStudents title price originalPrice status isActive');
        } else {
            course = await Course.findOne({ title: { $regex: id, $options: 'i' } })
                .select('totalSeats manualEnrollmentCount enrolledStudents title price originalPrice status isActive');
        }
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.json({
            success: true,
            totalSeats: course.totalSeats || 50,
            manualEnrollmentCount: course.manualEnrollmentCount || 0,
            autoEnrollmentCount: Array.isArray(course.enrolledStudents) ? course.enrolledStudents.length : 0,
            title: course.title,
            price: course.price,
            originalPrice: course.originalPrice,
            status: course.status,
            isActive: course.isActive
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// Toggle student course module completion state
exports.toggleModuleComplete = async (req, res) => {
    try {
        const { id: courseId, moduleId } = req.params;
        const studentId = req.user._id;

        // Check if student has access to course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Verify module exists in course
        const moduleExists = course.modules.some(m => m._id.toString() === moduleId.toString());
        if (!moduleExists) {
            return res.status(404).json({ message: 'Module not found in this course' });
        }

        const UserProgress = require('../models/UserProgress');
        let progress = await UserProgress.findOne({ student: studentId, course: courseId });

        if (!progress) {
            progress = new UserProgress({
                student: studentId,
                course: courseId,
                completedModules: []
            });
        }

        const index = progress.completedModules.indexOf(moduleId);
        if (index > -1) {
            // Toggle off: remove completed module
            progress.completedModules.splice(index, 1);
        } else {
            // Toggle on: check if module has any video, study notes, or assignments
            const Assignment = require('../models/Assignment');
            const linkedAssignment = await Assignment.findOne({ course: courseId, module: moduleId });
            const targetModule = course.modules.find(m => m._id.toString() === moduleId.toString());
            
            const hasVideo = targetModule && targetModule.videoUrl && targetModule.videoUrl.trim() !== '';
            const hasNotes = targetModule && targetModule.notesUrl && targetModule.notesUrl.trim() !== '';
            const hasAssignment = !!linkedAssignment;

            if (!hasVideo && !hasNotes && !hasAssignment) {
                return res.status(400).json({ 
                    message: 'Cannot mark as complete: This module has no videos, study notes, or assignments yet.' 
                });
            }

            progress.completedModules.push(moduleId);
        }

        await progress.save();

        res.json({
            message: 'Module completion state synchronized',
            completedModules: progress.completedModules
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server failed to toggle module completion',
            error: error.message
        });
    }
};


