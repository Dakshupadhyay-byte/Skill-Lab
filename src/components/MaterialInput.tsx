import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Zap, RefreshCw } from 'lucide-react';
import { Difficulty } from '../types/studyKit';
import { SAMPLE_STUDY_MATERIALS, SampleNote } from '../data/sampleNotes';

interface MaterialInputProps {
  onGenerate: (data: { text: string; image?: { data: string; mimeType: string }; difficulty: Difficulty }) => void;
  isLoading: boolean;
  selectedDifficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({
  onGenerate,
  isLoading,
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'both'>('text');
  const [text, setText] = useState<string>('');
  const [imageFile, setImageFile] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageFile({
        data: result,
        mimeType: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) handleFile(blob);
          break;
        }
      }
    }
  };

  const handleLoadSample = (sample: SampleNote) => {
    setText(sample.fullText);
    onDifficultyChange(sample.difficulty);
    setActiveTab('text');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    onGenerate({
      text: text.trim(),
      image: imageFile ? { data: imageFile.data, mimeType: imageFile.mimeType } : undefined,
      difficulty: selectedDifficulty,
    });
  };

  const hasContent = text.trim().length > 0 || imageFile !== null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Banner & Mode Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Source Material
          </span>
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'text'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Notes / Text
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'image'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Document Image {imageFile && '✓'}
            </button>
          </div>
        </div>

        {/* Quick Sample Notes */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="text-slate-400 font-medium whitespace-nowrap">Load sample:</span>
          {SAMPLE_STUDY_MATERIALS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 transition-colors whitespace-nowrap font-medium text-[11px]"
              title={sample.title}
            >
              {sample.category}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5">
        {/* Text Input Panel */}
        {(activeTab === 'text' || activeTab === 'both') && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <label htmlFor="notes-area" className="font-semibold text-slate-700">
                Paste Study Notes, Lecture Summary, or Book Excerpt
              </label>
              <div className="flex items-center gap-3">
                {text.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    Clear text
                  </button>
                )}
                <span>{text.length.toLocaleString()} characters</span>
              </div>
            </div>
            <textarea
              id="notes-area"
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste raw lecture notes, textbook chapters, or summary definitions here (or paste an image with Ctrl+V)..."
              className="w-full p-3.5 text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden transition-all text-slate-800 placeholder-slate-400 resize-y leading-relaxed font-sans"
            />
          </div>
        )}

        {/* Image Upload Panel */}
        {(activeTab === 'image' || activeTab === 'both') && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Upload Document Image (Handwritten notes, textbook page, slides)
              </span>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Remove image
                </button>
              )}
            </div>

            {!imageFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Drag & drop your study document image here, or{' '}
                  <span className="text-indigo-600 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports PNG, JPG, WEBP (textbook photos, handwritten homework, diagrams)
                </p>
              </div>
            ) : (
              <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center gap-4">
                <img
                  src={imageFile.data}
                  alt="Uploaded study document"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{imageFile.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Image ready for multimodal parsing</p>
                  <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Multimodal OCR Active
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Difficulty Level Radio Selector */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Practice Exam Question Difficulty
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Easy Radio */}
            <label
              className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'easy'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={selectedDifficulty === 'easy'}
                onChange={() => onDifficultyChange('easy')}
                className="mt-0.5 h-4 w-4 text-emerald-600 border-slate-300 focus:ring-emerald-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Easy
                </span>
                <p className="text-slate-500 mt-0.5 leading-snug">
                  Direct definitions, foundational recall & obvious distractors.
                </p>
              </div>
            </label>

            {/* Medium Radio */}
            <label
              className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'medium'
                  ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={selectedDifficulty === 'medium'}
                onChange={() => onDifficultyChange('medium')}
                className="mt-0.5 h-4 w-4 text-amber-600 border-slate-300 focus:ring-amber-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Medium
                </span>
                <p className="text-slate-500 mt-0.5 leading-snug">
                  Comprehension, cause-and-effect & standard multi-step logic.
                </p>
              </div>
            </label>

            {/* Hard Radio */}
            <label
              className={`relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'hard'
                  ? 'border-rose-500 bg-rose-50/50 shadow-xs ring-1 ring-rose-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={selectedDifficulty === 'hard'}
                onChange={() => onDifficultyChange('hard')}
                className="mt-0.5 h-4 w-4 text-rose-600 border-slate-300 focus:ring-rose-500"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Hard
                </span>
                <p className="text-slate-500 mt-0.5 leading-snug">
                  Deep analysis, nuanced distractors & multi-concept synthesis.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Button & Constraints Note */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Parses source strictly • 3–5 Concepts • 3 Exam Qs • 5–10 Flashcards</span>
          </div>

          <button
            type="submit"
            disabled={!hasContent || isLoading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
              !hasContent || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Parsing & Generating Kit...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                Generate Study Kit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
