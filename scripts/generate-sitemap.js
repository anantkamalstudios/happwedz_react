import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://happywedz.com";
const API_BASE = process.env.VITE_API_URL || "https://happywedz.com/api";
const PROD_API_BASE = "https://happywedz.com/api";
const OUTPUT_PATH = path.resolve(__dirname, "../public/sitemap.xml");
const TODAY = new Date().toISOString().split("T")[0];

// ---------------------------------------------------------------------------
// 1. Static routes
// ---------------------------------------------------------------------------
const staticUrls = [
  // Homepage
  { loc: "/", changefreq: "daily", priority: "1.0" },

  // Wedding Venues - Major Cities
  { loc: "/wedding-venues", changefreq: "daily", priority: "0.9" },
  { loc: "/wedding-venues/pune", changefreq: "daily", priority: "0.9" },
  { loc: "/wedding-venues/nashik", changefreq: "daily", priority: "0.9" },
  { loc: "/wedding-venues/mumbai", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/delhi-ncr", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/bangalore", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/jaipur", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/hyderabad", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/kolkata", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/chennai", changefreq: "daily", priority: "0.8" },
  { loc: "/wedding-venues/lucknow", changefreq: "daily", priority: "0.8" },

  // Wedding Vendors - Category Pages
  { loc: "/vendors", changefreq: "daily", priority: "0.9" },
  { loc: "/vendors/photographers/all", changefreq: "weekly", priority: "0.8" },
  { loc: "/vendors/bridal-makeup/all", changefreq: "weekly", priority: "0.8" },
  { loc: "/vendors/bridal-wear/all", changefreq: "weekly", priority: "0.8" },
  { loc: "/vendors/groom-wear/all", changefreq: "weekly", priority: "0.8" },
  { loc: "/vendors/decorators/all", changefreq: "weekly", priority: "0.8" },
  {
    loc: "/vendors/wedding-planners/all",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    loc: "/vendors/catering-services/all",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    loc: "/vendors/mehendi-artists/all",
    changefreq: "weekly",
    priority: "0.8",
  },
  { loc: "/vendors/invitations/all", changefreq: "weekly", priority: "0.8" },
  {
    loc: "/vendors/jewellery-accessories/all",
    changefreq: "weekly",
    priority: "0.8",
  },
  { loc: "/top-rated", changefreq: "weekly", priority: "0.8" },

  // Destination Weddings
  { loc: "/destination-wedding", changefreq: "weekly", priority: "0.85" },
  {
    loc: "/destination-wedding/udaipur",
    changefreq: "weekly",
    priority: "0.75",
  },
  { loc: "/destination-wedding/goa", changefreq: "weekly", priority: "0.75" },
  {
    loc: "/destination-wedding/jaipur",
    changefreq: "weekly",
    priority: "0.75",
  },
  {
    loc: "/destination-wedding/kerala",
    changefreq: "weekly",
    priority: "0.75",
  },
  {
    loc: "/destination-wedding/mussoorie",
    changefreq: "weekly",
    priority: "0.75",
  },

  // Honeymoon & Travel
  { loc: "/honeymoon", changefreq: "weekly", priority: "0.8" },
  { loc: "/honeymoon/flights", changefreq: "weekly", priority: "0.7" },
  { loc: "/honeymoon/hotels", changefreq: "weekly", priority: "0.7" },
  { loc: "/honeymoon/cabs", changefreq: "weekly", priority: "0.7" },
  { loc: "/honeymoon/insurance", changefreq: "weekly", priority: "0.7" },
  { loc: "/hotels", changefreq: "weekly", priority: "0.7" },

  // Digital Invitations & Studio
  { loc: "/einvites", changefreq: "weekly", priority: "0.8" },
  { loc: "/video-templates", changefreq: "monthly", priority: "0.7" },
  // Virtual try-on disabled — route commented out in App.jsx
  // { loc: "/try", changefreq: "monthly", priority: "0.7" },

  // AI Wedding Tools
  { loc: "/ai-features", changefreq: "weekly", priority: "0.8" },
  { loc: "/shaadi-ai", changefreq: "weekly", priority: "0.75" },
  { loc: "/culture-blender", changefreq: "monthly", priority: "0.6" },
  { loc: "/personality-quiz", changefreq: "monthly", priority: "0.6" },
  { loc: "/conflict-resolver", changefreq: "monthly", priority: "0.6" },
  { loc: "/timeline-generator", changefreq: "monthly", priority: "0.6" },

  // Matrimonial
  { loc: "/matrimonial", changefreq: "weekly", priority: "0.8" },
  { loc: "/matrimonial-search", changefreq: "weekly", priority: "0.7" },

  // Real Weddings & Blog
  { loc: "/blog", changefreq: "weekly", priority: "0.8" },
  { loc: "/photography/all/all", changefreq: "weekly", priority: "0.7" },

  // Company & Legal
  { loc: "/about-us", changefreq: "monthly", priority: "0.6" },
  { loc: "/contact-us", changefreq: "monthly", priority: "0.6" },
  { loc: "/careers", changefreq: "monthly", priority: "0.5" },
  { loc: "/sitemap", changefreq: "weekly", priority: "0.6" },
  { loc: "/claim-your-buisness", changefreq: "monthly", priority: "0.5" },
  { loc: "/customer-login", changefreq: "yearly", priority: "0.3" },
  { loc: "/customer-register", changefreq: "yearly", priority: "0.3" },
  { loc: "/vendor-login", changefreq: "yearly", priority: "0.3" },
  { loc: "/vendor-register", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.2" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.2" },
  { loc: "/cancellation", changefreq: "yearly", priority: "0.2" },
];

function toSlug(str) {
  return (
    (str || "all")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || "all"
  );
}

async function fetchWithFallback(endpoint) {
  const urls = [`${API_BASE}${endpoint}`, `${PROD_API_BASE}${endpoint}`];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next fallback
    }
  }
  return null;
}

async function fetchDynamicUrls() {
  const dynamicUrls = [];
  const seenLocs = new Set();

  const addUrl = (entry) => {
    if (!seenLocs.has(entry.loc)) {
      seenLocs.add(entry.loc);
      dynamicUrls.push(entry);
    }
  };

  // 1. Fetch Vendor Services (Venues and Vendors)
  try {
    console.log("Fetching vendor-services (venues and vendors)...");
    const res = await fetchWithFallback("/vendor-services?limit=10000");
    const items = res?.data || res?.items || (Array.isArray(res) ? res : []);

    for (const item of items) {
      const slug = item.slug || item.attributes?.slug || item.id;
      if (!slug) continue;

      const isVenue =
        item.vendor_type === "venue" ||
        item.attributes?.vendor_type === "venue" ||
        item.subcategory?.type === "venue";

      const rawCity =
        item.city || item.attributes?.city || item.vendor?.city || "all";
      const citySlug = toSlug(rawCity);

      if (isVenue) {
        addUrl({
          loc: `/wedding-venues/${citySlug}/${slug}`,
          changefreq: "weekly",
          priority: "0.75",
          lastmod:
            (item.updatedAt || item.updated_at || "").split("T")[0] || TODAY,
        });
      } else {
        const rawSubcat =
          item.subcategory?.name ||
          item.attributes?.subcategory_name ||
          item.attributes?.vendor_type ||
          "all";
        const subcatSlug = toSlug(rawSubcat);

        addUrl({
          loc: `/vendors/${subcatSlug}/${citySlug}/${slug}`,
          changefreq: "weekly",
          priority: "0.7",
          lastmod:
            (item.updatedAt || item.updated_at || "").split("T")[0] || TODAY,
        });
      }
    }
    console.log(`  ✓ ${dynamicUrls.length} vendor/venue profile URLs found`);
  } catch (err) {
    console.warn("  ⚠ Could not fetch vendor-services:", err.message);
  }

  // 2. Fetch Blogs
  const blogStartCount = dynamicUrls.length;
  try {
    console.log("Fetching blogs...");
    const blogRes = await fetchWithFallback("/blogs/all");
    const blogs =
      blogRes?.data ||
      blogRes?.blogs ||
      (Array.isArray(blogRes) ? blogRes : []);

    for (const b of blogs) {
      const id = b.slug || b._id || b.id;
      if (!id) continue;
      addUrl({
        loc: `/blog/${id}`,
        changefreq: "monthly",
        priority: "0.6",
        lastmod: (b.createdDate || b.createdAt || "").split("T")[0] || TODAY,
      });
    }
    console.log(`  ✓ ${dynamicUrls.length - blogStartCount} blog URLs added`);
  } catch (err) {
    console.warn("  ⚠ Could not fetch blogs:", err.message);
  }

  return dynamicUrls;
}

function buildXml(allUrls) {
  const entries = allUrls.map(({ loc, changefreq, priority, lastmod }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>
    <loc>${BASE_URL}${loc}</loc>${lastmodTag}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n\n")}
</urlset>
`;
}

(async () => {
  console.log("\n==========================================");
  console.log("🗺️  HappyWedz Dynamic Sitemap Generator");
  console.log("==========================================");

  const statics = staticUrls.map((u) => ({ ...u, lastmod: TODAY }));
  const dynamic = await fetchDynamicUrls();
  const allUrls = [...statics, ...dynamic];

  const xml = buildXml(allUrls);
  fs.writeFileSync(OUTPUT_PATH, xml, "utf8");

  console.log(`\n✅ Generated sitemap at: ${OUTPUT_PATH}`);
  console.log(
    `📊 Total URLs: ${allUrls.length} (${statics.length} static + ${dynamic.length} dynamic)\n`,
  );
})();
