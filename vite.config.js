import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig(({ command }) => ({
  base: command === "serve" ? "/" : "/WSS2/",
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        wss2: fileURLToPath(new URL("./wss2.html", import.meta.url)),
        host: fileURLToPath(new URL("./host.html", import.meta.url)),
        mainVisual: fileURLToPath(new URL("./main-visual.html", import.meta.url)),
      },
    },
  },
}));
