// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-25, docs/partner-api-gbp-contract.md §7.4).
// AI assistant chat helpers (helper D): plain functions only, so the .jsx files export components only. Shapes are
// GrowthOS's own Command Center ones (growthos-web/src/contracts/ai-commands.ts) and the coach of contract §7.2.
import { errorCode, errorMessage } from "../../../../../services/api/googleProfileApi";

/** Longest message the AI reads (GrowthOS PROMPT_MAX). */
export const PROMPT_MAX = 500;

/** Photos the assistant takes: PNG, JPEG or WebP, up to 5 MB. */
export const PHOTO_ACCEPT = "image/png,image/jpeg,image/webp";
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"];

/** Why a picked file cannot be sent, or "" when it is fine. */
export const photoProblem = (file) => {
  if (!file) return "Choose a photo.";
  const typeOk = PHOTO_TYPES.includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name || "");
  if (!typeOk) return "Choose a PNG, JPEG or WebP photo.";
  if (file.size > PHOTO_MAX_BYTES) return "This photo is bigger than 5 MB. Choose a smaller one.";
  return "";
};

/** The words to show for a failed call: the server's message, with fixed words for a few codes. */
export const chatErrorText = (error, fallback = "Something went wrong. Please try again.") => {
  const code = errorCode(error);
  if (code === "ai_unavailable") return "AI is unavailable right now. Please try again later.";
  if (code === "network") {
    return error?.code === "ECONNABORTED"
      ? "The AI took too long to answer. Please try again."
      : "We couldn't reach the server. Check your internet connection and try again.";
  }
  return errorMessage(error, fallback);
};

/** An error made here (a file check) that reads like a server error, so the same message line shows it. */
export const messageError = (message) => Object.assign(new Error(message), { response: { data: { message } } });

/** A list from a plain array or a { data } page. */
export const listOf = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/** The starter commands as plain strings. */
export const suggestionTexts = (value) =>
  listOf(value)
    .map((s) => (typeof s === "string" ? s : s?.text))
    .filter((s) => typeof s === "string" && s.trim());

/** Statuses that show why the AI did not (or could not) do it. */
export const BLOCKED = ["refused", "not_allowed", "blocked", "unsupported", "failed"];

export const BLOCKED_TITLES = {
  refused: "The AI does not change this",
  not_allowed: "You can't do this here",
  blocked: "Not possible yet",
  unsupported: "Can't do this from here",
  failed: "This did not work",
};

/** Internal kinds (they only change GrowthOS's own tracking); every other google_* kind and review replies change Google. */
const INTERNAL_KINDS = ["google_keyword_add", "google_keyword_remove", "google_goal"];
export const changesGoogle = (kind) =>
  typeof kind === "string" && ((kind.startsWith("google_") && !INTERNAL_KINDS.includes(kind)) || kind === "review_reply");

/** The upload a command asks for → its button. */
export const UPLOAD_LABELS = {
  logo: "Upload your logo",
  cover: "Upload your cover photo",
  library: "Upload a photo",
};

/** A coach "upload_photo" purpose → its button. */
export const PURPOSE_LABELS = {
  post: "Upload a photo for a post",
  photo: "Upload a photo",
  logo: "Upload your logo",
  cover: "Upload your cover photo",
};

/** A coach "open_tab" tab → its button. */
export const TAB_LABELS = {
  profile: "Open Profile",
  reviews: "Open Reviews",
  posts: "Open Posts",
  photos: "Open Photos",
};

/** A GrowthOS link in a card ("edit it in the profile editor") → the HappyWedz dashboard tab that does the same. */
export const tabOfLink = (href) => {
  if (typeof href !== "string") return null;
  if (/review/i.test(href)) return "reviews";
  if (/post/i.test(href)) return "posts";
  if (/photo|librar/i.test(href)) return "photos";
  if (/profile|google/i.test(href)) return "profile";
  return null;
};

/** The WhatsApp share link for the review link (the vendor picks who to send it to). */
export const whatsappShareUrl = (reviewUrl) =>
  `https://wa.me/?text=${encodeURIComponent(`Please leave us a review on Google: ${reviewUrl}`)}`;

/** The chat's history rows (questions with their answers, and commands) → turns. */
export const turnsFromHistory = (rows) =>
  listOf(rows).map((r) =>
    r.kind === "question"
      ? { key: r.id, type: "question", text: r.text, attachments: r.attachments || [], answer: r.result ?? "" }
      : { key: r.id, type: "command", text: r.text, attachments: r.attachments || [], command: r },
  );

/** A short line for screen readers when the AI answers. */
export const announcementOf = (turn) => {
  if (turn.type === "question") return `The AI answered: ${turn.answer.slice(0, 300)}`;
  if (turn.type === "command") {
    const c = turn.command;
    return `The AI answered: ${c.preview?.title || c.message || "a change to check"}.`;
  }
  if (turn.type === "failed") return `The message was not sent. ${chatErrorText(turn.error)}`;
  return "";
};

/** A key for a new turn. */
let counter = 0;
export const newKey = () => {
  counter += 1;
  return `turn-${Date.now()}-${counter}`;
};

/** Copies text; true when it worked. */
export const copyText = async (text) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Falls back below.
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
};

/** The motion setting, for scrolling. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
