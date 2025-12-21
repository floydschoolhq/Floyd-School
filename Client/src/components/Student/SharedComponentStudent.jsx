/* eslint-disable no-unused-vars */

import React from "react";

export const Card = ({ title, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 font-['Inter'] ${className}`}>
    <h3 className="text-xl font-black text-gray-800 mb-4 tracking-tight font-['Outfit']">{title}</h3>
    {children}
  </div>
);

export const ProgressRing = ({ percentage, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-black text-gray-800 font-['Outfit']">
        {percentage}%
      </span>
    </div>
  );
};

export
  const NavLink = ({ icon: Icon, title, view, currentView, setView }) => (
    <button
      onClick={() => setView(view)}
      className={`
      flex items-center w-full p-4 rounded-xl transition duration-200 group font-['Outfit']
      ${currentView === view
          ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
          : 'text-slate-500 hover:bg-slate-50 hover:text-[#2563EB]'
        }
    `}
    >
      <Icon className={`w-5 h-5 mr-3 transition-colors ${currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-[#2563EB]'}`} />
      <span className="text-base font-black tracking-tight">{title}</span>
    </button>
  );


