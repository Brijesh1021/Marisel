import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Printer, 
  FileText,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { mockCase, mockVessels } from '../data/mockData';
import { StepNavigation } from '../components/common/StepNavigation';

export const InvestigationReportPage: React.FC = () => {
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  const handleExportReport = () => {
    const reportText = `===============================================================
OCEANTRACE: AI-POWERED MARINE OIL SPILL INVESTIGATION REPORT
CASE ID: ${mockCase.id}
ACQUISITION: ${mockCase.acquisitionDate}
CLASSIFICATION: ${mockCase.status} (Confidence: ${mockCase.confidence}%)
===============================================================

1. SPILL DETECTION
   - Satellite Platform: ${mockCase.satellite}
   - Model: ${mockCase.model}
   - Detection Confidence: ${mockCase.confidence}%
   - Classification: ${mockCase.status}

2. SPILL CHARACTERISTICS
   - Surface Area: ${mockCase.area} km²
   - Perimeter: ${mockCase.perimeter} km
   - Length: ${mockCase.length} km
   - Maximum Width: ${mockCase.maxWidth} km
   - Centroid Coords: ${mockCase.centroid[0]}° N, ${mockCase.centroid[1]}° E
   - Orientation: ${mockCase.orientation}°
   - Aspect Ratio: ${mockCase.aspectRatio}

3. ESTIMATED SPILL AGE
   - Estimated Spill Age: ${mockCase.estimatedAge}
   - Release Window: ${mockCase.estimatedReleaseWindow}
   - Age Confidence: 76%

4. BACKWARD HINDCAST & DRIFT SIMULATION
   - Model: 12-Hour Lagrangian Hydrodynamic Backward Particle Drift
   - Simulated Particles: 5,000

5. PROBABLE ORIGIN
   - Lat Range: ${mockCase.probableOrigin.latRange[0]}–${mockCase.probableOrigin.latRange[1]}° N
   - Lng Range: ${mockCase.probableOrigin.lngRange[0]}–${mockCase.probableOrigin.lngRange[1]}° E
   - Origin Confidence: ${mockCase.probableOrigin.confidence}%

6. AIS RECONSTRUCTION & CANDIDATES
   - Total Vessels Identified: 47
   - Vessels Filtered Near Origin: 17
   - Top Ranked Candidates: 5

7. TOP VESSEL CORRELATION RANKING
   - Rank 1: ${mockVessels[0].name} (${mockVessels[0].imo}) - Score: ${mockVessels[0].score}/100 [High Priority]
   - Rank 2: ${mockVessels[1].name} (${mockVessels[1].imo}) - Score: ${mockVessels[1].score}/100 [High Priority]
   - Rank 3: ${mockVessels[2].name} (${mockVessels[2].imo}) - Score: ${mockVessels[2].score}/100 [Medium Priority]

8. EVIDENCE SUMMARY & FINDINGS
   ${mockVessels[0].name} was identified within the probable origin zone during the estimated release window (09:14–10:02 UTC). Trajectory analysis confirms spatial-temporal intersection with the backward drift origin region.

===============================================================
OFFICIAL LEGAL EVIDENCE RECORD • MARPOL ANNEX I PORT STATE CONTROL ENFORCEMENT REPORT • DIGITALLY SIGNED VIA SHA-256 LEDGER HASH-CHAIN
===============================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OceanTrace_Report_${mockCase.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Investigation Report</h1>
          <p className="text-sm text-slate-400 mt-1">
            Consolidated scientific evidence dossier for Case ID: <span className="text-cyan-300 font-mono font-bold">{mockCase.id}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSummaryGenerated(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>GENERATE SUMMARY</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT REPORT</span>
          </button>
        </div>
      </div>

      {/* Predefined AI Executive Summary Callout */}
      {summaryGenerated && (
        <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 animate-in fade-in duration-300 font-sans">
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Executive Investigation Summary</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            "On 18 Sep 2026 at 14:20 UTC, Sentinel-1 SAR imagery detected a 23.7 km² suspected oil slick off the Chennai coast (13.405° N, 80.145° E). Backward Lagrangian hydrodynamic drift hindcasting established a probable release origin (13.37–13.44° N, 80.10–80.18° E) between 09:00 and 11:30 UTC. Historical AIS reconstruction evaluated 47 vessels, identifying <b>Vessel A (MV Ocean Vanguard, IMO 9384721)</b> as the top candidate (91/100 correlation score) due to 87% origin region overlap and trajectory intersection during the primary release window."
          </p>
        </div>
      )}

      {/* Main Consolidated Dossier Card */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-8 font-sans">
        {/* Dossier Header */}
        <div className="flex justify-between border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              OCEANTRACE OFFICIAL DOSSIER
            </span>
            <h2 className="text-xl font-bold text-slate-100 mt-1">Marine Oil Spill Incident Report</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Bay of Bengal Sector • Operational Area 04</p>
          </div>

          <div className="text-right text-xs font-mono">
            <div className="text-slate-400">Case Reference: <span className="text-slate-200 font-bold">{mockCase.id}</span></div>
            <div className="text-slate-400 mt-1">Date: <span className="text-slate-200">18 Sep 2026</span></div>
            <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Evidence Chain Complete</span>
            </div>
          </div>
        </div>

        {/* 8 Sections Grid */}
        <div className="space-y-6 text-xs">
          {/* Section 1: Detection */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
              1. Detection
            </h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Satellite Platform</span>
                <span className="text-slate-100 font-bold">{mockCase.satellite}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Acquisition Time</span>
                <span className="text-slate-100 font-bold">{mockCase.acquisitionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Model Architecture</span>
                <span className="text-slate-100 font-bold">{mockCase.model}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Confidence</span>
                <span className="text-emerald-400 font-bold">{mockCase.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Spill Characteristics */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
              2. Spill Characteristics
            </h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Total Surface Area</span>
                <span className="text-cyan-300 font-bold">{mockCase.area} km²</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Perimeter</span>
                <span className="text-slate-100 font-bold">{mockCase.perimeter} km</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Maximum Width</span>
                <span className="text-slate-100 font-bold">{mockCase.maxWidth} km</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Aspect Ratio</span>
                <span className="text-slate-100 font-bold">{mockCase.aspectRatio}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Estimated Age */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
              3. Estimated Age
            </h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 grid grid-cols-3 gap-4 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Estimated Age</span>
                <span className="text-amber-300 font-bold">{mockCase.estimatedAge}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Release Window</span>
                <span className="text-cyan-300 font-bold">{mockCase.estimatedReleaseWindow}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Model Confidence</span>
                <span className="text-emerald-400 font-bold">76%</span>
              </div>
            </div>
          </div>

          {/* Section 4 & 5: Backward Hindcast & Probable Origin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
                4. Backward Hindcast
              </h3>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 font-mono space-y-1">
                <p className="text-slate-300">Lagrangian 5,000 particle backward drift simulation (12h duration).</p>
                <p className="text-cyan-300 font-bold pt-1">Hydrodynamic currents: 65% • Wind drift: 35%</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
                5. Probable Origin
              </h3>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 font-mono space-y-1">
                <p className="text-amber-300 font-bold">13.37–13.44° N, 80.10–80.18° E</p>
                <p className="text-slate-400 text-[11px]">Origin Spatial Confidence: 82%</p>
              </div>
            </div>
          </div>

          {/* Section 6 & 7: AIS Reconstruction & Vessel Correlation */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
              6 & 7. AIS Reconstruction & Vessel Correlation
            </h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3 font-mono">
              <div className="grid grid-cols-3 gap-2 text-[11px] pb-3 border-b border-slate-800">
                <span>Vessels Evaluated: <b>47</b></span>
                <span>Relevant Candidates: <b>17</b></span>
                <span>Top Ranked: <b>5</b></span>
              </div>

              <div className="space-y-2">
                {mockVessels.slice(0, 3).map((vessel, i) => (
                  <div key={vessel.id} className="flex justify-between items-center text-xs p-2 rounded bg-slate-800/50">
                    <div>
                      <span className="font-bold text-slate-100">#{i + 1} {vessel.name}</span>
                      <span className="text-slate-400 ml-2">({vessel.imo})</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-slate-300">{vessel.distanceFromOrigin} km from origin</span>
                      <span className="text-cyan-400 font-bold">Score: {vessel.score}/100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 8: Evidence Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 border-l-2 border-cyan-400 pl-3 uppercase tracking-wider font-mono">
              8. Evidence Summary
            </h3>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed font-sans">
              <p>
                The evidence chain establishes high spatial-temporal correlation between <b>Vessel A (MV Ocean Vanguard)</b> and the reconstructed release origin of Slick Case OS-2026-001. Vessel A was confirmed inside the origin uncertainty polygon during 87% of its transit window between 09:14 and 10:02 UTC.
              </p>
              <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800 font-mono">
                "Notice: This evidence dossier supports further maritime authority investigation and does not constitute a legal finding of liability."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guided Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/vessel-ranking', label: 'Vessel Ranking' }}
      />
    </div>
  );
};
