import React from 'react';
import { motion } from 'framer-motion';
import { 
    Code, 
    BookOpen, 
    Target, 
    Award, 
    Users, 
    Clock, 
    Play, 
    Download,
    Zap,
    Globe,
    ShieldCheck,
    Headphones,
    FileText,
    Monitor,
    CheckCircle
} from 'lucide-react';
import ScrollDarkenHeading from './common/ScrollDarkenHeading';

const CourseOfferings = ({ variant = 'dark' }) => {
    const isDark = variant === 'dark';

    const learningResources = [
        {
            icon: Play,
            title: 'Video Lectures',
            description: 'HD quality video content with subtitles and playback controls'
        },
        {
            icon: Download,
            title: 'Downloadable Resources',
            description: 'PDFs, code files, and supplementary materials for offline study'
        },
        {
            icon: FileText,
            title: 'Assignments & Projects',
            description: 'Hands-on assignments with detailed feedback and grading'
        },
        {
            icon: Monitor,
            title: 'Live Sessions',
            description: 'Interactive live classes with real-time Q&A and screen sharing'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className={`py-20 relative overflow-hidden ${
            isDark 
                ? 'bg-gradient-to-br from-black via-slate-950 to-black' 
                : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
        }`}>
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
                    isDark ? 'bg-blue-500' : 'bg-blue-400'
                }`} />
                <div className={`absolute top-40 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
                    isDark ? 'bg-purple-500' : 'bg-purple-400'
                }`} />
                <div className={`absolute bottom-20 left-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 ${
                    isDark ? 'bg-indigo-500' : 'bg-indigo-400'
                }`} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <ScrollDarkenHeading
                        title="Learning Resources"
                        subtitle="Everything you need to succeed in your learning journey"
                        variant={variant}
                    />
                </div>

                {/* Learning Resources Section */}
                <div className="mb-16">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {learningResources.map((resource, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                                    isDark
                                        ? 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-white/5 hover:border-white/10'
                                        : 'bg-white/60 border border-slate-200/50 hover:border-slate-300/50'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                                    isDark
                                        ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400'
                                        : 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600'
                                }`}>
                                    <resource.icon size={24} />
                                </div>
                                <h4 className={`font-semibold mb-2 ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                    {resource.title}
                                </h4>
                                <p className={`text-xs leading-relaxed ${
                                    isDark ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                    {resource.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Additional Benefits Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={`rounded-3xl p-8 text-center relative overflow-hidden ${
                        isDark
                            ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-white/10'
                            : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-slate-200'
                    }`}
                >
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Zap className={isDark ? 'text-yellow-400' : 'text-yellow-600'} size={24} />
                            <h3 className={`text-2xl font-black ${
                                isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                                Premium Learning Experience
                            </h3>
                        </div>
                        <p className={`text-lg mb-6 max-w-2xl mx-auto ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                            Join thousands of learners who have transformed their careers with our comprehensive courses, 
                            expert mentorship, and industry-recognized certifications.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Globe className={isDark ? 'text-blue-400' : 'text-blue-600'} size={16} />
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                    Global Community
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className={isDark ? 'text-green-400' : 'text-green-600'} size={16} />
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                    Quality Assured
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Headphones className={isDark ? 'text-purple-400' : 'text-purple-600'} size={16} />
                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                    24/7 Support
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CourseOfferings;
