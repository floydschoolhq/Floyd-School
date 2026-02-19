import React from 'react';
import { motion } from 'framer-motion';
import { School, Globe, Zap, Target, Users, Rocket, ArrowRight } from 'lucide-react';

const DualModelSection = () => {
    const models = [
        {
            id: 'school',
            title: "School Bootcamps",
            subtitle: "On-Campus Excellence",
            description: "We bring elite engineering talent directly to your school's labs. Intensive, week-long technical deep dives where students build production-grade projects in their familiar environment.",
            icon: <School className="w-8 h-8" />,
            color: "from-blue-600 to-blue-400",
            features: [
                "Expert Mentors On-Site",
                "Zero Setup Overhead",
                "School Schedule Alignment",
                "Institutional Certification"
            ],
            cta: "Partner Your School",
            badge: "Offline / On-Campus"
        },
        {
            id: 'independent',
            title: "ThinkSkool Pulse",
            subtitle: "Independent Mastery",
            description: "A high-octane online journey for students who want to master technology at their own pace. Access our world-class curriculum, industry mentors, and production IDE from anywhere in the world.",
            icon: <Globe className="w-8 h-8" />,
            color: "from-slate-800 to-slate-600",
            features: [
                "Flexible Learning Hours",
                "Global Student Community",
                "1-on-1 Dedicated Support",
                "Industry-Standard Projects"
            ],
            cta: "Enroll Independently",
            badge: "Online / 100% Remote"
        }
    ];

    return (
        <section className="relative bg-[#FCF8F8] py-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#2563EB]/10 to-transparent hidden lg:block" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-24">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-4"
                    >
                        Our Delivery Framework
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']"
                    >
                        Two Paths. <br className="md:hidden" /> One <span className="text-[#2563EB]">Destination.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 text-slate-500 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Whether through your institution or direct online access, we ensure the same elite standard of technical education.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
                    {models.map((model, idx) => (
                        <motion.div
                            key={model.id}
                            initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="group"
                        >
                            <div className="relative p-10 md:p-14 bg-white rounded-[3.5rem] border border-[#FBEFEF] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.05)] hover:shadow-[0_50px_100px_-20px_rgba(37,99,235,0.1)] transition-all duration-700">
                                {/* Accent Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700 rounded-[3.5rem]`} />

                                {/* Badge */}
                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-10 ${idx === 0 ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-slate-100 text-slate-600'}`}>
                                    {model.badge}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${model.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                        {model.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-900 font-['Outfit'] uppercase">{model.title}</h3>
                                        <p className="text-[#2563EB] font-bold text-sm tracking-wide">{model.subtitle}</p>
                                    </div>
                                </div>

                                <p className="text-slate-500 leading-relaxed mb-10 font-medium text-lg">
                                    {model.description}
                                </p>

                                <div className="space-y-4 mb-12">
                                    {model.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full ${idx === 0 ? 'bg-blue-50 text-[#2563EB]' : 'bg-slate-50 text-slate-600'} flex items-center justify-center`}>
                                                <Target size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        const el = document.getElementById('registration-form');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 ${idx === 0
                                            ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/30 hover:bg-blue-700 hover:-translate-y-1'
                                            : 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1'
                                        }`}
                                >
                                    {model.cta}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Integration Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 p-8 bg-white border border-[#FBEFEF] rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
                >
                    <div className="flex items-center gap-6 text-center md:text-left">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-slate-900 uppercase font-['Outfit']">United Ecosystem</h4>
                            <p className="text-slate-500 text-sm font-medium">Both paths gain full access to the ThinkSkool Portal, Industrial Mentors, and our Production Lab environments.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;
