import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { Users, UserPlus, Upload, Search, Mail, Filter, X, Phone, UserCheck } from 'lucide-react';

const StudentRoster = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Single Student Form
  const [singleStudent, setSingleStudent] = useState({
    name: '',
    email: '',
    grade: 'Grade 10',
    section: 'A',
    fatherName: '',
    studentMobile: '',
    fatherMobile: '',
    batchId: ''
  });

  // Bulk CSV Text
  const [bulkCsv, setBulkCsv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [studentRes, batchRes] = await Promise.all([
        api.get(`/partner-school/students?batchId=${selectedBatchFilter}`),
        api.get('/partner-school/batches')
      ]);

      setStudents(studentRes.data.data || []);
      setBatches(batchRes.data.data || []);
      if (batchRes.data.data?.length > 0 && !singleStudent.batchId) {
        setSingleStudent(prev => ({ ...prev, batchId: batchRes.data.data[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching student roster:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBatchFilter]);

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/partner-school/students', singleStudent);
      addToast('Student registered successfully!', 'success');
      setShowSingleModal(false);
      setSingleStudent({
        name: '',
        email: '',
        grade: 'Grade 10',
        section: 'A',
        fatherName: '',
        studentMobile: '',
        fatherMobile: '',
        batchId: batches[0]?._id || ''
      });
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkCsv.trim()) {
      addToast('Please enter CSV formatted data', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const lines = bulkCsv.trim().split('\n');
      const studentData = lines.map(line => {
        const [name, email, grade, section, fatherName, studentMobile, fatherMobile] = line.split(',').map(s => s?.trim());
        return {
          name,
          email,
          grade: grade || 'Grade 10',
          section: section || 'A',
          fatherName: fatherName || '',
          studentMobile: studentMobile || '',
          fatherMobile: fatherMobile || '',
          batchId: singleStudent.batchId || batches[0]?._id
        };
      }).filter(s => s.name && s.email);

      await api.post('/partner-school/students/bulk', { students: studentData });
      addToast(`Bulk registered ${studentData.length} students successfully!`, 'success');
      setShowBulkModal(false);
      setBulkCsv('');
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Bulk upload failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term) ||
      s.offlineRollNo?.toLowerCase().includes(term) ||
      s.fatherName?.toLowerCase().includes(term) ||
      s.studentMobile?.includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 card-modern rounded-xl p-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users size={20} className="text-slate-800" />
            Enrolled Student Directory
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">Manage student admissions, primary key roll numbers, and contact profiles.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="btn-modern-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <Upload size={14} />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={() => setShowSingleModal(true)}
            className="btn-modern-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
          >
            <UserPlus size={14} />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card-modern rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll no, mobile..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Filter Batch:</span>
          <select
            value={selectedBatchFilter}
            onChange={(e) => setSelectedBatchFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none"
          >
            <option value="all">All School Batches ({batches.length})</option>
            {batches.map(b => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Directory Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="card-modern rounded-xl p-12 text-center text-slate-500 text-xs">
          No students found matching your filter criteria.
        </div>
      ) : (
        <div className="card-modern rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Parent Details</th>
                  <th className="px-4 py-3">Contact Email & Mob</th>
                  <th className="px-4 py-3">Assigned Batch</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-slate-800 font-medium">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-900 font-bold">
                      {student.offlineRollNo || 'Pending Allotment'}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {student.grade || 'Grade 10'} (Sec {student.section || 'A'})
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-800">{student.fatherName || 'N/A'}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{student.fatherMobile || 'No Contact'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate max-w-[150px]">{student.email}</span>
                        </div>
                        {student.studentMobile && (
                          <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-mono">
                            <Phone size={11} className="text-slate-400" />
                            <span>{student.studentMobile}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-semibold">
                        {student.batchId ? student.batchId.name : 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        student.approvalStatus === 'Approved' || student.offlineRollNo
                          ? 'bg-slate-100 text-slate-900 border-slate-200'
                          : 'bg-slate-200 text-slate-800 border-slate-300'
                      }`}>
                        {student.approvalStatus === 'Approved' || student.offlineRollNo ? 'Active Student' : 'Pending Batch'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Single Registration Modal */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg relative shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register Single School Student</h3>
              <button onClick={() => setShowSingleModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={singleStudent.name}
                  onChange={(e) => setSingleStudent({ ...singleStudent, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Grade / Class</label>
                  <input
                    type="text"
                    required
                    value={singleStudent.grade}
                    onChange={(e) => setSingleStudent({ ...singleStudent, grade: e.target.value })}
                    placeholder="e.g. Grade 10"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    value={singleStudent.section}
                    onChange={(e) => setSingleStudent({ ...singleStudent, section: e.target.value })}
                    placeholder="e.g. A"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={singleStudent.email}
                  onChange={(e) => setSingleStudent({ ...singleStudent, email: e.target.value })}
                  placeholder="rahul.sharma@school.edu.in"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={singleStudent.fatherName}
                    onChange={(e) => setSingleStudent({ ...singleStudent, fatherName: e.target.value })}
                    placeholder="e.g. Suresh Sharma"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Father's Mobile No</label>
                  <input
                    type="text"
                    value={singleStudent.fatherMobile}
                    onChange={(e) => setSingleStudent({ ...singleStudent, fatherMobile: e.target.value })}
                    placeholder="9876543210"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student Mobile No</label>
                  <input
                    type="text"
                    value={singleStudent.studentMobile}
                    onChange={(e) => setSingleStudent({ ...singleStudent, studentMobile: e.target.value })}
                    placeholder="9876500000"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Batch Section</label>
                  <select
                    value={singleStudent.batchId}
                    onChange={(e) => setSingleStudent({ ...singleStudent, batchId: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                  >
                    {batches.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 btn-modern-primary rounded-lg text-xs font-semibold transition-all disabled:opacity-50 mt-2"
              >
                {submitting ? 'Registering...' : 'Complete Student Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-lg relative shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Bulk CSV Student Import</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-800">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Offline Batch</label>
                <select
                  value={singleStudent.batchId}
                  onChange={(e) => setSingleStudent({ ...singleStudent, batchId: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none"
                >
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CSV Content (Format: Name, Email, Grade, Section, FatherName, StudentMobile, FatherMobile)
                </label>
                <textarea
                  rows={6}
                  required
                  value={bulkCsv}
                  onChange={(e) => setBulkCsv(e.target.value)}
                  placeholder="Rahul Sharma, rahul@gmail.com, Grade 10, A, Suresh Sharma, 9876543210, 9876500000&#10;Anita Roy, anita@gmail.com, Grade 10, B, Ramesh Roy, 9876543211, 9876500001"
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 btn-modern-primary rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
              >
                {submitting ? 'Importing Students...' : 'Import Students Batch'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRoster;
