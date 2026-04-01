import { pickRandom } from "@/shared/lib/random";
import { shuffle } from "@/shared/lib/shuffle";
import type { VocabWord } from "@/shared/types";

/** Generate multiple-choice options including the correct answer */
export function generateOptions(
  correctWord: VocabWord,
  pool: VocabWord[],
  count: number,
): string[] {
  const distractors = pickRandom(
    pool.filter((w) => w.id !== correctWord.id),
    count - 1,
  ).map((w) => w.definition);

  return shuffle([correctWord.definition, ...distractors]);
}
