import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const Paragraph = ({ text, index, total, progress }) => {
    const start = index / total;
    const end = (index + 1) / total;
    
    const opacity = useTransform(
        progress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );
    
    const y = useTransform(
        progress,
        [start, start + 0.05, end - 0.05, end],
        [30, 0, 0, -30]
    );

    const scale = useTransform(
        progress,
        [start, start + 0.05, end - 0.05, end],
        [0.95, 1, 1, 1.05]
    );

    return (
        <motion.p
            style={{ opacity, y, scale, position: index === 0 ? 'relative' : 'absolute' }}
            className="w-full text-lg md:text-2xl font-medium leading-relaxed"
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
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section 
            ref={containerRef}
            style={{ height: `${(paragraphs.length + 1) * 100}vh` }}
            className="relative bg-white"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Pinned Scroll Indicator */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-50 z-50">
                    <motion.div 
                        style={{ scaleX }}
                        className="h-full bg-gradient-to-r from-blue-600 to-pink-500 origin-left"
                    />
                </div>

                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-[120px] -ml-64 -mb-64" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
                            The Thinkskool <br/><span className="text-blue-600">Pedagogy</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                    </motion.div>

                    <div className="relative h-64 md:h-48 flex items-center justify-center text-slate-600">
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
                            opacity: useTransform(scrollYProgress, [0.9, 1], [0, 1]),
                            scale: useTransform(scrollYProgress, [0.9, 1], [0.8, 1])
                        }}
                        className="mt-20 inline-flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-xl"
                    >
                        <div className="text-5xl font-black text-blue-600 tracking-tighter">1000+</div>
                        <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] leading-tight text-left">
                            Students Trained <br/> & Deployed Globally
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Scroll to Explore Pedagogy</span>
                    <div className="w-0.5 h-8 bg-gradient-to-b from-blue-600 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default SEOContentSection;
