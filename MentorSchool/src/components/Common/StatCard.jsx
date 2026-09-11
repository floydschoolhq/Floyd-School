import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, alert }) => {
  return (
    <div className={`card-modern rounded-xl p-5 relative overflow-hidden flex flex-col justify-between ${
      alert ? 'border-amber-300 bg-amber-50/20' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {value}
            </h3>
            {trend && (
              <span className="text-[11px] font-semibold text-emerald-600">
                {trend}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 shrink-0">
            <Icon size={18} />
          </div>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
};

export default StatCard;
