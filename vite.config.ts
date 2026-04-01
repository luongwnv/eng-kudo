import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/eng-kudo/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
      output: {
        // Single bundle - no code splitting for Chrome extension
        manualChunks: undefined,
        // Stable file names (no hash) for easier CSP
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    cssCodeSplit: false,
  },
});
