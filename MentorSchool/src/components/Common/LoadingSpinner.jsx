import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <Loader2 size={28} className="animate-spin text-slate-800" />
      <span className="text-xs text-slate-500 font-medium">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
