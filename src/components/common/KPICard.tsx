import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'cyan' | 'blue' | 'emerald' | 'amber';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  subtitle,
  color = 'cyan'
}) => {
  const colorMap = {
    cyan: 'text-blue-600 bg-blue-50 border-blue-200 shadow-[0_0_10px_rgba(37,99,235,0.05)]',
    blue: 'text-indigo-600 bg-indigo-50 border-indigo-200 shadow-[0_0_10px_rgba(79,70,229,0.05)]',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.05)]',
    amber: 'text-amber-600 bg-amber-50 border-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.05)]',
  };

  return (
    <div className="glass-panel glass-panel-hover p-4 lg:p-5 rounded-xl flex items-start justify-between gap-3 overflow-hidden">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] lg:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{title}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="text-xl lg:text-2xl font-bold font-mono text-slate-900 tracking-tight">{value}</span>
          {unit && <span className="text-[11px] lg:text-xs font-semibold text-slate-500">{unit}</span>}
        </div>
        {subtitle && <p className="mt-1.5 text-[10px] lg:text-[11px] text-slate-400 leading-snug">{subtitle}</p>}
      </div>

      <div className={`p-2.5 lg:p-3 rounded-lg border shrink-0 ${colorMap[color]}`}>
        <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
    </div>
  );
};
