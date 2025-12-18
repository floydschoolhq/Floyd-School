"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";

export const HeroParallax = ({ products }) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const ref = useRef(null);

    return (
        <div ref={ref} className="h-auto min-h-screen py-20 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />

            {/* Glowing orbs */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <Header />

            <div className="relative z-10 mt-4">
                {/* First Row - Moving Right to Left */}
                <div className="mb-8 overflow-hidden">
                    <motion.div
                        className="flex space-x-8"
                        animate={{
                            x: [0, -2000],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {/* Duplicate cards for seamless loop */}
                        {[...firstRow, ...firstRow, ...firstRow].map((product, idx) => (
                            <ProductCard
                                product={product}
                                key={`first-${idx}`}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Second Row - Moving Left to Right */}
                <div className="overflow-hidden">
                    <motion.div
                        className="flex space-x-8"
                        animate={{
                            x: [-2000, 0],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                    >
                        {/* Duplicate cards for seamless loop */}
                        {[...secondRow, ...secondRow, ...secondRow].map((product, idx) => (
                            <ProductCard
                                product={product}
                                key={`second-${idx}`}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="max-w-7xl relative mx-auto py-10 md:py-16 px-4 w-full z-20">
            {/* Animated gradient background behind text - fully blurred */}
            <motion.div
                className="absolute inset-0 opacity-20 blur-3xl"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.8) 0%, transparent 70%)',
                        'radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.8) 0%, transparent 70%)',
                        'radial-gradient(circle at 50% 50%, rgba(251, 146, 60, 0.8) 0%, transparent 70%)',
                        'radial-gradient(circle at 20% 50%, rgba(168, 85, 247, 0.8) 0%, transparent 70%)',
                    ],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Floating particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <motion.h1
                className="text-2xl md:text-6xl font-bold dark:text-white text-white text-center relative"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Glowing text effect */}
                <motion.span
                    className="relative inline-block"
                    animate={{
                        textShadow: [
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                            '0 0 40px rgba(6, 182, 212, 0.5)',
                            '0 0 20px rgba(251, 146, 60, 0.5)',
                            '0 0 20px rgba(168, 85, 247, 0.5)',
                        ],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-orange-400 inline-block">
                        The Future of
                    </span>
                </motion.span>
                <br />
                <motion.span
                    className="relative inline-block mt-2"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    style={{
                        backgroundSize: '200% 200%',
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.3 },
                        x: { duration: 0.8, delay: 0.3 },
                        backgroundPosition: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 inline-block">
                        STEM Education
                    </span>
                </motion.span>

                {/* Underline decoration */}
                <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    initial={{ width: 0 }}
                    whileInView={{ width: '60%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </motion.h1>
        </div>
    );
};

export const ProductCard = ({ product }) => {
    const thumbnailSrc = product.thumbnail;
    const isVideo = typeof thumbnailSrc === 'string' && thumbnailSrc.endsWith('.mp4');

    return (
        <motion.div
            whileHover={{
                y: -10,
                scale: 1.05,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            className="group/product h-64 w-[22rem] relative flex-shrink-0 rounded-2xl overflow-hidden"
        >
            <div className="relative h-full w-full">
                {/* Image/Video */}
                {isVideo ? (
                    <video
                        src={thumbnailSrc}
                        className="object-cover absolute h-full w-full inset-0 brightness-75 group-hover/product:brightness-100 transition-all duration-300"
                        alt={product.title}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <img
                        src={typeof thumbnailSrc === 'string' ? thumbnailSrc : ''}
                        className="object-cover absolute h-full w-full inset-0 brightness-75 group-hover/product:brightness-100 transition-all duration-300"
                        alt={product.title}
                    />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover/product:opacity-40 transition-opacity duration-300" />

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover/product:border-cyan-400/50 rounded-2xl transition-all duration-300" />

                {/* Title */}
                {product.title && (
                    <h2 className="absolute bottom-4 left-4 text-white text-lg font-semibold opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
                        {product.title}
                    </h2>
                )}
            </div>
        </motion.div>
    );
};
