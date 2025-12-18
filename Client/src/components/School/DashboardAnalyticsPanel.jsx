/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, FileText, Clock, FileDown } from 'lucide-react';
import StatCard from './StatCard';
import MotionCard from './MotionCard';
import ActionButton from './ActionButton';

const DashboardAnalyticsPanel = () => {
  const stats = [
    { icon: Users, title: 'Total Enrollments', value: '1,520', color: 'text-indigo-500' },
    { icon: CheckCircle, title: 'Course Completion Rate', value: '89.5%', color: 'text-emerald-500' },
    { icon: FileText, title: 'Certificates Issued', value: '680', color: 'text-amber-500' },
    { icon: Clock, title: 'Avg. Class Hours/Week', value: '25.3', color: 'text-rose-500' },
  ];

  const studentActivityData = [
    { month: 'Jan', activity: 120 }, { month: 'Feb', activity: 150 },
    { month: 'Mar', activity: 135 }, { month: 'Apr', activity: 180 },
    { month: 'May', activity: 160 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">School Dashboard</h2>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Activity Graph Placeholder (Mock) */}
        <MotionCard className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Student Activity (Last 5 Months)</h3>
          <div className="h-64 flex items-end justify-between p-4 bg-gray-50 rounded-lg">
            {studentActivityData.map((data, index) => (
              <div key={index} className="flex flex-col items-center group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: data.activity / 2.5 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  className="w-8 bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-colors cursor-pointer relative"
                  style={{ height: data.activity / 2.5 }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.activity}
                  </span>
                </motion.div>
                <p className="mt-2 text-sm text-gray-600">{data.month}</p>
              </div>
            ))}
          </div>
        </MotionCard>
        
        {/* Report Download */}
        <MotionCard className="flex flex-col justify-center items-center text-center">
          <FileDown className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Review Meeting Reports</h3>
          <p className="text-sm text-gray-500 mb-4">Generate detailed PDF reports for quarterly review meetings.</p>
          <ActionButton icon={FileDown} label="Download Detailed Report" color="bg-blue-600" />
        </MotionCard>
      </div>
    </div>
  );
};

export default DashboardAnalyticsPanel;
