import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo = ({ className = '', size = 'md', theme = 'auto' }) => {
    const sizeClasses = {
        xs: 'text-sm',
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl',
    };

    return (
        <div className={`flex items-center font-black ${sizeClasses[size] || sizeClasses.md} uppercase tracking-tighter transition-all duration-300 ${className}`}>
            <span className="text-[#2563EB]">think</span>
            <span className="text-[#F97316]">skool</span>
        </div>
    );
};

export default BrandLogo;
