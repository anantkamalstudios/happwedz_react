import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
import seoRoutePages from "./plugins/seoRoutePages.js";

export default defineConfig({
  plugins: [
    react(),
    // Bundle analysis is opt-in (ANALYZE=true npx vite build) — brotli-sizing
    // every chunk is memory-heavy and slows down normal production builds.
    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: "bundle-report.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
    // Gzip compress all JS/CSS/SVG chunks for production.
    // Requires the web server to serve the .gz files (nginx: gzip_static on).
    compression({ algorithm: "gzip", ext: ".gz", threshold: 1024 }),
    // Bakes per-route <head> tags into dist/<route>/index.html and regenerates
    // sitemap.xml, so non-JS crawlers stop seeing the homepage on every URL.
    seoRoutePages(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://happywedz.com",
        changeOrigin: true,
        secure: false,
      },
      // Proxy to avoid CORS blocks from the browser when running locally.
      // The Vite dev server forwards the request server-side, which has no CORS restriction.
      "/restcountries": {
        target: "https://restcountries.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/restcountries/, ""),
        secure: true,
      },
      "/countriesnow": {
        target: "https://countriesnow.space",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/countriesnow/, ""),
        secure: true,
      },
    },
  },
  // NOTE: the server.proxy entries above only fire for RELATIVE paths ("/api/x").
  // The app builds absolute URLs from VITE_API_URL (https://happywedz.com/api),
  // so those requests bypass the proxy entirely, in dev as well as preview.
  // Local API calls work only because the backend CORS-whitelists
  // http://localhost:5173 (verified: :5173 -> 200 + Access-Control-Allow-Origin,
  // :4173 -> no CORS header). Preview the build on port 5173 to get real data:
  //   npm run preview -- --port 5173
  // None of this affects production, where the site and API share an origin.
  build: {
    // Skip gzip-sizing every chunk for the console report — pure cosmetics
    // that adds minutes to builds with a large dependency graph.
    reportCompressedSize: false,
    // Suppress chunk size warnings — we know about vendor-pdf/face-api
    chunkSizeWarningLimit: 1600,
    // CSS code splitting: each async route gets its own CSS chunk (not one giant blob)
    cssCodeSplit: true,
    // Fast, high-quality CSS minification
    cssMinify: "esbuild",
    // Target modern browsers — removes transpilation overhead
    target: "esnext",
    // Minify with esbuild (faster & produces smaller output than Terser)
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Rollup's synthetic CommonJS interop helper is a tiny module shared
          // by nearly every CJS dependency. It is NOT under node_modules, so the
          // guard below would let it fall through to Rollup's default placement —
          // which parks it inside whichever heavy vendor chunk (fabric, leaflet,
          // …) is emitted first. The entry then imports that one helper, dragging
          // hundreds of KB of route-only code onto every page, including the
          // homepage. Pin it to the always-loaded core chunk instead.
          if (
            id.includes("commonjsHelpers") ||
            id.includes("commonjs-dynamic-modules")
          )
            return "vendor-react-core";

          if (!id.includes("node_modules")) return;

          // Resolve the actual package name from the path (scoped-aware),
          // so we match on package BOUNDARIES instead of substrings.
          const match = id.match(
            /node_modules[\\/](?:\.pnpm[\\/])?(@[^\\/]+[\\/][^\\/]+|[^\\/]+)/
          );
          const pkg = match ? match[1].replace(/\\/g, "/") : "";

          // Heavy, route-specific libraries -> their own on-demand chunks.
          // NOTE: fabric is intentionally NOT given a manual chunk. It is a
          // CommonJS lib used by exactly one lazy route (the video editor), and
          // isolating it caused Rollup to hoist the shared CJS interop helper
          // into vendor-fabric — which then got imported by the entry chunk,
          // forcing 304KB of canvas code to download on the homepage. Letting
          // Rollup place it naturally keeps it inside the video-editor route.
          // sweetalert2 is imported by 31 LAZY routes and none of the eager
          // ones, yet it was landing in the entry chunk: Rollup hoists a module
          // shared by many async chunks into the entry instead of duplicating
          // it. That put 77 KB — 29% of the entry — on every page, including a
          // homepage that never shows an alert. It is pure ESM, so isolating it
          // does not repeat the CJS-interop problem described above for fabric.
          if (pkg === "sweetalert2") return "vendor-sweetalert2";

          if (pkg.includes("leaflet")) return "vendor-leaflet";
          if (pkg.includes("pannellum")) return "vendor-pannellum";
          if (pkg.includes("face-api")) return "vendor-face-api";
          if (pkg.startsWith("@react-pdf")) return "vendor-pdf";
          if (pkg === "xlsx") return "vendor-xlsx";
          // NOTE: vendor-charts (recharts/chart.js) and vendor-lucide are intentionally
          // NOT assigned manual chunks here. Letting Rollup place them in the lazy route
          // chunks that import them (dashboard, etc.) ensures React is always initialised
          // first — a manual vendor-charts chunk caused a circular dependency that made
          // React.forwardRef undefined at boot time.

          // Keep React + Router + Redux + Immer in ONE chunk so libraries like recharts
          // that call React.forwardRef always find React already initialised.
          // Immer must be here too: @reduxjs/toolkit uses it, and Rollup was accidentally
          // placing shared Immer utilities inside vendor-charts, creating a circular
          // dependency that caused React.forwardRef to be undefined at boot.
          const REACT_CORE = new Set([
            "react",
            "react-dom",
            "scheduler",
            "react-router",
            "react-router-dom",
            "redux",
            "react-redux",
            "@reduxjs/toolkit",
            "use-sync-external-store",
            "immer",
          ]);
          if (REACT_CORE.has(pkg)) return "vendor-react-core";



          // emotion (the styling runtime) is tiny and can be pulled in by an
          // eager dependency; keep it in its OWN chunk so it never drags the
          // heavy @mui component code onto pages that don't use MUI (e.g. the
          // homepage). @mui stays in vendor-mui and only loads with its routes.
          if (pkg.startsWith("@emotion")) return "vendor-emotion";
          // @mui intentionally has NO manual chunk: it's used only by ~7 lazy
          // routes. Forcing it into one vendor-mui chunk made Rollup hoist a few
          // shared MUI symbols into that 129KB chunk and then import them from
          // the entry, dragging all of MUI onto the homepage. Letting Rollup
          // place it naturally keeps MUI inside the lazy route chunks.

          // Everything else: let Rollup handle chunking naturally
          // to avoid creating hundreds of chunks, which causes Out of Memory errors.
          // return "vendor-" + pkg.replace(/^@/, "").replace(/\//g, "-");
        },
      },
    },
  },
});
