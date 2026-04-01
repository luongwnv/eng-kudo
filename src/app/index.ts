import { createRouter } from "@/core/router/router";
import { AppLayout } from "./layout";
import { HomePage } from "./pages/home";
import { VocabularyPage } from "./pages/vocabulary";
import { VocabularyGamePage } from "./pages/vocabulary-game";
import { BlitzPage } from "./pages/blitz";
import { GauntletPage } from "./pages/gauntlet";
import { ProgressPage } from "./pages/progress";
import { AchievementsPage } from "./pages/achievements";
import { SettingsPage } from "./pages/settings";
import { FlashcardPage } from "./pages/flashcard";

export function createApp(root: HTMLElement): void {
  const { container, content } = AppLayout();
  root.appendChild(container);

  const router = createRouter(content);

  router.register([
    { path: "/", render: () => FlashcardPage() },
    { path: "/home", render: () => HomePage() },
    { path: "/vocabulary", render: () => VocabularyPage() },
    { path: "/vocabulary/game", render: (params) => VocabularyGamePage(params) },
    { path: "/flashcard", render: () => FlashcardPage() },
    { path: "/blitz", render: () => BlitzPage() },
    { path: "/gauntlet", render: () => GauntletPage() },
    { path: "/progress", render: () => ProgressPage() },
    { path: "/achievements", render: () => AchievementsPage() },
    { path: "/settings", render: () => SettingsPage() },
  ]);
}
