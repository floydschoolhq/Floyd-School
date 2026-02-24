import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, Globe } from 'lucide-react';
import dualModelBg from '../assets/images/dual-model-bg.png';

const ModelCard = ({ model, idx, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15 }}
        whileHover={{ y: -12, scale: 1.01 }}
        className="group relative bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] p-8 overflow-hidden border border-white/5 shadow-3xl flex flex-col h-full"
    >
        {/* Dynamic Glow Layer */}
        <div className={`absolute -top-32 -right-32 w-80 h-80 ${model.glow} rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000 ease-out`} />
        <div className={`absolute -bottom-32 -left-32 w-64 h-64 ${model.glow} opacity-10 rounded-full blur-[80px] group-hover:translate-x-10 transition-transform duration-1000`} />

        {/* Glass Badge */}
        <div className={`inline-flex items-center self-start px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-12 bg-white/5 backdrop-blur-md border border-white/10 ${model.accent}`}>
            <span className={`w-2 h-2 rounded-full ${model.id === 'school' ? 'bg-blue-500' : 'bg-indigo-500'} mr-3 animate-pulse shadow-[0_0_10px_currentColor]`} />
            {model.badge}
        </div>

        <div className="relative z-10 mb-auto">
            <h3 className="text-3xl font-extrabold text-white uppercase leading-tight tracking-tight mb-3">{model.title}</h3>
            <p className={`${model.accent} font-bold text-[10px] tracking-[0.4em] uppercase mb-8`}>{model.subtitle}</p>

            <div className="grid grid-cols-1 gap-6">
                {model.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-5 group/item">
                        <div className={`w-3 h-3 rounded-md border border-white/10 flex items-center justify-center group-hover/item:border-${model.color}-500/50 transition-colors`}>
                            <div className={`w-1 h-1 rounded-sm bg-${model.color}-400 group-hover/item:scale-150 transition-transform`} />
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest group-hover/item:text-white transition-colors">{feature}</span>
                    </div>
                ))}
            </div>
        </div>

        <button
            onClick={onClick}
            className={`relative z-10 w-full mt-8 py-5 rounded-xl flex items-center justify-center gap-4 font-bold uppercase text-[10px] tracking-[0.4em] transition-all duration-500 bg-white/5 text-white hover:bg-${model.id === 'school' ? 'blue' : 'indigo'}-600 group/btn border border-white/10 hover:border-transparent overflow-hidden shadow-2xl`}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            <span>{model.cta}</span>
            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
    </motion.div>
);

const DualModelSection = () => {
    const navigate = useNavigate();
    const models = [
        {
            id: 'school',
            title: "On-Campus",
            subtitle: "Industrial Bootcamps",
            glow: "bg-blue-600/20",
            accent: "text-blue-400",
            color: "blue",
            features: [
                "Expert Mentors On-Site",
                "Zero Setup Overhead",
                "Industrial Certification"
            ],
            cta: "In-School Batch",
            badge: "Offline"
        },
        {
            id: 'independent',
            title: "Online Live",
            subtitle: "Global Direct Access",
            glow: "bg-indigo-600/20",
            accent: "text-indigo-400",
            color: "indigo",
            features: [
                "Flexible Learning",
                "Global Community",
                "Dedicated Support"
            ],
            cta: "Enroll Now",
            badge: "Online"
        }
    ];

    return (
        <section id="models" className="relative py-14 overflow-hidden bg-slate-950">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={dualModelBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-30 grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-950" />
                <div className="absolute inset-0 bg-slate-950/20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[9px] mb-2 shadow-sm"
                    >
                        Two Paths. One Destination.
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase"
                    >
                        Delivery <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Models.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                    {models.map((model, idx) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            idx={idx}
                            onClick={() => idx === 0 ? navigate('/school-partnerships') : navigate('/online-program')}
                        />
                    ))}
                </div>

                {/* Bottom Note - Bento Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 p-8 bg-slate-950/80 backdrop-blur-xl rounded-[2.5rem] relative overflow-hidden group border border-white/5 shadow-3xl"
                >
                    {/* Depth Layers */}
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] group-hover:bg-blue-600/20 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-20 h-20 bg-[#2563EB] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_50px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-8 h-8 text-white fill-white/20" />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-extrabold text-white uppercase tracking-tight leading-tight mb-2">Industrial Convergence</h4>
                                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.4em] leading-relaxed">Architecting the interface between <br className="hidden md:block" /> academic theory & global industrial ops</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                            <button className="w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-xl font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:shadow-blue-500/20">
                                Join Network
                            </button>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Active nodes: 142</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;

