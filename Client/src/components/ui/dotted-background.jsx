"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const DottedGlowBackground = ({
    className,
    opacity = 1,
    gap = 10,
    radius = 1.6,
    colorLightVar = "--color-neutral-500",
    glowColorLightVar = "--color-neutral-600",
    colorDarkVar = "--color-neutral-500",
    glowColorDarkVar = "--color-sky-800",
    backgroundOpacity = 0,
    speedMin = 0.3,
    speedMax = 1.6,
    speedScale = 1,
}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const isDark = document.documentElement.classList.contains("dark");
        const colorVar = isDark ? colorDarkVar : colorLightVar;
        const glowColorVar = isDark ? glowColorDarkVar : glowColorLightVar;

        const color = getComputedStyle(document.documentElement).getPropertyValue(colorVar) || "#888";
        const glowColor = getComputedStyle(document.documentElement).getPropertyValue(glowColorVar) || "#0ea5e9";

        const dots = [];
        const numDots = Math.floor((canvas.width * canvas.height) / (gap * gap));

        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * (speedMin + Math.random() * (speedMax - speedMin)) * speedScale,
                vy: (Math.random() - 0.5) * (speedMin + Math.random() * (speedMax - speedMin)) * speedScale,
                glowing: Math.random() > 0.95,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (backgroundOpacity > 0) {
                ctx.fillStyle = `rgba(0, 0, 0, ${backgroundOpacity})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            dots.forEach((dot) => {
                dot.x += dot.vx;
                dot.y += dot.vy;

                if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
                if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = dot.glowing ? glowColor : color;
                ctx.globalAlpha = opacity;
                ctx.fill();

                if (dot.glowing) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = glowColor;
                } else {
                    ctx.shadowBlur = 0;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [opacity, gap, radius, colorLightVar, glowColorLightVar, colorDarkVar, glowColorDarkVar, backgroundOpacity, speedMin, speedMax, speedScale]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 h-full w-full", className)}
        />
    );
};
