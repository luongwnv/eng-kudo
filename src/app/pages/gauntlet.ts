import { h, clear } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { ProgressBar } from "@/shared/components/ui/progress-bar";
import { getAllWords } from "@/features/Vocabulary/data";
import { generateOptions } from "@/features/Vocabulary/lib/optionGenerator";
import { shuffle } from "@/shared/lib/shuffle";
import { cn } from "@/shared/lib/cn";
import { icon, ArrowLeft, Flame, Shield, Sword, Skull, Play, Heart, RotateCcw, Home as HomeIcon, Target } from "@/shared/lib/icons";
import { statsStore } from "@/features/Progress/store/statsStore";
import type { VocabWord, GauntletDifficulty } from "@/shared/types";
import type { IconNode } from "lucide";

interface DifficultyConfig {
  lives: number;
  regenerates: boolean;
  iconNode: IconNode;
  label: string;
  desc: string;
}

const diffConfigs: Record<GauntletDifficulty, DifficultyConfig> = {
  normal: { lives: 3, regenerates: true, iconNode: Shield, label: "Normal", desc: "3 lives, regenerates" },
  hard: { lives: 3, regenerates: false, iconNode: Sword, label: "Hard", desc: "3 lives, no regen" },
  "instant-death": { lives: 1, regenerates: false, iconNode: Skull, label: "Instant Death", desc: "1 life" },
};

export function GauntletPage(): HTMLElement {
  const container = h("div", { class: "pb-8" });

  let phase: "setup" | "playing" | "results" = "setup";
  let difficulty: GauntletDifficulty = "normal";
  let repetitions = 3;
  let lives = 3;
  let maxLives = 3;
  let regenerates = true;
  let regenThreshold = 10;
  let correctSinceRegen = 0;
  let queue: VocabWord[] = [];
  let currentIdx = 0;
  let correct = 0;
  let wrong = 0;
  let streak = 0;
  let bestStreak = 0;
  let completed = false;

  function render(): void {
    clear(container);
    if (phase === "setup") renderSetup();
    else if (phase === "playing") renderPlaying();
    else renderResults();
  }

  function renderSetup(): void {
    const difficulties: GauntletDifficulty[] = ["normal", "hard", "instant-death"];
    const repOptions = [3, 5, 10, 15, 20];

    const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
    backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
    backBtn.addEventListener("click", () => navigate("/"));

    const titleEl = h("div", { class: "flex items-center gap-2" });
    titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Gauntlet Mode"));

    const startBtn = h("button", {
      class: "flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-lg font-bold bg-accent text-white border-b-8 border-accent/60 btn-3d hover:bg-accent-light transition-all duration-200 cursor-pointer",
    });
    startBtn.appendChild(icon(Play, { size: 22 }));
    startBtn.appendChild(document.createTextNode("Start Gauntlet!"));
    startBtn.addEventListener("click", () => {
      const cfg = diffConfigs[difficulty];
      lives = maxLives = cfg.lives;
      regenerates = cfg.regenerates;
      const words = getAllWords();
      queue = shuffle(Array.from({ length: repetitions }, () => words).flat());
      regenThreshold = Math.max(5, Math.min(20, Math.ceil(queue.length * 0.1)));
      correctSinceRegen = currentIdx = correct = wrong = streak = bestStreak = 0;
      completed = false;
      phase = "playing";
      render();
    });

    container.appendChild(
      h(
        "div",
        { class: "animate-fade-in" },
        h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl),
        h("p", { class: "text-secondary mb-8 text-center" }, "Survive the gauntlet \u2014 don\u2019t lose all your lives!"),
        h(
          "div",
          { class: "mb-6" },
          h("h3", { class: "text-sm font-medium text-secondary mb-2" }, "Difficulty"),
          h(
            "div",
            { class: "flex flex-col gap-2" },
            ...difficulties.map((d) => {
              const cfg = diffConfigs[d];
              const el = h("button", {
                class: cn(
                  "flex items-center gap-3 rounded-xl px-5 py-4 text-left transition-all duration-275 cursor-pointer border-2",
                  d === difficulty ? "bg-accent/10 border-accent" : "bg-card border-transparent hover:bg-border/30",
                ),
              });
              el.appendChild(icon(cfg.iconNode, { size: 24, class: d === difficulty ? "text-accent" : "text-secondary" }));
              el.appendChild(h("div", null,
                h("span", { class: "font-medium text-main block" }, cfg.label),
                h("span", { class: "text-xs text-secondary" }, cfg.desc),
              ));
              el.addEventListener("click", () => { difficulty = d; render(); });
              return el;
            }),
          ),
        ),
        h(
          "div",
          { class: "mb-8" },
          h("h3", { class: "text-sm font-medium text-secondary mb-2" }, "Repetitions per word"),
          h(
            "div",
            { class: "rounded-xl bg-card overflow-hidden flex" },
            ...repOptions.map((r) =>
              h("button", {
                class: cn(
                  "flex-1 py-3 text-sm font-medium transition-all duration-275 cursor-pointer",
                  r === repetitions ? "bg-accent text-white" : "text-secondary hover:bg-border/30",
                ),
                onClick: () => { repetitions = r; render(); },
              }, `${r}x`),
            ),
          ),
        ),
        startBtn,
      ),
    );
  }

  function renderPlaying(): void {
    if (currentIdx >= queue.length) { completed = true; phase = "results"; render(); return; }

    const word = queue[currentIdx];
    const options = generateOptions(word, getAllWords(), 4);
    const progress = Math.round((currentIdx / queue.length) * 100);

    // Lives
    const livesEl = h("div", { class: "flex gap-1" });
    for (let i = 0; i < maxLives; i++) {
      livesEl.appendChild(icon(Heart, {
        size: 20,
        class: cn("transition-all duration-300", i < lives ? "text-error fill-current" : "text-border"),
      }));
    }

    const streakEl = streak > 2
      ? (() => { const s = h("span", { class: "flex items-center gap-1 text-xs text-warning" }); s.appendChild(icon(Flame, { size: 12 })); s.appendChild(document.createTextNode(String(streak))); return s; })()
      : null;

    container.appendChild(
      h(
        "div",
        { class: "animate-fade-in" },
        h(
          "div",
          { class: "flex items-center justify-between mb-3" },
          livesEl,
          h("div", { class: "flex items-center gap-3 text-sm text-secondary" }, streakEl, h("span", null, `${currentIdx + 1} / ${queue.length}`)),
        ),
        ProgressBar({ value: progress, className: "mb-8" }),
        h("div", { class: "text-center mb-8" }, h("h2", { class: "text-6xl sm:text-7xl font-medium text-main" }, word.word)),
        h(
          "div",
          { class: "flex flex-col gap-4" },
          h("div", { class: "flex w-full gap-4" }, ...options.slice(0, 3).map((o) => gOpt(o, word))),
          options.length > 3
            ? h("div", { class: "flex w-full gap-4 justify-center" }, ...options.slice(3).map((o) => gOpt(o, word)))
            : null,
        ),
      ),
    );
  }

  function gOpt(opt: string, word: VocabWord): HTMLElement {
    const btn = h("button", {
      class: "flex-1 rounded-xl py-4 px-3 text-sm font-medium text-secondary bg-card border-b-4 border-secondary-accent btn-3d transition-all duration-150 cursor-pointer hover:text-main",
    }, opt.length > 45 ? opt.slice(0, 42) + "..." : opt);
    btn.addEventListener("click", () => {
      const ok = opt === word.definition;
      if (ok) { correct++; streak++; if (streak > bestStreak) bestStreak = streak; correctSinceRegen++; if (regenerates && correctSinceRegen >= regenThreshold && lives < maxLives) { lives++; correctSinceRegen = 0; } }
      else { wrong++; streak = 0; lives--; if (lives <= 0) { phase = "results"; render(); return; } }
      btn.classList.add(ok ? "!bg-success/20" : "!bg-error/20");
      currentIdx++;
      setTimeout(render, 300);
    });
    return btn;
  }

  function renderResults(): void {
    const today = new Date().toISOString().slice(0, 10);
    statsStore.setState((s) => ({
      totalSessions: s.totalSessions + 1,
      totalCorrect: s.totalCorrect + correct,
      totalIncorrect: s.totalIncorrect + wrong,
      bestStreak: Math.max(s.bestStreak, bestStreak),
      gauntletCompleted: s.gauntletCompleted + (completed ? 1 : 0),
      trainingDays: Array.from(new Set([...s.trainingDays, today])),
    }));

    const cfg = diffConfigs[difficulty];
    const againBtn = makeActionBtn(RotateCcw, "Try Again", () => { phase = "setup"; render(); });
    const homeBtn = makeActionBtn(HomeIcon, "Home", () => navigate("/"));

    const titleEl = h("div", { class: "flex items-center justify-center gap-2 mb-2" });
    titleEl.appendChild(icon(completed ? Flame : Skull, { size: 32, class: completed ? "text-accent" : "text-error" }));

    container.appendChild(
      h(
        "div",
        { class: "text-center animate-slide-up" },
        titleEl,
        h("h1", { class: "text-3xl font-bold text-main mb-2" }, completed ? "Gauntlet Complete!" : "Game Over"),
        completed
          ? h("p", { class: "text-accent text-lg mb-6" }, "You survived the entire gauntlet!")
          : h("p", { class: "text-secondary mb-6" }, `Made it to ${currentIdx} / ${queue.length}`),
        h(
          "div",
          { class: "rounded-xl bg-card p-6 mb-8 text-left" },
          h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Results"),
          statRowIcon(Target, "Correct", String(correct)),
          statRowIcon(Flame, "Best Streak", String(bestStreak)),
          statRowIcon(cfg.iconNode, "Difficulty", cfg.label),
          statRowIcon(Heart, "Progress", `${Math.round((currentIdx / queue.length) * 100)}%`),
        ),
        h("div", { class: "flex gap-3 justify-center" }, againBtn, homeBtn),
      ),
    );
  }

  render();
  return container;
}

function statRowIcon(iconNode: Parameters<typeof icon>[0], label: string, value: string): HTMLElement {
  const row = h("div", { class: "flex items-center justify-between py-3 border-b border-border/50 last:border-0" });
  const left = h("div", { class: "flex items-center gap-2" });
  left.appendChild(icon(iconNode, { size: 16, class: "text-secondary" }));
  left.appendChild(h("span", { class: "text-sm text-secondary" }, label));
  row.appendChild(left);
  row.appendChild(h("span", { class: "text-base font-semibold text-main" }, value));
  return row;
}

function makeActionBtn(iconNode: Parameters<typeof icon>[0], text: string, onClick: () => void): HTMLElement {
  const btn = h("button", {
    class: "flex items-center gap-2 rounded-xl bg-card px-6 py-3 font-medium text-secondary border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer hover:text-main",
  });
  btn.appendChild(icon(iconNode, { size: 16 }));
  btn.appendChild(document.createTextNode(text));
  btn.addEventListener("click", onClick);
  return btn;
}
