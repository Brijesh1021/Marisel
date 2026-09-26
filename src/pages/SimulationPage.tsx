import React, { useState, useRef, useEffect } from 'react';
import { Play, Anchor, AlertTriangle, Route, Waves, Maximize2 } from 'lucide-react';
import { mockVessels } from '../data/mockData';
import { KPICard } from '../components/common/KPICard';

export const SimulationPage: React.FC = () => {
  const [selectedVesselId, setSelectedVesselId] = useState(mockVessels[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(100);
  const animationRef = useRef<number>();
  const selectedVessel = mockVessels.find(v => v.id === selectedVesselId) || mockVessels[0];

  const runSimulation = () => {
    setIsSimulating(true);
    setProgress(0);
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const currentProgress = Math.min((elapsed / 2500) * 100, 100);
      setProgress(currentProgress);
      
      if (currentProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vessel-to-Slick Counterfactual Simulation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Forward drift simulation from candidate vessel's known location and timestamp.
          </p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono flex items-center space-x-3">
        <Route className="w-5 h-5 text-blue-600 shrink-0" />
        <p>
          <strong className="text-slate-900">Goal:</strong> Determine if a spill initiated precisely from the candidate vessel's historical location and time would mathematically result in the observed oil slick footprint under identical metocean conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Candidate Selection */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulate Vessel</h2>
          {mockVessels.slice(0,3).map(vessel => (
            <button 
              key={vessel.id}
              onClick={() => setSelectedVesselId(vessel.id)}
              className={`w-full text-left p-3 rounded-lg border transition flex flex-col space-y-2 ${
                selectedVesselId === vessel.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-xs font-bold truncate ${selectedVesselId === vessel.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {vessel.name.split(' (')[0]}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>Release: {vessel.vesselPresenceWindow.split('–')[0]}</span>
                <span>Lat/Lng Match</span>
              </div>
            </button>
          ))}

          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 transition"
          >
            {isSimulating ? <Play className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating...' : 'Run Forward Drift'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Spatial Intersection Score" value={selectedVessel.score > 80 ? '92' : selectedVessel.score > 70 ? '64' : '21'} unit="%" icon={Maximize2} color={selectedVessel.score > 80 ? 'emerald' : selectedVessel.score > 70 ? 'amber' : 'blue'} subtitle="Overlap with observed slick" />
            <KPICard title="Physical Consistency" value={selectedVessel.score > 80 ? 'High' : selectedVessel.score > 70 ? 'Mod' : 'Low'} icon={Waves} color={selectedVessel.score > 80 ? 'emerald' : selectedVessel.score > 70 ? 'amber' : 'blue'} subtitle="Mass balance constraints" />
          </div>

          <div className="glass-panel rounded-xl border border-slate-200 overflow-hidden relative min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <span>Simulation Overlay: {selectedVessel.name.split(' (')[0]}</span>
              </h3>
              <div className="flex space-x-3 text-[10px] font-mono font-bold uppercase">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm border border-blue-500 bg-blue-100"></div>
                  <span className="text-blue-700">Observed Slick</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm border border-rose-500 bg-rose-100"></div>
                  <span className="text-rose-700">Simulated Footprint</span>
                </div>
              </div>
            </div>

             <div className="flex-1 bg-slate-100 relative flex items-center justify-center overflow-hidden">
               {/* Map Background Pattern */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
               
               <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-2/3 h-2/3">
                    {/* Observed Slick */}
                    <path d="M40,30 Q60,20 70,40 T60,80 T30,90 T20,60 Z" fill="#3b82f6" fillOpacity="0.3" stroke="#2563eb" strokeWidth="0.5" strokeDasharray="1,1" />
                    
                    {/* Simulated Slick */}
                    <path 
                      d="M40,30 Q60,20 70,40 T60,80 T30,90 T20,60 Z" 
                      fill="#e11d48" 
                      fillOpacity={isSimulating ? 0.2 : 0.4} 
                      stroke="#f43f5e" 
                      strokeWidth="0.5" 
                      transform={`
                        translate(
                          ${(selectedVessel.score > 80 ? 2 : selectedVessel.score > 70 ? 15 : -25) * (progress / 100)}, 
                          ${(selectedVessel.score > 80 ? -1 : selectedVessel.score > 70 ? 10 : 30) * (progress / 100)}
                        ) 
                        scale(${(selectedVessel.score > 80 ? 0.95 : 0.8) * (progress / 100)})
                      `}
                      style={{
                        transformOrigin: '25px 55px' // Origin Point
                      }}
                    />
                    
                    {/* Origin Point */}
                    <circle cx="25" cy="55" r="1.5" fill="#f59e0b" />
                    <line x1="25" y1="55" x2="35" y2="45" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="1,0.5" />
                    <text x="36" y="44" fill="#f59e0b" fontSize="3" fontFamily="monospace">Release Pos</text>
                  </svg>
               </div>
               
               {isSimulating && (
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-blue-200 shadow-md flex items-center space-x-3 z-50">
                   <Waves className="w-5 h-5 text-blue-600 animate-pulse" />
                   <div className="text-blue-700 font-mono text-xs font-bold">
                     T+{Math.floor((progress / 100) * 24)}h : {Math.floor(progress)}%
                   </div>
                 </div>
               )}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Model: OpenDrift v2.1.0</span>
              <span>Time Step: 15 min</span>
              <span>Particles: 10,000</span>
              <span>Evaporation: Mackay (1980)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
