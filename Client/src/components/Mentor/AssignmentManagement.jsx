import { Folder, Settings } from 'lucide-react';
import React from 'react';
import { MOCK_ASSIGNMENTS, MOCK_COURSES } from '../../assets/mockData';
import { Card, IconButton } from './SharedComponents';

const AssignmentManagement = () => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">
        Assignment Management
      </h2>

      <div className="grid gap-6">

        {/* Bright mode card */}
        <Card className="bg-white border border-gray-300 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: "#007FFF" }}>
              All Assignments
            </h3>

            <button
              className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-md"
              style={{ backgroundColor: "#007FFF" }}
            >
              + Create New Assignment
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-gray-900">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100 uppercase text-xs text-gray-600">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Submissions</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {MOCK_ASSIGNMENTS.map((assignment) => {
                  const course = MOCK_COURSES.find(
                    (c) => c.id === assignment.courseId
                  );

                  const pending =
                    assignment.totalSubmissions - assignment.graded;

                  return (
                    <tr
                      key={assignment.id}
                      className="border-b border-gray-200 hover:bg-gray-100 transition duration-150"
                    >
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {assignment.title}
                      </td>

                      <td className="py-4 px-4" style={{ color: "#007FFF" }}>
                        {course ? course.name : "N/A"}
                      </td>

                      <td className="py-4 px-4 text-gray-800">
                        {assignment.dueDate}
                      </td>

                      <td className="py-4 px-4 text-gray-800">
                        {assignment.totalSubmissions} Total |{" "}
                        <span
                          style={{
                            color: pending > 0 ? "#FF8C00" : "green",
                            fontWeight: 600,
                          }}
                        >
                          {pending} Pending
                        </span>
                      </td>

                      <td className="py-4 px-4 space-x-2 flex items-center">
                        <IconButton
                          Icon={Folder}
                          label="View Files"
                          className="hover:bg-gray-200 text-gray-600"
                        />

                        <IconButton
                          Icon={Settings}
                          label="Edit Assignment"
                          className="hover:bg-gray-200 text-gray-600"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentManagement;
