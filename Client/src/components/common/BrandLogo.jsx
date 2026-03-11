import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo = ({ className = '', size = 'md', theme = 'auto', shine = false }) => {
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl',
    };

    const themeStyles = {
        dark: { think: 'text-white', skool: 'text-slate-500' },
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
        <div className={`flex items-center font-bold ${sizeClasses[size] || sizeClasses.md} lowercase tracking-tight transition-all duration-300 ${className}`}>
            {letters.map((char, i) => {
                const isThink = i < 5;
                const colorClass = isThink ? colors.think : colors.skool;
                
                return (
                    <motion.span
                        key={i}
                        variants={shineVariants}
                        animate={shine ? "animate" : ""}
                        custom={i}
                        className={`${colorClass} inline-block`}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </div>
    );
};

export default BrandLogo;
