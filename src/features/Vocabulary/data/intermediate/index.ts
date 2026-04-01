import type { VocabGroup } from "@/shared/types";
import { idioms } from "./idioms";
import { phrasalVerbs } from "./phrasal-verbs";
import { phrasesIntermediate } from "./phrases";

export const intermediateGroups: VocabGroup[] = [
  { id: "int-idioms", name: "Idioms", level: "intermediate", topic: "idioms", words: idioms },
  { id: "int-phrasal-verbs", name: "Phrasal Verbs", level: "intermediate", topic: "phrasal-verbs", words: phrasalVerbs },
  { id: "int-phrases", name: "Useful Phrases", level: "intermediate", topic: "phrases", words: phrasesIntermediate },
];
