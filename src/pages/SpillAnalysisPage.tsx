import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import { 
  Ruler, 
  Clock, 
  Compass, 
  Layers, 
  Maximize2, 
  Info, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { OceanMap } from '../components/map/OceanMap';
import { StepNavigation } from '../components/common/StepNavigation';
import { mockCase, mockGeometricTrends, mockSpillTimeline } from '../data/mockData';

export const SpillAnalysisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Spill Characterization</h1>
        <p className="text-sm text-slate-400 mt-1">
          Geometric analysis and temporal age estimation of the detected slick.
        </p>
      </div>

      {/* Top Split: Map & Geometric Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 h-[450px]">
          <OceanMap />
        </div>

        {/* Measurements Grid */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800">
              <Ruler className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm">
                Geometric Measurements
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Area</span>
                <span className="text-cyan-300 text-lg font-bold">{mockCase.area} km²</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Perimeter</span>
                <span className="text-slate-200 text-lg font-bold">{mockCase.perimeter} km</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Length</span>
                <span className="text-slate-200 font-bold">{mockCase.length} km</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Max Width</span>
                <span className="text-slate-200 font-bold">{mockCase.maxWidth} km</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 col-span-2">
                <span className="text-slate-400 text-[10px] block uppercase">Centroid Coords</span>
                <span className="text-cyan-300 font-bold">
                  {mockCase.centroid[0]}° N, {mockCase.centroid[1]}° E
                </span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Orientation</span>
                <span className="text-slate-200 font-bold">{mockCase.orientation}°</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block uppercase">Aspect Ratio</span>
                <span className="text-slate-200 font-bold">{mockCase.aspectRatio}</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 col-span-2">
                <span className="text-slate-400 text-[10px] block uppercase">Compactness Index</span>
                <span className="text-emerald-400 font-bold">{mockCase.compactness}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estimated Spill Age Section */}
      <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Estimated Spill Age & Temporal Release Boundary</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              "Estimated using available multi-temporal observations and simulated drift consistency."
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block uppercase">ESTIMATED SPILL AGE</span>
              <span className="text-base font-bold text-amber-300">{mockCase.estimatedAge}</span>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block uppercase">RELEASE WINDOW</span>
              <span className="text-base font-bold text-cyan-300">{mockCase.estimatedReleaseWindow}</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 block uppercase">CONFIDENCE</span>
              <span className="text-base font-bold text-emerald-300">76%</span>
            </div>
          </div>
        </div>

        {/* Horizontal Timeline Visualization */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
            Temporal Reconstructed Timeline (18 Sep 2026)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {mockSpillTimeline.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2 font-mono"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">{item.time}</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{item.label}</h4>
                <p className="text-[11px] text-slate-400 font-sans">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Small Recharts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Area Change Over Time */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase">Area Expansion (km²)</span>
            <span className="text-cyan-400">23.7 km²</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockGeometricTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} />
                <Area type="monotone" dataKey="area" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Centroid Movement Distance */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase">Centroid Drift (km)</span>
            <span className="text-amber-400">8.6 km Total</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockGeometricTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} />
                <Line type="monotone" dataKey="driftDistance" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Max Width Growth */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase">Slick Max Width (km)</span>
            <span className="text-emerald-400">3.9 km</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockGeometricTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '11px' }} />
                <Area type="monotone" dataKey="width" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/detection', label: 'Spill Detection' }}
        nextStep={{ path: '/drift-origin', label: 'Drift & Origin' }}
      />
    </div>
  );
};
