import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { School, CalendarCheck, CheckCircle2, XCircle, Clock, Save, UserPlus, Check } from 'lucide-react';

const OfflineAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [topicCovered, setTopicCovered] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBatchForApproval, setSelectedBatchForApproval] = useState('');
  const [approvingStudentId, setApprovingStudentId] = useState(null);
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [editScheduleModal, setEditScheduleModal] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    timeLimitMinutes: 20,
    totalMarks: 100,
    questions: [
      { questionText: 'What is the function of an ultrasonic sensor in robotics?', options: ['Measure distance', 'Measure weight', 'Display images', 'Play sound'], correctAnswerIndex: 0 },
      { questionText: 'Which language is commonly used to program microcontrollers in STEM lab?', options: ['MicroPython', 'CSS', 'HTML', 'Photoshop'], correctAnswerIndex: 0 }
    ]
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: 100
  });

  const { addToast } = useToast();

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);
    try {
      await api.post('/mentor/offline/quizzes', {
        ...quizForm,
        schoolId: selectedBatch.schoolId?._id || selectedBatch.schoolId,
        batchId: selectedBatch._id
      });
      addToast(`Quiz "${quizForm.title}" published for ${selectedBatch.name}!`, 'success');
      setShowQuizModal(false);
      setQuizForm({
        title: '',
        description: '',
        timeLimitMinutes: 20,
        totalMarks: 100,
        questions: [
          { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
        ]
      });
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to publish quiz', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);
    try {
      await api.post('/mentor/offline/assignments', {
        ...assignmentForm,
        schoolId: selectedBatch.schoolId?._id || selectedBatch.schoolId,
        batchId: selectedBatch._id
      });
      addToast(`Homework "${assignmentForm.title}" assigned to ${selectedBatch.name}!`, 'success');
      setShowAssignmentModal(false);
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100
      });
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to assign homework', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSchedule = async (e) => {
    e.preventDefault();
    if (!editScheduleModal) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/mentor/offline/batches/${editScheduleModal.id}/schedule`, {
        scheduleDays: editScheduleModal.scheduleDays,
        scheduleTime: editScheduleModal.scheduleTime,
        roomVenue: editScheduleModal.roomVenue,
        subject: editScheduleModal.subject
      });

      addToast(res.data.message || 'Timetable & Room Venue updated!', 'success');
      setEditScheduleModal(null);
      fetchBatches();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update schedule', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const [batchRes, pendingRes] = await Promise.all([
        api.get('/mentor/offline/batches'),
        api.get('/mentor/offline/pending-students')
      ]);
      setBatches(batchRes.data.data || []);
      setPendingStudents(pendingRes.data.data || []);
      if (batchRes.data.data?.length > 0) {
        setSelectedBatch(batchRes.data.data[0]);
        setSelectedBatchForApproval(batchRes.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching mentor offline data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatchStudents = async () => {
    if (!selectedBatch) return;
    try {
      const res = await api.get(`/mentor/offline/batches/${selectedBatch._id}/students`);
      setStudents(res.data.data);

      const map = {};
      res.data.data.forEach(s => {
        map[s._id] = { status: 'present', remarks: '' };
      });
      setAttendanceMap(map);
    } catch (error) {
      console.error('Error fetching batch students:', error);
    }
  };

  useEffect(() => {
    fetchBatchStudents();
  }, [selectedBatch]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatch) return;
    setSubmitting(true);
    try {
      const records = Object.entries(attendanceMap).map(([studentId, obj]) => ({
        studentId,
        status: obj.status,
        remarks: obj.remarks
      }));

      await api.post('/mentor/offline/attendance', {
        batchId: selectedBatch._id,
        schoolId: selectedBatch.schoolId?._id || selectedBatch.schoolId,
        date: new Date(),
        topicCovered: topicCovered || 'Practical STEM Experiment',
        records
      });

      addToast(`Attendance for ${selectedBatch.name} saved successfully!`, 'success');
      setTopicCovered('');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveStudent = async (studentId) => {
    if (!selectedBatchForApproval) {
      addToast('Please select a target batch for allotment', 'error');
      return;
    }

    setApprovingStudentId(studentId);
    try {
      const res = await api.post('/mentor/offline/approve-student', {
        studentId,
        batchId: selectedBatchForApproval
      });

      addToast(res.data.message || 'Student approved & Credentials generated!', 'success');
      if (res.data?.data) {
        setGeneratedCreds(res.data.data);
      }
      fetchBatches();
      fetchBatchStudents();
    } catch (error) {
      addToast(error.response?.data?.message || 'Approval failed', 'error');
    } finally {
      setApprovingStudentId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-modern rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-slate-700" size={20} />
            Class Attendance & Batch Allotment
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Approve pending student registrations, allot classroom batches, and mark daily attendance.</p>
        </div>

        {selectedBatch && (
          <button
            onClick={handleSaveAttendance}
            disabled={submitting}
            className="btn-modern-primary py-2 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Save size={14} />
            <span>{submitting ? 'Saving Log...' : 'Submit Class Attendance'}</span>
          </button>
        )}
      </div>

      {/* Pending Student Registrations Banner */}
      {pendingStudents.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2 text-slate-800">
              <UserPlus size={18} />
              <h3 className="text-sm font-bold text-slate-900">
                Pending Student Admissions Awaiting Batch Allotment ({pendingStudents.length})
              </h3>
            </div>
            <span className="text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full">
              Action Required
            </span>
          </div>

          <div className="space-y-2">
            {pendingStudents.map((pStudent) => (
              <div key={pStudent._id} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900">{pStudent.name}</p>
                  <p className="text-slate-600">
                    School: <strong className="text-slate-900">{pStudent.schoolId?.name || pStudent.schoolNameManual || 'Partner School'}</strong> • {pStudent.grade} (Sec {pStudent.section || 'A'})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Email: {pStudent.email} • Student Mob: {pStudent.studentMobile || 'N/A'} • Father: {pStudent.fatherName || 'N/A'} ({pStudent.fatherMobile || 'N/A'})
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <select
                    value={selectedBatchForApproval}
                    onChange={(e) => setSelectedBatchForApproval(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  >
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleApproveStudent(pStudent._id)}
                    disabled={approvingStudentId === pStudent._id}
                    className="btn-modern-primary py-1.5 px-3 rounded-lg text-xs flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{approvingStudentId === pStudent._id ? 'Allotting...' : 'Allot Batch & Roll No'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : batches.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center">
          <School size={40} className="mx-auto text-slate-400 mb-2" />
          <h3 className="text-base font-bold text-slate-800">No Offline Batches Assigned</h3>
          <p className="text-slate-500 text-xs mt-0.5">When offline school batches are assigned to you by admin, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Batch Selector */}
          <div className="card-modern rounded-xl p-4 space-y-2">
            <h3 className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Select Offline Batch</h3>
            <div className="space-y-1.5">
              {batches.map((b) => (
                <button
                  key={b._id}
                  onClick={() => setSelectedBatch(b)}
                  className={`w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all ${
                    selectedBatch?._id === b._id
                      ? 'bg-slate-100 border-slate-300 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900 mb-0.5">{b.name}</p>
                  <p className="text-[11px] font-normal text-slate-500">{b.schoolId?.name || 'Partner School'}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Student Attendance Marker */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card-modern rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedBatch?.name}</h3>
                  <p className="text-xs text-slate-500">
                    Days: <span className="text-slate-900 font-semibold">{selectedBatch?.scheduleDays ? selectedBatch.scheduleDays.join(', ') : 'Mon, Wed'}</span> • Time: <span className="text-slate-900 font-semibold">{selectedBatch?.scheduleTime}</span> • Venue: <span className="text-slate-900 font-semibold">{selectedBatch?.roomVenue}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowQuizModal(true)}
                    className="btn-modern-secondary px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <span>🏆 Publish Quiz</span>
                  </button>
                  <button
                    onClick={() => setShowAssignmentModal(true)}
                    className="btn-modern-secondary px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <span>📝 Assign Homework</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditScheduleModal({
                        id: selectedBatch._id,
                        scheduleDays: selectedBatch.scheduleDays ? selectedBatch.scheduleDays.join(', ') : 'Mon, Wed',
                        scheduleTime: selectedBatch.scheduleTime || '10:00 AM - 11:30 AM',
                        roomVenue: selectedBatch.roomVenue || 'Lab 101',
                        subject: selectedBatch.subject || 'Robotics & STEM Lab'
                      });
                    }}
                    className="btn-modern-secondary px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <span>Edit Timetable & Venue</span>
                  </button>
                  <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Topic Covered Today</label>
                <input
                  type="text"
                  value={topicCovered}
                  onChange={(e) => setTopicCovered(e.target.value)}
                  placeholder="e.g. Ultrasonic Distance Sensor Circuit & MicroPython code"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {students.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-8">No approved students in this offline batch yet.</p>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Mark Student Attendance</p>
                  {students.map((student) => {
                    const currentStatus = attendanceMap[student._id]?.status || 'present';
                    return (
                      <div key={student._id} className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-slate-600 font-mono">
                            Primary Key Roll No: <span className="text-slate-900 font-bold">{student.offlineRollNo || 'ST-GRA-001'}</span> • {student.grade} (Sec {student.section || 'A'})
                          </p>
                          <p className="text-[11px] text-slate-500">Father: {student.fatherName || 'N/A'} • Student Mob: {student.studentMobile || 'N/A'}</p>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student._id, 'present')}
                            className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                              currentStatus === 'present'
                                ? 'bg-slate-900 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 size={13} />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student._id, 'late')}
                            className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                              currentStatus === 'late'
                                ? 'bg-slate-700 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Clock size={13} />
                            <span>Late</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(student._id, 'absent')}
                            className={`py-1 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                              currentStatus === 'absent'
                                ? 'bg-slate-500 text-white'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <XCircle size={13} />
                            <span>Absent</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated Student Credentials Card Modal */}
      {generatedCreds && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 relative shadow-lg">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto mb-1 font-bold">
                <Check size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Batch Allotted & Credentials Generated</h3>
              <p className="text-xs text-slate-500">Share or print these login credentials for the student.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 space-y-2 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-slate-500 uppercase">Student Name</p>
                <p className="font-bold text-slate-900">{generatedCreds.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Primary Key Roll No</p>
                  <p className="font-mono font-bold text-slate-900">{generatedCreds.offlineRollNo}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Assigned Batch</p>
                  <p className="font-semibold text-slate-800">{generatedCreds.batchName}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Official Login ID / Email</p>
                  <p className="font-mono font-bold text-slate-900">{generatedCreds.loginId}</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Random Password</p>
                  <p className="font-mono font-bold text-slate-900">{generatedCreds.generatedPassword}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setGeneratedCreds(null)}
              className="w-full py-2 btn-modern-primary rounded-lg font-semibold text-xs transition-all"
            >
              Done & Close Credentials Card
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Edit Timetable & Room Venue Modal */}
      {editScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 relative shadow-lg">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Edit Timetable & Lab Venue</h3>
              <p className="text-xs text-slate-500">Updates will immediately reflect on student portals in real-time.</p>
            </div>

            <form onSubmit={handleUpdateSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Session Days</label>
                <input
                  type="text"
                  required
                  value={editScheduleModal.scheduleDays}
                  onChange={(e) => setEditScheduleModal({ ...editScheduleModal, scheduleDays: e.target.value })}
                  placeholder="e.g. Mon, Wed, Fri"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Timing</label>
                <input
                  type="text"
                  required
                  value={editScheduleModal.scheduleTime}
                  onChange={(e) => setEditScheduleModal({ ...editScheduleModal, scheduleTime: e.target.value })}
                  placeholder="e.g. 11:00 AM - 12:30 PM"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Classroom / Lab Venue Location</label>
                <input
                  type="text"
                  required
                  value={editScheduleModal.roomVenue}
                  onChange={(e) => setEditScheduleModal({ ...editScheduleModal, roomVenue: e.target.value })}
                  placeholder="e.g. Lab 204 - Electronics & Robotics Wing"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Module</label>
                <input
                  type="text"
                  value={editScheduleModal.subject}
                  onChange={(e) => setEditScheduleModal({ ...editScheduleModal, subject: e.target.value })}
                  placeholder="e.g. Robotics & MicroPython STEM Lab"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditScheduleModal(null)}
                  className="flex-1 py-2 btn-modern-secondary rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-modern-primary rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save & Publish Timetable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publish Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg space-y-4 relative shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Publish Quiz for {selectedBatch?.name}</h3>
              <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. MicroPython & Circuit Basics Evaluation"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description / Instructions</label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="e.g. Complete all 10 practical questions before Friday lab."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Limit (Mins)</label>
                  <input
                    type="number"
                    value={quizForm.timeLimitMinutes}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={quizForm.totalMarks}
                    onChange={(e) => setQuizForm({ ...quizForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuizModal(false)}
                  className="flex-1 py-2 btn-modern-secondary rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-modern-primary rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Quiz to Students'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Homework Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg space-y-4 relative shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Assign Practical Homework for {selectedBatch?.name}</h3>
              <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  placeholder="e.g. Ultrasonic Sensor Circuit Project"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Homework Requirements</label>
                <textarea
                  rows={3}
                  required
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  placeholder="Upload breadboard photo and MicroPython code file..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 py-2 btn-modern-secondary rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 btn-modern-primary rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Assigning...' : 'Publish Homework Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineAttendance;
