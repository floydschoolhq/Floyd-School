/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Clock, FileDown } from 'lucide-react';
import MotionCard from './MotionCard';
import ActionButton from './ActionButton';

const AcademicMonitoringPanel = () => {
  const [activeView, setActiveView] = useState('performance');

  const performanceSummary = [
    { student: 'Ava Chen', attendance: '98%', grade: 'A', progress: 'On Track' },
    { student: 'Ben Davis', attendance: '85%', grade: 'B+', progress: 'Needs Review' },
    { student: 'Cali Fox', attendance: '92%', grade: 'A-', progress: 'On Track' },
  ];

  const classProgress = [
    { course: 'Algebra I', mentor: 'Mr. Khan', completion: '75%', status: 'In Progress' },
    { course: 'World History', mentor: 'Ms. Patel', completion: '100%', status: 'Completed' },
    { course: 'Chemistry', mentor: 'Dr. Lee', completion: '40%', status: 'Delayed' },
  ];

  const ViewButton = ({ view, label }) => (
    <ActionButton 
      icon={view === 'performance' ? BarChart : Clock} 
      label={label} 
      onClick={() => setActiveView(view)} 
      color={activeView === view ? 'bg-indigo-600' : 'bg-gray-400'}
    />
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">Academic Monitoring</h2>
      
      <div className="flex space-x-4">
        <ViewButton view="performance" label="Student Performance" />
        <ViewButton view="progress" label="Class Progress" />
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'performance' && (
          <MotionCard key="performance">
            <h3 className="text-xl font-semibold mb-4">Student Performance Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Avg</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceSummary.map((item, index) => (
                    <motion.tr key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.attendance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.progress === 'On Track' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}`}>
                          {item.progress}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <ActionButton icon={FileDown} label="Generate School Performance Report" color="bg-teal-600" />
            </div>
          </MotionCard>
        )}

        {activeView === 'progress' && (
          <MotionCard key="progress">
            <h3 className="text-xl font-semibold mb-4">Class Progress & Completion</h3>
            <div className="space-y-4">
              {classProgress.map((item, index) => (
                <motion.div 
                  key={index} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">{item.course} - <span className="text-sm font-normal text-gray-600">Mentor: {item.mentor}</span></p>
                    <span className={`text-sm font-bold ${item.completion === '100%' ? 'text-emerald-600' : 'text-indigo-600'}`}>{item.completion}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <motion.div 
                      style={{ width: item.completion }}
                      initial={{ width: '0%' }}
                      animate={{ width: item.completion }}
                      transition={{ duration: 1 }}
                      className={`h-2 rounded-full ${item.completion === '100%' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </MotionCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicMonitoringPanel;
