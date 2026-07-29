import fs from "node:fs";
import path from "node:path";
import { ROUTE_META, SITE } from "../src/seo/routeMeta.js";

/**
 * Emits a real dist/<route>/index.html for every static route, with that
 * route's <title>, description, Open Graph, Twitter and canonical tags baked
 * into the raw HTML. Also regenerates dist/sitemap.xml from the same map.
 *
 * Crawlers that do not execute JS (Facebook, WhatsApp, LinkedIn, X) read these
 * files and finally get per-page previews instead of the homepage's tags.
 *
 * This is NOT prerendering — the page body is still the empty #root div and the
 * SPA boots exactly as before. That is deliberate: the app calls createRoot(),
 * not hydrateRoot(), so React discards any server markup. Shipping prerendered
 * body content would paint and then be wiped, causing a flash that costs LCP
 * and CLS. Meta-only injection carries no such risk and ships an identical
 * bundle, so runtime performance is untouched.
 *
 * SERVER REQUIREMENT: the host must prefer a real file over the SPA fallback,
 * e.g. nginx `try_files $uri $uri/index.html /index.html;`. Netlify, Vercel,
 * S3+CloudFront and GitHub Pages already do this by default.
 */

const escapeAttr = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Replace the *content* of a tag matched by attribute, leaving the rest alone.
function setMeta(html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+[^>]*${attr}=["']${key}["'][^>]*content=["'])[^"']*(["'])`,
    "i",
  );
  if (re.test(html)) return html.replace(re, `$1${escapeAttr(value)}$2`);
  // content may precede the identifying attribute
  const re2 = new RegExp(
    `(<meta\\s+[^>]*content=["'])[^"']*(["'][^>]*${attr}=["']${key}["'])`,
    "i",
  );
  return re2.test(html) ? html.replace(re2, `$1${escapeAttr(value)}$2`) : html;
}

function buildHtml(baseHtml, routePath, meta) {
  const url = SITE.origin + (routePath === "/" ? "/" : routePath);
  let html = baseHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttr(meta.title)}</title>`,
  );
  html = setMeta(html, "name", "title", meta.title);
  html = setMeta(html, "name", "description", meta.description);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.description);
  html = setMeta(html, "name", "twitter:url", url);

  html = html.replace(
    /(<link\s+rel=["']canonical["']\s+href=["'])[^"']*(["'])/i,
    `$1${url}$2`,
  );
  return html;
}

function sitemap(lastmod) {
  const entries = Object.entries(ROUTE_META)
    .map(([route, meta]) => {
      const loc = SITE.origin + (route === "/" ? "/" : route);
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <priority>${meta.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    "<!-- Generated at build time from src/seo/routeMeta.js. Do not edit by hand.",
    "     Dynamic vendor/venue/blog URLs are not included; they must be added",
    "     from the API server-side. -->",
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

export default function seoRoutePages() {
  let outDir = "dist";
  return {
    name: "seo-route-pages",
    apply: "build",
    configResolved(cfg) {
      outDir = cfg.build.outDir || "dist";
    },
    closeBundle() {
      const root = path.resolve(outDir);
      const indexPath = path.join(root, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const base = fs.readFileSync(indexPath, "utf8");
      let written = 0;

      for (const [routePath, meta] of Object.entries(ROUTE_META)) {
        const html = buildHtml(base, routePath, meta);
        if (routePath === "/") {
          fs.writeFileSync(indexPath, html);
        } else {
          const dir = path.join(root, routePath.replace(/^\//, ""));
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
        }
        written++;
      }

      const lastmod = new Date().toISOString().slice(0, 10);
      fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap(lastmod));

      this.info?.(
        `seo-route-pages: ${written} route pages + sitemap.xml (${Object.keys(ROUTE_META).length} urls)`,
      );
    },
  };
}
