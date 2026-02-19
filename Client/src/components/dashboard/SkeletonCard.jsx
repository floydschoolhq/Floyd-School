import React from 'react';
import { motion } from 'framer-motion';

const shimmer = `
  relative overflow-hidden before:absolute before:inset-0
  before:-translate-x-full before:animate-[shimmer_1.5s_infinite]
  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
`;

// Add shimmer keyframe to the document once
if (typeof document !== 'undefined' && !document.getElementById('shimmer-style')) {
    const style = document.createElement('style');
    style.id = 'shimmer-style';
    style.textContent = `
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `;
    document.head.appendChild(style);
}

const Base = ({ className = '', rounded = 'rounded-xl' }) => (
    <div className={`bg-surface-el ${rounded} ${shimmer} ${className}`} />
);

/** Skeleton for a stat card */
export const StatSkeleton = () => (
    <div className="bg-surface-soft rounded-2xl p-5 space-y-3 border border-surface-el">
        <div className="flex items-center gap-3">
            <Base className="w-10 h-10" rounded="rounded-xl" />
            <Base className="h-3 w-24" />
        </div>
        <Base className="h-7 w-16" />
        <Base className="h-2 w-32" />
    </div>
);

/** Skeleton for a content card row */
export const CardSkeleton = ({ lines = 2 }) => (
    <div className="bg-surface-soft rounded-2xl p-5 space-y-3 border border-surface-el">
        <div className="flex justify-between items-center">
            <Base className="h-4 w-40" />
            <Base className="h-6 w-16" rounded="rounded-full" />
        </div>
        {Array.from({ length: lines }).map((_, i) => (
            <Base key={i} className={`h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
        ))}
    </div>
);

/** Skeleton for the greeting row */
export const GreetingSkeleton = () => (
    <div className="flex items-center gap-4 mb-2">
        <Base className="w-10 h-10" rounded="rounded-xl" />
        <div className="space-y-2">
            <Base className="h-2.5 w-20" />
            <Base className="h-6 w-44" />
        </div>
    </div>
);

/** Dashboard splash — full skeleton layout */
export const DashboardSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6 space-y-8"
    >
        <GreetingSkeleton />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4">
                <CardSkeleton lines={3} />
                <CardSkeleton lines={2} />
            </div>
            <div className="lg:col-span-4 space-y-4">
                <CardSkeleton lines={4} />
            </div>
        </div>
    </motion.div>
);
