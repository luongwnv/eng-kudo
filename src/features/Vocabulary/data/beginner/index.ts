import type { VocabGroup } from "@/shared/types";
import { everyday } from "./everyday";
import { greetings } from "./greetings";
import { foodDrink } from "./food-drink";
import { phrasesBeginner } from "./phrases";

export const beginnerGroups: VocabGroup[] = [
  { id: "beg-everyday", name: "Everyday Words", level: "beginner", topic: "everyday", words: everyday },
  { id: "beg-greetings", name: "Greetings & Social", level: "beginner", topic: "greetings", words: greetings },
  { id: "beg-food-drink", name: "Food & Drink", level: "beginner", topic: "food-drink", words: foodDrink },
  { id: "beg-phrases", name: "Common Phrases", level: "beginner", topic: "phrases", words: phrasesBeginner },
];
