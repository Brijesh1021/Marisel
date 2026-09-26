import React, { useState, useCallback } from 'react';
import { Share2, FileText, Database, ShieldAlert, Waves, ServerCrash, Scale, MapPin, Scan, Anchor } from 'lucide-react';
import ReactFlow, { Background, Controls, Edge, Node, MarkerType, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node styling based on type
const CustomNode = ({ data, type }: any) => {
  const Icon = data.icon || Share2;
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 backdrop-blur-md w-[160px] shadow-lg transition-transform hover:scale-105 ${data.styleClass}`}>
      <Icon className="w-6 h-6 mb-2 opacity-80" />
      <div className="text-xs font-bold text-center leading-tight">{data.label}</div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const EvidenceGraphPage: React.FC = () => {
  
  const initialNodes: Node[] = [
    { id: 'spill', type: 'custom', position: { x: 50, y: 150 }, data: { label: 'Spill Detection', icon: Scan, styleClass: 'bg-blue-50 border-blue-400 text-blue-800' } },
    { id: 'origin', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'Probable Origin', icon: MapPin, styleClass: 'bg-indigo-50 border-indigo-400 text-indigo-800' } },
    { id: 'weather', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'Metocean Data', icon: Waves, styleClass: 'bg-amber-50 border-amber-400 text-amber-800' } },
    { id: 'ais', type: 'custom', position: { x: 300, y: 300 }, data: { label: 'AIS Anomalies', icon: ServerCrash, styleClass: 'bg-rose-50 border-rose-400 text-rose-800' } },
    { id: 'vessel_a', type: 'custom', position: { x: 600, y: 250 }, data: { label: 'Vessel A (Candidate)', icon: Anchor, styleClass: 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm' } },
    { id: 'sim', type: 'custom', position: { x: 600, y: 50 }, data: { label: 'Forward Sim', icon: Share2, styleClass: 'bg-blue-50 border-blue-400 text-blue-800' } },
    { id: 'conclusion', type: 'custom', position: { x: 900, y: 150 }, data: { label: 'Attribution', icon: ShieldAlert, styleClass: 'bg-purple-50 border-purple-500 text-purple-800 shadow-md' } },
  ];

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    labelStyle: { fill: '#64748b', fontWeight: 700, fontSize: 10 },
    labelBgStyle: { fill: '#ffffff', stroke: '#e2e8f0' },
    labelBgPadding: [8, 4] as [number, number],
    labelBgBorderRadius: 4,
  };

  const initialEdges: Edge[] = [
    { id: 'e1', source: 'spill', target: 'origin', label: 'Hindcast Drift', ...defaultEdgeOptions },
    { id: 'e2', source: 'weather', target: 'origin', label: 'Forces', ...defaultEdgeOptions },
    { id: 'e3', source: 'weather', target: 'sim', label: 'Forces', ...defaultEdgeOptions },
    { id: 'e4', source: 'origin', target: 'vessel_a', label: 'Spatial Intersect', ...defaultEdgeOptions, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
    { id: 'e5', source: 'ais', target: 'vessel_a', label: 'Correlates', ...defaultEdgeOptions, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
    { id: 'e6', source: 'vessel_a', target: 'sim', label: 'Seed', ...defaultEdgeOptions },
    { id: 'e7', source: 'sim', target: 'conclusion', label: 'Supports (92%)', ...defaultEdgeOptions, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e8', source: 'vessel_a', target: 'conclusion', label: 'Primary Candidate', ...defaultEdgeOptions, style: { stroke: '#10b981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Evidence Fusion Graph</h1>
          <p className="text-sm text-slate-500 mt-1">
            Knowledge graph linking physical, temporal, and behavioural evidence.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-slate-200 h-[650px] relative overflow-hidden bg-slate-50 shadow-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          className="bg-slate-50"
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls className="bg-white border-slate-200 fill-slate-500" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};
