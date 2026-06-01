import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Download, Eye, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';
import schedulePdf from '../../assets/pdf/thinkskool_TTS_schedule.pdf';

const SchedulePage = () => {
  return (
    <div className="min-h-screen bg-surface-base text-text-main p-6 transition-all duration-500">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 pb-6 border-b border-surface-el"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-black text-accent-primary bg-accent-primary/10 px-3 py-1 rounded uppercase tracking-wider border border-accent-primary/20">
            Timing Matrix
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
            Weekly slots
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">
          Lecture <span style={{ color: 'var(--accent-primary)' }}>Schedule</span>
        </h1>
        <p className="text-sm font-medium text-text-muted mt-1 leading-relaxed">
          Access the official thinkskool academic lecture timetable, slot maps, and schedule details below.
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Card: Download & Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="p-6 rounded-3xl bg-gradient-to-br from-surface-soft via-surface-base to-surface-soft border border-surface-el shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-accent-primary/10 transition-colors" />
            
            <div className="w-12 h-12 bg-accent-primary/10 border border-accent-primary/20 text-accent-primary rounded-2xl flex items-center justify-center mb-5 shrink-0">
              <Calendar size={22} strokeWidth={2.5} />
            </div>

            <h3 className="text-base font-black text-text-main uppercase tracking-tight mb-2">Weekly slots</h3>
            <p className="text-xs text-text-muted font-medium leading-relaxed mb-6">
              Download the complete weekly lecture time table in high-definition PDF format for offline planning.
            </p>

            <div className="space-y-3">
              <a
                href={schedulePdf}
                download="thinkskool_TTS_schedule.pdf"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-accent-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent-primary/95 transition-all shadow-md shadow-accent-primary/10 cursor-pointer"
              >
                <Download size={14} strokeWidth={3} /> Download Timetable
              </a>
              <a
                href={schedulePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-surface-soft hover:bg-surface-el text-text-main border border-surface-el rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer"
              >
                <Eye size={14} strokeWidth={2.5} /> View Fullscreen <ArrowUpRight size={12} />
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-el space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-accent-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase text-text-main tracking-wider">Official Matrix</p>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5 leading-normal">
                    Verified and synchronized by the academic committee.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <FileText size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase text-text-main tracking-wider">Auto-Syncing</p>
                  <p className="text-[10px] text-text-muted font-medium mt-0.5 leading-normal">
                    Updates to active session schedules reflect here in real-time.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Area: PDF Embed Viewport */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 h-[70vh] relative rounded-3xl overflow-hidden border border-surface-el bg-black shadow-lg"
        >
          <iframe
            src={`${schedulePdf}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0 absolute inset-0 rounded-3xl"
            title="Lecture Schedule PDF Viewport"
            allow="fullscreen"
          />
        </motion.div>

      </div>
    </div>
  );
};

export default SchedulePage;
