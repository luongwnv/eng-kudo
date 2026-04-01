import { createStore } from "@/core/store/createStore";

interface FlashcardState {
  learnedIds: number[];
  starredIds: number[];
  currentIndex: number;
}

export const flashcardStore = createStore<FlashcardState>({
  name: "eng-kudo-flashcard",
  initialState: {
    learnedIds: [],
    starredIds: [],
    currentIndex: 0,
  },
  persist: true,
});

export function toggleLearned(id: number): void {
  const s = flashcardStore.getState();
  const ids = s.learnedIds.includes(id)
    ? s.learnedIds.filter((i) => i !== id)
    : [...s.learnedIds, id];
  flashcardStore.setState({ learnedIds: ids });
}

export function toggleStarred(id: number): void {
  const s = flashcardStore.getState();
  const ids = s.starredIds.includes(id)
    ? s.starredIds.filter((i) => i !== id)
    : [...s.starredIds, id];
  flashcardStore.setState({ starredIds: ids });
}
