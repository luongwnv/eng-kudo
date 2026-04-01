import { h } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { statsStore } from "@/features/Progress/store/statsStore";
import { formatNumber } from "@/shared/lib/formatters";
import {
  icon,
  BookOpen,
  Zap,
  Flame,
  BarChart3,
  Trophy,
  Settings,
  ChevronRight,
  Sparkles,
} from "@/shared/lib/icons";
import type { IconNode } from "lucide";

interface MenuEntry {
  title: string;
  subtitle: string;
  iconNode: IconNode;
  path: string;
  tiles?: string[];
}

const mainModes: MenuEntry[] = [
  {
    title: "Flashcards",
    subtitle: "1000 words \u2022 EN/VI",
    iconNode: Sparkles,
    path: "/flashcard",
    tiles: ["hello", "world", "love"],
  },
  {
    title: "Vocabulary",
    subtitle: "Learn & practice words",
    iconNode: BookOpen,
    path: "/vocabulary",
    tiles: ["brave", "curious", "achieve"],
  },
  {
    title: "Blitz",
    subtitle: "Speed challenge",
    iconNode: Zap,
    path: "/blitz",
    tiles: ["fast", "quick", "swift"],
  },
  {
    title: "Gauntlet",
    subtitle: "Survive the gauntlet",
    iconNode: Flame,
    path: "/gauntlet",
    tiles: ["strong", "tough", "bold"],
  },
];

const secondaryModes: MenuEntry[] = [
  { title: "Progress", subtitle: "Stats & history", iconNode: BarChart3, path: "/progress" },
  { title: "Achievements", subtitle: "Milestones", iconNode: Trophy, path: "/achievements" },
  { title: "Settings", subtitle: "Customize", iconNode: Settings, path: "/settings" },
];

export function HomePage(): HTMLElement {
  const stats = statsStore.getState();

  // Title
  const titleArea = h(
    "div",
    { class: "mb-8 text-center" },
    h("h1", { class: "text-4xl font-bold text-main mb-1" }, "eng-kudo"),
    h("p", { class: "text-secondary text-sm" }, "Master English vocabulary, one word at a time"),
  );

  // Quick stats
  const total = stats.totalCorrect + stats.totalIncorrect;
  const quickStats =
    total > 0
      ? h(
          "div",
          { class: "flex items-center justify-center gap-6 mb-8 text-sm text-secondary" },
          h("span", null, `${formatNumber(stats.totalSessions)} sessions`),
          h("span", { class: "text-border" }, "\u00B7"),
          h("span", null, `${formatNumber(stats.totalCorrect)} correct`),
          h("span", { class: "text-border" }, "\u00B7"),
          h("span", null, `${stats.trainingDays.length} days`),
        )
      : null;

  // Main modes card
  const mainCard = h(
    "div",
    { class: "rounded-2xl bg-card mb-4 overflow-hidden" },
    ...mainModes.map((mode, idx) => {
      const isLast = idx === mainModes.length - 1;

      const tiles = (mode.tiles || []).map((word, tileIdx) =>
        h(
          "span",
          {
            class:
              "inline-flex h-10 items-center justify-center rounded-xl bg-secondary-accent px-3 text-sm font-medium text-secondary border-b-4 border-border/30 animate-float",
            style: `animation-delay: ${tileIdx * 800}ms; --float-distance: -6px`,
          },
          word,
        ),
      );

      const btn = h(
        "button",
        {
          class: `flex w-full items-center gap-4 px-6 py-6 text-left transition-all duration-275 ease-in-out hover:bg-border/30 cursor-pointer ${!isLast ? "border-b border-border/30" : ""}`,
        },
      );

      const left = h("div", { class: "flex-1" });
      const titleRow = h("div", { class: "flex items-center gap-2.5 mb-1" });
      titleRow.appendChild(icon(mode.iconNode, { size: 22, class: "text-accent shrink-0" }));
      titleRow.appendChild(h("span", { class: "text-xl font-bold text-main" }, mode.title));
      left.appendChild(titleRow);
      left.appendChild(h("p", { class: "text-sm text-secondary pl-8" }, mode.subtitle));
      btn.appendChild(left);

      if (tiles.length > 0) {
        btn.appendChild(h("div", { class: "hidden sm:flex items-center gap-2" }, ...tiles));
      }

      const chevron = icon(ChevronRight, { size: 18, class: "text-border shrink-0" });
      btn.appendChild(chevron);

      btn.addEventListener("click", () => navigate(mode.path));
      return btn;
    }),
  );

  // Secondary grid
  const secondaryGrid = h(
    "div",
    { class: "grid grid-cols-3 gap-3" },
    ...secondaryModes.map((mode) => {
      const btn = h(
        "button",
        {
          class:
            "flex flex-col items-center gap-2 rounded-xl bg-card p-4 text-center transition-all duration-275 ease-in-out hover:bg-border/30 cursor-pointer",
        },
      );
      btn.appendChild(icon(mode.iconNode, { size: 24, class: "text-accent" }));
      btn.appendChild(h("span", { class: "text-sm font-medium text-main" }, mode.title));
      btn.appendChild(h("span", { class: "text-xs text-secondary" }, mode.subtitle));
      btn.addEventListener("click", () => navigate(mode.path));
      return btn;
    }),
  );

  const footer = h(
    "div",
    { class: "mt-8 flex items-center justify-center gap-2 text-xs text-secondary/50" },
    h("span", null, "v0.1.0"),
  );

  return h("div", { class: "animate-fade-in" }, titleArea, quickStats, mainCard, secondaryGrid, footer);
}
