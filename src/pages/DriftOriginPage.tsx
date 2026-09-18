import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Compass, 
  CheckCircle2, 
  Layers, 
  Wind, 
  Waves, 
  AlertTriangle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { OceanMap } from '../components/map/OceanMap';
import { StepNavigation } from '../components/common/StepNavigation';
import { mockCase } from '../data/mockData';

export const DriftOriginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hindcast' | 'forecast'>('hindcast');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simComplete, setSimComplete] = useState(true);

  const handleRunHindcast = () => {
    setIsSimulating(true);
    setSimComplete(false);

    setTimeout(() => {
      setIsSimulating(false);
      setSimComplete(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Drift Reconstruction & Probable Origin
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Reconstruct backward hydrodynamic particle drift to identify probable release origins and project forward slick dispersion.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('hindcast')}
          className={`pb-3 text-xs font-bold font-mono tracking-wider uppercase flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'hindcast'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>BACKWARD HINDCAST</span>
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`pb-3 text-xs font-bold font-mono tracking-wider uppercase flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'forecast'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>FORWARD FORECAST</span>
        </button>
      </div>

      {/* TAB 1: BACKWARD HINDCAST */}
      {activeTab === 'hindcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column */}
          <div className="lg:col-span-2 h-[480px]">
            <OceanMap
              showBackwardParticles={true}
              showForecastLayers={false}
              activeTab="hindcast"
            />
          </div>

          {/* Hindcast Control Panel */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm">
                  Hindcast Hydrodynamics
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  LAGRANGIAN DRIFT
                </span>
              </div>

              {/* Hydrodynamic Parameters */}
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Simulation Duration:</span>
                  <span className="text-slate-200 font-bold">12 hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Simulated Particles:</span>
                  <span className="text-slate-200 font-bold">5,000 particles</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Wind Influence (Stokian):</span>
                  <span className="text-cyan-300 font-bold">35%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Current Influence (Oceanic):</span>
                  <span className="text-blue-300 font-bold">65%</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunHindcast}
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RUN BACKWARD SIMULATION</span>
              </button>

              {/* Loading State */}
              {isSimulating && (
                <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 flex items-center space-x-3 font-mono text-xs text-cyan-300">
                  <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Computing 5,000 particle trajectories backward in time...</span>
                </div>
              )}

              {/* Completed Hindcast Results */}
              {simComplete && !isSimulating && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulation Complete</span>
                  </div>

                  <div className="space-y-2 text-xs pt-1 border-t border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] block">PROBABLE ORIGIN REGION</span>
                      <span className="text-amber-300 font-bold text-sm">
                        13.37–13.44° N, 80.10–80.18° E
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-t border-slate-800/60">
                      <span className="text-slate-400">Origin Confidence:</span>
                      <span className="text-emerald-400 font-bold">82%</span>
                    </div>

                    <div className="flex justify-between py-1 border-t border-slate-800/60">
                      <span className="text-slate-400">Estimated Release Window:</span>
                      <span className="text-cyan-300 font-bold">09:00–11:30 UTC</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORWARD FORECAST */}
      {activeTab === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Column */}
          <div className="lg:col-span-2 h-[480px]">
            <OceanMap
              showBackwardParticles={false}
              showForecastLayers={true}
              activeTab="forecast"
            />
          </div>

          {/* Forecast Details Panel */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm">
                  Dispersion Forecast
                </h2>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  SIMULATED FORECAST
                </span>
              </div>

              {/* Forecast Zones Grid */}
              <div className="space-y-3 font-mono">
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-cyan-300">
                    <span>+6 HOURS FORECAST</span>
                    <span>ZONE 1</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Predicted movement north-eastward towards offshore corridor.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-amber-300">
                    <span>+12 HOURS FORECAST</span>
                    <span>ZONE 2</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Expanded slick perimeter with moderate atmospheric weathering.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-rose-300">
                    <span>+24 HOURS FORECAST</span>
                    <span>ZONE 3</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Maximum dispersion boundary into international sea lanes.
                  </p>
                </div>
              </div>

              {/* Uncertainty Stats */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono flex justify-between">
                <span className="text-slate-400">Forecast Uncertainty Margin:</span>
                <span className="text-amber-400 font-bold">±3.8 km</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guided Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/analysis', label: 'Spill Analysis' }}
        nextStep={{ path: '/ais-investigation', label: 'AIS Investigation' }}
      />
    </div>
  );
};
