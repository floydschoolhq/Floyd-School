"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

export const PremiumBentoCard = ({
    className,
    title,
    description,
    header,
    icon,
}) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };

    const handleMouseMove = (e) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        position.x.set(e.clientX - rect.left);
        position.y.set(e.clientY - rect.top);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Reset opacity when mouse leaves
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleFocus}
            onMouseLeave={handleBlur}
            className={cn(
                "relative row-span-1 rounded-3xl group/bento overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md transition-all duration-500 shadow-xl flex flex-col space-y-4 justify-between p-6 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/20",
                className
            )}
        >
            {/* 1. Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px z-10 opacity-0 transition duration-300 group-hover/bento:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              600px circle at ${position.x}px ${position.y}px,
              rgba(255, 255, 255, 0.15),
              transparent 40%
            )
          `,
                }}
            />

            {/* 2. Border Beam (Subtle circulating glow) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />

            {/* Content Layer */}
            <div className="relative z-20 h-full flex flex-col">
                {header}
                <div className="group-hover/bento:translate-x-2 transition duration-300 mt-4">
                    <div className="flex items-center gap-3 mb-2">
                        {icon}
                        <div className="font-sans font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
                            {title}
                        </div>
                    </div>
                    <div className="font-sans font-medium text-slate-300 text-sm leading-relaxed">
                        {description}
                    </div>
                </div>
            </div>

            {/* Interactive Border Highlight */}
            <div
                className="absolute inset-0 z-0 pointer-events-none border-2 border-transparent group-hover/bento:border-white/10 rounded-3xl transition-colors duration-300"
            />
        </div>
    );
};
