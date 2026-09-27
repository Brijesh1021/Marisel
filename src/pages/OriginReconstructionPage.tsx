import React, { useState, useEffect, useRef } from 'react';
import { Compass, Wind, Waves, Play, Pause, RotateCcw, Activity, Clock, ShieldAlert } from 'lucide-react';
import { OceanMap } from '../components/map/OceanMap';
import { KPICard } from '../components/common/KPICard';

import { defaultLagrangianEngine } from '../engine/lagrangianDrift';

export const OriginReconstructionPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  // Run live backward particle hindcast calculation
  const hindcast = defaultLagrangianEngine.runBackwardHindcast(
    [13.40, 80.14],
    {
      currentSpeed: 0.4,
      currentDir: 135,
      windSpeed: 12.5,
      windDir: 45,
      stokesDrift: 0.08,
      seaState: 'Moderate'
    },
    12 // hours
  );

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(p => {
          if (p >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">4D Probabilistic Origin Reconstruction</h1>
        <p className="text-sm text-slate-500 mt-1">
          Spatio-temporal reconstruction with probabilistic uncertainty using ensemble backward drift.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="glass-panel p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-bold">Observed Spill</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-emerald-600 font-bold">Environmental Conditions</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-600 font-bold">OpenDrift / OpenOil</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-amber-600 font-bold">Ensemble Backward Drift</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-rose-600 font-bold">Origin Probability Map</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Map */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="h-[500px] border border-slate-200 rounded-xl overflow-hidden relative shadow-sm">
            <div className="absolute top-4 left-4 z-[400] bg-white/95 border border-blue-200 px-3 py-1.5 rounded-md shadow-sm">
              <span className="text-xs font-bold text-blue-700 font-mono">ACTIVE INCIDENT HINDCAST</span>
            </div>
            
            {/* Simulation Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] bg-white/95 border border-slate-200 p-2 rounded-lg shadow-md flex items-center space-x-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 hover:bg-slate-100 rounded-lg text-blue-600 transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => { setProgress(0); setIsPlaying(false); }}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <div className="h-4 w-px bg-slate-200"></div>
              
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-700">
                <span className="text-slate-500">T-</span>
                <input 
                  type="range" 
                  className="w-32 accent-blue-500" 
                  min="0" 
                  max="100" 
                  value={progress}
                  onChange={(e) => {
                    setProgress(Number(e.target.value));
                    setIsPlaying(false);
                  }}
                />
                <span>09:15 UTC</span>
              </div>
              
              <button 
                onClick={() => { setProgress(0); setIsPlaying(true); }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition ml-2 shadow-sm"
              >
                RUN HINDCAST
              </button>
            </div>

            <OceanMap showBackwardParticles={true} simulationProgress={progress} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Probable Location" value={`${Math.round(hindcast.probableOriginCentroid[0]*100)/100}°N`} unit={`${Math.round(hindcast.probableOriginCentroid[1]*100)/100}°E`} icon={Compass} color="amber" subtitle="Centroid" />
            <KPICard title="Release Window" value="10.5h" icon={Clock} color="cyan" subtitle="08:00 - 20:00 UTC" />
            <KPICard title="Uncertainty Radius" value={hindcast.uncertaintyRadiusKm.toString()} unit="km" icon={Activity} color="amber" subtitle="95% Confidence" />
            <KPICard title="Ensemble Runs" value={hindcast.particles.length.toString()} icon={Waves} color="blue" subtitle="Monte Carlo Particles" />
          </div>

          {/* Environmental Inputs */}
          <div className="glass-panel p-5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
              Environmental Inputs
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-200">
                    <Waves className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Ocean Currents</div>
                    <div className="text-[10px] text-slate-500 font-mono">HYCOM / Copernicus</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-700">0.4 m/s</div>
                  <div className="text-[10px] text-slate-500 font-mono">Dir: 135° SE</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-200">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Wind Data</div>
                    <div className="text-[10px] text-slate-500 font-mono">ECMWF ERA5</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-700">12.5 kts</div>
                  <div className="text-[10px] text-slate-500 font-mono">Dir: 45° NE</div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex space-x-2 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-amber-700 font-mono font-medium">
                  4D representation explicitly includes origin uncertainty based on metocean variable variance.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
