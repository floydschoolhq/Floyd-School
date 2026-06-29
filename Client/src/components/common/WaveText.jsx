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
                {/* FLOYD */}
                <motion.span variants={shineVariants} animate="animate" custom={0} className="leading-none">
                    FLOYD
                </motion.span>
                
                {/* SPACE */}
                <span className="mx-[0.2em]">&nbsp;</span>
                
                {/* SCH */}
                <motion.span variants={shineVariants} animate="animate" custom={1} className="leading-none">
                    SCH
                </motion.span>
                
                {/* Connected OO */}
                <span className="relative inline-flex items-center mx-[0.01em]">
                    <motion.span variants={shineVariants} animate="animate" custom={2} className="leading-none">
                        O
                    </motion.span>
                    <motion.span variants={shineVariants} animate="animate" custom={3} className="leading-none">
                        O
                    </motion.span>
                    {/* The red bridge line connecting the centers of the two Os, scaled with em */}
                    <span 
                        className="absolute left-[20%] right-[20%] rounded-full z-10 bg-red-600 h-[0.08em]"
                        style={{ top: '55%', transform: 'translateY(-50%)' }}
                    ></span>
                </span>
                
                {/* L */}
                <motion.span variants={shineVariants} animate="animate" custom={4} className="leading-none">
                    L
                </motion.span>
            </div>
        </div>
    );
};

export default WaveText;
