import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Radio, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_COURSES } from '../constants/siteData';
import useIsMobile from '../hooks/useIsMobile';
import EarlyRegistrationForm from './EarlyRegistrationForm';

const cardVariants = {
    offscreen: { y: 80, opacity: 0, scale: 0.95 },
    onscreen: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', bounce: 0.3, duration: 0.7 }
    }
};

const staggerContainer = {
    onscreen: {
        transition: { staggerChildren: 0.1 }
    }
};

const CourseCard = ({ course, isDark, onRegister, onDetails, onEarlyAccess }) => {
    const isComingSoon = !!course.comingSoon;
    
    return (
        <motion.div
            variants={cardVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ y: -12, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col
                ${isComingSoon ? 'opacity-90' : ''}
                ${isDark 
                    ? 'bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50' 
                    : 'bg-white shadow-sm hover:shadow-xl border border-slate-200'}`}
            onClick={() => !isComingSoon && onDetails(course._id)}
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
                <motion.img 
                    src={course.image} 
                    alt={course.title} 
                    className={`absolute inset-0 w-full h-full object-cover
                        ${!isComingSoon ? 'group-hover:scale-110' : 'grayscale-[30%]'}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                />
                
                {!isComingSoon && (
                    <motion.div 
                        className="absolute bottom-3 right-3"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg">
                            <span className="text-[10px] font-semibold text-white">{course.duration}</span>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="flex-1 p-5 flex flex-col">
                <motion.h3 
                    className={`text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-4 text-center
                        ${isDark ? 'text-white' : 'text-slate-900'}`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    {course.title}
                </motion.h3>

                <div className="mt-auto flex items-center justify-between">
                    <motion.span 
                        className={`text-xs font-semibold px-2 py-1 rounded-md ${isComingSoon ? (isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600') : ''}`}
                        whileHover={isComingSoon ? { scale: 1.1, backgroundColor: isDark ? 'rgba(168, 85, 247,0.3)' : '#f3e8ff' } : {}}
                        transition={{ duration: 0.2 }}
                    >
                        {isComingSoon ? 'Coming Soon' : 'Certified Program'}
                    </motion.span>
                    
                    {!isComingSoon ? (
                        <motion.button
                            whileHover={{ scale: 1.1, x: 4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onRegister(course._id); }}
                            className={`text-sm font-bold transition-colors
                                ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                            Apply Now →
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1, x: 4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onEarlyAccess(course); }}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            Get Early Access →
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const FeaturedCourseCard = ({ course, isDark, onRegister, onDetails }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`relative rounded-2xl overflow-hidden cursor-pointer
                ${isDark 
                    ? 'bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50' 
                    : 'bg-white shadow-lg hover:shadow-2xl border border-slate-200'}`}
            onClick={() => onDetails(course._id)}
        >
            <motion.div 
                className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ transformOrigin: 'left' }}
            />
            
            <div className="relative flex flex-col lg:flex-row">
                <motion.div 
                    className="relative w-full lg:w-[46%] lg:min-h-[340px] overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.img 
                        src={course.image} 
                        alt={course.title} 
                        className="absolute inset-0 w-full h-full object-cover object-left-top"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"
                        whileHover={{ opacity: 0.6 }}
                    />
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                        whileHover={{ opacity: 0.8 }}
                    />
                </motion.div>

                <div className="flex-1 p-6 lg:p-8 flex flex-col items-center text-center justify-center">
                    <motion.h3 
                        className="text-3xl lg:text-[2.5rem] xl:text-[3rem] font-black tracking-tight leading-snug mb-6 pb-1
                            bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        {course.title}
                    </motion.h3>

                    <motion.div 
                        className="flex flex-wrap items-center justify-center gap-4 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.span 
                            className={`font-bold flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {course.rating} Rating
                        </motion.span>
                        <motion.span 
                            className={`flex items-center gap-1 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Radio className="w-4 h-4" /> Live Sessions
                        </motion.span>
                        <motion.span 
                            className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            {course.duration}
                        </motion.span>
                        <motion.span 
                            className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            {course.curriculum?.length} Modules
                        </motion.span>
                    </motion.div>

                    <motion.div 
                        className="flex items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.08, y: -2, boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => { e.stopPropagation(); onRegister(course._id); }}
                            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg
                                ${isDark 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-600/30' 
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30'}`}
                        >
                            Apply Now
                        </motion.button>
                        <motion.button
                            whileHover={{ x: 8, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onDetails(course._id); }}
                            className={`px-6 py-4 rounded-xl font-medium text-sm transition-all flex items-center gap-2
                                ${isDark 
                                    ? 'text-slate-300 hover:text-white hover:bg-white/5' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            View Curriculum <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const OnlineCourseFocus = ({ variant }) => {
    const navigate = useNavigate();
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    const [earlyRegistrationCourse, setEarlyRegistrationCourse] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('all');

    const handleRegister = (courseId) => {
        navigate(`/course/${courseId}?openRegistration=true`);
    };

    const handleDetails = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    const handleEarlyAccess = (course) => {
        setEarlyRegistrationCourse(course);
    };

    const featuredCourse = FALLBACK_COURSES.find(c => !c.comingSoon);
    const otherCourses = FALLBACK_COURSES.filter(c => c.comingSoon);

    const tabs = [
        { id: 'all', label: 'All Programs' },
        { id: 'live', label: 'Currently Enrolling' },
        { id: 'upcoming', label: 'Coming Soon' }
    ];

    const filteredCourses = FALLBACK_COURSES.filter(course => {
        if (activeTab === 'all') return true;
        if (activeTab === 'live') return !course.comingSoon;
        if (activeTab === 'upcoming') return course.comingSoon;
        return true;
    });

    if (isMobile) {
        return (
            <motion.section 
                id="online-focus" 
                className={`relative py-20 px-5 overflow-hidden ${isDark ? 'bg-[#050508]' : 'bg-slate-50'}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className={`absolute inset-0 pointer-events-none ${isDark ? 'invert brightness-200' : ''}`} 
                    style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }} />
                <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[120px] -mr-32 -mt-32 ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'}`} />
                
                <div className="relative z-10">
                    <motion.div 
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={`text-6xl font-black uppercase tracking-tighter leading-none mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Our Batches
                        </h2>
                        <motion.div 
                            className={`w-16 h-1 mx-auto mt-4 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        />
                    </motion.div>

                    <motion.div 
                        className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {tabs.map((tab, index) => (
                            <motion.button
                                key={tab.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                whileTap={{ scale: 0.95 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.05 * index }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all
                                    ${activeTab === tab.id
                                        ? isDark 
                                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
                                            : 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : isDark 
                                            ? 'bg-white/5 text-slate-400' 
                                            : 'bg-slate-100 text-slate-500'}`}
                            >
                                {tab.label}
                            </motion.button>
                        ))}
                    </motion.div>

                    <div className="space-y-5">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course._id}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index, type: 'spring', stiffness: 200 }}
                            >
                                <CourseCard
                                    course={course}
                                    isDark={isDark}
                                    onRegister={handleRegister}
                                    onDetails={handleDetails}
                                    onEarlyAccess={handleEarlyAccess}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <EarlyRegistrationForm 
                    isOpen={!!earlyRegistrationCourse}
                    onClose={() => setEarlyRegistrationCourse(null)}
                    courseTitle={earlyRegistrationCourse?.title || ''}
                    courseId={earlyRegistrationCourse?._id || ''}
                />
            </motion.section>
        );
    }

    return (
        <section id="online-focus" className={`relative py-20 lg:py-28 overflow-hidden transition-colors duration-500 
            ${isDark ? 'bg-[#050508]' : 'bg-slate-50'}`}>
            
            <div className={`absolute inset-0 pointer-events-none ${isDark ? 'invert brightness-200' : ''}`} 
                style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.4 }} />
            <div className={`absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[160px] -ml-[350px] -mt-[350px] ${isDark ? 'bg-blue-600/8' : 'bg-blue-100/30'}`} />
            <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] -mr-[300px] -mb-[300px] ${isDark ? 'bg-purple-600/5' : 'bg-slate-200/30'}`} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <motion.div 
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className={`text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-2
                            ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                        Our Batches
                    </motion.h2>
                    
                    <motion.div 
                        className={`w-24 h-1 mx-auto mt-4 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`}
                        initial={{ scaleX: 0, width: 0 }}
                        whileInView={{ scaleX: 1, width: '6rem' }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center gap-3 mb-12"
                >
                    {tabs.map((tab, index) => (
                        <motion.button
                            key={tab.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * index, type: 'spring', stiffness: 300 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                                ${activeTab === tab.id
                                    ? isDark 
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : isDark 
                                        ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' 
                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </motion.div>

                {featuredCourse && (activeTab === 'all' || activeTab === 'live') && (
                    <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                        className="mb-12"
                    >
                        <FeaturedCourseCard
                            course={featuredCourse}
                            isDark={isDark}
                            onRegister={handleRegister}
                            onDetails={handleDetails}
                        />
                    </motion.div>
                )}

                {(activeTab === 'all' ? otherCourses : filteredCourses.filter(c => c.comingSoon)).length > 0 && (
                    <motion.div
                        variants={staggerContainer}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {(activeTab === 'all' ? otherCourses : filteredCourses.filter(c => c.comingSoon)).map((course, index) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isDark={isDark}
                                onRegister={handleRegister}
                                onDetails={handleDetails}
                                onEarlyAccess={handleEarlyAccess}
                            />
                        ))}
                    </motion.div>
                )}

            </div>

            <EarlyRegistrationForm 
                isOpen={!!earlyRegistrationCourse}
                onClose={() => setEarlyRegistrationCourse(null)}
                courseTitle={earlyRegistrationCourse?.title || ''}
                courseId={earlyRegistrationCourse?._id || ''}
            />
        </section>
    );
};

export default OnlineCourseFocus;
