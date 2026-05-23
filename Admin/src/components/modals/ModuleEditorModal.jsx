import React, { useState, useEffect } from 'react';
import { 
    X, 
    Plus, 
    Trash2, 
    GripVertical, 
    Save, 
    Video, 
    Type, 
    Layout, 
    Zap,
    ChevronDown,
    ChevronUp,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const ModuleEditorModal = ({ isOpen, onClose, course, onUpdate }) => {
    const [modules, setModules] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedModule, setExpandedModule] = useState(null);

    useEffect(() => {
        if (course && course.modules) {
            setModules([...course.modules].sort((a, b) => (a.order || 0) - (b.order || 0)));
        } else {
            setModules([]);
        }
    }, [course]);

    const handleAddModule = () => {
        const newModule = {
            title: 'New Module',
            description: '',
            videoUrl: '',
            order: modules.length,
            completed: false
        };
        setModules([...modules, newModule]);
        setExpandedModule(modules.length);
    };

    const handleRemoveModule = (index) => {
        if (!window.confirm('Are you sure you want to remove this module?')) return;
        const newModules = modules.filter((_, i) => i !== index);
        setModules(newModules);
    };

    const handleUpdateModule = (index, field, value) => {
        const newModules = [...modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setModules(newModules);
    };

    const handleMove = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === modules.length - 1) return;

        const newModules = [...modules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        
        // Update order fields
        const orderedModules = newModules.map((m, i) => ({ ...m, order: i }));
        setModules(orderedModules);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.patch(`/courses/${course._id}/modules`, { modules });
            toast.success('Curriculum Synced to Student Classroom');
            onUpdate();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to sync curriculum');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20">
                                <Layout className="text-sky-500" size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                Curriculum <span className="text-sky-500 not-italic">Designer</span>
                            </h2>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Course: {course.title}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                    {modules.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[2rem]">
                            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Layout className="text-slate-600" size={32} />
                            </div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No modules defined for this course</p>
                            <button 
                                onClick={handleAddModule}
                                className="mt-6 px-6 py-3 bg-sky-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-sky-400 transition-all flex items-center gap-2 mx-auto"
                            >
                                <Plus size={16} /> Create First Module
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {modules.map((mod, index) => (
                                <motion.div 
                                    layout
                                    key={index}
                                    className={`bg-slate-800/30 border ${expandedModule === index ? 'border-sky-500/50 shadow-lg shadow-sky-500/5' : 'border-slate-800'} rounded-3xl overflow-hidden transition-all`}
                                >
                                    <div className="p-4 flex items-center gap-4">
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => handleMove(index, 'up')} className="p-1 hover:text-sky-500 text-slate-600 transition-colors"><ChevronUp size={16} /></button>
                                            <button onClick={() => handleMove(index, 'down')} className="p-1 hover:text-sky-500 text-slate-600 transition-colors"><ChevronDown size={16} /></button>
                                        </div>
                                        
                                        <div className="flex-1 cursor-pointer" onClick={() => setExpandedModule(expandedModule === index ? null : index)}>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-sky-500 bg-sky-500/10 px-2 py-1 rounded">M{index + 1}</span>
                                                <h3 className="text-sm font-black text-white uppercase tracking-tight">{mod.title || 'Untitled Module'}</h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleRemoveModule(index)}
                                                className="p-2 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedModule === index && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-6 pt-2 border-t border-slate-800/50 bg-slate-800/20"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                                                <Type size={12} /> Module Title
                                                            </label>
                                                            <input 
                                                                type="text"
                                                                value={mod.title}
                                                                onChange={(e) => handleUpdateModule(index, 'title', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-sky-500/50 outline-none"
                                                                placeholder="Enter title..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                                                <Layout size={12} /> Description
                                                            </label>
                                                            <textarea 
                                                                value={mod.description}
                                                                onChange={(e) => handleUpdateModule(index, 'description', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-sky-500/50 outline-none h-24 resize-none"
                                                                placeholder="What will students learn?"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                                                <Video size={12} /> Video Resource (YouTube/Local)
                                                            </label>
                                                            <div className="relative">
                                                                <input 
                                                                    type="text"
                                                                    value={mod.videoUrl || ''}
                                                                    onChange={(e) => handleUpdateModule(index, 'videoUrl', e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-sky-500/50 outline-none"
                                                                    placeholder="Paste link or path..."
                                                                />
                                                                <Zap className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block flex items-center gap-2">
                                                                <FileText size={12} /> Study Notes (PDF/Drive URL)
                                                            </label>
                                                            <div className="relative">
                                                                <input 
                                                                    type="text"
                                                                    value={mod.notesUrl || ''}
                                                                    onChange={(e) => handleUpdateModule(index, 'notesUrl', e.target.value)}
                                                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-white focus:border-sky-500/50 outline-none"
                                                                    placeholder="Paste study notes URL..."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-4 bg-sky-500/5 border border-sky-500/10 rounded-2xl">
                                                            <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1">Status Protocol</p>
                                                            <p className="text-[11px] text-slate-400 font-medium italic">Changes here are instantly propagated to the student dashboard upon sync.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <button 
                        onClick={handleAddModule}
                        className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Module
                    </button>
                    
                    <button 
                        disabled={isSaving}
                        onClick={handleSave}
                        className={`px-10 py-4 ${isSaving ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-950 hover:bg-sky-400 shadow-lg shadow-white/5'} rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2`}
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <><Save size={18} /> Sync Curriculum</>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ModuleEditorModal;
