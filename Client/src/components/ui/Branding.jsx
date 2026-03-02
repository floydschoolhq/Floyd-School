import React from 'react';

const Branding = ({ className = "" }) => {
    return (
        <span className={`inline-flex items-center ${className}`}>
            <span className="text-[#2563EB]">think</span>
            <span className="text-[#F97316]">skool</span>
        </span>
    );
};

export default Branding;
