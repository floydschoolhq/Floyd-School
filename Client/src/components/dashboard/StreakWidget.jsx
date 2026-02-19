import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useStreak } from '../../hooks/useStreak';

const getBadgeLevel = (streak) => {
    if (streak >= 30) return { label: 'Legend', color: 'from-rose-500 to-orange-400', glow: 'shadow-orange-500/40' };
    if (streak >= 14) return { label: 'On Fire', color: 'from-orange-500 to-amber-400', glow: 'shadow-amber-400/40' };
    if (streak >= 7) return { label: 'Hot Streak', color: 'from-amber-500 to-yellow-400', glow: 'shadow-yellow-400/30' };
    if (streak >= 3) return { label: 'Warming Up', color: 'from-blue-500 to-cyan-400', glow: 'shadow-blue-400/30' };
    return { label: 'Day 1', color: 'from-slate-500 to-slate-400', glow: 'shadow-slate-400/20' };
};

const StreakWidget = () => {
    const { streak, isNewDay } = useStreak();
    const badge = getBadgeLevel(streak);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
            className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-2xl
        bg-gradient-to-r ${badge.color}
        shadow-lg ${badge.glow}
        cursor-default select-none
      `}
            title={`${streak}-day learning streak!`}
        >
            <motion.div
                animate={isNewDay ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <Flame className="w-4 h-4 text-white drop-shadow" />
            </motion.div>

            <span className="text-white font-black text-sm tabular-nums">{streak}</span>

            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                {badge.label}
            </span>

            {/* Pulse ring for streaks ≥ 7 */}
            {streak >= 7 && (
                <motion.div
                    className="absolute inset-0 rounded-2xl bg-white/20"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
        </motion.div>
    );
};

export default StreakWidget;
