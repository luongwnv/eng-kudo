import { h, clear } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { cn } from "@/shared/lib/cn";
import {
  icon,
  ArrowLeft,
  Star,
  Check,
  Sparkles,
  RotateCcw,
  ArrowRight,
} from "@/shared/lib/icons";
import { loadFlashcardWords } from "@/features/Flashcard/data/loader";
import { flashcardStore, toggleLearned, toggleStarred } from "@/features/Flashcard/store/flashcardStore";
import { shuffle } from "@/shared/lib/shuffle";
import type { FlashcardWord, FlashcardFilter } from "@/features/Flashcard/types";

const CARDS_PER_PAGE = 2;

export function FlashcardPage(): HTMLElement {
  const container = h("div", { class: "animate-fade-in pb-8" });

  const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
  backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
  backBtn.addEventListener("click", () => navigate("/home"));

  const titleEl = h("div", { class: "flex items-center gap-2" });
  titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Flashcards"));

  container.appendChild(h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl));

  const content = h("div", { class: "text-center text-secondary py-12" }, "Loading 1000 words...");
  container.appendChild(content);

  loadFlashcardWords().then((allWords) => {
    clear(content);
    new FlashcardApp(content, allWords);
  });

  return container;
}

class FlashcardApp {
  private mount: HTMLElement;
  private allWords: FlashcardWord[];
  private words: FlashcardWord[] = [];
  private filter: FlashcardFilter = "unlearned";
  // Paged mode (all)
  private page = 0;
  private flippedIds = new Set<number>();
  // Single card mode (unlearned/learned/starred)
  private cardIdx = 0;
  private flipped = false;
  private shuffled = false;
  private needsReshuffle = true; // flag to only shuffle when needed
  private keyHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(mount: HTMLElement, allWords: FlashcardWord[]) {
    this.mount = mount;
    this.allWords = allWords;
    this.setupKeyboard();
    this.rebuildWords();
    this.render();
  }

  private get isPagedMode(): boolean {
    return this.filter === "all";
  }

  private setupKeyboard(): void {
    if (this.keyHandler) document.removeEventListener("keydown", this.keyHandler);
    this.keyHandler = (e: KeyboardEvent) => {
      if (this.isPagedMode) {
        if (e.key === "ArrowRight") { this.nextPage(); }
        else if (e.key === "ArrowLeft") { this.prevPage(); }
      } else {
        if (e.key === "ArrowRight" || e.key === " ") {
          e.preventDefault();
          if (this.cardIdx < this.words.length - 1) { this.cardIdx++; this.flipped = false; this.render(); }
        } else if (e.key === "ArrowLeft") {
          if (this.cardIdx > 0) { this.cardIdx--; this.flipped = false; this.render(); }
        } else if (e.key === "Enter" || e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          this.flipped = !this.flipped;
          this.render();
        }
      }
    };
    document.addEventListener("keydown", this.keyHandler);
  }

  private nextPage(): void {
    const total = Math.ceil(this.words.length / CARDS_PER_PAGE);
    if (this.page < total - 1) { this.page++; this.flippedIds.clear(); this.render(); }
  }

  private prevPage(): void {
    if (this.page > 0) { this.page--; this.flippedIds.clear(); this.render(); }
  }

  private getFiltered(): FlashcardWord[] {
    const state = flashcardStore.getState();
    switch (this.filter) {
      case "learned": return this.allWords.filter((w) => state.learnedIds.includes(w.id));
      case "unlearned": return this.allWords.filter((w) => !state.learnedIds.includes(w.id));
      case "starred": return this.allWords.filter((w) => state.starredIds.includes(w.id));
      default: return [...this.allWords];
    }
  }

  /** Rebuild + shuffle word list. Call when filter/shuffle changes, NOT on flip/mark. */
  private rebuildWords(): void {
    const filtered = this.getFiltered();
    const shouldShuffle = this.filter === "unlearned" || (!this.isPagedMode && this.shuffled);
    this.words = shouldShuffle ? shuffle(filtered) : filtered;
    this.needsReshuffle = false;
  }

  private render(): void {
    clear(this.mount);
    // Only rebuild list when flagged (filter/shuffle change), otherwise just re-filter in place
    if (this.needsReshuffle) {
      this.rebuildWords();
    } else {
      // Remove words that no longer match filter (e.g. marked learned in unlearned tab)
      const filtered = this.getFiltered();
      const filteredIds = new Set(filtered.map((w) => w.id));
      this.words = this.words.filter((w) => filteredIds.has(w.id));
    }

    const state = flashcardStore.getState();

    // Stats
    this.mount.appendChild(
      h(
        "div",
        { class: "flex items-center justify-center gap-4 text-sm text-secondary mb-4" },
        h("span", null, `${state.learnedIds.length}/${this.allWords.length} learned`),
        h("span", { class: "text-border" }, "\u00B7"),
        h("span", null, `${state.starredIds.length} starred`),
      ),
    );

    // Filters — unlearned first, all last
    const filters: { key: FlashcardFilter; label: string }[] = [
      { key: "unlearned", label: `Unlearned (${this.allWords.length - state.learnedIds.length})` },
      { key: "learned", label: `Learned (${state.learnedIds.length})` },
      { key: "starred", label: `Starred (${state.starredIds.length})` },
      { key: "all", label: `All (${this.allWords.length})` },
    ];
    this.mount.appendChild(
      h(
        "div",
        { class: "flex gap-1 rounded-xl bg-card overflow-hidden mb-6 w-fit mx-auto" },
        ...filters.map((f) =>
          h("button", {
            class: cn(
              "px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-275 cursor-pointer",
              this.filter === f.key ? "bg-accent text-white" : "text-secondary hover:bg-border/30",
            ),
            onClick: () => { this.filter = f.key; this.page = 0; this.cardIdx = 0; this.flipped = false; this.flippedIds.clear(); this.needsReshuffle = true; this.render(); },
          }, f.label),
        ),
      ),
    );

    if (this.words.length === 0) {
      this.mount.appendChild(h("div", { class: "text-center text-secondary py-12" }, "No words in this filter."));
      return;
    }

    if (this.isPagedMode) {
      this.renderPaged();
    } else {
      this.renderSingle();
    }
  }

  // ─── PAGED MODE (All): 2 cards/page + pagination ───
  private renderPaged(): void {
    const totalPages = Math.ceil(this.words.length / CARDS_PER_PAGE);
    if (this.page >= totalPages) this.page = Math.max(0, totalPages - 1);
    const start = this.page * CARDS_PER_PAGE;
    const pageWords = this.words.slice(start, start + CARDS_PER_PAGE);

    const cardsContainer = h("div", { class: "flex flex-col gap-4" });
    for (const word of pageWords) {
      cardsContainer.appendChild(this.renderCard(word, this.flippedIds.has(word.id)));
    }
    this.mount.appendChild(cardsContainer);

    // Pagination
    if (totalPages > 1) {
      const pager = h("div", { class: "flex items-center justify-center gap-2 mt-6" });

      const prevBtn = h("button", {
        class: cn(
          "flex items-center rounded-xl bg-card px-4 py-2.5 font-medium border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer",
          this.page === 0 ? "text-secondary/30 cursor-not-allowed" : "text-secondary hover:text-main",
        ),
        ...(this.page === 0 ? { disabled: true } : {}),
      });
      prevBtn.appendChild(icon(ArrowLeft, { size: 14 }));
      prevBtn.addEventListener("click", () => this.prevPage());
      pager.appendChild(prevBtn);

      const maxV = 5;
      let sp = Math.max(0, this.page - Math.floor(maxV / 2));
      const ep = Math.min(totalPages, sp + maxV);
      sp = Math.max(0, ep - maxV);
      for (let i = sp; i < ep; i++) {
        pager.appendChild(
          h("button", {
            class: cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer tabular-nums",
              i === this.page ? "bg-accent text-white" : "bg-card text-secondary hover:text-main",
            ),
            onClick: () => { this.page = i; this.flippedIds.clear(); this.render(); },
          }, String(i + 1)),
        );
      }

      const nextBtn = h("button", {
        class: cn(
          "flex items-center rounded-xl bg-card px-4 py-2.5 font-medium border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer",
          this.page >= totalPages - 1 ? "text-secondary/30 cursor-not-allowed" : "text-secondary hover:text-main",
        ),
        ...(this.page >= totalPages - 1 ? { disabled: true } : {}),
      });
      nextBtn.appendChild(icon(ArrowRight, { size: 14 }));
      nextBtn.addEventListener("click", () => this.nextPage());
      pager.appendChild(nextBtn);

      pager.appendChild(
        h("span", { class: "text-xs text-secondary/50 ml-2" }, `${start + 1}-${Math.min(start + CARDS_PER_PAGE, this.words.length)} of ${this.words.length}`),
      );

      this.mount.appendChild(pager);
    }
  }

  // ─── SINGLE CARD MODE (Unlearned / Learned / Starred) ───
  private renderSingle(): void {
    if (this.cardIdx >= this.words.length) this.cardIdx = Math.max(0, this.words.length - 1);

    // Shuffle toggle
    const shuffleBtn = h("button", {
      class: cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-275 cursor-pointer mx-auto mb-6",
        this.shuffled ? "bg-accent/10 text-accent" : "text-secondary hover:bg-card",
      ),
      onClick: () => { this.shuffled = !this.shuffled; this.cardIdx = 0; this.flipped = false; this.needsReshuffle = true; this.render(); },
    });
    shuffleBtn.appendChild(icon(RotateCcw, { size: 12 }));
    shuffleBtn.appendChild(document.createTextNode(this.shuffled ? " Shuffled" : " Shuffle"));
    this.mount.appendChild(shuffleBtn);

    const word = this.words[this.cardIdx];
    this.mount.appendChild(this.renderCard(word, this.flipped));

    // Nav
    const nav = h("div", { class: "flex items-center justify-between mt-6" });

    const prevBtn = h("button", {
      class: cn(
        "flex items-center gap-1 rounded-xl bg-card px-5 py-3 font-medium border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer",
        this.cardIdx === 0 ? "text-secondary/30 cursor-not-allowed" : "text-secondary hover:text-main",
      ),
      ...(this.cardIdx === 0 ? { disabled: true } : {}),
    });
    prevBtn.appendChild(icon(ArrowLeft, { size: 16 }));
    prevBtn.appendChild(document.createTextNode(" Prev"));
    prevBtn.addEventListener("click", () => { if (this.cardIdx > 0) { this.cardIdx--; this.flipped = false; this.render(); } });

    const counter = h("span", { class: "text-sm text-secondary tabular-nums" }, `${this.cardIdx + 1} / ${this.words.length}`);

    const nextBtn = h("button", {
      class: cn(
        "flex items-center gap-1 rounded-xl bg-card px-5 py-3 font-medium border-b-4 border-secondary-accent btn-3d transition-all duration-200 cursor-pointer",
        this.cardIdx >= this.words.length - 1 ? "text-secondary/30 cursor-not-allowed" : "text-secondary hover:text-main",
      ),
      ...(this.cardIdx >= this.words.length - 1 ? { disabled: true } : {}),
    });
    nextBtn.appendChild(document.createTextNode("Next "));
    nextBtn.appendChild(icon(ArrowRight, { size: 16 }));
    nextBtn.addEventListener("click", () => { if (this.cardIdx < this.words.length - 1) { this.cardIdx++; this.flipped = false; this.render(); } });

    nav.appendChild(prevBtn);
    nav.appendChild(counter);
    nav.appendChild(nextBtn);
    this.mount.appendChild(nav);
  }

  // ─── SHARED CARD RENDERER ───
  private renderCard(word: FlashcardWord, isFlipped: boolean): HTMLElement {
    const state = flashcardStore.getState();
    const isLearned = state.learnedIds.includes(word.id);
    const isStarred = state.starredIds.includes(word.id);

    const card = h("div", {
      class: cn(
        "relative rounded-2xl p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-2",
        isLearned ? "bg-success/5 border-success/20" : "bg-card border-transparent",
        "hover:shadow-lg hover:shadow-accent/5",
      ),
    });
    card.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("[data-action]")) return;
      if (this.isPagedMode) {
        if (this.flippedIds.has(word.id)) this.flippedIds.delete(word.id);
        else this.flippedIds.add(word.id);
      } else {
        this.flipped = !this.flipped;
      }
      this.render();
    });

    // Word number
    card.appendChild(h("span", { class: "absolute top-3 left-4 text-xs text-secondary/30 tabular-nums" }, `#${word.id}`));

    if (!isFlipped) {
      card.appendChild(h("p", { class: "text-xs text-secondary/50 mb-3 uppercase tracking-widest" }, "English"));
      card.appendChild(h("h2", { class: "text-5xl sm:text-6xl font-bold text-main mb-2 animate-slide-up" }, word.word));
      if (word.ipa) {
        card.appendChild(h("p", { class: "text-lg text-accent font-mono" }, word.ipa));
      }
      card.appendChild(h("p", { class: "text-xs text-secondary/30 mt-4" }, "Tap to reveal"));
    } else {
      card.appendChild(h("p", { class: "text-xs text-secondary/50 mb-2 uppercase tracking-widest" }, "Vietnamese"));
      card.appendChild(h("h2", { class: "text-3xl sm:text-4xl font-bold text-accent mb-2 animate-slide-up" }, word.meaning));
      card.appendChild(h("h3", { class: "text-xl text-main/80 mb-1" }, word.word));
      if (word.ipa) {
        card.appendChild(h("p", { class: "text-sm text-secondary font-mono mb-3" }, word.ipa));
      }
      if (word.examples.length > 0) {
        const exDiv = h("div", { class: "w-full mt-3 border-t border-border/50 pt-3" });
        for (const ex of word.examples) {
          exDiv.appendChild(
            h("div", { class: "mb-2 last:mb-0" },
              h("p", { class: "text-sm text-main italic" }, `\u201C${ex.en}\u201D`),
              h("p", { class: "text-sm text-secondary" }, `\u201C${ex.vi}\u201D`),
            ),
          );
        }
        card.appendChild(exDiv);
      }
      card.appendChild(h("p", { class: "text-xs text-secondary/30 mt-3" }, "Tap to flip back"));
    }

    // Action buttons top-right
    const actions = h("div", { class: "absolute top-3 right-3 flex items-center gap-1" });

    const starBtn = h("button", {
      class: cn("p-1.5 rounded-lg transition-colors cursor-pointer", isStarred ? "text-warning" : "text-border hover:text-secondary"),
      "data-action": "true",
    });
    starBtn.appendChild(icon(Star, { size: 16, class: isStarred ? "fill-current" : "" }));
    starBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleStarred(word.id); this.render(); });
    actions.appendChild(starBtn);

    const learnBtn = h("button", {
      class: cn("p-1.5 rounded-lg transition-colors cursor-pointer", isLearned ? "text-success" : "text-border hover:text-secondary"),
      "data-action": "true",
    });
    learnBtn.appendChild(icon(Check, { size: 16 }));
    learnBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasLearned = flashcardStore.getState().learnedIds.includes(word.id);
      toggleLearned(word.id);
      if (!wasLearned && this.filter === "unlearned") {
        this.flipped = false;
      }
      this.render();
    });
    actions.appendChild(learnBtn);

    card.appendChild(actions);
    return card;
  }
}
