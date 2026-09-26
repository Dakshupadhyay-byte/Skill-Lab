import React, { useState } from 'react';
import { Header } from './components/Header';
import { MaterialInput } from './components/MaterialInput';
import { ConceptsView } from './components/ConceptsView';
import { PracticeQuestionsView } from './components/PracticeQuestionsView';
import { FlashcardsView } from './components/FlashcardsView';
import { FormattedLayoutView } from './components/FormattedLayoutView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { StudyKitData, Difficulty } from './types/studyKit';
import {
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  FileCode,
  ArrowLeft,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export default function App() {
  const [studyKit, setStudyKit] = useState<StudyKitData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [activeTab, setActiveTab] = useState<'interactive' | 'layout' | 'json'>('interactive');

  // Cache last input for easy re-generating across difficulty levels
  const [lastInput, setLastInput] = useState<{
    text: string;
    image?: { data: string; mimeType: string };
  } | null>(null);

  const handleGenerate = async ({
    text,
    image,
    difficulty,
  }: {
    text: string;
    image?: { data: string; mimeType: string };
    difficulty: Difficulty;
  }) => {
    setIsLoading(true);
    setError(null);
    setLastInput({ text, image });

    try {
      const response = await fetch('/api/study-kit/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          image,
          difficulty,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study kit');
      }

      if (data.data) {
        setStudyKit(data.data);
      } else {
        throw new Error('Malformed server response format.');
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while parsing your study material.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultyChange = (newDiff: Difficulty) => {
    setSelectedDifficulty(newDiff);
    // If we already have input and a kit, prompt or allow re-generating with 1 click
  };

  const handleRegenerateWithDifficulty = (newDiff: Difficulty) => {
    setSelectedDifficulty(newDiff);
    if (lastInput) {
      handleGenerate({
        text: lastInput.text,
        image: lastInput.image,
        difficulty: newDiff,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-800">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start justify-between gap-3 text-sm shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900">Failed to generate study kit</p>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-semibold px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading state indicator */}
        {isLoading && <LoadingOverlay difficulty={selectedDifficulty} />}

        {/* If no kit is generated yet, show input form */}
        {!studyKit && !isLoading && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 py-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Zero-Hallucination Academic Prep
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Turn Raw Notes Into an Exam Study Kit
              </h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                Paste lecture notes or upload a document photo. Your AI tutor will extract 3–5 core
                concepts, generate 3 practice questions with sample answers, and build an interactive
                flashcard set.
              </p>
            </div>

            <MaterialInput
              onGenerate={handleGenerate}
              isLoading={isLoading}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={handleDifficultyChange}
            />
          </div>
        )}

        {/* If kit is generated, show the rich kit dashboard */}
        {studyKit && !isLoading && (
          <div className="space-y-6">
            {/* Top Toolbar / Kit Header */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStudyKit(null)}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors text-xs font-medium flex items-center gap-1.5"
                  title="Upload new material"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">New Material</span>
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      {studyKit.materialTitle}
                    </h2>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        studyKit.difficulty === 'easy'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : studyKit.difficulty === 'medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {studyKit.difficulty} Level
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Generated {new Date(studyKit.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span>{studyKit.keyConcepts.length} Concepts</span>
                    <span>•</span>
                    <span>3 Exam Qs</span>
                    <span>•</span>
                    <span>{studyKit.flashcards.length} Flashcards</span>
                  </div>
                </div>
              </div>

              {/* Difficulty switch & View Tabs */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Quick difficulty toggle */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                  <span className="text-slate-400 pl-1 text-[11px] hidden sm:inline">Difficulty:</span>
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => handleRegenerateWithDifficulty(diff)}
                      className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                        studyKit.difficulty === diff
                          ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>

                {/* View Mode Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('interactive')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      activeTab === 'interactive'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Interactive Kit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('layout')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      activeTab === 'layout'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Layout Document
                  </button>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: INTERACTIVE STUDY KIT */}
            {activeTab === 'interactive' && (
              <div className="space-y-8">
                {/* Section Quick Jump Anchors */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  <a
                    href="#concepts-section"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-medium flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    #1. Key Concepts ({studyKit.keyConcepts.length})
                  </a>
                  <a
                    href="#questions-section"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 font-medium flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                    #2. Practice Exam Questions (3)
                  </a>
                  <a
                    href="#flashcards-section"
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-violet-300 text-slate-700 hover:text-violet-700 font-medium flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                  >
                    <Layers className="w-3.5 h-3.5 text-violet-600" />
                    #3. Flashcards ({studyKit.flashcards.length})
                  </a>
                </div>

                {/* Section 1: Key Concepts */}
                <section id="concepts-section" className="scroll-mt-20">
                  <ConceptsView concepts={studyKit.keyConcepts} />
                </section>

                {/* Section 2: Practice Exam Questions */}
                <section id="questions-section" className="scroll-mt-20">
                  <PracticeQuestionsView
                    questions={studyKit.practiceQuestions}
                    difficulty={studyKit.difficulty}
                  />
                </section>

                {/* Section 3: Flashcards */}
                <section id="flashcards-section" className="scroll-mt-20">
                  <FlashcardsView initialFlashcards={studyKit.flashcards} />
                </section>
              </div>
            )}

            {/* TAB CONTENT: FORMAL FORMATTED LAYOUT DOCUMENT */}
            {activeTab === 'layout' && <FormattedLayoutView data={studyKit} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60 py-4 text-center text-xs text-slate-400 mt-12">
        <p>StudyKit AI • Exam Preparation Assistant • Strictly Grounded in Provided Notes</p>
      </footer>
    </div>
  );
}
