import React, { useState, useEffect } from 'react';
import { Search, Bell, Database, Radio, Globe, Shield, Terminal } from 'lucide-react';
import { mockCase } from '../../data/mockData';

export const TopHeader: React.FC = () => {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].split('.')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20 text-slate-800">
      
      {/* Left: Case Details */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2.5">
          <Terminal className="w-4 h-4 text-blue-600 opacity-80" />
          <div className="flex flex-col justify-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Active Incident</span>
            <span className="text-xs font-mono font-bold text-slate-800 leading-none">{mockCase.id}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex flex-col justify-center hidden sm:flex">
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Data Stream</span>
           <div className="flex items-center space-x-1.5 text-emerald-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider leading-none">Live Copernicus Link</span>
           </div>
        </div>
      </div>

      {/* Middle: UTC Clock */}
      <div className="hidden lg:flex flex-1 justify-center pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
          <Globe className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] font-mono font-bold text-slate-700 tracking-widest whitespace-nowrap">
            {time}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        
        {/* Search */}
        <div className="relative w-48 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search IMO, MMSI..."
            className="w-full bg-slate-50 border border-slate-200 text-[11px] text-slate-800 placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition font-mono shadow-sm"
            readOnly
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition"
          title="Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm relative overflow-hidden ml-2">
          <Shield className="w-6 h-6 opacity-10 absolute text-blue-700" />
          <span className="relative z-10 font-bold text-[10px]">L5</span>
        </div>

      </div>
    </header>
  );
};
