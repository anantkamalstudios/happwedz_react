// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Small helpers shared by the Overview and Reviews tabs (helper D). Shapes are GrowthOS's own:
// growthos-web/src/contracts/reviews.ts (Review, ReviewsStatus, REVIEW_FILTERS, MAX_REPLY_LENGTH).
import { errorCode, errorMessage } from "../../../../../services/api/googleProfileApi";

/** Same as GrowthOS's MAX_REPLY_LENGTH. */
export const MAX_REPLY_LENGTH = 1500;

export const REVIEWS_PAGE_SIZE = 20;

/** GrowthOS's REVIEW_FILTERS, in its order, with plain labels. */
export const REVIEW_FILTERS = [
  { id: "all", label: "All" },
  { id: "positive", label: "Positive" },
  { id: "neutral", label: "Neutral" },
  { id: "negative", label: "Negative" },
  { id: "unanswered", label: "Need a reply" },
  { id: "answered", label: "Replied" },
];

export const REPLY_STATUS_WORDS = {
  none: { label: "Needs a reply", tone: "warn" },
  draft: { label: "Draft saved", tone: "pink" },
  approved: { label: "Ready, not on Google yet", tone: "pink" },
  published: { label: "Replied on Google", tone: "ok" },
};

/** GrowthOS's policy flags, in plain words. */
export const POLICY_WORDS = {
  personal_data: "Remove phone numbers and email addresses. Replies on Google are public.",
  forbidden_claim: "Remove the claim that isn't allowed in a reply.",
  promises_compensation: "The reply promises a refund, discount or compensation. Check you agree to it.",
  admits_liability: "The reply may admit legal responsibility. Check the wording.",
  argues_with_reviewer: "The reply may sound like an argument with the reviewer.",
};

/** A short extra line for the error codes a reviewer can do something about. */
const CODE_HINTS = {
  ai_limit_reached: "You can still write the reply yourself.",
  ai_unavailable: "You can write the reply yourself, or try the AI again in a moment.",
  google_unverified: "Google must verify your profile before replies can go on Google.",
  review_reply_blocked: "Change the reply and try again.",
};

/** The server's message, its code, a hint, and any policy flags it sent with the refusal. */
export const errorInfo = (error, fallback) => {
  const code = errorCode(error);
  const flags = error?.response?.data?.details?.policy_flags;
  return {
    code,
    message: errorMessage(error, fallback),
    hint: CODE_HINTS[code] || "",
    flags: Array.isArray(flags) ? flags.filter((flag) => POLICY_WORDS[flag]) : [],
  };
};

export const isReview = (value) =>
  Boolean(value) && typeof value === "object" && typeof value.id === "string" && typeof value.reply_status === "string";

const toDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

// "12 Oct 2026".
export const formatDate = (iso) => {
  const date = toDate(iso);
  return date ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
};

// A business day "2026-10-12" from Google (already the business's own day) → "12 Oct".
export const formatDay = (day, withYear = false) => {
  const date = toDate(`${day}T00:00:00Z`);
  if (!date) return String(day || "");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
};

// "21 Oct, 14:05" in the vendor's own time.
export const formatWhen = (iso) => {
  const date = toDate(iso);
  if (!date) return "";
  const day = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const time = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${day}, ${time}`;
};

export const formatNumber = (n) => Math.round(n).toLocaleString("en-IN");

export const plural = (count, one, many) => `${formatNumber(count)} ${count === 1 ? one : many}`;
