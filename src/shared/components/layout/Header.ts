import { h } from "@/core/render/render";
import { navigate, getCurrentPath } from "@/core/router/router";
import { cn } from "@/shared/lib/cn";
import { icon, Home, Target, Zap, Flame, BarChart3, Trophy, Settings, Sparkles } from "@/shared/lib/icons";

interface NavItem {
  label: string;
  path: string;
  iconNode: Parameters<typeof icon>[0];
}

const navItems: NavItem[] = [
  { label: "Flashcards", path: "/", iconNode: Sparkles },
  { label: "Vocabulary", path: "/vocabulary", iconNode: Target },
  { label: "Blitz", path: "/blitz", iconNode: Zap },
  { label: "Gauntlet", path: "/gauntlet", iconNode: Flame },
];

const secondaryItems: NavItem[] = [
  { label: "Home", path: "/home", iconNode: Home },
  { label: "Progress", path: "/progress", iconNode: BarChart3 },
  { label: "Achievements", path: "/achievements", iconNode: Trophy },
  { label: "Settings", path: "/settings", iconNode: Settings },
];

export function Header(): HTMLElement {
  const currentPath = getCurrentPath();

  const logo = h(
    "button",
    {
      class: "text-2xl font-bold text-main cursor-pointer hover:text-accent transition-colors duration-275",
      onClick: () => navigate("/"),
    },
    "eng-kudo",
  );

  const navBtn = (item: NavItem) => {
    const isActive = currentPath === item.path;
    const btn = h(
      "button",
      {
        class: cn(
          "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-275 cursor-pointer",
          isActive
            ? "bg-card text-main"
            : "text-secondary hover:bg-card hover:text-main",
        ),
      },
    );
    btn.appendChild(icon(item.iconNode, { size: 16, class: "shrink-0" }));
    btn.appendChild(document.createTextNode(` ${item.label}`));
    btn.addEventListener("click", () => navigate(item.path));
    return btn;
  };

  const iconBtn = (item: NavItem) => {
    const isActive = currentPath === item.path;
    const btn = h(
      "button",
      {
        class: cn(
          "rounded-xl p-2 transition-all duration-275 cursor-pointer",
          isActive
            ? "bg-card text-main"
            : "text-secondary hover:bg-card hover:text-main",
        ),
        title: item.label,
      },
    );
    btn.appendChild(icon(item.iconNode, { size: 18 }));
    btn.addEventListener("click", () => navigate(item.path));
    return btn;
  };

  return h(
    "header",
    { class: "flex items-center justify-between px-6 py-4" },
    h(
      "div",
      { class: "flex items-center gap-4" },
      logo,
      h(
        "nav",
        { class: "hidden sm:flex items-center gap-1" },
        ...navItems.map(navBtn),
      ),
    ),
    h(
      "div",
      { class: "flex items-center gap-1" },
      ...secondaryItems.map(iconBtn),
    ),
  );
}
