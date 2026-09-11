import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StatCard from '../components/Common/StatCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import CreateQuizModal from '../components/Quiz/CreateQuizModal';
import CreateHomeworkModal from '../components/Homework/CreateHomeworkModal';
import UploadMaterialModal from '../components/Material/UploadMaterialModal';
import {
  School,
  Layers,
  Users,
  Clock,
  Award,
  BookOpen,
  CalendarCheck,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick Action Modal States
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
      setData(res.data?.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to Floyd School offline backend..." />;
  }

  const stats = data?.stats;
  const batches = data?.batches || [];
  const todaysClasses = data?.todaysClasses || [];
  const upcomingClasses = data?.upcomingClasses || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card-modern rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} className="text-amber-500" />
              <span>Floyd School Offline Operations</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Good day, {user?.name || 'Mentor'} 👋
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              You are currently managing {stats?.totalBatches || 0} active cohort(s) across {stats?.totalSchools || 0} partner institution(s).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/attendance')}
              className="btn-modern-primary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <CalendarCheck size={14} />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => setShowQuizModal(true)}
              className="btn-modern-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Plus size={13} />
              <span>Create Quiz</span>
            </button>
            <button
              onClick={() => setShowHomeworkModal(true)}
              className="btn-modern-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Plus size={13} />
              <span>Assign Homework</span>
            </button>
            <button
              onClick={() => setShowMaterialModal(true)}
              className="btn-modern-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Plus size={13} />
              <span>Upload Material</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Assigned Schools"
          value={stats?.totalSchools || 0}
          subtitle="Partner Campuses"
          icon={School}
        />
        <StatCard
          title="Active Batches"
          value={stats?.totalBatches || 0}
          subtitle="Lab Cohorts"
          icon={Layers}
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          subtitle="Enrolled Candidates"
          icon={Users}
        />
        <StatCard
          title="Today's Classes"
          value={stats?.todaysClassesCount || 0}
          subtitle="Scheduled Sessions"
          icon={Clock}
        />
        <StatCard
          title="Pending Quizzes"
          value={stats?.pendingQuizResponses || 0}
          subtitle="Quiz Responses"
          icon={Award}
        />
        <StatCard
          title="Pending Tasks"
          value={stats?.pendingHomeworkSubmissions || 0}
          subtitle="To Be Graded"
          icon={BookOpen}
        />
      </div>

      {/* Today's Classes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-slate-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Today's Classroom Sessions
            </h2>
          </div>
          <button
            onClick={() => navigate('/classes')}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1"
          >
            <span>Classroom Hub</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {todaysClasses.length === 0 ? (
          <div className="card-modern rounded-xl p-6 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">No scheduled sessions for today</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Check your upcoming class timetable below or prepare lesson guides for the next session.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysClasses.map((cls) => (
              <div
                key={cls._id}
                className="card-modern rounded-xl p-5 space-y-4 flex flex-col justify-between border-l-4 border-l-slate-900"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                        {cls.code || 'BATCH'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {cls.name}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Today
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                    <School size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{cls.schoolName}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-500">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 block font-semibold">Venue</span>
                      <span className="font-semibold text-slate-800">{cls.roomVenue}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] uppercase text-slate-400 block font-semibold">Timing</span>
                      <span className="font-semibold text-slate-800 truncate">{cls.scheduleTime}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/classes?batchId=${cls._id}`)}
                  className="w-full btn-modern-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5"
                >
                  <span>Open Session Workflow</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cohorts & Pending Items Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* All Assigned Batches */}
        <div className="lg:col-span-2 card-modern rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Assigned Offline Cohorts ({batches.length})
            </h3>
            <button
              onClick={() => navigate('/batches')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {batches.map((b) => (
              <div
                key={b._id}
                onClick={() => navigate(`/batches/${b._id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 rounded-lg px-2 -mx-2 cursor-pointer transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{b.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {b.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{b.schoolName} • {b.roomVenue}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{b.studentsCount} Students</span>
                  <p className="text-[10px] text-slate-400">{b.scheduleTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Overview & Pending Alerts */}
        <div className="card-modern rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
            Classroom Operational Status
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500">Today's Attendance Ratio</span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black text-slate-900">
                  {stats?.todayPresent || 0} / {stats?.todayTotal || 0} Marked
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {stats?.todayAttendanceRate || 100}%
                </span>
              </div>
            </div>

            <div
              onClick={() => navigate('/homework')}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 hover:bg-slate-100/70 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Pending Homework</span>
                <span className="font-bold text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {stats?.pendingHomeworkSubmissions || 0}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Submissions awaiting mentor evaluation</p>
            </div>

            <div
              onClick={() => navigate('/quizzes')}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 hover:bg-slate-100/70 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500">Quiz Submissions</span>
                <span className="font-bold text-xs bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                  {stats?.pendingQuizResponses || 0}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Total automated quiz attempts recorded</p>
            </div>

            {stats?.pendingRegistrationsCount > 0 && (
              <div
                onClick={() => navigate('/students?tab=pending')}
                className="p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100/60 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-amber-900">
                  <span className="text-[10px] uppercase font-bold">New Candidate Approvals</span>
                  <span className="font-bold text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    {stats.pendingRegistrationsCount}
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">Self-registered candidates awaiting batch allotment</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
      {showQuizModal && (
        <CreateQuizModal
          batches={batches}
          onClose={() => setShowQuizModal(false)}
          onCreated={fetchDashboard}
        />
      )}

      {showHomeworkModal && (
        <CreateHomeworkModal
          batches={batches}
          onClose={() => setShowHomeworkModal(false)}
          onCreated={fetchDashboard}
        />
      )}

      {showMaterialModal && (
        <UploadMaterialModal
          batches={batches}
          onClose={() => setShowMaterialModal(false)}
          onUploaded={fetchDashboard}
        />
      )}
    </div>
  );
};

export default Dashboard;
