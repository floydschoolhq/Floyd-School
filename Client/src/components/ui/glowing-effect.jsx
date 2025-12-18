"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

export const GlowingEffect = ({
    spread = 40,
    glow = true,
    disabled = false,
    proximity = 64,
    inactiveZone = 0.01,
    className,
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback(
        (e) => {
            if (!containerRef.current || disabled) return;

            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setPosition({ x, y });

            // Calculate distance from center or just use bounds
            if (x >= -proximity && x <= rect.width + proximity && y >= -proximity && y <= rect.height + proximity) {
                setOpacity(1);
            } else {
                setOpacity(0);
            }
        },
        [disabled, proximity]
    );

    const handleMouseLeave = useCallback(() => {
        setOpacity(0);
    }, []);

    useEffect(() => {
        if (disabled) return;
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove, disabled]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute inset-0 h-full w-full overflow-hidden rounded-[inherit] pointer-events-none",
                className
            )}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                style={{
                    opacity: glow ? opacity : 0,
                    background: `radial-gradient(${spread * 10}px circle at ${position.x}px ${position.y}px, rgba(255,140,0,0.15), transparent 40%)`,
                }}
            />
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                style={{
                    opacity: glow ? opacity : 0,
                    background: `radial-gradient(${spread * 5}px circle at ${position.x}px ${position.y}px, rgba(0,127,255,0.15), transparent 40%)`,
                }}
            />
        </div>
    );
};
