import React, { useState } from 'react';
import { Scan, Waves, Maximize2, AlertTriangle, Fingerprint, Image as ImageIcon, Download, Play, RefreshCw } from 'lucide-react';
import { KPICard } from '../components/common/KPICard';
import { mockCase, mockFalsePositives } from '../data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

import { defaultSpillClassifier } from '../engine/spillClassifier';

export const SpillDetectionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overlay');
  const [detectionState, setDetectionState] = useState<'idle' | 'acquiring' | 'segmenting' | 'extracting'>('idle');

  // Compute live physics classification from real classifier engine
  const classification = defaultSpillClassifier.classifySpill(
    {
      areaKm2: mockCase.area,
      perimeterKm: mockCase.perimeter,
      lengthKm: mockCase.length,
      widthKm: mockCase.maxWidth,
      orientationDeg: mockCase.orientation,
      aspectRatio: mockCase.aspectRatio,
      compactness: mockCase.compactness
    },
    45, // Wind direction
    12.5 // Wind speed knots
  );

  const runDetection = () => {
    setDetectionState('acquiring');
    setActiveTab('original');

    setTimeout(() => {
      setDetectionState('segmenting');
      setActiveTab('processed');
    }, 1200);

    setTimeout(() => {
      setDetectionState('extracting');
      setActiveTab('segmentation');
    }, 2800);

    setTimeout(() => {
      setDetectionState('idle');
      setActiveTab('overlay');
    }, 4000);
  };

  const radarData = classification.falsePositiveBreakdown.map(fp => ({
    subject: fp.category,
    A: fp.probabilityPct,
    fullMark: 100
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Spill Detection & Characterization</h1>
          <p className="text-sm text-slate-500 mt-1">
            Satellite SAR imagery analysis and semantic segmentation.
          </p>
        </div>
        <div className="flex space-x-3">
          <button onClick={runDetection} disabled={detectionState !== 'idle'} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition shadow-md disabled:opacity-50">
            {detectionState !== 'idle' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{detectionState !== 'idle' ? 'Detecting...' : 'Run Detection'}</span>
          </button>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-200 transition">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2 border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-bold">Sentinel-1 SAR</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-emerald-600 font-bold">U-Net / SegFormer</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-600 font-bold">Spill Segmentation</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-amber-600 font-bold">Spill Mask</span>
          <span>→</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-rose-600 font-bold">Spill Fingerprint</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left SAR Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-2 rounded-xl flex space-x-2 border border-slate-200">
            {['original', 'processed', 'segmentation', 'overlay'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${activeTab === tab
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="h-[520px] rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden border border-slate-200 shadow-md">
            {/* Realistically Generated SAR Image Background for Ennore */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/ennore_sar_real.jpg')" }}></div>

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
              <p className="text-white font-mono text-[10px] tracking-widest drop-shadow-md bg-black/50 px-3 py-1.5 rounded border border-white/20">
                [ ENNORE SAR ACQUISITION : {activeTab.toUpperCase()} VIEW ]
              </p>
            </div>
            
            {detectionState !== 'idle' && (
              <div className="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                <div className="text-blue-500 font-mono flex flex-col items-center p-6 bg-slate-900 rounded-2xl border border-blue-900 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <Scan className={`w-12 h-12 mb-3 text-blue-500 ${detectionState === 'acquiring' ? 'animate-pulse' : 'animate-spin-slow'}`} />
                  <span className="animate-pulse">
                    {detectionState === 'acquiring' && 'Acquiring SAR data for Ennore...'}
                    {detectionState === 'segmenting' && 'Running U-Net / SegFormer...'}
                    {detectionState === 'extracting' && 'Extracting Spill Mask...'}
                  </span>
                </div>
              </div>
            )}

            {/* Detection Mask Overlay Simulation aligned to the dark slick in the image */}
            {(activeTab === 'segmentation' || activeTab === 'overlay') && detectionState === 'idle' && (
              <div className="absolute inset-0 pointer-events-none">
                <style>
                  {`
                    @keyframes drawPath {
                      0% { stroke-dashoffset: 800; fill-opacity: 0; }
                      50% { stroke-dashoffset: 0; fill-opacity: 0.1; }
                      100% { stroke-dashoffset: 0; fill-opacity: 0.45; }
                    }
                  `}
                </style>
                <svg viewBox="0 0 1000 520" className="w-full h-full drop-shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  <path
                    d="M 280,410 C 350,370 450,330 510,310 C 560,290 600,260 610,250 C 620,240 600,270 560,300 C 490,340 370,400 300,430 C 270,440 250,450 220,440 Z"
                    fill="#3b82f6"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeDasharray="800"
                    style={{ animation: 'drawPath 1.5s ease-out forwards' }}
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Fingerprint */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Confidence" value={classification.confidenceScore.toString()} unit="%" icon={Scan} color="emerald" subtitle="Physics Classifier" />
            <KPICard title="Look-alike" value={classification.lookAlikeRisk} icon={AlertTriangle} color="amber" subtitle="Likelihood" />
          </div>

          <div className="glass-panel p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-blue-600" />
                <span>Spill Fingerprint</span>
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Area:</span>
                <span className="text-slate-900 font-medium">{mockCase.area} km²</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Perimeter:</span>
                <span className="text-slate-900 font-medium">{mockCase.perimeter} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Length / Width:</span>
                <span className="text-slate-900 font-medium">{mockCase.length} km / {mockCase.maxWidth} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Orientation:</span>
                <span className="text-slate-900 font-medium">{mockCase.orientation}°</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Compactness:</span>
                <span className="text-slate-900 font-medium">{mockCase.compactness}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl flex flex-col items-center border border-slate-200">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full text-left mb-2">False Positive Analysis</h3>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', fontSize: '10px', color: '#0f172a' }} />
                  <Radar name="Likelihood %" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
