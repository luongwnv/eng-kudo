import { h } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { statsStore } from "@/features/Progress/store/statsStore";
import { formatNumber, formatPercent } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/cn";
import {
  icon,
  ArrowLeft,
  BarChart3,
  Target,
  CircleCheck,
  CircleX,
  Flame,
  Zap,
  Calendar,
  Trophy,
  TrendingUp,
} from "@/shared/lib/icons";
import type { IconNode } from "lucide";

export function ProgressPage(): HTMLElement {
  const s = statsStore.getState();
  const total = s.totalCorrect + s.totalIncorrect;

  const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
  backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
  backBtn.addEventListener("click", () => navigate("/"));

  const titleEl = h("div", { class: "flex items-center gap-2" });
  titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Progress"));

  return h(
    "div",
    { class: "animate-fade-in pb-8" },
    h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl),

    // Overview
    h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-6" },
      h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Overview"),
      statRow(TrendingUp, "Total Sessions", formatNumber(s.totalSessions)),
      statRow(CircleCheck, "Correct Answers", formatNumber(s.totalCorrect)),
      statRow(CircleX, "Wrong Answers", formatNumber(s.totalIncorrect)),
      statRow(Target, "Accuracy", formatPercent(s.totalCorrect, total)),
      statRow(Flame, "Best Streak", formatNumber(s.bestStreak)),
    ),

    // Game modes
    h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-6" },
      h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Game Modes"),
      statRow(Zap, "Blitz High Score", formatNumber(s.blitzHighScore)),
      statRow(Trophy, "Gauntlets Completed", formatNumber(s.gauntletCompleted)),
      statRow(Calendar, "Training Days", formatNumber(s.trainingDays.length)),
    ),

    // Streak grid
    h(
      "div",
      { class: "rounded-xl bg-card p-6" },
      h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Training History"),
      h("p", { class: "text-sm text-secondary mb-4" }, "Last 90 days"),
      renderStreakGrid(s.trainingDays),
      h(
        "div",
        { class: "flex items-center gap-2 mt-4 text-xs text-secondary/60" },
        h("span", null, "Less"),
        h("div", { class: "h-3 w-3 rounded-sm bg-border/30" }),
        h("div", { class: "h-3 w-3 rounded-sm bg-accent/30" }),
        h("div", { class: "h-3 w-3 rounded-sm bg-accent/60" }),
        h("div", { class: "h-3 w-3 rounded-sm bg-accent" }),
        h("span", null, "More"),
      ),
    ),
  );
}

function statRow(iconNode: IconNode, label: string, value: string): HTMLElement {
  const row = h("div", { class: "flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0" });
  const left = h("div", { class: "flex items-center gap-3" });
  left.appendChild(icon(iconNode, { size: 18, class: "text-secondary shrink-0" }));
  left.appendChild(h("span", { class: "text-sm text-secondary" }, label));
  row.appendChild(left);
  row.appendChild(h("span", { class: "text-base font-semibold text-main whitespace-nowrap" }, value));
  return row;
}

function renderStreakGrid(days: string[]): HTMLElement {
  const today = new Date();
  const daySet = new Set(days);
  const cells: HTMLElement[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const active = daySet.has(key);

    cells.push(
      h("div", {
        class: cn("h-3 w-3 rounded-sm transition-colors duration-200", active ? "bg-accent" : "bg-border/20"),
        title: key,
      }),
    );
  }

  return h("div", { class: "flex flex-wrap gap-1" }, ...cells);
}
