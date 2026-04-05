import React from 'react';

const ScrollDarkenHeading = ({ children, className = "", sizeClass = "text-3xl md:text-8xl", variant = "light", uppercase = true }) => {
    const isDark = variant === "dark";

    return (
        <h2
            className={`${sizeClass} font-black ${uppercase ? 'uppercase' : ''} tracking-tighter leading-none 
                ${isDark ? 'text-slate-200' : 'text-slate-500'} ${className}`}
        >
            {children}
        </h2>
    );
};

export default ScrollDarkenHeading;
