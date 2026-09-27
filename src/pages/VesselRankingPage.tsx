import React, { useState } from 'react';
import { ShieldAlert, Info, ChevronRight, FileSearch, ArrowRight } from 'lucide-react';
import { mockVessels } from '../data/mockData';
import { Vessel } from '../types';
import { VesselDetailsDrawer } from '../components/vessel/VesselDetailsDrawer';
import { StepNavigation } from '../components/common/StepNavigation';

import { defaultRulePreFilter } from '../engine/rulePreFilter';
import { defaultDempsterEngine } from '../engine/dempsterShafer';

export const VesselRankingPage: React.FC = () => {
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  // Run live Rule Pre-Filter and Dempster-Shafer evidence fusion across mock vessels
  const scoredCandidates = defaultRulePreFilter.filterAndRankCandidates(mockVessels, [13.40, 80.14]);

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Potential Vessel Correlation
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explainable ranking based on multi-factor spatio-temporal evidence reconstruction.
        </p>
      </div>

      {/* IMPORTANT WARNING BANNER */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3 text-xs text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold uppercase tracking-wider text-amber-300 font-mono">
            INVESTIGATIVE NOTICE
          </h4>
          <p className="mt-0.5 leading-relaxed">
            "Correlation score indicates investigative priority, not proof of responsibility."
          </p>
        </div>
      </div>

      {/* Vessel Ranking Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <FileSearch className="w-4 h-4 text-cyan-400" />
            <span>Candidate Vessel Ranking</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any row to open the complete evidence breakdown drawer
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <th className="py-3.5 px-4 text-center">Rank</th>
                <th className="py-3.5 px-4">Vessel Name</th>
                <th className="py-3.5 px-4">Min Distance</th>
                <th className="py-3.5 px-4">Temporal Match</th>
                <th className="py-3.5 px-4">Trajectory</th>
                <th className="py-3.5 px-4">Origin Match</th>
                <th className="py-3.5 px-4">AIS Quality</th>
                <th className="py-3.5 px-4">Correlation Score</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {mockVessels.map((vessel, index) => (
                <tr
                  key={vessel.id}
                  onClick={() => setSelectedVessel(vessel)}
                  className="hover:bg-slate-800/60 cursor-pointer transition group"
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center font-bold">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-mono ${index === 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                      #{index + 1}
                    </span>
                  </td>

                  {/* Vessel Name & IMO */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition">
                      {vessel.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">{vessel.imo} • {vessel.type}</div>
                  </td>

                  {/* Min Distance */}
                  <td className="py-3.5 px-4 text-cyan-300 font-bold">{vessel.minDistance} km</td>

                  {/* Temporal Match */}
                  <td className="py-3.5 px-4 text-slate-200">{vessel.temporalMatch} / 25</td>

                  {/* Trajectory */}
                  <td className="py-3.5 px-4">
                    {vessel.trajectoryIntersection ? (
                      <span className="text-emerald-400 font-bold">Intersection</span>
                    ) : (
                      <span className="text-slate-400">Clear</span>
                    )}
                  </td>

                  {/* Origin Match */}
                  <td className="py-3.5 px-4 text-slate-200">{vessel.originMatch} / 15</td>

                  {/* AIS Quality */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                      {vessel.aisQuality}
                    </span>
                  </td>

                  {/* Correlation Score */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold font-mono text-cyan-400">{vessel.score}</span>
                      <span className="text-[10px] text-slate-500">/ 100</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVessel(vessel);
                      }}
                      className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded text-xs font-semibold transition inline-flex items-center space-x-1"
                    >
                      <span>View Evidence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right-Side Vessel Evidence Drawer */}
      <VesselDetailsDrawer
        vessel={selectedVessel}
        onClose={() => setSelectedVessel(null)}
      />

      {/* Guided Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/ais-investigation', label: 'AIS Investigation' }}
        nextStep={{ path: '/report', label: 'Investigation Report' }}
      />
    </div>
  );
};
