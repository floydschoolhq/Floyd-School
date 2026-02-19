import { Zap, Users, Clock, BookOpen, ShieldCheck, Target, GraduationCap, Cpu, Code, Terminal, Brain, Globe, Star, Headphones, MessageSquare, Calendar, Video, Rocket } from 'lucide-react';

export const FALLBACK_COURSES = [
    {
        _id: '1',
        title: "AI & Machine Learning",
        icon: 'Cpu',
        description: "Explore the frontiers of neural networks, predictive modeling, and deep learning architectures with hands-on industrial projects.",
        color: "text-[#2563EB]",
        rating: 4.9,
        duration: "6 Months",
        tags: ["Neural Networks", "Python", "Deep Learning"],
        deliveryDetails: { inSchool: { bootcamp: "7-Day Technical Deep Dive" } }
    },
    {
        _id: '2',
        title: "Web & App Architecture",
        icon: 'Code',
        description: "Master full-stack engineering, from responsive UI frameworks to scalable cloud-native backend infrastructure.",
        color: "text-[#2563EB]",
        rating: 4.8,
        duration: "6 Months",
        tags: ["React", "Node.js", "Cloud"],
        deliveryDetails: { inSchool: { bootcamp: "UI/UX Masterclass" } }
    },
    {
        _id: '3',
        title: "IoT & Robotics",
        icon: 'Terminal',
        description: "Engineer autonomous systems, hardware-software integration, and real-time distributed sensor networks.",
        color: "text-[#2563EB]",
        rating: 4.7,
        duration: "4 Months",
        tags: ["Embedded Systems", "C++", "Sensors"],
        deliveryDetails: { inSchool: { bootcamp: "Hardware Hackathon" } }
    },
    {
        _id: '4',
        title: "Cybersecurity Ops",
        icon: 'Shield',
        description: "Analyze digital threats, implement zero-trust protocols, and master ethical hacking in a controlled lab environment.",
        color: "text-[#2563EB]",
        rating: 4.9,
        duration: "5 Months",
        tags: ["Ethical Hacking", "Networks", "Security"],
        deliveryDetails: { inSchool: { bootcamp: "Red Team Simulation" } }
    }
];

export const schoolBenefits = [
    { title: "Reputation Boost", desc: "Showcases a tech-integrated vision." },
    { title: "Academic Alignment", desc: "No impact on school schedule." },
    { title: "Managed by Experts", desc: "Led by certified ThinkSkool mentors." },
    { title: "Real-time Insights", desc: "Tracking via the Smart Portal." },
    { title: "Innovation Focused", desc: "Fosters critical thinking and logic." },
    { title: "Zero Obligation", desc: "Continuation based on interest." }
];

export const studentBenefits = [
    { title: "Multi-Field Exposure", desc: "AI, IoT, and Dev immersion." },
    { title: "Hands-On Work", desc: "Project-based industrial learning." },
    { title: "Expert Mentorship", desc: "Guided by industry engineers." },
    { title: "Skill Building", desc: "Logic, creativity, and teamwork." },
    { title: "Global Certificates", desc: "Recognized industry standards." },
    { title: "Future Ready", desc: "Foundational career readiness." }
];

export const supportRoles = [
    {
        title: "Expert Mentors",
        role: "Technical Architects",
        desc: "Industrial veterans who guide you through complex engineering hurdles and code architecture.",
        benefits: ["Live Debugging", "Architecture Review", "Skill Specialization"],
        icon: 'Users',
        color: "from-slate-700 to-slate-900",
        delay: 0
    },
    {
        title: "Growth Associates",
        role: "Career Catalysts",
        desc: "Your personal success partners who ensure your learning path aligns with your professional goals.",
        benefits: ["Career Mapping", "Portfolio Design", "Industry Networking"],
        icon: 'Zap',
        color: "from-[#2563EB] to-blue-100",
        delay: 0.1
    },
    {
        title: "System Admins",
        role: "Platform Managers",
        desc: "Silent engines ensuring the cloud infrastructure and portal response remains 100% efficient.",
        benefits: ["24/7 Availability", "Resource Allocation", "System Optimization"],
        icon: 'ShieldCheck',
        color: "from-slate-600 to-slate-800",
        delay: 0.2
    }
];

export const SchoolSteps = [
    {
        title: "Strategic Consultation",
        icon: 'School',
        color: "from-blue-500 to-blue-600"
    },
    {
        title: "7-Day Free Bootcamp",
        icon: 'Calendar',
        color: "from-blue-500 to-purple-600"
    },
    {
        title: "Advanced Lab setup",
        icon: 'Cpu',
        color: "from-purple-500 to-blue-600"
    },
    {
        title: "Elite Certification",
        icon: 'Trophy',
        color: "from-blue-500 to-[#2563EB]"
    }
];

export const StudentSteps = [
    {
        title: "Portal & Path Setup",
        icon: 'Globe',
        color: "from-cyan-500 to-blue-600"
    },
    {
        title: "Premium Live Classes",
        icon: 'Video',
        color: "from-blue-500 to-blue-600"
    },
    {
        title: "Support Ops & Assignments",
        icon: 'MessageSquare',
        color: "from-blue-500 to-purple-600"
    },
    {
        title: "Impact & Career Launch",
        icon: 'Rocket',
        color: "from-purple-500 to-[#2563EB]"
    }
];

export const timelineSteps = [
    {
        phase: "Week 01",
        title: "The Zero-Risk Spark",
        subtitle: "7-Day Free Bootcamp",
        icon: 'Zap',
        description: "We deploy our expert mentors to your campus for a one-week intensive bootcamp. Every student builds a real project. No cost to the school, no commitment required.",
        color: "bg-blue-500"
    },
    {
        phase: "Week 02",
        title: "Voluntary Selection",
        subtitle: "Student-Led Enrollment",
        icon: 'Users',
        description: "Students who resonate with the engineering mindset choose to continue. We handle all parental consents and formalities. You get a cohort of genuinely motivated learners.",
        color: "bg-purple-500"
    },
    {
        phase: "Ongoing",
        title: "Seamless Integration",
        subtitle: "Zero Schedule Disruption",
        icon: 'Clock',
        description: "Our proprietary scheduling model maps classes to existing activity periods or free slots. We require ZERO extra hours from your standard academic timetable.",
        color: "bg-blue-500"
    },
    {
        phase: "Year Round",
        title: "Curriculum Sync",
        subtitle: "Academic Reinforcement",
        icon: 'BookOpen',
        description: "We align our engineering modules with your Physics and Math syllabus (CBSE/ICSE/IB), helping students visualize abstract concepts through practical application.",
        color: "bg-emerald-500"
    }
];

export const valueProps = [
    {
        icon: 'ShieldCheck',
        title: "Zero Infrastructure Cost",
        description: "We bring the technology, the platform, and the experts. Your labs become innovation hubs without a single rupee of capital expenditure."
    },
    {
        icon: 'Target',
        title: "Competitive Edge",
        description: "Differentiate your school by offering elite, industry-standard engineering training that goes far beyond standard computer science."
    },
    {
        icon: 'GraduationCap',
        title: "University Portfolio",
        description: "Our students graduate with a GitHub portfolio of deployed applications—a massive advantage for admissions in India and abroad."
    }
];
