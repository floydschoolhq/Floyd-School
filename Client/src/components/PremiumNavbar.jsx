import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
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

const PremiumNavbar = ({ variant }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [source, setSource] = useState('navbar');
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);
    const [courses, setCourses] = useState([]);
    const location = useLocation();

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
            setTimeout(() => {
                const target = document.getElementById(id);
                if (target) target.scrollIntoView({ behavior: 'auto' });
            }, 300);
        }
    };

    const navItems = [
        { name: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { name: 'Courses', id: 'online-focus' },
        { name: 'Partner with us', link: '/school-partnerships' },
        { name: 'Request Callback', action: handleContactClick },
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
                    className={`pointer-events-auto transition-all duration-700 ease-out flex items-center justify-center
                        ${isScrolled
                            ? 'w-full md:w-[90%] lg:w-[85%] rounded-full bg-black/95 backdrop-blur-2xl border border-white/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.9)] px-6 py-0 h-14'
                            : 'w-full rounded-none bg-[#020202]/97 backdrop-blur-xl px-6 py-0 h-[68px] border-b border-white/[0.06]'
                        }`}
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
                                            className="relative flex flex-col items-start gap-1.5 text-white/60 hover:text-white font-semibold text-[15px] tracking-wide transition-colors duration-200 py-2 px-3"
                                        >
                                            {item.name}
                                            {/* Orange underline */}
                                            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                                        </Link>
                                    ) : (
                                        <motion.div
                                            onClick={() => {
                                                if (item.action) item.action();
                                                else if (item.id) scrollToSection(item.id);
                                            }}
                                            className="relative flex flex-col items-start text-white/60 hover:text-white font-semibold text-[15px] tracking-wide transition-colors duration-200 py-2 px-3 cursor-pointer"
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            {item.name}
                                            {/* Orange underline */}
                                            <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F97316] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right CTA */}
                        <div className="hidden md:flex items-center">
                            <button
                                onClick={() => navigate('/student/login')}
                                className="px-10 py-2.5 bg-[#F97316] text-white font-black text-[15px] rounded-xl hover:bg-[#EA580C] transition-all shadow-md shadow-orange-500/20"
                            >
                                Sign In
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
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
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="absolute top-[68px] left-0 right-0 bg-black/99 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black"
                            initial={{ y: -16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -16, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <div className="p-4 flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => {
                                            if (item.action) { item.action(); setIsMobileMenuOpen(false); }
                                            else if (item.link) { navigate(item.link); setIsMobileMenuOpen(false); }
                                            else if (item.id) { scrollToSection(item.id); setIsMobileMenuOpen(false); }
                                        }}
                                        className="w-full text-left px-4 py-3 text-[14px] font-semibold tracking-wide text-white/60 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all"
                                    >
                                        {item.name}
                                    </button>
                                ))}

                                <div className="h-px bg-white/[0.06] my-3" />

                                <button
                                    onClick={() => { navigate('/student/login'); setIsMobileMenuOpen(false); }}
                                    className="w-full text-center px-4 py-3 text-[13px] font-black text-white bg-[#F97316] rounded-xl hover:bg-[#EA580C] transition-all shadow-lg shadow-orange-500/10"
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
