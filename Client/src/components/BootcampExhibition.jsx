import React from 'react';
import { motion } from 'framer-motion';
import { Image, Maximize2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import images
import img1 from '../assets/images/I1.jpg';
import img2 from '../assets/images/I2.jpg';
import img3 from '../assets/images/I3.jpg';
import img4 from '../assets/images/I4.jpg';
import img5 from '../assets/images/image001.jpg';
import img6 from '../assets/images/image002.jpg';
import img7 from '../assets/images/image003.jpg';
import img8 from '../assets/images/image004.jpg';

const EXHIBITION_IMAGES = [
    { url: img1, span: "col-span-2 row-span-2", title: "Industrial Workshop" },
    { url: img2, span: "col-span-1 row-span-1", title: "Skill Lab" },
    { url: img3, span: "col-span-1 row-span-1", title: "Robotics Setup" },
    { url: img4, span: "col-span-1 row-span-1", title: "Live Mentor" },
    { url: img5, span: "col-span-1 row-span-1", title: "Tech Symposium" },
    { url: img6, span: "col-span-1 row-span-1", title: "Hackathon" },
    { url: img7, span: "col-span-1 row-span-1", title: "Showcase" },
    { url: img8, span: "col-span-2 row-span-1", title: "Career Prep" },
];

const BootcampExhibition = () => {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
                        >
                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em]">Live Archives</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter"
                        >
                            Bootcamp <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Exhibition.</span>
                        </motion.h2>
                    </div>

                    <motion.button
                        onClick={() => navigate('/bootcamp-gallery')}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                    >
                        <Maximize2 className="w-4 h-4 text-blue-400 group-hover:text-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Explore Full Gallery</span>
                    </motion.button>
                </div>

                {/* Mosaic Gallery - Dense & Interactive */}
                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 h-[600px] md:h-[700px] bg-slate-900/50 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    {EXHIBITION_IMAGES.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ zIndex: 20 }}
                            className={`${img.span} relative group overflow-hidden rounded-2xl cursor-pointer`}
                        >
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                            />

                            {/* Overlay Details */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                                <span className="text-blue-400 font-black uppercase tracking-widest text-[8px] mb-1">Industrial Archive</span>
                                <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none">{img.title}</h3>
                            </div>

                            {/* Corner Icon */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <Image className="w-4 h-4 text-white/70" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Tagline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]"
                >
                    &mdash; Witnessing Real-World Engineering Footprints &mdash;
                </motion.p>
            </div>
        </section>
    );
};

export default BootcampExhibition;
