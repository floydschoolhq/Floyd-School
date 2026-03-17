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
import RegistrationForm from '../components/RegistrationForm';
import CourseOfferings from '../components/CourseOfferings';

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
                                        onClick={() => setIsRegistrationModalOpen(true)}
                                        className="px-12 py-5 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-xl font-black uppercase text-[13px] tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(249,115,22,0.25)] flex items-center gap-3 group"
                                    >
                                        Apply Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button 
                                        onClick={() => window.open('/Brochure-zwCZ_L4_.pdf', '_blank')}
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

                {/* Support Section */}
                <div className="bg-gradient-to-br from-slate-950 via-black to-slate-950 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-24">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <motion.h2 
                                className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Section</span>
                            </motion.h2>
                            <motion.p 
                                className="text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Everything you need is already included.
                            </motion.p>
                        </div>

                        {/* Support Features Grid - Marquee with 3 cards visible */}
                        <div className="relative overflow-hidden mb-16">
                            <div className="flex animate-marquee gap-6">
                                {/* First set of cards */}
                                {/* Live Mentor Guidance */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Brain className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Live mentor guidance in every class</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Your mentor is in the session answering questions as they come up. You never sit with a doubt for long.</p>
                                    </div>
                                </motion.div>

                                {/* Weekly Doubt Sessions */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Clock className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Weekly doubt sessions</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Every week there is a dedicated session just for clearing doubts. Bring anything you are stuck on and leave with clarity.</p>
                                    </div>
                                </motion.div>

                                {/* 24 Hour Doubt Assistant */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Zap className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">24 hour doubt assistant</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">When you are working late and get stuck, the doubt assistant is right there. You do not have to wait until the next class to move forward.</p>
                                    </div>
                                </motion.div>

                                {/* Personal Growth Associate */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Target className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Your own personal growth associate</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Every student gets a personal growth associate who tracks your progress, checks in regularly and makes sure you never fall behind.</p>
                                    </div>
                                </motion.div>

                                {/* Progress Dashboard */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Globe className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Progress dashboard for students and parents</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">A live dashboard shows exactly where you are, what you have completed and what is coming next. No guessing about how things are going.</p>
                                    </div>
                                </motion.div>

                                {/* Recorded Classes */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <BookOpen className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">All classes are recorded</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Every session is recorded. If you miss a class or want to rewatch something, the recording is right there waiting for you.</p>
                                    </div>
                                </motion.div>

                                {/* Duplicate set for seamless marquee */}
                                {/* Live Mentor Guidance - Duplicate */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Brain className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Live mentor guidance in every class</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Your mentor is in the session answering questions as they come up. You never sit with a doubt for long.</p>
                                    </div>
                                </motion.div>

                                {/* Weekly Doubt Sessions - Duplicate */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Clock className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">Weekly doubt sessions</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Every week there is a dedicated session just for clearing doubts. Bring anything you are stuck on and leave with clarity.</p>
                                    </div>
                                </motion.div>

                                {/* 24 Hour Doubt Assistant - Duplicate */}
                                <motion.div
                                    className="flex-shrink-0 w-80 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/40 transition-all duration-500 hover:scale-105"
                                >
                                    <div className="relative z-10">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Zap className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-4 leading-tight">24 hour doubt assistant</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">When you are working late and get stuck, the doubt assistant is right there. You do not have to wait until the next class to move forward.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Schedule Note */}
                        <motion.div
                            className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-2xl p-8 text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Clock className="text-orange-500" size={24} />
                                <h3 className="text-2xl font-bold text-white">Schedule Note</h3>
                            </div>
                            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                                Students attend <span className="text-orange-500 font-bold">3 live classes</span> every week. Enough to keep real momentum going without taking over your entire schedule.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Course Offerings Section */}
                <CourseOfferings variant="dark" />

                {/* Enhanced Mentors Section */}
                <div className="bg-gradient-to-br from-black via-slate-950 to-black border-t border-white/5 py-24">
                    <div className="max-w-7xl mx-auto px-6">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <motion.h2 
                                className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Mentors</span>
                            </motion.h2>
                            
                            <motion.p 
                                className="text-xl text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed mb-16"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                People who actually work in tech, teaching the next generation to do the same.
                            </motion.p>

                            <motion.p 
                                className="text-lg text-slate-500 max-w-5xl mx-auto leading-relaxed mb-20"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Our mentors are not educators who studied technology. They are engineers, developers and specialists who build technology every day and chose to teach at ThinkSkool because they genuinely want to see the next wave of builders come up right.
                            </motion.p>
                        </div>

                        {/* Mentor Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                            {/* Real Industry Experience */}
                            <motion.div
                                className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-8"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Cpu className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">Real industry experience in the room</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            Every mentor has worked on real technology in the real world. That experience completely changes how they teach and what they can show you.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Enjoy Teaching Young Builders */}
                            <motion.div
                                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8"
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Target className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">They actually enjoy teaching young builders</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            ThinkSkool mentors are here because they believe students who start building early have a completely different future ahead of them.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Faculty Grid */}
                        <CourseFacultyGrid title="Faculty" isStatic={true} excludeName="Shivam Mishra" variant="dark" />
                    </div>
                </div>

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
