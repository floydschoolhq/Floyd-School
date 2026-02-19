import React from 'react';
import { motion, animate } from 'framer-motion';
import { cn } from '../../lib/utils';

export const GradientCard = ({
    children,
    className,
    gradient = "from-accent-primary via-accent-secondary to-accent-primary",
}) => {
    return (
        <motion.div
            className={cn(
                "relative p-8 rounded-[2.5rem] bg-surface-base border border-surface-el shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden group transition-all duration-500",
                className
            )}
            whileHover={{
                y: -10,
                shadow: "0 30px 60px -12px rgba(0,0,0,0.1), 0 18px 36px -18px rgba(0,0,0,0.05)",
                transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
            }}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Dynamic Accented Boundary */}
            <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:w-2",
                gradient
            )} />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export const StatCard = ({ title, value, icon: Icon, gradient, change }) => {
    const [displayValue, setDisplayValue] = React.useState(0);
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
    const suffix = typeof value === 'string' ? value.replace(/[\d.-]/g, '') : '';

    React.useEffect(() => {
        const controls = animate(0, numericValue, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(Math.floor(latest))
        });
        return () => controls.stop();
    }, [numericValue]);

    return (
        <GradientCard gradient={gradient} className="flex items-center justify-between p-7">
            <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-text-muted mb-2">{title}</p>
                <h3 className="text-4xl font-black text-text-main tracking-tighter transition-colors duration-500">
                    {displayValue}{suffix}
                </h3>
                {change && (
                    <p className={cn(
                        "text-[10px] mt-2 font-black uppercase tracking-widest flex items-center gap-1",
                        change > 0 ? "text-emerald-500" : "text-accent-primary"
                    )}>
                        {change > 0 ? "↑" : "↓"} {Math.abs(change)}% Intensity
                    </p>
                )}
            </div>
            {Icon && (
                <div className={cn(
                    "p-5 rounded-2xl bg-surface-soft text-text-main border border-surface-el group-hover:bg-text-main group-hover:text-surface-base transition-all duration-500 group-hover:scale-110 shadow-sm"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            )}
        </GradientCard>
    );
};
