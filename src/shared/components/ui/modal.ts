import { h } from "@/core/render/render";

interface ModalOptions {
  title: string;
  children?: Node[];
  onClose?: () => void;
}

export function Modal(options: ModalOptions): HTMLElement {
  const { title, children = [], onClose } = options;

  const backdrop = h(
    "div",
    {
      class: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm",
    },
    h(
      "div",
      {
        class: "relative w-full max-w-md rounded-2xl bg-card p-6 shadow-xl animate-slide-up",
      },
      h(
        "div",
        { class: "mb-4 flex items-center justify-between border-b-2 border-border pb-3" },
        h("h2", { class: "text-lg font-bold text-main" }, title),
        h(
          "button",
          {
            class: "text-secondary hover:text-main transition-colors cursor-pointer text-xl",
            onClick: () => {
              backdrop.remove();
              onClose?.();
            },
          },
          "\u2715",
        ),
      ),
      ...children,
    ),
  );

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      backdrop.remove();
      onClose?.();
    }
  });

  return backdrop;
}
