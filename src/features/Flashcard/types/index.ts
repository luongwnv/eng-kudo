export interface FlashcardWord {
  id: number;
  word: string;
  meaning: string;
  ipa: string;
  examples: {
    en: string;
    vi: string;
  }[];
  partOfSpeech?: string;
}

export type FlashcardFilter = "all" | "unlearned" | "learned" | "starred";
