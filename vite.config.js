import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://69.62.85.170:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
