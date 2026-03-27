import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaGraduationCap, FaBook, FaUsers, FaPhone } from 'react-icons/fa';

const MobileBottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        if (location.pathname === '/school-partnerships') {
            setActiveSection('partners');
            return;
        }

        const handleScroll = () => {
            const sections = ['home', 'online-focus', 'student-projects', 'mentors-grid', 'contact'];
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const navItems = [
        { id: 'home', icon: FaHome, label: 'Home' },
        { id: 'online-focus', icon: FaGraduationCap, label: 'Courses' },
        { id: 'partners', icon: FaUsers, label: 'Partners', path: '/school-partnerships' },
        { id: 'student-projects', icon: FaBook, label: 'Projects' },
        { id: 'contact', icon: FaPhone, label: 'Contact' }
    ];

    const handleNavAction = (item) => {
        if (item.path) {
            navigate(item.path);
        } else {
            if (location.pathname !== '/') {
                navigate('/' + '#' + item.id);
            } else {
                const element = document.getElementById(item.id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <div className="fixed bottom-4 left-6 right-6 z-[60] md:hidden">
            <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleNavAction(item)}
                            className="relative flex flex-col items-center group py-1"
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                                isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-white'
                            }`}>
                                <Icon size={16} />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


export default MobileBottomNav;
