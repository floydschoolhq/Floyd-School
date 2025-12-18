import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const GradientCard = ({
    children,
    className,
    gradient = "from-blue-500 via-purple-500 to-pink-500",
    glowColor = "rgba(59, 130, 246, 0.5)"
}) => {
    return (
        <motion.div
            className={cn(
                "relative p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 overflow-hidden",
                className
            )}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            {/* Gradient border effect */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-20 blur-xl",
                gradient
            )} />

            {/* Glow effect */}
            <div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{
                    background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export const StatCard = ({ title, value, icon: Icon, gradient, change }) => {
    return (
        <GradientCard gradient={gradient} className="group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                    {change && (
                        <p className={cn(
                            "text-sm mt-2",
                            change > 0 ? "text-green-400" : "text-red-400"
                        )}>
                            {change > 0 ? "+" : ""}{change}% from last month
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn(
                        "p-4 rounded-xl bg-gradient-to-br",
                        gradient
                    )}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                )}
            </div>
        </GradientCard>
    );
};
