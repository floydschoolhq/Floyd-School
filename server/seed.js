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
        title: "AI & Machine Learning",
        description: "Master the future with deep learning, neural networks, and real-world AI applications. Build your own AI models from scratch.",
        category: "AI",
        icon: "Brain",
        color: "text-purple-500",
        rating: "4.9",
        duration: "12 Weeks",
        price: 3999,
        currency: "INR",
        tags: ["Python", "TensorFlow", "Generative AI"],
        difficulty: "Advanced",
        deliveryDetails: {
            inSchool: {
                bootcamp: "7 Days intensive bootcamp",
                postBootcamp: "Join our paid subscription for regular in-depth training"
            },
            online: {
                tutor: "1:1 dedicated tutor for doubt clearing",
                lectures: "Live and recorded interactive video lectures",
                chatSupport: "24/7 After class chat support with mentors",
                reporting: "Weekly comprehensive progress reports and PTM"
            }
        }
    },
    {
        title: "Cyber Security",
        description: "Protect the digital world. Learn penetration testing, network security, and cryptography from industry experts.",
        category: "Other",
        icon: "Shield",
        color: "text-blue-500",
        rating: "4.8",
        duration: "16 Weeks",
        price: 10,
        currency: "INR",
        tags: ["Hacking", "NetSec", "Linux"],
        difficulty: "Advanced",
        deliveryDetails: {
            inSchool: {
                bootcamp: "7 Days security bootcamp",
                postBootcamp: "Enroll in the full certification program"
            },
            online: {
                tutor: "Expert mentor for personalized guidance",
                lectures: "Hands-on virtual lab sessions",
                chatSupport: "Slack/Discord community for 24/7 help",
                reporting: "Performance analytics and regular feedback"
            }
        }
    },
    {
        title: "IoT & Robotics",
        description: "Bridge the physical and digital worlds. Design, build, and program your own smart devices and robots.",
        category: "Robotics",
        icon: "Cpu",
        color: "text-emerald-500",
        rating: "4.7",
        duration: "12 Weeks",
        price: 10,
        currency: "INR",
        tags: ["Arduino", "Raspberry Pi", "Sensors"],
        difficulty: "Intermediate",
        deliveryDetails: {
            inSchool: {
                bootcamp: "7 Days hardware-focused bootcamp",
                postBootcamp: "Advanced robotics lab access with subscription"
            },
            online: {
                tutor: "Project-based 1:1 support",
                lectures: "Step-by-step hardware assembly guides",
                chatSupport: "Integrated technical support system",
                reporting: "Milestone-based progress tracking"
            }
        }
    },
    {
        title: "Development (Web/App)",
        description: "Stay ahead in a digital-first world. Learn React, Node.js, and mobile app frameworks to build the next big thing.",
        category: "Web Development",
        icon: "Globe",
        color: "text-slate-600",
        rating: "4.9",
        duration: "20 Weeks",
        price: 10,
        currency: "INR",
        tags: ["React/Next.js", "App Dev", "Cloud"],
        difficulty: "Intermediate",
        deliveryDetails: {
            inSchool: {
                bootcamp: "7 Days coding sprint",
                postBootcamp: "Real-world project development phase"
            },
            online: {
                tutor: "Senior dev for code reviews",
                lectures: "Intensive architecture deep-dives",
                chatSupport: "Direct dev channel access",
                reporting: "Career readiness and code quality reports"
            }
        }
    },
    {
        title: "Floyd School Summer Builder Program",
        description: "A high-octane 30-day summer internship. From foundations of software development to building real AI-powered applications with industry mentors.",
        category: "Summer Program",
        icon: "Rocket",
        color: "text-blue-600",
        rating: "5.0",
        duration: "1 Month",
        price: 2499,
        originalPrice: 4999,
        currency: "INR",
        tags: ["Summer Internship", "Project Based", "Software", "AI"],
        difficulty: "Beginner",
        deliveryDetails: {
            inSchool: {
                bootcamp: "30 Days Intensive Summer Program",
                postBootcamp: "Project showcase and certification"
            },
            online: {
                tutor: "Live Mentorship & Doubt Clearing",
                lectures: "Project-focused Interactive Sessions",
                chatSupport: "Dedicated Support Channel",
                reporting: "Weekly Milestone Assessments"
            }
        }
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
        description: "Learn how to build systems that handle millions of requests per second.",
        instructorName: "Ankit Singh",
        instructorRole: "Principal Engineer, Uber",
        scheduledDate: new Date("2024-03-20"),
        startTime: "7:00 PM",
        endTime: "9:00 PM",
        meetingLink: "https://zoom.us/j/system-design",
        instructorImage: "https://randomuser.me/api/portraits/men/45.jpg",
        tags: ["Architecture", "Backend"],
        students: 1200
    },
    {
        title: "Intro to GenAI",
        description: "Deep dive into Generative AI and its real-world applications.",
        instructorName: "Maya Reddy",
        instructorRole: "AI Researcher, DeepMind",
        scheduledDate: new Date("2024-03-25"),
        startTime: "5:00 PM",
        endTime: "7:00 PM",
        meetingLink: "https://zoom.us/j/gen-ai",
        instructorImage: "https://randomuser.me/api/portraits/women/35.jpg",
        tags: ["AI", "Future Tech"],
        students: 850
    },
    {
        title: "Product Management 101",
        description: "Master the basics of product strategy and life cycle management.",
        instructorName: "David Chen",
        instructorRole: "PM, Cred",
        scheduledDate: new Date("2024-03-28"),
        startTime: "6:00 PM",
        endTime: "8:00 PM",
        meetingLink: "https://zoom.us/j/pm-101",
        instructorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        tags: ["Product", "Strategy"],
        students: 600
    }
];

const seedWhyUs = {
    mainTitle: "WHY US",
    video: {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        speakerName: "Our Mentors",
        speakerRole: "Floyd School Visionary",
        caption: "Join the revolution in student learning and tech empowerment."
    },
    features: [
        { title: "Expert Mentorship", icon: "Users", color: "text-blue-500" },
        { title: "Project Based Learning", icon: "BookOpen", color: "text-orange-500" },
        { title: "Industry Recognition", icon: "Award", color: "text-emerald-500" }
    ]
};

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
                email: "instructor@floydschool.com",
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
        const masterclassesWithInstructor = seedMasterclasses.map(mc => ({
            ...mc,
            instructor: instructor._id
        }));
        await Masterclass.insertMany(masterclassesWithInstructor);
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
