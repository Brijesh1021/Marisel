import React, { useState } from 'react';
import { Anchor, Activity, AlertTriangle, Navigation, Map, Navigation2 } from 'lucide-react';
import { mockVessels } from '../data/mockData';
import { KPICard } from '../components/common/KPICard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

export const VesselAnalysisPage: React.FC = () => {
  const [selectedVesselId, setSelectedVesselId] = useState(mockVessels[0].id);
  const selectedVessel = mockVessels.find(v => v.id === selectedVesselId) || mockVessels[0];

  const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-md text-xs font-mono">
          <p className="text-slate-800 font-bold mb-1">{`Time (UTC): ${label}`}</p>
          <p className="text-blue-600">{`Speed: ${data.speed} knots`}</p>
          {data.gap && <p className="text-rose-600 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Signal Gap</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vessel Track & Behaviour Analysis</h1>
        <p className="text-sm text-slate-500 mt-1">
          Historical AIS/VMS analysis for route deviations, speed anomalies, and dark vessel activity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Vessel List */}
        <div className="glass-panel p-4 rounded-xl space-y-3 border border-slate-200">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Candidate Vessels</h2>
          {mockVessels.map(vessel => (
            <div 
              key={vessel.id}
              onClick={() => setSelectedVesselId(vessel.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedVesselId === vessel.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold truncate ${selectedVesselId === vessel.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {vessel.name.split(' (')[0]}
                </span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono border border-slate-200">
                  Score: {vessel.score}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate">{vessel.type}</div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top KPI Cards for Selected Vessel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Route Deviation" value={selectedVessel.routeDeviationKm.toString()} unit="km" icon={Navigation2} color={selectedVessel.routeDeviationKm > 2 ? 'amber' : 'emerald'} subtitle="From standard lane" />
            <KPICard title="AIS Signal Gaps" value={selectedVessel.signalGaps.toString()} icon={AlertTriangle} color={selectedVessel.signalGaps > 1 ? 'amber' : 'emerald'} subtitle="Missing transmissions" />
            <KPICard title="Speed" value={selectedVessel.speed.toString()} unit="kts" icon={Activity} color="cyan" subtitle="Average transit" />
            <KPICard title="Time Near Origin" value={selectedVessel.timeNearOrigin} icon={Anchor} color="amber" subtitle="Dwell time" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trajectory Map Placeholder */}
            <div className="glass-panel p-5 rounded-xl flex flex-col min-h-[400px] border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Map className="w-4 h-4 text-blue-600" />
                <span>Vessel Trajectory Map</span>
              </h3>
              <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center">
                {/* Simulated Grid/Map */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="z-10 text-center">
                  <Navigation className="w-10 h-10 text-blue-500/50 mx-auto mb-2 drop-shadow-sm" />
                  <p className="text-xs text-slate-500 font-mono">[Interactive Map View for {selectedVessel.name.split(' (')[0]}]</p>
                </div>
                {/* Simulated Track */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm">
                  <path d="M 50 250 Q 150 200 200 150 T 350 50" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 2" />
                  <circle cx="200" cy="150" r="4" fill="#f59e0b" />
                  <circle cx="350" cy="50" r="4" fill="#2563eb" />
                </svg>
              </div>
            </div>

            {/* Behaviour Analysis & Anomalies */}
            <div className="glass-panel p-5 rounded-xl flex flex-col border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Speed vs Time & Anomalies</span>
              </h3>
              
              <div className="flex-1 space-y-4">
                {/* Recharts Line Chart */}
                <div className="h-48 w-full bg-white rounded-lg p-2 border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedVessel.timeSeriesData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip content={<CustomTooltip />} />
                      {/* Highlight gaps */}
                      {selectedVessel.timeSeriesData && selectedVessel.timeSeriesData.some(d => d.gap) && (
                        <ReferenceArea x1="09:30" x2="09:40" strokeOpacity={0.3} fill="#f43f5e" fillOpacity={0.15} />
                      )}
                      <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono shadow-sm">
                  <div className="text-emerald-700 font-bold mb-2 pb-2 border-b border-slate-200 uppercase tracking-wider flex items-center">
                    Behaviour Summary
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedVessel.evidenceSummary}</p>
                </div>

                {selectedVessel.signalGaps > 0 && (
                  <div className="flex items-start space-x-3 p-3 bg-rose-50 rounded-lg border border-rose-200 text-xs shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="text-rose-800">
                      <strong className="block text-rose-700 font-bold mb-0.5">Potential Dark Vessel Activity</strong>
                      {selectedVessel.signalGaps} missing transmission(s) detected during peak transit window near origin.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
