import { Zap, Users, Clock, BookOpen, ShieldCheck, Target, GraduationCap, Cpu, Code, Terminal, Brain, Globe, Star, Headphones, MessageSquare, Calendar, Video, Rocket } from 'lucide-react';
import SUMMER_IMG from '../assets/images/summerimage.png';

const AI_IMG = '/images/courses/ai-course.jpg';
const IOT_IMG = '/images/courses/iot-course.jpg';
const WEB_IMG = '/images/courses/web-course.jpg';
const CYBER_IMG = '/images/courses/cyber-course.jpg';

export const FALLBACK_COURSES = [
    {
        _id: '1',
        title: "Foundation of AI and Machine Learning",
        image: AI_IMG,
        featured: true,
        icon: 'Cpu',
        description: "Learn how AI actually works and build it yourself. From Python basics to real machine learning models and computer vision. No prior experience needed.",
        detailedDescription: "Learn how AI actually works and build it yourself. From Python basics to real machine learning models and computer vision. No prior experience needed.",
        color: "#2563EB",
        rating: 4.9,
        duration: "3 month",
        price: 3999,
        currency: "INR",
        tags: ["AI", "Python", "ML"],
        live: true,
        deliveryDetails: { inSchool: { bootcamp: "7-Day Deep Dive" } },
        curriculum: [
            "Neural Network Architectures",
            "Natural Language Processing",
            "Computer Vision & GANs",
            "Reinforcement Learning"
        ],
        outcomes: [
            "Build & Deploy LLMs",
            "Optimize Inference Engines",
            "Real-time Computer Vision"
        ],
        registeredCount: 24,
        totalSeats: 50,
        prerequisites: "Basic Python knowledge suggested"
    },
    {
        _id: '2',
        title: "Foundation of Web Development",
        image: WEB_IMG,
        icon: 'Code',
        description: "Engineer high-performance full-stack applications with scalable cloud infrastructure. Architect resilient, distributed systems using modern patterns and enterprise-grade deployment pipelines.",
        detailedDescription: "Architect the modern web. Learn to build resilient, distributed systems using React, Node.js, and advanced cloud patterns used by top-tier tech companies.",
        color: "#2563EB",
        rating: 4.8,
        duration: "3 month",
        price: 1999,
        currency: "INR",
        tags: ["React", "Node", "Cloud"],
        comingSoon: true,
        deliveryDetails: { inSchool: { bootcamp: "UI/UX Mastery" } },
        curriculum: [
            "Distributed System Design",
            "High-Performance Frontend",
            "Microservices Architecture",
            "CI/CD and Cloud Ops"
        ],
        outcomes: [
            "Scalable System Design",
            "Edge Computing Mastery",
            "Full-cycle Product Launch"
        ],
        registeredCount: 10,
        totalSeats: 50,
        prerequisites: "Familiarity with JS is helpful"
    },
    {
        _id: '3',
        title: "Foundation of IoT and Robotics",
        image: IOT_IMG,
        icon: 'Terminal',
        description: "Bridge the gap between hardware and software with autonomous systems. Design, build, and program smart robotic networks from the circuit level to advanced high-level control algorithms.",
        detailedDescription: "Bridge the gap between code and physical reality. Build autonomous robots and smart IoT networks from the circuit level to high-level control algorithms.",
        color: "#2563EB",
        rating: 4.7,
        duration: "3 month",
        price: 1999,
        currency: "INR",
        tags: ["Embedded", "C++", "Sensors"],
        comingSoon: true,
        deliveryDetails: { inSchool: { bootcamp: "Hardware Lab" } },
        curriculum: [
            "Embedded C++ Programming",
            "Robotic Kinematics & ROS",
            "IoT Protocol Engineering",
            "Sensor Fusion Algorithms"
        ],
        outcomes: [
            "Build Autonomous Drones",
            "Smart City Infrastructure",
            "Industrial Robot Control"
        ],
        registeredCount: 10,
        totalSeats: 50,
        prerequisites: "Logic and math fundamentals"
    },
    {
        _id: '4',
        title: "Foundation of Cyber Security",
        image: CYBER_IMG,
        icon: 'Shield',
        description: "Become the shield of the digital world through threat analysis and zero-trust protocols. Master offensive and defensive strategies to protect industrial networks and sensitive data infrastructures.",
        detailedDescription: "Become the shield of the digital world. Master offensive and defensive security strategies, industrial network protection, and advanced threat hunting.",
        color: "#2563EB",
        rating: 4.9,
        duration: "3 month",
        price: 1999,
        currency: "INR",
        tags: ["SecOps", "Networking", "Hacking"],
        comingSoon: true,
        deliveryDetails: { inSchool: { bootcamp: "Cyber Simulation" } },
        curriculum: [
            "Ethical Hacking & Pentesting",
            "Zero Trust Architecture",
            "Cryptographic Engineering",
            "Cloud Security Protocols"
        ],
        outcomes: [
            "Incident Response Mastery",
            "Secure System Architecture",
            "Regulatory Compliance Lead"
        ],
        registeredCount: 10,
        totalSeats: 50,
        prerequisites: "Networking basics recommended"
    },
    {
        _id: '5',
        title: "ThinkSkool Summer Builder Program",
        image: SUMMER_IMG,
        icon: 'Rocket',
        description: "A high-octane 30-day summer internship. From foundations of software development to building real AI-powered applications with industry mentors.",
        detailedDescription: "A high-octane 30-day summer internship designed for students to transition from consumers to creators. Master the foundations of software development, build real-world applications, and integrate cutting-edge AI tools into your projects.",
        color: "#2563EB",
        rating: 5.0,
        duration: "1 month",
        price: 2499,
        originalPrice: 4999,
        currency: "INR",
        tags: ["Summer Internship", "Project Based", "Software", "AI"],
        live: true,
        deliveryDetails: { online: { tutor: "Live Mentorship", lectures: "Project Sessions" } },
        curriculum: [
            "Foundations of Software Development",
            "Building Real Applications",
            "AI Tool & Smart Applications",
            "Final Project & Demo Day"
        ],
        outcomes: [
            "Summer Internship Certificate",
            "Industry Ready Portfolio",
            "AI Implementation Skills"
        ],
        registeredCount: 24,
        totalSeats: 50,
        prerequisites: "No prior coding experience required"
    }
];

export const schoolBenefits = [
    { title: "Campus Elevation", desc: "Elite engineering hubs in your labs." },
    { title: "Zero Setup Cost", desc: "No infrastructure investment required." },
    { title: "Flexible Scheduling", desc: "Fits your school's academic calendar." },
    { title: "Expert Led", desc: "Industrial veterans delivering training." },
    { title: "Real-time Tracking", desc: "Performance insights for institutions." },
    { title: "Offline Impact", desc: "Hands-on in-school mastery." }
];

export const studentBenefits = [
    { title: "Self-Paced Mastery", desc: "Learn with 24/7 portal access." },
    { title: "Global Community", desc: "Connect with world-class engineers." },
    { title: "Production Portal", desc: "Build in real-world IDEs." },
    { title: "Direct Mentorship", desc: "1-on-1 support from architects." },
    { title: "Independent Portfolio", desc: "Graduate with active GitHub apps." },
    { title: "thinkskool Online Batches", desc: "High-octane online curriculum." }
];

export const supportRoles = [
    {
        title: "Adaptive Learning Systems",
        role: "Cognitive Engine",
        image: "/images/ecosystem/adaptive_learning.jpg",
        desc: "Personalized AI-driven learning paths that adapt to individual student progress.",
        benefits: ["Personalized Pace", "Gap Analysis", "Dynamic Content"],
        icon: 'Brain',
        color: "from-blue-600 to-indigo-600",
        delay: 0
    },
    {
        title: "Professional Cloud IDE",
        role: "Engineering Workspace",
        image: "/images/ecosystem/cloud_ide.jpg",
        desc: "Industry-standard cloud development environment for real-world engineering.",
        benefits: ["Zero Setup", "Cloud Power", "Collab Tools"],
        icon: 'Code',
        color: "from-blue-500 to-cyan-400",
        delay: 0.1
    },
    {
        title: "Performance Analytics Center",
        role: "Industrial Dashboard",
        image: "/images/ecosystem/performance.jpg",
        desc: "Deep insights into student technical growth and skill acquisition metrics.",
        benefits: ["Real-time Tracking", "Skill Heatmaps", "Progress Reports"],
        icon: 'Target',
        color: "from-slate-700 to-slate-900",
        delay: 0.2
    },
    {
        title: "Global Industry Network",
        role: "Professional Placement",
        image: "/images/ecosystem/networking.jpg",
        desc: "Connection to elite industrial partners and technical career opportunities.",
        benefits: ["Job Referrals", "Portfolio Review", "Exhibition Space"],
        icon: 'Globe',
        color: "from-blue-600 to-blue-800",
        delay: 0.3
    },
    {
        title: "Enterprise Security Protocols",
        role: "Data Protection",
        image: "/images/ecosystem/security.jpg",
        desc: "Advanced security training and zero-trust protocol implementation mastery.",
        benefits: ["Threat Models", "Zero Trust", "Data Privacy"],
        icon: 'ShieldCheck',
        color: "from-indigo-600 to-purple-600",
        delay: 0.4
    },
    {
        title: "Neural Mentorship Network",
        role: "AI Diagnostics",
        image: "/images/ecosystem/mentorship.jpg",
        desc: "Direct access to AI-augmented mentorship for immediate technical clearing.",
        benefits: ["Instant Doubt Clear", "Code Review", "Expert AMA"],
        icon: 'Zap',
        color: "from-slate-800 to-black",
        delay: 0.5
    }
];

export const SchoolSteps = [
    {
        title: "Strategy Scan",
        icon: 'School',
        color: "from-blue-500 to-blue-600"
    },
    {
        title: "Free Bootcamp",
        icon: 'Calendar',
        color: "from-blue-500 to-purple-600"
    },
    {
        title: "Lab Integration",
        icon: 'Cpu',
        color: "from-purple-500 to-blue-600"
    },
    {
        title: "Certification",
        icon: 'Trophy',
        color: "from-blue-500 to-[#2563EB]"
    }
];

export const StudentSteps = [
    {
        title: "Portal Access",
        icon: 'Globe',
        color: "from-cyan-500 to-blue-600"
    },
    {
        title: "Live Mentoring",
        icon: 'Video',
        color: "from-blue-500 to-blue-600"
    },
    {
        title: "Code Support",
        icon: 'MessageSquare',
        color: "from-blue-500 to-purple-600"
    },
    {
        title: "Career Launch",
        icon: 'Rocket',
        color: "from-purple-500 to-[#2563EB]"
    }
];

export const timelineSteps = [
    {
        phase: "Week 01",
        title: "Zero-Risk Spark",
        subtitle: "Free Bootcamp",
        icon: 'Zap',
        description: "Deploy expert mentors for a seven-day intensive bootcamp.",
        color: "bg-blue-500"
    },
    {
        phase: "Week 02",
        title: "Active Selection",
        subtitle: "Direct Enrollment",
        icon: 'Users',
        description: "Motivated students choose to continue their engineering journey.",
        color: "bg-purple-500"
    },
    {
        phase: "Ongoing",
        title: "Sync Integration",
        subtitle: "Zero Disruption",
        icon: 'Clock',
        description: "Classes mapped to existing periods with zero schedule overhead.",
        color: "bg-blue-500"
    },
    {
        phase: "Year Round",
        title: "Curriculum Sync",
        subtitle: "Academic Link",
        icon: 'BookOpen',
        description: "Modules aligned with school physics and math syllabus.",
        color: "bg-emerald-500"
    }
];

export const valueProps = [
    {
        icon: 'ShieldCheck',
        title: "Zero Setup Cost",
        description: "Elite innovation hubs in your labs at zero capital expenditure."
    },
    {
        icon: 'Target',
        title: "Industrial Edge",
        description: "Industry-standard engineering training that elevates school status."
    },
    {
        icon: 'GraduationCap',
        title: "Elite Portfolio",
        description: "Students graduate with active GitHub apps and industrial experience."
    }
];

export const detailedCurriculums = {
    "1": {
        roadmap: [
            {
                month: "01",
                title: "Python Fundamentals",
                phaseDescription: "The absolute baseline: build high-performance logic with world-class Python patterns.",
                color: "primary",
                weeks: [
                    { week: "Week 01", title: "Python from Scratch", description: "Variables, Datatypes and Basic Logic." },
                    { week: "Week 02", title: "Loops & Functions", description: "Automating repetitive tasks with ease." },
                    { week: "Week 03", title: "Files & Libraries", description: "Handling external data and open-source tools." },
                    { week: "Week 04", title: "Python Like a Pro", description: "Writing clean, production-level code.", isSpecial: true }
                ]
            },
            {
                month: "02",
                title: "APIs, AI & ML",
                phaseDescription: "From static code to intelligent systems: Integrating LLMs and predictive models.",
                color: "secondary",
                weeks: [
                    { week: "Week 05", title: "ChatGPT & OpenAI API", description: "Integrating LLMs into your own projects." },
                    { week: "Week 06", title: "APIs & Live Data", description: "Connecting your apps to the real world." },
                    { week: "Week 07", title: "Intro to Machine Learning", description: "Teaching computers to recognize patterns." },
                    { week: "Week 08", title: "Classification", description: "Building models that predict and group data.", isSpecial: true }
                ]
            },
            {
                month: "03",
                title: "Vision, Web & Demo",
                phaseDescription: "The Grand Finale: Give your AI 'eyes' and deploy your masterpiece to the internet.",
                color: "primary",
                weeks: [
                    { week: "Week 09", title: "OpenCV & Vision", description: "Developing apps that can see and perceive." },
                    { week: "Week 10", title: "Flask Web Framework", description: "Turning scripts into web apps that anyone can use." },
                    { week: "Final Milestone", title: "Final Project & Demo Day", description: "Intensive building followed by a live global presentation of your Face Recognition system.", isSpecial: true }
                ]
            }
        ],
        finalProject: {
            title: "Face Recognition System",
            description: "Build a live system that opens the webcam, recognises student faces in real time, logs attendance automatically with timestamps and displays everything on a web dashboard. Every part of it written and built by you.",
            videoUrl: "https://www.youtube.com/embed/BREYIm9ctQU",
            features: [
                { icon: "👤", label: "Face Recognition Engine", desc: "Detects and identifies faces live using OpenCV and Dlib." },
                { icon: "📋", label: "Live Attendance Logger", desc: "Automatically records name and timestamp instantly." },
                { icon: "🖥️", label: "Flask Web Dashboard", desc: "View and manage records from a clean browser interface." }
            ]
        }
    },
    "5": {
        roadmap: [
            {
                month: "01",
                title: "30-Day Builder Roadmap",
                phaseDescription: "A high-intensity sprint from software fundamentals to AI-powered production apps.",
                color: "primary",
                weeks: [
                    { week: "Week 01", title: "Foundations of Software Development", description: "Mastering the core logic and architecture of modern software development." },
                    { week: "Week 02", title: "Building Real Applications", description: "Transitioning from simple scripts to fully functional, interactive user applications." },
                    { week: "Week 03", title: "AI Tool & Smart Applications", description: "Integrating LLMs and AI services to build intelligent, autonomous features." },
                    { week: "Week 04", title: "Final Project Build & Demo", description: "Intensive project building followed by a professional demo day presentation.", isSpecial: true }
                ]
            }
        ],
        finalProject: {
            title: "AI Personal Assistant",
            description: "Build your own voice-activated AI personal assistant that can manage tasks, answer complex queries using GPT-4, and interact with external APIs to fetch real-world data like weather or news.",
            videoUrl: "https://www.youtube.com/embed/BREYIm9ctQU", // Placeholder video
            features: [
                { icon: "🎙️", label: "Voice Recognition", desc: "Process natural language commands in real-time." },
                { icon: "🧠", label: "GPT-4 Integration", desc: "Powered by advanced LLMs for intelligent responses." },
                { icon: "🔌", label: "API Ecosystem", desc: "Connects with weather, maps, and productivity tools." }
            ]
        }
    }
};
