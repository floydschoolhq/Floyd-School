import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrandLogo = ({ 
    className = '', 
    size = 'md', 
    theme = 'auto', 
    variant = 'text', 
    shine = false, 
    scrolled = false, 
    showTagline = true 
}) => {
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

    const themeStyles = {
        dark: 'text-white',
        light: 'text-slate-900',
        brand: 'text-white',
        auto: 'text-slate-900 dark:text-white'
    };

    const textColor = themeStyles[theme] || themeStyles.dark;

    // Map theme to the corresponding transparent image file
    const logoImages = {
        dark: '/logo-white-text.png',
        light: '/logo-black-text.png',
        brand: '/logo-white-text.png',
        auto: '/logo-white-text.png'
    };

    const logoSrc = logoImages[theme] || logoImages.dark;

    const heightClasses = {
        xs: 'h-[14px]',
        sm: 'h-[18px]',
        md: scrolled ? 'h-[20px]' : 'h-[24px]',
        lg: 'h-[30px]',
        xl: 'h-[45px]',
    };

    const renderLogoImage = () => {
        if (theme === 'auto') {
            return (
                <div className={`${heightClasses[size] || heightClasses.md} flex items-center`}>
                    <img 
                        src="/logo-black-text.png" 
                        alt="Floyd School" 
                        className="block dark:hidden h-full object-contain cursor-pointer"
                        onClick={handleLogoClick}
                    />
                    <img 
                        src="/logo-white-text.png" 
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
                {variant === 'image' ? (
                    renderLogoImage()
                ) : (
                    <span 
                        onClick={handleLogoClick}
                        className={`font-extrabold uppercase tracking-widest cursor-pointer ${sizeClasses[size] || sizeClasses.md} ${textColor}`}
                    >
                        FLOYD SCHOOL
                    </span>
                )}
            </div>
            {showTagline && (
                <span className={`text-[9px] text-slate-400 font-semibold tracking-tight transition-all duration-300 ${scrolled ? 'mt-[4px]' : 'mt-[6px]'} block text-center max-w-[280px]`}>
                    Every Student Has a Destination. We Find the Shortest Path.
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
