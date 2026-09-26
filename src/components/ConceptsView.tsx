import React, { useState } from 'react';
import { KeyConcept } from '../types/studyKit';
import { Lightbulb, Copy, Check, Sparkles } from 'lucide-react';

interface ConceptsViewProps {
  concepts: KeyConcept[];
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({ concepts }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (concept: KeyConcept, index: number) => {
    const text = `${concept.title}\n${concept.explanation}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              #1
            </span>
            Key Concepts & Summaries
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {concepts.length} core concepts extracted directly from source material, explained in plain language.
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {concepts.length} Concepts
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="group relative bg-white border border-slate-200/90 rounded-xl p-4 hover:border-indigo-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-sm tracking-tight">
                    {concept.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(concept, index)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity p-1 rounded-md hover:bg-slate-50"
                  title="Copy concept"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {concept.explanation}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                Core Takeaway
              </span>
              <span>2–3 sentences</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
