const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Course = require('./models/Course');
const Mentor = require('./models/Mentor');
const Masterclass = require('./models/Masterclass');
const WhyUs = require('./models/WhyUs');
const User = require('./models/User'); // Assuming User model exists for instructor reference
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedCourses = [
    {
        title: "Artificial Intelligence & ML",
        description: "Master the future with deep learning, neural networks, and real-world AI applications. Build your own AI models from scratch.",
        category: "AI",
        icon: "Brain",
        color: "text-orange-500",
        rating: "4.9",
        duration: "12 Weeks",
        tags: ["Python", "TensorFlow", "Deep Learning"],
        difficulty: "Advanced"
    },
    {
        title: "Full Stack Web Development",
        description: "Become a complete developer. Learn React, Node.js, and modern database technologies to build scalable web applications.",
        category: "Web Development",
        icon: "Globe",
        color: "text-slate-900",
        rating: "4.8",
        duration: "24 Weeks",
        tags: ["MERN Stack", "DevOps", "System Design"],
        difficulty: "Intermediate"
    },
    {
        title: "Cybersecurity & Ethical Hacking",
        description: "Protect the digital world. Learn penetration testing, network security, and cryptography from industry experts.",
        category: "Other",
        icon: "Shield",
        color: "text-black",
        rating: "4.9",
        duration: "16 Weeks",
        tags: ["Network Security", "Ethical Hacking", "Cryptography"],
        difficulty: "Advanced"
    },
    {
        title: "IoT & Robotics Masterclass",
        description: "Bridge the physical and digital worlds. Design, build, and program your own smart devices and robots.",
        category: "Robotics",
        icon: "Cpu",
        color: "text-orange-600",
        rating: "4.7",
        duration: "12 Weeks",
        tags: ["Arduino", "Raspberry Pi", "Sensors"],
        difficulty: "Beginner"
    }
];

const seedMentors = [
    {
        name: "Priya Sharma",
        role: "Senior Data Scientist",
        company: "Google",
        companyIcon: "Google",
        bio: "AI Researcher with 8+ years exp.",
        image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Rahul Verma",
        role: "Product Manager",
        company: "Microsoft",
        companyIcon: "Microsoft",
        bio: "ex-IIT Bombay, leading Azure teams.",
        image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Amit Patel",
        role: "SDE III",
        company: "Amazon",
        companyIcon: "Amazon",
        bio: "Expert in Distributed Systems.",
        image: "https://randomuser.me/api/portraits/men/86.jpg"
    },
    {
        name: "Neha Gupta",
        role: "Tech Lead",
        company: "Swiggy",
        companyIcon: "Globe",
        bio: "Building scalable backend systems.",
        image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
];

const seedMasterclasses = [
    {
        title: "System Design for Scale",
        instructor: "Ankit Singh",
        role: "Principal Engineer, Uber",
        date: new Date("2024-03-20"),
        time: "7:00 PM",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        tags: ["Architecture", "Backend"],
        students: 1200
    },
    {
        title: "Intro to GenAI",
        instructor: "Maya Reddy",
        role: "AI Researcher, DeepMind",
        date: new Date("2024-03-25"),
        time: "5:00 PM",
        image: "https://randomuser.me/api/portraits/women/35.jpg",
        tags: ["AI", "Future Tech"],
        students: 850
    },
    {
        title: "Product Management 101",
        instructor: "David Chen",
        role: "PM, Cred",
        date: new Date("2024-03-28"),
        time: "6:00 PM",
        image: "https://randomuser.me/api/portraits/men/22.jpg",
        tags: ["Product", "Strategy"],
        students: 600
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('MongoDB connected...');

        // Clear existing courses
        await Course.deleteMany({});
        console.log('Courses cleared');

        // Find or create a default instructor
        let instructor = await User.findOne({ role: 'mentor' });
        if (!instructor) {
            // Check if User model has role or if we need to mock it. 
            // If User schema is simple, let's just create a dummy ID or skip instructor requirement check if possible?
            // Course schema requires instructor: ObjectId.
            // Let's see if we can create a dummy user.
            instructor = await User.create({
                name: "Instructor Bot",
                email: "instructor@thinkskool.com",
                password: "password123",
                role: "mentor" // Validate if 'role' field exists in User schema, otherwise this might fail silently or error
            });
            console.log('Created dummy instructor');
        }

        const coursesWithInstructor = seedCourses.map(course => ({
            ...course,
            instructor: instructor._id
        }));

        await Course.insertMany(coursesWithInstructor);
        console.log('Courses seeded successfully!');

        // Seed Mentors
        await Mentor.deleteMany({});
        await Mentor.insertMany(seedMentors);
        console.log('Mentors seeded successfully!');

        // Seed Masterclasses
        await Masterclass.deleteMany({});
        await Masterclass.insertMany(seedMasterclasses);
        console.log('Masterclasses seeded successfully!');

        // Seed Why Us
        await WhyUs.deleteMany({});
        await WhyUs.create(seedWhyUs);
        console.log('Why Us section seeded successfully!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
