/**
 * Single source of truth for per-route <head> metadata.
 *
 * WHY THIS EXISTS
 * Metadata was only ever applied at runtime by useDocumentMetadata. Facebook,
 * WhatsApp, LinkedIn and X do not execute JavaScript — they read the raw HTML —
 * so every shared URL previewed as the homepage. Only 3 of these routes set any
 * metadata even client-side; the rest inherited the homepage tags entirely.
 *
 * A Vite plugin (see vite.config.js) reads this map at build time and emits a
 * real dist/<route>/index.html with these tags baked in, plus dist/sitemap.xml.
 * Generating both from one map means the sitemap cannot drift from the routes.
 *
 * SCOPE: static routes only. Dynamic pages (/:section/:city/:slug, /blog/:id,
 * vendor and venue detail pages) cannot be enumerated here — they need meta
 * injected server-side from the API. That is still outstanding.
 *
 * The `/`, `/about-us` and `/einvites` entries are copied verbatim from the
 * existing useDocumentMetadata calls so nothing changes for those pages. The
 * remainder describe what each page actually does and are worth a review by
 * whoever owns SEO copy.
 */

export const SITE = {
  origin: "https://happywedz.com",
  name: "HappyWedz",
  locale: "en_IN",
  // Kept identical to the og:image in index.html. Replace both together if a
  // purpose-built 1200x630 asset is ever produced.
  defaultImage: "https://happywedz.com/hero-2-1280.webp",
  imageWidth: "1280",
  imageHeight: "853",
};

export const ROUTE_META = {
  "/": {
    title: "HappyWedz - Find Top Wedding Vendors, Venues & Planning Tools",
    description:
      "Discover top-rated wedding vendors, venues, and planning tools for your perfect wedding. Explore real weddings, inspiration, and expert advice with HappyWedz.",
    priority: "1.0",
  },
  "/about-us": {
    title: "About Us | India's Wedding Vendor & Venue Marketplace | HappyWedz",
    description:
      "HappyWedz is India's wedding vendor and venue marketplace. Discover thousands of verified photographers, decorators, makeup artists, caterers, and banquet halls — all in one place.",
    priority: "0.7",
  },
  "/einvites": {
    title: "Digital Wedding Invitations & E-Invites | HappyWedz",
    description:
      "Create stunning digital wedding invitations, save-the-date cards, and wedding websites in minutes. Choose from hundreds of templates and share instantly via WhatsApp, Email, or Instagram.",
    priority: "0.8",
  },
  "/blog": {
    title: "Wedding Blog — Ideas, Tips & Real Stories | HappyWedz",
    description:
      "Wedding planning guides, decor ideas, budgeting tips and real wedding stories from couples across India.",
    priority: "0.9",
  },
  "/destination-wedding": {
    title: "Destination Wedding Packages in India | HappyWedz",
    description:
      "Plan a destination wedding in Goa, Lonavala, Mahabaleshwar, Nashik, Pune or Rajasthan. Compare venues, packages and full-service planning support.",
    priority: "0.9",
  },
  "/top-rated": {
    title: "Top Rated Wedding Vendors in India | HappyWedz",
    description:
      "Browse the highest-rated wedding photographers, decorators, makeup artists and caterers, ranked by verified couple reviews.",
    priority: "0.8",
  },
  "/honeymoon": {
    title: "Honeymoon Packages, Flights & Hotels | HappyWedz",
    description:
      "Plan your honeymoon with curated destinations, hotel options and flight search — booked alongside your wedding in one place.",
    priority: "0.8",
  },
  "/travels": {
    title: "Wedding & Honeymoon Travel Destinations | HappyWedz",
    description:
      "Explore cities and activities for destination weddings and honeymoons, with guest logistics and travel planning support.",
    priority: "0.7",
  },
  "/matrimonial": {
    title: "Matrimonial Matchmaking | HappyWedz",
    description:
      "Create a profile and find matches by community, culture and preference, with wedding planning built in from day one.",
    priority: "0.7",
  },
  "/try": {
    title: "Virtual Bridal Makeup & Outfit Try-On | HappyWedz Design Studio",
    description:
      "See how you will look on your wedding day. Try bridal and groom makeup looks and outfits virtually with AI, from a single selfie.",
    priority: "0.7",
  },
  "/video-templates": {
    title: "Wedding Invitation Video Templates | HappyWedz",
    description:
      "Animated wedding invitation video templates you can personalise with your names, dates and venue, then share on WhatsApp or Instagram.",
    priority: "0.6",
  },
  "/contact-us": {
    title: "Contact Us | HappyWedz",
    description:
      "Get in touch with the HappyWedz team for help with vendors, venues, bookings or planning your wedding.",
    priority: "0.6",
  },
  "/claim-your-buisness": {
    title: "List or Claim Your Wedding Business | HappyWedz",
    description:
      "Are you a wedding vendor? Claim your listing on HappyWedz to reach couples actively planning their wedding across India.",
    priority: "0.6",
  },
  "/careers": {
    title: "Careers at HappyWedz",
    description:
      "Join the team building India's wedding vendor and venue marketplace. See current openings at HappyWedz.",
    priority: "0.5",
  },
  "/sitemap": {
    title: "Site Map | HappyWedz",
    description:
      "Browse every section of HappyWedz — vendors, venues, e-invites, destination weddings, blog and planning tools.",
    priority: "0.4",
  },
  "/privacy": {
    title: "Privacy Policy | HappyWedz",
    description:
      "How HappyWedz collects, uses and protects your personal data.",
    priority: "0.3",
  },
  "/terms": {
    title: "Terms & Conditions | HappyWedz",
    description: "The terms governing your use of the HappyWedz platform.",
    priority: "0.3",
  },
  "/cancellation": {
    title: "Cancellation & Refund Policy | HappyWedz",
    description:
      "Cancellation and refund terms for bookings and services made through HappyWedz.",
    priority: "0.3",
  },
};
