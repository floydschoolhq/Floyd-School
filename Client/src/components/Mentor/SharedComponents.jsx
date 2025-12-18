/* eslint-disable no-unused-vars */
import React from 'react';


export const Card = ({ children, className = '' }) => (
<div className={`bg-white/10 p-6 rounded-xl shadow-lg border border-gray-700 ${className}`}>
{children}
</div>
);


export const IconButton = ({ Icon, onClick, label, className = '' }) => (
<button
onClick={onClick}
aria-label={label}
title={label}
className={`p-2 rounded-full transition duration-150 ${className}`}
>
<Icon className="w-5 h-5" />
</button>
);


export const ProgressStatCard = ({ Icon, title, value, colorClass, trend = 0 }) => (
<Card className="flex items-center justify-between">
<div>
<p className="text-sm text-gray-400">{title}</p>
<p className="text-3xl font-bold text-white">{value}</p>
</div>
<div className="flex flex-col items-end">
<Icon className={`w-8 h-8 ${colorClass}`} />
{trend !== 0 && (
<span className={`text-xs font-semibold mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
{trend > 0 ? `+${trend}%` : `${trend}%`}
</span>
)}
</div>
</Card>
);