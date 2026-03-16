import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    BookOpen, 
    Target, 
    Zap,
    Cpu,
    Code,
    Terminal,
    ShieldCheck,
    Layers,
    Rocket
} from 'lucide-react';
import { FALLBACK_COURSES } from '../constants/siteData';
import PremiumNavbar from '../components/PremiumNavbar';
import ThinkskoolAdvantage from '../components/ThinkSkoolAdvantage.jsx';
import MentorGrid from '../components/MentorGrid';
import Hackathon from '../components/Hackathon';
import PlatformPanels from '../components/PlatformPanels';
import LeadFormModal from '../components/LeadFormModal';
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
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white relative">
            
            {/* Background Decorative Mesh */}
            <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[100px] -ml-48 -mb-48" />
            </div>

            <div className="relative z-10">
                {/* Course Hero */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase text-[10px] tracking-[0.3em] mb-12 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Programs
                        </button>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <Icon size={16} className="text-blue-600" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">{course.duration} Intensive</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight leading-[0.9] uppercase">
                                    {course.title}
                                </h1>
                                <p className="text-xl text-slate-500 font-medium tracking-tight leading-relaxed mb-10 max-w-xl">
                                    {course.detailedDescription}
                                </p>
                                
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => setIsLeadModalOpen(true)}
                                        className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-bold uppercase text-[12px] tracking-widest hover:bg-black transition-all shadow-2xl shadow-blue-500/20"
                                    >
                                        Apply For Next Batch
                                    </button>
                                    <div className="flex items-center gap-4 px-6 py-4 rounded-[2rem] border border-slate-200 bg-white">
                                        <div className="flex -space-x-3">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?u=${courseId}${i}`} alt="student" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">50+ Enrolled this week</span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="relative"
                            >
                                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 bg-slate-50/50">
                                    <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                {/* Industry Rating */}
                                <div className="absolute -bottom-6 right-6 flex items-center gap-3 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-100 shadow-xl">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Target size={20} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Industry Rating</span>
                                        <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">{course.rating}/5.0</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>


                {/* Mentor Panel Section */}


                {/* Platform Panels Section */}
                <PlatformPanels />

                {/* Hackathon Section */}
                <Hackathon />

                {/* Why Us Section - thinkskool advantage */}
                <ThinkskoolAdvantage />

                {/* Student Reviews Section */}
                <CourseReviews courseId={courseId} />

                {/* Mentor Panel Section */}
                <MentorGrid title="Faculty" isStatic={true} excludeName="Shivam Mishra" />

                {/* Final CTA */}
                <section className="py-32 bg-slate-50 text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-12 tracking-tight uppercase leading-none">
                            Ready to join the <span className="text-blue-600">first</span> batch?
                        </h2>
                        <button 
                            onClick={() => setIsLeadModalOpen(true)}
                            className="px-16 py-7 bg-slate-950 text-white rounded-[2.2rem] font-black uppercase text-sm tracking-[0.4em] hover:bg-blue-600 transition-all shadow-3xl flex items-center gap-4 mx-auto group"
                        >
                            Enroll in {course.title} <Zap size={20} className="fill-current group-hover:scale-125 transition-transform" />
                        </button>
                        <p className="mt-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" /> Certification & Job Referrals Included
                        </p>
                    </div>
                </section>

                <LeadFormModal 
                    isOpen={isLeadModalOpen} 
                    onClose={() => setIsLeadModalOpen(false)} 
                    source={`course_details_${courseId}`}
                />
            </div>
        </div>
    );
};

export default CourseDetails;
