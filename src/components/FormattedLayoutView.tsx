import React, { useState } from 'react';
import { StudyKitData } from '../types/studyKit';
import { Copy, Check, FileCode, Download } from 'lucide-react';

interface FormattedLayoutViewProps {
  data: StudyKitData;
}

export const FormattedLayoutView: React.FC<FormattedLayoutViewProps> = ({ data }) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Construct the clean Markdown layout if formattedLayoutText is provided or reconstruct it accurately
  const flashcardsJson = JSON.stringify(data.flashcards, null, 2);

  const fullMarkdownOutput = `# Study Kit: ${data.materialTitle}
Difficulty: ${data.difficulty.toUpperCase()}
Generated on: ${new Date(data.generatedAt).toLocaleDateString()}

#1. Key Concepts & Summaries
${data.keyConcepts
  .map(
    (c, i) =>
      `Concept ${i + 1}: ${c.title}\n${c.explanation}`
  )
  .join('\n\n')}

#2. Practice Exam Questions
"Multiple Choice Question (MCQ)":
Question: ${data.practiceQuestions.mcq.question}
Options:
${data.practiceQuestions.mcq.options.map((opt, i) => `  ${['A', 'B', 'C', 'D'][i]}) ${opt}`).join('\n')}
Correct Answer: Option ${['A', 'B', 'C', 'D'][data.practiceQuestions.mcq.correctOptionIndex]}
Explanation: ${data.practiceQuestions.mcq.explanation}

"Short Answer Question":
Question: ${data.practiceQuestions.shortAnswer.question}
Sample High-Scoring Answer: ${data.practiceQuestions.shortAnswer.sampleAnswer}
${
  data.practiceQuestions.shortAnswer.keyPointsToInclude?.length
    ? `Key Rubric Points:\n${data.practiceQuestions.shortAnswer.keyPointsToInclude
        .map((p) => `  - ${p}`)
        .join('\n')}`
    : ''
}

"Conceptual Application Question":
Scenario: ${data.practiceQuestions.conceptualApplication.scenario}
Question: ${data.practiceQuestions.conceptualApplication.question}
Guided Application: ${data.practiceQuestions.conceptualApplication.guidedApplication}

#3. Flashcard Set (JSON Format)
${flashcardsJson}
`;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(fullMarkdownOutput);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyJsonOnly = () => {
    navigator.clipboard.writeText(flashcardsJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullMarkdownOutput], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `study-kit-${data.materialTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-indigo-600" />
            Standard Layout Document
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly formatted following the required #1, #2, #3 layout structure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyJsonOnly}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">JSON Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON Set</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Full Document!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Styled Rendered Layout */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner space-y-6 leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="text-indigo-400 font-bold text-sm tracking-wide border-b border-slate-800 pb-1">
            #1. Key Concepts & Summaries
          </div>
          <div className="space-y-3 pl-2 text-slate-300">
            {data.keyConcepts.map((concept, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-emerald-400 font-semibold">
                  Concept {idx + 1}: {concept.title}
                </span>
                <p className="text-slate-300 pl-4">{concept.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <div className="text-indigo-400 font-bold text-sm tracking-wide border-b border-slate-800 pb-1">
            #2. Practice Exam Questions
          </div>
          <div className="space-y-4 pl-2 text-slate-300">
            {/* MCQ */}
            <div className="space-y-1">
              <span className="text-amber-300 font-semibold block">
                "Multiple Choice Question (MCQ)":
              </span>
              <p className="text-white font-medium pl-4">{data.practiceQuestions.mcq.question}</p>
              <div className="pl-4 space-y-0.5 text-slate-400">
                {data.practiceQuestions.mcq.options.map((opt, i) => (
                  <div key={i} className={i === data.practiceQuestions.mcq.correctOptionIndex ? 'text-emerald-400 font-semibold' : ''}>
                    {['A', 'B', 'C', 'D'][i]}) {opt}
                  </div>
                ))}
              </div>
              <div className="pl-4 pt-1 text-slate-400">
                <span className="text-emerald-400 font-semibold">
                  Correct Answer: Option {['A', 'B', 'C', 'D'][data.practiceQuestions.mcq.correctOptionIndex]}
                </span>
                <p className="text-slate-400">Explanation: {data.practiceQuestions.mcq.explanation}</p>
              </div>
            </div>

            {/* Short Answer */}
            <div className="space-y-1">
              <span className="text-amber-300 font-semibold block">
                "Short Answer Question":
              </span>
              <p className="text-white font-medium pl-4">{data.practiceQuestions.shortAnswer.question}</p>
              <div className="pl-4 text-slate-400">
                <span className="text-indigo-300 font-semibold">Sample High-Scoring Answer: </span>
                <p className="text-slate-300 italic">{data.practiceQuestions.shortAnswer.sampleAnswer}</p>
              </div>
            </div>

            {/* Conceptual Application */}
            <div className="space-y-1">
              <span className="text-amber-300 font-semibold block">
                "Conceptual Application Question":
              </span>
              <p className="text-slate-400 pl-4">
                <span className="text-slate-200 font-semibold">Scenario: </span>
                {data.practiceQuestions.conceptualApplication.scenario}
              </p>
              <p className="text-white font-medium pl-4">
                <span className="text-slate-200 font-semibold">Question: </span>
                {data.practiceQuestions.conceptualApplication.question}
              </p>
              <p className="text-slate-400 pl-4">
                <span className="text-indigo-300 font-semibold">Guided Application: </span>
                {data.practiceQuestions.conceptualApplication.guidedApplication}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <div className="text-indigo-400 font-bold text-sm tracking-wide border-b border-slate-800 pb-1">
            #3. Flashcard Set (JSON Format)
          </div>
          <pre className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
            {flashcardsJson}
          </pre>
        </div>
      </div>
    </div>
  );
};
