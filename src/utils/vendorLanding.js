/**
 * Where a vendor should land after signing up or logging in.
 *
 * A vendor who has not been verified yet has exactly one job — complete their business
 * information and upload their documents — so they are sent straight there rather than
 * to a dashboard full of numbers they cannot act on. Everyone else goes to the
 * dashboard as before.
 *
 * This is a convenience, not a gate: the server decides what can actually be edited
 * (see vendorAccessService on the backend). Both VendorLogin and VendorRegister call
 * this so the rule exists in one place.
 */

export const VENDOR_HOME_ROUTE = "/vendor-dashboard/vendor-home";
export const VENDOR_STOREFRONT_ROUTE = "/vendor-dashboard/vendor-store-front";
export const BUSINESS_DETAILS_TAB = "business";

/**
 * @param {object} vendor  the vendor object returned by login or register
 * @returns {boolean} true when onboarding is still outstanding
 */
export function needsOnboarding(vendor) {
  const status = vendor?.verification_status;

  // Vendors created before this column existed come back without it. Treat the absence
  // as "already fine" so nobody who was trading yesterday is bounced into onboarding.
  if (!status) return false;

  return status !== "approved";
}

/**
 * Pin the storefront's remembered tab to Business details.
 *
 * Storefront.jsx restores the last tab a vendor had open from localStorage, so without
 * this a returning vendor lands on whichever tab they left — not the one they were sent
 * back to complete.
 */
export function pinStorefrontTab(vendorId, tabId = BUSINESS_DETAILS_TAB) {
  try {
    const key = vendorId ? `storefrontActiveTab_${vendorId}` : "storefrontActiveTab";
    localStorage.setItem(key, tabId);
  } catch (_) {
    // Private browsing or blocked storage — the tab just falls back to the default.
  }
}

/**
 * Resolve the post-auth route, pinning the storefront tab when onboarding is pending.
 *
 * @param {object} vendor
 * @returns {string} the route to navigate to
 */
export function vendorLandingRoute(vendor) {
  if (needsOnboarding(vendor)) {
    pinStorefrontTab(vendor?.id);
    return VENDOR_STOREFRONT_ROUTE;
  }
  return VENDOR_HOME_ROUTE;
}
