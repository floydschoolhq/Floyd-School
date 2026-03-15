import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';

const WaveText = ({ text, className = '' }) => {
    // Split text into arrays of letters
    const letters = text.split("");
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

    return (
        <div className={`flex items-center justify-center font-black lowercase tracking-tighter w-full py-0 select-none ${className}`}>
            <div className="flex flex-nowrap shrink-0">
                {letters.map((char, i) => {
                    // Determine color: 'think' (first 5) is blue, 'skool' (next 5) is orange
                    const isBlue = i < 5;
                    const colorClass = isBlue ? 'text-[#2563EB]' : 'text-[#F97316]';
                    
                    return (
                        <motion.span
                            key={i}
                            variants={shineVariants}
                            animate="animate"
                            custom={i}
                            className={`${colorClass} inline-block leading-none`}
                            style={{ 
                                fontSize: 'clamp(3rem, 15vw, 15rem)', // Large responsive scale
                            }}
                        >
                            {char}
                        </motion.span>
                    );
                })}
            </div>
        </div>
    );
};

export default WaveText;
