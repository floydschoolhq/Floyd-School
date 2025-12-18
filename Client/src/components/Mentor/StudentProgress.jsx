import { ArrowRight, Book, CheckCircle, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { MOCK_STUDENT_PROGRESS } from '../../assets/mockData';
import { Card, IconButton, ProgressStatCard } from './SharedComponents';

const StudentProgress = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">
        Student Progress Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProgressStatCard
          Icon={Users}
          title="Total Students"
          value={MOCK_STUDENT_PROGRESS.length}
          colorClass="text-[#007FFF]"
        />
        <ProgressStatCard
          Icon={TrendingUp}
          title="Avg. Completion Rate"
          value={`${(
            MOCK_STUDENT_PROGRESS.reduce((sum, s) => sum + s.completion, 0) /
            MOCK_STUDENT_PROGRESS.length
          ).toFixed(1)}%`}
          colorClass="text-green-600"
          trend={2.5}
        />
        <ProgressStatCard
          Icon={CheckCircle}
          title="Class Avg. Score"
          value={`${(
            MOCK_STUDENT_PROGRESS.reduce((sum, s) => sum + s.averageScore, 0) /
            MOCK_STUDENT_PROGRESS.length
          ).toFixed(1)}`}
          colorClass="text-[#FF8C00]"
        />
        <ProgressStatCard
          Icon={Book}
          title="Modules In Progress"
          value={MOCK_STUDENT_PROGRESS.reduce(
            (sum, s) => sum + s.activeModules,
            0
          )}
          colorClass="text-blue-600"
        />
      </div>

      {/* Table Card */}
      <Card className="bg-white border border-gray-300 shadow-md">
        <h3
          className="text-xl font-bold mb-4"
          style={{ color: '#007FFF' }}
        >
          Individual Student Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-900">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 uppercase text-xs text-gray-600">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Completion</th>
                <th className="py-3 px-4">Avg. Score</th>
                <th className="py-3 px-4">Active Modules</th>
                <th className="py-3 px-4">View Detail</th>
              </tr>
            </thead>

            <tbody>
              {MOCK_STUDENT_PROGRESS.sort(
                (a, b) => b.completion - a.completion
              ).map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
                >
                  <td className="py-4 px-4 font-medium text-gray-900">
                    {s.name}
                  </td>

                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${s.completion}%`,
                          backgroundColor: '#007FFF',
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-1 block">
                      {s.completion}%
                    </span>
                  </td>

                  <td className="py-4 px-4 font-semibold text-gray-900">
                    {s.averageScore}
                  </td>

                  <td className="py-4 px-4 text-gray-900">
                    {s.activeModules}
                  </td>

                  <td className="py-4 px-4">
                    <IconButton
                      Icon={ArrowRight}
                      label={`View ${s.name}'s Profile`}
                      className="hover:bg-gray-200 text-[#007FFF]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentProgress;
