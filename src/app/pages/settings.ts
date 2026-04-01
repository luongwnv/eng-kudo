import { h } from "@/core/render/render";
import { navigate } from "@/core/router/router";
import { preferencesStore } from "@/features/Preferences/store/preferencesStore";
import { cn } from "@/shared/lib/cn";
import {
  icon,
  ArrowLeft,
  Settings,
  Sun,
  Moon,
  Monitor,
  Palette,
  Gamepad2,
  Keyboard,
  MousePointerClick,
  AlertTriangle,
  Trash2,
} from "@/shared/lib/icons";
import type { GameMode } from "@/shared/types";
import type { IconNode } from "lucide";

const themeIcons: Record<string, IconNode> = { dark: Moon, light: Sun, system: Monitor };

export function SettingsPage(): HTMLElement {
  const state = preferencesStore.getState();

  const backBtn = h("button", { class: "text-secondary hover:text-main transition-colors cursor-pointer" });
  backBtn.appendChild(icon(ArrowLeft, { size: 20 }));
  backBtn.addEventListener("click", () => navigate("/"));

  const titleEl = h("div", { class: "flex items-center gap-2" });
  titleEl.appendChild(h("span", { class: "text-2xl font-bold text-main" }, "Settings"));

  // Theme buttons
  const themeBtns = h("div", { class: "flex gap-1 rounded-xl bg-bg overflow-hidden" });
  for (const t of ["dark", "light", "system"] as const) {
    const btn = h("button", {
      class: cn(
        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-275 cursor-pointer capitalize",
        state.theme === t ? "bg-accent text-white" : "text-secondary hover:bg-border/30",
      ),
    });
    btn.appendChild(icon(themeIcons[t], { size: 14 }));
    btn.appendChild(document.createTextNode(` ${t}`));
    btn.addEventListener("click", () => {
      preferencesStore.setState({ theme: t });
      applyTheme(t);
      container.replaceWith(SettingsPage());
    });
    themeBtns.appendChild(btn);
  }

  // Mode buttons
  const modeBtns = h("div", { class: "flex gap-1 rounded-xl bg-bg overflow-hidden" });
  for (const [mode, label, iconNode] of [["pick", "Pick", MousePointerClick], ["input", "Type", Keyboard]] as [GameMode, string, IconNode][]) {
    const btn = h("button", {
      class: cn(
        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-275 cursor-pointer",
        state.defaultGameMode === mode ? "bg-accent text-white" : "text-secondary hover:bg-border/30",
      ),
    });
    btn.appendChild(icon(iconNode, { size: 14 }));
    btn.appendChild(document.createTextNode(` ${label}`));
    btn.addEventListener("click", () => {
      preferencesStore.setState({ defaultGameMode: mode });
      container.replaceWith(SettingsPage());
    });
    modeBtns.appendChild(btn);
  }

  // Reset button
  const resetBtn = h("button", {
    class: "flex items-center gap-2 rounded-xl bg-error/10 text-error px-4 py-2 text-sm font-medium border border-error/20 hover:bg-error/20 transition-colors cursor-pointer",
  });
  resetBtn.appendChild(icon(Trash2, { size: 14 }));
  resetBtn.appendChild(document.createTextNode("Reset All Data"));
  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  });

  const container = h(
    "div",
    { class: "animate-fade-in pb-8" },
    h("div", { class: "flex items-center gap-3 mb-6" }, backBtn, titleEl),

    // Appearance
    h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-6" },
      sectionHeader(Palette, "Appearance"),
      settingRow("Theme", "Choose your preferred theme", themeBtns),
      settingRow("Animations", "Enable UI animations",
        toggleSwitch(state.animationsEnabled, (v) => {
          preferencesStore.setState({ animationsEnabled: v });
          container.replaceWith(SettingsPage());
        }),
      ),
    ),

    // Game
    h(
      "div",
      { class: "rounded-xl bg-card p-6 mb-6" },
      sectionHeader(Gamepad2, "Game"),
      settingRow("Default Mode", "Preferred game mode", modeBtns),
      settingRow("Keyboard Shortcuts", "Use keyboard for navigation",
        toggleSwitch(state.hotkeysEnabled, (v) => {
          preferencesStore.setState({ hotkeysEnabled: v });
          container.replaceWith(SettingsPage());
        }),
      ),
    ),

    // Danger zone
    h(
      "div",
      { class: "rounded-xl bg-card p-6" },
      (() => {
        const hdr = h("div", { class: "flex items-center gap-2 border-b-2 border-error/20 pb-3 mb-4" });
        hdr.appendChild(icon(AlertTriangle, { size: 20, class: "text-error" }));
        hdr.appendChild(h("h3", { class: "text-xl font-bold text-error/80" }, "Danger Zone"));
        return hdr;
      })(),
      h("p", { class: "text-sm text-secondary mb-4" }, "Reset all progress, achievements, and settings."),
      resetBtn,
    ),
  );

  return container;
}

function sectionHeader(iconNode: IconNode, text: string): HTMLElement {
  const el = h("div", { class: "flex items-center gap-2 border-b-2 border-border pb-3 mb-4" });
  el.appendChild(icon(iconNode, { size: 20, class: "text-secondary" }));
  el.appendChild(h("h3", { class: "text-xl font-bold text-secondary" }, text));
  return el;
}

function settingRow(title: string, description: string, control: HTMLElement): HTMLElement {
  return h(
    "div",
    { class: "flex items-center justify-between py-4 border-b border-border/50 last:border-0" },
    h("div", null,
      h("h4", { class: "font-medium text-main" }, title),
      h("p", { class: "text-xs text-secondary" }, description),
    ),
    control,
  );
}

function toggleSwitch(value: boolean, onChange: (v: boolean) => void): HTMLElement {
  return h(
    "button",
    {
      class: cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-275 cursor-pointer",
        value ? "bg-accent" : "bg-border",
      ),
      onClick: () => onChange(!value),
    },
    h("span", {
      class: cn(
        "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-275",
        value ? "translate-x-6" : "translate-x-1",
      ),
    }),
  );
}

function applyTheme(theme: "dark" | "light" | "system"): void {
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light");
  else if (theme === "dark") root.classList.remove("light");
  else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) root.classList.remove("light");
    else root.classList.add("light");
  }
}
