import React, { useState, useEffect } from 'react';
import { FaHome, FaGraduationCap, FaBook, FaUsers, FaPhone } from 'react-icons/fa';

const MobileBottomNav = () => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['hero', 'online-focus', 'student-projects', 'mentors-grid', 'contact'];
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
    }, []);

    const navItems = [
        { id: 'home', icon: FaHome, label: 'Home' },
        { id: 'online-focus', icon: FaGraduationCap, label: 'Courses' },
        { id: 'student-projects', icon: FaBook, label: 'Projects' },
        { id: 'mentors-grid', icon: FaUsers, label: 'Mentors' },
        { id: 'contact', icon: FaPhone, label: 'Contact' }
    ];

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40 md:hidden">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    
                    return (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                                isActive 
                                    ? 'text-orange-600' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Icon size={18} />
                            <span className={`text-xs font-medium ${isActive ? 'text-orange-600' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileBottomNav;
