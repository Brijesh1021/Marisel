import React from 'react';
import { X, ShieldAlert, CheckCircle, Info, ExternalLink, Activity, Anchor, MapPin, Clock } from 'lucide-react';
import { Vessel } from '../../types';
import { ScoreBreakdown } from './ScoreBreakdown';

interface VesselDetailsDrawerProps {
  vessel: Vessel | null;
  onClose: () => void;
}

export const VesselDetailsDrawer: React.FC<VesselDetailsDrawerProps> = ({ vessel, onClose }) => {
  if (!vessel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">{vessel.imo}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">{vessel.type}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-0.5">{vessel.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-6 flex-1 text-slate-200">
          {/* Main Score Hero Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correlation Score</span>
              <div className="text-3xl font-bold font-mono text-cyan-400 mt-1">
                {vessel.score} <span className="text-sm text-slate-500 font-normal">/ 100</span>
              </div>
              <p className="text-[11px] font-mono text-amber-400 mt-1">{vessel.priority}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          {/* Spatial Evidence Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Spatial Evidence</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Min Distance</span>
                <span className="text-slate-100 font-bold">{vessel.minDistance} km</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Time Near Origin</span>
                <span className="text-slate-100 font-bold">{vessel.timeNearOrigin}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Origin Overlap</span>
                <span className="text-slate-100 font-bold">{vessel.originOverlapPct}%</span>
              </div>
            </div>
          </div>

          {/* Temporal Evidence Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Temporal Evidence</span>
            </h3>
            <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Est. Release Window:</span>
                <span className="text-slate-200">09:00–11:30 UTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vessel Presence:</span>
                <span className="text-cyan-300 font-bold">{vessel.vesselPresenceWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Temporal Match:</span>
                <span className="text-emerald-400 font-bold">94%</span>
              </div>
            </div>
          </div>

          {/* Trajectory Evidence Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Anchor className="w-3.5 h-3.5 text-cyan-400" />
              <span>Trajectory Evidence</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Origin Intersection</span>
                <span className="text-emerald-400 font-bold">
                  {vessel.trajectoryIntersection ? 'YES (Confirmed)' : 'NO'}
                </span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Route Deviation</span>
                <span className="text-slate-100 font-bold">{vessel.routeDeviationKm} km</span>
              </div>
            </div>
          </div>

          {/* AIS Quality Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>AIS Quality</span>
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Coverage</span>
                <span className="text-slate-100 font-bold">{vessel.positionCoveragePct}%</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Signal Gaps</span>
                <span className="text-slate-100 font-bold">{vessel.signalGaps}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Data Quality</span>
                <span className="text-emerald-400 font-bold">{vessel.aisQuality}</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown Bars */}
          <ScoreBreakdown vessel={vessel} />

          {/* Why This Vessel Was Flagged Explainer */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>WHY THIS VESSEL WAS FLAGGED</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              "{vessel.evidenceSummary || 'Vessel A was within the probable origin region during much of the estimated release window and its reconstructed trajectory intersects the origin uncertainty zone.'}"
            </p>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-cyan-500/20 italic">
              "This evidence supports further investigation and does not establish responsibility."
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0f172a] sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold font-mono transition"
          >
            CLOSE EVIDENCE DRAWER
          </button>
        </div>
      </div>
    </div>
  );
};
