import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Camera, Download } from 'lucide-react';
import brochurePdf from '../assets/pdf/Brochure.pdf';
import SEO from '../components/common/SEO';

// Import images
import img1 from '../assets/images/I1.jpg';
import img2 from '../assets/images/I2.jpg';
import img3 from '../assets/images/I3.jpg';
import img4 from '../assets/images/I4.jpg';
import img5 from '../assets/images/image001.jpg';
import img6 from '../assets/images/image002.jpg';
import img7 from '../assets/images/image003.jpg';
import img8 from '../assets/images/image004.jpg';

const BOOTCAMP_IMAGES = [
    { url: img1, title: "Industrial Workshop", category: "Practical Training" },
    { url: img2, title: "Robotics Module", category: "Advanced Labs" },
    { url: img3, title: "Tech Symposium", category: "Industry Connect" },
    { url: img4, title: "Project Showcase", category: "Exhibition" },
    { url: img5, title: "Student Bootcamp", category: "Skill Development" },
    { url: img6, title: "Mentorship Session", category: "Live Interaction" },
    { url: img7, title: "Hackathon 2024", category: "Competition" },
    { url: img8, title: "Career Guidance", category: "Placement Prep" },
];

const BootcampGallery = () => {
    const navigate = useNavigate();

    const handleDownloadBrochure = () => {
        const link = document.createElement('a');
        link.href = brochurePdf;
        link.download = 'Floyd School_Industrial_Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] selection:bg-[#2563EB]/30">
            <SEO 
                title="Bootcamp Exhibition Gallery" 
                description="Witness the industrial excellence of Floyd School students. Explore our bootcamp exhibitions, project showcases, and industrial workshops in action."
            />
            <div className="pt-40 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.button
                            onClick={() => navigate('/')}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-[#2563EB] font-black uppercase tracking-widest text-[10px] mb-6 hover:gap-4 transition-all"
                        >
                            <ArrowLeft size={14} /> Back to Hub
                        </motion.button>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-[#2563EB] font-black uppercase tracking-[0.4em] text-[11px] mb-4">Visual Journey</p>
                            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Bootcamp <span className="text-[#2563EB]">Exhibitions.</span></h1>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap gap-6 items-center">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDownloadBrochure}
                            className="relative group p-[1px] rounded-[2rem] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/40 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative px-8 py-5 rounded-[2rem] bg-slate-900/40 backdrop-blur-2xl border border-white/10 flex items-center gap-4 transition-all duration-500 group-hover:bg-slate-900/60">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2563EB] group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-500">
                                    <Download size={22} />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs tracking-wider">Download Brochure</p>
                                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Industrial Specs</p>
                                </div>
                            </div>
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] relative overflow-hidden">
                                <div className="absolute inset-0 bg-[#2563EB] opacity-10 animate-pulse" />
                                <Camera size={22} className="relative z-10" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase text-xs tracking-wider">Live Archives</p>
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-0.5">Industrial Footprints</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BOOTCAMP_IMAGES.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative rounded-[2.5rem] overflow-hidden border border-white/5 aspect-[4/3] bg-slate-900"
                        >
                            <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                <span className="text-[#2563EB] font-black uppercase tracking-widest text-[10px] mb-2">{img.category}</span>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Descriptive Content for SEO (300+ words) */}
                <div className="mt-32 pt-20 border-t border-white/5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">The Industrial Bootcamp Experience</h2>
                            <div className="space-y-6 text-sm text-slate-400 font-medium leading-relaxed">
                                <p>
                                    Floyd School's Industrial Bootcamps are designed to be high-intensity, immersive learning experiences that go far beyond traditional classroom training. Our exhibitions and galleries showcase the culmination of weeks of rigorous training, where students transition from theory to practice by building production-grade systems. From IoT-enabled robotics to full-scale web architectures, the projects displayed here represent the future of engineering.
                                </p>
                                <p>
                                    Every exhibition is an opportunity for students to interact with industry veterans, receive feedback on their architectural decisions, and demonstrate their readiness for the global tech market. We believe that seeing is believing, and these visual archives serve as a testament to the growth and capability of our student community.
                                </p>
                                <p>
                                    Our bootcamps focus on "Learning by Doing." Students are organized into agile squads, simulating a real-world engineering department. They use industry-standard tools like Git, Jira, and Docker, ensuring that their workflow is as professional as their output. The gallery captures these moments of intense collaboration, problem-solving, and the final "Eureka" moments of deployment.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6 text-sm text-slate-400 font-medium leading-relaxed lg:pt-16">
                            <p>
                                Beyond the technical skills, our exhibitions highlight the "Soft Skills" critical for engineering success. Students present their work to panels of experts, explaining their technical choices, discussing trade-offs, and defending their architectural designs. This prepares them for the high-stakes environments of modern tech companies where communication is as important as code.
                            </p>
                            <p>
                                We invite schools, universities, and industrial partners to explore these archives. They provide a window into the "Floyd School Standard"—a benchmark for excellence in technical education. Each image tells a story of a student who dared to step out of their comfort zone and into the world of industrial-grade engineering.
                            </p>
                            <p>
                                The projects showcased in our gallery often lead to real-world applications and startup ideas. We provide the mentorship and resources for students to take these prototypes further, fostering a culture of innovation and entrepreneurship. By witnessing these exhibitions, you are seeing the first steps of the next generation of tech leaders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 md:p-20 rounded-[4rem] bg-[#2563EB] relative overflow-hidden text-center"
                >
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-8 tracking-tighter">
                            Witness Industrial <br /> Excellence Firsthand.
                        </h2>
                        <button
                            onClick={() => navigate('/online-program')}
                            className="bg-white text-slate-950 px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl flex items-center gap-3 mx-auto"
                        >
                            Join Next Batch <ExternalLink size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BootcampGallery;
