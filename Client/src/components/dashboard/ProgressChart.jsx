import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const ProgressChart = ({ progress, title, subtitle, color = "var(--accent-primary)", isModern=false }) => {
    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className={`w-28 h-28 sm:w-40 sm:h-40 mb-4 sm:mb-6 ${isModern ? '' : 'drop-shadow-2xl'}`}>
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
                <h3 className={isModern ? "text-lg font-semibold text-text-main mb-1" : "text-xl font-black text-text-main mb-1 tracking-tight transition-colors duration-500"}>{title}</h3>
            )}
            {subtitle && (
                <p className={isModern ? "text-xs font-semibold uppercase tracking-wider text-text-muted" : "text-[11px] font-black uppercase tracking-[0.2em] text-text-muted transition-colors duration-500"}>{subtitle}</p>
            )}
        </motion.div>
    );
};


