import React from 'react';
import { Search, Bell, AlertTriangle, Database } from 'lucide-react';
import { mockCase } from '../../data/mockData';

export const TopHeader: React.FC = () => {
  return (
    <header className="h-16 bg-[#0b1329] border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
      {/* Case Details */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Case:</span>
          <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded text-xs font-mono font-semibold text-cyan-300">
            <span>{mockCase.id}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Database className="w-3 h-3" />
            <span>DEMO / SIMULATED DATA</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vessels, IMO, coords..."
            className="w-full bg-slate-900/80 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500/50 transition"
            readOnly
          />
        </div>

        {/* Notifications */}
        <button 
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
          title="Simulated Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};
