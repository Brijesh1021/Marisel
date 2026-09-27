import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopHeader } from '../components/common/TopHeader';
import { AnimatePresence, motion } from 'framer-motion';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-transparent relative z-0">
      {/* Background ambient glow - Light Mode */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-100/50 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
        {/* Top Header */}
        <TopHeader />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-6 flex-1 w-full flex flex-col"
            >
              <Outlet />

              <div className="flex-grow"></div>

              {/* System Footer */}
              <footer className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-mono mt-auto flex justify-between items-center">
                <span>MARISEL v2.4.0 • Autonomous Marine Spill Detection & Vessel Attribution System</span>
                <span>Port State Control Enforcement System</span>
              </footer>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
