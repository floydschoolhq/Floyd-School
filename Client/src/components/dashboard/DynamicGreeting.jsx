import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sunrise, Coffee } from 'lucide-react';

const DynamicGreeting = ({ name }) => {
    const [greeting, setGreeting] = useState('');
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('Good Morning');
            setIcon(<Sunrise className="w-5 h-5 text-orange-400" />);
        } else if (hour >= 12 && hour < 17) {
            setGreeting('Good Afternoon');
            setIcon(<Sun className="w-5 h-5 text-yellow-500" />);
        } else if (hour >= 17 && hour < 21) {
            setGreeting('Good Evening');
            setIcon(<Coffee className="w-5 h-5 text-brown-400" />);
        } else {
            setGreeting('Burning the Midnight Oil?');
            setIcon(<Moon className="w-5 h-5 text-indigo-400" />);
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/50 backdrop-blur-md border border-white shadow-sm transition-transform hover:scale-110">
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1">
                    {greeting}
                </p>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {name}
                </h2>
            </div>
        </motion.div>
    );
};

export default DynamicGreeting;

