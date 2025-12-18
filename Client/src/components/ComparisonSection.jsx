import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check, X, TrendingUp, TrendingDown, Sparkles, Award, Users, Zap, Target, Trophy, Clock, DollarSign } from 'lucide-react';

const ComparisonSection = () => {
    const [hoveredSide, setHoveredSide] = useState(null);

    // Extended journey with more detailed stages
    const traditionalJourney = [
        {
            stage: "Month 1",
            title: "Theory Focus",
            outcome: "Textbook Reading",
            progress: 15,
            details: ["Passive lectures", "No hands-on practice", "Theory-heavy content"],
            metric: "15% Engagement"
        },
        {
            stage: "Month 2",
            title: "Basic Learning",
            outcome: "Memorization Focus",
            progress: 30,
            details: ["Rote learning", "Limited understanding", "Exam-oriented"],
            metric: "30% Retention"
        },
        {
            stage: "Month 3",
            title: "Mid-Level",
            outcome: "Theoretical Projects",
            progress: 45,
            details: ["Outdated examples", "No real-world exposure", "Isolated learning"],
            metric: "45% Skill Gap"
        },
        {
            stage: "Month 4",
            title: "Course End",
            outcome: "Certificate Only",
            progress: 55,
            details: ["Focus on grades", "Limited practical skills", "No industry tools"],
            metric: "55% Job Ready"
        },
        {
            stage: "Month 5+",
            title: "Job Hunt",
            outcome: "Rejection Phase",
            progress: 60,
            details: ["Skill gap means rejection", "Need additional training", "Low confidence"],
            metric: "60% Market Value"
        },
        {
            stage: "Month 6+",
            title: "Job Search",
            outcome: "Struggle & Upskill",
            progress: 65,
            details: ["Bootcamps needed", "Self-learning required", "Delayed career start"],
            metric: "6-12 months delay"
        }
    ];

    const thinkskoolJourney = [
        {
            stage: "Month 1",
            title: "Immersive Start",
            outcome: "Live Coding Platform",
            progress: 35,
            details: ["Interactive IDE", "Real-time feedback", "Mentor support 24/7"],
            benefit: "Instant clarity",
            metric: "85% Engagement"
        },
        {
            stage: "Month 2",
            title: "Skill Building",
            outcome: "Project-Based Learning",
            progress: 55,
            details: ["Build 5+ real projects", "Industry-standard tools", "Peer collaboration"],
            benefit: "Portfolio ready",
            metric: "90% Retention"
        },
        {
            stage: "Month 3",
            title: "Advanced Mastery",
            outcome: "Production-Grade Apps",
            progress: 75,
            details: ["Deploy live applications", "Cloud infrastructure", "Best practices"],
            benefit: "Job-ready skills",
            metric: "95% Competency"
        },
        {
            stage: "Month 4",
            title: "Specialization",
            outcome: "Industry Expertise",
            progress: 90,
            details: ["Advanced frameworks", "System design", "Interview prep"],
            benefit: "Stand out",
            metric: "98% Confidence"
        },
        {
            stage: "Month 4 (End)",
            title: "Career Launch",
            outcome: "Job Placement Ready",
            progress: 100,
            details: ["Complete portfolio", "Interview mastery", "Industry connections"],
            benefit: "Dream job",
            metric: "100% Ready"
        },
        {
            stage: "Month 5",
            title: "Career Success",
            outcome: "Thriving Professional",
            progress: 100,
            details: ["High-paying role", "Continuous growth", "Mentor others"],
            benefit: "Career growth",
            metric: "Immediate placement"
        }
    ];

    const benefits = [
        { icon: Users, title: "Expert Mentors", desc: "Expert guidance anytime", color: "orange" },
        { icon: Zap, title: "Live Projects", desc: "Real-world experience", color: "orange" },
        { icon: Award, title: "Certifications", desc: "Industry recognized", color: "orange" },
        { icon: Trophy, title: "Job Guarantee", desc: "Placement support", color: "orange" },
        { icon: Clock, title: "Lifetime Access", desc: "Learn at your pace", color: "orange" },
        { icon: DollarSign, title: "High ROI", desc: "10x salary potential", color: "orange" }
    ];

    const TiltCard = ({ children, className }) => {
        const x = useMotionValue(0);
        const y = useMotionValue(0);

        const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
        const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

        function handleMouseMove({ currentTarget, clientX, clientY }) {
            const { left, top, width, height } = currentTarget.getBoundingClientRect();
            const xPct = (clientX - left) / width - 0.5;
            const yPct = (clientY - top) / height - 0.5;

            x.set(xPct);
            y.set(yPct);
        }

        function handleMouseLeave() {
            x.set(0);
            y.set(0);
        }

        const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17deg", "-17deg"]);
        const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17deg", "17deg"]);

        return (
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={className}
            >
                <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
                    {children}
                </div>
            </motion.div>
        );
    };

    return (
        <section className="relative bg-gradient-to-b from-white via-slate-50 to-white py-16 overflow-hidden font-['Inter']">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-40 left-10 w-96 h-96 bg-slate-200 rounded-full blur-3xl"></div>
                <div className="absolute top-[60%] right-10 w-[500px] h-[500px] bg-[#fca96d]/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-40 left-20 w-80 h-80 bg-slate-100 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-[#fca96d] font-black uppercase tracking-[0.4em] text-[10px] mb-4 font-['Outfit']">Benchmark Analysis</p>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-['Outfit']">
                        Strategic <span className="text-[#fca96d]">Technical</span> Evolution
                    </h2>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        A Comparative Analysis of Conventional Pedagogy vs. The ThinkSkool Immersive Engineering Framework.
                    </p>
                </motion.div>

                {/* Split Screen Comparison - Extended */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">

                    {/* LEFT SIDE - Traditional */}
                    <div
                        onMouseEnter={() => setHoveredSide('traditional')}
                        onMouseLeave={() => setHoveredSide(null)}
                        className="relative bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1)] transition-all duration-500"
                    >
                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="px-4 py-2 bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                Traditional Way
                            </span>
                            <TrendingDown className="text-slate-400" size={20} />
                        </div>

                        {/* Journey Path */}
                        <div className="space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-slate-300"></div>

                            {traditionalJourney.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="relative pl-14"
                                >
                                    {/* Stage Dot */}
                                    <div className="absolute left-[17px] top-3 w-4 h-4 rounded-full bg-slate-400 border-4 border-slate-100"></div>

                                    {/* Content Card */}
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="mb-2">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-['Outfit']">{step.stage}</p>
                                            <p className="text-xs font-black text-slate-600 mb-1 font-['Outfit']">{step.title}</p>
                                            <p className="text-sm font-black text-slate-800 font-['Outfit']">{step.outcome}</p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 mb-3">
                                            {step.details.map((detail, i) => (
                                                <motion.div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                                                    <X size={10} className="text-slate-400 shrink-0" />
                                                    <span>{detail}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Metric Badge */}
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full mb-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 font-['Inter']">{step.metric}</p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${step.progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.08 + 0.2, duration: 0.8 }}
                                                className="bg-slate-400 h-1.5 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Final Outcome */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-6 p-4 bg-slate-200/70 rounded-xl border-2 border-slate-300 font-['Outfit']"
                        >
                            <div className="text-center">
                                <p className="text-sm font-black text-slate-700 mb-1">Final Result</p>
                                <p className="text-xs text-slate-600 font-medium">Limited job prospects, skill gaps, need additional training</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE - ThinkSkool */}
                    <div
                        onMouseEnter={() => setHoveredSide('thinkskool')}
                        onMouseLeave={() => setHoveredSide(null)}
                        className="relative bg-white rounded-[2.5rem] p-10 border border-[#fca96d]/10 shadow-[0_20px_40px_-15px_rgba(252,169,109,0.08)] hover:shadow-[0_30px_60px_-12px_rgba(252,169,109,0.15)] transition-all duration-500"
                    >
                        {/* Glow Effect */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl pointer-events-none"></div>

                        {/* Header Badge */}
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <span className="px-4 py-2 bg-[#fca96d] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2">
                                <Sparkles size={12} />
                                ThinkSkool Way
                            </span>
                            <TrendingUp className="text-[#fca96d]" size={20} />
                        </div>

                        {/* Journey Path */}
                        <div className="space-y-6 relative z-10">
                            {/* Vertical Line - Gradient */}
                            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-amber-300 via-amber-400 to-[#fca96d]"></div>

                            {thinkskoolJourney.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: idx * 0.08 }}
                                    className="relative pl-14"
                                >
                                    {/* Stage Dot - Animated */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
                                        className="absolute left-[17px] top-3 w-4 h-4 rounded-full bg-[#fca96d] border-4 border-[#fca96d]/10 shadow-sm"
                                    ></motion.div>

                                    {/* Content Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className="bg-white rounded-xl p-4 border border-[#fca96d]/20 shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="mb-2">
                                            <p className="text-[10px] text-[#fca96d] font-black uppercase tracking-widest font-['Outfit']">{step.stage}</p>
                                            <p className="text-xs font-black text-[#fca96d] mb-1 font-['Outfit']">{step.title}</p>
                                            <p className="text-sm font-black text-slate-900 font-['Outfit']">{step.outcome}</p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-1 mb-3">
                                            {step.details.map((detail, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="flex items-center gap-2 text-xs text-slate-700 font-medium"
                                                >
                                                    <Check size={10} className="text-[#fca96d] shrink-0" />
                                                    <span>{detail}</span>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Benefit & Metric Badges */}
                                        <div className="flex flex-wrap gap-2 font-['Inter']">
                                            <div className="inline-block px-3 py-1 bg-slate-900 rounded-full">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white">{step.benefit}</p>
                                            </div>
                                            <div className="inline-block px-3 py-1 bg-[#fca96d]/10 rounded-full">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#fca96d]">{step.metric}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar - Gradient */}
                                        <div className="w-full bg-[#fca96d]/10 rounded-full h-1.5 mt-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${step.progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.08 + 0.2, duration: 0.8 }}
                                                className="bg-gradient-to-r from-[#fca96d] to-[#fca96d] h-1.5 rounded-full"
                                            ></motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Final Outcome */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="mt-6 p-5 bg-gradient-to-r from-[#fca96d] to-[#fca96d] rounded-xl shadow-lg relative overflow-hidden z-10"
                        >
                            <div className="text-center relative z-10">
                                <p className="text-sm font-black text-white mb-2">Exceptional Outcome</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/80">100% Industry Ready • High-Paying Jobs • Career Success</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <h3 className="text-2xl font-black text-center text-slate-900 mb-8 font-['Outfit']">
                        Why <span className="text-[#fca96d]">Ambitious Students</span> Choose Us
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {benefits.map((benefit, idx) => (
                            <TiltCard
                                key={idx}
                                className="bg-white rounded-xl p-4 text-center border border-[#fca96d]/20 shadow-sm hover:shadow-2xl transition-all cursor-pointer relative h-full flex flex-col justify-center items-center"
                            >
                                <benefit.icon className="w-10 h-10 text-[#fca96d] mx-auto mb-3" />
                                <p className="text-sm font-black text-slate-900 mb-2">{benefit.title}</p>
                                <p className="text-xs text-slate-600 font-medium">{benefit.desc}</p>
                            </TiltCard>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-[#fca96d] to-[#fca96d] rounded-2xl p-8 shadow-xl">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 font-['Outfit']">
                            Ready to Transform Your Future?
                        </h3>
                        <p className="text-white/80 text-xs font-black uppercase tracking-[0.4em] mb-6 max-w-2xl mx-auto font-['Inter']">
                            Join thousands of students who chose the smarter path to success
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl transition-all font-['Outfit']"
                        >
                            Start Your Journey Today
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ComparisonSection;
