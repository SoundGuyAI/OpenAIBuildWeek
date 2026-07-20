import { iwsdkDev } from "@iwsdk/vite-plugin-dev";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ command, isPreview }) => ({
  plugins:
    command === "serve" && !isPreview
      ? [
          mkcert(),
          iwsdkDev({
            emulator: { device: "metaQuest3" },
            ai: { mode: "agent" },
            verbose: true,
          }),
        ]
      : [],
  server: { host: "0.0.0.0", port: 8081, open: true },
  preview: { host: "0.0.0.0", port: 4173 },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV !== "production",
    target: "esnext",
    rollupOptions: { input: "./index.html" },
  },
  esbuild: { target: "esnext" },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
    esbuildOptions: { target: "esnext" },
  },
  publicDir: "public",
  base: "./",
}));
