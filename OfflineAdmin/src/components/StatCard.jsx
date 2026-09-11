import React from 'react';
import clsx from 'clsx';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend, onClick }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "admin-card p-5 cursor-pointer relative overflow-hidden transition-all duration-150 hover:border-slate-600 hover:shadow-lg hover:shadow-black/20",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-slate-100 mt-2 tracking-tight">
            {value !== undefined && value !== null ? value : '—'}
          </p>
        </div>
        {Icon && (
          <div className={clsx("p-2.5 rounded-lg border", colorMap[color] || colorMap.blue)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          {trend && (
            <span className={clsx("font-semibold", trend.positive ? "text-emerald-400" : "text-amber-400")}>
              {trend.text}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
