import type { VocabGroup, Level } from "@/shared/types";
import { beginnerGroups } from "./beginner";
import { intermediateGroups } from "./intermediate";
import { advancedGroups } from "./advanced";

const allGroups: VocabGroup[] = [...beginnerGroups, ...intermediateGroups, ...advancedGroups];

export function getAllGroups(): VocabGroup[] {
  return allGroups;
}

export function getGroupsByLevel(level: Level): VocabGroup[] {
  return allGroups.filter((g) => g.level === level);
}

export function getAllWords() {
  return allGroups.flatMap((g) => g.words);
}
