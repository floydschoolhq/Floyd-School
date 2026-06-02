import React, { useState, useEffect, Suspense, lazy, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, PlayCircle, FileText, Trash2, X, Video, Calendar, Users, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { GradientCard } from '../../components/dashboard/GradientCard';
import api, { getFileUrl } from '../../api/axios';
import schedulePdf from '../../assets/pdf/thinkskool_TTS_schedule.pdf';

import { io } from 'socket.io-client';
import LiveChatSidebar from '../../components/Student/LiveChatSidebar';
import CustomVideoPlayer from '../../components/Student/CustomVideoPlayer';
import Masterclasses from '../../components/Masterclasses';
import AssignmentSubmissionModal from '../../components/Student/AssignmentSubmissionModal';
import { CardSkeleton, StatSkeleton } from '../../components/dashboard/SkeletonCard';
import { PortalContext } from '../../contexts/PortalProvider';
import { useSocket } from '../../contexts/SocketProvider';
import useIsMobile from '../../hooks/useIsMobile';

const getGoogleDriveFileId = (url) => {
  if (!url) return null;
  const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]{25,})[/?]?/);
  if (matchD && matchD[1]) return matchD[1];
  
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]{25,})/);
  if (matchId && matchId[1]) return matchId[1];
  
  if (url.match(/^[a-zA-Z0-9_-]{25,}$/)) return url;
  return null;
};

const ClassroomPage = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const isMobile = useIsMobile(768);

  const { user, setView, setActiveLiveClass: setGlobalActiveLiveClass } = useContext(PortalContext);
  
  // Check if user is classroom user (from sessionStorage auth)
  const isClassroomUser = user?.isClassroomAccess === true;
  
  // Classroom users still need admin approval for content
  const canAccessContent = user?.permissions?.canAccessCourses;
  const [courses, setCourses] = useState([]);
  const [activeStudyCourse, setActiveStudyCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedClassNumber, setSelectedClassNumber] = useState(1);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeLiveClass, setActiveLiveClass] = useState(null);
  const [scheduledLives, setScheduledLives] = useState([]);
  const [endedLiveClasses, setEndedLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myDoubt, setMyDoubt] = useState(null);
  const [isSignaling, setIsSignaling] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [activeScheduledVideo, setActiveScheduledVideo] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [togglingComplete, setTogglingComplete] = useState(false);

  // Toggle a module complete / incomplete — updates server + local state
  const handleToggleModuleComplete = async (courseId, moduleId) => {
    if (togglingComplete) return;

    // Content check: block marking as complete if there are no videos, notes, or assignments
    if (selectedModule && selectedModule._id.toString() === moduleId.toString()) {
      const hasRecording = endedLiveClasses.some(l => 
        (l.course?._id || l.course)?.toString() === courseId.toString() &&
        l.module?.toString() === selectedModule._id.toString() &&
        Number(l.classNumber || 1) === Number(selectedClassNumber) &&
        l.status === 'ended'
      );
      const hasVideo = (selectedModule.videoUrl && selectedModule.videoUrl.trim() !== '') || hasRecording;
      const hasNotes = selectedModule.notesUrl && selectedModule.notesUrl.trim() !== '';
      
      const moduleAssignment = assignments.find(a => {
        const assignmentModuleId = a.module?._id || a.module;
        const assignmentCourseId = a.course?._id || a.course;
        return assignmentModuleId && selectedModule._id && 
          (assignmentModuleId.toString() === selectedModule._id.toString()) &&
          assignmentCourseId && courseId &&
          (assignmentCourseId.toString() === courseId.toString());
      });

      const isCompleted = selectedModule.completedClasses 
        ? selectedModule.completedClasses[selectedClassNumber - 1] 
        : selectedModule.completed;

      if (!isCompleted && !hasVideo && !hasNotes && !moduleAssignment) {
        alert("Cannot mark complete: This module has no videos, study notes, or assignments yet.");
        return;
      }
    }

    setTogglingComplete(true);
    try {
      const res = await api.post(`/courses/${courseId}/modules/${moduleId}/toggle-complete?classNumber=${selectedClassNumber}`);
      const completedIds = res.data.completedModules.map(id => id.toString());
      const completedClassesList = res.data.completedClasses || [];

      // Update courses state so header progress % re-renders immediately
      setCourses(prev => prev.map(c => {
        if (c._id.toString() !== courseId.toString()) return c;
        return {
          ...c,
          modules: c.modules.map(m => {
            const mId = m._id.toString();
            return {
              ...m,
              completed: completedIds.includes(mId),
              completedClasses: [
                completedClassesList.includes(`${mId}-1`),
                completedClassesList.includes(`${mId}-2`),
                completedClassesList.includes(`${mId}-3`)
              ]
            };
          })
        };
      }));

      // Also update activeStudyCourse so the sidebar checkmark updates
      setActiveStudyCourse(prev => {
        if (!prev || prev._id.toString() !== courseId.toString()) return prev;
        return {
          ...prev,
          modules: prev.modules.map(m => {
            const mId = m._id.toString();
            return {
              ...m,
              completed: completedIds.includes(mId),
              completedClasses: [
                completedClassesList.includes(`${mId}-1`),
                completedClassesList.includes(`${mId}-2`),
                completedClassesList.includes(`${mId}-3`)
              ]
            };
          })
        };
      });

      // Synchronize selectedModule completedClasses immediately
      setSelectedModule(prev => {
        if (!prev || prev._id.toString() !== moduleId.toString()) return prev;
        return {
          ...prev,
          completed: completedIds.includes(moduleId.toString()),
          completedClasses: [
            completedClassesList.includes(`${moduleId}-1`),
            completedClassesList.includes(`${moduleId}-2`),
            completedClassesList.includes(`${moduleId}-3`)
          ]
        };
      });
    } catch (err) {
      console.error('Failed to toggle module complete:', err);
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleRequestAccess = async () => {
    setRequestingAccess(true);
    try {
      await api.post('/students/request-access', {
        permission: 'canAccessCourses',
        message: 'Requesting access to course classroom'
      });
      alert('Access request submitted! An administrator will review your request shortly.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit access request');
    } finally {
      setRequestingAccess(false);
    }
  };

  const getSubmissionAssignmentId = (submission) => {
    return (submission?.assignment?._id || submission?.assignment || '').toString();
  };

  const getAssignmentSubmission = (assignmentId) => {
    return submissions.find(sub => getSubmissionAssignmentId(sub) === assignmentId.toString());
  };

  const handleAssignmentSubmitted = (submission) => {
    const assignmentId = getSubmissionAssignmentId(submission);

    setSubmissions(prev => [
      submission,
      ...prev.filter(item => getSubmissionAssignmentId(item) !== assignmentId)
    ]);

    setSelectedAssignment(null);
  };

  useEffect(() => {
    // Only connect socket if available
    if (!socket) {
      setLoading(false); // In case socket is missing but we're here
      return;
    }

    fetchActiveLiveClass();
    fetchScheduledLives();

    socket.on('liveClass:started', (liveClass) => {
      setActiveLiveClass(liveClass);
      setGlobalActiveLiveClass(liveClass);
    });

    socket.on('liveClass:ended', (classId) => {
      setActiveLiveClass(prev => (prev?._id === classId ? null : prev));
      setGlobalActiveLiveClass(null);
      setMyDoubt(null);
    });

    socket.on('scheduledLive:started', (scheduledLive) => {
      setScheduledLives(prev => {
        const updated = prev.map(live => 
          live._id === scheduledLive._id ? { ...live, status: 'live' } : live
        );
        if (!updated.some(live => live._id === scheduledLive._id)) {
          updated.push({ ...scheduledLive, status: 'live' });
        }
        return updated;
      });
      // Normalize and set as active live class!
      const normalized = {
        ...scheduledLive,
        mentorName: scheduledLive.mentorName || scheduledLive.mentor?.name || 'Instructor',
        topic: scheduledLive.description || scheduledLive.topic || 'Live Session',
        startedAt: scheduledLive.actualStart || scheduledLive.scheduledStart || new Date()
      };
      setActiveLiveClass(normalized);
      setGlobalActiveLiveClass(normalized);
      if (socket) {
        fetchMyCurrentDoubt(normalized._id);
        socket.emit('liveClass:join', {
          classId: normalized._id,
          user: {
            _id: user?._id || user?.id,
            name: user?.name,
            email: user?.email,
            avatar: user?.avatar
          }
        });
      }
    });

    socket.on('scheduledLive:ended', (liveId) => {
      setScheduledLives(prev => prev.map(live => 
        live._id === liveId ? { ...live, status: 'ended' } : live
      ));
      setActiveLiveClass(prev => (prev?._id === liveId ? null : prev));
      setGlobalActiveLiveClass(null);
      setMyDoubt(null);
    });

    socket.on('doubt:resolved', (resolvedDoubt) => {
      setMyDoubt(prev => (prev?._id === resolvedDoubt._id ? { ...prev, isResolved: true } : prev));
    });

    socket.on('doubt:new', (newDoubt) => {
      const studentId = user?._id || user?.id;
      if (studentId && newDoubt.student === studentId) {
        setMyDoubt(newDoubt);
      }
    });

    socket.on('doubt:deleted', (deletedDoubtId) => {
      setMyDoubt(prev => (prev?._id === deletedDoubtId ? null : prev));
    });

    return () => {
      if (socket) {
        socket.off('liveClass:started');
        socket.off('liveClass:ended');
        socket.off('scheduledLive:started');
        socket.off('scheduledLive:ended');
        socket.off('doubt:resolved');
        socket.off('doubt:new');
        socket.off('doubt:deleted');
      }
    };
  }, [socket, user]);

  useEffect(() => {
    fetchClassroomData();
  }, [user]);

  useEffect(() => {
    const preventContext = (e) => e.preventDefault();
    window.addEventListener('contextmenu', preventContext);
    return () => window.removeEventListener('contextmenu', preventContext);
  }, []);

  const checkActiveScheduledLive = (livesList = [], optCourses = null) => {
    // Look for an active scheduled YouTube live session
    const activeScheduled = (livesList || []).find(l => l.status === 'live');
    if (activeScheduled) {
      // Filter live class to only show if it matches student's granted courses or enrolled courses
      const courseId = activeScheduled.course?._id || activeScheduled.course || '';
      const userGrantedCourses = user?.permissions?.grantedCourses || [];
      const activeCourses = optCourses || courses || [];
      const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                        activeCourses.some(c => (c._id || c).toString() === courseId.toString());

      if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
        const normalized = {
          ...activeScheduled,
          mentorName: activeScheduled.mentorName || activeScheduled.mentor?.name || 'Instructor',
          topic: activeScheduled.description || activeScheduled.topic || 'Live Session',
          startedAt: activeScheduled.actualStart || activeScheduled.scheduledStart || new Date()
        };
        setActiveLiveClass(normalized);
        setGlobalActiveLiveClass(normalized);
        if (socket) {
          fetchMyCurrentDoubt(normalized._id);
          socket.emit('liveClass:join', {
            classId: normalized._id,
            user: {
              _id: user?._id || user?.id,
              name: user?.name,
              email: user?.email,
              avatar: user?.avatar
            }
          });
        }
        return;
      }
    }
    setActiveLiveClass(null);
    setGlobalActiveLiveClass(null);
  };

  const fetchActiveLiveClass = async (optScheduledLives = null, optCourses = null) => {
    try {
      const res = await api.get('/live-classes/active');
      if (res.data) {
        // Filter live class to only show if it matches student's granted courses or enrolled courses
        const courseId = res.data.course?._id || res.data.course || '';
        const userGrantedCourses = user?.permissions?.grantedCourses || [];
        const activeCourses = optCourses || courses || [];
        const hasAccess = userGrantedCourses.some(gc => (gc._id || gc).toString() === courseId.toString()) ||
                          activeCourses.some(c => (c._id || c).toString() === courseId.toString());
        
        if (hasAccess || user?.role === 'admin' || user?.role === 'mentor') {
          const normalized = {
            ...res.data,
            mentorName: res.data.mentorName || res.data.mentor?.name || 'Instructor',
            startedAt: res.data.startedAt || new Date()
          };
          setActiveLiveClass(normalized);
          setGlobalActiveLiveClass(normalized);
          if (socket) {
            fetchMyCurrentDoubt(res.data._id);
            socket.emit('liveClass:join', {
              classId: res.data._id,
              user: {
                _id: user?._id || user?.id,
                name: user?.name,
                email: user?.email,
                avatar: user?.avatar
              }
            });
          }
          return;
        }
      }
      
      // Fallback: check if we have any active scheduled live class
      checkActiveScheduledLive(optScheduledLives || scheduledLives, optCourses);
    } catch (error) {
      console.error('Failed to fetch active live class:', error);
      checkActiveScheduledLive(optScheduledLives || scheduledLives, optCourses);
    }
  };

  const fetchScheduledLives = async (optCourses = null) => {
    try {
      const res = await api.get('/scheduled-live/upcoming');
      // Safely normalize - the API should return an array but guard against error objects
      const livesData = Array.isArray(res.data) ? res.data : [];
      setScheduledLives(livesData);
      // If there is no active Jitsi class, check if any scheduled live is active
      const hasActiveJitsi = activeLiveClass && !activeLiveClass.videoUrl;
      if (!hasActiveJitsi) {
        checkActiveScheduledLive(livesData, optCourses || courses);
      }
    } catch (error) {
      console.error('Failed to fetch scheduled lives:', error);
    }
  };

  const fetchMyCurrentDoubt = async (classId) => {
    try {
      const res = await api.get(`/doubts/${classId}/my`);
      setMyDoubt(res.data);
    } catch (error) {
      // It's okay if no doubt exists
    }
  };

  const handleRaiseHand = async () => {
    if (!activeLiveClass || myDoubt) return;
    setIsSignaling(true);
    try {
      const res = await api.post('/doubts', {
        liveClassId: activeLiveClass._id,
        question: 'Student is requesting technical assistance or has a live doubt.'
      });
      setMyDoubt(res.data);
    } catch (error) {
      console.error('Failed to signal mentor:', error);
    } finally {
      setIsSignaling(false);
    }
  };

  const handleTerminateDoubt = async () => {
    if (!myDoubt) return;
    try {
      const doubtId = myDoubt._id;
      setMyDoubt(null);
      await api.delete(`/doubts/${doubtId}`);
    } catch (error) {
      console.error('Failed to terminate doubt:', error);
    }
  };

  const fetchClassroomData = async () => {
    try {
      const [coursesRes, assignmentsRes, archiveRes, dashboardRes] = await Promise.all([
        api.get('/courses'),
        api.get('/assignments'),
        api.get('/live-classes/archive').catch(() => ({ data: [] })),
        api.get('/dashboard/student').catch(() => null)
      ]);
      const loadedCourses = Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data.data;
      setCourses(loadedCourses);
      setAssignments(Array.isArray(assignmentsRes.data) ? assignmentsRes.data : assignmentsRes.data.data);
      setEndedLiveClasses(archiveRes?.data || []);
      setSubmissions(dashboardRes?.data?.submissions || []);
      
      // Proactively load active and scheduled lives with the fresh courses array to bypass state staleness
      fetchActiveLiveClass(null, loadedCourses);
      fetchScheduledLives(loadedCourses);
    } catch (error) {
      console.error('Failed to fetch classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-base p-3 sm:p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <CardSkeleton lines={3} />
              <CardSkeleton lines={2} />
            </div>
            <CardSkeleton lines={4} />
          </div>
        </div>
      </div>
    );
  }

  const renderCourseClassroomHub = () => {
    if (!activeStudyCourse) return null;

    // Find any assignment for the current module of this specific course
    const moduleAssignment = assignments.find(a => {
      const assignmentModuleId = a.module?._id || a.module;
      const assignmentCourseId = a.course?._id || a.course;
      
      return assignmentModuleId && selectedModule?._id && 
        (assignmentModuleId.toString() === selectedModule._id.toString()) &&
        assignmentCourseId && activeStudyCourse?._id &&
        (assignmentCourseId.toString() === activeStudyCourse._id.toString());
    });

    // Find any scheduled live classes for the course
    const moduleLive = scheduledLives.find(l => 
      (l.course?._id || l.course)?.toString() === activeStudyCourse._id?.toString()
    );

    const isLiveNow = activeLiveClass && (
      (activeLiveClass.course?._id?.toString() === activeStudyCourse._id?.toString() || activeLiveClass.course?.toString() === activeStudyCourse._id?.toString()) &&
      activeLiveClass.module?.toString() === selectedModule?._id?.toString() &&
      Number(activeLiveClass.classNumber || 1) === Number(selectedClassNumber)
    );

    // Find active scheduled or standard live session for current module and class number
    const activeModuleLive = scheduledLives.find(l => 
      (l.course?._id || l.course)?.toString() === activeStudyCourse._id?.toString() &&
      l.module?.toString() === selectedModule?._id?.toString() &&
      Number(l.classNumber || 1) === Number(selectedClassNumber) &&
      l.status === 'live'
    ) || (
      activeLiveClass && 
      (activeLiveClass.course?._id?.toString() === activeStudyCourse._id?.toString() || activeLiveClass.course?.toString() === activeStudyCourse._id?.toString()) &&
      activeLiveClass.module?.toString() === selectedModule?._id?.toString() &&
      Number(activeLiveClass.classNumber || 1) === Number(selectedClassNumber)
        ? activeLiveClass
        : null
    );

    // Find ended live session for current module and class number
    const moduleRecording = endedLiveClasses.find(l => 
      (l.course?._id || l.course)?.toString() === activeStudyCourse._id?.toString() &&
      l.module?.toString() === selectedModule?._id?.toString() &&
      Number(l.classNumber || 1) === Number(selectedClassNumber) &&
      l.status === 'ended'
    );

    const submission = moduleAssignment ? getAssignmentSubmission(moduleAssignment._id) : null;

    return (
      <div className={`bg-surface-base text-text-main ${isMobile ? 'p-4' : 'p-6'} transition-all duration-500`}>
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-el">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setActiveStudyCourse(null);
                setSelectedModule(null);
              }}
              className="p-3 bg-surface-soft hover:bg-surface-el text-text-muted hover:text-text-main rounded-2xl border border-surface-el transition-all flex items-center justify-center"
              title="Back to Classroom"
            >
              <X size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded uppercase tracking-widest border border-accent-primary/20">
                  Course Hub
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                  {activeStudyCourse.difficulty || 'Beginner'}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main">
                {activeStudyCourse.title}
              </h1>
              <p className="text-xs font-medium text-text-muted mt-0.5">
                Instructor: {activeStudyCourse.instructor?.name || 'thinkskool Mentor'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Your Progress</div>
              <div className="text-xl font-bold text-accent-primary">
                {Math.round((activeStudyCourse.modules?.filter(m => m.completed).length / activeStudyCourse.modules?.length * 100) || 0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Live Session Alert Banner */}
        {isLiveNow && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-0.5 rounded-3xl bg-red-500/10 border border-red-500/20 overflow-hidden shadow-sm"
          >
            <div className="p-4 sm:p-5 bg-surface-soft rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                    <Video size={18} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-text-main text-sm uppercase tracking-tight">Live Session is Active Now!</h4>
                  <p className="text-[11px] text-text-muted font-medium mt-0.5">
                    {activeLiveClass.title} is currently broadcasting. Join the live workspace to interact.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setGlobalActiveLiveClass(activeLiveClass);
                  setView('LiveSession');
                  navigate('/student/live-session');
                }}
                className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-red-500/10 shrink-0 cursor-pointer"
              >
                Join Live Classroom
              </button>
            </div>
          </motion.div>
        )}

        {/* Classroom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Curriculum Outline */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2 px-1">Curriculum Nodes</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {activeStudyCourse.modules?.map((mod, idx) => {
                const isSelected = selectedModule?._id === mod._id;
                const hasContent = mod.videoUrl || mod.notesUrl;
                const isExpanded = !!expandedWeeks[mod._id];

                return (
                  <div key={mod._id || idx} className="space-y-2">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setExpandedWeeks(prev => ({
                          ...prev,
                          [mod._id]: !prev[mod._id]
                        }));
                        setSelectedModule(mod);
                        setSelectedClassNumber(1);
                      }}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-accent-primary/10 border-accent-primary shadow-sm' 
                          : 'bg-surface-soft border-surface-el hover:border-text-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-accent-primary text-white' : 'bg-surface-el text-text-muted'
                        }`}>
                          W{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-text-main truncate uppercase tracking-tight">
                            {mod.title || 'Untitled Module'}
                          </h4>
                          <p className="text-[10px] font-semibold text-text-muted truncate mt-0.5">
                            {mod.description || 'No description provided.'}
                          </p>
                        </div>
                        <div className="text-text-muted shrink-0 pl-1">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-surface-el pt-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${
                          hasContent ? 'text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20' : 'text-text-muted'
                        }`}>
                          {hasContent ? 'Content Available' : 'Upcoming'}
                        </span>
                        {mod.completed && (
                          <CheckCircle size={12} className="text-emerald-400" />
                        )}
                      </div>
                    </motion.div>

                    {/* Sub-classes nesting */}
                    {isExpanded && (
                      <div className="pl-4 border-l-2 border-surface-el/80 space-y-2 ml-4 mb-3">
                        {(
                          // Full 36-class schedule from thinkskool TTS PDF (3 per module/week)
                          [
                            // Week 1
                            ['What is Python & Why It Matters; Setting Up Environment; Variables & Data Types',
                             'User Input; If/Else Conditions; Writing Your First Working Program',
                             'Recap & Hands-On Practice'],
                            // Week 2
                            ['For Loops & While Loops',
                             'Functions with Parameters and Return Values',
                             'Lists & Dictionaries; Organising and Working with Data'],
                            // Week 3
                            ['Reading and Writing Files Permanently',
                             'Installing and Using Python Libraries',
                             'Combining All Concepts into One Real Build'],
                            // Week 4
                            ['Error Handling with Try and Except',
                             'Introduction to Classes and Objects (OOP)',
                             'Month 1 Consolidation & Free Build Session'],
                            // Week 5
                            ['Using ChatGPT as a Coding Partner; Prompt Engineering Basics',
                             'Connecting to the OpenAI API',
                             'Building a Chatbot with a Custom Personality'],
                            // Week 6
                            ['What is an API; JSON Data Handling',
                             'Fetching Live Weather and News Data from Real External Services',
                             'Build & Deploy the Live Data App'],
                            // Week 7
                            ['How Computers Learn from Data; Supervised vs Unsupervised Learning',
                             'Loading Real Datasets with Pandas',
                             'Training First ML Model with Scikit-learn'],
                            // Week 8
                            ['Classification Models and Decision Trees',
                             'Training, Testing and Accuracy Scoring',
                             'Saving and Reusing a Trained Model with Pickle'],
                            // Week 9
                            ['Intro to Computer Vision; How OpenCV Works; Loading Images',
                             'Applying Filters, Detecting Edges with OpenCV',
                             'Live Webcam Feed & Real-Time Face Detection'],
                            // Week 10
                            ['What Flask Is; How Web Apps Work; Routes, Templates & Local Server',
                             'Forms, User Input; Connecting Trained ML Model to Web Interface',
                             'Finalize and Test Flask ML Prediction Web App'],
                            // Week 11
                            ['Capstone: Face Recognition Engine on Live Webcam; Auto-Log Attendance with Name & Time',
                             'Capstone: Save Records to CSV Spreadsheet; Build Flask Attendance Live Dashboard',
                             'Full System Integration, Testing & End-to-End Walkthrough'],
                            // Week 12
                            ['Final Testing & Presentation Prep',
                             'Rehearsal with Mentor Feedback; Polish Presentation',
                             'LIVE DEMO DAY — Present AI Face Recognition Attendance System'],
                          ][idx] || [
                            'Class 1',
                            'Class 2',
                            'Class 3'
                          ]
                        ).map((classTitle, classIdx) => {
                          const cls = { num: classIdx + 1, title: classTitle };
                          const isSelectedClass = selectedModule?._id === mod._id && selectedClassNumber === cls.num;
                          
                          // Check if this class is live
                          const isClassLive = activeLiveClass &&
                              (activeLiveClass.course?._id?.toString() === activeStudyCourse._id?.toString() || activeLiveClass.course?.toString() === activeStudyCourse._id?.toString()) &&
                              activeLiveClass.module?.toString() === mod._id?.toString() &&
                              Number(activeLiveClass.classNumber || 1) === cls.num;
                              
                          const isScheduledClassLive = scheduledLives.some(l => 
                              (l.course?._id || l.course)?.toString() === activeStudyCourse._id?.toString() &&
                              l.module?.toString() === mod._id?.toString() &&
                              Number(l.classNumber || 1) === cls.num &&
                              l.status === 'live'
                          );
                          
                          const isLive = isClassLive || isScheduledClassLive;

                          return (
                            <motion.div
                              key={cls.num}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => {
                                setSelectedModule(mod);
                                setSelectedClassNumber(cls.num);
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelectedClass
                                  ? 'bg-accent-primary/10 border-accent-primary/40 text-text-main shadow-sm'
                                  : 'bg-surface-base border-surface-el hover:border-text-muted/30 text-text-muted'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                  isSelectedClass ? 'bg-accent-primary text-white' : 'bg-surface-el text-text-muted'
                                }`}>
                                  C{cls.num}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[150px]">
                                  {cls.title}
                                </span>
                              </div>
                              
                              {isLive ? (
                                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse shrink-0">
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                  <span className="text-red-500 text-[8px] font-black uppercase tracking-wider">Live</span>
                                </div>
                              ) : (
                                ((mod.completedClasses && mod.completedClasses[cls.num - 1]) || (mod.completed && cls.num === 3)) && (
                                  <CheckCircle size={10} className="text-emerald-400 shrink-0" />
                                )
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {(!activeStudyCourse.modules || activeStudyCourse.modules.length === 0) && (
                <div className="text-center py-10 bg-surface-soft border-2 border-dashed border-surface-el rounded-3xl opacity-50">
                  <BookOpen className="w-10 h-10 mx-auto text-text-muted mb-2" />
                  <p className="text-xs font-black uppercase text-text-muted tracking-widest">No modules linked yet</p>
                </div>
              )}
            </div>

            {/* Class Schedule Time Table Section */}
            <div className="pt-4 border-t border-surface-el">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-3 px-1">Class Schedule</h2>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="p-5 rounded-3xl bg-gradient-to-br from-surface-soft via-surface-base to-surface-soft border border-surface-el shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-accent-primary/10 transition-colors" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar size={18} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-text-main uppercase tracking-tight mb-1">Time Table Schedule</h4>
                    <p className="text-[11px] text-text-muted font-medium leading-relaxed mb-4">
                      Access the complete weekly lecture time table and class slots mapping.
                    </p>
                    <a
                      href={schedulePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary/95 transition-all shadow-md shadow-accent-primary/10 cursor-pointer"
                    >
                      <Download size={12} strokeWidth={3} /> View Time Table (PDF)
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Main Focus Detail Area */}
          <div className="lg:col-span-2 space-y-6">
            {selectedModule ? (
              <>
                {/* Active Unit Metadata */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-text-main uppercase tracking-tight">{selectedModule.title}</h2>
                  <p className="text-xs text-text-muted font-medium leading-relaxed mt-1">{selectedModule.description || 'Objectives for this curriculum unit will be detailed during the session.'}</p>
                </div>

                {/* 1. Video Player or Lock Placeholder */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-3 px-1">Unit Lecture</h3>
                  {(selectedModule.videoUrl || activeModuleLive || moduleRecording) ? (
                    <div className="rounded-[2rem] overflow-hidden bg-black border border-surface-el shadow-md aspect-video relative group">
                      <CustomVideoPlayer 
                        videoUrl={selectedModule.videoUrl || activeModuleLive?.videoUrl || activeModuleLive?.meetingLink || moduleRecording?.meetingLink || moduleRecording?.videoUrl} 
                        autoPlay={Boolean(activeModuleLive)} 
                        isLive={Boolean(activeModuleLive)}
                        scheduledStart={activeModuleLive?.actualStart || activeModuleLive?.startedAt || activeModuleLive?.scheduledStart}
                      />
                      {activeModuleLive && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-pulse z-20">
                          Live Now
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-surface-soft border border-surface-el rounded-[2rem] p-8 text-center flex flex-col items-center justify-center shadow-sm min-h-[250px] relative overflow-hidden group">
                      <div className="w-12 h-12 bg-surface-el border border-surface-el text-text-muted rounded-2xl flex items-center justify-center mb-3">
                        <Video size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-text-main uppercase tracking-tight mb-1">Lecture Coming Soon</h4>
                      <p className="text-xs text-text-muted max-w-xs font-semibold leading-relaxed">
                        The lecture video will be available here after the live session.
                      </p>
                    </div>
                  )}
                </div>

                {/* ── Mark as Complete Button ── */}
                {selectedModule && activeStudyCourse && (() => {
                  const hasRecording = endedLiveClasses.some(l => 
                    (l.course?._id || l.course)?.toString() === activeStudyCourse._id?.toString() &&
                    l.module?.toString() === selectedModule._id.toString() &&
                    Number(l.classNumber || 1) === Number(selectedClassNumber) &&
                    l.status === 'ended'
                  );
                  const hasNoContent = !selectedModule.videoUrl && !hasRecording && !selectedModule.notesUrl && !moduleAssignment;
                  const isClassCompleted = selectedModule.completedClasses 
                    ? selectedModule.completedClasses[selectedClassNumber - 1] 
                    : selectedModule.completed;
                  return (
                    <div className="flex items-center justify-between px-1">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${hasNoContent && !isClassCompleted ? 'text-rose-500' : 'text-text-muted'}`}>
                        {hasNoContent && !isClassCompleted
                          ? '⚠ Cannot mark as complete: No videos or materials available'
                          : isClassCompleted
                            ? '✓ This class is marked complete'
                            : 'Mark this class as done to track your progress'}
                      </p>
                      <button
                        onClick={() => handleToggleModuleComplete(activeStudyCourse._id, selectedModule._id)}
                        disabled={togglingComplete || (hasNoContent && !isClassCompleted)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${
                          hasNoContent && !isClassCompleted
                            ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800/60 cursor-not-allowed'
                            : isClassCompleted
                              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 cursor-pointer'
                              : 'bg-surface-soft border border-surface-el text-text-muted hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-600 cursor-pointer'
                        }`}
                      >
                        <CheckCircle size={13} />
                        {togglingComplete ? 'Saving…' : isClassCompleted ? 'Completed ✓' : 'Mark Complete'}
                      </button>
                    </div>
                  );
                })()}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Study Material / Notes */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] px-1">Study Material</h3>
                    {selectedModule.notesUrl ? (
                      <div className="p-5 bg-surface-soft border border-surface-el hover:border-emerald-500/30 rounded-3xl flex items-center justify-between transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-text-main uppercase text-xs tracking-tight">Study Notes</h4>
                            <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">PDF synced by instructor</p>
                          </div>
                        </div>
                        <a
                          href={getFileUrl(selectedModule.notesUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/10"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <div className="p-5 bg-surface-soft/50 border border-surface-el/80 rounded-3xl flex items-center gap-3 min-h-[82px]">
                        <div className="w-10 h-10 bg-surface-base border border-surface-el text-text-muted rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <FileText size={16} />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-text-main uppercase tracking-tight">Study Notes</h5>
                          <p className="text-[11px] text-text-muted font-bold leading-normal mt-0.5">
                            Study notes and PDF slides will be posted here after the class.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Homework & Tasks */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] px-1">Technical Assignments</h3>
                    {moduleAssignment ? (
                      <div className="p-5 bg-surface-soft border border-surface-el hover:border-purple-500/30 rounded-3xl flex flex-col justify-between transition-colors shadow-sm min-h-[82px] space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <FileText size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-text-main uppercase text-xs tracking-tight truncate">{moduleAssignment.title}</h4>
                              <p className="text-[9px] text-purple-500 font-bold uppercase tracking-widest mt-0.5">Linked Assignment Spec</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                            submission ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-surface-el text-text-muted border-surface-el'
                          }`}>
                            {submission ? (submission.status === 'graded' ? 'Graded' : 'Submitted') : 'Not Submitted'}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted font-medium leading-relaxed pl-1 line-clamp-2">{moduleAssignment.description}</p>
                        
                        {/* Mentor reference PDF Spec */}
                        {moduleAssignment.attachments && moduleAssignment.attachments.length > 0 && (
                          <div className="mt-2 p-3 bg-surface-base border border-surface-el rounded-2xl flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={14} className="text-purple-500 flex-shrink-0" />
                              <span className="text-[11px] font-bold text-text-main truncate max-w-[180px]">
                                {moduleAssignment.attachments[0].filename}
                              </span>
                            </div>
                            <a
                              href={getFileUrl(moduleAssignment.attachments[0].url)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                            >
                              Download Spec
                            </a>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-surface-el">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest pl-1">
                            Due: {new Date(moduleAssignment.dueDate).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => setSelectedAssignment(moduleAssignment)}
                            className="px-3 py-1.5 bg-text-main hover:bg-accent-primary text-surface-base hover:text-surface-base rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-md cursor-pointer"
                          >
                            {submission ? 'View' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 bg-surface-soft/50 border border-surface-el/80 rounded-3xl flex items-center gap-3 min-h-[82px]">
                        <div className="w-10 h-10 bg-surface-base border border-surface-el text-text-muted rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <FileText size={16} />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-text-main uppercase tracking-tight">Homework & Tasks</h5>
                          <p className="text-[11px] text-text-muted font-bold leading-normal mt-0.5">
                            Homework tasks and assignments will be posted here after the lecture.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-surface-soft border-2 border-dashed border-surface-el rounded-3xl opacity-50">
                <BookOpen size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Select a module node from the outline sidebar to begin your study session.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (activeStudyCourse) {
    return renderCourseClassroomHub();
  }

  return (
    <div className={`${isMobile ? 'min-h-screen bg-surface-base transition-colors duration-500' : 'min-h-screen bg-surface-base transition-colors duration-500 p-6'} relative`}>
      {!canAccessContent && (
        <div className="absolute inset-0 z-[100] bg-surface-base/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
          <div className="w-20 h-20 bg-accent-primary rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <BookOpen className="w-8 h-8 text-surface-base" />
          </div>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-text-main mb-2 tracking-normal`}>
            Access <span className="text-accent-primary">Pending</span>
          </h2>
          <p className="text-text-muted max-w-md font-medium mb-8 text-sm leading-relaxed">
            Your classroom access is currently being set up. <br />
            Please request access from your administrator to view the full curriculum.
          </p>
          <button
            onClick={handleRequestAccess}
            disabled={requestingAccess}
            className="px-10 py-5 bg-text-main text-surface-base text-sm font-bold rounded-2xl hover:bg-accent-primary hover:text-surface-base transition-all shadow-sm disabled:opacity-50"
          >
            {requestingAccess ? 'Processing...' : 'Request Course Access'}
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isMobile ? 'px-4 py-6' : 'mb-8'}`}
      >
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-semibold text-text-main mb-2 tracking-normal`}>
          My Classroom <span className="text-accent-primary">Resources</span>
        </h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-text-muted`}>
          {isMobile 
            ? 'Access lessons, recordings & assignments on the go.'
            : 'Access your lessons, assignments, and recordings through your student portal.'
          }
        </p>
      </motion.div>

      {/* Mobile-Optimized Live Class Banner */}
      {isMobile && (activeLiveClass || scheduledLives.some(l => l.status === 'live' || l.status === 'scheduled')) && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 mx-4"
        >
          <div className="bg-surface-soft border border-surface-el rounded-2xl p-0.5 shadow-sm shadow-[#2563EB]/10">
            <div className="bg-surface-base rounded-2xl p-4">
              {activeLiveClass && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                        <Video className="text-red-500 w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-text-main font-bold text-sm">
                        LIVE NOW {activeLiveClass.course && `• ${activeLiveClass.course.title}`}
                      </h3>
                      <p className="text-text-main font-bold text-base">{activeLiveClass.title}</p>
                      <p className="text-text-muted text-xs">{activeLiveClass.mentorName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {myDoubt ? (
                      <div className={`flex-1 px-3 py-2 rounded-lg font-bold flex items-center justify-center gap-2 text-xs ${myDoubt.isResolved
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600 animate-pulse'
                        }`}>
                        {myDoubt.isResolved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="uppercase tracking-wider">
                          {myDoubt.isResolved ? 'Resolved' : 'Mentor Notified'}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleRaiseHand}
                        disabled={isSignaling}
                        className="flex-1 bg-text-main text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                      >
                        {isSignaling ? 'Signaling...' : 'Raise Hand'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setGlobalActiveLiveClass(activeLiveClass);
                        setView('LiveSession');
                        navigate('/student/live-session');
                      }}
                      className="flex-1 bg-accent-primary text-surface-base px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-accent-secondary transition-colors"
                    >
                      Join Live
                    </button>
                  </div>
                </div>
              )}

              {/* Scheduled Lives for Mobile */}
              {scheduledLives.filter(l => l.status === 'scheduled').length > 0 && (
                <div className={`${activeLiveClass ? 'border-t border-surface-el pt-4 mt-4' : ''}`}>
                  <h4 className="text-xs font-semibold text-text-muted/70 font-medium mb-3">Upcoming Sessions</h4>
                  <div className="space-y-2">
                    {scheduledLives.filter(l => l.status === 'scheduled').slice(0, 2).map(live => (
                      <div 
                        key={live._id} 
                        className="bg-surface-soft rounded-lg p-3 flex items-center gap-3"
                        onClick={() => setActiveScheduledVideo(live)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="text-blue-500 w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-text-main text-sm truncate">{live.title}</h5>
                          <p className="text-xs text-text-muted">
                            {new Date(live.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Desktop Live Class Banner (Original) */}
      {!isMobile && (activeLiveClass || scheduledLives.some(l => l.status === 'live' || l.status === 'scheduled')) && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 bg-surface-soft border border-surface-el rounded-2xl p-0.5 shadow-sm shadow-[#2563EB]/10"
        >
          <div className="bg-surface-base rounded-2xl p-6 flex flex-col gap-6">
            {activeLiveClass && (
              <>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute top-0 -right-1"></div>
                      <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center border border-blue-100">
                        <PlayCircle className="text-blue-500 w-6 h-6" />
                      </div>
                    </div>
                     <div>
                       <h3 className="text-text-main text-xl font-semibold tracking-normal">
                         Live Class in Session {activeLiveClass.course && `for ${activeLiveClass.course.title}`}
                       </h3>
                       <p className="text-base font-medium text-text-muted">{activeLiveClass.title}: {activeLiveClass.topic}</p>
                       <p className="text-[13px] text-text-muted/70 font-bold uppercase mt-1">Instructor: {activeLiveClass.mentorName}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {myDoubt ? (
                      <div className={`px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border-2 ${myDoubt.isResolved
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse'
                        }`}>
                        {myDoubt.isResolved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        <span className="text-[13px] font-medium">
                          {myDoubt.isResolved ? 'Signal Resolved' : 'Mentor Signaled'}
                        </span>
                        {myDoubt.isResolved && (
                          <button
                            onClick={handleTerminateDoubt}
                            className="ml-2 bg-blue-100/50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-lg transition-colors border border-blue-200"
                            title="Close this doubt to ask a new one"
                          >
                            <Trash2 size={12} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleRaiseHand}
                        disabled={isSignaling}
                        className="bg-text-main hover:bg-accent-primary text-surface-base hover:text-surface-base px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-900/10 uppercase text-base tracking-widest cursor-pointer disabled:opacity-50"
                      >
                        {isSignaling ? 'Sending Signal...' : 'Raise Hand'}
                      </button>
                    )}
                    <div className="h-10 w-[1px] bg-surface-el mx-1 hidden md:block"></div>
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[13px] text-text-muted/70 uppercase font-semibold tracking-widest">Started at</p>
                      <p className="text-text-main font-semibold">
                        {new Date(activeLiveClass.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setGlobalActiveLiveClass(activeLiveClass);
                        setView('LiveSession');
                        navigate('/student/live-session');
                      }}
                      className="bg-accent-primary hover:bg-accent-secondary text-surface-base px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg uppercase text-base tracking-widest cursor-pointer"
                    >
                      Join Meeting <span className="bg-surface-soft px-2 py-0.5 rounded text-[13px] ml-2 font-semibold text-accent-primary border border-surface-el">LIVE</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Scheduled Lives */}
            {scheduledLives.filter(l => l.status === 'scheduled').length > 0 && (
              <div className="border-t border-surface-el pt-6 mt-4">
                <h4 className="text-sm font-semibold text-text-muted/70 font-medium mb-4">Upcoming Video Sessions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {scheduledLives.filter(l => l.status === 'scheduled').map(live => (
                    <div 
                      key={live._id} 
                      className="bg-surface-soft rounded-xl p-4 border border-surface-el hover:border-accent-primary transition-colors cursor-pointer"
                      onClick={() => setActiveScheduledVideo(live)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-semibold text-text-main text-sm truncate">{live.title}</h5>
                          <p className="text-xs text-text-muted font-medium mt-1">
                            {new Date(live.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-[10px] text-text-muted/70 font-bold uppercase mt-1">
                            by {live.mentorName || live.mentor?.name} {live.course && `• ${live.course.title}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Active Scheduled Video Player - Mobile Optimized */}
      {activeScheduledVideo && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${isMobile ? 'mb-6 mx-4' : 'mb-8'} bg-surface-base rounded-2xl overflow-hidden shadow-sm border border-surface-el`}
        >
          <div className="flex items-center justify-between p-4 border-b border-surface-el">
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-text-main`}>{activeScheduledVideo.title}</h3>
              <p className="text-xs text-text-muted font-medium">by {activeScheduledVideo.mentorName || activeScheduledVideo.mentor?.name}</p>
            </div>
            <button
              onClick={() => setActiveScheduledVideo(null)}
              className="p-2 hover:bg-surface-soft rounded-xl transition-all"
            >
              <X size={20} className="text-text-muted/70" />
            </button>
          </div>
          <div className={`${isMobile ? 'aspect-[9/16]' : 'aspect-video'} bg-black`}>
            <CustomVideoPlayer
              videoUrl={activeScheduledVideo.videoUrl}
              autoPlay={true}
              isLive={activeScheduledVideo.status === 'live'}
              scheduledStart={activeScheduledVideo.actualStart || activeScheduledVideo.scheduledStart}
            />
          </div>
        </motion.div>
      )}

      {/* Mobile-Optimized Current Lessons */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
              <BookOpen className="w-4 h-4" />
            </div>
            My Courses
          </h2>
          <div className="space-y-3">
            {courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveStudyCourse(course);
                  setSelectedModule(course.modules?.[0] || null);
                }}
                className="bg-surface-soft rounded-xl p-4 border border-surface-el shadow-sm cursor-pointer hover:border-accent-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${course.modules?.some(m => !m.completed)
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-green-500'
                      }`} />
                    <div>
                      <h3 className="font-bold text-text-main text-sm">{course.title}</h3>
                      <p className="text-xs text-text-muted">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-text-muted/70 uppercase">Progress</div>
                    <div className="text-sm font-semibold text-accent-primary">
                      {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-8 text-text-muted/70">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No courses assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Current Lessons */
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg text-sky-500">
              <BookOpen className="w-5 h-5" />
            </div>
            Current Lessons
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GradientCard gradient="from-[#2D2D2D] to-[#1A1A1A]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${course.modules?.some(m => !m.completed)
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-green-500'
                        }`} />
                      <div>
                        <h3 className="font-bold text-text-main text-lg tracking-normal">{course.title}</h3>
                        <p className="text-base font-medium text-text-muted">{course.instructor?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-[13px] font-semibold tracking-widest text-text-muted/70 uppercase">Progress</div>
                        <div className="text-lg font-semibold text-accent-primary">
                          {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveStudyCourse(course);
                          setSelectedModule(course.modules?.[0] || null);
                        }}
                        className="px-4 py-2 bg-text-main hover:bg-accent-primary text-surface-base hover:text-surface-base rounded-lg text-base font-bold transition-all shadow-sm active:scale-95"
                      >
                        Study Node
                      </button>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            ))}
            {courses.length === 0 && (
              <div className="text-center py-12 text-text-muted/70">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium italic text-base">No curriculum units assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile-Optimized Assignments */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <FileText className="w-4 h-4" />
            </div>
            Assignments
          </h2>
          <div className="space-y-3">
            {assignments.slice(0, 2).map((assignment, index) => {
              const submission = getAssignmentSubmission(assignment._id);

              return (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface-soft rounded-xl p-4 border border-surface-el shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-text-main text-sm mb-1">{assignment.title}</h3>
                      <p className="text-xs text-text-muted mb-2">{assignment.course?.title}</p>
                      <div className="flex items-center gap-2 text-xs text-text-muted/70">
                        <Clock className="w-3 h-3" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[11px] font-black uppercase tracking-widest ${submission
                          ? submission.status === 'graded'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                          : 'bg-surface-el text-text-muted border border-surface-el'
                          }`}>
                          {submission
                            ? submission.status === 'graded'
                              ? 'Graded'
                              : 'Submitted'
                            : 'Not submitted'}
                        </span>

                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${submission
                            ? 'bg-surface-soft text-text-main border border-surface-el'
                            : 'bg-accent-primary text-surface-base hover:bg-accent-secondary hover:text-surface-base'
                            }`}
                        >
                          {submission ? 'View Submission' : 'Submit Work'}
                        </button>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${assignment.status === 'published'
                      ? 'bg-orange-50 text-orange-600 border border-orange-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                      {assignment.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
            {assignments.length === 0 && (
              <div className="text-center py-8 text-text-muted/70">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-sm">No active assignments.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop Assignments */
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <FileText className="w-5 h-5" />
            </div>
            Technical Assignments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment, index) => {
              const submission = getAssignmentSubmission(assignment._id);

              return (
                <motion.div
                  key={assignment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GradientCard gradient="from-[#FBEFEF] to-[#FCF8F8]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-main mb-1 tracking-normal">{assignment.title}</h3>
                        <p className="text-base font-medium text-text-muted mb-4">{assignment.course?.title}</p>
                        <div className="flex items-center gap-2 text-[13px] font-semibold text-text-muted/70 font-medium">
                          <Clock className="w-3 h-3" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>

                        <div className="mt-4 flex items-center gap-3 flex-wrap">
                          <span className={`px-2 py-1 rounded text-[11px] font-black uppercase tracking-widest ${submission
                            ? submission.status === 'graded'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                            : 'bg-surface-el text-text-muted border border-surface-el'
                            }`}>
                            {submission
                              ? submission.status === 'graded'
                                ? 'Graded'
                                : 'Submitted'
                              : 'Not submitted'}
                          </span>

                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${submission
                              ? 'bg-surface-soft text-text-main border border-surface-el'
                              : 'bg-accent-primary text-surface-base hover:bg-accent-secondary hover:text-surface-base'
                              }`}
                          >
                            {submission ? 'View Submission' : 'Submit Work'}
                          </button>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[13px] font-semibold uppercase tracking-normal ${assignment.status === 'published'
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                        {assignment.status}
                      </span>
                    </div>
                  </GradientCard>
                </motion.div>
              );
            })}
            {assignments.length === 0 && (
              <div className="col-span-full text-center py-12 text-text-muted/70">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-medium italic text-base">No active assignments found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile-Optimized Class Recordings */}
      {isMobile ? (
        <div className="mb-6 mx-4">
          <h2 className="text-lg font-semibold text-text-main mb-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <Video className="w-4 h-4" />
            </div>
            Class Recordings
          </h2>
          <div className="bg-surface-soft rounded-xl p-4 border border-surface-el shadow-sm">
            <div className="text-center py-6">
              <Video className="w-10 h-10 mx-auto mb-3 text-accent-primary opacity-50" />
              <p className="text-text-main font-bold text-sm mb-1">Recorded Lectures</p>
              <p className="text-xs text-text-muted mb-4">Watch recordings of past classes.</p>
              <button 
                onClick={() => setView('Recordings')}
                className="w-full px-4 py-2 bg-text-main text-surface-base hover:bg-accent-primary hover:text-surface-base rounded-lg font-bold text-sm transition-all"
              >
                View Recorded Lectures
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Class Recordings */
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-text-main mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
              <PlayCircle className="w-5 h-5" />
            </div>
            Class Recordings
          </h2>
          <div className="bg-surface-soft rounded-2xl p-8 border border-surface-el hover:border-accent-primary/20 hover:shadow-md transition-all">
            <div className="text-center py-8">
              <PlayCircle className="w-12 h-12 mx-auto mb-4 text-accent-primary opacity-60" />
              <p className="text-text-main font-bold text-lg mb-1 tracking-normal">Recorded Lectures</p>
              <p className="text-base font-medium text-text-muted mb-6">Watch recordings of past classes and review lessons at your own pace.</p>
              <button 
                onClick={() => setView('Recordings')}
                className="px-8 py-3 bg-text-main hover:bg-accent-primary text-surface-base hover:text-surface-base rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                Browse Recordings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Masterclasses Integration */}
      {!isMobile && canAccessContent && (
        <div className="mt-8 mb-12 border-t border-surface-el pt-8">
          <Masterclasses />
        </div>
      )}

      {/* Mobile-Only: Quick Actions Footer */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-base border-t border-surface-el p-4 z-50">
          <div className="flex gap-2">
            <button
              onClick={() => setView('Recordings')}
              className="flex-1 bg-accent-primary text-surface-base px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-accent-secondary"
            >
              <Video className="w-3 h-3" />
              All Videos
            </button>
            <button
              onClick={() => setView('Dashboard')}
              className="flex-1 bg-text-main text-surface-base px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-accent-primary"
            >
              <BookOpen className="w-3 h-3" />
              Dashboard
            </button>
          </div>
        </div>
      )}

      <AssignmentSubmissionModal
        isOpen={Boolean(selectedAssignment)}
        assignment={selectedAssignment}
        submission={selectedAssignment ? getAssignmentSubmission(selectedAssignment._id) : null}
        onClose={() => setSelectedAssignment(null)}
        onSubmitted={handleAssignmentSubmitted}
      />
    </div>
  );
};

export default ClassroomPage;
