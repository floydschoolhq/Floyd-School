import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';

const WaveText = ({ text, className = '' }) => {
    const isMobile = useIsMobile();
    
    // Animation variants for the "shine" effect
    const shineVariants = {
        animate: (i) => ({
            filter: isMobile ? "brightness(1)" : [
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
                "brightness(1.8) drop-shadow(0 0 15px rgba(255,255,255,0.4))",
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))"
            ],
            transition: isMobile ? { duration: 0 } : {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15, // Staggered delay for shine sweep
            }
        })
    };

    const fontSizeStyle = {
        fontSize: 'clamp(2.5rem, 12vw, 10rem)',
    };

    return (
        <div className={`flex items-center justify-center font-extrabold uppercase tracking-widest w-full py-0 select-none ${className}`}>
            <div className="flex flex-nowrap shrink-0 items-center text-white" style={fontSizeStyle}>
                <motion.span variants={shineVariants} animate="animate" custom={0} className="leading-none">
                    FLOYD SCHOOL
                </motion.span>
            </div>
        </div>
    );
};

export default WaveText;
