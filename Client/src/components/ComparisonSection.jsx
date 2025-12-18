import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const ComparisonSection = () => {
    return (
        <section className="bg-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Traditional vs <span className="text-orange-500">Future-Ready</span>
                    </h2>
                    <p className="text-base text-slate-500 max-w-2xl mx-auto">
                        See the difference between traditional methods and our interactive approach.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch">

                    {/* Traditional Way Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 relative overflow-hidden"
                    >
                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-2 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                Traditional Education
                            </span>
                        </div>

                        <div className="mt-16 mb-8 flex justify-center">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-inner grayscale opacity-50">
                                📚
                            </div>
                        </div>

                        <div className="text-center mb-12">
                            <h3 className="text-2xl font-bold text-slate-400 mb-2">Old Way</h3>
                            <h4 className="text-3xl font-black text-slate-800">Passive Learning</h4>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Static textbooks and memorization",
                                "One-way knowledge transfer",
                                "Limited practical application",
                                "Theory-focused curriculum"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-500 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                        <X size={14} className="text-slate-500" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>


                    {/* ThinkSkool Way Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#FFF8F2] rounded-3xl p-8 md:p-12 border-2 border-orange-100 relative overflow-hidden shadow-xl"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-2 bg-white text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-orange-100">
                                ThinkSkool Way
                            </span>
                        </div>

                        <div className="mt-16 mb-8 flex justify-center relative">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-lg border border-orange-50 z-10"
                            >
                                🚀
                            </motion.div>
                        </div>

                        <div className="text-center mb-12 relative z-10">
                            <h3 className="text-2xl font-bold text-orange-500 mb-2">New Way</h3>
                            <h4 className="text-3xl font-black text-slate-900">Interactive Learning</h4>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {[
                                "Live code execution & 3D simulations",
                                "Hands-on project-based learning",
                                "Real-time feedback & gamification",
                                "Industry-ready skill development"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-800 font-bold">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-md">
                                        <Check size={14} className="text-white" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default ComparisonSection;
