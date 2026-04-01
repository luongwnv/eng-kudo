import { h } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { Button } from "@/shared/components/ui/button";
import { vocabStore } from "@/features/Vocabulary/store/vocabStore";
import { getAllGroups } from "@/features/Vocabulary/data";
import { cn } from "@/shared/lib/cn";
import {
  icon,
  ArrowLeft,
  Target,
  Check,
  MousePointerClick,
  Keyboard,
  Play,
  Sparkles,
} from "@/shared/lib/icons";
import type { GameMode, Level } from "@/shared/types";

export function VocabularyPage(): HTMLElement {
  const state = vocabStore.getState();
  const groups = getAllGroups();

  const levels: Level[] = ["beginner", "intermediate", "advanced"];
  const levelConfig: Record<Level, { label: string; color: string }> = {
    beginner: { label: "Beginner", color: "text-green-400" },
    intermediate: { label: "Intermediate", color: "text-amber-400" },
    advanced: { label: "Advanced", color: "text-red-400" },
  };

  // Level selector
  const levelBtns = h(
    "div",
    { class: "rounded-xl bg-card overflow-hidden flex" },
    ...levels.map((level) => {
      const isActive = state.selectedLevel === level;
      const cfg = levelConfig[level];
      return h(
        "button",
        {
          class: cn(
            "flex-1 py-3 px-4 text-sm font-medium transition-all duration-275 cursor-pointer",
            isActive ? "bg-accent text-white" : "text-secondary hover:bg-border/30 hover:text-main",
          ),
          onClick: () => {
            vocabStore.setState({ selectedLevel: level, selectedTopics: [] });
            container.replaceWith(VocabularyPage());
          },
        },
        cfg.label,
      );
    }),
  );

  // Game mode selector
  const modeBtns = h(
    "div",
    { class: "rounded-xl bg-card overflow-hidden flex w-fit" },
    ...(["pick", "input"] as GameMode[]).map((mode) => {
      const isActive = state.selectedGameMode === mode;
      const btn = h(
        "button",
        {
          class: cn(
            "flex items-center gap-1.5 py-2 px-5 text-sm font-medium transition-all duration-275 cursor-pointer",
            isActive ? "bg-accent text-white" : "text-secondary hover:bg-border/30 hover:text-main",
          ),
        },
      );
      btn.appendChild(icon(mode === "pick" ? MousePointerClick : Keyboard, { size: 14 }));
      btn.appendChild(document.createTextNode(mode === "pick" ? " Pick" : " Type"));
      btn.addEventListener("click", () => {
        vocabStore.setState({ selectedGameMode: mode });
        container.replaceWith(VocabularyPage());
      });
      return btn;
    }),
  );

  // Topic groups
  const filteredGroups = groups.filter((g) => g.level === state.selectedLevel);
  const topicCards = filteredGroups.map((group) => {
    const isSelected = state.selectedTopics.includes(group.topic);

    const el = h(
      "button",
      {
        class: cn(
          "flex w-full items-center justify-between rounded-xl px-5 py-4 text-left transition-all duration-275 cursor-pointer",
          isSelected
            ? "bg-accent/10 border-2 border-accent"
            : "bg-card border-2 border-transparent hover:bg-border/30",
        ),
      },
    );

    const left = h("div", { class: "flex items-center gap-3" });
    const checkbox = h(
      "div",
      {
        class: cn(
          "flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200",
          isSelected ? "bg-accent border-accent" : "border-border",
        ),
      },
    );
    if (isSelected) checkbox.appendChild(icon(Check, { size: 12, class: "text-white" }));
    left.appendChild(checkbox);
    left.appendChild(h("span", { class: "font-medium text-main" }, group.name));
    el.appendChild(left);
    el.appendChild(h("span", { class: "text-sm text-secondary" }, `${group.words.length} words`));

    el.addEventListener("click", () => {
      const topics = isSelected
        ? state.selectedTopics.filter((t) => t !== group.topic)
        : [...state.selectedTopics, group.topic];
      vocabStore.setState({ selectedTopics: topics });
      container.replaceWith(VocabularyPage());
    });

    return el;
  });

  // Selected words count
  const selectedWords = filteredGroups
    .filter((g) => state.selectedTopics.includes(g.topic))
    .flatMap((g) => g.words);

  // Start button
  const startBtn = h(
    "button",
    {
      class: cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold transition-all duration-200 cursor-pointer",
        "border-b-8 border-secondary-accent btn-3d",
        selectedWords.length > 0
          ? "bg-accent text-white border-accent/60 hover:bg-accent-light"
          : "bg-card text-secondary/50 cursor-not-allowed",
      ),
      ...(selectedWords.length === 0 ? { disabled: true } : {}),
    },
  );
  startBtn.appendChild(icon(Play, { size: 20 }));
  startBtn.appendChild(document.createTextNode(` Start \u2014 ${selectedWords.length} words`));
  startBtn.addEventListener("click", () => {
    if (selectedWords.length === 0) return;
    vocabStore.setState({ selectedWords });
    navigate(`/vocabulary/game?mode=${state.selectedGameMode}`);
  });

  // Back button
  const backBtn = h(
    "button",
    {
      class: "text-secondary hover:text-main transition-colors cursor-pointer",
      onClick: () => navigate("/"),
    },
  );
  backBtn.appendChild(icon(ArrowLeft, { size: 20 }));

  const titleRow = h("div", { class: "flex items-center gap-3 mb-6" }, backBtn);
  const titleEl = h("div", { class: "flex items-center gap-2" });
  titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Vocabulary"));
  titleRow.appendChild(titleEl);

  const container = h(
    "div",
    { class: "animate-fade-in pb-8" },
    titleRow,
    // Level
    h("div", { class: "mb-6" }, h("h3", { class: "text-sm font-medium text-secondary mb-2" }, "Level"), levelBtns),
    // Mode
    h("div", { class: "mb-6" }, h("h3", { class: "text-sm font-medium text-secondary mb-2" }, "Mode"), modeBtns),
    // Topics
    h(
      "div",
      { class: "mb-8" },
      h(
        "div",
        { class: "flex items-center justify-between mb-2" },
        h("h3", { class: "text-sm font-medium text-secondary" }, "Topics"),
        state.selectedTopics.length > 0
          ? h(
              "button",
              {
                class: "text-xs text-accent cursor-pointer hover:underline",
                onClick: () => {
                  vocabStore.setState({ selectedTopics: [] });
                  container.replaceWith(VocabularyPage());
                },
              },
              "Clear all",
            )
          : filteredGroups.length > 0
            ? h(
                "button",
                {
                  class: "text-xs text-accent cursor-pointer hover:underline",
                  onClick: () => {
                    vocabStore.setState({ selectedTopics: filteredGroups.map((g) => g.topic) });
                    container.replaceWith(VocabularyPage());
                  },
                },
                "Select all",
              )
            : null,
      ),
      topicCards.length > 0
        ? h("div", { class: "flex flex-col gap-2" }, ...topicCards)
        : h("p", { class: "text-secondary text-sm py-4 text-center" }, "No topics available yet."),
    ),
    startBtn,
  );

  return container;
}
