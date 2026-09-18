import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Waves, 
  LayoutDashboard, 
  Scan, 
  Binary, 
  Compass, 
  Radar, 
  ShieldAlert, 
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/detection', label: '1. Spill Detection', icon: Scan },
    { path: '/analysis', label: '2. Spill Analysis', icon: Binary },
    { path: '/drift-origin', label: '3. Drift & Origin', icon: Compass },
    { path: '/ais-investigation', label: '4. AIS Investigation', icon: Radar },
    { path: '/vessel-ranking', label: '5. Vessel Ranking', icon: ShieldAlert },
    { path: '/report', label: '6. Investigation Report', icon: FileCheck2 },
  ];

  return (
    <aside className="w-64 bg-[#0b1329] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Waves className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-wide">OceanTrace</h1>
            <p className="text-[11px] text-slate-400 tracking-wider uppercase font-mono">Marine Safety AI</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Status Block */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-[#060a17]/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mode</span>
          <span className="px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            DEMO MODE
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800/60">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">
            System Status
          </div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Simulation Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
