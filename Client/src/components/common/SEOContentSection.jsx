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
        [15, 0, 0, -15]
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

const SEOContentSection = () => {
    const containerRef = useRef(null);
    const paragraphs = [
        "At Thinkskool, we are redefining how the next generation of engineers is trained. Our approach is rooted in the belief that the traditional academic system often focuses too heavily on abstract concepts, leaving students unprepared for the high-intensity demands of the modern tech landscape.",
        "Every student at Thinkskool is treated like an engineer from day one. Instead of passive lectures, our sessions are structured as 'sprints,' where students tackle real-world problems using industry-standard tools like Git, Docker, and various Cloud Architectures.",
        "We focus on 'First Principles Thinking.' We don't just teach you how to use a library; we teach you why it works and how to build your own. This deep understanding of technical architecture is what separates a developer from a high-level engineer.",
        "Mentorship is the cornerstone of the Thinkskool experience. Our students work in small squads, led by experienced mentors who provide personalized guidance, code reviews, and career coaching, mimicking a real-world engineering department.",
        "Our commitment to excellence extends to our community. Thinkskool is an ecosystem of innovators, builders, and dreamers. Join us in architecting the future of engineering excellence."
    ];

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 15,
        restDelta: 0.001
    });

    return (
        <section 
            ref={containerRef}
            style={{ height: `${(paragraphs.length + 1) * 120}vh` }}
            className="relative bg-black w-full overflow-x-clip seo-immersive"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between py-24 md:py-32 overflow-hidden bg-black z-30">
                {/* Minimalist White Pinned Indicator */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 z-50">
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] origin-left"
                    />
                </div>

                <div className="max-w-4xl mx-auto px-6 relative z-20 text-center w-full">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 md:mb-24"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white uppercase tracking-[0.25em] mb-4 md:mb-6 leading-none">
                            {/* Mobile Heading: 2 words */}
                            <span className="block md:hidden">
                                <span className="text-[#2563EB]">Think</span><span className="text-[#F97316]">skool</span> Pedagogy
                            </span>
                            
                            {/* Desktop Heading */}
                            <span className="hidden md:block">
                                The <span className="text-[#2563EB]">Think</span><span className="text-[#F97316]">skool</span> <br/><span className="font-black text-white">Pedagogy</span>
                            </span>
                        </h2>
                        <div className="w-16 h-[1px] bg-white/40 mx-auto" />
                    </motion.div>
                </div>

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

                <div className="max-w-4xl mx-auto px-6 relative z-20 text-center w-full">
                    <motion.div 
                        style={{ 
                            opacity: useTransform(scrollYProgress, [0.92, 1], [0, 1]),
                            scale: useTransform(scrollYProgress, [0.92, 1], [0.9, 1])
                        }}
                        className="mb-12 inline-flex items-center gap-4 md:gap-8 p-6 md:p-10 bg-white/[0.03] rounded-[2.5rem] md:rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="text-4xl md:text-6xl font-black text-white tracking-tighter">1000+</div>
                        <div className="text-[8px] md:text-[10px] font-light text-white/60 uppercase tracking-[0.4em] leading-tight text-left">
                            Students Trained <br/> & Deployed Globally
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
                >
                    <span className="text-[10px] font-light text-white/30 uppercase tracking-[0.6em]">Begin Journey</span>
                    <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default SEOContentSection;
