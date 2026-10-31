import { defineConfig } from "vite";
import vinext from "vinext";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  // Tailwind runs as a Vite plugin; an empty PostCSS config stops Vite from
  // also running postcss.config.mjs (kept for `next build`).
  css: { postcss: { plugins: [] } },
  plugins: [
    tailwindcss(),
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
