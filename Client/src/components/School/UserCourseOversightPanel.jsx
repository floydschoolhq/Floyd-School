/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle, GraduationCap, X } from 'lucide-react';
import MotionCard from './MotionCard';
import ActionButton from './ActionButton';

const UserCourseOversightPanel = () => {
  const [activeTab, setActiveTab] = useState('students');
  
  const userList = [
    { id: 1, name: 'Alice Johnson', role: 'Student', class: 'Grade 9A', status: 'Active' },
    { id: 2, name: 'Bob Smith', role: 'Mentor', class: 'Physics', status: 'Allocated' },
    { id: 3, name: 'Charlie Brown', role: 'Student', class: 'Grade 10B', status: 'Inactive' },
    { id: 4, name: 'Diana Prince', role: 'Mentor', class: 'Chemistry', status: 'Pending Approval' },
  ];

  const allocationRequests = [
    { id: 1, type: 'Mentor', name: 'Dr. Lee (Math)', status: 'Pending', action: 'Approve' },
    { id: 2, type: 'Course', name: 'Advanced Calculus', status: 'Pending', action: 'Approve' },
    { id: 3, type: 'Batch', name: 'Grade 8C Assignment', status: 'Pending', action: 'Assign Mentor' },
  ];

  const handleAction = (request, action) => {
    console.log(`Action: ${action} for ${request.name}`);
  };

  const TabButton = ({ tab, label, icon: Icon }) => (
    <motion.button
      whileHover={{ y: -2 }}
      className={`px-6 py-2 text-sm font-semibold rounded-t-lg transition-all flex items-center space-x-2 ${
        activeTab === tab ? 'bg-white text-indigo-600 border-b-2 border-indigo-600 shadow-t-md' : 'text-gray-600 hover:bg-gray-50'
      }`}
      onClick={() => setActiveTab(tab)}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">User & Course Oversight</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <TabButton tab="students" label="Students & Mentors" icon={Users} />
        <TabButton tab="allocations" label="Allocation Approvals" icon={CheckCircle} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'students' && (
          <MotionCard key="students">
            <h3 className="text-xl font-semibold mb-4">School Directory</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userList.map((user) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ActionButton icon={GraduationCap} label="Assign Mentor" onClick={() => handleAction(user, 'Assign')} color="bg-cyan-600" />
                        <ActionButton icon={X} label="Remove" onClick={() => handleAction(user, 'Remove')} color="bg-red-600 ml-2" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionCard>
        )}

        {activeTab === 'allocations' && (
          <MotionCard key="allocations">
            <h3 className="text-xl font-semibold mb-4">Pending Allocations & Approvals</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allocationRequests.map((req) => (
                    <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <ActionButton 
                          icon={req.action === 'Approve' ? CheckCircle : GraduationCap} 
                          label={req.action} 
                          onClick={() => handleAction(req, req.action)} 
                          color={req.action === 'Approve' ? 'bg-emerald-600' : 'bg-cyan-600'}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionCard>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserCourseOversightPanel;
