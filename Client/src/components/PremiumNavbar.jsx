import React, { useState, useEffect, useContext, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
                ? 'w-full md:w-[90%] lg:w-[85%] rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 px-6 py-0 h-14'
                : 'w-full rounded-none bg-gradient-to-r from-slate-900/80 to-slate-800/70 backdrop-blur-md px-6 py-0 h-[68px] border-b border-white/20'
            : isScrolled
                ? 'w-full md:w-[90%] lg:w-[85%] rounded-full bg-pink-50/80 backdrop-blur-md border border-pink-200/60 px-6 py-0 h-14'
                : 'w-full rounded-none bg-gradient-to-r from-pink-50/80 to-pink-100/70 backdrop-blur-md px-6 py-0 h-[68px] border-b border-pink-200/60',
        navItem: isCoursesPage ? 'text-white/80 hover:text-white' : 'text-black/80 hover:text-black',
        underline: isCoursesPage ? 'bg-white' : 'bg-black',
        mobileMenu: isCoursesPage ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-black/70 hover:text-black hover:bg-black/5'
    };

    // Optimized scroll handler with throttling
    const lastScrollRef = useRef(0);
    const ticking = useRef(false);
    
    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const latest = window.scrollY;
                    setIsScrolled(latest > 20);
                    
                    if (latest > lastScrollRef.current && latest > 100) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                    
                    lastScrollRef.current = latest;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

        // Handle cross-page scrolling from state
        if (location.state?.scrollTo) {
            const sectionId = location.state.scrollTo;
            setTimeout(() => {
                scrollToSection(sectionId);
                // Clear state to prevent re-scroll
                window.history.replaceState({}, document.title);
            }, 500);
        }
    }, [location, scrollToSection]);

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
                        
                        {/* Enhanced Mobile Menu Panel */}
                        <motion.div
                            className={`absolute top-0 right-0 bottom-0 w-80 shadow-2xl
                                ${isCoursesPage ? 'bg-slate-900' : 'bg-white'}`}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {/* Enhanced Menu Header */}
                            <div className={`p-6 text-white relative overflow-hidden
                                ${isCoursesPage ? 'bg-gradient-to-br from-[#1a1a1a] via-slate-800 to-[#0a0a0a]' : 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900'}`}>
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">Menu</h3>
                                            <p className="text-sm opacity-80">Navigate through thinkskool</p>
                                        </div>
                                        <motion.button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-all hover:scale-110"
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaTimes size={16} />
                                        </motion.button>
                                    </div>
                                    
                                    {/* Quick Stats */}
                                    <div className="flex gap-4 text-xs">
                                        <div className="bg-white/10 px-3 py-1.5 rounded-full">
                                            <span className="opacity-80">5+ Courses</span>
                                        </div>
                                        <div className="bg-white/10 px-3 py-1.5 rounded-full">
                                            <span className="opacity-80">1000+ Students</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Enhanced Navigation Items */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4 space-y-3">
                                    {(isCourseDetailsPage ? COURSE_MOBILE_NAV_ITEMS : MOBILE_NAV_ITEMS).map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <motion.button
                                                key={item.label}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.08 }}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    if (!item.href) return;

                                                    if (item.href.startsWith('/')) {
                                                        navigate(item.href);
                                                    } else if (item.href.startsWith('#')) {
                                                        const id = item.href.substring(1);
                                                        if (isCourseDetailsPage) {
                                                            scrollToSection(id);
                                                        } else if (location.pathname !== '/') {
                                                            navigate('/', { state: { scrollTo: id } });
                                                        } else {
                                                            scrollToSection(id);
                                                        }
                                                    }
                                                }}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative overflow-hidden
                                                    ${isCoursesPage 
                                                        ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                                                        : 'bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 text-slate-900'}`}
                                            >
                                                {/* Hover Effect Background */}
                                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                                    ${isCoursesPage 
                                                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20' 
                                                        : 'bg-gradient-to-r from-blue-100/50 to-purple-100/50'}`} />
                                                
                                                {/* Icon */}
                                                <motion.div 
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 relative z-10
                                                        ${isCoursesPage 
                                                            ? 'bg-slate-700 group-hover:bg-blue-600/30 text-blue-400' 
                                                            : 'bg-blue-100 group-hover:bg-blue-200 text-blue-600'}`}
                                                    whileHover={{ rotate: 5 }}
                                                >
                                                    <Icon size={20} />
                                                </motion.div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 text-left relative z-10">
                                                    <div className={`font-semibold mb-1 ${isCoursesPage ? 'text-white' : 'text-slate-900'}`}>
                                                        {item.label}
                                                    </div>
                                                    <div className={`text-xs opacity-60 ${isCoursesPage ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        {item.href.includes('course-hero') ? 'Start here' : 
                                                         item.href.includes('curriculum') ? 'Learn more' :
                                                         item.href.includes('reviews') ? 'See feedback' :
                                                         item.href.includes('offerings') ? 'What we offer' :
                                                         item.href.includes('faculty') ? 'Meet experts' :
                                                         item.href.includes('home') ? 'Main page' :
                                                         item.href.includes('courses') ? 'Explore programs' :
                                                         item.href.includes('projects') ? 'Student work' :
                                                         item.href.includes('mentors') ? 'Guidance' :
                                                         item.href.includes('contact') ? 'Get in touch' : 'Navigate'}
                                                    </div>
                                                </div>
                                                
                                                {/* Arrow */}
                                                <motion.div 
                                                    className={`transition-all group-hover:translate-x-1 relative z-10
                                                        ${isCoursesPage ? 'text-slate-400' : 'text-slate-600'}`}
                                                    whileHover={{ scale: 1.2 }}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M9 18l6-6-6-6" />
                                                    </svg>
                                                </motion.div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                
                                {/* Enhanced CTA Section */}
                                <div className={`p-4 border-t ${isCoursesPage ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <div className="space-y-3">
                                        {/* Sign In Button */}
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                to="/student/login"
                                                onClick={() => {
                                                    navigate('/student/login');
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={`w-full py-4 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border relative overflow-hidden group
                                                    ${isCoursesPage 
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-500/30' 
                                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-white/10'}`}
                                            >
                                                {/* Button Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                                
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                                                    </svg>
                                                    Sign In
                                                </span>
                                            </Link>
                                        </motion.div>
                                        
                                        {/* Quick Links */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    navigate('/school-partnerships');
                                                }}
                                                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all
                                                    ${isCoursesPage 
                                                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                            >
                                                Partner with Us
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    handleContactClick();
                                                }}
                                                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all
                                                    ${isCoursesPage 
                                                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                            >
                                                Request Callback
                                            </motion.button>
                                        </div>
                                    </div>
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
