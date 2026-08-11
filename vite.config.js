import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/*.xlsx"],
    },
    proxy: {
      "/api": {
        target: "https://happywedz.com",
        changeOrigin: true,
        secure: false,
      },
    },
    // Pre-transform the entry graph on server start so the first navigation
    // doesn't pay for a waterfall of on-demand module transforms.
    warmup: {
      clientFiles: [
        "./src/main.jsx",
        "./src/App.jsx",
        "./src/components/pages/Home.jsx",
        "./src/components/home/Herosection.jsx",
        "./src/components/layouts/Header.jsx",
      ],
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Only pin the handful of packages that genuinely belong to the entry
        // graph (every route needs them, and they change rarely — good caching).
        //
        // Everything else is deliberately left to Rollup's automatic splitting.
        // A catch-all `return "vendor"` here is actively harmful: it collapses all
        // of node_modules into one chunk, so the entry importing any single module
        // drags in face-api/fabric/xlsx/firebase/leaflet too.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id))
            return "react-vendor";
          if (id.includes("react-router")) return "router";
          if (id.includes("@reduxjs") || id.includes("react-redux"))
            return "redux";
        },
      },
    },
  },
});
