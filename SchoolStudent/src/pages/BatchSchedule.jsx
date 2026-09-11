import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import io from 'socket.io-client';
import { Clock, MapPin, Calendar, ShieldCheck } from 'lucide-react';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });

const BatchSchedule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      const res = await api.get('/school-student/dashboard');
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching batch schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();

    socket.connect();
    socket.on('batch-schedule-updated', () => {
      fetchSchedule();
    });

    return () => {
      socket.off('batch-schedule-updated');
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { student } = data || {};

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="card-modern rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={20} className="text-slate-800" />
              Classroom Timetable & Lab Location
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Live lab schedule and venue location managed by your offline mentor.</p>
          </div>
          <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} /> Live Sync
          </span>
        </div>
      </div>

      <div className="card-modern rounded-xl p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase text-slate-500">Assigned Classroom Section</p>
            <h2 className="text-lg font-bold text-slate-900">{student?.batchName || 'Offline Batch'}</h2>
          </div>
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
            {student?.grade || 'Grade 10'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-semibold uppercase">Class Timing</p>
              <p className="text-slate-900 font-bold text-sm">{student?.scheduleTime || '10:00 AM - 11:30 AM'}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-semibold uppercase">Classroom / Lab Venue Location</p>
              <p className="text-slate-900 font-bold text-sm">{student?.venue || 'Lab 101'}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar size={15} /> Weekly Session Days: {student?.scheduleDays ? student.scheduleDays.join(', ') : 'Mon, Wed, Fri'}
          </p>
          <p className="text-[11px] leading-relaxed">
            Please arrive 5 minutes prior to the scheduled lab start time with your practical STEM workbook. Attendance is recorded by your offline mentor at the beginning of each session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatchSchedule;
