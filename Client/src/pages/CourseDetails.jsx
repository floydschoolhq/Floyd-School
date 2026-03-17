import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Clock, 
    BookOpen, 
    Target, 
    Zap,
    ArrowRight,
    ArrowLeft,
    Code,
    Cpu,
    Brain,
    Rocket,
    Globe,
    Terminal,
    ShieldCheck
} from 'lucide-react';
import { FALLBACK_COURSES } from '../constants/siteData';
import PremiumNavbar from '../components/PremiumNavbar';
import CourseFacultyGrid from '../components/CourseFacultyGrid';
import CourseReviews from '../components/CourseReviews';

const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck
};

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    useEffect(() => {
        const foundCourse = FALLBACK_COURSES.find(c => c._id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
        }
        window.scrollTo(0, 0);
    }, [courseId]);

    if (!course) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-slate-400 uppercase tracking-widest">Loading Course Protocol...</div>;

    const Icon = iconMap[course.icon] || Code;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white selection:bg-orange-600 selection:text-white relative font-['Outfit']">
            
            {/* Background Decorative Mesh - Industrial Dark */}
            <div className="fixed inset-0 pointer-events-none z-10">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full blur-[160px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[140px] -ml-48 -mb-48" />
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100" />
            </div>

            <div className="relative z-20">
                {/* Course Hero - Dark Mode Refined */}
                <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.3em] mb-12 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Programs
                        </button>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <Icon size={16} className="text-white" />
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white">{course.duration} Intensive</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-[0.95] uppercase">
                                    {course.title}
                                </h1>
                                <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl">
                                    {course.detailedDescription}
                                </p>
                                
                                <div className="flex flex-wrap gap-5">
                                    <button 
                                        onClick={() => setIsLeadModalOpen(true)}
                                        className="px-12 py-5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-black uppercase text-[13px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(249,115,22,0.25)] flex items-center gap-3 group"
                                    >
                                        Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
                                        <div className="flex -space-x-3">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`} alt="student" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">50+ Active Builders</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative lg:pl-10"
                            >
                                <div className="w-full aspect-video bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] group/imgContainer relative">
                                    {/* Mac Dots Overlay */}
                                    <div className="absolute top-6 left-6 flex gap-2 z-30">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                    </div>
                                    
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/imgContainer:opacity-100 transition-all duration-500 transform scale-90 group-hover/imgContainer:scale-100">
                                        <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-2xl transition-all">
                                            <div className="w-0 h-0 border-t-[14px] border-t-transparent border-l-[26px] border-l-white border-b-[14px] border-b-transparent ml-2" />
                                        </div>
                                    </div>

                                    <div className="w-full h-full p-4 md:p-6 lg:p-10">
                                        <img 
                                            src={course.image} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-1000 group-hover/imgContainer:scale-[1.02] opacity-95 group-hover/imgContainer:opacity-100"
                                        />
                                    </div>

                                    {/* Tech Tags Overlay */}
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-30">
                                        {['Industrial Protocol', 'Research Based', 'Hands-on'].map(tag => (
                                            <span key={tag} className="px-4 py-1.5 bg-black/40 backdrop-blur-xl border border-white/5 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>



                <div className="bg-[#080808]">
                    <CourseReviews courseId={courseId} variant="dark" />
                </div>

                <div className="bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5 py-24">
                    <CourseFacultyGrid title="Faculty" isStatic={true} excludeName="Shivam Mishra" variant="dark" />
                </div>

                
            </div>
        </div>
    );
};

export default CourseDetails;
