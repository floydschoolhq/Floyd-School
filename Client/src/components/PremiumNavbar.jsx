import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
// import NotificationDropdown from './common/NotificationDropdown';
import MaintenanceBanner from './MaintenanceBanner';
import api from '../api/axios';

const FALLBACK_COURSES = [
    { title: "IoT & Robotics", level: "Beginner", link: "/course" },
    { title: "Web & App Architecture", level: "Intermediate", link: "/course" },
    { title: "AI & Machine Learning", level: "Advanced", link: "/course" },
    { title: "Cybersecurity Ops", level: "Advanced", link: "/course" }
];

const PremiumNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [courses, setCourses] = useState([]);

    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        setIsScrolled(latest > 20);
    });

    // Fetch and Filter Courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Try fetching from API
                const res = await api.get('/courses');
                let data = Array.isArray(res.data) ? res.data : res.data.data || [];

                // If API returns empty, use fallback to ensure UI works for demo
                if (data.length === 0) data = FALLBACK_COURSES;

                setCourses(data);
            } catch (error) {
                console.warn("Course fetch failed, using fallback navigation data.");
                setCourses(FALLBACK_COURSES);
            }
        };

        fetchCourses();
    }, []);

    // Filter Logic
    const schoolCourses = courses.filter(c => c.level === 'Beginner' || c.level === 'Intermediate').map(c => ({ name: c.title, link: '/school-partnerships' }));
    const collegeCourses = courses.filter(c => c.level === 'Intermediate' || c.level === 'Advanced').map(c => ({ name: c.title, link: '/online-program' }));

    const handleBookSession = () => {
        if (!user) {
            navigate('/student/signup');
        } else {
            setIsModalOpen(true);
        }
    };

    // Permission Check: If user exists and is a student, check permissions. Guests see everything (Marketing).
    const canViewCourses = !user || user.role !== 'student' || user.permissions?.canAccessCourses;

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const navItems = [
        ...(canViewCourses ? [{
            name: 'Offline Programs',
            hasDropdown: true,
            subItems: schoolCourses.length > 0 ? schoolCourses : [{ name: 'Explore Offline', link: '/school-partnerships' }]
        },
        {
            name: 'Online Programs',
            hasDropdown: true,
            subItems: [
                { name: 'Enroll Now', link: '/online-program' },
                ...(collegeCourses.length > 0 ? collegeCourses : [])
            ]
        }] : []),
        { name: 'Our Programs', id: 'programs' },
        { name: 'Infrastructure', id: 'infrastructure' },
        { name: 'Support', id: 'support' },
        { name: 'How It Works', id: 'how-it-works' },
    ];

    return (
        <>
            <MaintenanceBanner />
            {/* Top Banner - Unified Marquee */}
            <motion.div
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 left-0 right-0 z-[60] h-7 flex items-center overflow-hidden bg-white border-b border-slate-100 shadow-sm"
            >
                <div className="w-full overflow-hidden relative h-full flex items-center">
                    <motion.div
                        animate={{ x: [0, -1000] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 35, // Slightly slower for better readability at smaller size
                                ease: "linear"
                            }
                        }}
                        className="flex items-center gap-24 whitespace-nowrap px-8"
                    >
                        <div className="flex items-center gap-4">
                            <Sparkles size={12} className="text-[#2563EB] animate-pulse" />
                            <span className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[8.5px]">School Bootcamps | Independent Online Mastery</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-4" />
                            <Link to="/online-program" className="text-[#2563EB] font-extrabold hover:text-blue-800 flex items-center gap-2 uppercase tracking-widest transition-colors text-[8.5px]">
                                Institutional Partnership Request
                                <ArrowRight size={12} />
                            </Link>
                        </div>

                        {/* Repeat for seamless loop */}
                        <div className="flex items-center gap-4">
                            <Sparkles size={12} className="text-[#2563EB] animate-pulse" />
                            <span className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[8.5px]">School Bootcamps | Independent Online Mastery</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mx-4" />
                            <Link to="/online-program" className="text-[#2563EB] font-extrabold hover:text-blue-800 flex items-center gap-2 uppercase tracking-widest transition-colors text-[8.5px]">
                                Institutional Partnership Request
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.nav
                className="fixed top-7 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 md:px-0"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <div
                    className={`pointer-events-auto transition-all duration-700 ease-[0.23,1,0.32,1] flex items-center justify-center
                        ${isScrolled
                            ? 'w-full md:w-[75%] lg:w-[65%] rounded-full bg-white/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(37,99,235,0.05)] border border-white/40 px-6 py-2 h-12'
                            : 'w-full rounded-none bg-white/40 backdrop-blur-2xl px-6 py-4 h-16 border-b border-slate-100'
                        }`}
                >
                    <div className="w-full max-w-7xl flex items-center justify-between">
                        {/* Logo Section */}
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                                <span className="text-white font-extrabold text-lg">TS</span>
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tighter text-slate-900 uppercase">
                                think<span className="text-[#2563EB]">skool</span>
                            </h1>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8 relative">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer flex items-center h-full">
                                    <motion.div
                                        onClick={() => item.id && scrollToSection(item.id)}
                                        className="relative flex items-center gap-1.5 text-slate-500 hover:text-blue-600 font-extrabold uppercase text-[9px] tracking-[0.15em] transition-all py-2 px-1"
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span>{item.name}</span>
                                        {item.hasDropdown && (
                                            <FaChevronDown
                                                size={8}
                                                className="mt-0.5 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-300"
                                            />
                                        )}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-blue-500 rounded-full group-hover:w-full transition-all duration-300" />
                                    </motion.div>

                                    {item.hasDropdown && (
                                        <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 scale-95 group-hover:scale-100 z-[70]">
                                            <div className="bg-white/90 backdrop-blur-3xl rounded-[1.8rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] border border-white p-2 w-52 overflow-hidden ring-1 ring-black/[0.03]">
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={sub.link}
                                                        className="block px-5 py-3 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:bg-blue-50/50 hover:text-blue-600 rounded-2xl transition-all border-l-2 border-transparent hover:border-blue-500"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={handleBookSession}
                                className="px-5 py-2.5 text-[9px] font-black text-slate-600 hover:text-blue-600 transition-all uppercase tracking-widest hover:scale-105"
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => {
                                    if (user) navigate('/student');
                                    else navigate('/student/login');
                                }}
                                className="px-6 py-2.5 text-[9px] font-black text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all uppercase tracking-[0.15em] flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Classroom
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#FBEFEF] shadow-2xl shadow-[#2563EB]/10"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="p-4 flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            if (item.id) {
                                                scrollToSection(item.id);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className="w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-700 rounded-lg hover:bg-[#FBEFEF] hover:text-[#2563EB] transition-colors flex justify-between items-center"
                                    >
                                        {item.name}
                                        {item.id ? null : (item.hasDropdown && <FaChevronDown size={12} />)}
                                    </button>
                                ))}
                                <div className="h-px bg-[#FBEFEF] my-2" />
                                <button
                                    onClick={() => navigate('/classroom')}
                                    className="w-full text-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-700 border border-[#FBEFEF] rounded-lg hover:bg-[#FCF8F8]"
                                >
                                    My Classroom
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="navbar" />
        </>
    );
};

export default PremiumNavbar;

