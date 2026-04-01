import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";

interface InputOptions {
  placeholder?: string;
  value?: string;
  className?: string;
  autofocus?: boolean;
  onInput?: (value: string) => void;
  onEnter?: (value: string) => void;
}

export function Input(options: InputOptions = {}): HTMLInputElement {
  const { placeholder, value, className, autofocus, onInput, onEnter } = options;

  const el = h("input", {
    type: "text",
    class: cn(
      "game-input w-full max-w-md rounded-2xl border border-border bg-card px-5 py-4 text-lg text-secondary",
      "placeholder:text-base placeholder:font-normal placeholder:text-secondary/40",
      "transition-colors duration-200",
      className,
    ),
    ...(placeholder ? { placeholder } : {}),
    ...(value ? { value } : {}),
    ...(autofocus ? { autofocus: true } : {}),
  }) as HTMLInputElement;

  if (onInput) {
    el.addEventListener("input", () => onInput(el.value));
  }

  if (onEnter) {
    el.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") {
        onEnter(el.value);
      }
    });
  }

  return el;
}
