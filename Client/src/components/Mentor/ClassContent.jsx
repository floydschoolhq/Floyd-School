import { Folder, Settings } from 'lucide-react'
import React from 'react'
import { MOCK_COURSES } from '../../assets/mockData'
import { Card, IconButton } from './SharedComponents'

const ClassContent = () => {


  return (
    <div>
    <h2 className="text-3xl font-bold text-black mb-6">Class Content Management</h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#FF8C00]">Courses List</h3>
          <button className="bg-[#007FFC] hover:bg-[#007FFF] text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition duration-150 shadow-md">
            + New Course
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_COURSES.map(course => (
            <div key={course.id} className="flex justify-between items-center p-3 bg-white/5 border-black border-2 rounded-lg">
              <div>
                <p className=" font-medium">{course.name}</p>
                <p className="text-sm text-gray-400">
                  {course.modules} Modules | {course.assignments} Assignments
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${course.active ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
                  {course.active ? 'Active' : 'Archived'}
                </span>
                <IconButton Icon={Folder} label="Manage Modules" className="text-[#007FFF] hover:bg-gray-600" />
                <IconButton Icon={Settings} label="Edit Course" className="text-gray-400 hover:bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-xl font-bold text-[#007FFF] mb-4">Quick Stats</h3>
        <div className="space-y-4">
          <p className=" flex justify-between">Total Courses: <span className=" font-semibold text-lg">{MOCK_COURSES.length}</span></p>
          <p className=" flex justify-between">Active Modules: <span className=" font-semibold text-lg">{MOCK_COURSES.reduce((sum, c) => sum + c.modules, 0)}</span></p>
          <p className=" flex justify-between">Upcoming Content Edits: <span className="text-[#FF8C00] font-semibold text-lg">3</span></p>
        </div>
      </Card>
    </div>
  </div>
  )
}

export default ClassContent
