import React, { useState } from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';

interface VesselFilterBarProps {
  onApplyFilters: (filters: FilterState) => void;
  filteredCount: number;
  totalCount: number;
}

export interface FilterState {
  date: string;
  timeWindow: string;
  maxDistanceKm: number;
  vesselType: string;
  aisQuality: string;
}

export const VesselFilterBar: React.FC<VesselFilterBarProps> = ({
  onApplyFilters,
  filteredCount,
  totalCount
}) => {
  const [filters, setFilters] = useState<FilterState>({
    date: '2026-09-18',
    timeWindow: '08:00 - 12:00 UTC',
    maxDistanceKm: 15,
    vesselType: 'All Types',
    aisQuality: 'All Quality'
  });

  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApplyFilters(filters);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="glass-panel p-4 rounded-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Historical AIS Reconstruction Filters</span>
        </div>

        <div className="text-xs font-mono">
          <span className="text-slate-400">Query Status: </span>
          <span className="text-cyan-300 font-bold">{totalCount} vessels found</span>
          <span className="text-slate-500 mx-1">|</span>
          <span className="text-emerald-400 font-bold">{filteredCount} vessels relevant</span>
        </div>
      </div>

      {/* Filter Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Time Window Filter */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Time Window</label>
          <select
            value={filters.timeWindow}
            onChange={e => setFilters(prev => ({ ...prev, timeWindow: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option>08:00 - 12:00 UTC</option>
            <option>06:00 - 14:00 UTC</option>
            <option>Full Day (24h)</option>
          </select>
        </div>

        {/* Distance from Origin */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Max Distance ({filters.maxDistanceKm} km)
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={5}
            value={filters.maxDistanceKm}
            onChange={e => setFilters(prev => ({ ...prev, maxDistanceKm: Number(e.target.value) }))}
            className="w-full accent-cyan-500 mt-2"
          />
        </div>

        {/* Vessel Type */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Vessel Type</label>
          <select
            value={filters.vesselType}
            onChange={e => setFilters(prev => ({ ...prev, vesselType: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option>All Types</option>
            <option>Tankers (Oil/Chemical)</option>
            <option>Cargo & Container</option>
            <option>Bulk Carrier</option>
          </select>
        </div>

        {/* AIS Quality */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">AIS Quality</label>
          <select
            value={filters.aisQuality}
            onChange={e => setFilters(prev => ({ ...prev, aisQuality: e.target.value }))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option>All Quality</option>
            <option>High Quality Only</option>
            <option>Medium & High Quality</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end pt-2 border-t border-slate-800">
        <button
          onClick={handleApply}
          className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-semibold text-xs transition"
        >
          {applied ? <Check className="w-4 h-4 text-emerald-300" /> : <Filter className="w-4 h-4" />}
          <span>{applied ? 'FILTERS APPLIED' : 'APPLY FILTERS'}</span>
        </button>
      </div>
    </div>
  );
};
