import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, ArrowRight, ShieldAlert, Anchor, CheckCircle2 } from 'lucide-react';
import { OceanMap } from '../components/map/OceanMap';
import { VesselFilterBar } from '../components/vessel/VesselFilterBar';
import { StepNavigation } from '../components/common/StepNavigation';
import { mockAllAISVessels } from '../data/mockData';
import { Vessel } from '../types';

export const AISInvestigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [vesselsList, setVesselsList] = useState<Vessel[]>(mockAllAISVessels);
  const [filterActive, setFilterActive] = useState(true);

  const handleApplyFilters = () => {
    setFilterActive(true);
  };

  const displayedVessels = filterActive
    ? mockAllAISVessels.filter(v => v.distanceFromOrigin <= 15)
    : mockAllAISVessels;

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Historical AIS Investigation
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Reconstruct historical vessel movements and spatial-temporal intersections around the estimated release window.
        </p>
      </div>

      {/* Top Filter Bar */}
      <VesselFilterBar
        onApplyFilters={handleApplyFilters}
        filteredCount={displayedVessels.length}
        totalCount={mockAllAISVessels.length}
      />

      {/* Large AIS Map */}
      <div className="h-[420px]">
        <OceanMap />
      </div>

      {/* Historical Vessel AIS Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span>Reconstructed Vessels Table</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing {displayedVessels.length} filtered candidate vessels
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="py-3 px-4">Vessel Name</th>
                <th className="py-3 px-4">IMO</th>
                <th className="py-3 px-4">Vessel Type</th>
                <th className="py-3 px-4">Distance from Origin</th>
                <th className="py-3 px-4">Time Near Origin</th>
                <th className="py-3 px-4">AIS Quality</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {displayedVessels.map((vessel) => (
                <tr key={vessel.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-100 flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      vessel.score > 80 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}></span>
                    <span>{vessel.name}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{vessel.imo}</td>
                  <td className="py-3 px-4 text-slate-300">{vessel.type}</td>
                  <td className="py-3 px-4 text-cyan-300 font-bold">
                    {vessel.distanceFromOrigin} km
                  </td>
                  <td className="py-3 px-4 text-slate-200">{vessel.timeNearOrigin}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      vessel.aisQuality === 'High' 
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}>
                      {vessel.aisQuality}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('/vessel-ranking')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white rounded text-[11px] font-semibold transition"
                    >
                      Inspect Candidate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/drift-origin', label: 'Drift & Origin' }}
        nextStep={{ path: '/vessel-ranking', label: 'Vessel Ranking' }}
      />
    </div>
  );
};
