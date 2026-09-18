import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, ShieldCheck, PieChart, Activity, AlertCircle } from 'lucide-react';
import { SARImageViewer } from '../components/detection/SARImageViewer';
import { StepNavigation } from '../components/common/StepNavigation';
import { mockCase, mockFalsePositives } from '../data/mockData';

export const SpillDetectionPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete'>('complete');
  const [currentStepText, setCurrentStepText] = useState('Detection Complete');
  const [scanProgress, setScanProgress] = useState(100);

  const handleRunDetection = () => {
    setStatus('running');
    setScanProgress(0);

    const steps = [
      'Loading satellite data...',
      'Preprocessing SAR backscatter image...',
      'Running U-Net neural segmentation...',
      'Filtering false positives (wakes & low-wind)...'
    ];

    steps.forEach((stepMsg, index) => {
      setTimeout(() => {
        setCurrentStepText(stepMsg);
        setScanProgress((index + 1) * 25);
      }, (index + 1) * 700);
    });

    setTimeout(() => {
      setStatus('complete');
      setCurrentStepText('Detection Complete');
    }, 3200);
  };

  const handleReset = () => {
    setStatus('idle');
    setScanProgress(0);
    setCurrentStepText('Ready to Analyze');
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">AI Oil Spill Detection</h1>
        <p className="text-sm text-slate-400 mt-1">
          Identify suspected oil slicks from synthetic aperture radar (SAR) satellite imagery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left SAR Image Viewer Panel */}
        <div className="space-y-3">
          <SARImageViewer
            isScanning={status === 'running'}
            scanProgress={scanProgress}
            showDetectionOverlay={status === 'complete'}
          />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>FIGURE 1.1: Sentinel-1 C-Band SAR High-Resolution Frame</span>
            <span className="text-cyan-400 font-semibold">10m Ground Resolution</span>
          </div>
        </div>

        {/* Right Detection Results & Controls */}
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-between border border-slate-800">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-bold text-slate-100 uppercase tracking-wider text-sm">Detection Parameters</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                SENTINEL-1 SAR
              </span>
            </div>

            {/* Metadata Table */}
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Satellite Platform:</span>
                <span className="text-slate-200 font-bold">{mockCase.satellite}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Acquisition Timestamp:</span>
                <span className="text-slate-200 font-bold">{mockCase.acquisitionDate}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">AI Segmentation Model:</span>
                <span className="text-slate-200 font-bold">{mockCase.model}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Detection Confidence:</span>
                <span className="text-emerald-400 font-bold text-sm">{mockCase.confidence}%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Classification Label:</span>
                <span className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                  {mockCase.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleRunDetection}
                disabled={status === 'running'}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>RUN AI DETECTION</span>
              </button>

              <button
                onClick={handleReset}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESET</span>
              </button>
            </div>

            {/* Live Progress Simulation Banner */}
            {status === 'running' && (
              <div className="p-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-2 font-mono">
                <div className="flex items-center space-x-2 text-xs text-cyan-300 font-bold">
                  <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{currentStepText}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Completed Output & False Positive Analysis */}
            {status === 'complete' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono">
                      Detection Complete
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono">
                      Target slick segmented with 94% neural confidence score.
                    </p>
                  </div>
                </div>

                {/* False Positive Breakdown */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <PieChart className="w-4 h-4 text-cyan-400" />
                    <span>False Positive Analysis</span>
                  </div>

                  <div className="space-y-2">
                    {mockFalsePositives.map((item, i) => (
                      <div key={i} className="space-y-1 font-mono text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>{item.category}</span>
                          <span className="font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guided Step Navigation */}
      <StepNavigation
        prevStep={{ path: '/', label: 'Dashboard' }}
        nextStep={{ path: '/analysis', label: 'Spill Analysis' }}
      />
    </div>
  );
};
