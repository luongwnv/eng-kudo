import type { VocabGroup } from "@/shared/types";
import { business } from "./business";
import { literary } from "./literary";
import { phrasesAdvanced } from "./phrases";

export const advancedGroups: VocabGroup[] = [
  { id: "adv-business", name: "Business & Finance", level: "advanced", topic: "business", words: business },
  { id: "adv-literary", name: "Literary & Academic", level: "advanced", topic: "literary", words: literary },
  { id: "adv-phrases", name: "Advanced Phrases", level: "advanced", topic: "phrases", words: phrasesAdvanced },
];
