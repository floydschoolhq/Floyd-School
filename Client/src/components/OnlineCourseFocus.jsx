import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Radio, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_COURSES } from '../constants/siteData';
import useIsMobile from '../hooks/useIsMobile';
import EarlyRegistrationForm from './EarlyRegistrationForm';

const CourseCard = ({ course, isDark, onRegister, onDetails, onEarlyAccess }) => {
    const isComingSoon = !!course.comingSoon;
    
    return (
        <div
            className={`group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col will-change-transform
                ${isComingSoon ? 'opacity-90' : ''}
                ${isDark 
                    ? 'bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50' 
                    : 'bg-white shadow-sm hover:shadow-xl border border-slate-200'}`}
            onClick={() => !isComingSoon && onDetails(course._id)}
        >
            <div className="relative w-full aspect-[16/9] overflow-hidden">
                <img 
                    src={course.image} 
                    alt={course.title} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500
                        ${!isComingSoon ? 'group-hover:scale-110' : 'grayscale-[30%]'}`}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {!isComingSoon && (
                    <div className="absolute bottom-3 right-3 z-20">
                        <div className="px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
                            <span className="text-[10px] font-semibold text-white">{course.duration}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 p-5 flex flex-col">
                <h3 
                    className={`text-2xl lg:text-3xl font-bold tracking-tight leading-tight mb-4 text-center transition-transform
                        ${isDark ? 'text-white' : 'text-slate-900'}`}
                >
                    {isComingSoon ? 'Coming Soon' : course.title}
                </h3>

                <div className="mt-auto flex items-center justify-end">
                    {!isComingSoon ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onRegister(course._id); }}
                            className={`text-sm font-bold hover:translate-x-1 transition-all
                                ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                            Apply Now →
                        </button>
                    ) : (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEarlyAccess(course); }}
                            className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:translate-x-1 transition-all"
                        >
                            Early Register →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeaturedCourseCard = ({ course, isDark, onRegister, onDetails }) => {
    return (
        <div
            className={`relative rounded-2xl overflow-hidden cursor-pointer will-change-transform
                ${isDark 
                    ? 'bg-gradient-to-br from-[#0f0f0f] via-[#141414] to-[#0f0f0f] border border-white/10 hover:border-blue-500/50' 
                    : 'bg-white shadow-lg hover:shadow-2xl border border-slate-200'}`}
            onClick={() => onDetails(course._id)}
        >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <div className="relative flex flex-col lg:flex-row">
                <div className="relative w-full lg:w-[46%] lg:min-h-[340px] overflow-hidden">
                    <img 
                        src={course.image} 
                        alt={course.title} 
                        className="absolute inset-0 w-full h-full object-cover object-left-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                </div>

                <div className="flex-1 p-6 lg:p-8 flex flex-col items-center text-center justify-center">
                    <h3 
                        className="text-3xl lg:text-[2.5rem] xl:text-[3rem] font-black tracking-tight leading-snug mb-6 pb-1
                            bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent"
                    >
                        {course.title}
                    </h3>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        <span className={`font-bold flex items-center gap-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {course.rating} Rating
                        </span>
                        <span className={`flex items-center gap-1 font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <Radio className="w-4 h-4" /> Live Sessions
                        </span>
                        <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {course.duration}
                        </span>
                        <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {course.curriculum?.length} Modules
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onRegister(course._id); }}
                            className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:scale-105 hover:-translate-y-0.5 transition-all shadow-lg
                                ${isDark 
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-600/30 hover:shadow-blue-500/40' 
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/40'}`}
                        >
                            Apply Now
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDetails(course._id); }}
                            className={`px-6 py-4 rounded-xl font-medium text-sm hover:translate-x-2 transition-all flex items-center gap-2
                                ${isDark 
                                    ? 'text-slate-300 hover:text-white hover:bg-white/5' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            View Curriculum <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OnlineCourseFocus = ({ variant }) => {
    const navigate = useNavigate();
    const isDark = variant === 'dark';
    const isMobile = useIsMobile();
    const [earlyRegistrationCourse, setEarlyRegistrationCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('live');
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
    const mobileScrollRef = useRef(null);

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
        { id: 'live', label: 'Live' },
        { id: 'upcoming', label: 'Coming Soon' }
    ];

    const filteredCourses = FALLBACK_COURSES.filter(course => {
        if (activeTab === 'live') return !course.comingSoon;
        if (activeTab === 'upcoming') return course.comingSoon;
        return true;
    });

    // Auto-scroll logic for mobile
    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            if (!mobileScrollRef.current) return;

            const nextIndex = (mobileActiveIndex + 1) % filteredCourses.length;
            const scrollAmount = mobileScrollRef.current.offsetWidth * 0.85 + 24; // Card width (85vw) + gap (6)
            
            mobileScrollRef.current.scrollTo({
                left: nextIndex * scrollAmount,
                behavior: 'smooth'
            });
            setMobileActiveIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [isMobile, mobileActiveIndex, filteredCourses.length]);

    const handleMobileScroll = (e) => {
        if (!isMobile) return;
        const scrollLeft = e.target.scrollLeft;
        const cardWidth = e.target.offsetWidth * 0.85 + 24;
        const newIndex = Math.round(scrollLeft / cardWidth);
        if (newIndex !== mobileActiveIndex) {
            setMobileActiveIndex(newIndex);
        }
    };

    if (isMobile) {
        return (
            <section 
                id="online-focus" 
                className={`relative py-20 px-5 overflow-hidden ${isDark ? 'bg-[#050508]' : 'bg-slate-50'}`}
            >
                <div className={`absolute inset-0 pointer-events-none ${isDark ? 'invert brightness-200' : ''}`} 
                    style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }} />
                <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[80px] -mr-32 -mt-32 ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'}`} />
                
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <h2 className={`text-6xl font-black uppercase tracking-tighter leading-none mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Our Batches
                        </h2>
                        <div className={`w-16 h-1 mx-auto mt-4 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                    </div>

                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
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
                            </button>
                        ))}
                    </div>

                    <div 
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 -mx-5 px-5 scrollbar-hide"
                    >
                        {filteredCourses.map((course) => (
                            <div key={course._id} className="snap-center shrink-0 w-[85vw]">
                                <CourseCard
                                    course={course}
                                    isDark={isDark}
                                    onRegister={handleRegister}
                                    onDetails={handleDetails}
                                    onEarlyAccess={handleEarlyAccess}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {filteredCourses.map((_, idx) => (
                            <div 
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    mobileActiveIndex === idx 
                                        ? isDark ? 'w-8 bg-blue-500' : 'w-8 bg-blue-600'
                                        : isDark ? 'w-1.5 bg-white/10' : 'w-1.5 bg-slate-200'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <EarlyRegistrationForm 
                    isOpen={!!earlyRegistrationCourse}
                    onClose={() => setEarlyRegistrationCourse(null)}
                    courseTitle={earlyRegistrationCourse?.title || ''}
                    courseId={earlyRegistrationCourse?._id || ''}
                />
            </section>
        );
    }

    return (
        <section id="online-focus" className={`relative py-20 lg:py-28 overflow-hidden transition-colors duration-500 
            ${isDark ? 'bg-[#050508]' : 'bg-slate-50'}`}>
            
            <div className={`absolute inset-0 pointer-events-none ${isDark ? 'invert brightness-200' : ''}`} 
                style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.4 }} />
            <div className={`absolute top-0 left-0 w-[700px] h-[700px] rounded-full blur-[100px] -ml-[350px] -mt-[350px] ${isDark ? 'bg-blue-600/8' : 'bg-blue-100/30'}`} />
            <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[80px] -mr-[300px] -mb-[300px] ${isDark ? 'bg-purple-600/5' : 'bg-slate-200/30'}`} />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="text-center mb-14">
                    <h2 className={`text-5xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter mb-2
                        ${isDark ? 'text-white' : 'text-slate-900'}`}
                    >
                        Our Batches
                    </h2>
                    <div className={`w-24 h-1 mx-auto mt-4 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'}`} />
                </div>

                <div className="flex justify-center gap-3 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
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
                        </button>
                    ))}
                </div>

                {(activeTab === 'live' && featuredCourse) && (
                    <div className="mb-12">
                        <FeaturedCourseCard
                            course={featuredCourse}
                            isDark={isDark}
                            onRegister={handleRegister}
                            onDetails={handleDetails}
                        />
                    </div>
                )}

                {filteredCourses.filter(c => c.comingSoon || activeTab === 'upcoming').length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.filter(c => (activeTab === 'upcoming' ? c.comingSoon : !c.featured)).map((course) => (
                            <CourseCard
                                key={course._id}
                                course={course}
                                isDark={isDark}
                                onRegister={handleRegister}
                                onDetails={handleDetails}
                                onEarlyAccess={handleEarlyAccess}
                            />
                        ))}
                    </div>
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
