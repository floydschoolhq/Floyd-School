import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const SEOContentSection = () => {
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
            className="py-32 bg-white border-t border-slate-100 relative overflow-hidden"
        >
            {/* Localized Scroll Indicator - Only visible for this section */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 z-20">
                <motion.div 
                    style={{ scaleX }}
                    className="h-full bg-gradient-to-r from-blue-600 to-pink-500 origin-left"
                />
            </div>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50/30 rounded-full blur-[120px] -ml-64 -mb-64" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6 leading-none">
                        The Thinkskool <br/><span className="text-blue-600">Pedagogy</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                </motion.div>

                <div className="space-y-12 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        At Thinkskool, we are redefining how the next generation of engineers is trained. Our approach is rooted in the belief that the traditional academic system often focuses too heavily on abstract concepts, leaving students unprepared for the high-intensity demands of the modern industrial tech landscape. We bridge this gap through a curriculum that is 100% project-based and immersion-driven.
                    </motion.p>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        Every student at Thinkskool is treated like an engineer from day one. Instead of passive lectures, our sessions are structured as "sprints," where students tackle real-world problems using industry-standard tools like Git, Docker, and various Cloud Architectures. From building <span className="text-blue-600 font-bold">Autonomous Robotics</span> to architecting <span className="text-blue-600 font-bold">Scalable Web Systems</span> and <span className="text-blue-600 font-bold">AI Models</span>, our students gain practical experience that is years ahead of their peers.
                    </motion.p>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        We focus on "First Principles Thinking." We don't just teach you how to use a library; we teach you why it works and how to build your own. This deep understanding of technical architecture is what separates a developer from a high-level engineer. Our specialization tracks are carefully curated by industry veterans who have built systems at production scale, ensuring that every lesson is relevant to the global tech economy.
                    </motion.p>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        Mentorship is the cornerstone of the Thinkskool experience. Our students work in small squads, led by experienced mentors who provide personalized guidance, code reviews, and career coaching. This mimicry of a real-world engineering department prepares students for the collaborative and high-stakes environment of top-tier technology companies.
                    </motion.p>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        Our commitment to excellence extends to our community. Thinkskool is not just a school; it's an ecosystem of innovators, builders, and dreamers. Through our national hackathons and project showcases, we provide students with a platform to exhibit their work to industry experts and potential employers.
                    </motion.p>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-slate-900 font-black italic"
                    >
                        Join us in architecting the future of engineering excellence.
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 inline-flex items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 shadow-xl"
                >
                    <div className="text-5xl font-black text-blue-600 tracking-tighter">1000+</div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] leading-tight text-left">
                        Students Trained <br/> & Deployed Globally
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SEOContentSection;
