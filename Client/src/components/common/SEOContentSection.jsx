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
        [50, 0, 0, -50]
    );

    const scale = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        [0.98, 1, 1, 1.02]
    );

    const blur = useTransform(
        progress,
        [start, start + 0.08, end - 0.08, end],
        ["blur(15px)", "blur(0px)", "blur(0px)", "blur(15px)"]
    );

    return (
        <motion.p
            style={{ 
                opacity, 
                y, 
                scale, 
                filter: blur,
                position: index === 0 ? 'relative' : 'absolute' 
            }}
            className="w-full text-lg md:text-2xl font-light tracking-wide leading-relaxed text-white"
        >
            {text}
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
        stiffness: 40, // Very smooth, liquid movement
        damping: 15,
        restDelta: 0.001
    });

    return (
        <section 
            ref={containerRef}
            style={{ height: `${(paragraphs.length + 1) * 100}vh` }}
            className="relative bg-black"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black/60 backdrop-blur-3xl">
                {/* Minimalist White Pinned Indicator */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 z-50">
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] origin-left"
                    />
                </div>

                {/* Subtle Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.04] to-transparent pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white uppercase tracking-[0.25em] mb-6 leading-none">
                            The <span className="text-[#2563EB]">Thinkskool</span> <br/><span className="font-black text-white">Pedagogy</span>
                        </h2>
                        <div className="w-16 h-[1px] bg-white/40 mx-auto" />
                    </motion.div>

                    <div className="relative h-64 md:h-48 flex items-center justify-center text-white">
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

                    <motion.div 
                        style={{ 
                            opacity: useTransform(scrollYProgress, [0.92, 1], [0, 1]),
                            scale: useTransform(scrollYProgress, [0.92, 1], [0.9, 1]),
                            filter: useTransform(scrollYProgress, [0.92, 1], ["blur(10px)", "blur(0px)"])
                        }}
                        className="mt-20 inline-flex items-center gap-8 p-10 bg-white/[0.03] rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="text-6xl font-black text-white tracking-tighter">1000+</div>
                        <div className="text-[10px] font-light text-white/60 uppercase tracking-[0.4em] leading-tight text-left">
                            Students Trained <br/> & Deployed Globally
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] font-light text-white/30 uppercase tracking-[0.6em]">Begin Journey</span>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default SEOContentSection;
