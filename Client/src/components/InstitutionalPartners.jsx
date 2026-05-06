import React from 'react';
import { motion } from 'framer-motion';
import { LogoLoop } from './common/LogoLoop';
import useIsMobile from '../hooks/useIsMobile';

const partnerSchools = [
    { 
        node: <div className="text-xl md:text-2xl font-black text-white/90 tracking-tighter whitespace-nowrap flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] text-white">DPS</div>
            Delhi Public School
        </div>, 
        title: "DPS" 
    },
    { 
        node: <div className="text-xl md:text-2xl font-black text-white/90 tracking-tighter whitespace-nowrap flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-[10px] text-white">S</div>
            StepUp School
        </div>, 
        title: "StepUp" 
    },
    { 
        node: <div className="text-xl md:text-2xl font-black text-white/90 tracking-tighter whitespace-nowrap flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-[10px] text-white">H</div>
            Heritage International
        </div>, 
        title: "Heritage" 
    },
    { 
        node: <div className="text-xl md:text-2xl font-black text-white/90 tracking-tighter whitespace-nowrap flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-[10px] text-white">SN</div>
            Shiv Nadar School
        </div>, 
        title: "Shiv Nadar" 
    },
];

const InstitutionalPartners = ({ variant = 'dark' }) => {
    const isMobile = useIsMobile();
    const isDark = variant === 'dark';

    return (
        <section className={`w-full py-16 md:py-24 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-white'}`}>
            {/* Background Accents */}
            {isDark && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent" />
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className={`text-3xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                        Official Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Partners</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`mt-4 text-sm md:text-base font-medium max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                        Our specialized summer programs and bootcamps are trusted by India's leading educational institutions to deliver future-ready technology training.
                    </motion.p>
                </div>

                <div className="relative py-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl overflow-hidden">
                    <LogoLoop
                        logos={partnerSchools}
                        speed={35}
                        direction="left"
                        logoHeight={isMobile ? 32 : 48}
                        gap={isMobile ? 60 : 100}
                        pauseOnHover={true}
                        fadeOut={true}
                        fadeOutColor={isDark ? "#000000" : "#FFFFFF"}
                        ariaLabel="Partner schools"
                    />
                </div>
            </div>
        </section>
    );
};

export default InstitutionalPartners;
