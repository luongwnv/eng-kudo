import { createStore } from "@/core/store/createStore";
import type { VocabWord, GameMode, Level } from "@/shared/types";

interface VocabState {
  selectedGameMode: GameMode;
  selectedLevel: Level;
  selectedTopics: string[];
  selectedWords: VocabWord[];
}

export const vocabStore = createStore<VocabState>({
  name: "eng-kudo-vocab",
  initialState: {
    selectedGameMode: "pick",
    selectedLevel: "beginner",
    selectedTopics: [],
    selectedWords: [],
  },
  persist: true,
});
