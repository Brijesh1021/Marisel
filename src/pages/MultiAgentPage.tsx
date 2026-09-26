import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Scale, CheckCircle2, AlertCircle, Play, ServerCrash, Waves } from 'lucide-react';
import { mockCase, mockVessels } from '../data/mockData';

const Typewriter = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 2;
      if (i > text.length) {
        setDisplayed(text);
        clearInterval(interval);
      } else {
        setDisplayed(text.substring(0, i));
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  
  return <span>{displayed}<span className="animate-pulse bg-slate-400 w-1.5 h-3 inline-block ml-1 align-middle"></span></span>;
};

export const MultiAgentPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(3); // 0 = start, 1 = agent1, 2 = agent2, 3 = complete

  const runAgents = () => {
    setIsRunning(true);
    setStep(0);
    setTimeout(() => setStep(1), 2500);
    setTimeout(() => setStep(2), 5500);
    setTimeout(() => { setStep(3); setIsRunning(false); }, 8500);
  };

  const agents = [
    {
      id: 'metocean',
      name: 'Metocean Physics Agent',
      icon: Waves,
      role: 'Validates hydrodynamic constraints and drift physics.',
      status: step > 0 ? 'Validated' : 'Waiting',
      log: 'Forward simulation for Vessel A confirmed physically consistent. Plume mass balance within 5% error margin. Vessel B rejected due to 45° trajectory divergence from surface wind forcing.'
    },
    {
      id: 'vessel',
      name: 'Maritime Analytics Agent',
      icon: ServerCrash,
      role: 'Audits AIS integrity, speed curves, and route deviations.',
      status: step > 1 ? 'Validated (With Warnings)' : 'Waiting',
      log: 'Vessel A AIS track shows 2 intentional signal gaps correlating with peak spatial proximity to spill origin. Speed dropped from 11.4kts to 4.2kts for 40 minutes.'
    },
    {
      id: 'legal',
      name: 'Compliance & Legal Agent',
      icon: Scale,
      role: 'Cross-references MARPOL Annex I regulations.',
      status: step > 2 ? 'Validated' : 'Waiting',
      log: 'Discharge occurred within Special Area boundaries. Violation of zero-discharge rules. Evidence chain meets threshold for Port State Control inspection request.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Multi-Agent Evidence Validation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Autonomous specialized agents independently audit and challenge investigation hypotheses.
          </p>
        </div>
        <button 
          onClick={runAgents}
          disabled={isRunning}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition shadow-md disabled:opacity-50"
        >
          {isRunning ? <Bot className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Auditing...' : 'Run Agent Audit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Consensus Result Panel */}
        <div className="glass-panel p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Consensus Resolution</span>
            </h2>

            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${step === 3 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-100'}`}>
                  {step === 3 ? <CheckCircle2 className="w-12 h-12 text-emerald-600" /> : <Bot className={`w-12 h-12 text-slate-400 ${isRunning && 'animate-pulse'}`} />}
                </div>
                {step === 3 && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    96% CONF
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className={`text-xl font-bold ${step === 3 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {step === 3 ? 'Validation Complete' : isRunning ? 'Auditing Evidence...' : 'Awaiting Audit'}
                </div>
                <div className="text-xs text-slate-500 mt-2 max-w-[200px] font-mono">
                  {step === 3 ? 'All agents reached consensus on primary hypothesis (Vessel A).' : 'System ready for multi-agent adversarial audit.'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
            <div className="flex justify-between"><span>Hypothesis 1 (Vessel A):</span> <span className="text-emerald-600 font-bold">Corroborated</span></div>
            <div className="flex justify-between"><span>Hypothesis 2 (Vessel B):</span> <span className="text-rose-600 font-bold">Rejected</span></div>
            <div className="flex justify-between"><span>Hypothesis 3 (Vessel C):</span> <span className="text-rose-600 font-bold">Rejected</span></div>
          </div>
        </div>

        {/* Agent Logs */}
        <div className="lg:col-span-2 space-y-4">
          {agents.map((agent, idx) => (
            <div key={agent.id} className="glass-panel p-5 rounded-xl border border-slate-200 flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                step > idx ? (agent.status.includes('Warning') ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600') 
                : isRunning && step === idx ? 'bg-blue-50 text-blue-600 animate-pulse'
                : 'bg-slate-100 text-slate-400'
              }`}>
                <agent.icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-900">{agent.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border font-mono ${
                    step > idx ? (agent.status.includes('Warning') ? 'text-amber-700 border-amber-200 bg-amber-50' : 'text-emerald-700 border-emerald-200 bg-emerald-50')
                    : isRunning && step === idx ? 'text-blue-700 border-blue-200 bg-blue-50'
                    : 'text-slate-500 border-slate-200 bg-slate-100'
                  }`}>
                    {isRunning && step === idx ? 'Processing...' : agent.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-3">{agent.role}</div>
                
                <div className={`text-xs p-3 rounded-lg border font-mono ${
                  step > idx ? 'bg-white border-slate-200 text-slate-700' 
                  : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}>
                  <div className="flex space-x-2">
                    <span className={step > idx || (isRunning && step === idx) ? "text-blue-500 font-bold" : "text-slate-400 font-bold"}>&gt;</span>
                    <span>
                      {step < idx ? 'Awaiting initialization...' : 
                       step === idx && isRunning ? <Typewriter text={agent.log} /> : 
                       agent.log}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


