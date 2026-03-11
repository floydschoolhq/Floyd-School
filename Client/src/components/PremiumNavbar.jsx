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
        { name: 'Programs', id: 'online-focus' },
        { name: 'Why Us', id: 'why-us' },
        { name: 'Hackathon', id: 'hackathon' },
        { name: 'Mentors', id: 'mentors-grid' },
    ];

    return (
        <>
            <MaintenanceBanner />
            {/* Top Banner - Static */}
            <div
                className={`fixed top-0 left-0 right-0 z-[60] h-6 flex items-center justify-center ${isDarkPage ? 'bg-black border-white/10' : 'bg-white border-slate-100'} border-b shadow-sm overflow-hidden`}
            >
                <div className="flex items-center gap-8 px-8">
                    <div className="flex items-center gap-3">
                        <Sparkles size={10} className="text-slate-400" />
                        <span className={`${isDarkPage ? 'text-white/40' : 'text-slate-500'} font-medium uppercase tracking-[0.2em] text-[8px]`}>Premium Online Batches</span>
                        <div className={`w-1 h-1 rounded-full ${isDarkPage ? 'bg-white/10' : 'bg-slate-200'} mx-2`} />
                        <Link to="/online-program" className="text-slate-900 font-bold hover:text-black flex items-center gap-2 tracking-wide transition-colors text-[9px]">
                            Enroll Now
                            <ArrowRight size={10} />
                        </Link>
                    </div>
                </div>
            </div>

            <motion.nav
                className="fixed top-6 left-0 right-0 z-50 pointer-events-none flex justify-center px-4 md:px-0"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: isVisible ? 0 : -100, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <div
                    className={`pointer-events-auto transition-all duration-700 ease-[0.23,1,0.32,1] flex items-center justify-center
                        ${isScrolled
                            ? `w-full md:w-[90%] lg:w-[85%] rounded-full ${isDarkPage ? 'bg-black/90' : 'bg-white/90'} backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border ${isDarkPage ? 'border-white/20' : 'border-white/60'} ring-1 ${isDarkPage ? 'ring-white/10' : 'ring-black/[0.03]'} px-6 py-1.5 h-11`
                            : `w-full rounded-none ${isDarkPage ? 'bg-black/80' : 'bg-white/60'} backdrop-blur-2xl px-6 py-3 h-14 border-b ${isDarkPage ? 'border-white/20' : 'border-slate-200'} shadow-lg shadow-black/5`
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
                                className={isDarkPage ? '!text-white' : ''} 
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6 lg:gap-8 relative">
                            {/* Mega Menu Trigger - For ThinkSkool Learners */}
                            <div
                                className="relative group cursor-pointer flex items-center h-full"
                                onMouseEnter={() => setIsMegaMenuOpen(true)}
                                onMouseLeave={() => setIsMegaMenuOpen(false)}
                            >
                                <motion.div
                                    className={`relative flex items-center gap-2 py-2 px-4 rounded-xl transition-all duration-300 ${isMegaMenuOpen
                                        ? (isDarkPage ? 'bg-white/10 text-white' : 'bg-slate-900 text-white')
                                        : (isDarkPage ? 'text-white/90 hover:text-white' : 'text-slate-800 hover:text-black')
                                        }`}
                                >
                                    <span className="font-bold text-[13px] tracking-tight">For Students</span>
                                    <FaChevronDown
                                        size={9}
                                        className={`transition-transform duration-500 ${isMegaMenuOpen ? 'rotate-180 opacity-100' : 'opacity-40'}`}
                                    />
                                </motion.div>

                                <AnimatePresence>
                                    {isMegaMenuOpen && (
                                        <div className="absolute top-[calc(100%+0.5rem)] left-0">
                                            <LearnersMegaMenu isDarkPage={isDarkPage} />
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer flex items-center h-full">
                                    <motion.div
                                        onClick={() => item.id && scrollToSection(item.id)}
                                        className={`relative flex items-center gap-1.5 ${isDarkPage ? 'text-white/70 hover:text-white' : 'text-slate-700 hover:text-black'} font-medium text-[13px] tracking-tight transition-all py-1.5 px-0.5`}
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
                                        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] ${isDarkPage ? 'bg-slate-400' : 'bg-slate-900'} rounded-full group-hover:w-full transition-all duration-300`}></div>
                                    </motion.div>

                                    {item.hasDropdown && (
                                        <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 scale-95 group-hover:scale-100 z-[70]">
                                            <div className="bg-white/90 backdrop-blur-3xl rounded-[1.8rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] border border-white p-2 w-52 overflow-hidden ring-1 ring-black/[0.03]">
                                                {item.subItems.map((sub, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={sub.link}
                                                        className="block px-5 py-2.5 text-[12px] font-medium tracking-normal text-slate-500 hover:bg-blue-50/50 hover:text-blue-600 rounded-2xl transition-all border-l-2 border-transparent hover:border-blue-500"
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
                                onClick={handleContactClick}
                                className={`px-4 py-2 text-[13px] font-medium ${isDarkPage ? 'text-white/70 hover:text-white' : 'text-slate-700 hover:text-blue-600'} transition-all tracking-tight hover:scale-105`}
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => {
                                    if (user) navigate('/student');
                                    else navigate('/student/login');
                                }}
                                className="px-6 py-2 bg-slate-900 text-white font-bold text-[13px] rounded-full hover:bg-black transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                Portal
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
                                            if (item.id) {
                                                scrollToSection(item.id);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className={`w-full text-left px-4 py-3 text-[14px] font-medium tracking-tight ${isDarkPage ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50'} rounded-lg transition-colors flex justify-between items-center`}
                                    >
                                        {item.name}
                                        {item.id ? null : (item.hasDropdown && <FaChevronDown size={12} />)}
                                    </button>
                                ))}
                                <div className="h-px bg-[#FBEFEF] my-2" />
                                <Link
                                    to="/online-program#explore-programs"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`w-full text-left px-4 py-3 text-[14px] font-bold tracking-tight ${isDarkPage ? 'text-white/90 bg-white/5' : 'text-[#2563EB] bg-blue-50'} rounded-lg transition-colors flex justify-between items-center`}
                                >
                                    For Students
                                    <ArrowRight size={14} />
                                </Link>
                                <div className="h-px bg-[#FBEFEF] my-2" />
                                <button
                                    onClick={() => navigate('/student/login')}
                                    className="w-full text-center px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-700 border border-[#FBEFEF] rounded-lg hover:bg-[#FCF8F8]"
                                >
                                    My Portal
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

