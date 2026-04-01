import { h } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { achievementStore } from "@/features/Achievements/store/achievementStore";
import { achievements } from "@/features/Achievements/data/achievements";
import { cn } from "@/shared/lib/cn";
import { icon, ArrowLeft, Trophy, Lock, Award } from "@/shared/lib/icons";

const rarityConfig: Record<string, { color: string; bg: string }> = {
  common: { color: "text-secondary", bg: "bg-border/30" },
  rare: { color: "text-blue-400", bg: "bg-blue-500/10" },
  epic: { color: "text-purple-400", bg: "bg-purple-500/10" },
  legendary: { color: "text-amber-400", bg: "bg-amber-500/10" },
};

export function AchievementsPage(): HTMLElement {
  const unlocked = achievementStore.getState().unlockedIds;
  const totalPoints = achievementStore.getState().totalPoints;
  const categories = [...new Set(achievements.map((a) => a.category))];
  const total = achievements.length;
  const unlockedCount = unlocked.length;

  const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
  backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
  backBtn.addEventListener("click", () => navigate("/"));

  const titleEl = h("div", { class: "flex items-center gap-2" });
  titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Achievements"));

  return h(
    "div",
    { class: "animate-fade-in pb-8" },
    h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl),

    // Overview
    h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-8" },
      h(
        "div",
        { class: "flex items-center justify-between" },
        h(
          "div",
          null,
          h("p", { class: "text-3xl font-bold text-main" }, `${unlockedCount} / ${total}`),
          h("p", { class: "text-sm text-secondary" }, "achievements unlocked"),
        ),
        (() => {
          const pts = h("div", { class: "text-right" });
          const ptsRow = h("div", { class: "flex items-center justify-end gap-1" });
          ptsRow.appendChild(icon(Award, { size: 20, class: "text-accent" }));
          ptsRow.appendChild(h("span", { class: "text-3xl font-bold text-accent" }, String(totalPoints)));
          pts.appendChild(ptsRow);
          pts.appendChild(h("p", { class: "text-sm text-secondary" }, "total points"));
          return pts;
        })(),
      ),
      h(
        "div",
        { class: "mt-4 h-2 rounded-full bg-border/40 overflow-hidden" },
        h("div", {
          class: "h-full rounded-full bg-accent transition-all duration-500",
          style: `width: ${Math.round((unlockedCount / total) * 100)}%`,
        }),
      ),
    ),

    // Categories
    ...categories.map((cat) => {
      const catAchievements = achievements.filter((a) => a.category === cat);
      const catUnlocked = catAchievements.filter((a) => unlocked.includes(a.id)).length;

      return h(
        "div",
        { class: "mb-8" },
        h(
          "div",
          { class: "flex items-center justify-between mb-3" },
          h("h2", { class: "text-lg font-bold text-secondary capitalize" }, cat),
          h("span", { class: "text-xs text-secondary/60" }, `${catUnlocked}/${catAchievements.length}`),
        ),
        h(
          "div",
          { class: "flex flex-col gap-3" },
          ...catAchievements.map((ach) => {
            const isUnlocked = unlocked.includes(ach.id);
            const rarity = rarityConfig[ach.rarity] || rarityConfig.common;

            const card = h(
              "div",
              {
                class: cn(
                  "relative flex items-start gap-4 rounded-2xl p-5 overflow-hidden transition-all duration-275",
                  isUnlocked ? "bg-card" : "bg-bg border border-border/50 opacity-60",
                ),
              },
            );

            // Gradient overlay
            if (isUnlocked) {
              card.appendChild(
                h("div", {
                  class: "absolute inset-0 opacity-5",
                  style: "background: linear-gradient(135deg, var(--accent-color) 0%, transparent 60%)",
                }),
              );
            }

            // Icon box
            const iconBox = h("div", {
              class: cn(
                "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border text-2xl",
                isUnlocked ? "bg-bg" : "bg-card",
              ),
            });
            if (isUnlocked) {
              iconBox.textContent = ach.icon;
            } else {
              iconBox.appendChild(icon(Lock, { size: 20, class: "text-border" }));
            }
            card.appendChild(iconBox);

            // Content
            const content = h("div", { class: "relative flex-1" });
            const titleRow = h("div", { class: "flex items-center gap-2 mb-1" });
            titleRow.appendChild(h("h3", { class: "font-semibold text-main" }, ach.title));
            titleRow.appendChild(
              h("span", { class: cn("rounded-full px-2 py-0.5 text-xs font-medium", rarity.bg, rarity.color) }, ach.rarity),
            );
            content.appendChild(titleRow);
            content.appendChild(h("p", { class: "text-sm text-secondary" }, ach.description));
            content.appendChild(h("p", { class: "text-xs text-secondary/50 mt-1" }, `${ach.points} pts`));
            card.appendChild(content);

            return card;
          }),
        ),
      );
    }),
  );
}
