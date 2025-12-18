import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import LeadFormModal from './LeadFormModal';
import { PortalContext } from './Context/PortalProvider';

const PremiumNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(PortalContext);

    // Detect scroll for navbar background change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBookSession = () => {
        if (!user) {
            navigate('/student/signup');
        } else {
            setIsModalOpen(true);
        }
    };

    const navItems = [
        {
            name: 'For School Students',
            hasDropdown: true,
            subItems: [
                { name: 'Foundational Mastery', link: '#programs' },
                { name: 'Innovation Lab', link: '#ecosystem' },
                { name: 'Student Excellence', link: '#testimonials' }
            ]
        },
        {
            name: 'For College Students',
            hasDropdown: true,
            subItems: [
                { name: 'Career Support', link: '#career' },
                { name: 'Faculty', link: '#faculty' }
            ]
        },
    ];

    return (
        <>
            {/* Top Banner - Tech Expert Call to Action - Now Opaque */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-slate-100 h-9 flex items-center overflow-hidden shadow-sm">
                <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-center gap-2 text-[10px] md:text-xs font-['Inter']">
                    <Sparkles size={14} className="text-[#fca96d]" />
                    <span className="text-slate-600 font-black uppercase tracking-widest font-['Outfit']">Master Industry-Standard Engineering</span>
                    <a href="#programs" className="text-[#fca96d] font-black hover:underline flex items-center gap-1 ml-4 uppercase tracking-tighter font-['Outfit']">
                        Explore Curriculum
                        <ArrowRight size={14} />
                    </a>
                </div>
            </div>

            <motion.nav
                className={`fixed top-9 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200'
                    : 'bg-white border-b border-slate-100'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo Section */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            {/* Simple Logo Icon */}
                            <div className="w-8 h-8 rounded-lg bg-[#fca96d] flex items-center justify-center">
                                <span className="text-white font-bold text-lg">TS</span>
                            </div>

                            {/* Logo Text */}
                            <h1 className="text-xl font-black tracking-tight text-slate-800 font-['Outfit']">
                                think<span className="text-[#fca96d]">skool</span>
                            </h1>
                        </div>

                        {/* Desktop Navigation - Clean & Simple */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer h-16 flex items-center">
                                    <div className="flex items-center gap-1 text-slate-500 group-hover:text-[#fca96d] font-black uppercase text-[11px] tracking-widest transition-colors font-['Outfit']">
                                        <span>{item.name}</span>
                                        {item.hasDropdown && <FaChevronDown size={10} className="mt-0.5 group-hover:rotate-180 transition-transform duration-200" />}
                                    </div>

                                    {/* Dropdown Menu */}
                                    {item.hasDropdown && (
                                        <div className="absolute top-16 left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 w-56 overflow-hidden">
                                                {item.subItems.map((sub, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={sub.link}
                                                        className="block px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#fca96d]/10 hover:text-[#fca96d] transition-colors border-l-2 border-transparent hover:border-[#fca96d] font-['Outfit']"
                                                    >
                                                        {sub.name}
                                                    </a>
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
                                className="px-5 py-2 text-[10px] font-black text-white bg-slate-900 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest font-['Outfit']"
                            >
                                Book Free Session
                            </button>
                            <button
                                onClick={() => {
                                    if (user) {
                                        navigate('/student');
                                    } else {
                                        navigate('/student/login');
                                    }
                                }}
                                className="px-5 py-2 text-[10px] font-black text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-widest font-['Outfit']"
                            >
                                My Classroom
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <FaUserCircle size={28} />
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
                            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 shadow-xl"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                        >
                            <div className="p-4 flex flex-col gap-2 font-['Outfit']">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 rounded-lg hover:bg-[#fca96d]/10 hover:text-[#fca96d] transition-colors flex justify-between items-center"
                                    >
                                        {item.name}
                                        {item.hasDropdown && <FaChevronDown size={12} />}
                                    </button>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <button
                                    onClick={() => navigate('/classroom')}
                                    className="w-full text-center px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
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
