import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'cyan' | 'amber' | 'blue' | 'rose' | 'slate' | 'emerald';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'cyan' }) => {
  const styles = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    slate: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono ${styles[variant]}`}>
      {status}
    </span>
  );
};
