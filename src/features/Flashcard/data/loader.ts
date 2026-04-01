import type { FlashcardWord } from "../types";
import { ipaMap } from "./ipa-map";
import { examplesMap } from "./examples-map";

let cachedWords: FlashcardWord[] | null = null;

export async function loadFlashcardWords(): Promise<FlashcardWord[]> {
  if (cachedWords) return cachedWords;

  const resp = await fetch("/works.csv");
  const text = await resp.text();

  cachedWords = text
    .trim()
    .split("\n")
    .map((line, idx) => {
      const commaIdx = line.indexOf(",");
      if (commaIdx === -1) return null;
      const word = line.slice(0, commaIdx).trim();
      const meaning = line.slice(commaIdx + 1).trim();
      if (!word || !meaning) return null;

      return {
        id: idx + 1,
        word,
        meaning,
        ipa: ipaMap[word.toLowerCase()] || "",
        examples: examplesMap[word.toLowerCase()] || [],
      } satisfies FlashcardWord;
    })
    .filter((w): w is FlashcardWord => w !== null);

  return cachedWords;
}

export function getFlashcardWordsSync(): FlashcardWord[] {
  return cachedWords || [];
}
