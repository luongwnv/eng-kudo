import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";
import { icon, CircleCheck, CircleX } from "@/shared/lib/icons";

interface FeedbackOptions {
  correct: boolean;
  correctAnswer: string;
  userAnswer?: string;
  example?: string;
}

export function AnswerFeedback(options: FeedbackOptions): HTMLElement {
  const { correct, correctAnswer, userAnswer, example } = options;

  const container = h(
    "div",
    {
      class: cn(
        "rounded-xl px-5 py-4 animate-fade-in",
        correct ? "bg-success/10 border border-success/20" : "bg-error/10 border border-error/20",
      ),
    },
  );

  if (correct) {
    const row = h("div", { class: "flex items-center gap-2 text-success font-semibold" });
    row.appendChild(icon(CircleCheck, { size: 20, class: "text-success" }));
    row.appendChild(h("span", null, "Correct!"));
    container.appendChild(row);
  } else {
    const row = h("div", { class: "flex items-center gap-2 text-error font-semibold mb-2" });
    row.appendChild(icon(CircleX, { size: 20, class: "text-error" }));
    row.appendChild(h("span", null, "Incorrect"));
    container.appendChild(row);

    if (userAnswer) {
      container.appendChild(h("p", { class: "text-sm text-secondary mb-1" }, `Your answer: "${userAnswer}"`));
    }
    container.appendChild(h("p", { class: "text-sm font-medium text-main" }, `Correct answer: ${correctAnswer}`));
  }

  if (example) {
    container.appendChild(h("p", { class: "text-sm text-secondary/70 mt-3 italic" }, `"${example}"`));
  }

  return container;
}
