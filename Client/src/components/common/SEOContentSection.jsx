import React from 'react';
import { motion } from 'framer-motion';

const SEOContentSection = () => {
    return (
        <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -ml-48 -mb-48" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-none">
                            The Thinkskool <br/><span className="text-blue-600">Pedagogy</span>
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                            <p>
                                At Thinkskool, we are redefining how the next generation of engineers is trained. Our approach is rooted in the belief that the traditional academic system often focuses too heavily on abstract concepts, leaving students unprepared for the high-intensity demands of the modern industrial tech landscape. We bridge this gap through a curriculum that is 100% project-based and immersion-driven.
                            </p>
                            <p>
                                Every student at Thinkskool is treated like an engineer from day one. Instead of passive lectures, our sessions are structured as "sprints," where students tackle real-world problems using industry-standard tools like Git, Docker, and various Cloud Architectures. From building <span className="text-blue-600 font-bold">Autonomous Robotics</span> to architecting <span className="text-blue-600 font-bold">Scalable Web Systems</span> and <span className="text-blue-600 font-bold">AI Models</span>, our students gain practical experience that is years ahead of their peers.
                            </p>
                            <p>
                                We focus on "First Principles Thinking." We don't just teach you how to use a library; we teach you why it works and how to build your own. This deep understanding of technical architecture is what separates a developer from a high-level engineer. Our specialization tracks are carefully curated by industry veterans who have built systems at production scale, ensuring that every lesson is relevant to the global tech economy.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed lg:pt-[104px]">
                        <p>
                            Mentorship is the cornerstone of the Thinkskool experience. Our students work in small squads, led by experienced mentors who provide personalized guidance, code reviews, and career coaching. This mimicry of a real-world engineering department prepares students for the collaborative and high-stakes environment of top-tier technology companies.
                        </p>
                        <p>
                            Our commitment to excellence extends to our community. Thinkskool is not just a school; it's an ecosystem of innovators, builders, and dreamers. Through our national hackathons and project showcases, we provide students with a platform to exhibit their work to industry experts and potential employers. This early exposure to professional networks is invaluable, often leading to internships and career opportunities long before graduation.
                        </p>
                        <p>
                            Whether you are a student looking to master a new craft or a school administrator seeking to elevate your institution's technical standard, Thinkskool provides the tools, expertise, and environment for true technical mastery. Join us in architecting the future of engineering excellence.
                        </p>
                        <div className="pt-8">
                            <div className="inline-flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="text-3xl font-black text-blue-600 tracking-tighter">1000+</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                                    Students Trained <br/> Globally
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SEOContentSection;
