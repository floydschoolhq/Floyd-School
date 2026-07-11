import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollTracker = () => {
    // We attach this to the document body or a specific container
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll animation
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // We only want the tracker to be visible when scrolled past the hero section
    // and hidden after floydschoolAdvantage. 
    // Since it's tricky to get exact absolute pixel values of components dynamically without refs, 
    // a common approach is a fixed line whose height grows, and opacity fades based on raw scroll percentage.
    const opacity = useTransform(
        scrollYProgress,
        [0.05, 0.1, 0.9, 0.95],
        [0, 1, 1, 0] // Fade in after Hero, fade out near the absolute bottom of the page
    );

    return (
        <motion.div 
            style={{ opacity }}
            className="fixed left-6 md:left-12 top-[20vh] bottom-[20vh] w-[2px] z-[40] pointer-events-none hidden md:block"
        >
            {/* The Track (Background Line) */}
            <div className="absolute inset-0 w-full h-full bg-slate-200/50 rounded-full" />
            
            {/* The Animated Fill Line */}
            <motion.div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-600 via-indigo-500 to-orange-500 rounded-full origin-top"
                style={{ height: '100%', scaleY }}
            />
            
            {/* The Glowing Dot that follows the scroll */}
            <motion.div 
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-[3px] border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                style={{ 
                    top: useTransform(scaleY, [0, 1], ["0%", "100%"]),
                    marginTop: '-8px'
                }}
            />
        </motion.div>
    );
};

export default ScrollTracker;
