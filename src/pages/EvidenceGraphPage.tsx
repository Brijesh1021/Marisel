import React, { useCallback } from 'react';
import { Share2, FileText, Database, ShieldAlert, Waves, ServerCrash, Scale, MapPin, Scan, Anchor, Activity, Cpu } from 'lucide-react';
import ReactFlow, { Background, Controls, Edge, Node, MarkerType, useNodesState, useEdgesState, Handle, Position, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { mockVessels } from '../data/mockData';

// High-fidelity Custom Node styling
const CustomNode = ({ data }: any) => {
  const Icon = data.icon || Share2;
  
  return (
    <div className={`flex flex-col p-0 rounded-lg border-2 backdrop-blur-xl shadow-2xl transition-all duration-300 w-[240px] overflow-hidden ${data.styleClass}`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-none bg-blue-500 border-none -ml-[1px]" />
      <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 rounded-none bg-blue-500 border-none -mt-[1px]" />
      
      {/* Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between ${data.headerClass}`}>
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${data.isMain ? 'animate-pulse' : ''}`} />
          <span className="text-xs font-bold uppercase tracking-wider">{data.label}</span>
        </div>
        {data.score && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black/20 rounded">
            CONF {data.score}%
          </span>
        )}
      </div>

      {/* Body with realistic telemetry data */}
      <div className="p-3 text-[10px] font-mono space-y-1.5 leading-tight opacity-90">
        {data.telemetry?.map((line: string, i: number) => (
          <div key={i} className="flex justify-between border-b border-white/10 pb-1 last:border-0 last:pb-0">
            <span className="opacity-60">{line.split(':')[0]}:</span>
            <span className="font-semibold">{line.split(':')[1]}</span>
          </div>
        ))}
      </div>
      
      {/* Footer Status */}
      <div className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold flex items-center space-x-1 ${data.footerClass}`}>
        <Activity className="w-3 h-3" />
        <span>{data.status || 'Verified'}</span>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-none bg-blue-500 border-none -mr-[1px]" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 rounded-none bg-blue-500 border-none -mb-[1px]" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const EvidenceGraphPage: React.FC = () => {
  const culprit = mockVessels[0];

  const initialNodes: Node[] = [
    { 
      id: 'spill', type: 'custom', position: { x: 50, y: 250 }, 
      data: { 
        label: 'Spill SAR Detection', icon: Scan, score: 98,
        styleClass: 'bg-slate-900 border-slate-700 text-blue-100', headerClass: 'bg-slate-800 border-slate-700', footerClass: 'bg-blue-900/50 text-blue-300',
        telemetry: ['Sensor: Sentinel-1', 'Area: 42.5 km²', 'Pol: VV/VH', 'Lat/Lng: 13.20N, 80.35E']
      } 
    },
    { 
      id: 'origin', type: 'custom', position: { x: 400, y: 250 }, 
      data: { 
        label: 'Lagrangian Origin', icon: MapPin, score: 94,
        styleClass: 'bg-slate-900 border-indigo-500/50 text-indigo-100', headerClass: 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300', footerClass: 'bg-indigo-900/20 text-indigo-400',
        telemetry: ['Model: OpenDrift', 'Hindcast: -8.5 hrs', 'Particles: 10,000', 'Centroid: 13.15N, 80.33E']
      } 
    },
    { 
      id: 'weather', type: 'custom', position: { x: 50, y: 50 }, 
      data: { 
        label: 'Metocean Forcing', icon: Waves, status: 'Live Feed',
        styleClass: 'bg-slate-900 border-slate-700 text-amber-100', headerClass: 'bg-slate-800 border-slate-700', footerClass: 'bg-amber-900/30 text-amber-400',
        telemetry: ['Wind: 12.5kts NE', 'Current: 0.4m/s SW', 'Sea State: Moderate', 'Source: INCOIS']
      } 
    },
    { 
      id: 'ais', type: 'custom', position: { x: 400, y: 500 }, 
      data: { 
        label: 'AIS Integrity', icon: ServerCrash, score: 99,
        styleClass: 'bg-slate-900 border-rose-500/50 text-rose-100', headerClass: 'bg-rose-900/40 border-rose-500/50 text-rose-300', footerClass: 'bg-rose-900/20 text-rose-400',
        telemetry: ['Rx Loss: 45 mins', 'Intl Gap: True', 'Spoofing: Negative', 'Speed Delta: -7.2 kts']
      } 
    },
    { 
      id: 'vessel_a', type: 'custom', position: { x: 800, y: 350 }, 
      data: { 
        label: culprit.name.split(' (')[0], icon: Anchor, score: 98, isMain: true,
        styleClass: 'bg-emerald-950/80 border-emerald-500 text-emerald-50 ring-4 ring-emerald-500/20', headerClass: 'bg-emerald-900 border-emerald-700', footerClass: 'bg-emerald-800 text-emerald-200',
        telemetry: ['IMO: 9340623', 'Type: Oil Tanker', `Length: ${culprit.length}m`, `Heading: ${culprit.heading}°`]
      } 
    },
    { 
      id: 'sim', type: 'custom', position: { x: 800, y: 50 }, 
      data: { 
        label: 'Forward Physics Sim', icon: Cpu, score: 92,
        styleClass: 'bg-slate-900 border-slate-700 text-blue-100', headerClass: 'bg-slate-800 border-slate-700', footerClass: 'bg-blue-900/50 text-blue-300',
        telemetry: ['Engine: Lagrangian', 'Intersection: 92%', 'Evaporation: 65%', 'Mass Balance: Stable']
      } 
    },
    { 
      id: 'conclusion', type: 'custom', position: { x: 1200, y: 250 }, 
      data: { 
        label: 'Guilty Attribution', icon: ShieldAlert, score: 96, isMain: true, status: 'Actionable Intelligence',
        styleClass: 'bg-purple-950 border-purple-400 text-purple-50 shadow-[0_0_30px_rgba(168,85,247,0.4)] ring-4 ring-purple-500/30', headerClass: 'bg-purple-900 border-purple-500 text-white', footerClass: 'bg-purple-800 text-purple-200',
        telemetry: ['Legal Std: Beyond Doubt', 'Fines Est: $14.2M', 'Agent Consensus: 4/4', 'Status: Indicted']
      } 
    },
  ];

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#475569', strokeWidth: 2, opacity: 0.6 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
    labelStyle: { fill: '#94a3b8', fontWeight: 700, fontSize: 10, fontFamily: 'monospace' },
    labelBgStyle: { fill: '#0f172a', stroke: '#334155' },
    labelBgPadding: [8, 4] as [number, number],
    labelBgBorderRadius: 4,
  };

  const initialEdges: Edge[] = [
    { id: 'e1', source: 'spill', target: 'origin', label: 'HINDCAST_VECT', ...defaultEdgeOptions, sourceHandle: 'bottom', targetHandle: 'top' },
    { id: 'e2', source: 'weather', target: 'origin', label: 'WIND_FORCE', ...defaultEdgeOptions },
    { id: 'e3', source: 'weather', target: 'sim', label: 'SURFACE_CURR', ...defaultEdgeOptions },
    { id: 'e4', source: 'origin', target: 'vessel_a', label: 'SPATIAL_LOCK', ...defaultEdgeOptions, style: { stroke: '#10b981', strokeWidth: 2, opacity: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
    { id: 'e5', source: 'ais', target: 'vessel_a', label: 'ALIBI_FAIL', ...defaultEdgeOptions, style: { stroke: '#f43f5e', strokeWidth: 2, opacity: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
    { id: 'e6', source: 'vessel_a', target: 'sim', label: 'SEED_COORD', ...defaultEdgeOptions, targetHandle: 'bottom' },
    { id: 'e7', source: 'sim', target: 'conclusion', label: 'PHYS_MATCH', ...defaultEdgeOptions, style: { stroke: '#a855f7', strokeWidth: 2, opacity: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e8', source: 'vessel_a', target: 'conclusion', label: 'PRIMARY_TGT', ...defaultEdgeOptions, style: { stroke: '#a855f7', strokeWidth: 3, opacity: 1 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Intelligence Fusion Engine</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-dimensional knowledge graph aggregating physics, satellite, and AIS intelligence.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 h-[700px] relative overflow-hidden bg-[#0a0f18] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.2}
          maxZoom={1.5}
          className="fusion-graph-dark"
        >
          {/* Tactical grid background */}
          <Background color="#1e293b" gap={30} size={2} variant={BackgroundVariant.Cross} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-300" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};
