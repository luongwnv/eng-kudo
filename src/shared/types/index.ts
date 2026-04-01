export type GameMode = "pick" | "input";

export type Level = "beginner" | "intermediate" | "advanced";

export type PartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "phrase"
  | "idiom"
  | "phrasal-verb";

export interface VocabWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: PartOfSpeech;
  examples: string[];
  level: Level;
  topic: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface VocabGroup {
  id: string;
  name: string;
  level: Level;
  topic: string;
  words: VocabWord[];
}

export type GauntletDifficulty = "normal" | "hard" | "instant-death";

export interface SessionResult {
  correct: number;
  incorrect: number;
  totalTime: number;
  answers: AnswerRecord[];
}

export interface AnswerRecord {
  wordId: string;
  correct: boolean;
  timeMs: number;
  userAnswer: string;
}
