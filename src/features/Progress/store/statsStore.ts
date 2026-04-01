import { createStore } from "@/core/store/createStore";

interface StatsState {
  totalSessions: number;
  totalCorrect: number;
  totalIncorrect: number;
  bestStreak: number;
  trainingDays: string[];
  blitzHighScore: number;
  gauntletCompleted: number;
}

export const statsStore = createStore<StatsState>({
  name: "eng-kudo-stats",
  initialState: {
    totalSessions: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    bestStreak: 0,
    trainingDays: [],
    blitzHighScore: 0,
    gauntletCompleted: 0,
  },
  persist: true,
});
