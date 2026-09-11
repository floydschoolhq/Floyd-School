import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CreateQuizModal from '../components/Quiz/CreateQuizModal';
import CreateHomeworkModal from '../components/Homework/CreateHomeworkModal';
import UploadMaterialModal from '../components/Material/UploadMaterialModal';
import {
  Clock,
  CheckCircle2,
  CalendarCheck,
  Award,
  BookOpen,
  FolderDown,
  ArrowRight,
  School,
  Sparkles,
  PlayCircle
} from 'lucide-react';

const MyClasses = () => {
  const [searchParams] = useSearchParams();
  const initialBatchId = searchParams.get('batchId');

  const { addToast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active Session State
  const [activeSessionBatch, setActiveSessionBatch] = useState(null);
  const [sessionStep, setSessionStep] = useState(1);

  // Modals
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentor/offline/dashboard');
      const d = res.data?.data;
      setData(d);

      if (initialBatchId && d?.batches) {
        const found = d.batches.find(b => b._id === initialBatchId);
        if (found) {
          setActiveSessionBatch(found);
        }
      }
    } catch (err) {
      console.error('Error fetching class schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to classroom timetable..." />;
  }

  const todaysClasses = data?.todaysClasses || [];
  const upcomingClasses = data?.upcomingClasses || [];
  const batches = data?.batches || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock size={15} />
              <span>Session Execution & Classroom Timetable</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Classroom Sessions & Live Delivery
            </h1>
            <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
              Step through physical class operations: Mark attendance, deliver theory, upload workbooks, and assign homework.
            </p>
          </div>
        </div>
      </div>

      {/* Active Session Workflow Hub (If opened) */}
      {activeSessionBatch && (
        <div className="card-modern rounded-2xl p-6 border-2 border-slate-900 bg-white space-y-6 shadow-md animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Classroom Session Active
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900">
                {activeSessionBatch.name} ({activeSessionBatch.code})
              </h2>
              <p className="text-xs text-slate-500 flex items-center space-x-1.5">
                <School size={13} className="text-slate-400" />
                <span>{activeSessionBatch.schoolName} • Room {activeSessionBatch.roomVenue}</span>
              </p>
            </div>

            <button
              onClick={() => {
                setActiveSessionBatch(null);
                setSessionStep(1);
                addToast('Class session closed successfully!', 'success');
              }}
              className="btn-modern-primary px-4 py-2 rounded-xl text-xs font-bold shrink-0"
            >
              Complete & Close Session
            </button>
          </div>

          {/* Workflow Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { num: 1, title: '1. Take Attendance', desc: 'Mark present/absent', action: () => navigate(`/attendance?batchId=${activeSessionBatch._id}`) },
              { num: 2, title: '2. Teaching Outline', desc: 'Reference lesson plan', action: () => navigate(`/guides?batchId=${activeSessionBatch._id}`) },
              { num: 3, title: '3. Share Workbook', desc: 'Upload code / slides', action: () => setShowMaterialModal(true) },
              { num: 4, title: '4. Assign Challenge', desc: 'Quiz or homework', action: () => setShowHomeworkModal(true) },
            ].map((step) => (
              <div
                key={step.num}
                onClick={step.action}
                className="card-modern rounded-xl p-4 bg-slate-50/60 hover:bg-slate-100/80 cursor-pointer transition-all border border-slate-200/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{step.title}</span>
                  <ArrowRight size={13} className="text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Scheduled Classes */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Today's Scheduled Classes ({todaysClasses.length})
        </h2>

        {todaysClasses.length === 0 ? (
          <div className="card-modern rounded-xl p-8 text-center text-xs text-slate-500">
            No offline classes scheduled for today. You can still initiate a session for any batch below.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysClasses.map((cls) => (
              <div key={cls._id} className="card-modern rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">{cls.code}</span>
                      <h3 className="text-sm font-bold text-slate-900">{cls.name}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Today
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{cls.schoolName} • {cls.roomVenue}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{cls.scheduleTime}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveSessionBatch(cls);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-modern-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <PlayCircle size={14} />
                  <span>Launch Session Workflow</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Batches Quick Session Launchers */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          All Cohort Schedules ({batches.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) => (
            <div key={b._id} className="card-modern rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-slate-900">{b.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">({b.code})</span>
                </div>
                <p className="text-[11px] text-slate-500">{b.schoolName} • {b.roomVenue}</p>
                <p className="text-[11px] text-slate-400">
                  {Array.isArray(b.scheduleDays) ? b.scheduleDays.join(', ') : 'Mon, Wed'} • {b.scheduleTime}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setActiveSessionBatch(b);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 btn-modern-primary py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <PlayCircle size={12} />
                  <span>Start Session</span>
                </button>
                <button
                  onClick={() => navigate(`/attendance?batchId=${b._id}`)}
                  className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Modals */}
      {showQuizModal && activeSessionBatch && (
        <CreateQuizModal
          batches={batches}
          selectedBatchId={activeSessionBatch._id}
          onClose={() => setShowQuizModal(false)}
          onCreated={() => addToast('Quiz added to session!', 'success')}
        />
      )}

      {showHomeworkModal && activeSessionBatch && (
        <CreateHomeworkModal
          batches={batches}
          selectedBatchId={activeSessionBatch._id}
          onClose={() => setShowHomeworkModal(false)}
          onCreated={() => addToast('Homework assigned to session!', 'success')}
        />
      )}

      {showMaterialModal && activeSessionBatch && (
        <UploadMaterialModal
          batches={batches}
          selectedBatchId={activeSessionBatch._id}
          onClose={() => setShowMaterialModal(false)}
          onUploaded={() => addToast('Material uploaded to session!', 'success')}
        />
      )}
    </div>
  );
};

export default MyClasses;
