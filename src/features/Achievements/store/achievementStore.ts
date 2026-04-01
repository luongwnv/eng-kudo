import { createStore } from "@/core/store/createStore";

interface AchievementState {
  unlockedIds: string[];
  totalPoints: number;
  notificationQueue: string[];
}

export const achievementStore = createStore<AchievementState>({
  name: "eng-kudo-achievements",
  initialState: {
    unlockedIds: [],
    totalPoints: 0,
    notificationQueue: [],
  },
  persist: true,
});

export function unlockAchievement(id: string, points: number): boolean {
  const state = achievementStore.getState();
  if (state.unlockedIds.includes(id)) return false;

  achievementStore.setState({
    unlockedIds: [...state.unlockedIds, id],
    totalPoints: state.totalPoints + points,
    notificationQueue: [...state.notificationQueue, id],
  });
  return true;
}
