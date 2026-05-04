import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Paragraph = ({ text, index, total, progress }) => {
    // Each paragraph is visible for a specific range of the scroll
    const start = index / total;
    const end = (index + 1) / total;
    
    const opacity = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0, 1, 1, 0]
    );
    
    const y = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [20, 0, 0, -20]
    );

    return (
        <motion.p
            style={{ opacity, y, position: index === 0 ? 'relative' : 'absolute' }}
            className="w-full text-lg md:text-2xl font-medium leading-relaxed px-6"
        >
            {text}
        </motion.p>
    );
};

const LocalizedSEOSection = ({ title, highlight, paragraphs, dark = false }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // We make the container taller to allow for "sticky" scrolling through paragraphs
    // Height = number of paragraphs * 100vh for a clear transition
    const containerHeight = `${(paragraphs.length + 1) * 100}vh`;

    return (
        <section 
            ref={containerRef}
            style={{ height: containerHeight }}
            className={`relative ${dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Pinned Scroll Indicator */}
                <div className={`absolute top-0 left-0 w-full h-2 z-50 ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-gradient-to-r from-blue-600 to-pink-500 origin-left"
                    />
                </div>

                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

                <div className="max-w-4xl w-full mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-tight">
                            {title} <br/><span className="text-blue-500">{highlight}</span>
                        </h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="relative h-64 md:h-48 flex items-center justify-center">
                        {paragraphs.map((text, i) => (
                            <Paragraph 
                                key={i} 
                                text={text} 
                                index={i} 
                                total={paragraphs.length} 
                                progress={scrollYProgress} 
                            />
                        ))}
                    </div>
                </div>
                
                {/* Hint for user to keep scrolling */}
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Scroll to Explore</span>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-600 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default LocalizedSEOSection;
