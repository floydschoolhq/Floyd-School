import React, { useState, useEffect, useContext, useCallback, memo } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaGraduationCap, FaUsers, FaPhone, FaBook, FaUserTie, FaBullseye } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
import MaintenanceBanner from './MaintenanceBanner';
import api from '../api/axios';
import BrandLogo from './common/BrandLogo';

const FALLBACK_COURSES = [
    { title: "IoT & Robotics", level: "Beginner", link: "/online-program#explore-programs" },
    { title: "Web & App Architecture", level: "Intermediate", link: "/online-program#explore-programs" },
    { title: "AI & Machine Learning", level: "Advanced", link: "/online-program#explore-programs" },
    { title: "Cybersecurity Ops", level: "Advanced", link: "/online-program#explore-programs" }
];

const MOBILE_NAV_ITEMS = [
    { icon: FaHome, label: "Home", href: "#hero" },
    { icon: FaGraduationCap, label: "Courses", href: "#online-focus" },
    { icon: FaBook, label: "Projects", href: "#student-projects" },
    { icon: FaUsers, label: "Mentors", href: "#mentors-grid" },
    { icon: FaPhone, label: "Contact", href: "#contact" }
];

// Course-specific navigation items
const COURSE_NAV_ITEMS = [
    { name: 'Overview', id: 'course-hero' },
    { name: 'Curriculum', id: 'course-curriculum' },
    { name: 'Reviews', id: 'course-reviews' },
    { name: 'Offerings', id: 'course-offerings' },
    { name: 'Faculty', id: 'course-faculty' }
];

const COURSE_MOBILE_NAV_ITEMS = [
    { icon: FaBook, label: "Overview", href: "#course-hero" },
    { icon: FaGraduationCap, label: "Curriculum", href: "#course-curriculum" },
    { icon: FaUsers, label: "Reviews", href: "#course-reviews" },
    { icon: FaBullseye, label: "Offerings", href: "#course-offerings" },
    { icon: FaUserTie, label: "Faculty", href: "#course-faculty" }
];

const PremiumNavbar = memo(({ variant }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [source, setSource] = useState('navbar');
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [courses, setCourses] = useState([]);
    const location = useLocation();

    // Optimized theme detection - single string check
    const isCoursesPage = location.pathname.includes('course') || 
                         location.pathname === '/online-program';
    
    // Check if we're on a specific course details page
    const isCourseDetailsPage = location.pathname.includes('/course/') && 
                                location.pathname.split('/').length > 2;

    // Optimized event handlers - defined before use
    const handleContactClick = useCallback(() => {
        setSource('navbar');
        setIsModalOpen(true);
    }, []);

    const scrollToSection = useCallback((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Pre-computed navigation items with proper routing
    const navItems = isCourseDetailsPage ? COURSE_NAV_ITEMS : [
        { name: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Courses', id: 'online-focus' },
        { name: 'Partner with Us', link: '/school-partnerships' },
        { name: 'Request Callback', action: handleContactClick },
    ];

    // Pre-computed styles - cached to prevent recalculation
    const styles = {
        navbar: isCoursesPage 
            ? isScrolled 
                ? 'w-full md:w-[90%] lg:w-[85%] rounded-full bg-slate-900/60 backdrop-blur-3xl border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.3)] px-6 py-0 h-14'
                : 'w-full rounded-none bg-gradient-to-r from-slate-900/60 to-slate-800/50 backdrop-blur-3xl px-6 py-0 h-[68px] border-b border-white/20'
            : isScrolled
                ? 'w-full md:w-[90%] lg:w-[85%] rounded-full bg-pink-50/60 backdrop-blur-3xl border border-pink-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.15)] px-6 py-0 h-14'
                : 'w-full rounded-none bg-gradient-to-r from-pink-50/60 to-pink-100/50 backdrop-blur-3xl px-6 py-0 h-[68px] border-b border-pink-200/60',
        navItem: isCoursesPage ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black',
        underline: isCoursesPage ? 'bg-white' : 'bg-black',
        mobileMenu: isCoursesPage ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/70 hover:text-black hover:bg-black/5'
    };

    // Optimized scroll handler with throttling and direction detection
    const [lastScrollY, setLastScrollY] = useState(0);
    
    const handleScroll = useCallback((latest) => {
        setIsScrolled(latest > 20);
        
        // Show/hide based on scroll direction
        if (latest > lastScrollY && latest > 100) {
            // Scrolling down - hide navbar
            setIsVisible(false);
        } else {
            // Scrolling up - show navbar
            setIsVisible(true);
        }
        
        setLastScrollY(latest);
    }, [lastScrollY]);

    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, "change", handleScroll);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get('/courses');
                let data = Array.isArray(res.data) ? res.data : res.data.data || [];
                if (data.length === 0) data = FALLBACK_COURSES;
                setCourses(data);
            } catch {
                setCourses(FALLBACK_COURSES);
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <MaintenanceBanner />

            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 md:px-0"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <div
                    className={`pointer-events-auto transition-all duration-700 ease-out flex items-center justify-center ${styles.navbar}`}
                >
                    <div className="w-full max-w-7xl flex items-center justify-between">

                        {/* Logo */}
                        <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <BrandLogo
                                size="md"
                                theme="dark"
                                shine={true}
                                showTagline={!isScrolled}
                                scrolled={isScrolled}
                            />
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-2 relative h-full">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer flex items-center">
                                    {item.link ? (
                                        <Link
                                            to={item.link}
                                            className={`relative flex flex-col items-start gap-1.5 font-semibold text-[15px] tracking-wide transition-colors duration-200 py-2 px-3 ${styles.navItem}`}
                                        >
                                            {item.name}
                                            {/* Underline */}
                                            <span className={`absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${styles.underline}`} />
                                        </Link>
                                    ) : (
                                        <motion.div
                                            onClick={() => {
                                                if (item.action) item.action();
                                                else if (item.id) scrollToSection(item.id);
                                            }}
                                            className={`relative flex flex-col items-start font-semibold text-[15px] tracking-wide transition-colors duration-200 py-2 px-3 cursor-pointer ${styles.navItem}`}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {item.name}
                                            {/* Underline */}
                                            <span className={`absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full ${styles.underline}`} />
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right CTA */}
                        <div className="hidden md:flex items-center">
                            <Link
                                to="/student/login"
                                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/10"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Sign In
                                    <FaUserTie className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </Link>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className={`md:hidden p-2 rounded-xl transition-colors ${styles.mobileMenu}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* Modern Mobile Menu Panel */}
                        <motion.div
                            className={`absolute top-0 right-0 bottom-0 w-80 shadow-2xl
                                ${isCoursesPage ? 'bg-slate-900' : 'bg-white'}`}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {/* Menu Header */}
                            <div className={`p-6 text-white
                                ${isCoursesPage ? 'bg-gradient-to-r from-[#1a1a1a] to-[#0a0a0a]' : 'bg-gradient-to-r from-blue-900 via-black to-blue-800'}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold">Menu</h3>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                                <p className="text-sm opacity-90">Navigate through thinkskool</p>
                            </div>
                            
                            {/* Navigation Items */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-2">
                                    {(isCourseDetailsPage ? COURSE_MOBILE_NAV_ITEMS : MOBILE_NAV_ITEMS).map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.button
                                                key={item.label}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => {
                                                    if (item.href) {
                                                        // Smooth scroll to section
                                                        const element = document.querySelector(item.href);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth' });
                                                        }
                                                    }
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 rounded-xl transition-all group"
                                            >
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                    <Icon className="text-blue-600" size={18} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-semibold text-slate-900">{item.label}</div>
                                                </div>
                                                <div className="text-slate-400">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                
                                {/* CTA Section */}
                                <div className="p-4 border-t border-slate-200">
                                    <Link
                                        to="/student/login"
                                        onClick={() => {
                                            navigate('/student/login');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/10 group"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Sign In
                                            <FaUserTie className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source={source} />
        </>
    );
});

PremiumNavbar.displayName = 'PremiumNavbar';

export default PremiumNavbar;
