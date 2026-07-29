import { useEffect } from "react";

/**
 * useDocumentMetadata
 * Updates <head> meta tags on every route change.
 *
 * @param {string}  title          - Page title (used for <title>, og:title, twitter:title)
 * @param {string}  description    - Meta description (og:description, twitter:description)
 * @param {string}  [keywords]     - Meta keywords (comma-separated)
 * @param {string}  [ogUrl]        - Canonical / og:url for this page (e.g. "https://happywedz.com/about-us")
 * @param {string}  [ogImage]      - og:image URL (absolute). Falls back to global default in index.html.
 * @param {string}  [ogType]       - og:type. Defaults to "website".
 * @param {string}  [canonicalUrl] - If provided, sets/creates a <link rel="canonical"> tag.
 */
export const useDocumentMetadata = ({
  title,
  description,
  keywords,
  ogUrl,
  ogImage,
  ogType,
  canonicalUrl,
  robots,
}) => {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────
    if (title) {
      document.title = title;

      const titleTag = document.querySelector('meta[name="title"]');
      if (titleTag) titleTag.setAttribute("content", title);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", title);

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute("content", title);
    }

    // ── Description ────────────────────────────────────────────────────────
    if (description) {
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute("content", description);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", description);

      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute("content", description);
    }

    // ── Keywords ───────────────────────────────────────────────────────────
    if (keywords) {
      let keywordsTag = document.querySelector('meta[name="keywords"]');
      if (!keywordsTag) {
        keywordsTag = document.createElement("meta");
        keywordsTag.setAttribute("name", "keywords");
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.setAttribute("content", keywords);
    }

    // ── OG URL ────────────────────────────────────────────────────────────
    if (ogUrl) {
      const ogUrlTag = document.querySelector('meta[property="og:url"]');
      if (ogUrlTag) {
        ogUrlTag.setAttribute("content", ogUrl);
      }
      const twitterUrl = document.querySelector('meta[name="twitter:url"]');
      if (twitterUrl) {
        twitterUrl.setAttribute("content", ogUrl);
      }
    }

    // ── OG Image ──────────────────────────────────────────────────────────
    if (ogImage) {
      const ogImageTag = document.querySelector('meta[property="og:image"]');
      if (ogImageTag) {
        ogImageTag.setAttribute("content", ogImage);
      }
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute("content", ogImage);
      }
    }

    // ── OG Type ───────────────────────────────────────────────────────────
    if (ogType) {
      const ogTypeTag = document.querySelector('meta[property="og:type"]');
      if (ogTypeTag) {
        ogTypeTag.setAttribute("content", ogType);
      }
    }

    // ── Meta Robots ────────────────────────────────────────────────────────
    let robotsTag = document.querySelector('meta[name="robots"]');
    if (robots) {
      if (!robotsTag) {
        robotsTag = document.createElement("meta");
        robotsTag.setAttribute("name", "robots");
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute("content", robots);
    } else if (robotsTag) {
      robotsTag.setAttribute("content", "index, follow");
    }

    // ── Canonical URL ─────────────────────────────────────────────────────
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }
  }, [title, description, keywords, ogUrl, ogImage, ogType, canonicalUrl]);
};
