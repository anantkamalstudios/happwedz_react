/**
 * Centralized URL & Route Helpers for HappyWedz SEO
 * 
 * Enforces site-wide URL canonical route schema:
 *   1. Category / City / Subcategory route: /:section/:city/:slug/
 *   2. Category / All Cities route: /:section/all/:slug/
 *   3. City Hub route: /:section/:city/
 *   4. Base Section route: /:section/
 * 
 * Always enforces trailing slash.
 */

export const toSlug = (text) =>
  text
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

export const buildCategoryUrl = (section = "vendors", city = null, slug = null) => {
  const cleanSection = toSlug(section) || "vendors";
  const cleanCity = city && city !== "all" ? toSlug(city) : "all";
  const cleanSlug = slug && slug !== "all" ? toSlug(slug) : "";

  if (cleanSlug) {
    return `/${cleanSection}/${cleanCity}/${cleanSlug}/`;
  }
  if (cleanCity !== "all") {
    return `/${cleanSection}/${cleanCity}/`;
  }
  return `/${cleanSection}/`;
};

export const buildVendorDetailUrl = (section = "vendors", city = null, categorySlug = null, vendorName = "", vendorId = null) => {
  const cleanSection = toSlug(section) || "vendors";
  const cleanCity = city && city !== "all" ? toSlug(city) : "all";
  const cleanCategory = categorySlug ? toSlug(categorySlug) : "all";
  const baseVendorSlug = toSlug(vendorName) || "details";
  const vendorSlug = vendorId ? `${baseVendorSlug}-${vendorId}` : baseVendorSlug;

  return `/${cleanSection}/${cleanCity}/${cleanCategory}/${vendorSlug}/`;
};

export const buildAbsoluteCategoryUrl = (section = "vendors", city = null, slug = null) => {
  return `https://happywedz.com${buildCategoryUrl(section, city, slug)}`;
};
