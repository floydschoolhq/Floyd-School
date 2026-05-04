import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Paragraph = ({ text, index, total, progress }) => {
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
        [15, 0, 0, -15] // Further reduced y-displacement to prevent collision
    );

    return (
        <motion.p
            style={{ 
                opacity, 
                y, 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            className="text-base md:text-2xl font-light tracking-wide leading-relaxed px-6 text-white text-center"
        >
            <span className="max-w-2xl mx-auto">{text}</span>
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

    const containerHeight = `${(paragraphs.length + 1) * 120}vh`;

    return (
        <section 
            ref={containerRef}
            style={{ height: containerHeight }}
            className="relative bg-black w-full overflow-x-clip seo-immersive"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between py-24 md:py-32 overflow-hidden bg-black z-30">
                {/* Minimalist White Progress Indicator */}
                <div className="absolute top-0 left-0 w-full h-[1px] z-50 bg-white/10">
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] origin-left"
                    />
                </div>

                {/* Heading Area - Pinned to Top of Sticky Container */}
                <div className="max-w-4xl w-full mx-auto text-center relative z-20 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 md:mb-24" // Significantly increased bottom margin
                    >
                        <h2 className="text-3xl md:text-6xl font-light text-white uppercase tracking-[0.2em] mb-4 md:mb-6 leading-tight">
                            {/* Mobile Heading Logic: Only 2 words */}
                            <span className="block md:hidden">
                                {highlight.includes('Career') ? (
                                    <><span className="text-[#2563EB]">Career</span> <span className="text-[#F97316]">Support</span></>
                                ) : (
                                    highlight.includes('Future') ? "Future Leaders" : "Thinkskool"
                                )}
                            </span>

                            {/* Desktop Heading Logic */}
                            <span className="hidden md:block">
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
                            </span>
                        </h2>
                        <div className="w-12 h-[1px] bg-white/40 mx-auto" />
                    </motion.div>
                </div>

                {/* Paragraphs Area - Centered in remaining space */}
                <div className="relative w-full flex-1 max-w-4xl mx-auto px-6 z-10 min-h-[300px]">
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
                
                {/* Minimalist Scroll Hint */}
                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
                >
                    <span className="text-[9px] font-light text-white uppercase tracking-[0.5em] opacity-30">Scroll Down</span>
                    <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-white/40 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default LocalizedSEOSection;
