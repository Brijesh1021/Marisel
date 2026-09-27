import React, { useState, useEffect } from 'react';
import { Bot, ShieldCheck, Scale, CheckCircle2, AlertCircle, Play, ServerCrash, Waves } from 'lucide-react';
import { mockCase, mockVessels } from '../data/mockData';

import { defaultAIAgentEngine } from '../engine/aiAgentEngine';

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
  
  return <span>{displayed}<span className="animate-pulse bg-current w-1.5 h-3.5 inline-block ml-1 align-middle"></span></span>;
};

export const MultiAgentPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState(3); // 0 = start, 1 = agent1, 2 = agent2, 3 = complete

  // Run live multi-agent adversarial audit engine
  const auditReport = defaultAIAgentEngine.runAdversarialAudit(
    mockVessels[0].name,
    mockVessels[0].score,
    mockVessels[0].signalGaps
  );

  const runAgents = () => {
    setIsRunning(true);
    setStep(0);
    setTimeout(() => setStep(1), 2000);
    setTimeout(() => setStep(2), 4000);
    setTimeout(() => { setStep(3); setIsRunning(false); }, 6000);
  };

  const agents = auditReport.steps.map((s, idx) => ({
    id: s.agentId,
    name: s.agentName,
    icon: s.agentId === 'metocean' ? Waves : s.agentId === 'vessel' ? ServerCrash : s.agentId === 'defense' ? ShieldCheck : Scale,
    role: s.role,
    status: step > idx ? s.status : 'Waiting',
    log: s.findings
  }));

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
                  {step === 3 ? `All agents reached consensus on primary hypothesis (${mockVessels[0].name.split(' (')[0]}).` : 'System ready for multi-agent adversarial audit.'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2 font-mono">
            <div className="flex justify-between items-center"><span className="truncate pr-2">H1 ({mockVessels[0].name.split(' (')[0]}):</span> <span className="text-emerald-600 font-bold flex-shrink-0">Corroborated</span></div>
            <div className="flex justify-between items-center"><span className="truncate pr-2">H2 ({mockVessels[1].name.split(' (')[0]}):</span> <span className="text-rose-600 font-bold flex-shrink-0">Rejected</span></div>
            <div className="flex justify-between items-center"><span className="truncate pr-2">H3 ({mockVessels[2].name.split(' (')[0]}):</span> <span className="text-rose-600 font-bold flex-shrink-0">Rejected</span></div>
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
                
                <div className={`text-xs p-4 rounded-lg border font-mono relative overflow-hidden transition-all duration-500 ${
                  step > idx ? 'bg-slate-900 border-slate-700 text-emerald-400 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]' 
                  : isRunning && step === idx ? 'bg-slate-900 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {/* Scanning beam effect when running */}
                  {isRunning && step === idx && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent h-[200%] w-full animate-[scan_2s_linear_infinite]" style={{
                      animationName: 'radar-scan'
                    }}>
                      <style>{`
                        @keyframes radar-scan {
                          0% { transform: translateY(-50%); }
                          100% { transform: translateY(0%); }
                        }
                      `}</style>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 relative z-10 leading-relaxed">
                    <span className={step > idx ? "text-emerald-500 font-bold" : isRunning && step === idx ? "text-blue-500 font-bold animate-pulse" : "text-slate-400 font-bold"}>&gt;</span>
                    <span className="flex-1">
                      {step < idx ? 'Awaiting initialization stream...' : 
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


