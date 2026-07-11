import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BrandLogo = ({ className = '', size = 'md', theme = 'auto', shine = false, scrolled = false, showTagline = true }) => {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        navigate('/');
    };
    
    const sizeClasses = {
        xs: 'text-xs tracking-wider',
        sm: 'text-lg tracking-widest',
        md: scrolled ? 'text-[22px] tracking-widest' : 'text-[28px] tracking-widest',
        lg: 'text-4xl tracking-[0.2em]',
        xl: 'text-6xl tracking-[0.25em]',
    };

    // Map theme to the corresponding image file
    const logoImages = {
        dark: '/logo-white.png',
        light: '/logo-black.png',
        brand: '/logo-white.png',
        auto: '/logo-white.png'
    };

    const logoSrc = logoImages[theme] || logoImages.dark;

    const heightClasses = {
        xs: 'h-5',
        sm: 'h-6',
        md: scrolled ? 'h-7' : 'h-8',
        lg: 'h-10',
        xl: 'h-14',
    };

    const renderLogoImage = () => {
        if (theme === 'auto') {
            return (
                <div className={`${heightClasses[size] || heightClasses.md} flex items-center`}>
                    <img 
                        src="/logo-black.png" 
                        alt="Floyd School" 
                        className="block dark:hidden h-full object-contain cursor-pointer"
                        onClick={handleLogoClick}
                    />
                    <img 
                        src="/logo-white.png" 
                        alt="Floyd School" 
                        className="hidden dark:block h-full object-contain cursor-pointer"
                        onClick={handleLogoClick}
                    />
                </div>
            );
        }
        return (
            <div className={`${heightClasses[size] || heightClasses.md} flex items-center`}>
                <img 
                    src={logoSrc} 
                    alt="Floyd School" 
                    className="h-full object-contain cursor-pointer"
                    onClick={handleLogoClick}
                />
            </div>
        );
    };

    return (
        <div className={`flex flex-col items-center select-none ${className}`}>
            <div className="hover:opacity-95 transition-opacity duration-300">
                {renderLogoImage()}
            </div>
            {showTagline && (
                <span className={`text-[9px] text-slate-400 font-semibold tracking-tight transition-all duration-300 ${scrolled ? 'mt-[2px]' : 'mt-[6px]'} block text-center max-w-[280px]`}>
                    Every Student Has a Destination. We Find the Shortest Path.
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
