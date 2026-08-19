import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// The entry stylesheet is bootstrap.min.css + index.css + App.critical.css:
// ~314KB raw, 47KB gzipped, and it blocked first render for 1060ms with ~300ms
// of estimated savings. Only 465 of its 3456 rules are used by the first render
// of "/" (12KB gzipped worth), so those go inline in <head> and the full sheet
// loads asynchronously behind them.
//
// The async form is `media="print"` + an onload that flips it back to `all`,
// which every browser treats as non-blocking, with a <noscript> copy so the
// page is still styled with JS disabled. The inline block is emitted *before*
// the link, so when the full sheet lands the cascade resolves exactly as it did
// when the whole thing was one blocking file.
//
// src/critical.inline.css is generated — see scripts/extract-critical-css.js for
// how to regenerate it and when you need to.
function inlineCriticalCss() {
  return {
    name: "inline-critical-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const file = path.resolve(projectRoot, "src/critical.inline.css");
        if (!fs.existsSync(file)) {
          console.warn(
            "[inline-critical-css] src/critical.inline.css missing — shipping the entry stylesheet as render-blocking."
          );
          return html;
        }
        const critical = fs.readFileSync(file, "utf8");

        // Make the entry stylesheet non-blocking. Only the entry sheet is
        // matched; route-level CSS chunks are injected by the JS loader and are
        // already off the critical path.
        let matched = false;
        const deferred = html.replace(
          /<link([^>]*?)rel="stylesheet"([^>]*?)href="(\/assets\/index-[^"]+\.css)"([^>]*?)>/,
          (_m, a, b, href, c) => {
            matched = true;
            const attrs = `${a}${b}${c}`.replace(/\s+/g, " ").trim();
            // __cssReady gates removal of the app shell — see LoaderContext.jsx.
            return (
              `<link ${attrs} rel="stylesheet" href="${href}" media="print" onload="this.media='all';this.onload=null;window.__cssReady=1">` +
              `<noscript><link ${attrs} rel="stylesheet" href="${href}"></noscript>`
            );
          }
        );
        if (!matched) {
          console.warn(
            "[inline-critical-css] entry stylesheet <link> not found — critical CSS not applied."
          );
          return html;
        }

        // The extracted critical rules used to be inlined here, ~53KB of them.
        // They are dead weight now and actively harmful: the app shell in
        // index.html carries its own <style>, #root is empty until React mounts,
        // and React cannot mount until well after the stylesheet above has
        // landed — so nothing is ever rendered that these rules would style.
        // All they did was add ~12KB gzipped to the critical-path document and a
        // 53KB parse before first paint, delaying both FCP (the shell's text)
        // and LCP (the shell's hero image, which cannot start downloading until
        // the document is parsed).
        // Kept generated and available rather than deleted: if the shell is ever
        // removed, or something starts rendering into #root before the
        // stylesheet arrives, inlining these again is the fix.
        void critical;
        return deferred;
      },
    },
  };
}

// `npm run dev:https` only. navigator.geolocation is gated behind a secure
// context, so testing location detection on a real phone over
// http://<lan-ip>:5173 silently fails no matter how good the device's GPS is —
// that run needs a self-signed cert.
//
// Opt-in rather than always-on: switching the dev server to HTTPS breaks every
// existing http://localhost:5173 tab and bookmark, which is not a fair price for
// a workflow most days don't need.
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // apply: "serve" so `vite build` never pays for certificate generation
    ...(mode === "https" ? [{ ...basicSsl(), apply: "serve" }] : []),
    inlineCriticalCss(),
  ],
  server: {
    // Listen on the LAN so a phone on the same network can reach the dev server
    host: true,
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
  preview: {
    proxy: {
      "/api": {
        target: "https://happywedz.com",
        changeOrigin: true,
        secure: false,
      },
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
}));
