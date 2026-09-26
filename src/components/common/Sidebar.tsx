import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Waves, 
  LayoutDashboard, 
  Scan,
  Compass, 
  Radar, 
  HelpCircle,
  PlaySquare,
  Bot,
  Network,
  Wind,
  FileText
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', label: '1. Dashboard', icon: LayoutDashboard },
    { path: '/detection', label: '2. Spill Detection', icon: Scan },
    { path: '/origin-reconstruction', label: '3. Origin Reconstruction', icon: Compass },
    { path: '/vessel-analysis', label: '4. Vessel Analysis', icon: Radar },
    { path: '/hypotheses', label: '5. Hypotheses', icon: HelpCircle },
    { path: '/simulation', label: '6. Counterfactual Simulation', icon: PlaySquare },
    { path: '/multi-agent', label: '7. Multi-Agent Investigation', icon: Bot },
    { path: '/evidence-graph', label: '8. Evidence Graph', icon: Network },
    { path: '/future-spread', label: '9. Future Spread', icon: Wind },
    { path: '/reports', label: '10. Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200 flex flex-col justify-between shrink-0 select-none z-20">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <Waves className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-slate-900 tracking-wide drop-shadow-sm">OILTRACE-X</h1>
            <p className="text-[11px] text-blue-600/80 tracking-widest uppercase font-mono">Attribution Platform</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 border border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  )}
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className={isActive ? 'font-semibold tracking-wide' : 'font-medium'}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Status Block */}
      <div className="p-5 border-t border-slate-200 space-y-4 bg-slate-50/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode</span>
          <span className="px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider rounded border bg-amber-50 text-amber-600 border-amber-200">
            DEMO MODE
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2">
            System Status
          </div>
          <div className="flex items-center space-x-2 text-xs text-emerald-600 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Simulation Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
