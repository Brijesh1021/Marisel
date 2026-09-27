import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Waves,
  ShieldAlert,
  Maximize2,
  Anchor,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Compass
} from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { OceanMap } from '../components/map/OceanMap';
import { mockCase, mockVessels } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { id: '1', title: 'Detection', status: 'Completed', path: '/detection' },
    { id: '2', title: 'Reconstruction', status: 'Completed', path: '/origin-reconstruction' },
    { id: '3', title: 'Vessel Analysis', status: 'Completed', path: '/vessel-analysis' },
    { id: '4', title: 'Hypotheses', status: 'Completed', path: '/hypotheses' },
    { id: '5', title: 'Simulation', status: 'In Progress', path: '/simulation' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Final Attribution Decision</h1>
        <p className="text-sm text-slate-500 mt-1">
          Automated AI Evidence Fusion & Final Guilt Matrix
        </p>
      </div>

      {/* Main Split: Map (Left) & Current Investigation Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Map Container */}
        <div className="lg:col-span-2 h-[600px] border border-slate-200 rounded-xl overflow-hidden relative shadow-sm">
          <div className="absolute top-4 left-4 z-[400] bg-white/95 border border-emerald-200 px-3 py-1.5 rounded-md shadow-sm">
            <span className="text-xs font-bold text-emerald-700 font-mono">ACTIVE INCIDENT REPORT</span>
          </div>
          <OceanMap />
        </div>

        {/* Right Current Investigation Panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col border border-slate-200 h-[600px] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <h2 className="font-bold text-base text-slate-900 uppercase tracking-wider">Final Decision Report</h2>
          </div>

          <div className="space-y-3.5 text-xs font-mono mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Incident ID:</span>
              <span className="text-blue-600 font-bold">{mockCase.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Spill Date:</span>
              <span className="text-slate-700 font-bold">{mockCase.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Location:</span>
              <span className="text-slate-700 font-bold">13.20°N, 80.35°E</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Spill Volume Est:</span>
              <span className="text-slate-700 font-bold">400–600 tons</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Overall Confidence:</span>
              <span className="text-purple-600 font-bold text-sm">96.4%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Release Window:</span>
              <span className="text-amber-600 font-bold">03:30–04:00 IST</span>
            </div>
          </div>

          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">Primary Culprit Identified</h3>
          
          <div className="flex-1 space-y-4">
            {/* Main Culprit Card */}
            <div className="relative p-5 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-xl border-2 border-purple-400/50 overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              
              {/* Guilty Stamp */}
              <div className="absolute -right-4 -top-4 opacity-10 transform rotate-12 pointer-events-none">
                <ShieldAlert className="w-32 h-32 text-red-500" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 text-[10px] font-bold uppercase rounded border border-purple-400/30 mb-2">
                      Match Confirmed
                    </span>
                    <h4 className="text-xl font-bold text-white tracking-tight">{mockVessels[0].name.split(' (')[0]}</h4>
                    <p className="text-xs text-purple-200 font-mono mt-1">IMO: 9340623 | Type: Oil Tanker</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <span className="text-lg font-bold text-white">{mockVessels[0].score}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-black/30 p-2 rounded border border-white/10">
                    <div className="text-purple-300 text-[9px] uppercase mb-1">Spatial Lock</div>
                    <div className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> 98% Match</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/10">
                    <div className="text-purple-300 text-[9px] uppercase mb-1">AIS Alibi</div>
                    <div className="text-rose-400 font-bold flex items-center"><ShieldAlert className="w-3 h-3 mr-1" /> Anomalous</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/10 col-span-2 flex justify-between items-center">
                    <span className="text-purple-300 text-[9px] uppercase">Simulation Overlap</span>
                    <span className="text-emerald-400 font-bold">92%</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/detection')}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md flex items-center justify-center space-x-2 transition group border border-slate-700 hover:border-blue-500 mt-auto"
            >
              <span>View Full Dossier</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Workflow Pipeline Stepper */}
      <div className="glass-panel p-5 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          Investigation Data Flow
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => navigate(step.path)}
              className="p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer transition flex items-center space-x-3 group"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-mono text-xs font-bold shrink-0">
                {step.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                  {step.title}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-600 font-mono mt-0.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span>{step.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
