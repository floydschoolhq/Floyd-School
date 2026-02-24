import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, Globe } from 'lucide-react';

const ModelCard = ({ model, idx, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15 }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="group relative bg-white rounded-[2rem] p-8 border border-[#FBEFEF] shadow-sm hover:shadow-lg hover:border-[#2563EB]/20 transition-all duration-400 overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-40 h-40 -mr-12 -mt-12 bg-[#2563EB]/5 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />

        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-5 bg-blue-50 text-[#2563EB] border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mr-2 animate-pulse" />
            {model.badge}
        </div>

        <div className="mb-6">
            <h3 className="text-3xl font-black text-slate-900 font-['Outfit'] uppercase leading-none tracking-tight">{model.title}</h3>
            <p className="text-[#2563EB] font-bold text-xs tracking-widest mt-2 uppercase font-['Outfit']">{model.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
            {model.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3">
                    <div className="w-[3px] h-5 bg-[#2563EB] rounded-full" />
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest font-['Outfit']">{feature}</span>
                </div>
            ))}
        </div>

        <button
            onClick={onClick}
            className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 bg-[#2563EB]/5 text-[#2563EB] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] group/btn"
        >
            <span>{model.cta}</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
            color: "from-[#2563EB] via-blue-500 to-[#2563EB]",
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
            subtitle: "Global Mastery",
            color: "from-[#2563EB] via-indigo-500 to-[#2563EB]",
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
        <section className="relative bg-[#FCF8F8] py-16 overflow-hidden border-t border-[#FBEFEF]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[10px] mb-3 font-['Outfit']"
                    >
                        Two Paths. One Destination.
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase font-['Outfit']"
                    >
                        Delivery <span className="text-[#2563EB]">Models.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {models.map((model, idx) => (
                        <ModelCard
                            key={model.id}
                            model={model}
                            idx={idx}
                            onClick={() => idx === 0 ? navigate('/school-partnerships') : navigate('/online-program')}
                        />
                    ))}
                </div>

                {/* Bottom Note */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 p-6 bg-white border border-[#FBEFEF] rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-2xl flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-[#2563EB]" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-slate-900 uppercase font-['Outfit'] tracking-tight">United Industrial Ecosystem</h4>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Connecting Local Institutes to Global Opportunities</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default DualModelSection;
