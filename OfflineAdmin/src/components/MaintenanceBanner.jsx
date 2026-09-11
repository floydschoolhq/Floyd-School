import React from 'react';
import { AlertOctagon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MaintenanceBanner({ maintenance }) {
  if (!maintenance) return null;

  const isGlobal = maintenance.entirePlatform?.isActive;
  const isStudent = maintenance.schoolStudent?.isActive;
  const isPartner = maintenance.partnerSchool?.isActive;
  const isMentor = maintenance.mentorSchool?.isActive;

  if (!isGlobal && !isStudent && !isPartner && !isMentor) return null;

  const activeScopes = [];
  if (isGlobal) activeScopes.push('Entire Offline Ecosystem');
  else {
    if (isStudent) activeScopes.push('SchoolStudent Portal');
    if (isPartner) activeScopes.push('PartnerSchool Portal');
    if (isMentor) activeScopes.push('MentorSchool Portal');
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-300">Maintenance Active:</strong> Access restricted on{' '}
          <span className="underline decoration-amber-500/50">{activeScopes.join(', ')}</span>.
        </span>
      </div>
      <Link
        to="/maintenance"
        className="flex items-center gap-1 font-medium text-amber-300 hover:text-amber-100 transition-colors"
      >
        <span>Manage Settings</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
