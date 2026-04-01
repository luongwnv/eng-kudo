import { h } from "@/core/render/render";
import { Header } from "@/shared/components/layout/Header";

export function AppLayout(): { container: HTMLElement; content: HTMLElement } {
  const content = h("main", {
    class: "mx-auto w-full px-4 py-8 sm:w-3/4 md:w-2/3 lg:w-1/2",
  });

  const container = h(
    "div",
    { class: "flex min-h-screen flex-col bg-bg" },
    Header(),
    content,
  );

  return { container, content };
}
