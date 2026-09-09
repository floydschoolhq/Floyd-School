import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { HelpCircle, Send, MessageSquare, ShieldCheck } from 'lucide-react';

const HelpSection = () => {
  const [subject, setSubject] = useState('');
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { addToast } = useToast();

  const fetchTickets = async () => {
    try {
      const res = await api.get('/school-student/help');
      setTickets(res.data.data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/school-student/help', { subject, issue });
      addToast('Doubt/Help request submitted to mentor!', 'success');
      setSubject('');
      setIssue('');
      fetchTickets();
    } catch (error) {
      addToast(error.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="card-3d rounded-lg p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle size={20} className="text-slate-800" />
          Academic Helpdesk & Doubts
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">Submit academic doubts or lab hardware queries and view mentor replies in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Submit Doubt Form */}
        <div className="card-3d rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <MessageSquare size={16} className="text-slate-800" />
            Submit New Academic Doubt
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Doubt Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. MicroPython pin reading issue in lab"
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Question</label>
              <textarea
                rows={5}
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Explain what is not working or what guidance you need..."
                className="w-full bg-white border border-slate-300 rounded p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 btn-3d-dark rounded text-xs font-bold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Send size={14} />
              <span>{loading ? 'Submitting...' : 'Send to Teacher / Mentor'}</span>
            </button>
          </form>
        </div>

        {/* Real-time Ticket Replies */}
        <div className="card-3d rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldCheck size={16} className="text-slate-800" />
            Mentor Replies & History
          </h2>

          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No doubt queries submitted yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {tickets.map((t) => (
                <div key={t._id} className="bg-slate-50 border border-slate-300 rounded p-3.5 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{t.subject}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 border border-slate-300 text-slate-800">
                      {t.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{t.issue}</p>

                  {t.messages && t.messages.length > 1 && (
                    <div className="border-t border-slate-200 pt-2 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Teacher / Mentor Responses</p>
                      {t.messages.slice(1).map((msg, mIdx) => (
                        <div key={mIdx} className="bg-white border border-slate-200 rounded p-2 text-xs shadow-2xs">
                          <p className="font-bold text-slate-900 mb-0.5">{msg.sender?.name || 'Mentor / Staff'}</p>
                          <p className="text-slate-700">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
