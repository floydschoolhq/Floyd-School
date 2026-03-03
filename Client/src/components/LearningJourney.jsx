import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import {
    Cloud,
    Users,
    Zap,
    Target,
    MessageSquare,
    Monitor,
    ShieldCheck,
    ArrowRight,
    BrainCircuit,
    Video
} from 'lucide-react';

const JOURNEY_STEPS = [
    {
        id: "infra",
        icon: Cloud,
        tag: "Phase 01",
        title: "Smart Infra",
        description: "High-tech virtual labs. Zero lag. 4K stream.",
        features: [
            "4K Video",
            "Auto-Labs",
            "Live Peer Coding"
        ],
        highlight: "Modern Setup",
        color: "blue"
    },
    {
        id: "teaching",
        icon: Zap,
        tag: "Phase 02",
        title: "Real Builds",
        description: "Stop watching. Start building. Production-scale.",
        features: [
            "100% Projects",
            "Raw Tech",
            "Industrial Flow"
        ],
        highlight: "Expert Led",
        color: "indigo"
    },
    {
        id: "doubts",
        icon: MessageSquare,
        tag: "Phase 03",
        title: "1:1 Support",
        description: "Never stay stuck. Weekly deep-dives. Expert help.",
        features: [
            "1:1 Sessions",
            "Sat Solves",
            "Instant Chat"
        ],
        highlight: "Personal Care",
        color: "emerald"
    },
    {
        id: "ai-worth",
        icon: BrainCircuit,
        tag: "Phase 04",
        title: "AI Native",
        description: "Master AI workflows. Prompt like an architect.",
        features: [
            "AI Workflows",
            "Prompt Eng",
            "Native Logic"
        ],
        highlight: "AI Focused",
        color: "blue"
    }
];

const JourneyCard = ({ step, idx, isEven }) => {
    const navigate = useNavigate();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div className="relative flex items-center justify-center lg:justify-start lg:odd:justify-start lg:even:justify-end py-4">
            <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ rotateX, rotateY, perspective: 1000 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate('/online-program')}
                className="w-full lg:w-[42%] relative z-10 cursor-pointer"
            >
                <div
                    className="p-[1.5px] bg-gradient-to-br from-white/10 to-transparent hover:from-blue-500/30 transition-all duration-500 group relative overflow-hidden rounded-[2.5rem]"
                >
                    {/* Spotlight Glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: useTransform(
                                [x, y],
                                ([latestX, latestY]) => `radial-gradient(400px circle at ${latestX + 200}px ${latestY + 150}px, rgba(37, 99, 235, 0.15), transparent)`
                            )
                        }}
                    />

                    <div
                        className="bg-slate-900/90 backdrop-blur-xl p-4 md:p-5 border border-white/5 group-hover:border-blue-500/40 transition-all shadow-lg relative z-10 rounded-[2.5rem]"
                    >
                        <div className="flex flex-col items-center text-center mb-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none block mb-2">{step.tag}</span>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors leading-tight">
                                    {step.title}
                                </h3>
                            </div>
                        </div>

                        <p className="text-slate-400 text-sm font-bold uppercase tracking-tight mb-3 opacity-80 text-center">
                            {step.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {step.features.map((feature, fIdx) => (
                                <motion.span
                                    key={fIdx}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(37, 99, 235, 0.2)" }}
                                    className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 uppercase tracking-widest border border-white/5 transition-colors"
                                >
                                    {feature}
                                </motion.span>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest italic">{step.highlight}</span>
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-slate-600 group-hover:text-blue-400"
                            >
                                <ArrowRight size={16} />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Timeline Node Connector */}
                <div className={`absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center ${isEven ? 'left-full ml-3' : 'right-full mr-3'}`}>
                    <div className="w-6 h-px bg-white/10 group-hover:bg-blue-500/50 transition-colors" />
                    <motion.div
                        whileHover={{ scale: 1.5 }}
                        className="w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-800 transition-all duration-300 group-hover:border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const LearningJourney = () => {
    const navigate = useNavigate();
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
                    >
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">The ThinkSkool Experience</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight"
                    >
                        Our Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Journey</span>
                    </motion.h2>
                </div>

                {/* Journey Path Container */}
                <div className="relative">
                    {/* Central Snake Line SVG */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-32 hidden lg:block pointer-events-none">
                        <svg width="100%" height="100%" viewBox="0 0 100 600" fill="none" preserveAspectRatio="none">
                            <path
                                d="M50 0 C 100 100, 0 200, 50 300 C 100 400, 0 500, 50 600"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="2"
                                strokeDasharray="6 6"
                            />
                            <motion.path
                                d="M50 0 C 100 100, 0 200, 50 300 C 100 400, 0 500, 50 600"
                                stroke="url(#snake-gradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                style={{
                                    pathLength: pathLength,
                                    filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.4))"
                                }}
                            />
                            <defs>
                                <linearGradient id="snake-gradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563EB" />
                                    <stop offset="50%" stopColor="#4F46E5" />
                                    <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="space-y-2">
                        {JOURNEY_STEPS.map((step, idx) => (
                            <JourneyCard
                                key={step.id}
                                step={step}
                                idx={idx}
                                isEven={idx % 2 === 0}
                            />
                        ))}
                    </div>
                </div>

                {/* Why Enroll Conclusion */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="mt-16 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600/90 to-indigo-700/90 backdrop-blur-xl relative overflow-hidden group border border-white/10 shadow-3xl shadow-blue-500/10"
                >
                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                                Beyond Generic Coding <br /><span className="text-blue-200 opacity-80">The AI Architect Era</span>
                            </h3>
                            <p className="text-blue-50/70 text-sm md:text-base leading-relaxed mb-8">
                                Enrolling with us future-proofs your career with the structural depth and AI-augmented logic required for 2026.
                            </p>
                            <button
                                onClick={() => navigate('/online-program#pricing')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl hover:shadow-white/20 active:scale-95"
                            >
                                Enroll in Journey
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Infrastructure", value: "Elite" },
                                { label: "AI Workflows", value: "Native" },
                                { label: "Mentorship", value: "1:1" },
                                { label: "Readiness", value: "2026" }
                            ].map((stat, sIdx) => (
                                <motion.div
                                    key={sIdx}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                                    className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 transition-colors"
                                >
                                    <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1 opacity-60">{stat.label}</div>
                                    <div className="text-xl font-black text-white uppercase tracking-tighter">{stat.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default LearningJourney;
