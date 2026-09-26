import React, { useState } from 'react';
import { PracticeQuestions, Difficulty } from '../types/studyKit';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  FileQuestion,
  Compass,
  Eye,
  EyeOff,
  RotateCcw,
  CheckSquare,
  Square,
  Award,
} from 'lucide-react';

interface PracticeQuestionsViewProps {
  questions: PracticeQuestions;
  difficulty: Difficulty;
}

export const PracticeQuestionsView: React.FC<PracticeQuestionsViewProps> = ({
  questions,
  difficulty,
}) => {
  // MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Short Answer state
  const [studentShortAnswer, setStudentShortAnswer] = useState<string>('');
  const [showSampleShortAnswer, setShowSampleShortAnswer] = useState<boolean>(false);
  const [checkedRubrics, setCheckedRubrics] = useState<Record<number, boolean>>({});

  // Conceptual Application state
  const [studentApplicationAnswer, setStudentApplicationAnswer] = useState<string>('');
  const [showApplicationAnswer, setShowApplicationAnswer] = useState<boolean>(false);

  const { mcq, shortAnswer, conceptualApplication } = questions;

  const handleOptionClick = (index: number) => {
    if (mcqSubmitted) return;
    setSelectedOption(index);
  };

  const checkMcqAnswer = () => {
    if (selectedOption === null) return;
    setMcqSubmitted(true);
  };

  const resetMcq = () => {
    setSelectedOption(null);
    setMcqSubmitted(false);
  };

  const toggleRubric = (index: number) => {
    setCheckedRubrics((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const difficultyBadge = {
    easy: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Easy Level' },
    medium: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Medium Level' },
    hard: { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Hard Level' },
  }[difficulty];

  const isMcqCorrect = mcqSubmitted && selectedOption === mcq.correctOptionIndex;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              #2
            </span>
            Practice Exam Questions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            3 distinct question formats grounded strictly in source material.
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${difficultyBadge.color}`}>
          {difficultyBadge.label}
        </span>
      </div>

      <div className="space-y-5">
        {/* ================= Question 1: Multiple Choice Question (MCQ) ================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wide">
                Question 1 • MCQ
              </span>
              <span className="text-xs text-slate-400 font-medium">Single Best Answer</span>
            </div>
            {mcqSubmitted && (
              <button
                type="button"
                onClick={resetMcq}
                className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-4">
            {mcq.question}
          </h4>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {mcq.options.map((option, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const isSelected = selectedOption === idx;
              const isCorrect = idx === mcq.correctOptionIndex;

              let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';
              let badgeStyle = 'bg-slate-100 text-slate-600';

              if (mcqSubmitted) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500 font-medium';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-400 bg-rose-50/70 text-rose-900 ring-1 ring-rose-400';
                  badgeStyle = 'bg-rose-600 text-white';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                  badgeStyle = 'bg-slate-200 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-1 ring-indigo-600 font-medium';
                badgeStyle = 'bg-indigo-600 text-white';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionClick(idx)}
                  disabled={mcqSubmitted}
                  className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all text-xs leading-relaxed ${optionStyle}`}
                >
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${badgeStyle}`}
                  >
                    {optionLetters[idx]}
                  </span>
                  <span className="flex-1">{option}</span>
                  {mcqSubmitted && isCorrect && (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {mcqSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action & Feedback */}
          {!mcqSubmitted ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={checkMcqAnswer}
                disabled={selectedOption === null}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedOption === null
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Check Answer
              </button>
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                isMcqCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {isMcqCorrect ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Correct! Option {['A', 'B', 'C', 'D'][mcq.correctOptionIndex]} is the right answer.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect. The correct answer is Option {['A', 'B', 'C', 'D'][mcq.correctOptionIndex]}.</span>
                  </>
                )}
              </div>
              <p className="text-slate-700 mt-1 leading-relaxed">
                <span className="font-semibold text-slate-900">Explanation: </span>
                {mcq.explanation}
              </p>
            </div>
          )}
        </div>

        {/* ================= Question 2: Short Answer Question ================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                Question 2 • Short Answer
              </span>
              <span className="text-xs text-slate-400 font-medium">Constructed Response</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-3">
            {shortAnswer.question}
          </h4>

          {/* Student scratchpad */}
          <div className="space-y-2 mb-3">
            <textarea
              rows={3}
              value={studentShortAnswer}
              onChange={(e) => setStudentShortAnswer(e.target.value)}
              placeholder="Draft your answer here to test your recall before revealing the model answer..."
              className="w-full p-3 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-hidden text-slate-800 placeholder-slate-400 leading-relaxed resize-y"
            />
          </div>

          {/* Toggle Model Answer Button */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Try answering independently first for optimal retention
            </span>
            <button
              type="button"
              onClick={() => setShowSampleShortAnswer(!showSampleShortAnswer)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5 transition-colors"
            >
              {showSampleShortAnswer ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide Sample Answer
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Reveal High-Scoring Answer
                </>
              )}
            </button>
          </div>

          {/* Sample Answer & Self-Scoring Rubric */}
          {showSampleShortAnswer && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Sample High-Scoring Answer</span>
              </div>
              <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-amber-100 font-serif text-[13px]">
                "{shortAnswer.sampleAnswer}"
              </p>

              {shortAnswer.keyPointsToInclude && shortAnswer.keyPointsToInclude.length > 0 && (
                <div className="pt-2 border-t border-amber-200/50">
                  <span className="font-semibold text-slate-800 block mb-1.5">
                    Self-Evaluation Checklist (Tick what you included):
                  </span>
                  <div className="space-y-1.5">
                    {shortAnswer.keyPointsToInclude.map((point, pIdx) => {
                      const isChecked = !!checkedRubrics[pIdx];
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => toggleRubric(pIdx)}
                          className="w-full text-left flex items-start gap-2 text-slate-700 hover:text-slate-900 cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className={isChecked ? 'line-through text-slate-400' : ''}>
                            {point}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= Question 3: Conceptual Application Question ================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                Question 3 • Conceptual Application
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-World Transfer</span>
            </div>
          </div>

          {/* Scenario Callout */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs mb-3">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Real-World Scenario</span>
            </div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {conceptualApplication.scenario}
            </p>
          </div>

          <h4 className="text-sm font-semibold text-slate-900 leading-snug mb-3">
            {conceptualApplication.question}
          </h4>

          {/* Student scratchpad */}
          <div className="space-y-2 mb-3">
            <textarea
              rows={3}
              value={studentApplicationAnswer}
              onChange={(e) => setStudentApplicationAnswer(e.target.value)}
              placeholder="How would you apply the concept to analyze or solve this scenario?..."
              className="w-full p-3 text-xs bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden text-slate-800 placeholder-slate-400 leading-relaxed resize-y"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Evaluates synthesis and practical application of the material
            </span>
            <button
              type="button"
              onClick={() => setShowApplicationAnswer(!showApplicationAnswer)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1.5 transition-colors"
            >
              {showApplicationAnswer ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide Guided Application
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Reveal Guided Application
                </>
              )}
            </button>
          </div>

          {showApplicationAnswer && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <FileQuestion className="w-4 h-4 text-blue-600" />
                <span>Expert Guided Conceptual Analysis</span>
              </div>
              <p className="text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-blue-100 leading-relaxed">
                {conceptualApplication.guidedApplication}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
