import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";
import { icon, CircleCheck, CircleX, CircleArrowRight } from "@/shared/lib/icons";

type BarState = "check" | "correct" | "wrong";

interface BottomBarOptions {
  state: BarState;
  onAction: () => void;
  disabled?: boolean;
  current?: number;
  total?: number;
}

export function GameBottomBar(options: BottomBarOptions): HTMLElement {
  const { state, onAction, disabled = false, current, total } = options;

  const stateConfig = {
    check: { label: "Check", color: "text-accent", bgColor: "", iconNode: CircleCheck },
    correct: { label: "Continue", color: "text-success", bgColor: "bg-success/5", iconNode: CircleArrowRight },
    wrong: { label: "Continue", color: "text-error", bgColor: "bg-error/5", iconNode: CircleArrowRight },
  };
  const config = stateConfig[state];

  // Feedback icon
  const feedback =
    state === "correct"
      ? (() => {
          const el = h("div", { class: "flex items-center gap-2 text-success font-semibold animate-fade-in" });
          el.appendChild(icon(CircleCheck, { size: 28, class: "text-success" }));
          el.appendChild(h("span", null, "Correct!"));
          return el;
        })()
      : state === "wrong"
        ? (() => {
            const el = h("div", { class: "flex items-center gap-2 text-error font-semibold animate-fade-in" });
            el.appendChild(icon(CircleX, { size: 28, class: "text-error" }));
            el.appendChild(h("span", null, "Wrong"));
            return el;
          })()
        : null;

  // Action button
  const actionBtn = h(
    "button",
    {
      class: cn(
        "flex items-center justify-center gap-2 rounded-2xl px-8 py-3 text-lg font-semibold",
        "border-b-8 border-secondary-accent btn-3d cursor-pointer",
        "bg-card transition-all duration-200",
        config.color,
        disabled && "opacity-50 cursor-not-allowed",
      ),
      ...(disabled ? { disabled: true } : {}),
    },
  );
  actionBtn.appendChild(document.createTextNode(config.label));
  actionBtn.appendChild(icon(config.iconNode, { size: 22 }));
  actionBtn.addEventListener("click", () => { if (!disabled) onAction(); });

  const stats =
    current != null && total != null
      ? h("span", { class: "text-sm text-secondary" }, `${current} / ${total}`)
      : null;

  return h(
    "div",
    {
      class: cn(
        "fixed right-0 left-0 bottom-0 z-40 border-t-2 border-border px-6 py-4",
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between",
        "bg-card",
        config.bgColor,
      ),
    },
    h("div", { class: "flex items-center gap-4" }, feedback, stats),
    actionBtn,
  );
}
