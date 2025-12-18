import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StickyBottomBar = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] py-2 px-4 hidden md:block"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Future Tech Program */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">Future Tech Program</span>
                            <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">For innovators</span>
                        </div>
                        <p className="text-slate-500 text-xs">Mentorship, live projects & future-ready skills</p>
                    </div>

                    <button
                        onClick={() => navigate('/bootcamp')}
                        className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Explore Program
                    </button>

                    {/* Vertical Divider */}
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>

                    {/* ThinkSkool Certifications */}
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">ThinkSkool Certifications</span>
                        <p className="text-slate-500 text-xs">Industry recognized certificates for every milestone</p>
                    </div>

                    <button
                        onClick={() => navigate('/certifications')}
                        className="bg-[#F66C3B] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#e05a2b] transition-colors"
                    >
                        Explore Certifications
                    </button>
                </div>

                {/* Floating Chat/Help Icon (Optional, matching reference) */}
                <div className="flex items-center gap-2">
                    {/* Placeholder for potential chat widget or other actions */}
                </div>
            </div>
        </motion.div>
    );
};

export default StickyBottomBar;
