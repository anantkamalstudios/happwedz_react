import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://www.happywedz.com/ai",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
      "/api-main": {
        target: "https://happywedz.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-main/, "/api"),
        secure: false,
      },
    },
  },
});