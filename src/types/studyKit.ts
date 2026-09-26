export type Difficulty = 'easy' | 'medium' | 'hard';

export interface KeyConcept {
  title: string;
  explanation: string; // 2-3 concise sentences
}

export interface MCQQuestion {
  question: string;
  options: string[]; // exactly 4 options
  correctOptionIndex: number;
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  sampleAnswer: string;
  keyPointsToInclude?: string[];
}

export interface ConceptualApplicationQuestion {
  scenario: string;
  question: string;
  guidedApplication: string;
}

export interface PracticeQuestions {
  mcq: MCQQuestion;
  shortAnswer: ShortAnswerQuestion;
  conceptualApplication: ConceptualApplicationQuestion;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyKitData {
  materialTitle: string;
  difficulty: Difficulty;
  keyConcepts: KeyConcept[];
  practiceQuestions: PracticeQuestions;
  flashcards: Flashcard[];
  formattedLayoutText: string;
  generatedAt: string;
}
