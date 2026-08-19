import React from 'react';

const Branding = ({ className = "" }) => {
    return (
        <span className={`inline-flex items-center ${className}`}>
            <span className="text-[#2563EB]">floyd</span>
            <span className="text-[#F97316]">school</span>
        </span>
    );
};

export default Branding;
