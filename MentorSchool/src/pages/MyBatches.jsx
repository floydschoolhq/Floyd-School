import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { Layers, School, Users, Clock, MapPin, ArrowRight, BookOpen } from 'lucide-react';

const MyBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await api.get('/mentor/offline/batches');
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching assigned offline classroom cohorts..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers size={15} />
          <span>Classroom Cohort Management</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          My Assigned Batches ({batches.length})
        </h1>
        <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
          Physical classroom cohorts and STEM laboratories under your operational supervision.
        </p>
      </div>

      {batches.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center space-y-2">
          <Layers size={36} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No batches currently assigned</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You do not have any active partner school batches allotted yet. Contact your Floyd School administrator or coordinator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((b) => (
            <div
              key={b._id}
              className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                      {b.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {b.name}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    b.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <School size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{b.school?.name || 'Partner School'}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600">
                    <BookOpen size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{b.subject}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{b.roomVenue}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock size={14} className="text-slate-400 shrink-0" />
                    <span>
                      {Array.isArray(b.scheduleDays) ? b.scheduleDays.join(', ') : 'Mon, Wed'} • {b.scheduleTime}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Students</span>
                    <span className="text-sm font-black text-slate-900">{b.studentsCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Sessions</span>
                    <span className="text-sm font-black text-slate-900">{b.sessionCount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/batches/${b._id}`)}
                  className="flex-1 btn-modern-primary py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <span>Batch Details</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => navigate(`/attendance?batchId=${b._id}`)}
                  className="btn-modern-secondary px-3 py-2 rounded-lg text-xs font-semibold"
                  title="Take Attendance"
                >
                  Attendance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBatches;
