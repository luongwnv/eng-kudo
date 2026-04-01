import "@/styles/main.css";
import { createApp } from "@/app";
import { preferencesStore } from "@/features/Preferences/store/preferencesStore";

// Apply saved theme immediately on startup
const theme = preferencesStore.getState().theme;
if (theme === "light") {
  document.documentElement.classList.add("light");
} else if (theme === "system") {
  if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("light");
  }
}

const root = document.getElementById("app");
if (root) {
  createApp(root);
}
