import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react() as any,
    tailwindcss()
  ],
  resolve: {
    conditions: ["@convex-dev/component-source"],
  }
});
