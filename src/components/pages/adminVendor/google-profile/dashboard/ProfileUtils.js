// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Small helpers shared by helper E's tabs (Posts, Profile, Photos, Fixes). Plain functions and one hook only, so the
// .jsx files export components only. Limits and rules mirror GrowthOS's contracts (growthos-web/src/contracts/google.ts).
import { useEffect, useState } from "react";

export const WEEKDAY_IDS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

// Google's limits (PROFILE_LIMITS in GrowthOS).
export const PROFILE_LIMITS = { description: 750, additional_categories: 9, additional_phones: 2, places: 20, special_days: 50 };
export const POST_LIMITS = { topic: 150, description: 1500, offer: 200, coupon: 60 };

// GrowthOS POST_TYPES and POST_CTAS, with GrowthOS's own English labels.
export const POST_TYPE_LABELS = { update: "Update", offer: "Offer", event: "Event" };
export const POST_CTA_LABELS = {
  book: "Book",
  order_online: "Order online",
  buy: "Buy",
  learn_more: "Learn more",
  sign_up: "Sign up",
  call: "Call now",
};

// Images: PNG, JPEG or WebP up to 5 MB (the HappyWedz server and GrowthOS check again).
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");
const IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Why a picked file can't be sent, or null when it is fine. */
export const imageFileProblem = (file) => {
  if (!file) return "Choose an image.";
  if (!IMAGE_TYPES.includes(file.type)) return "Use a PNG, JPEG or WebP image.";
  if (file.size > IMAGE_MAX_BYTES) return "The image is larger than 5 MB. Choose a smaller one.";
  return null;
};

/** A web address starting with http:// or https://. */
export const isHttpUrl = (value) => {
  try {
    const url = new URL(String(value).trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/** The server's field messages (validation_error → details.fields), as { path: message }. */
export const fieldErrorsOf = (error) => {
  const fields = error?.response?.data?.details?.fields;
  if (!Array.isArray(fields)) return {};
  const out = {};
  fields.forEach((f) => {
    if (f && typeof f.path === "string" && typeof f.message === "string" && !(f.path in out)) out[f.path] = f.message;
  });
  return out;
};

/** Every distinct field message the server sent (shown under the main error line). */
export const fieldMessagesOf = (error) => [...new Set(Object.values(fieldErrorsOf(error)))];

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
export const isTime = (value) => TIME.test(value || "");

// ── Opening hours ───────────────────────────────────────────────────────────
// GrowthOS sends periods [{ day, open, close }]; the editor keeps { mon: [{ open, close }], … }. A day with no
// ranges is closed. "24:00" closes at midnight (a time box shows it as 00:00).

export const toWeek = (periods = []) => {
  const week = Object.fromEntries(WEEKDAY_IDS.map((d) => [d, []]));
  periods.forEach((p) => {
    if (week[p.day]) week[p.day].push({ open: p.open || "", close: p.close || "" });
  });
  return week;
};

export const fromWeek = (week) => WEEKDAY_IDS.flatMap((day) => (week[day] || []).map((r) => ({ day, open: r.open, close: r.close })));

/** Problems of one week as { "mon.0": message } (same rules as GrowthOS's weekSchema). */
export const weekErrors = (week, prefix = "") => {
  const out = {};
  WEEKDAY_IDS.forEach((day) => {
    (week[day] || []).forEach((r, i) => {
      const key = `${prefix}${day}.${i}`;
      if (!r.open || !r.close) out[key] = "Set an opening and a closing time.";
      else if (!isTime(r.open) || !(isTime(r.close) || r.close === "24:00")) out[key] = "Enter a time like 09:30.";
      else if (r.close !== "24:00" && r.close <= r.open) out[key] = "The closing time must be after the opening time.";
    });
  });
  return out;
};

export const openDayCount = (periods = []) => new Set(periods.map((p) => p.day)).size;

// ── Words and numbers ───────────────────────────────────────────────────────

/** "₹1,500" in the profile's currency; plain number when the currency is unknown. */
export const formatMoney = (value, currency) => {
  if (typeof value !== "number") return "";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR", maximumFractionDigits: 2 }).format(value);
  } catch {
    return String(value);
  }
};

/** "21 Oct 2026" for a "2026-10-21" date. */
export const formatDay = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

/** Local "YYYY-MM-DD" and "HH:MM" of an ISO time (for date and time boxes). */
export const localParts = (iso) => {
  const date = iso ? new Date(iso) : null;
  if (!date || Number.isNaN(date.getTime())) return { date: "", time: "" };
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
};

/** A local date and time → ISO time (null when either is missing or invalid). */
export const toIsoTime = (date, time) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}:00`);
  return Number.isNaN(value.getTime()) ? null : value.toISOString();
};

/** The value after `ms` of no change (for search boxes). */
export function useDebounced(value, ms = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/** Why Google data is not available (GrowthOS GOOGLE_BLOCKS), in plain words. */
export const GOOGLE_BLOCK_TEXT = {
  google_not_connected: "Your Google account is not connected yet.",
  google_no_location: "No Google Business Profile is chosen yet.",
  google_not_configured: "Google is not set up on GrowthOS right now. Please try again later.",
  google_unverified: "Your Google profile is not verified yet. This works once Google verifies it.",
};
