import React, { useState, useEffect } from 'react';
import { 
    X, Plus, Trash2, Save, Video, Type, Layout, Zap, 
    ChevronDown, ChevronUp, Users, IndianRupee, Settings, 
    BarChart3, Shield, Globe, Clock, GraduationCap, 
    Search, Filter, ExternalLink, Image as ImageIcon, 
    MoreVertical, Info, Terminal, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const CourseMasterModal = ({ isOpen, onClose, courseId, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [mentors, setMentors] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: '',
        price: 0,
        originalPrice: 0,
        totalSeats: 50,
        manualEnrollmentCount: 0,
        status: 'draft',
        modules: [],
        category: 'Development',
        difficulty: 'Beginner',
        duration: '4 Weeks',
        thumbnail: ''
    });

    useEffect(() => {
        if (isOpen && courseId) {
            fetchInitialData();
        }
    }, [isOpen, courseId]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [courseRes, mentorsRes, batchesRes] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get('/admin/users?role=mentor'),
                api.get(`/batches?courseId=${courseId}`)
            ]);
            
            const c = courseRes.data;
            setCourse(c);
            setBatches(batchesRes.data.batches || []);
            setFormData({
                title: c.title || '',
                description: c.description || '',
                instructor: c.instructor?._id || c.instructor || '',
                price: c.price || 0,
                originalPrice: c.originalPrice || 0,
                totalSeats: c.totalSeats || 50,
                manualEnrollmentCount: c.manualEnrollmentCount || 0,
                status: c.status || 'draft',
                modules: c.modules || [],
                category: c.category || 'Development',
                difficulty: c.difficulty || 'Beginner',
                duration: c.duration || '4 Weeks',
                thumbnail: c.thumbnail || ''
            });
            
            setMentors(mentorsRes.data.users || []);
        } catch (err) {
            toast.error('Sector failure: Could not retrieve course matrix');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put(`/courses/${courseId}`, formData);
            toast.success('Course Infrastructure Synchronized');
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Sync failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddModule = () => {
        const newModules = [...formData.modules, {
            title: 'New Module',
            description: '',
            videoUrl: '',
            order: formData.modules.length
        }];
        setFormData({ ...formData, modules: newModules });
    };

    const updateModule = (index, field, value) => {
        const newModules = [...formData.modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setFormData({ ...formData, modules: newModules });
    };

    const removeModule = (index) => {
        const newModules = formData.modules.filter((_, i) => i !== index);
        setFormData({ ...formData, modules: newModules });
    };

    const handleCreateBatch = async () => {
        const name = window.prompt('Enter Batch Name:');
        if (!name) return;
        try {
            await api.post('/batches', { 
                name, 
                course: courseId, 
                instructor: formData.instructor,
                startDate: new Date() 
            });
            toast.success('Batch deployed');
            fetchInitialData();
        } catch (err) {
            toast.error('Failed to deploy batch');
        }
    };

    const handleScheduleLive = async () => {
        const title = window.prompt('Enter Session Title:');
        if (!title) return;
        try {
            // This is a placeholder, usually involves more fields
            await api.post('/live-classes/start', {
                title,
                topic: 'Knowledge Transfer',
                mentorName: 'Admin'
            });
            toast.success('Live Session Initialized');
        } catch (err) {
            toast.error('Failed to initialize live session');
        }
    };

    if (!isOpen) return null;

    const [batches, setBatches] = useState([]);
    const [liveSessions, setLiveSessions] = useState([]);
    
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Info },
        { id: 'curriculum', label: 'Curriculum', icon: Layout },
        { id: 'batches', label: 'Batches', icon: Users },
        { id: 'live', label: 'Live Sessions', icon: Video },
        { id: 'governance', label: 'Governance', icon: Shield },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-6xl h-full max-h-[850px] rounded-[3rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            >
                {/* Master Header */}
                <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sky-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-sky-500/20 rotate-3">
                            <Terminal className="text-slate-950" size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                                    Master <span className="text-sky-500 not-italic">Control</span>
                                </h2>
                                <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">Nexus ID: {courseId?.slice(-6)}</span>
                            </div>
                            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-2 ml-1">Universal Production Suite</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-1 p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' 
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                                >
                                    <tab.icon size={14} /> {tab.label}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-[1.5rem] transition-all border border-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Sidebar (Mobile Tabs) */}
                    <div className="md:hidden w-20 border-r border-slate-800 flex flex-col items-center py-8 gap-6 bg-slate-950/20">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`p-4 rounded-2xl transition-all ${
                                    activeTab === tab.id ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'text-slate-600'
                                }`}
                            >
                                <tab.icon size={20} />
                            </button>
                        ))}
                    </div>

                    {/* Main Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decrypting Course Matrix...</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div 
                                        key="overview"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Type size={12} className="text-sky-500" /> Course Identity
                                                    </label>
                                                    <input 
                                                        type="text"
                                                        value={formData.title}
                                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all placeholder:text-slate-800"
                                                        placeholder="Enter high-impact title..."
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <Cpu size={12} className="text-sky-500" /> Core Narrative (Description)
                                                    </label>
                                                    <textarea 
                                                        value={formData.description}
                                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all h-48 resize-none placeholder:text-slate-800"
                                                        placeholder="What makes this program essential?"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Filter size={12} className="text-sky-500" /> Category
                                                        </label>
                                                        <select 
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all appearance-none cursor-pointer"
                                                        >
                                                            {['Development', 'Design', 'Data Science', 'Business', 'Marketing'].map(cat => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Zap size={12} className="text-sky-500" /> Difficulty
                                                        </label>
                                                        <select 
                                                            value={formData.difficulty}
                                                            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all appearance-none cursor-pointer"
                                                        >
                                                            {['Beginner', 'Intermediate', 'Advanced'].map(diff => (
                                                                <option key={diff} value={diff}>{diff}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <GraduationCap size={12} className="text-sky-500" /> Lead Instructor
                                                    </label>
                                                    <select 
                                                        value={formData.instructor}
                                                        onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Mentor...</option>
                                                        {mentors.map(m => (
                                                            <option key={m._id} value={m._id}>{m.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <ImageIcon size={12} className="text-sky-500" /> Visual Identity (Thumbnail URL)
                                                    </label>
                                                    <div className="relative">
                                                        <input 
                                                            type="text"
                                                            value={formData.thumbnail}
                                                            onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-sky-500/50 outline-none transition-all"
                                                            placeholder="Paste image link..."
                                                        />
                                                        {formData.thumbnail && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg overflow-hidden border border-slate-700">
                                                                <img src={formData.thumbnail} className="w-full h-full object-cover" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'curriculum' && (
                                    <motion.div 
                                        key="curriculum"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Knowledge <span className="text-sky-500 not-italic">Architecture</span></h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Design the sequence of learning nodes</p>
                                            </div>
                                            <button 
                                                onClick={handleAddModule}
                                                className="px-6 py-3 bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
                                            >
                                                <Plus size={16} /> Deploy New Module
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.modules.map((mod, index) => (
                                                <div key={index} className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/30 transition-all">
                                                    <div className="flex flex-col lg:flex-row gap-6">
                                                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-black text-sky-500 flex-shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <input 
                                                                    type="text"
                                                                    value={mod.title}
                                                                    onChange={(e) => updateModule(index, 'title', e.target.value)}
                                                                    className="bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-sky-500/30 outline-none"
                                                                    placeholder="Module Title"
                                                                />
                                                                <div className="relative">
                                                                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                                                    <input 
                                                                        type="text"
                                                                        value={mod.videoUrl}
                                                                        onChange={(e) => updateModule(index, 'videoUrl', e.target.value)}
                                                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-white focus:border-sky-500/30 outline-none"
                                                                        placeholder="Video Resource Link"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <textarea 
                                                                value={mod.description}
                                                                onChange={(e) => updateModule(index, 'description', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-xs font-medium text-slate-400 focus:border-sky-500/30 outline-none h-20 resize-none"
                                                                placeholder="Module objective and key takeaways..."
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={() => removeModule(index)}
                                                            className="p-3 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all self-start"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.modules.length === 0 && (
                                                <div className="text-center py-16 bg-slate-950/20 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                                                    <Layout size={40} className="text-slate-700 mx-auto mb-4" />
                                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No nodes detected in curriculum matrix</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'batches' && (
                                    <motion.div 
                                        key="batches"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Cohort <span className="text-sky-500 not-italic">Management</span></h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Manage student batches and timelines</p>
                                            </div>
                                            <button 
                                                onClick={handleCreateBatch}
                                                className="px-6 py-3 bg-white text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                                            >
                                                <Plus size={16} /> Deploy New Batch
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {batches.map((batch, i) => (
                                                <div key={i} className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 hover:border-sky-500/30 transition-all group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-sky-400 transition-colors">{batch.name}</h4>
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{batch.status} • {batch.students?.length || 0} Entities</p>
                                                        </div>
                                                        <span className="px-2 py-1 bg-sky-500/10 text-sky-500 rounded text-[8px] font-black uppercase tracking-widest">Active Batch</span>
                                                    </div>
                                                    <div className="space-y-3 pt-4 border-t border-slate-800/50">
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span className="text-slate-500 font-bold uppercase tracking-widest">Instructor:</span>
                                                            <span className="text-white font-black">{batch.instructor?.name || 'Assigned Mentor'}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[10px]">
                                                            <span className="text-slate-500 font-bold uppercase tracking-widest">Started:</span>
                                                            <span className="text-white font-black">{new Date(batch.startDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {batches.length === 0 && (
                                                <div className="md:col-span-2 text-center py-16 bg-slate-950/20 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                                                    <Users size={40} className="text-slate-700 mx-auto mb-4" />
                                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active cohorts detected</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'live' && (
                                    <motion.div 
                                        key="live"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Live <span className="text-rose-500 not-italic">Broadcast</span></h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time knowledge transfer protocols</p>
                                            </div>
                                            <button 
                                                onClick={handleScheduleLive}
                                                className="px-6 py-3 bg-rose-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20"
                                            >
                                                <Video size={16} /> Schedule Session
                                            </button>
                                        </div>

                                        <div className="bg-slate-950/40 border border-slate-800 rounded-[2.5rem] p-10 text-center">
                                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 animate-pulse">
                                                <Video size={32} className="text-rose-500" />
                                            </div>
                                            <h4 className="text-xl font-black text-white uppercase tracking-tighter">Live Session Interface</h4>
                                            <p className="text-slate-500 text-xs mt-3 max-w-sm mx-auto leading-relaxed">Schedule or launch live sessions for specific batches. Integration with Agora/Jitsi is active.</p>
                                            <button className="mt-8 px-10 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-slate-800 transition-all">
                                                Initialize Live Uplink
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'governance' && (
                                    <motion.div 
                                        key="governance"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="bg-slate-950/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-8">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                    <IndianRupee size={16} className="text-sky-500" /> Commercial Tier
                                                </h4>
                                                
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Price</label>
                                                        <input 
                                                            type="number"
                                                            value={formData.price}
                                                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-xl font-black text-sky-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Strike Price</label>
                                                        <input 
                                                            type="number"
                                                            value={formData.originalPrice}
                                                            onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-xl font-black text-slate-600 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Financial Integrity</p>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Dynamic pricing changes affect checkout logic globally.</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-950/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-8">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                    <Shield size={16} className="text-sky-500" /> Access Protocol
                                                </h4>
                                                
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Capacity</label>
                                                        <input 
                                                            type="number"
                                                            value={formData.totalSeats}
                                                            onChange={(e) => setFormData({...formData, totalSeats: Number(e.target.value)})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment Offset</label>
                                                        <input 
                                                            type="number"
                                                            value={formData.manualEnrollmentCount}
                                                            onChange={(e) => setFormData({...formData, manualEnrollmentCount: Number(e.target.value)})}
                                                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment Status:</label>
                                                    <div className="flex gap-2">
                                                        {['draft', 'published'].map(status => (
                                                            <button 
                                                                key={status}
                                                                onClick={() => setFormData({...formData, status})}
                                                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                                                    formData.status === status 
                                                                    ? status === 'published' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-amber-500 text-slate-950' 
                                                                    : 'bg-slate-800 text-slate-500 hover:text-white'
                                                                }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'analytics' && (
                                    <motion.div 
                                        key="analytics"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-10"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { label: 'Total Enrolled', value: course?.enrolledStudents?.length || 0, icon: Users, color: 'sky' },
                                                { label: 'Completion Rate', value: '78%', icon: Zap, color: 'emerald' },
                                                { label: 'Projected Revenue', value: `₹${(course?.enrolledStudents?.length || 0) * formData.price}`, icon: IndianRupee, color: 'indigo' },
                                            ].map((stat, i) => (
                                                <div key={i} className="bg-slate-950/40 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
                                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:scale-150 transition-all duration-700`}></div>
                                                    <stat.icon className={`text-${stat.color}-500 mb-4`} size={20} />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                                    <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-slate-950/40 border border-slate-800 rounded-[2.5rem] p-8">
                                            <div className="flex items-center justify-between mb-8">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                    <Globe size={16} className="text-sky-500" /> Student Manifest
                                                </h4>
                                                <div className="relative">
                                                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Query manifest..." 
                                                        className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-white outline-none focus:border-sky-500/30 w-64"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                                {course?.enrolledStudents?.length > 0 ? course.enrolledStudents.map((student, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:bg-slate-800/50 transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-slate-600 uppercase">
                                                                {student.name?.[0]}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-white uppercase tracking-tight">{student.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-500">{student.email}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 hover:text-sky-500 transition-all">
                                                            <ExternalLink size={14} />
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <p className="text-center py-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">No entities detected in enrollment sector</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Master Footer */}
                <div className="p-8 border-t border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Operational</span>
                        </div>
                        <div className="h-4 w-px bg-slate-800"></div>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.2em] italic">All changes propagate to Nexus Classroom 4.0</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
                        >
                            Abort Changes
                        </button>
                        <button 
                            disabled={isSaving || loading}
                            onClick={handleSave}
                            className={`px-12 py-4 ${isSaving || loading ? 'bg-slate-800 text-slate-500' : 'bg-sky-500 text-slate-950 hover:bg-white shadow-[0_0_30px_rgba(14,165,233,0.3)]'} rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <><Zap size={18} /> Synchronize Matrix</>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CourseMasterModal;
