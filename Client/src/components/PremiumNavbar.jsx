import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';
// import NotificationDropdown from './common/NotificationDropdown';
import MaintenanceBanner from './MaintenanceBanner';
import api from '../api/axios';
import BrandLogo from './common/BrandLogo';
import LearnersMegaMenu from './LearnersMegaMenu';

const FALLBACK_COURSES = [
    { title: "IoT & Robotics", level: "Beginner", link: "/online-program#explore-programs" },
    { title: "Web & App Architecture", level: "Intermediate", link: "/online-program#explore-programs" },
    { title: "AI & Machine Learning", level: "Advanced", link: "/online-program#explore-programs" },
    { title: "Cybersecurity Ops", level: "Advanced", link: "/online-program#explore-programs" }
];

const PremiumNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [source, setSource] = useState('navbar');
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [courses, setCourses] = useState([]);
    const location = useLocation();
    const isDarkPage = location.pathname === '/student/login';

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



    const handleBookSession = () => {
        if (!user) {
            navigate('/student/login');
        } else {
            setSource('briefing');
            setIsModalOpen(true);
        }
    };

    const handleContactClick = () => {
        setSource('contact');
        setIsModalOpen(true);
    };



    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'auto' });
        } else {
            navigate('/');
            // Extended delay to ensure the Home page components are mounted
            setTimeout(() => {
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'auto' });
                }
            }, 300);
        }
    };

    const navItems = [
        { name: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Courses', id: 'online-focus' },
        { name: 'Partner with us', link: '/school-partnerships' },
        { name: 'Request Callback', action: handleContactClick, highlight: true },
    ];

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
                    className={`pointer-events-auto transition-all duration-700 ease-[0.23,1,0.32,1] flex items-center justify-center
                        ${isScrolled
                            ? `w-full md:w-[90%] lg:w-[85%] rounded-full ${isDarkPage ? 'bg-black/90' : 'bg-white/95'} backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border ${isDarkPage ? 'border-white/20' : 'border-slate-100'} ring-1 ${isDarkPage ? 'ring-white/10' : 'ring-black/[0.01]'} px-6 py-1.5 h-16`
                            : `w-full rounded-none ${isDarkPage ? 'bg-black/80' : 'bg-white'} backdrop-blur-none px-6 py-4 h-20 border-b ${isDarkPage ? 'border-white/20' : 'border-slate-100'} shadow-none`
                        }`}
                >
                    <div className="w-full max-w-7xl flex items-center justify-between">
                         <div
                            className="flex items-center cursor-pointer group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <BrandLogo 
                                size="md" 
                                theme="brand"
                                shine={true}
                                showTagline={true}
                                scrolled={isScrolled}
                                className={isDarkPage ? '!text-white' : ''} 
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8 lg:gap-12 relative h-full">

                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer flex items-center">
                                    {item.link ? (
                                        <Link
                                            to={item.link}
                                            className={`relative flex items-center gap-1.5 ${isDarkPage ? 'text-white/70 hover:text-white' : 'text-slate-800 hover:text-black'} font-bold text-[16px] tracking-tight transition-all py-1.5 px-0.5`}
                                        >
                                            <span>{item.name}</span>
                                        </Link>
                                    ) : (
                                        <motion.div
                                            onClick={() => {
                                                if (item.action) item.action();
                                                else if (item.id) scrollToSection(item.id);
                                            }}
                                            className={`relative flex items-center gap-1.5 ${isDarkPage ? 'text-white/70 hover:text-white' : 'text-slate-800 hover:text-black'} font-bold text-[16px] tracking-tight transition-all py-1.5 px-0.5`}
                                            whileHover={{ y: -1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{item.name}</span>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center">
                            <button
                                onClick={() => navigate('/student/login')}
                                className="px-12 py-2.5 bg-[#F97316] text-white font-black text-[17px] rounded-xl hover:bg-[#EA580C] transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-2 ${isDarkPage ? 'text-white' : 'text-slate-600'} rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md`}
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
                            className={`absolute top-20 left-0 right-0 ${isDarkPage ? 'bg-black/98 border-white/10' : 'bg-white/95 border-slate-100'} backdrop-blur-md border-b shadow-2xl ${isDarkPage ? 'shadow-black' : 'shadow-blue-500/10'}`}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="p-4 flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            if (item.action) {
                                                item.action();
                                                setIsMobileMenuOpen(false);
                                            } else if (item.link) {
                                                navigate(item.link);
                                                setIsMobileMenuOpen(false);
                                            } else if (item.id) {
                                                scrollToSection(item.id);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className={`w-full text-left px-4 py-3 text-[14px] font-bold tracking-tight ${isDarkPage ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'} rounded-lg transition-colors flex justify-between items-center`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <button
                                    onClick={() => {
                                        navigate('/student/login');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full text-center px-4 py-3 text-[13px] font-bold text-white bg-[#F97316] rounded-xl hover:bg-[#EA580C] shadow-lg shadow-orange-500/10"
                                >
                                    Sign In
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source={source} />
        </>
    );
};

export default PremiumNavbar;

