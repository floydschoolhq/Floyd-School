"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const DraggableCardContainer = ({ children, className, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className={cn("relative flex w-full items-center justify-center overflow-hidden", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export const DraggableCard = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Auto swapping
  useEffect(() => {
    if (!isHovered && !dragActive) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 1500); 
      return () => clearInterval(interval);
    }
  }, [isHovered, dragActive, items.length]);

  const handleDragEnd = (e, { offset, velocity }) => {
    setDragActive(false);
    const swipe = offset.x;
    if (swipe < -60 || velocity.x < -600) {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    } else if (swipe > 60 || velocity.x > 600) {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  return (
    <DraggableCardContainer 
      className="min-h-[500px] py-6 md:py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full max-w-[70rem] h-[30rem] md:h-[40rem] flex justify-center items-center perspective-[1200px]">
        {items.map((item, index) => {
          let distance = index - currentIndex;
          // Calculate the circular wrap-around shortest distance
          if (distance > items.length / 2) distance -= items.length;
          else if (distance < -items.length / 2) distance += items.length;

          // Render only up to 2 items in either direction for performance
          if (Math.abs(distance) > 2) return null;

          const isCenter = distance === 0;
          const isEdge = Math.abs(distance) === 2;

          return (
            <motion.div
              key={item.src + index}
              initial={false}
              animate={{
                x: `${distance * 65}%`, 
                scale: isCenter ? 1 : 0.85,
                opacity: isCenter ? 1 : (isEdge ? 0 : 0.5),
                zIndex: isCenter ? 30 : (10 - Math.abs(distance)),
                filter: isCenter ? "blur(0px)" : "blur(3px)"
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 0.9
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragStart={() => isCenter && setDragActive(true)}
              onDragEnd={handleDragEnd}
              whileTap={isCenter ? { cursor: "grabbing" } : {}}
              className={cn(
                "absolute w-[92%] md:w-[80%] aspect-video rounded-3xl flex flex-col justify-end bg-slate-900 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] overflow-hidden transition-colors border border-slate-200/20",
                isCenter ? "cursor-grab active:cursor-grabbing" : "cursor-default pointer-events-none"
              )}
            >
              {/* Image Layer */}
              <div className="absolute inset-0 bg-slate-900">
                <img 
                  src={item.src} 
                  alt={item.alt || item.label} 
                  className="w-full h-full object-cover" 
                  draggable={false}
                />
              </div>

            </motion.div>
          );
        })}
      </div>
    </DraggableCardContainer>
  );
};