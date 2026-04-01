import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";

interface CardOptions {
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  children?: Node[];
}

export function Card(options: CardOptions = {}): HTMLElement {
  const { className, onClick, hoverable = false, children = [] } = options;

  const el = h(
    "div",
    {
      class: cn(
        "rounded-xl bg-card p-6",
        hoverable &&
          "cursor-pointer transition-all duration-275 ease-in-out hover:bg-border/30",
        onClick && "hover:cursor-pointer",
        className,
      ),
      ...(onClick ? { role: "button", tabindex: "0" } : {}),
    },
    ...children,
  );

  if (onClick) {
    el.addEventListener("click", onClick);
    el.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") onClick();
    });
  }

  return el;
}
