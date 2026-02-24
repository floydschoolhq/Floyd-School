"use client";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaRocket, FaCode, FaLaptopCode } from "react-icons/fa";
import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "./ui/text-reveal-card";

export function TextRevealCardPreview() {
    return (
        <div className="flex items-center justify-center bg-slate-950 h-[40rem] rounded-3xl w-full relative overflow-hidden border border-white/10">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 pointer-events-none" />

            {/* Pulsing Center Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Icons representing Vision & Motive */}
            <FloatingIcon icon={FaRobot} color="text-cyan-400" top="15%" left="15%" delay={0} />
            <FloatingIcon icon={FaBrain} color="text-purple-400" top="15%" right="15%" delay={1} />
            <FloatingIcon icon={FaRocket} color="text-[#2563EB]" bottom="15%" left="20%" delay={2} />
            <FloatingIcon icon={FaLaptopCode} color="text-green-400" bottom="15%" right="20%" delay={3} />

            {/* Cloud Shaped Course Cards - Floating One-Liners */}
            <CloudCard text="AI & Robotics" subtext="Building intelligent machines" top="10%" left="30%" delay={0} />
            <CloudCard text="IoT & Cloud" subtext="Connecting the world" top="25%" right="10%" delay={2} />
            <CloudCard text="Cybersecurity" subtext="Protecting digital frontiers" bottom="20%" left="10%" delay={4} />
            <CloudCard text="App Dev" subtext="Creating virtual experiences" bottom="10%" right="30%" delay={1.5} />

            <div className="z-10 relative">
                <TextRevealCard text="Future-Ready Skills" revealText="AI • Cybersecurity • IoT • Development">
                    <TextRevealCardTitle className="text-white">
                        Unlock Your Potential
                    </TextRevealCardTitle>
                    <TextRevealCardDescription className="text-slate-400">
                        Hover over the card to reveal the core technologies you will master with{' '}
                        <span className="text-white font-bold">Think</span>
                        <span className="text-[#2563EB] font-bold">Skool</span>.
                    </TextRevealCardDescription>
                </TextRevealCard>
            </div>
        </div>
    );
}

// Helper Component for Floating Icons
const FloatingIcon = ({ icon: Icon, color, top, left, right, bottom, delay }) => {
    return (
        <motion.div
            className={`absolute text-4xl md:text-6xl opacity-30 ${color}`}
            style={{ top, left, right, bottom }}
            animate={{
                y: [-20, 20, -20],
                rotate: [0, 10, -10, 0],
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
        >
            <Icon />
        </motion.div>
    );
};

const CloudCard = ({ text, subtext, top, left, right, bottom, delay }) => {
    return (
        <motion.div
            className="absolute px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex flex-col items-center justify-center text-center shadow-lg pointer-events-none"
            style={{
                top, left, right, bottom,
                borderRadius: "30px 30px 30px 30px" // Cloud-like rounded shape
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: [0, -10, 0],
                x: [0, 5, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
        >
            <span className="text-xs font-bold text-white/90 whitespace-nowrap">{text}</span>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">{subtext}</span>
        </motion.div>
    );
};

