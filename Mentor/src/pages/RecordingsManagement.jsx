import React, { useState, useEffect } from 'react';
import { 
    BookOpen, Search, Video, Trash2, ExternalLink, 
    MessageSquare, CheckCircle, Clock, Send, CornerDownRight, 
    Filter, HelpCircle, Archive, User
} from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const RecordingsManagement = () => {
    const toast = useToast();
    
    // Core state
    const [activeTab, setActiveTab] = useState('library'); // 'library' or 'doubts'
    const [recordings, setRecordings] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Doubts & discussions state
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [replyTexts, setReplyTexts] = useState({});
    const [submittingReply, setSubmittingReply] = useState({});
    const [resolvingComment, setResolvingComment] = useState({});
    const [filterModuleId, setFilterModuleId] = useState(null);
    const [doubtStatusFilter, setDoubtStatusFilter] = useState('all'); // 'all', 'pending', 'resolved', 'confirmed'

    useEffect(() => {
        fetchRecordings();
        fetchComments();
    }, []);

    const fetchRecordings = async () => {
        try {
            const [coursesRes, liveRes] = await Promise.all([
                api.get('/courses'),
                api.get('/live-classes/archive')
            ]);

            const coursesData = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data;
            const liveData = liveRes.data || [];

            setCourses(coursesData);

            const courseModules = coursesData.flatMap(course =>
                (course.modules || []).map(module => ({
                    ...module,
                    courseId: course._id,
                    courseTitle: course.title,
                    instructor: course.instructor?.name || 'Floyd School Mentor',
                    isLiveArchive: false,
                    fullCourseObj: course
                }))
            );

            const liveArchiveModules = liveData.map(lc => ({
                _id: lc._id,
                title: lc.title,
                videoUrl: lc.meetingLink,
                courseTitle: 'Live Session Archive',
                instructor: lc.mentorName || 'Floyd School Mentor',
                isLiveArchive: true,
                createdAt: lc.startedAt
            }));

            const allModules = [...liveArchiveModules, ...courseModules].filter(m => m.videoUrl);
            setRecordings(allModules);
        } catch (error) {
            console.error('Failed to fetch recordings:', error);
            toast.error('Failed to sync global recordings');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        setLoadingComments(true);
        try {
            const res = await api.get('/comments/all');
            setComments(res.data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
            toast.error('Failed to load active student discussions');
        } finally {
            setLoadingComments(false);
        }
    };

    const handleDelete = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this recording?')) return;
        try {
            if (rec.isLiveArchive) {
                await api.delete('/live-classes/' + rec._id);
                toast.success('Live recording deleted');
            } else {
                const course = rec.fullCourseObj || courses.find(c => c._id === rec.courseId);
                if (course) {
                    const updatedModules = course.modules.map(m => {
                        if (m._id === rec._id) {
                            return { ...m, videoUrl: '' };
                        }
                        return m;
                    });
                    await api.patch(`/courses/${course._id}/modules`, { modules: updatedModules });
                    toast.success('Recording detached from course module');
                }
            }
            fetchRecordings();
        } catch (error) {
            toast.error('Failed to delete recording');
        }
    };

    // Reply handler
    const handlePostReply = async (commentId) => {
        const text = replyTexts[commentId] || '';
        if (!text.trim()) return;

        setSubmittingReply(prev => ({ ...prev, [commentId]: true }));
        try {
            const res = await api.post(`/comments/${commentId}/replies`, { text });
            
            // Update comments state
            setComments(prevComments => 
                prevComments.map(c => c._id === commentId ? { ...c, replies: res.data.replies } : c)
            );
            
            // Clear reply input
            setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
            toast.success('Official reply posted successfully');
        } catch (err) {
            console.error('Failed to post reply:', err);
            toast.error('Failed to transmit reply');
        } finally {
            setSubmittingReply(prev => ({ ...prev, [commentId]: false }));
        }
    };

    // Resolve handler
    const handleResolveDoubt = async (commentId) => {
        setResolvingComment(prev => ({ ...prev, [commentId]: true }));
        try {
            const res = await api.patch(`/comments/${commentId}/resolve`);
            
            // Update local comment state
            setComments(prevComments =>
                prevComments.map(c => c._id === commentId ? { ...c, status: 'resolved' } : c)
            );
            toast.success('Doubt status updated to Resolved (Pending student confirmation)');
        } catch (err) {
            console.error('Failed to resolve comment:', err);
            toast.error('Failed to update resolution status');
        } finally {
            setResolvingComment(prev => ({ ...prev, [commentId]: false }));
        }
    };

    const handleDiscussClick = (rec) => {
        setFilterModuleId(rec._id);
        setActiveTab('doubts');
    };

    // Filter calculations
    const filteredRecordings = recordings.filter(r => 
        r.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredComments = comments.filter(c => {
        // Filter by specific video if selected
        if (filterModuleId && c.module !== filterModuleId) return false;
        
        // Filter by status
        if (doubtStatusFilter !== 'all' && c.status !== doubtStatusFilter) return false;

        // Filter by search term (handles student name, video title, or comment text)
        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            return (
                c.studentName?.toLowerCase().includes(query) ||
                c.moduleTitle?.toLowerCase().includes(query) ||
                c.text?.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Recordings & <span className="text-sky-500">Discussion Center</span>
                    </h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">
                        Review uploaded course recordings and answer student technical doubts instantly.
                    </p>
                </div>

                {/* Tabs Switcher */}
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => { setActiveTab('library'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            activeTab === 'library'
                                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <Video size={14} />
                        Library Records ({recordings.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('doubts'); setSearchTerm(''); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
                            activeTab === 'doubts'
                                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        <MessageSquare size={14} />
                        Doubt Resolving Hub
                        {comments.filter(c => c.status === 'pending').length > 0 && (
                            <span className="absolute -top-1.5 -right-1 bg-rose-500 text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black animate-bounce shadow-md">
                                {comments.filter(c => c.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Global Search & Filters Container */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={activeTab === 'library' ? "Search recordings..." : "Search doubts by student, video topic, or keyword..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-12 rounded-2xl text-sm font-bold outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                    />
                </div>

                {activeTab === 'doubts' && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Status Filter */}
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 shadow-inner">
                            {['all', 'pending', 'resolved', 'confirmed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setDoubtStatusFilter(status)}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        doubtStatusFilter === status
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'text-slate-400 hover:text-slate-700'
                                    }`}
                                >
                                    {status === 'pending' ? 'Active' : status === 'resolved' ? 'Awaiting confirm' : status === 'confirmed' ? 'Closed' : 'All'}
                                </button>
                            ))}
                        </div>

                        {/* Reset Filter Button */}
                        {filterModuleId && (
                            <button
                                onClick={() => setFilterModuleId(null)}
                                className="px-4 py-2 bg-sky-50 border border-sky-100 text-sky-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-100 transition-all flex items-center gap-1.5"
                            >
                                Clear Video Filter ×
                            </button>
                        )}

                        <button
                            onClick={fetchComments}
                            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all shadow-sm"
                            title="Refresh Doubts"
                        >
                            <Clock size={16} className="text-slate-500" />
                        </button>
                    </div>
                )}
            </div>

            {/* TAB 1: LIBRARY RECORDS */}
            {activeTab === 'library' && (
                <>
                    {loading ? (
                        <div className="p-16 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">
                            Synchronizing archives...
                        </div>
                    ) : (
                        <>
                            {filteredRecordings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRecordings.map((rec, i) => (
                                        <div key={rec._id || i} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                            <div className="h-44 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                                <Video className="text-slate-800 w-16 h-16 group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase text-white tracking-widest shadow-md">
                                                    {rec.courseTitle}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col justify-between flex-1 space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1.5">{rec.instructor}</p>
                                                    <h4 className="text-lg font-black text-slate-900 leading-tight uppercase line-clamp-2 tracking-tight group-hover:text-sky-500 transition-colors">
                                                        {rec.title}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                                                    <a
                                                        href={rec.videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-3 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                                                    >
                                                        <ExternalLink size={12} /> Play
                                                    </a>
                                                    <button
                                                        onClick={() => handleDiscussClick(rec)}
                                                        className="flex-1 py-3 bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                                                    >
                                                        <MessageSquare size={12} /> Discuss
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rec)}
                                                        className="p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-200">
                                    <HelpCircle size={64} className="mx-auto text-slate-200 mb-6 animate-pulse" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-base">No synchronized recordings found</p>
                                    <p className="text-slate-300 text-sm font-bold mt-2 uppercase tracking-tight italic">Try adjusting your search criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* TAB 2: DOUBT RESOLUTION HUB */}
            {activeTab === 'doubts' && (
                <div className="space-y-6">
                    {loadingComments ? (
                        <div className="p-16 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest text-xs">
                            Fetching discussions feed...
                        </div>
                    ) : (
                        <>
                            {filteredComments.length > 0 ? (
                                <div className="space-y-6">
                                    {filteredComments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden"
                                        >
                                            {/* Status Background Accent Bar */}
                                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                                comment.status === 'pending'
                                                    ? 'bg-amber-500'
                                                    : comment.status === 'resolved'
                                                        ? 'bg-emerald-500'
                                                        : 'bg-slate-400'
                                            }`} />

                                            {/* Avatar Box */}
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-lg border border-slate-200 shrink-0 shadow-sm">
                                                {comment.studentName ? comment.studentName[0] : 'S'}
                                            </div>

                                            {/* Discussion Container */}
                                            <div className="flex-1 space-y-4">
                                                {/* Header Line */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">{comment.studentName}</h4>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                                                            {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <span className={`px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit leading-none ${
                                                        comment.status === 'pending'
                                                            ? 'bg-amber-50 border-amber-200 text-amber-600 animate-pulse'
                                                            : comment.status === 'resolved'
                                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                                : 'bg-slate-50 border-slate-200 text-slate-500'
                                                    }`}>
                                                        {comment.status === 'pending' ? 'Active Question' : comment.status === 'resolved' ? 'Resolved (Awaiting Confirm)' : 'Closed / Resolved'}
                                                    </span>
                                                </div>

                                                {/* Recording Target Context Tag */}
                                                <div className="flex items-center gap-2 p-2 px-3 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                                                    <Video className="w-3.5 h-3.5 text-sky-500" />
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                                        From Video: <span className="text-slate-800 underline cursor-pointer" onClick={() => setFilterModuleId(comment.module)}>{comment.moduleTitle}</span>
                                                    </span>
                                                </div>

                                                {/* Question Text */}
                                                <p className="text-slate-700 text-base font-semibold leading-relaxed bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                                                    {comment.text}
                                                </p>

                                                {/* Existing Replies Feed */}
                                                {comment.replies?.length > 0 && (
                                                    <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                            <CornerDownRight size={10} />
                                                            Discussion Feed ({comment.replies.length})
                                                        </p>
                                                        <div className="space-y-3.5 pl-4 border-l-2 border-slate-100">
                                                            {comment.replies.map((reply, rIdx) => (
                                                                <div key={rIdx} className="flex items-start gap-3 p-3 bg-slate-50/60 rounded-2xl border border-slate-100">
                                                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                                                                        {reply.userName[0]}
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <h5 className="font-extrabold text-slate-800 text-sm leading-none">{reply.userName}</h5>
                                                                            {reply.userRole && (reply.userRole === 'mentor' || reply.userRole === 'admin') && (
                                                                                <span className="bg-amber-100 border border-amber-200 text-amber-600 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md leading-none">
                                                                                    Instructor
                                                                                </span>
                                                                            )}
                                                                            <span className="text-[9px] text-slate-300 font-medium">
                                                                                {new Date(reply.timestamp).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-slate-600 text-sm font-semibold">{reply.text}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Mentor Reply Input Box */}
                                                {comment.status !== 'confirmed' && (
                                                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3 items-center">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="text"
                                                                value={replyTexts[comment._id] || ''}
                                                                onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment._id]: e.target.value }))}
                                                                placeholder="Type your official technical reply..."
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        handlePostReply(comment._id);
                                                                    }
                                                                }}
                                                                className="w-full bg-slate-50 border border-slate-200 p-3.5 pr-14 rounded-2xl text-xs font-bold outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                                                            />
                                                            <button
                                                                onClick={() => handlePostReply(comment._id)}
                                                                disabled={submittingReply[comment._id] || !(replyTexts[comment._id] || '').trim()}
                                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-xl transition-all shadow-md disabled:opacity-50"
                                                            >
                                                                <Send size={12} strokeWidth={2.5} />
                                                            </button>
                                                        </div>

                                                        {/* Resolve Button */}
                                                        {comment.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleResolveDoubt(comment._id)}
                                                                disabled={resolvingComment[comment._id]}
                                                                className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer shrink-0"
                                                            >
                                                                <CheckCircle size={12} strokeWidth={2.5} />
                                                                Resolve
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-center bg-white rounded-[3rem] border border-slate-200">
                                    <Archive size={64} className="mx-auto text-slate-200 mb-6" />
                                    <p className="text-slate-400 font-black uppercase tracking-widest text-base">No active doubts in this list</p>
                                    <p className="text-slate-300 text-sm font-bold mt-2 uppercase tracking-tight italic">Students have resolved all technical questions!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default RecordingsManagement;
