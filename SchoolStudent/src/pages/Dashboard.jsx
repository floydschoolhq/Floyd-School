import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { CalendarCheck, Award, BookOpen, Clock, MapPin, CheckCircle2, Shield } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/school-student/dashboard');
        setData(res.data.data);
      } catch (error) {
        console.error('Error fetching student dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400">
        <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data?.isPendingApproval) {
    return (
      <div className="space-y-4">
        <div className="card-3d rounded-lg p-5 sm:p-6 space-y-3">
          <div className="flex items-center space-x-2 text-slate-800">
            <Clock size={20} />
            <h2 className="text-lg font-bold text-slate-900">Registration Received — Pending Batch Allotment</h2>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Welcome <strong className="text-slate-900">{data.data?.student?.name}</strong>! Your registration details for <strong className="text-slate-900">{data.data?.student?.schoolName}</strong> ({data.data?.student?.grade} - Section {data.data?.student?.section}) have been received.
          </p>
          <div className="bg-slate-50 border border-slate-300 rounded p-3.5 text-xs text-slate-600 leading-relaxed shadow-2xs">
            <p className="font-bold text-slate-800 mb-0.5">📋 What happens next?</p>
            <p>Your offline school mentor is currently reviewing your registration request. Once your mentor selects your classroom batch section, your official <strong className="text-slate-900 font-mono">Structured Primary Key Roll Number</strong> (e.g. ST-GRA-001) will be generated and assigned, automatically unlocking your timetable, attendance logs, quizzes, and homework portals.</p>
          </div>
        </div>
      </div>
    );
  }

  const { student, stats } = data || {};

  return (
    <div className="space-y-4">
      {/* Modern Welcome Banner */}
      <div className="card-modern rounded-xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
              <Shield size={14} className="text-slate-700" />
              <span>Offline Student Academic Record</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Welcome back, {student?.name || 'Student'}
            </h1>
            <p className="text-xs text-slate-600">
              School: <span className="font-semibold text-slate-900">{student?.schoolName}</span> • Section: <span className="font-semibold text-slate-900">{student?.batchName}</span>
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-4 py-2 text-right shrink-0">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Attendance Rate</p>
            <p className="text-xl font-bold text-slate-900 font-mono">
              {stats?.attendancePercentage !== undefined ? `${stats.attendancePercentage}%` : '0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Modern Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="card-modern rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Classes Attended</p>
              <p className="text-xl font-bold text-slate-900 font-mono">{stats?.attendedClasses || 0} / {stats?.totalClasses || 0}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <CalendarCheck size={16} />
            </div>
          </div>
        </div>

        <div className="card-modern rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Pending Quizzes</p>
              <p className="text-xl font-bold text-slate-900 font-mono">{stats?.pendingQuizzesCount || 0}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Award size={16} />
            </div>
          </div>
        </div>

        <div className="card-modern rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Homework Pending</p>
              <p className="text-xl font-bold text-slate-900 font-mono">{stats?.pendingAssignmentsCount || 0}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <BookOpen size={16} />
            </div>
          </div>
        </div>

        <div className="card-modern rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase text-slate-500 mb-0.5">Offline Lab Venue</p>
              <p className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{student?.venue}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <MapPin size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Class Schedule & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-modern rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Clock size={16} className="text-slate-800" />
            Classroom Timetable & Lab Location
          </h2>

          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-500">Assigned Batch</p>
                <p className="text-sm font-bold text-slate-900">{student?.batchName}</p>
              </div>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {student?.grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white border border-slate-200/80 rounded-lg p-3 flex items-center space-x-2.5">
                <Clock className="text-slate-600" size={16} />
                <div>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">Class Timing</p>
                  <p className="text-slate-900 font-bold">{student?.scheduleTime}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-lg p-3 flex items-center space-x-2.5">
                <MapPin className="text-slate-600" size={16} />
                <div>
                  <p className="text-slate-500 text-[10px] font-semibold uppercase">Classroom Venue</p>
                  <p className="text-slate-900 font-bold">{student?.venue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-modern rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">Student Quick Links</h2>
          <div className="space-y-2">
            <a href="/attendance" className="block w-full py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all">
              📅 View Class Attendance Logs
            </a>
            <a href="/quizzes" className="block w-full py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all">
              🏆 Take Quizzes & Exams
            </a>
            <a href="/assignments" className="block w-full py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all">
              📝 Submit Homework & Projects
            </a>
            <a href="/help" className="block w-full py-2 px-3 btn-modern-secondary rounded-lg text-xs font-semibold transition-all">
              🙋 Academic Helpdesk & Doubts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
