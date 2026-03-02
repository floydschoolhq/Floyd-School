import { Zap, Users, Clock, BookOpen, ShieldCheck, Target, GraduationCap, Cpu, Code, Terminal, Brain, Globe, Star, Headphones, MessageSquare, Calendar, Video, Rocket } from 'lucide-react';
import AI_IMG from '../assets/images/AI_course.png';
import IOT_IMG from '../assets/images/IOT_course.png';
import WEB_IMG from '../assets/images/WEBDEV_course.png';
import CYBER_IMG from '../assets/images/cybersecurity_course.png';

export const FALLBACK_COURSES = [
    {
        _id: '1',
        title: "AI & Machine Learning",
        image: AI_IMG,
        icon: 'Cpu',
        description: "Neural networks, predictive modeling, and deep learning.",
        color: "text-[#2563EB]",
        rating: 4.9,
        duration: "3-4 Months",
        tags: ["AI", "Python", "ML"],
        deliveryDetails: { inSchool: { bootcamp: "7-Day Deep Dive" } }
    },
    {
        _id: '2',
        title: "Web Architecture",
        image: WEB_IMG,
        icon: 'Code',
        description: "Full-stack engineering with scalable cloud infrastructure.",
        color: "text-[#2563EB]",
        rating: 4.8,
        duration: "3-4 Months",
        tags: ["React", "Node", "Cloud"],
        deliveryDetails: { inSchool: { bootcamp: "UI/UX Mastery" } }
    },
    {
        _id: '3',
        title: "IoT & Robotics",
        image: IOT_IMG,
        icon: 'Terminal',
        description: "Hardware-software integration and autonomous systems.",
        color: "text-[#2563EB]",
        rating: 4.7,
        duration: "3-4 Months",
        tags: ["Embedded", "C++", "Sensors"],
        deliveryDetails: { inSchool: { bootcamp: "Hardware Lab" } }
    },
    {
        _id: '4',
        title: "Cybersecurity Ops",
        image: CYBER_IMG,
        icon: 'Shield',
        description: "Threat analysis and zero-trust protocol mastery.",
        color: "text-[#2563EB]",
        rating: 4.9,
        duration: "3-4 Months",
        tags: ["SecOps", "Networking", "Hacking"],
        deliveryDetails: { inSchool: { bootcamp: "Cyber Simulation" } }
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
