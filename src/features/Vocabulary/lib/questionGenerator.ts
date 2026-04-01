import type { VocabWord } from "@/shared/types";

export interface Question {
  word: VocabWord;
}

export function generateQuestion(word: VocabWord, _pool: VocabWord[]): Question {
  return { word };
}
