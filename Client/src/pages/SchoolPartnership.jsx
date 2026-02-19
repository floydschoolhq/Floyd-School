import React from 'react';
import { motion } from 'framer-motion';
import { School, CheckCircle, Clock, BookOpen, ArrowRight, Sparkles, Target, Zap, Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeadFormModal from '../components/LeadFormModal';
import Brochure from '../assets/pdf/Brochure.pdf';
import SectionHeader from '../components/common/SectionHeader';
import { timelineSteps, valueProps } from '../constants/siteData';

const IconMap = {
    Zap, Users, Clock, BookOpen, ShieldCheck, Target, GraduationCap, School
};

const SchoolPartnership = () => {
    const navigate = useNavigate();
    const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);

    const openLeadModal = () => setIsLeadModalOpen(true);

    const handleBrochureDownload = () => {
        // Open in new tab
        window.open(Brochure, '_blank', 'noopener,noreferrer');

        // Trigger download
        const link = document.createElement('a');
        link.href = Brochure;
        link.download = "ThinkSkool_Brochure.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderIcon = (iconName, className) => {
        const IconComponent = IconMap[iconName] || School;
        return <IconComponent className={className} />;
    };

    return (
        <div className="min-h-screen bg-[#FCF8F8] font-['Inter'] relative overflow-x-hidden pt-24">

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-full mb-10 shadow-sm"
                    >
                        <School className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600 font-['Outfit']">Official Institutional Partner</span>
                    </motion.div>

                    <SectionHeader
                        title={<span>The Engineering <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">Center of Excellence</span></span>}
                        description={<span>Establish a world-class engineering department inside your campus with <span className="text-slate-900 font-bold decoration-blue-200 underline decoration-4 underline-offset-4">zero disruption</span> to your academic calendar.</span>}
                        light={true}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={openLeadModal}
                            className="w-full md:w-auto px-10 py-4 bg-[#2D2D2D] text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl font-['Outfit']"
                        >
                            Schedule Principal's Briefing
                        </button>
                        <button
                            onClick={handleBrochureDownload}
                            className="w-full md:w-auto px-10 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all font-['Outfit'] flex items-center justify-center gap-2"
                        >
                            Download Brochure
                            <ArrowRight size={14} />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Timeline Integration Section */}
            <div className="bg-white py-32 border-y border-slate-100 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight font-['Outfit'] mb-6">The Zero-Friction Integration Model</h2>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                            We understand schools. That's why we designed a process that respects your existing schedule and administrative load.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {timelineSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative z-10 group"
                                >
                                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white text-white`}>
                                        {renderIcon(step.icon, "w-5 h-5")}
                                    </div>
                                    <div className="bg-[#FCF8F8] p-8 rounded-3xl border border-slate-100 h-full hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                        <div className="inline-block px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border border-slate-100 font-['Outfit']">
                                            {step.phase}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-1 font-['Outfit']">{step.title}</h3>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-['Outfit']">{step.subtitle}</h4>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Schools Choose Us */}
            <div className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight font-['Outfit'] mb-8 leading-tight">
                            Why Top Schools Are <br />
                            <span className="text-[#2563EB]">Partnering With Us</span>
                        </h2>
                        <div className="space-y-10">
                            {valueProps.map((prop, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="flex gap-6"
                                >
                                    <div className="shrink-0 pt-1">
                                        {renderIcon(prop.icon, "w-8 h-8 text-blue-500")}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 mb-3 font-['Outfit']">{prop.title}</h3>
                                        <p className="text-slate-500 leading-relaxed font-medium">
                                            {prop.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-blue-100 rounded-[3rem] transform rotate-3 blur-sm" />
                        <div className="relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
                            <div className="bg-slate-900 rounded-2xl p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <code className="text-sm font-mono text-blue-300">
                                    <span className="text-purple-400">const</span> <span className="text-yellow-300">studentSuccess</span> = <span className="text-purple-400">async</span> () ={">"} {"{"}<br />
                                    &nbsp;&nbsp;<span className="text-purple-400">await</span> school.upgrade(<span className="text-green-300">'ThinkSkool'</span>);<br />
                                    &nbsp;&nbsp;<span className="text-blue-300">return</span> <span className="text-green-300">'Innovation Leader'</span>;<br />
                                    {"}"}
                                </code>
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 mb-2 font-['Outfit']">Board Alignment</h4>
                            <p className="text-slate-500 font-medium mb-6">
                                We aren't just coding. We teach the <span className="text-blue-600 font-bold">Physics</span> of game engines, the <span className="text-purple-600 font-bold">Mathematics</span> of AI, and the <span className="text-blue-600 font-bold">Logic</span> of algorithms.
                            </p>
                            <div className="flex gap-2">
                                {['CBSE', 'ICSE', 'IGCSE', 'IB'].map(board => (
                                    <span key={board} className="px-3 py-1 bg-slate-100 rounded-md text-xs font-black text-slate-500 uppercase tracking-widest">{board}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="py-24 bg-[#2D2D2D] relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 font-['Outfit'] tracking-normal">
                        Innovation Starts with a Conversation
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                        Let's discuss how we can tailor our engineering ecosystem to fit your school's unique vision and limitations.
                    </p>
                    <button
                        onClick={openLeadModal}
                        className="px-12 py-5 bg-[#2563EB] text-slate-900 rounded-xl font-black uppercase text-sm tracking-[0.2em] hover:bg-white transition-all shadow-xl font-['Outfit']"
                    >
                        Get in Touch
                    </button>
                </div>
            </div>

            <LeadFormModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                source="school_partnership"
            />

        </div>
    );
};

export default SchoolPartnership;
