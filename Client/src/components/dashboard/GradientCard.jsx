import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const GradientCard = ({
    children,
    className,
    gradient = "from-blue-500 via-purple-500 to-blue-500",
}) => {
    return (
        <motion.div
            className={cn(
                "relative p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden group",
                className
            )}
            whileHover={{
                y: -6,
                shadow: "0 30px 60px -12px rgba(0,0,0,0.1), 0 18px 36px -18px rgba(0,0,0,0.05)",
                transition: { duration: 0.4, ease: "easeOut" }
            }}
        >
            {/* Subtle Gradient Accent */}
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b opacity-100 transition-all duration-500 group-hover:w-2",
                gradient
            )} />

            {/* Content */}
            <div className="relative z-10 font-['Inter']">
                {children}
            </div>
        </motion.div>
    );
};

export const StatCard = ({ title, value, icon: Icon, gradient, change }) => {
    return (
        <GradientCard gradient={gradient} className="flex items-center justify-between p-7">
            <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-2 font-['Outfit']">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter font-['Outfit']">{value}</h3>
                {change && (
                    <p className={cn(
                        "text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1",
                        change > 0 ? "text-emerald-500" : "text-blue-500"
                    )}>
                        {change > 0 ? "↑" : "↓"} {Math.abs(change)}% Growth
                    </p>
                )}
            </div>
            {Icon && (
                <div className={cn(
                    "p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 group-hover:scale-110 shadow-sm"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            )}
        </GradientCard>
    );
};
