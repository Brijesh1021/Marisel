import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b1329]">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />

          {/* Standard Prototype Disclaimer Footer */}
          <footer className="pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400 font-mono">
            "All data shown in this prototype is simulated demonstration data and is intended only to demonstrate the investigation workflow."
          </footer>
        </main>
      </div>
    </div>
  );
};
