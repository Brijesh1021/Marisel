import React, { useState } from 'react';
import { Clock, ShieldAlert, Wind, Map, AlertTriangle, FastForward, Waves } from 'lucide-react';
import { KPICard } from '../components/common/KPICard';

export const FutureSpreadPage: React.FC = () => {
  const [horizon, setHorizon] = useState<number>(6); // 6, 12, 24, 48

  const impactData = {
    6: { radius: '4.2 km', uncertainty: '2.1 km', risk: 'Low', areas: 'Open Ocean' },
    12: { radius: '7.8 km', uncertainty: '3.4 km', risk: 'Medium', areas: 'Shipping Lane Proximity' },
    24: { radius: '13.5 km', uncertainty: '5.2 km', risk: 'High', areas: 'Coastal Economic Zone boundary' },
    48: { radius: '22.1 km', uncertainty: '8.5 km', risk: 'Critical', areas: 'Pulicat Lake Marine Sanctuary (At Risk)' },
  };

  const currentImpact = impactData[horizon as keyof typeof impactData];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forecast & Future Impact</h1>
          <p className="text-sm text-slate-500 mt-1">
            Predictive modeling of oil slick spread over 48 hours and environmental impact assessment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Control Panel */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 space-y-6">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Forecast Horizon</span>
            </h2>
            
            <div className="grid grid-cols-1 gap-2">
              {[6, 12, 24, 48].map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center justify-between ${
                    horizon === h 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <span>+{h} Hours</span>
                  {horizon === h && <FastForward className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Metocean Forcing:</span>
              <span className="text-slate-700 font-bold">NCEP GFS 0.25°</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Ocean Current:</span>
              <span className="text-slate-700 font-bold">HYCOM 1/12°</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Weather:</span>
              <span className="text-slate-700 font-bold">12kts NE Wind</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Spread Radius" value={currentImpact.radius} icon={Waves} color="cyan" subtitle="Max extent" />
            <KPICard title="Uncertainty" value={`±${currentImpact.uncertainty}`} icon={Map} color="amber" subtitle="Model variance" />
            <KPICard title="Risk Level" value={currentImpact.risk} icon={ShieldAlert} color={horizon >= 48 ? 'blue' : horizon >= 24 ? 'amber' : 'emerald'} subtitle="Ecological threat" />
            <KPICard title="Time to Impact" value={horizon.toString()} unit="hrs" icon={Clock} color="blue" subtitle="Forecast window" />
          </div>

          <div className="glass-panel p-2 rounded-xl border border-slate-200 relative h-[450px] overflow-hidden flex flex-col bg-slate-50 shadow-md">
             <div className="absolute top-4 left-4 z-10">
               <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2 bg-white/95 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm backdrop-blur-sm">
                  <Map className="w-4 h-4 text-blue-600" />
                  <span>Forecast Map: T+{horizon}h</span>
               </h3>
             </div>

             <div className="flex-1 w-full h-full relative">
               {/* Grid Pattern */}
               <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center' }}></div>
               
               {/* Map Area */}
               <svg viewBox="0 0 100 100" className="w-full h-full relative z-0">
                  {/* Coastline Simulation */}
                  <path d="M-10,0 Q20,30 10,70 T20,110 L-10,110 Z" fill="#d1fae5" fillOpacity="0.8" stroke="#10b981" strokeWidth="0.5" />
                  
                  {/* Marine Protected Area */}
                  <path d="M5,10 Q15,15 12,25 T5,35 Z" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="0.5" strokeDasharray="1,1" />
                  <text x="8" y="22" fill="#047857" fontSize="2" fontFamily="monospace" fontWeight="bold">MPA Zone</text>
                  
                  {/* Current Slick */}
                  <path d="M60,50 Q65,45 70,55 T65,65 T55,60 Z" fill="#3b82f6" fillOpacity="0.8" stroke="#2563eb" strokeWidth="0.5" />
                  
                  {/* Forecast Polygon based on horizon */}
                  <path 
                    d="M60,50 Q65,45 70,55 T65,65 T55,60 Z" 
                    fill={horizon >= 48 ? "#f43f5e" : horizon >= 24 ? "#f59e0b" : "#3b82f6"} 
                    fillOpacity="0.3" 
                    stroke={horizon >= 48 ? "#e11d48" : horizon >= 24 ? "#d97706" : "#2563eb"} 
                    strokeWidth="0.5" 
                    strokeDasharray="2,1"
                    transform={`translate(${horizon * -0.5}, ${horizon * -0.2}) scale(${1 + horizon * 0.05})`}
                  />
                  
                  {/* Wind Arrow */}
                  <g transform="translate(85, 15)">
                    <circle cx="0" cy="0" r="5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
                    <path d="M-2,2 L2,-2 M2,-2 L0,-2 M2,-2 L2,0" fill="none" stroke="#64748b" strokeWidth="0.5" />
                    <text x="-4" y="8" fill="#475569" fontSize="2" fontFamily="monospace" fontWeight="bold">WIND</text>
                  </g>
               </svg>
             </div>

             {horizon >= 24 && (
               <div className="absolute bottom-4 right-4 bg-rose-50 border border-rose-200 px-4 py-3 rounded-lg shadow-sm max-w-sm">
                 <div className="flex items-start space-x-3 text-xs">
                   <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                   <div>
                     <strong className="block text-rose-800 font-bold mb-1">ECOLOGICAL RISK DETECTED</strong>
                     <span className="text-rose-700">
                       Projected trajectory intercepts coastal economic zones and approaches protected marine sanctuary boundaries.
                     </span>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
