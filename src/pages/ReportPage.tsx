import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, File } from 'lucide-react';
import { mockCase, mockVessels } from '../data/mockData';

export const ReportPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const selectedVessel = mockVessels[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attribution Assessment Report</h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export formal evidence-based attribution reports for port state authorities.
          </p>
        </div>
        <button 
          onClick={generateReport}
          disabled={isGenerating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition shadow-md disabled:opacity-50"
        >
          {isGenerating ? <FileText className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>{isGenerating ? 'Compiling PDF...' : 'Download PDF Report'}</span>
        </button>
      </div>

      <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-8 relative overflow-hidden min-h-[800px]">
        {/* PDF Watermark / Background Styling */}
        <div className="absolute inset-0 border-[12px] border-slate-100 pointer-events-none"></div>
        <div className="absolute top-10 right-10 opacity-5">
          <ShieldCheck className="w-64 h-64" />
        </div>

        {/* Report Header */}
        <div className="border-b-2 border-slate-200 pb-6 flex justify-between items-end relative z-10">
          <div>
            <div className="text-blue-700 font-bold text-sm tracking-widest uppercase mb-2">OILTRACE-X Formal Report</div>
            <h2 className="text-3xl font-bold text-slate-900">Evidence-Based Attribution Assessment</h2>
            <div className="text-slate-500 mt-2 text-sm">Incident ID: {mockCase.id} | Date: 19 Sep 2026</div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Multi-Agent Validated</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1">1. Executive Summary</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            On {mockCase.acquisitionDate}, a suspected marine oil slick covering {mockCase.area} km² was detected via {mockCase.satellite} imagery near {mockCase.centroid[0].toFixed(2)}°N, {mockCase.centroid[1].toFixed(2)}°E. Hydrodynamic hindcast drift analysis established a probable release window of {mockCase.estimatedReleaseWindow}. 
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Multi-agent evidence fusion, incorporating SAR segmentation, AIS vessel trajectory analysis, and counterfactual metocean simulation, indicates a high physical and temporal correlation (Score: {selectedVessel.score}/100) with the candidate vessel <strong>{selectedVessel.name} ({selectedVessel.imo})</strong>.
          </p>
        </div>

        {/* Evidence Matrix Summary */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1">2. Primary Candidate: {selectedVessel.name}</h3>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Temporal Intersection</div>
              <div className="text-lg font-bold text-slate-800">{selectedVessel.vesselPresenceWindow}</div>
              <div className="text-xs text-emerald-600 mt-1">Full overlap with release window</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Spatial Deviation</div>
              <div className="text-lg font-bold text-slate-800">{selectedVessel.routeDeviationKm} km</div>
              <div className="text-xs text-amber-600 mt-1">Minor deviation from standard transit</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Dark Vessel / AIS Integrity</div>
              <div className="text-lg font-bold text-slate-800">{selectedVessel.signalGaps} Signal Gaps</div>
              <div className="text-xs text-rose-600 mt-1">Anomalous transmission interruption</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Simulation Consistency</div>
              <div className="text-lg font-bold text-slate-800">92% Spatial Overlap</div>
              <div className="text-xs text-emerald-600 mt-1">High mass balance consistency</div>
            </div>
          </div>
        </div>

        {/* Appendices */}
        <div className="space-y-3 relative z-10">
          <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-1">3. Attached Evidence Artifacts</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center space-x-2"><File className="w-4 h-4 text-slate-400" /> <span>Appendix A: Raw Sentinel-1 SAR imagery and SegFormer segmentation mask.</span></li>
            <li className="flex items-center space-x-2"><File className="w-4 h-4 text-slate-400" /> <span>Appendix B: Hydrodynamic backward-drift Monte Carlo dispersion plots.</span></li>
            <li className="flex items-center space-x-2"><File className="w-4 h-4 text-slate-400" /> <span>Appendix C: Historical AIS/VMS trajectory logs (Raw NMEA data).</span></li>
            <li className="flex items-center space-x-2"><File className="w-4 h-4 text-slate-400" /> <span>Appendix D: Multi-agent consensus cryptographic audit log.</span></li>
          </ul>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 border-t border-slate-200 pt-4 flex justify-between items-center text-xs text-slate-400 z-10">
          <div>Confidential – Port State Control Eyes Only</div>
          <div>Page 1 of 12</div>
        </div>
      </div>
    </div>
  );
};
