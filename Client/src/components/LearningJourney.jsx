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
        id: "demo-bootcamp",
        icon: Video,
        tag: "Phase 01",
        title: "Demo Bootcamp",
        description: "Experience our elite ecosystem with a high-impact intro.",
        features: [
            "Live Interaction",
            "Tech Preview",
            "System Audit"
        ],
        highlight: "Elite Entry",
        color: "blue"
    },
    {
        id: "course-selection",
        icon: Target,
        tag: "Phase 02",
        title: "Course Selection",
        description: "Personalized pathways selected by students for their goals.",
        features: [
            "Aptitude Map",
            "Goal Alignment",
            "Expert Guide"
        ],
        highlight: "Smart Choice",
        color: "indigo"
    },
    {
        id: "live-sessions",
        icon: MessageSquare,
        tag: "Phase 03",
        title: "Live Sessions",
        description: "Interactive expert-led sessions building production-grade logic.",
        features: [
            "Real-time Coding",
            "Doubt Clearance",
            "Architectural Depth"
        ],
        highlight: "Expert Led",
        color: "emerald"
    },
    {
        id: "real-world-projects",
        icon: Monitor,
        tag: "Phase 04",
        title: "Real World Projects",
        description: "Production implementation and industrial project learning.",
        features: [
            "Industrial Flow",
            "Real-world APIs",
            "Career Verified"
        ],
        highlight: "Industrial",
        color: "blue"
    }
];

const JourneyCard = ({ step, idx, isEven }) => {
    const navigate = useNavigate();
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [8, -8]);
    const rotateY = useTransform(x, [-100, 100], [-8, 8]);

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
        <div className="relative flex items-center justify-center lg:justify-start lg:odd:justify-start lg:even:justify-end py-6">
            <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                style={{ rotateX, rotateY, perspective: 1200 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => navigate('/online-program')}
                className="w-full lg:w-[45%] relative z-10 cursor-pointer"
            >
                <div
                    className="p-[1px] bg-gradient-to-br from-white/20 to-transparent hover:from-blue-500/40 transition-all duration-700 group relative overflow-hidden rounded-[2rem]"
                >
                    {/* Spotlight Glow */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                            background: useTransform(
                                [x, y],
                                ([latestX, latestY]) => `radial-gradient(500px circle at ${latestX + 250}px ${latestY + 180}px, rgba(37, 99, 235, 0.12), transparent)`
                            )
                        }}
                    />

                    <div
                        className="bg-slate-900/60 backdrop-blur-3xl p-6 md:p-8 border border-white/10 group-hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative z-10 rounded-[2rem]"
                    >
                        <div className="flex flex-col items-center text-center mb-4">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-3 block px-3 py-1 bg-blue-500/5 rounded-full border border-blue-500/10">
                                {step.tag}
                            </span>
                            <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-500">
                                {step.title}
                            </h3>
                        </div>

                        <p className="text-slate-400 text-[15px] font-medium leading-relaxed mb-6 text-center opacity-90">
                            {step.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
                            {step.features.map((feature, fIdx) => (
                                <motion.span
                                    key={fIdx}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(37, 99, 235, 0.15)" }}
                                    className="px-4 py-1.5 bg-white/5 rounded-xl text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-white/5 transition-all"
                                >
                                    {feature}
                                </motion.span>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-500/50 uppercase tracking-widest">{step.highlight}</span>
                            <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-slate-500 group-hover:text-blue-400 transition-colors"
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Timeline Node Connector */}
                <div className={`absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center ${isEven ? 'left-full ml-4' : 'right-full mr-4'}`}>
                    <div className="w-8 h-px bg-white/10 group-hover:bg-blue-500/40 transition-colors duration-500" />
                    <motion.div
                        whileHover={{ scale: 1.4 }}
                        className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-slate-700 transition-all duration-500 group-hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
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
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 mb-6"
                    >
                        <Zap className="w-4 h-4 text-blue-400" />
                        <span className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.3em]">The ThinkSkool Experience</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight"
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="mt-20 p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-blue-600/80 to-indigo-800/80 backdrop-blur-3xl relative overflow-hidden group border border-white/10 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)]"
                >
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                                Beyond Generic Coding <br /><span className="text-blue-200/80">The AI Architect Era</span>
                            </h3>
                            <p className="text-blue-50/80 text-base md:text-lg leading-relaxed mb-10 font-medium">
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
                                { label: "Live Demo", value: "Elite" },
                                { label: "Smart Map", value: "Native" },
                                { label: "Expert Led", value: "Interactive" },
                                { label: "Real Builds", value: "Industrial" }
                            ].map((stat, sIdx) => (
                                <motion.div
                                    key={sIdx}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                    className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500"
                                >
                                    <div className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-2 opacity-60">{stat.label}</div>
                                    <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
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
