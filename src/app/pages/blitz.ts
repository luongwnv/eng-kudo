import { h, clear } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { Timer } from "@/shared/components/game/Timer";
import { getAllWords } from "@/features/Vocabulary/data";
import { generateOptions } from "@/features/Vocabulary/lib/optionGenerator";
import { shuffle } from "@/shared/lib/shuffle";
import { cn } from "@/shared/lib/cn";
import { icon, ArrowLeft, Zap, Play, RotateCcw, Home as HomeIcon, Flame, Target } from "@/shared/lib/icons";
import { statsStore } from "@/features/Progress/store/statsStore";
import type { VocabWord } from "@/shared/types";

type Phase = "setup" | "playing" | "results";

export function BlitzPage(): HTMLElement {
  const container = h("div", { class: "pb-8" });

  let phase: Phase = "setup";
  let duration = 60;
  let score = 0;
  let correct = 0;
  let wrong = 0;
  let streak = 0;
  let bestStreak = 0;
  let words: VocabWord[] = [];
  let currentIdx = 0;
  let timer: ReturnType<typeof Timer> | null = null;

  function render(): void {
    clear(container);
    if (phase === "setup") renderSetup();
    else if (phase === "playing") renderPlaying();
    else renderResults();
  }

  function renderSetup(): void {
    const durations = [30, 60, 120];

    const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
    backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
    backBtn.addEventListener("click", () => navigate("/"));

    const titleEl = h("div", { class: "flex items-center gap-2" });
    titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Blitz Mode"));

    const startBtn = h(
      "button",
      {
        class: "flex items-center justify-center gap-2 w-full rounded-2xl py-4 text-lg font-bold bg-accent text-white border-b-8 border-accent/60 btn-3d hover:bg-accent-light transition-all duration-200 cursor-pointer",
      },
    );
    startBtn.appendChild(icon(Play, { size: 22 }));
    startBtn.appendChild(document.createTextNode("Start Blitz!"));
    startBtn.addEventListener("click", () => {
      words = shuffle(getAllWords());
      currentIdx = score = correct = wrong = streak = bestStreak = 0;
      phase = "playing";
      render();
    });

    container.appendChild(
      h(
        "div",
        { class: "animate-fade-in" },
        h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl),
        h("p", { class: "text-secondary mb-8 text-center" }, "Answer as many as you can before time runs out!"),
        h(
          "div",
          { class: "mb-8" },
          h("h3", { class: "text-sm font-medium text-secondary mb-2" }, "Duration"),
          h(
            "div",
            { class: "rounded-xl bg-card overflow-hidden flex" },
            ...durations.map((d) =>
              h(
                "button",
                {
                  class: cn(
                    "flex-1 py-3 text-sm font-medium transition-all duration-275 cursor-pointer",
                    d === duration ? "bg-accent text-white" : "text-secondary hover:bg-border/30",
                  ),
                  onClick: () => { duration = d; render(); },
                },
                `${d}s`,
              ),
            ),
          ),
        ),
        startBtn,
      ),
    );
  }

  function renderPlaying(): void {
    if (currentIdx >= words.length) { words = shuffle(getAllWords()); currentIdx = 0; }
    const word = words[currentIdx];
    const options = generateOptions(word, words, 4);

    timer = Timer({ seconds: duration, onEnd: () => { phase = "results"; render(); } });

    // Score display with icons
    const scoreEl = h("div", { class: "text-right" });
    scoreEl.appendChild(h("p", { class: "text-4xl font-bold text-main tabular-nums" }, String(score)));
    const streakRow = h("div", { class: "flex items-center justify-end gap-1 text-xs text-secondary" });
    streakRow.appendChild(icon(Flame, { size: 12, class: streak > 2 ? "text-warning" : "text-secondary" }));
    streakRow.appendChild(document.createTextNode(String(streak)));
    scoreEl.appendChild(streakRow);

    container.appendChild(
      h(
        "div",
        { class: "animate-fade-in" },
        h("div", { class: "flex items-center justify-between mb-8" }, timer.el, scoreEl),
        h(
          "div",
          { class: "text-center mb-8" },
          h("p", { class: "text-sm text-secondary mb-2" }, "What does this mean?"),
          h("h2", { class: "text-6xl sm:text-7xl font-medium text-main" }, word.word),
        ),
        h(
          "div",
          { class: "flex flex-col gap-4" },
          h("div", { class: "flex w-full gap-4" }, ...options.slice(0, 3).map((o) => optBtn(o, word))),
          options.length > 3
            ? h("div", { class: "flex w-full gap-4 justify-center" }, ...options.slice(3).map((o) => optBtn(o, word)))
            : null,
        ),
      ),
    );

    timer.start();
  }

  function optBtn(opt: string, word: VocabWord): HTMLElement {
    const btn = h(
      "button",
      {
        class: "flex-1 rounded-xl py-4 px-3 text-sm font-medium text-secondary bg-card border-b-4 border-secondary-accent btn-3d transition-all duration-150 cursor-pointer hover:text-main",
      },
      opt.length > 45 ? opt.slice(0, 42) + "..." : opt,
    );
    btn.addEventListener("click", () => {
      const ok = opt === word.definition;
      if (ok) { correct++; streak++; score += 10 + Math.min(streak * 2, 20); if (streak > bestStreak) bestStreak = streak; }
      else { wrong++; streak = 0; }
      currentIdx++;
      btn.classList.add(ok ? "!bg-success/20" : "!bg-error/20");
      setTimeout(() => { if (phase === "playing") renderPlaying(); }, 250);
    });
    return btn;
  }

  function renderResults(): void {
    timer?.stop();
    const today = new Date().toISOString().slice(0, 10);
    statsStore.setState((s) => ({
      totalSessions: s.totalSessions + 1,
      totalCorrect: s.totalCorrect + correct,
      totalIncorrect: s.totalIncorrect + wrong,
      bestStreak: Math.max(s.bestStreak, bestStreak),
      blitzHighScore: Math.max(s.blitzHighScore, score),
      trainingDays: Array.from(new Set([...s.trainingDays, today])),
    }));

    const againBtn = makeActionBtn(RotateCcw, "Play Again", () => { phase = "setup"; render(); });
    const homeBtn = makeActionBtn(HomeIcon, "Home", () => navigate("/"));

    container.appendChild(
      h(
        "div",
        { class: "text-center animate-slide-up" },
        (() => { const el = h("div", { class: "flex items-center justify-center gap-2 mb-2" }); el.appendChild(icon(Zap, { size: 32, class: "text-accent" })); return el; })(),
        h("h1", { class: "text-3xl font-bold text-main mb-2" }, "Blitz Complete!"),
        h("p", { class: "text-6xl font-bold text-accent my-6" }, String(score)),
        h("p", { class: "text-sm text-secondary mb-8" }, "points"),
        h(
          "div",
          { class: "rounded-xl bg-card p-6 mb-8 text-left" },
          h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Results"),
          statRow(Target, "Correct", String(correct)),
          statRow(Flame, "Best Streak", String(bestStreak)),
          statRow(Zap, "Accuracy", correct + wrong > 0 ? `${Math.round((correct / (correct + wrong)) * 100)}%` : "0%"),
        ),
        h("div", { class: "flex gap-3 justify-center" }, againBtn, homeBtn),
      ),
    );
  }

  render();
  return container;
}

function statRow(iconNode: Parameters<typeof icon>[0], label: string, value: string): HTMLElement {
  const row = h(
    "div",
    { class: "flex items-center justify-between py-3 border-b border-border/50 last:border-0" },
  );
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
