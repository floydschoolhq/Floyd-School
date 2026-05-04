import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const LocalizedSEOSection = ({ title, highlight, paragraphs, dark = false }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section 
            ref={containerRef}
            className={`py-32 relative overflow-hidden ${dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} border-t border-white/5`}
        >
            {/* Localized Scroll Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 z-20 ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
                <motion.div 
                    style={{ scaleX }}
                    className={`h-full bg-gradient-to-r from-blue-600 to-pink-500 origin-left`}
                />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
                        {title} <br/><span className="text-blue-500">{highlight}</span>
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
                </motion.div>

                <div className={`space-y-10 text-lg md:text-xl font-medium leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {paragraphs.map((p, i) => (
                        <motion.p 
                            key={i}
                            initial={{ opacity: 0, y: 20 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {p}
                        </motion.p>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocalizedSEOSection;
