import { h } from "@/core/render/render";
import { cn } from "@/shared/lib/cn";

interface TimerOptions {
  seconds: number;
  onTick?: (remaining: number) => void;
  onEnd?: () => void;
  className?: string;
}

interface TimerControl {
  el: HTMLElement;
  start: () => void;
  stop: () => void;
  getRemaining: () => number;
}

export function Timer(options: TimerOptions): TimerControl {
  const { seconds, onTick, onEnd, className } = options;
  let remaining = seconds;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const display = h(
    "div",
    {
      class: cn("text-4xl font-mono font-bold tabular-nums text-main", className),
    },
    formatTimer(remaining),
  );

  function formatTimer(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function updateDisplay(): void {
    display.textContent = formatTimer(remaining);
    if (remaining <= 10) {
      display.style.color = "var(--error-color)";
      display.style.animation = "pulse-soft 1s ease-in-out infinite";
    }
  }

  function start(): void {
    if (intervalId) return;
    intervalId = setInterval(() => {
      remaining--;
      updateDisplay();
      onTick?.(remaining);
      if (remaining <= 0) {
        stop();
        onEnd?.();
      }
    }, 1000);
  }

  function stop(): void {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return { el: display, start, stop, getRemaining: () => remaining };
}
