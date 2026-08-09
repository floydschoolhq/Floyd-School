import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import { GraduationCap, Mail, Lock, Building2, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [schools, setSchools] = useState([]);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [isManualSchool, setIsManualSchool] = useState(false);

  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: '',
    grade: 'Grade 10',
    section: 'A',
    fatherName: '',
    studentMobile: '',
    fatherMobile: '',
    schoolId: '',
    schoolNameManual: ''
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get('/school-student/public-schools');
        setSchools(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSignUpData(prev => ({ ...prev, schoolId: res.data.data[0]._id }));
        } else {
          setIsManualSchool(true);
          setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
        }
      } catch (error) {
        console.error('Error fetching public schools:', error);
        setIsManualSchool(true);
        setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
      }
    };
    fetchSchools();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPassword
      });

      if (res.data.user.role !== 'school_student' && res.data.user.role !== 'admin' && res.data.user.role !== 'student') {
        addToast('Access denied: Account is not registered as a school student', 'error');
        setLoading(false);
        return;
      }

      login(res.data.user, res.data.token);
      addToast('Signed in successfully!', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!isManualSchool && !signUpData.schoolId) {
      addToast('Please select your school or enter school name manually', 'error');
      return;
    }
    if (isManualSchool && !signUpData.schoolNameManual.trim()) {
      addToast('Please type your school name in the input box', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/school-student/register', {
        ...signUpData,
        schoolId: isManualSchool ? 'other' : signUpData.schoolId
      });
      login(res.data.data, res.data.token);
      addToast('Registration submitted! Awaiting mentor batch allotment.', 'success');
      navigate('/');
    } catch (error) {
      addToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center mx-auto mb-2 font-bold">
            <GraduationCap size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">FLOYDSCHOOL</h1>
          <p className="text-xs text-slate-500 font-medium">Offline Student Admission & Learning Portal</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
              !isSignUp ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
              isSignUp ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Student Registration
          </button>
        </div>

        {/* Form Container */}
        {!isSignUp ? (
          /* Sign In Form */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Registered Email / ID</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@floydschool.in or email"
                  className="w-full bg-white border border-slate-300 rounded pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        ) : (
          /* New Student Registration Form */
          <form onSubmit={handleSignUpSubmit} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  {isManualSchool ? 'Type School Name Manually' : 'Select School Name'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (isManualSchool) {
                      setIsManualSchool(false);
                      setSignUpData(prev => ({ ...prev, schoolId: schools[0]?._id || '' }));
                    } else {
                      setIsManualSchool(true);
                      setSignUpData(prev => ({ ...prev, schoolId: 'other' }));
                    }
                  }}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
                >
                  {isManualSchool ? '← Choose from Partner Schools list' : '✏️ Type School Name Manually'}
                </button>
              </div>

              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400" size={14} />
                {isManualSchool ? (
                  <input
                    type="text"
                    required
                    autoFocus
                    value={signUpData.schoolNameManual}
                    onChange={(e) => setSignUpData({ ...signUpData, schoolNameManual: e.target.value })}
                    placeholder="Type your school name here (e.g. St. Xavier's High School)..."
                    className="w-full bg-white border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-semibold"
                  />
                ) : (
                  <select
                    value={signUpData.schoolId}
                    onChange={(e) => {
                      if (e.target.value === 'other') {
                        setIsManualSchool(true);
                        setSignUpData({ ...signUpData, schoolId: 'other' });
                      } else {
                        setIsManualSchool(false);
                        setSignUpData({ ...signUpData, schoolId: e.target.value });
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 font-medium"
                  >
                    {schools.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.city})</option>
                    ))}
                    <option value="other">✏️ Other / Type School Name Manually...</option>
                  </select>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                placeholder="e.g. Vikram Singh"
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Class / Grade</label>
                <input
                  type="text"
                  required
                  value={signUpData.grade}
                  onChange={(e) => setSignUpData({ ...signUpData, grade: e.target.value })}
                  placeholder="Grade 10"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Class Section</label>
                <input
                  type="text"
                  required
                  value={signUpData.section}
                  onChange={(e) => setSignUpData({ ...signUpData, section: e.target.value })}
                  placeholder="Section A"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Father's Full Name</label>
              <input
                type="text"
                required
                value={signUpData.fatherName}
                onChange={(e) => setSignUpData({ ...signUpData, fatherName: e.target.value })}
                placeholder="e.g. Rajesh Singh"
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Student Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={signUpData.studentMobile}
                  onChange={(e) => setSignUpData({ ...signUpData, studentMobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Father Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={signUpData.fatherMobile}
                  onChange={(e) => setSignUpData({ ...signUpData, fatherMobile: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Gmail / Email ID</label>
                <input
                  type="email"
                  required
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  placeholder="student@gmail.com"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded shadow-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Submitting Registration...' : 'Submit Admission Registration'}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
