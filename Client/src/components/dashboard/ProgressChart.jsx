import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const ProgressChart = ({ progress, title, subtitle, color = "#0ea5e9" }) => {
    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-32 h-32 mb-4">
                <CircularProgressbar
                    value={progress}
                    text={`${progress}%`}
                    styles={buildStyles({
                        textColor: '#fff',
                        pathColor: color,
                        trailColor: '#1e293b',
                        textSize: '20px'
                    })}
                />
            </div>
            {title && (
                <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            )}
            {subtitle && (
                <p className="text-sm text-slate-400">{subtitle}</p>
            )}
        </motion.div>
    );
};
