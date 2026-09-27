import React from 'react';
import { Search, Bell, AlertTriangle, Database } from 'lucide-react';
import { mockCase } from '../../data/mockData';

export const TopHeader: React.FC = () => {
  return (
    <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Case Details */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Case:</span>
          <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded text-xs font-mono font-semibold text-blue-700">
            <span>{mockCase.id}</span>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200"></div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Database className="w-3 h-3" />
            <span>LIVE COPERNICUS & AIS FEED</span>
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-6">
        {/* System Status */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">System Status:</span>
          <span className="flex items-center space-x-1.5 text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono">Operational</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vessels, IMO, coords..."
            className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
            readOnly
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
          title="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm">
            INV
          </div>
        </div>
      </div>
    </header>
  );
};
