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
    <div className="glass-panel glass-panel-hover p-5 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono text-slate-900">{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
        </div>
        {subtitle && <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
