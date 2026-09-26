import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Difficulty } from '../types/studyKit';

interface LoadingOverlayProps {
  difficulty: Difficulty;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ difficulty }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Scanning source material and analyzing key semantics...',
    'Extracting 3–5 core concepts & plain language summaries...',
    `Generating 3 exam questions calibrated for ${difficulty.toUpperCase()} difficulty...`,
    'Synthesizing 5–10 flashcards in clean JSON structure...',
    'Enforcing zero-hallucination source-only constraints...',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-8 text-center max-w-md mx-auto my-8 space-y-5">
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-75" />
        <div className="relative w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-base font-bold text-slate-900 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Building Your Study Kit
        </h4>
        <p className="text-xs text-slate-500">
          Grounded strictly in your uploaded material without hallucination.
        </p>
      </div>

      {/* Steps checklist */}
      <div className="space-y-2 text-left bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
        {steps.map((text, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-colors ${
                isDone
                  ? 'text-emerald-700 font-medium'
                  : isCurrent
                  ? 'text-indigo-700 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className="truncate">{text}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Strict source verification active • No external queries
      </div>
    </div>
  );
};
