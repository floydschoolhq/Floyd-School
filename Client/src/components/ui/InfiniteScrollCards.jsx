"use client";
import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

export const InfiniteScrollCards = ({
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
}) => {
    const containerRef = useRef(null);
    const scrollerRef = useRef(null);

    useEffect(() => {
        addAnimation();
    }, []);

    const [start, setStart] = useState(false);

    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }

    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty("--animation-direction", "forwards");
            } else {
                containerRef.current.style.setProperty("--animation-direction", "reverse");
            }
        }
    };

    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
                    start && "animate-scroll ",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="w-[350px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-700 px-8 py-6 md:w-[450px]"
                        style={{
                            background: "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
                        }}
                        key={item.title + idx} // Use composite key for uniqueness
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={item.src}
                                alt={item.title}
                                className="h-full w-full object-cover opacity-80 transition-opacity duration-300 hover:opacity-100" // Increased opacity
                            />
                            <div className="absolute inset-0 bg-black/20" /> {/* Reduced overlay */}
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-20 mt-32"> {/* Push text to bottom */}
                            <span className="relative z-20 text-2xl leading-[1.6] text-white font-bold block mb-2">
                                {item.title}
                            </span>
                            <span className="relative z-20 text-sm leading-[1.6] text-slate-300 font-normal">
                                <span className="text-blue-400">Think</span>
                                <span className="text-yellow-400">Skool</span> Program
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

