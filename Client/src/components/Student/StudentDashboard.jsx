import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Award, TrendingUp, Calendar, FileText } from 'lucide-react';
import { PortalContext } from '../Context/PortalProvider';
import { GradientCard, StatCard } from '../dashboard/GradientCard';
import { NotificationPanel } from '../dashboard/NotificationPanel';
import { ProgressChart } from '../dashboard/ProgressChart';
import { LogoutButton } from '../dashboard/LogoutButton';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const StudentDashboard = () => {
  const usePortal = () => useContext(PortalContext);
  const { user } = usePortal();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isConnected, notifications } = useSocket(user?._id);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/student');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-slate-900 text-xl font-black animate-pulse">Initializing Portal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 relative overflow-hidden font-['Inter']">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-[#fca96d]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-2 h-2 rounded-full bg-[#fca96d]" />
            <p className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 font-['Outfit']">
              Standardized Access: {user?.name}
            </p>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 tracking-tighter font-['Outfit']"
          >
            Learning <span className="text-[#fca96d]">Odyssey</span>
          </motion.h1>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Neural Link Active</span>
            </motion.div>
          )}
          <NotificationPanel notifications={notifications} />
          <LogoutButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard
          title="Active Modules"
          value={dashboardData?.stats?.enrolledCourses || 0}
          icon={BookOpen}
          gradient="from-slate-900 to-slate-800"
        />
        <StatCard
          title="Pending Deliverables"
          value={dashboardData?.stats?.pendingAssignments || 0}
          icon={Clock}
          gradient="from-[#fca96d] to-orange-600"
        />
        <StatCard
          title="Milestones Reached"
          value={dashboardData?.stats?.completedAssignments || 0}
          icon={Award}
          gradient="from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Capability Level"
          value={`${dashboardData?.overallProgress || 0}%`}
          icon={TrendingUp}
          gradient="from-blue-600 to-indigo-700"
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Progress */}
        <GradientCard className="lg:col-span-1" gradient="from-[#fca96d] to-orange-600">
          <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight font-['Outfit']">Progression Metrics</h3>
          <div className="flex justify-center p-6 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 shadow-inner">
            <ProgressChart
              progress={dashboardData?.overallProgress || 0}
              subtitle={`${dashboardData?.completedModules || 0} of ${dashboardData?.totalModules || 0} modules completed`}
              color="#fca96d"
            />
          </div>
        </GradientCard>

        {/* Latest Assignments */}
        <GradientCard className="lg:col-span-2" gradient="from-slate-900 to-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Upcoming Deployments</h3>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
              <Calendar className="w-5 h-5 text-slate-900" />
            </div>
          </div>
          <div className="space-y-4">
            {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
              dashboardData.assignments.slice(0, 3).map((assignment) => (
                <motion.div
                  key={assignment._id}
                  whileHover={{ x: 4 }}
                  className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:border-[#fca96d]/30 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tight font-['Outfit']">{assignment.title}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{assignment.course?.title}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <Clock className="w-3 h-3 text-[#fca96d]" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${new Date(assignment.dueDate) > new Date()
                          ? 'bg-emerald-500 text-white'
                          : 'bg-rose-500 text-white'
                          }`}>
                          {new Date(assignment.dueDate) > new Date() ? 'Operational' : 'Critical'}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#fca96d] transition-all shadow-lg hover:shadow-[#fca96d]/20 active:scale-95">
                      Initialize
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-200" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">All deliverables verified</p>
              </div>
            )}
          </div>
        </GradientCard>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-12 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-['Outfit']">Course Portfolio</h3>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardData?.courses && dashboardData.courses.length > 0 ? (
            dashboardData.courses.map((course) => (
              <GradientCard
                key={course._id}
                gradient="from-blue-600 to-indigo-700"
                className="hover:scale-[1.02] transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1 pr-4">
                    <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight leading-tight font-['Outfit']">{course.title}</h4>
                    <p className="text-[10px] font-black text-[#fca96d] uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[#fca96d]" /> {course.instructor?.name}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {course.category}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-slate-500 mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Mastery Progress</span>
                    <span className="text-slate-900">
                      {Math.round((course.modules?.filter(m => m.completed).length / course.modules?.length * 100) || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.modules?.filter(m => m.completed).length / course.modules?.length * 100 || 0}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-gradient-to-r from-[#fca96d] to-orange-500 h-full rounded-full"
                    />
                  </div>
                </div>
              </GradientCard>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-slate-200" />
              <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Curriculum nodes offline</p>
              <button className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-slate-900/30">
                Resync Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
