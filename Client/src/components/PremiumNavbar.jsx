import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import NotificationDropdown from './common/NotificationDropdown';
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

    const navItems = [
        ...(canViewCourses ? [{
            name: 'Offline Batches',
            hasDropdown: true,
            subItems: schoolCourses.length > 0 ? schoolCourses : [{ name: 'Explore Batches', link: '/school-partnerships' }]
        },
        {
            name: 'Online Programs',
            hasDropdown: true,
            subItems: collegeCourses.length > 0 ? collegeCourses : [{ name: 'Explore Online', link: '/online-program' }]
        }] : []),
    ];

    return (
        <>
            <MaintenanceBanner />
            {/* Top Banner - Tech Expert Call to Action - Now Opaque */}
            <motion.div
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed top-0 left-0 right-0 z-[60] bg-[#FCF8F8] border-b border-[#FBEFEF] h-8 flex items-center overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-4 text-[9px] font-['Outfit']">
                    <div className="flex items-center gap-3">
                        <Sparkles size={14} className="text-[#2563EB] animate-pulse" />
                        <span className="text-slate-500 font-black uppercase tracking-[0.4em]">School Bootcamps | Independent Online Mastery</span>
                    </div>
                    <Link to="/online-program" className="text-[#2563EB] font-black hover:text-blue-800 flex items-center gap-2 uppercase tracking-widest transition-colors">
                        Institutional Partnership
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </motion.div>

            <motion.nav
                className={`fixed top-8 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[#FBEFEF] py-1.5'
                    : 'bg-[#FCF8F8]/90 backdrop-blur-md border-b border-[#FBEFEF] py-3'
                    }`}
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">

                        {/* Logo Section */}
                        <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            {/* Simple Logo Icon */}
                            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">
                                <span className="text-white font-black text-xl font-['Outfit']">TS</span>
                            </div>

                            {/* Logo Text */}
                            <h1 className="text-2xl font-black tracking-tighter text-slate-900 font-['Outfit'] uppercase">
                                think<span className="text-[#2563EB]">skool</span>
                            </h1>
                        </div>

                        {/* Desktop Navigation - Clean & Simple */}
                        <div className="hidden md:flex items-center gap-10">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer h-14 flex items-center">
                                    <div className="flex items-center gap-2 text-slate-600 group-hover:text-[#2563EB] font-black uppercase text-[10px] tracking-[0.3em] transition-all font-['Outfit']">
                                        <span>{item.name}</span>
                                        {item.hasDropdown && <FaChevronDown size={10} className="mt-0.5 group-hover:rotate-180 transition-transform duration-300" />}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {item.hasDropdown && (
                                        <div className="absolute top-16 left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                            <div className="bg-white/98 backdrop-blur-md rounded-[1.5rem] shadow-lg border border-[#FBEFEF] py-4 w-56 overflow-hidden">
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={sub.link}
                                                        className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-[#FCF8F8] hover:text-[#2563EB] transition-all border-l-4 border-transparent hover:border-[#2563EB] font-['Outfit']"
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
                        <div className="hidden md:flex items-center gap-6">
                            <NotificationDropdown />
                            <button
                                onClick={handleBookSession}
                                className="px-5 py-2.5 text-[10px] font-black text-slate-700 bg-white border border-[#FBEFEF] rounded-xl hover:bg-[#FCF8F8] hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:-translate-y-0.5 transition-all uppercase tracking-widest font-['Outfit']"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => {
                                    if (user) {
                                        navigate('/student');
                                    } else {
                                        navigate('/student/login');
                                    }
                                }}
                                className="px-6 py-2.5 text-[10px] font-black text-white bg-[#2563EB] rounded-xl hover:bg-blue-700 transition-all uppercase tracking-widest font-['Outfit'] flex items-center gap-2 shadow-md shadow-blue-500/20"
                            >
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                Control Panel
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#FBEFEF] shadow-2xl shadow-[#2563EB]/10"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="p-4 flex flex-col gap-2 font-['Outfit']">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 rounded-lg hover:bg-[#FBEFEF] hover:text-[#2563EB] transition-colors flex justify-between items-center"
                                    >
                                        {item.name}
                                        {item.hasDropdown && <FaChevronDown size={12} />}
                                    </button>
                                ))}
                                <div className="h-px bg-[#FBEFEF] my-2" />
                                <button
                                    onClick={() => navigate('/classroom')}
                                    className="w-full text-center px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 border border-[#FBEFEF] rounded-lg hover:bg-[#FCF8F8]"
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
