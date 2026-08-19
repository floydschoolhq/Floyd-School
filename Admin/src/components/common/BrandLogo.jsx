import React from 'react';

const BrandLogo = ({ className = '', size = 'md', suffix = '' }) => {
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl',
    };

    return (
        <div className={`flex items-center font-black ${sizeClasses[size] || sizeClasses.md} uppercase tracking-tighter transition-all duration-300 ${className}`}>
            <span className="text-[#2563EB]">floyd</span>
            <span className="text-[#FF7A00]">school</span>
            {suffix && (
                <span className="ml-2 text-slate-400 font-medium italic normal-case text-sm tracking-normal">
                    {suffix}
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
