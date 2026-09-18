import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  prevStep?: { path: string; label: string };
  nextStep?: { path: string; label: string };
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ prevStep, nextStep }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
      {prevStep ? (
        <button
          onClick={() => navigate(prevStep.path)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded-lg text-sm font-medium transition group"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>← {prevStep.label}</span>
        </button>
      ) : (
        <div></div>
      )}

      {nextStep && (
        <button
          onClick={() => navigate(nextStep.path)}
          className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-cyan-950/40 transition group"
        >
          <span>{nextStep.label} →</span>
          <ChevronRight className="w-4 h-4 text-cyan-100 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
