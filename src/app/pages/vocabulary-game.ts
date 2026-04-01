import { h, clear } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { vocabStore } from "@/features/Vocabulary/store/vocabStore";
import { generateQuestion, type Question } from "@/features/Vocabulary/lib/questionGenerator";
import { generateOptions } from "@/features/Vocabulary/lib/optionGenerator";
import { checkAnswer } from "@/features/Vocabulary/lib/answerChecker";
import { Input } from "@/shared/components/ui/input";
import { ProgressBar } from "@/shared/components/ui/progress-bar";
import { GameBottomBar } from "@/shared/components/game/GameBottomBar";
import { shuffle } from "@/shared/lib/shuffle";
import { cn } from "@/shared/lib/cn";
import { icon, Star, CircleCheck, CircleX, RotateCcw, Home as HomeIcon } from "@/shared/lib/icons";
import { statsStore } from "@/features/Progress/store/statsStore";
import type { AnswerRecord, GameMode } from "@/shared/types";

interface GameState {
  questions: Question[];
  current: number;
  correct: number;
  answers: AnswerRecord[];
  startTime: number;
  phase: "question" | "feedback" | "summary";
  lastCorrect: boolean;
  selectedAnswer: string;
}

export function VocabularyGamePage(params: Record<string, string>): HTMLElement {
  const mode = (params.mode || "pick") as GameMode;
  const words = vocabStore.getState().selectedWords;

  if (words.length === 0) {
    navigate("/vocabulary");
    return h("div");
  }

  const questions = shuffle(words).map((w) => generateQuestion(w, words));
  const gs: GameState = {
    questions,
    current: 0,
    correct: 0,
    answers: [],
    startTime: Date.now(),
    phase: "question",
    lastCorrect: false,
    selectedAnswer: "",
  };

  const container = h("div", { class: "pb-24" });

  function render(): void {
    clear(container);
    removeBottomBars();
    if (gs.phase === "question") renderQuestion();
    else if (gs.phase === "feedback") renderFeedback();
    else renderSummary();
  }

  function removeBottomBars(): void {
    document.querySelectorAll(".game-bottom-bar").forEach((el) => el.remove());
  }

  function renderQuestion(): void {
    const q = gs.questions[gs.current];
    const progress = Math.round((gs.current / gs.questions.length) * 100);

    container.appendChild(ProgressBar({ value: progress, className: "mb-8" }));
    container.appendChild(
      h(
        "div",
        { class: "text-center mb-10 animate-slide-up" },
        h("p", { class: "text-sm text-secondary mb-3" }, "What does this word mean?"),
        h("h2", { class: "text-7xl sm:text-8xl font-medium text-main mb-2" }, q.word.word),
        q.word.partOfSpeech
          ? h("span", { class: "text-sm text-secondary/60 italic" }, q.word.partOfSpeech)
          : null,
      ),
    );

    if (mode === "pick") renderPickMode(q);
    else renderInputMode(q);
  }

  function renderPickMode(q: Question): void {
    const options = generateOptions(q.word, vocabStore.getState().selectedWords, 4);
    const row1 = options.slice(0, 3);
    const row2 = options.slice(3);

    const createBtn = (opt: string, idx: number) => {
      const btn = h(
        "button",
        {
          class: cn(
            "flex-1 rounded-xl py-4 px-3 text-base font-medium text-secondary",
            "bg-card border-b-4 border-secondary-accent btn-3d",
            "transition-all duration-200 cursor-pointer hover:text-main hover:border-accent/50",
          ),
        },
      );
      const inner = h("span", { class: "flex items-center justify-center gap-2" });
      inner.appendChild(
        h(
          "span",
          { class: "hidden lg:inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-border/50 text-xs text-secondary" },
          String(idx + 1),
        ),
      );
      inner.appendChild(document.createTextNode(opt.length > 50 ? opt.slice(0, 47) + "..." : opt));
      btn.appendChild(inner);
      btn.addEventListener("click", () => { gs.selectedAnswer = opt; handleAnswer(opt, q); });
      return btn;
    };

    container.appendChild(
      h(
        "div",
        { class: "flex flex-col gap-4" },
        h("div", { class: "flex w-full gap-4" }, ...row1.map(createBtn)),
        row2.length > 0
          ? h("div", { class: "flex w-full gap-4 justify-center" }, ...row2.map((o, i) => createBtn(o, i + row1.length)))
          : null,
      ),
    );
  }

  function renderInputMode(q: Question): void {
    const input = Input({
      placeholder: "Type the definition...",
      autofocus: true,
      className: "mx-auto block",
      onEnter: (v) => { gs.selectedAnswer = v; handleAnswer(v, q); },
    });

    container.appendChild(h("div", { class: "flex flex-col items-center gap-4" }, input));

    let bar = GameBottomBar({
      state: "check",
      disabled: true,
      onAction: () => { gs.selectedAnswer = input.value; handleAnswer(input.value, q); },
      current: gs.current + 1,
      total: gs.questions.length,
    });
    bar.classList.add("game-bottom-bar");
    document.body.appendChild(bar);

    input.addEventListener("input", () => {
      removeBottomBars();
      bar = GameBottomBar({
        state: "check",
        disabled: input.value.trim().length === 0,
        onAction: () => { gs.selectedAnswer = input.value; handleAnswer(input.value, q); },
        current: gs.current + 1,
        total: gs.questions.length,
      });
      bar.classList.add("game-bottom-bar");
      document.body.appendChild(bar);
    });

    setTimeout(() => input.focus(), 50);
  }

  function handleAnswer(answer: string, q: Question): void {
    const isCorrect = checkAnswer(answer, q.word.definition, mode);
    gs.lastCorrect = isCorrect;
    if (isCorrect) gs.correct++;
    gs.answers.push({ wordId: q.word.id, correct: isCorrect, timeMs: Date.now() - gs.startTime, userAnswer: answer });
    gs.phase = "feedback";
    render();
  }

  function renderFeedback(): void {
    const q = gs.questions[gs.current];
    const progress = Math.round(((gs.current + 1) / gs.questions.length) * 100);

    container.appendChild(ProgressBar({ value: progress, className: "mb-8" }));
    container.appendChild(h("div", { class: "text-center mb-8" }, h("h2", { class: "text-5xl font-medium text-main mb-2" }, q.word.word)));

    // Feedback card
    const feedbackEl = h(
      "div",
      {
        class: cn(
          "rounded-xl px-5 py-4 mb-4 animate-fade-in",
          gs.lastCorrect ? "bg-success/10 border border-success/20" : "bg-error/10 border border-error/20",
        ),
      },
    );

    if (gs.lastCorrect) {
      const row = h("div", { class: "flex items-center gap-2 text-success font-semibold" });
      row.appendChild(icon(CircleCheck, { size: 20, class: "text-success" }));
      row.appendChild(h("span", null, "Correct!"));
      feedbackEl.appendChild(row);
    } else {
      const row = h("div", { class: "flex items-center gap-2 text-error font-semibold mb-2" });
      row.appendChild(icon(CircleX, { size: 20, class: "text-error" }));
      row.appendChild(h("span", null, "Incorrect"));
      feedbackEl.appendChild(row);
      feedbackEl.appendChild(h("p", { class: "text-sm text-secondary mb-1" }, `You said: "${gs.selectedAnswer}"`));
      feedbackEl.appendChild(h("p", { class: "text-sm font-medium text-main" }, `Answer: ${q.word.definition}`));
    }
    container.appendChild(feedbackEl);

    if (q.word.examples.length > 0) {
      container.appendChild(h("p", { class: "text-sm text-secondary/60 italic mb-4" }, `"${q.word.examples[0]}"`));
    }

    const bar = GameBottomBar({
      state: gs.lastCorrect ? "correct" : "wrong",
      onAction: () => {
        removeBottomBars();
        gs.current++;
        gs.phase = gs.current < gs.questions.length ? "question" : "summary";
        render();
      },
      current: gs.current + 1,
      total: gs.questions.length,
    });
    bar.classList.add("game-bottom-bar");
    document.body.appendChild(bar);
  }

  function renderSummary(): void {
    const total = gs.questions.length;
    const accuracy = Math.round((gs.correct / total) * 100);
    const totalTime = Math.round((Date.now() - gs.startTime) / 1000);
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    const today = new Date().toISOString().slice(0, 10);
    statsStore.setState((s) => ({
      totalSessions: s.totalSessions + 1,
      totalCorrect: s.totalCorrect + gs.correct,
      totalIncorrect: s.totalIncorrect + (total - gs.correct),
      trainingDays: Array.from(new Set([...s.trainingDays, today])),
    }));

    // Stars
    const starsEl = h("div", { class: "flex items-center justify-center gap-2 mb-4" });
    for (let i = 0; i < 3; i++) {
      starsEl.appendChild(
        icon(Star, {
          size: 32,
          class: i < stars ? "text-warning fill-current" : "text-border",
        }),
      );
    }

    // Stat card
    const statsCard = h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-8 text-left" },
      h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Results"),
      statRow("Score", `${gs.correct} / ${total}`),
      statRow("Accuracy", `${accuracy}%`),
      statRow("Time", fmtTime(totalTime)),
      statRow("Avg / Question", `${(totalTime / total).toFixed(1)}s`),
    );

    // Mistakes review
    const mistakes = gs.answers.filter((a) => !a.correct);
    const mistakesCard =
      mistakes.length > 0
        ? h(
            "div",
            { class: "rounded-xl bg-card p-6 mb-8 text-left" },
            h("h3", { class: "border-b-2 border-border pb-3 text-xl font-bold text-secondary mb-4" }, "Review Mistakes"),
            ...mistakes.map((a) => {
              const word = gs.questions.find((q) => q.word.id === a.wordId)?.word;
              return word
                ? h(
                    "div",
                    { class: "flex items-center justify-between py-3 border-b border-border/50 last:border-0" },
                    h("span", { class: "font-medium text-main" }, word.word),
                    h("span", { class: "text-sm text-secondary" }, word.definition),
                  )
                : null;
            }),
          )
        : null;

    // Actions
    const againBtn = actionBtn(RotateCcw, "Play Again", () => navigate("/vocabulary"));
    const homeBtn = actionBtn(HomeIcon, "Home", () => navigate("/"));

    container.appendChild(
      h(
        "div",
        { class: "text-center animate-slide-up" },
        starsEl,
        h("h2", { class: "text-3xl font-bold text-main mb-8" }, "Session Complete"),
        statsCard,
        mistakesCard,
        h("div", { class: "flex gap-3 justify-center" }, againBtn, homeBtn),
      ),
    );
  }

  render();
  return container;
}

function statRow(label: string, value: string): HTMLElement {
  return h(
    "div",
    { class: "flex items-center justify-between py-3 border-b border-border/50 last:border-0" },
    h("span", { class: "text-sm text-secondary" }, label),
    h("span", { class: "text-base font-semibold text-main" }, value),
  );
}

function actionBtn(iconNode: Parameters<typeof icon>[0], text: string, onClick: () => void): HTMLElement {
  const btn = h(
    "button",
    { class: "flex items-center gap-2 rounded-xl bg-card px-6 py-3 font-medium text-secondary border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer hover:text-main" },
  );
  btn.appendChild(icon(iconNode, { size: 16 }));
  btn.appendChild(document.createTextNode(text));
  btn.addEventListener("click", onClick);
  return btn;
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}
