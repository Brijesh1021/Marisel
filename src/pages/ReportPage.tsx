import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, CheckCircle2, ChevronRight, File } from 'lucide-react';
import { mockCase, mockVessels } from '../data/mockData';

import { reportCompiler } from '../services/reportCompiler';
import { defaultAuditLedger } from '../engine/auditLedger';

export const ReportPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  React.useEffect(() => {
    // Initial document scan animation
    const timer = setTimeout(() => setIsScanning(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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

        {/* Scanning Overlay Animation */}
        {isScanning && (
          <div className="absolute inset-0 z-50 bg-slate-900/10 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none">
            <div className="w-full h-1 bg-blue-500 absolute top-0 shadow-[0_0_20px_rgba(59,130,246,1)] animate-[scan_2s_ease-in-out_infinite]" />
            <style>{`
              @keyframes scan {
                0% { top: 0; opacity: 1; }
                50% { top: 100%; opacity: 1; }
                100% { top: 0; opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* Report Header */}
        <div className="border-b-2 border-slate-200 pb-6 flex justify-between items-end relative z-10">
          <div>
            <div className="text-blue-700 font-bold text-sm tracking-widest uppercase mb-2">MARISEL Formal Report</div>
            <h2 className="text-3xl font-bold text-slate-900">Evidence-Based Attribution Assessment</h2>
            <div className="text-slate-500 mt-2 text-sm font-mono">Incident ID: {mockCase.id} | Report Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
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
            Multi-agent evidence fusion, incorporating SAR segmentation, AIS vessel trajectory analysis, and counterfactual metocean simulation, indicates a high physical and temporal correlation (Score: {selectedVessel.score}/100) with the candidate vessel <strong>{selectedVessel.name.split(' (')[0]} (IMO: {selectedVessel.imo || '9340623'})</strong>.
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

        {/* Official Signature and Barcode */}
        <div className="mt-12 pt-6 border-t-2 border-dashed border-slate-300 relative z-10 flex justify-between items-start">
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase mb-2">Cryptographic Signature Hash</div>
            <div className="text-xs font-mono bg-slate-100 p-2 rounded text-slate-700 w-64 break-all">
              0x4f8a2b9c7d3e1f5a8b9c7d3e1f5a8b9c7d3e1f5a8b9c7d3e1f5a8b9c7d3e1f5a
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-slate-400 font-mono uppercase mb-2">Auth Validation</div>
            <svg width="150" height="40" viewBox="0 0 150 40" className="opacity-80">
              <rect x="0" y="0" width="3" height="40" fill="#334155" />
              <rect x="5" y="0" width="1" height="40" fill="#334155" />
              <rect x="8" y="0" width="4" height="40" fill="#334155" />
              <rect x="15" y="0" width="2" height="40" fill="#334155" />
              <rect x="20" y="0" width="6" height="40" fill="#334155" />
              <rect x="28" y="0" width="1" height="40" fill="#334155" />
              <rect x="32" y="0" width="3" height="40" fill="#334155" />
              <rect x="38" y="0" width="5" height="40" fill="#334155" />
              <rect x="46" y="0" width="2" height="40" fill="#334155" />
              <rect x="52" y="0" width="1" height="40" fill="#334155" />
              <rect x="56" y="0" width="8" height="40" fill="#334155" />
              <rect x="68" y="0" width="2" height="40" fill="#334155" />
              <rect x="73" y="0" width="4" height="40" fill="#334155" />
              <rect x="80" y="0" width="1" height="40" fill="#334155" />
              <rect x="84" y="0" width="3" height="40" fill="#334155" />
              <rect x="90" y="0" width="5" height="40" fill="#334155" />
              <rect x="98" y="0" width="2" height="40" fill="#334155" />
              <rect x="103" y="0" width="6" height="40" fill="#334155" />
              <rect x="112" y="0" width="1" height="40" fill="#334155" />
              <rect x="116" y="0" width="4" height="40" fill="#334155" />
              <rect x="123" y="0" width="2" height="40" fill="#334155" />
              <rect x="128" y="0" width="3" height="40" fill="#334155" />
              <rect x="135" y="0" width="1" height="40" fill="#334155" />
              <rect x="139" y="0" width="5" height="40" fill="#334155" />
              <rect x="147" y="0" width="3" height="40" fill="#334155" />
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-8 right-8 border-t border-slate-200 pt-4 flex justify-between items-center text-xs text-slate-400 z-10">
          <div className="font-mono">CONFIDENTIAL – PORT STATE CONTROL EYES ONLY</div>
          <div className="font-mono">PG 1/1</div>
        </div>
      </div>
    </div>
  );
};
