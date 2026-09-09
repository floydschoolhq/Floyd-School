import React, { useRef } from 'react';
import { GraduationCap, Printer, ShieldCheck, QrCode } from 'lucide-react';

const StudentIDCard = ({ student, onClose }) => {
  const cardRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const name = student?.name || 'Student Name';
  const rollNo = student?.offlineRollNo || 'PENDING-ALLOTMENT';
  const school = student?.schoolName || 'St. Xavier\'s STEM Academy';
  const batch = student?.batchName || 'Grade 10 Robotics Section A';
  const grade = student?.grade || 'Grade 10';
  const section = student?.section || 'A';
  const academicYear = '2025-2026';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            Official Student ID Card
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <Printer size={13} />
              <span>Print Card</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Printable Card Area */}
        <div
          ref={cardRef}
          className="border-2 border-slate-900 rounded-2xl overflow-hidden bg-white text-slate-900 shadow-md font-sans print:border-2 print:border-black"
        >
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-white text-slate-900 flex items-center justify-center font-bold">
                <GraduationCap size={20} />
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tight leading-none">FLOYD SCHOOL</h1>
                <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">STEM & Robotics Academy</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
              OFFLINE PASS
            </span>
          </div>

          {/* Student Profile Body */}
          <div className="p-5 space-y-4">
            <div className="flex items-center space-x-4">
              {/* Photo Avatar Placeholder with initials */}
              <div className="w-18 h-20 rounded-xl bg-slate-100 border-2 border-slate-300 flex flex-col items-center justify-center shrink-0">
                <span className="text-xl font-black text-slate-700">
                  {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <span className="text-[8px] font-mono uppercase text-slate-400 mt-1">PHOTO</span>
              </div>

              {/* Name and Roll */}
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900 leading-tight">{name}</p>
                <div className="bg-slate-100 rounded px-2 py-0.5 inline-block border border-slate-200">
                  <p className="font-mono text-xs font-bold text-slate-900 tracking-wider">
                    {rollNo}
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">{school}</p>
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate-100 py-3">
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Class & Section</p>
                <p className="font-bold text-slate-800">{grade} - Sec {section}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Academic Session</p>
                <p className="font-bold text-slate-800 font-mono">{academicYear}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Enrolled Batch</p>
                <p className="font-bold text-slate-800 truncate">{batch}</p>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
                <QrCode size={16} />
                <span className="font-mono font-semibold">VERIFIED LAB PASS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">floydschool.in</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center print:hidden">
          Present this official ID card at partner school robotics lab sessions.
        </p>
      </div>
    </div>
  );
};

export default StudentIDCard;
