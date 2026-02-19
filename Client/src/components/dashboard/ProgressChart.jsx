import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const ProgressChart = ({ progress, title, subtitle, color = "var(--accent-primary)" }) => {
    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="w-40 h-40 mb-6 drop-shadow-2xl">
                <CircularProgressbar
                    value={progress}
                    text={`${progress}%`}
                    strokeWidth={10}
                    styles={buildStyles({
                        textColor: 'var(--text-main)',
                        pathColor: color,
                        trailColor: 'var(--surface-el)',
                        textSize: '22px',
                        strokeLinecap: 'round',
                        pathTransitionDuration: 1.5,
                    })}
                />
            </div>
            {title && (
                <h3 className="text-xl font-black text-text-main mb-1 font-['Outfit'] tracking-tight transition-colors duration-500">{title}</h3>
            )}
            {subtitle && (
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted transition-colors duration-500">{subtitle}</p>
            )}
        </motion.div>
    );
};
