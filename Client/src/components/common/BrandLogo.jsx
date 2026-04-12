import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BrandLogo = ({ className = '', size = 'md', theme = 'auto', shine = false, scrolled = false, showTagline = true }) => {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        navigate('/');
    };
    
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-xl',
        md: scrolled ? 'text-[24px]' : 'text-[32px]',
        lg: 'text-5xl',
        xl: 'text-7xl',
    };

    const themeStyles = {
        dark: { think: 'text-[#2563EB]', skool: 'text-[#F97316]' },
        light: { think: 'text-slate-900', skool: 'text-slate-500' },
        brand: { think: 'text-[#2563EB]', skool: 'text-[#F97316]' },
        auto: { think: 'text-current', skool: 'text-slate-500' }
    };

    const colors = themeStyles[theme] || themeStyles.dark;
    const text = "thinkskool";
    const letters = text.split("");

    const shineVariants = {
        animate: (i) => ({
            filter: shine ? [
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
                "brightness(1.8) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))"
            ] : "none",
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
            }
        })
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <div 
                onClick={handleLogoClick}
                className={`flex items-center font-bold ${sizeClasses[size] || sizeClasses.md} lowercase tracking-tight transition-all duration-300 cursor-pointer hover:opacity-80`}
            >
                {letters.map((char, i) => {
                    const isThink = i < 5;
                    const colorClass = isThink ? colors.think : colors.skool;
                    const isLastOfThink = i === 4;
                    
                    return (
                        <motion.span
                            key={i}
                            variants={shineVariants}
                            animate={shine ? "animate" : ""}
                            custom={i}
                            className={`${colorClass} inline-block ${isLastOfThink ? 'mr-[0.5px]' : ''}`}
                        >
                            {char}
                        </motion.span>
                    );
                })}
            </div>
            {showTagline && (
                <span className={`text-[11px] text-slate-400 font-bold tracking-tight transition-all duration-300 ${scrolled ? 'mt-[-4px]' : 'mt-[-6px]'} block text-center`}>
                    Learn Beyond Classroom
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
