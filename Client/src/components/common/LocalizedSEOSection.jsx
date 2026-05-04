import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Paragraph = ({ text, index, total, progress }) => {
    const start = index / total;
    const end = (index + 1) / total;
    
    const opacity = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        [0, 1, 1, 0]
    );
    
    const y = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        [40, 0, 0, -40]
    );

    const scale = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        [0.98, 1, 1, 1.02]
    );

    const blur = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        ["blur(10px)", "blur(0px)", "blur(0px)", "blur(10px)"]
    );

    return (
        <motion.p
            style={{ 
                opacity, 
                y, 
                scale, 
                filter: blur,
                position: 'absolute' 
            }}
            className="w-full text-lg md:text-2xl font-light tracking-wide leading-relaxed px-6 text-white text-center"
        >
            {text}
        </motion.p>
    );
};

const LocalizedSEOSection = ({ title, highlight, paragraphs }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    // Mobile needs a bit more scroll space to feel smooth
    const containerHeight = `${(paragraphs.length + 1) * 120}vh`;

    return (
        <section 
            ref={containerRef}
            style={{ height: containerHeight }}
            className="relative bg-black"
        >
            <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-black/40 backdrop-blur-3xl">
                {/* Minimalist White Progress Indicator */}
                <div className="absolute top-0 left-0 w-full h-[1px] z-50 bg-white/10">
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] origin-left"
                    />
                </div>

                {/* Subtle Glassy Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />

                <div className="max-w-4xl w-full mx-auto text-center relative z-10 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12 md:mb-20"
                    >
                        <h2 className="text-3xl md:text-6xl font-light text-white uppercase tracking-[0.2em] mb-4 md:mb-6 leading-tight">
                            {title.includes('Thinkskool') ? (
                                <>
                                    {title.split('Thinkskool')[0]}
                                    <span className="text-[#2563EB]">Think</span>
                                    <span className="text-[#F97316]">skool</span>
                                    {title.split('Thinkskool')[1]}
                                </>
                            ) : title}
                            <br/>
                            <span className="font-black text-white">
                                {highlight.split(' ').map((word, index) => {
                                    if (word.includes('Career')) return <span key={index} className="text-[#2563EB]">{word} </span>;
                                    if (word.includes('Support')) return <span key={index} className="text-[#F97316]">{word} </span>;
                                    return <span key={index}>{word} </span>;
                                })}
                            </span>
                        </h2>
                        <div className="w-12 h-[1px] bg-white/40 mx-auto" />
                    </motion.div>

                    <div className="relative h-80 md:h-48 flex items-center justify-center">
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
                
                {/* Minimalist Scroll Hint */}
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="text-[9px] font-light text-white uppercase tracking-[0.5em] opacity-30">Scroll Down</span>
                    <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default LocalizedSEOSection;
