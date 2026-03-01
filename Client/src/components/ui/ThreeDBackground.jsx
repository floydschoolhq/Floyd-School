import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ThreeDBackground = () => {
    const { scrollY } = useScroll();
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.6;
        }
    }, []);

    // Subtle parallax effect on scroll: the video zooms out and fades slightly to keep focus on content below
    const scale = useTransform(scrollY, [0, 1000], [1, 1.05]);
    const opacity = useTransform(scrollY, [0, 800], [1, 0.4]);

    return (
        <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#020617]">
            {/* Cinematic Video Background */}
            <motion.div
                style={{ scale, opacity }}
                className="w-full h-full relative"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{
                    opacity: 1,
                    scale: 1
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover origin-center mix-blend-screen"
                >
                    <source src="/11.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {/* Atmospheric Overlays for Text Legibility */}

                {/* 1. Base dark tint - toned down because the UI elements now have stronger glass backdrops */}
                <div className="absolute inset-0 bg-slate-950/20 mix-blend-multiply" />

                {/* 2. Radial gradient to subtly vignette the edges instead of dominating the center */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.5)_100%)]" />
            </motion.div>

            {/* Optional subtle noise texture to blend the video and gradients together (removed if too heavy) */}
            {/* <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} /> */}
        </div>
    );
};

export default ThreeDBackground;
