import React from 'react';
import { Vessel } from '../../types';

interface ScoreBreakdownProps {
  vessel: Vessel;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ vessel }) => {
  const items = [
    { label: 'Spatial Proximity', val: vessel.spatialMatch, max: 25 },
    { label: 'Temporal Match', val: vessel.temporalMatch, max: 25 },
    { label: 'Trajectory Consistency', val: vessel.trajectoryMatch, max: 20 },
    { label: 'Origin Consistency', val: vessel.originMatch, max: 15 },
    { label: 'Behavioural Pattern', val: vessel.behaviourMatch, max: 10 },
    { label: 'AIS Signal Quality', val: vessel.aisQualityScore, max: 5 },
  ];

  return (
    <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Score Breakdown</span>
        <div className="text-sm font-bold font-mono text-cyan-400">
          {vessel.score} <span className="text-xs font-normal text-slate-500">/ 100</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const pct = Math.round((item.val / item.max) * 100);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-200 font-medium">{item.val} / {item.max}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
