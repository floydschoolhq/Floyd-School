import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Video, Trash2, ExternalLink } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const RecordingsManagement = () => {
    const toast = useToast();
    const [recordings, setRecordings] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRecordings();
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
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (rec) => {
        if (!window.confirm('Are you sure you want to delete this recording?')) return;
        try {
            if (rec.isLiveArchive) {
                await api.delete('/live-classes/' + rec._id);
                toast.success('Live recording deleted');
            } else {
                // Clear videoUrl from the course module to remove it from recordings
                const course = rec.fullCourseObj || courses.find(c => c._id === rec.courseId);
                if (course) {
                    const updatedModules = course.modules.map(m => {
                        if (m._id === rec._id) {
                            return { ...m, videoUrl: '' }; // Clear video
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

    const filtered = recordings.filter(r => r.title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global <span className="text-sky-500">Recordings</span></h2>
                    <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-xs">Manage all synchronization assets available to student classrooms.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search recordings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-3 pl-12 rounded-xl text-sm font-bold outline-none focus:border-sky-500"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-400 font-black animate-pulse uppercase tracking-widest">Loading archives...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((rec, i) => (
                        <div key={rec._id || i} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group">
                            <div className="h-40 bg-slate-900 relative flex items-center justify-center">
                                <Video className="text-slate-700 w-12 h-12" />
                                <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white">
                                    {rec.courseTitle}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">{rec.instructor}</p>
                                    <h4 className="text-lg font-black text-slate-900 leading-tight uppercase line-clamp-1">{rec.title}</h4>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <a href={rec.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-sky-500 flex items-center gap-2 hover:text-sky-600">
                                        <ExternalLink size={14} /> View
                                    </a>
                                    <button onClick={() => handleDelete(rec)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default RecordingsManagement;
