"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Card = React.memo(({
    card,
    index,
    hovered,
    setHovered
}) => (
    <motion.div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
            "rounded-2xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full cursor-pointer",
            // Remove any 'sticky' blur effects. Keep it crisp.
        )}
        // Use Framer Motion for pure hardware-accelerated transforms
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{
            y: -10, // Smooth 'Lift'
            scale: 1.02, // Subtle scale
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
    >
        {/* Image scaling independently for parallax feel */}
        <motion.img
            src={card.src}
            alt={card.title}
            className="object-cover absolute inset-0 w-full h-full"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Clean Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

        {/* Text Content */}
        <div className={cn(
            "absolute inset-0 flex items-end py-8 px-6",
        )}>
            <div className="text-xl md:text-3xl font-bold text-white drop-shadow-md">
                {card.title}
                {/* Decorative Underline that expands on hover */}
                <motion.div
                    className="h-1 bg-[#FF8C00] mt-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: hovered === index ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    </motion.div>
));

Card.displayName = "Card";

export function FocusCards({ cards }) {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto md:px-8 w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.title}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}

