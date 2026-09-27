import React, { useState } from 'react';
import { HelpCircle, Check, AlertTriangle, AlertCircle, X, Scale, Target, Radar as RadarIcon } from 'lucide-react';
import { mockVessels } from '../data/mockData';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export const HypothesesPage: React.FC = () => {
  const [selectedHypotheses, setSelectedHypotheses] = useState<string[]>(['h1', 'h2']);

  const toggleHypothesis = (id: string) => {
    setSelectedHypotheses(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const hypotheses = [
    {
      id: 'h1',
      title: `H1 — ${mockVessels[0].name}`,
      status: 'Strong Evidence Support',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      originComp: 'High',
      aisConsist: 'High',
      behaviour: 'Anomalous (Drifting/Gaps)',
      simConsist: 'High',
      supporting: [
        'Temporal compatibility within peak release window',
        'Origin compatibility (intersects uncertainty zone)',
        'Behaviour evidence (erratic drifting post 22:15 UTC)',
        'Simulation physical consistency'
      ],
      conflicting: [
        'Minor AIS signal gaps'
      ],
      uncertainty: 'Low',
      radarData: [
        { subject: 'Origin', score: 95 },
        { subject: 'AIS', score: 85 },
        { subject: 'Behaviour', score: 98 },
        { subject: 'Simulation', score: 92 }
      ]
    },
    {
      id: 'h2',
      title: `H2 — ${mockVessels[1].name}`,
      status: 'Moderate Evidence Support',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      originComp: 'Moderate',
      aisConsist: 'High',
      behaviour: 'Normal',
      simConsist: 'Moderate',
      supporting: [
        'Temporal compatibility (passed during release window)',
        'Continuous AIS coverage'
      ],
      conflicting: [
        'Origin proximity is peripheral to main zone',
        'Simulated slick shows drift divergence'
      ],
      uncertainty: 'Moderate',
      radarData: [
        { subject: 'Origin', score: 60 },
        { subject: 'AIS', score: 90 },
        { subject: 'Behaviour', score: 40 },
        { subject: 'Simulation', score: 55 }
      ]
    },
    {
      id: 'h3',
      title: `H3 — ${mockVessels[2].name}`,
      status: 'Limited Evidence Support',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      originComp: 'Low',
      aisConsist: 'Moderate',
      behaviour: 'Normal',
      simConsist: 'Low',
      supporting: [
        'Passed within 8km of probable origin'
      ],
      conflicting: [
        'High speed transit minimizes dwell time',
        'Temporal window only partially overlaps',
        'No trajectory intersection with origin centroid'
      ],
      uncertainty: 'High',
      radarData: [
        { subject: 'Origin', score: 20 },
        { subject: 'AIS', score: 70 },
        { subject: 'Behaviour', score: 10 },
        { subject: 'Simulation', score: 15 }
      ]
    },
    {
      id: 'h4',
      title: 'H4 — Natural / Unknown Source',
      status: 'Insufficient Evidence',
      statusColor: 'text-slate-700 bg-slate-100 border-slate-200',
      originComp: 'N/A',
      aisConsist: 'N/A',
      behaviour: 'N/A',
      simConsist: 'N/A',
      supporting: [],
      conflicting: [
        'No known natural seeps in the Ennore sector',
        'Spill fingerprint matches heavy fuel oil/crude (anthropogenic)'
      ],
      uncertainty: 'Very High'
    }
  ];

  // Helper to get radar color
  const getRadarColor = (status: string) => {
    if (status.includes('Strong')) return '#10b981';
    if (status.includes('Moderate')) return '#f59e0b';
    if (status.includes('Limited')) return '#f43f5e';
    return '#94a3b8';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rule Pre-filter (Competing Hypotheses)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare evidence-based attribution hypotheses from the Ennore incident.
          </p>
        </div>
        <button 
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition border border-slate-200 shadow-sm"
          disabled={selectedHypotheses.length < 2}
        >
          <Scale className="w-4 h-4" />
          <span>Compare Selected ({selectedHypotheses.length})</span>
        </button>
      </div>

      {/* Grid of Hypotheses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hypotheses.map(hyp => {
          const isSelected = selectedHypotheses.includes(hyp.id);
          
          return (
            <div 
              key={hyp.id} 
              className={`glass-panel p-6 rounded-xl border transition-all cursor-pointer ${
                isSelected ? 'border-blue-400 shadow-md bg-blue-50/30' : 'border-slate-200 hover:border-blue-200 bg-white'
              }`}
              onClick={() => toggleHypothesis(hyp.id)}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-300 text-transparent'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="font-bold text-base text-slate-900">{hyp.title}</h2>
                  </div>
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${hyp.statusColor}`}>
                    {hyp.status === 'Strong Evidence Support' && <Check className="w-3 h-3" />}
                    {hyp.status === 'Moderate Evidence Support' && <AlertCircle className="w-3 h-3" />}
                    {hyp.status === 'Limited Evidence Support' && <AlertTriangle className="w-3 h-3" />}
                    {hyp.status === 'Insufficient Evidence' && <X className="w-3 h-3" />}
                    <span>{hyp.status}</span>
                  </span>
                </div>
              </div>

              {/* Card Metrics Grid & Radar */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                
                {/* Radar Chart */}
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center bg-slate-900/5 rounded-xl border border-slate-200/60 p-2 relative">
                  <div className="absolute top-2 left-2 flex items-center space-x-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    <RadarIcon className="w-3 h-3" />
                    <span>Match Fingerprint</span>
                  </div>
                  <div className="h-40 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="65%" data={hyp.radarData}>
                        <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} />
                        <Radar 
                          name="Match Score" 
                          dataKey="score" 
                          stroke={getRadarColor(hyp.status)} 
                          strokeWidth={2}
                          fill={getRadarColor(hyp.status)} 
                          fillOpacity={0.35} 
                          isAnimationActive={true}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Blocks */}
                <div className="w-full md:w-2/3 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 flex flex-col justify-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Origin Compatibility</div>
                    <div className={`font-semibold text-sm ${hyp.originComp === 'High' ? 'text-emerald-600' : hyp.originComp === 'Moderate' ? 'text-amber-600' : hyp.originComp === 'Low' ? 'text-rose-600' : 'text-slate-500'}`}>
                      {hyp.originComp}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 flex flex-col justify-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">AIS Consistency</div>
                    <div className={`font-semibold text-sm ${hyp.aisConsist === 'High' ? 'text-emerald-600' : hyp.aisConsist === 'Moderate' ? 'text-amber-600' : 'text-slate-500'}`}>
                      {hyp.aisConsist}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 flex flex-col justify-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Behaviour Evidence</div>
                    <div className={`font-semibold text-sm truncate ${hyp.behaviour.includes('Anomalous') ? 'text-amber-600' : hyp.behaviour === 'Normal' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {hyp.behaviour}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 flex flex-col justify-center">
                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Simulation Consistency</div>
                    <div className={`font-semibold text-sm ${hyp.simConsist === 'High' ? 'text-emerald-600' : hyp.simConsist === 'Moderate' ? 'text-amber-600' : hyp.simConsist === 'Low' ? 'text-rose-600' : 'text-slate-500'}`}>
                      {hyp.simConsist}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supporting / Conflicting */}
              <div className="space-y-4 text-xs bg-white p-4 rounded-xl border border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                <div>
                  <h4 className="font-semibold text-emerald-600 flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4" />
                    <span>Supporting Evidence</span>
                  </h4>
                  {hyp.supporting.length > 0 ? (
                    <ul className="space-y-1.5 pl-6 list-disc text-slate-700">
                      {hyp.supporting.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="pl-6 text-slate-400 italic">None identified</div>
                  )}
                </div>
                
                {hyp.conflicting.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="font-semibold text-amber-600 flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4" />
                      <span>Conflicting Evidence / Uncertainty</span>
                    </h4>
                    <ul className="space-y-1.5 pl-6 list-disc text-slate-700">
                      {hyp.conflicting.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
