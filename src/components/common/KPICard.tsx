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
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  };

  return (
    <div className="glass-panel glass-panel-hover p-5 rounded-xl flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="mt-1 flex items-baseline space-x-1.5">
          <span className="text-2xl font-bold font-mono text-slate-100">{value}</span>
          {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
        </div>
        {subtitle && <p className="mt-1 text-[11px] text-slate-400">{subtitle}</p>}
      </div>

      <div className={`p-3 rounded-lg border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
