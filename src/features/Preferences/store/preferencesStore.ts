import { createStore } from "@/core/store/createStore";
import type { GameMode } from "@/shared/types";

interface PreferencesState {
  theme: "light" | "dark" | "system";
  defaultGameMode: GameMode;
  animationsEnabled: boolean;
  hotkeysEnabled: boolean;
}

export const preferencesStore = createStore<PreferencesState>({
  name: "eng-kudo-preferences",
  initialState: {
    theme: "dark",
    defaultGameMode: "pick",
    animationsEnabled: true,
    hotkeysEnabled: true,
  },
  persist: true,
});
