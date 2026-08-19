import React from 'react';

const BrandLogo = ({ className = '', size = 'md', suffix = '' }) => {
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl',
        xl: 'text-5xl',
    };

    return (
        <div className={`flex items-center font-black ${sizeClasses[size] || sizeClasses.md} uppercase tracking-tight transition-all duration-300 ${className}`}>
            <span className="text-slate-900">floyd school</span>
            {suffix && (
                <span className="ml-2 text-slate-400 font-medium italic normal-case text-xs tracking-normal">
                    {suffix}
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
