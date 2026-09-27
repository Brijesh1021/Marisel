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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Investigation Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Evidence-Based Attribution Assessment Overview
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
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between border border-slate-200 h-[600px] overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <h2 className="font-bold text-base text-slate-900 uppercase tracking-wider">Investigation Summary</h2>
            </div>

            <div className="space-y-3.5 text-xs font-mono mb-6">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Incident ID:</span>
                <span className="text-blue-600 font-bold">{mockCase.id}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Detection:</span>
                <span className="text-slate-700 font-bold">12 Jan 2026, 10:24 UTC</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-700 font-bold">12.10°N, 55.90°E</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Estimated Spill Area:</span>
                <span className="text-slate-700 font-bold">63.4 km²</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Detection Confidence:</span>
                <span className="text-emerald-600 font-bold">0.87</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Release Window:</span>
                <span className="text-amber-600 font-bold">08:00–20:00 UTC</span>
              </div>
            </div>

            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">Candidate Vessel Assessment</h3>
            <div className="space-y-3">
              {mockVessels.slice(0, 3).map(vessel => (
                <div key={vessel.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-800">{vessel.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">Score: {vessel.score}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                    <div>Origin Comp: <span className={vessel.originMatch > 10 ? 'text-emerald-600' : 'text-amber-600'}>{vessel.originMatch > 10 ? 'High' : 'Mod'}</span></div>
                    <div>AIS Consist: <span className="text-emerald-600">High</span></div>
                    <div>Behaviour: <span className={vessel.behaviourMatch < 8 ? 'text-amber-600' : 'text-emerald-600'}>{vessel.behaviourMatch < 8 ? 'Anomalous' : 'Normal'}</span></div>
                    <div>Sim Consist: <span className={vessel.score > 80 ? 'text-emerald-600' : 'text-amber-600'}>{vessel.score > 80 ? 'High' : 'Mod'}</span></div>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="text-xs font-bold text-slate-500">Natural / Other Source</div>
                <div className="text-[10px] text-slate-400 mt-1">Insufficient evidence</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/detection')}
            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 transition group"
          >
            <span>VIEW INVESTIGATION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
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
