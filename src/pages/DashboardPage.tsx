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
import { mockCase } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { id: '1', title: 'Detection', status: 'Completed', path: '/detection' },
    { id: '2', title: 'Analysis', status: 'Completed', path: '/analysis' },
    { id: '3', title: 'Origin', status: 'Completed', path: '/drift-origin' },
    { id: '4', title: 'AIS', status: 'Completed', path: '/ais-investigation' },
    { id: '5', title: 'Ranking', status: 'In Progress', path: '/vessel-ranking' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Marine Oil Spill Investigation</h1>
        <p className="text-sm text-slate-400 mt-1">
          Detect suspected oil spills, reconstruct probable origins, and correlate historical vessel activity.
        </p>
      </div>

      {/* 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Spill"
          value="03"
          icon={Waves}
          color="cyan"
          subtitle="Bay of Bengal Sector"
        />
        <KPICard
          title="Detection Confidence"
          value="94%"
          icon={ShieldAlert}
          color="emerald"
          subtitle="Sentinel-1 U-Net Model"
        />
        <KPICard
          title="Area Detected"
          value="23.7"
          unit="km²"
          icon={Maximize2}
          color="blue"
          subtitle="Max Width 3.9 km"
        />
        <KPICard
          title="Potential Vessels"
          value="05"
          icon={Anchor}
          color="amber"
          subtitle="Correlation Candidate Pool"
        />
      </div>

      {/* Main Split: Map (Left) & Current Investigation Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Map Container */}
        <div className="lg:col-span-2 h-[480px]">
          <OceanMap />
        </div>

        {/* Right Current Investigation Panel */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="font-bold text-base text-slate-100 uppercase tracking-wider">Current Investigation</h2>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                ACTIVE CASE
              </span>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Case ID:</span>
                <span className="text-cyan-300 font-bold">{mockCase.id}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Spill Status:</span>
                <span className="text-emerald-400 font-bold">{mockCase.status}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Detection Confidence:</span>
                <span className="text-slate-100 font-bold">{mockCase.confidence}%</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Estimated Age:</span>
                <span className="text-amber-300 font-bold">{mockCase.estimatedAge}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Probable Origin:</span>
                <span className="text-amber-400 font-bold">13.37–13.44° N, 80.10–80.18° E</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Origin Confidence:</span>
                <span className="text-emerald-400 font-bold">{mockCase.probableOrigin.confidence}%</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Potential Vessels:</span>
                <span className="text-cyan-300 font-bold">{mockCase.potentialVesselsCount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/detection')}
            className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/50 flex items-center justify-center space-x-2 transition group"
          >
            <span>VIEW INVESTIGATION</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Workflow Pipeline Stepper */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Investigation Workflow Progress
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => navigate(step.path)}
              className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition flex items-center space-x-3 group"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
                {step.id}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition truncate">
                  {step.title}
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono mt-0.5">
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
