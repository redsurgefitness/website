// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

export default defineConfig({
  site: "https://redsurgefitness.com",
  output: "server",

  adapter: cloudflare({
    imageService: "compile",
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push", "gtag"],
      },
    }),
  ],
});
