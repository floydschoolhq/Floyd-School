import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import boy1Img from '../assets/avatars/boy1.jpg';
import boy2Img from '../assets/avatars/boy2.jpg';
import girl1Img from '../assets/avatars/girl1.jpg';
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
    Download,
    Award
} from 'lucide-react';
import { FALLBACK_COURSES } from '../constants/siteData';
import PremiumNavbar from '../components/PremiumNavbar';
import CourseFacultyGrid from '../components/CourseFacultyGrid';
import CourseReviews from '../components/CourseReviews';
import CourseFAQ from '../components/CourseFAQ';
import PaymentModal from '../components/PaymentModal';
import CourseOfferings from '../components/CourseOfferings';
import CourseCurriculum from '../components/CourseCurriculum';
import FinalProject from '../components/FinalProject';
import sampleCertificate from '../assets/images/sample2Certificate.png';

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
                            <div className="flex flex-col gap-6 mt-12">
                                {/* Image Card at Top */}
                                <div className="w-full bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                                    <img 
                                        src={course.image} 
                                        alt={course.title} 
                                        className="w-full h-auto block opacity-100"
                                    />
                                </div>

                                <div className="text-center">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 inline-block mb-2">
                                        {course.duration} program
                                    </span>
                                    <h1 className="font-black tracking-tight mb-4 leading-tight text-white px-4 flex flex-col items-center">
                                        <span className="text-2xl mb-1">Foundation of</span>
                                        <span className="text-[17px] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">AI and Machine Learning</span>
                                    </h1>
                                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-8 px-4 text-center">
                                        Master AI from scratch. Build real Machine Learning and Computer Vision models. No experience required.
                                    </p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button 
                                            onClick={() => setIsRegistrationModalOpen(true)}
                                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-[0_10px_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            Apply Now <ArrowRight size={16} />
                                        </button>
                                        <button 
                                            onClick={() => window.open('/assets/pdf/thinkskool_curriculum1.pdf', '_blank')}
                                            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-transform"
                                        >
                                            <Download size={16} /> Download Curriculum
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md self-center">
                                    <div className="flex -space-x-3">
                                        {[boy1Img, girl1Img, boy2Img].map((src, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] overflow-hidden">
                                                <img src={src} alt="student" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">20+ Enrolled Last Week</span>
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
                                    <h1 className="font-black tracking-tighter mb-6 leading-tight text-white break-words flex flex-col">
                                        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-6xl mb-1 lg:mb-2 text-white">Foundation of</span>
                                        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600">
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
                                                {[boy1Img, girl1Img, boy2Img].map((src, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] overflow-hidden">
                                                        <img src={src} alt="student" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">20+ Enrolled Last Week</span>
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
                    <section id="course-curriculum" className="p-0">
                        <CourseCurriculum variant="dark" />
                    </section>
                )}

                {/* Independent Final Project Section */}
                {courseId === '1' && <FinalProject />}

                {/* Luminating Divider below Final Project */}
                {isMobile && (
                    <div className="bg-white py-16 flex justify-center overflow-hidden">
                        <div className="relative w-full max-w-[280px] flex items-center justify-center">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-600/60 to-transparent" />
                        </div>
                    </div>
                )}

                {/* Enhanced Mentors Section */}
                <section 
                    id="course-faculty" 
                    className={isMobile 
                        ? "bg-white border-t border-slate-100 p-0" 
                        : "bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5 pt-12 pb-20 p-0"
                    }
                >
                    <div className="max-w-7xl mx-auto px-0 md:px-6">
                        {/* Faculty Grid */}
                        <CourseFacultyGrid 
                            title="Faculty" 
                            isStatic={true} 
                            excludeName="Shivam Mishra" 
                            variant={isMobile ? "light" : "dark"} 
                        />
                    </div>
                </section>
                
                {/* Luminating Divider - Bottom of Faculty (Mobile Only) */}
                {isMobile && (
                    <div className="bg-white py-12 flex justify-center">
                        <div className="h-px w-[85%] bg-gradient-to-r from-transparent via-blue-600/60 to-transparent relative z-10 shadow-[0_0_60px_rgba(37,99,235,0.6)]" />
                    </div>
                )}

                {/* Course Offerings Section */}
                <section id="course-offerings" className={`bg-white px-0 overflow-hidden ${isMobile ? 'pb-16' : ''}`}>
                    <CourseOfferings variant="dark" />
                </section>

                <div id="course-reviews" className="bg-[#080808]">
                    <CourseReviews courseId={courseId} variant="dark" />
                </div>

                {/* Sample Certificate Section */}
                {courseId === '1' && (
                    <section id="sample-certificate" className="bg-[#080808] py-16 md:py-24 px-4">
                        <div className="max-w-[65%] mx-auto">
                            {/* Section Header */}
                            <div className="text-center mb-12 md:mb-16">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                                    <span className="text-orange-500 font-semibold text-sm md:text-base uppercase tracking-wider">Certification</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                                    Earn Your <span className="text-orange-500">Professional Certificate</span>
                                </h2>
                                <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto">
                                    Upon successful completion, receive a recognized certificate that showcases your AI & ML skills to future employers
                                </p>
                            </div>

                            {/* Certificate Display */}
                            <div className="relative">
                                {/* Desktop: Full certificate with shadow and border */}
                                <div className="hidden md:block relative max-w-[90%] mx-auto">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-blue-500/20 rounded-3xl blur-xl"></div>
                                    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-1 border border-slate-700/50">
                                        <img 
                                            src={sampleCertificate} 
                                            alt="ThinkSkool AI & ML Certificate" 
                                            className="w-full h-auto rounded-[22px] shadow-2xl"
                                        />
                                    </div>
                                </div>

                                {/* Mobile: Scaled certificate with scroll */}
                                <div className="md:hidden relative px-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-2xl blur-lg"></div>
                                    <div className="relative bg-slate-900 rounded-2xl p-1 border border-slate-800">
                                        <img 
                                            src={sampleCertificate} 
                                            alt="ThinkSkool AI & ML Certificate" 
                                            className="w-[120%] h-auto -ml-[10%] rounded-xl shadow-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* FAQ Section */}
                <CourseFAQ />

                {/* Payment Modal */}
                <PaymentModal 
                    isOpen={isRegistrationModalOpen} 
                    onClose={() => setIsRegistrationModalOpen(false)} 
                    courseId={course?._id}
                    courseTitle={course?.title || ''}
                    coursePrice={course?.price || 0}
                />
                
            </div>
        </div>
    );
};

export default CourseDetails;
