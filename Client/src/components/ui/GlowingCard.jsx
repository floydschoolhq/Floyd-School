"use client";
import React from "react";
import { GlowingEffect } from "./glowing-effect";
import { cn } from "../../lib/utils";

export const GlowingCard = ({ children, className, containerClassName }) => {
    return (
        <div className={cn("relative h-full rounded-2xl border border-gray-800 p-2 md:rounded-3xl md:p-3 bg-slate-900", containerClassName)}>
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
            />
            <div className={cn("relative flex h-full flex-col overflow-hidden rounded-xl bg-slate-950 p-6 md:p-8", className)}>
                {children}
            </div>
        </div>
    );
};
