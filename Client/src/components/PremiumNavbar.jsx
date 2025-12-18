import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import LeadFormModal from './LeadFormModal';

const PremiumNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Detect scroll for navbar background change
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        {
            name: 'For School Students',
            hasDropdown: true,
            subItems: [
                { name: 'Our Programs', link: '#programs' },
                { name: 'Coding Lab', link: '#ecosystem' },
                { name: 'Success Stories', link: '#testimonials' }
            ]
        },
        {
            name: 'For College Students',
            hasDropdown: true,
            subItems: [
                { name: 'Career Support', link: '#career' },
                { name: 'Mentorship', link: '#faculty' }
            ]
        },
    ];

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-sm border-b border-slate-100'
                    : 'bg-white border-b border-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo Section */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            {/* Simple Logo Icon */}
                            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">TS</span>
                            </div>

                            {/* Logo Text */}
                            <h1 className="text-xl font-bold tracking-tight text-slate-800">
                                think<span className="text-orange-500">skool</span>
                            </h1>
                        </div>

                        {/* Desktop Navigation - Clean & Simple */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <div key={item.name} className="relative group cursor-pointer h-20 flex items-center">
                                    <div className="flex items-center gap-1 text-slate-600 group-hover:text-orange-500 font-medium transition-colors">
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
                                                        className="block px-4 py-3 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium border-l-2 border-transparent hover:border-orange-500"
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
                                onClick={() => setIsModalOpen(true)}
                                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Book Free Session
                            </button>
                            <button
                                onClick={() => navigate('/classroom')}
                                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                My Classroom
                            </button>
                            <button
                                onClick={() => navigate('/profile')}
                                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
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
                            <div className="p-4 flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        className="w-full text-left px-4 py-3 text-slate-700 font-medium rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors flex justify-between items-center"
                                    >
                                        {item.name}
                                        {item.hasDropdown && <FaChevronDown size={12} />}
                                    </button>
                                ))}
                                <div className="h-px bg-slate-100 my-2" />
                                <button
                                    onClick={() => navigate('/classroom')}
                                    className="w-full text-center px-4 py-3 text-slate-700 font-semibold border border-slate-300 rounded-lg hover:bg-slate-50"
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
