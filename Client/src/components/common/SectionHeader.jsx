import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ subtitle, title, description, light = false, centered = true }) => {
    return (
        <div className={`${centered ? 'text-center' : 'text-left'} mb-16`}>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`${light ? 'text-[#2563EB]' : 'text-[#2563EB]'} font-black uppercase tracking-[0.4em] text-[10px] mb-4`}
                >
                    {subtitle}
                </motion.p>
            )}
            {title && (
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className={`text-4xl md:text-5xl font-black ${light ? 'text-slate-900' : 'text-slate-200'} mb-6 tracking-tight`}
                >
                    {title}
                </motion.h2>
            )}
            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className={`${light ? 'text-slate-600' : 'text-slate-400'} text-lg max-w-2xl ${centered ? 'mx-auto' : ''} font-medium leading-relaxed`}
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};

export default SectionHeader;
