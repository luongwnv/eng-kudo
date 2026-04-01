import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";

interface ProgressBarOptions {
  value: number;
  className?: string;
  color?: "accent" | "success" | "error" | "warning";
}

const colorMap: Record<string, string> = {
  accent: "bg-accent",
  success: "bg-success",
  error: "bg-error",
  warning: "bg-warning",
};

export function ProgressBar(options: ProgressBarOptions): HTMLElement {
  const { value, className, color = "accent" } = options;
  const clamped = Math.max(0, Math.min(100, value));

  return h(
    "div",
    { class: cn("h-2 w-full overflow-hidden rounded-full bg-border/40", className) },
    h("div", {
      class: cn("h-full rounded-full transition-all duration-300", colorMap[color]),
      style: `width: ${clamped}%`,
    }),
  );
}
