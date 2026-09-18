import React from 'react';
import { Scan, Eye, Activity } from 'lucide-react';

interface SARImageViewerProps {
  isScanning?: boolean;
  scanProgress?: number;
  showDetectionOverlay?: boolean;
}

export const SARImageViewer: React.FC<SARImageViewerProps> = ({
  isScanning = false,
  scanProgress = 0,
  showDetectionOverlay = true
}) => {
  return (
    <div className="relative w-full h-[450px] bg-[#060a17] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between select-none">
      {/* Top Overlay HUD Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-gradient-to-b from-[#060a17]/90 to-transparent flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-cyan-300 font-bold">SENTINEL-1 SAR [C-BAND]</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>MODE: IW_GRDH</span>
          <span>POL: VV+VH</span>
          <span>RES: 10m</span>
        </div>
      </div>

      {/* Synthetic SAR Image Visual Canvas */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-slate-950 via-[#0b1424] to-slate-900">
        {/* Radar Grain & Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px'
          }}
        />

        {/* Oil Slick Polygon Visual Representation on SAR */}
        {showDetectionOverlay && (
          <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <defs>
              <linearGradient id="slickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Dark Low-Backscatter SAR Slick Body */}
            <path
              d="M 180 140 Q 260 110 340 160 T 480 210 T 520 280 T 410 340 T 260 310 T 170 230 Z"
              fill="url(#slickGradient)"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4, 4"
              className="animate-pulse-subtle"
            />

            {/* Polygon Nodes */}
            <circle cx="180" cy="140" r="4" fill="#38bdf8" />
            <circle cx="340" cy="160" r="4" fill="#38bdf8" />
            <circle cx="480" cy="210" r="4" fill="#38bdf8" />
            <circle cx="520" cy="280" r="4" fill="#38bdf8" />
            <circle cx="410" cy="340" r="4" fill="#38bdf8" />
            <circle cx="260" cy="310" r="4" fill="#38bdf8" />
          </svg>
        )}

        {/* Scanning Sweep Line Animation */}
        {isScanning && (
          <div 
            className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_20px_#06b6d4] transition-all duration-300"
            style={{ top: `${scanProgress}%` }}
          />
        )}

        {/* HUD Crosshairs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
          <div className="w-24 h-24 border border-cyan-500/50 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom HUD Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-3 bg-gradient-to-t from-[#060a17]/95 to-transparent flex items-center justify-between text-xs font-mono text-slate-300 border-t border-slate-800/50">
        <div className="flex items-center space-x-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>LAT: 13.405° N</span>
          <span>LON: 80.145° E</span>
        </div>
        <div className="flex items-center space-x-2 text-cyan-300">
          <Scan className="w-3.5 h-3.5" />
          <span>AI SEGMENTATION: U-NET ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
