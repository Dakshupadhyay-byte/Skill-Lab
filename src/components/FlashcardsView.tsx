import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types/studyKit';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  Clock,
  LayoutGrid,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';

interface FlashcardsViewProps {
  initialFlashcards: Flashcard[];
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ initialFlashcards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});
  const [viewMode, setViewMode] = useState<'flip' | 'grid'>('flip');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync cards if props change
  useEffect(() => {
    setCards(initialFlashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCards({});
  }, [initialFlashcards]);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length]);

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const toggleMastered = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMasteredCards((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyJson = () => {
    const jsonStr = JSON.stringify(cards, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'flip') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleNext, handlePrev]);

  const currentCard = cards[currentIndex] || { front: '', back: '' };
  const masteredCount = Object.values(masteredCards).filter(Boolean).length;
  const progressPercent = Math.round((masteredCount / cards.length) * 100) || 0;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">
              #3
            </span>
            Flashcard Set
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {cards.length} targeted review terms (Between 5 and 10 items) in interactive deck format.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('flip')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'flip'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Flip Deck
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyJson}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Copy flashcard JSON array"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">JSON Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-violet-600" />
          <span className="font-semibold text-slate-800">
            {cards.length} Cards in Deck
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600">
            {masteredCount} marked as mastered ({progressPercent}%)
          </span>
        </div>
        <div className="w-32 bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* FLIP DECK VIEW */}
      {viewMode === 'flip' ? (
        <div className="space-y-4">
          {/* Card Container with 3D Flip */}
          <div className="w-full max-w-xl mx-auto perspective-1000 min-h-[260px] cursor-pointer">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-[260px] rounded-2xl transition-transform duration-500 transform-style-3d shadow-sm ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT SIDE */}
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 hover:border-indigo-300 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Front • Term / Question
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {currentCard.front}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-500">
                    <RotateCw className="w-3.5 h-3.5" /> Click or press Space to flip
                  </span>
                  <button
                    type="button"
                    onClick={(e) => toggleMastered(currentIndex, e)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      masteredCards[currentIndex]
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {masteredCards[currentIndex] ? 'Mastered' : 'Mark Mastered'}
                  </button>
                </div>
              </div>

              {/* BACK SIDE */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 border border-white/10">
                    Back • Definition / Answer
                  </span>
                  <span className="text-xs font-semibold text-indigo-300">
                    Card {currentIndex + 1} of {cards.length}
                  </span>
                </div>

                <div className="my-auto text-center px-4 overflow-y-auto max-h-[140px]">
                  <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-indigo-300">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3.5 h-3.5" /> Click to flip back
                  </span>
                  <button
                    type="button"
                    onClick={(e) => toggleMastered(currentIndex, e)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                      masteredCards[currentIndex]
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {masteredCards[currentIndex] ? 'Mastered' : 'Mark Mastered'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:border-slate-300 transition-all active:scale-95"
              title="Previous card (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <RotateCw className={`w-4 h-4 transition-transform ${isFlipped ? 'rotate-180' : ''}`} />
              {isFlipped ? 'Show Front' : 'Reveal Definition'}
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:border-slate-300 transition-all active:scale-95"
              title="Next card (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleShuffle}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-2xs hover:border-slate-300 transition-all active:scale-95 ml-2"
              title="Shuffle cards"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* GRID OVERVIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between ${
                masteredCards[idx]
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-600">Card #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => toggleMastered(idx)}
                    className="hover:text-emerald-600"
                  >
                    {masteredCards[idx] ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-300" />
                    )}
                  </button>
                </div>
                <h5 className="font-bold text-slate-900 text-sm mb-2">{card.front}</h5>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {card.back}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
