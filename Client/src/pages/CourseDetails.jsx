import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
    ShieldCheck,
    Download
} from 'lucide-react';
import { FALLBACK_COURSES } from '../constants/siteData';
import PremiumNavbar from '../components/PremiumNavbar';
import CourseFacultyGrid from '../components/CourseFacultyGrid';
import CourseReviews from '../components/CourseReviews';
import CourseFAQ from '../components/CourseFAQ';
import RegistrationForm from '../components/RegistrationForm';
import CourseOfferings from '../components/CourseOfferings';
import CourseCurriculum from '../components/CourseCurriculum';

const iconMap = {
    Cpu: Cpu,
    Code: Code,
    Terminal: Terminal,
    Shield: ShieldCheck
};

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [course, setCourse] = useState(null);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

    useEffect(() => {
        const foundCourse = FALLBACK_COURSES.find(c => c._id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
        }
        window.scrollTo(0, 0);
        
        // Check if registration form should be opened
        if (searchParams.get('openRegistration') === 'true') {
            setTimeout(() => {
                setIsRegistrationModalOpen(true);
            }, 500); // Small delay to ensure page is loaded
        }
    }, [courseId, searchParams]);

    if (!course) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-slate-400 uppercase tracking-widest">Loading Course Protocol...</div>;

    const Icon = iconMap[course.icon] || Code;

    const isMobile = window.innerWidth < 768;

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white selection:bg-blue-600 selection:text-white relative font-['Outfit']">
            
            {/* Background Decorative Mesh - Industrial Dark */}
            <div className="fixed inset-0 pointer-events-none z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[80px] -ml-24 -mb-24" />
            </div>

            <div className="relative z-20">
                {/* Course Hero */}
                <section id="course-hero" className={`relative flex items-center overflow-hidden ${isMobile ? 'pt-20 pb-12' : 'min-h-screen pt-24 pb-12'}`}>
                    <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-bold uppercase text-[10px] tracking-[0.3em] mb-8 md:mb-12 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Programs
                        </button>

                        {isMobile ? (
                            <div className="flex flex-col gap-10">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 py-1 px-2 bg-blue-500/10 rounded-md">{course.duration} program</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight text-white break-words">
                                        Foundation of<br className="block"/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                                            AI and Machine Learning
                                        </span>
                                    </h1>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">
                                        {course.detailedDescription}
                                    </p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => setIsRegistrationModalOpen(true)}
                                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-[0_10px_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            Apply Now <ArrowRight size={16} />
                                        </button>
                                        <button 
                                            onClick={() => window.open('/assets/pdf/thinkskool_curriculum1.pdf', '_blank')}
                                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            <Download size={16} /> Download Curriculum
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full aspect-video bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                                    <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="w-full h-full object-contain p-4 opacity-90"
                                    />
                                </div>
                                
                                <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md self-center">
                                    <div className="flex -space-x-3">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`} alt="student" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">50+ Enrolled Last Week</span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white inline-block mb-6">{course.duration} program</span>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-tight text-white break-words">
                                        Foundation of<br className="block"/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
                                            AI and Machine Learning
                                        </span>
                                    </h1>
                                    <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-10 max-w-2xl">
                                        {course.detailedDescription}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-5">
                                        <button 
                                            onClick={() => setIsRegistrationModalOpen(true)}
                                            className="px-12 py-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-black uppercase text-[13px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(59,130,246,0.25)] flex items-center gap-3 group"
                                        >
                                            Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button 
                                            onClick={() => window.open('/assets/pdf/thinkskool_curriculum1.pdf', '_blank')}
                                            className="px-12 py-5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl font-black uppercase text-[13px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(16,185,129,0.25)] flex items-center gap-3 group"
                                        >
                                            <Download size={18} /> Download Curriculum
                                        </button>
                                        <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
                                            <div className="flex -space-x-3">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center overflow-hidden">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=student${i}`} alt="student" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">50+ Enrolled Last Week</span>
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
                                        <img 
                                            src={course.image} 
                                            alt={course.title} 
                                            className="w-full h-full object-contain rounded-[1.5rem] transition-transform duration-1000 group-hover/imgContainer:scale-[1.02] opacity-95 group-hover/imgContainer:opacity-100"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Course Curriculum Section - Only for AI & ML Course */}
                {courseId === '1' && (
                    <section id="course-curriculum">
                        <CourseCurriculum variant="dark" />
                    </section>
                )}

                {/* Enhanced Mentors Section */}
                <section id="course-faculty" className="bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5 pt-12 pb-20">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Faculty Grid */}
                        <CourseFacultyGrid title="Faculty" isStatic={true} excludeName="Shivam Mishra" variant="dark" />
                    </div>
                </section>

                {/* Course Offerings Section */}
                <section id="course-offerings">
                    <CourseOfferings variant="dark" />
                </section>

                <div id="course-reviews" className="bg-[#080808]">
                    <CourseReviews courseId={courseId} variant="dark" />
                </div>

                {/* FAQ Section */}
                <CourseFAQ />

                {/* Registration Form Modal */}
                <RegistrationForm 
                    isOpen={isRegistrationModalOpen} 
                    onClose={() => setIsRegistrationModalOpen(false)} 
                    courseTitle={course?.title || ''}
                />
                
            </div>
        </div>
    );
};

export default CourseDetails;
