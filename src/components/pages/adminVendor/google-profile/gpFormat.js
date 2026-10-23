// Small helpers shared by the Google Profile screens. Kept out of the .jsx files so
// those export components only.

export const STOREFRONT_PATH = "/vendor-dashboard/vendor-store-front";
/** The Storefront opened on one section (Storefront reads ?section=): "vendor-basic" (About us), "faq", "photos"… */
export const storefrontSection = (section) => `${STOREFRONT_PATH}?section=${encodeURIComponent(section)}`;
// The login email (sent to GrowthOS as the owner email) is changed in Settings, not in the Storefront.
export const SETTINGS_PATH = "/vendor-dashboard/vendor-setting";
export const GROWTHOS_PRIVACY_URL = "https://gmb.aslai.cloud/legal/privacy";
export const GROWTHOS_TERMS_URL = "https://gmb.aslai.cloud/legal/terms";
export const GROWTHOS_LOGIN_FALLBACK = "https://gmb.aslai.cloud/login";

export const STEPS = [
  "Send details",
  "Your account",
  "Connect Google",
  "Google verification",
  "Live on Google",
];

// How many steps are finished on each screen. 5 = all done ("live").
export const STEP_FOR_SCREEN = {
  start: 0,
  taken: 0,
  // RD-23: the Owner of an existing GrowthOS account approves by email (in place of setting a password).
  approve: 1,
  invited: 1,
  expired: 1,
  connect: 2,
  // RD-24: Google is connected; the vendor picks or creates the profile here (still the "Connect Google" step).
  pick: 2,
  verify: 3,
  live: 5,
};

export const WEEKDAYS = [
  { id: "mon", short: "Mon", long: "Monday" },
  { id: "tue", short: "Tue", long: "Tuesday" },
  { id: "wed", short: "Wed", long: "Wednesday" },
  { id: "thu", short: "Thu", long: "Thursday" },
  { id: "fri", short: "Fri", long: "Friday" },
  { id: "sat", short: "Sat", long: "Saturday" },
  { id: "sun", short: "Sun", long: "Sunday" },
];

// A time input wants "HH:MM". Anything else from the storefront ("10:00 AM", "9:30")
// is turned into that, or left empty for the vendor to fill in.
export const toTimeInput = (value) => {
  if (typeof value !== "string") return "";
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([aApP][mM])?$/);
  if (!match) return "";
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  if (hours > 23 || minutes > 59) return "";
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const toDate = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
};

// "14:05", in the vendor's own time.
export const formatClock = (iso) => {
  const date = toDate(iso);
  if (!date) return "";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

// "21 Oct, 14:05".
export const formatWhen = (iso) => {
  const date = toDate(iso);
  if (!date) return "";
  const day = date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${day}, ${formatClock(iso)}`;
};

// Milliseconds until the resend button may be pressed again; 0 when it may be now.
export const msUntil = (iso) => {
  const date = toDate(iso);
  if (!date) return 0;
  return Math.max(0, date.getTime() - Date.now());
};

// "Use a different email" (RD-23): the same rule the server checks (a valid email, at most 254 characters).
export const EMAIL_MAX = 254;
export const isEmail = (value) =>
  typeof value === "string" && value.length <= EMAIL_MAX && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const sameEmail = (a, b) =>
  typeof a === "string" && typeof b === "string" && a.trim().toLowerCase() === b.trim().toLowerCase();

export const initials = (name) => {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "G";
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

// A link inside the HappyWedz app ("/vendor-dashboard/…") is routed in place; any
// other address opens as a normal link.
export const isAppPath = (url) => typeof url === "string" && url.startsWith("/") && !url.startsWith("//");

// ── RD-24: connect, pick or create, and verify the Google profile here ──────
// Rules and shapes copied from GrowthOS (growthos-web/src/contracts/google.ts: profileFormSchema,
// verificationSchema; growthos-api integrations/google/setup-schemas.ts).

export const GOOGLE_BUSINESS_URL = "https://business.google.com/";
export const GOOGLE_HELP_SUSPENDED = "https://support.google.com/business/answer/4569145";
export const GOOGLE_HELP_OWNERSHIP = "https://support.google.com/business/answer/4566671";

/** What Google's return left in the address bar: { connected, error } (error is Google's code or null). */
export const readGoogleReturn = () => {
  if (typeof window === "undefined") return { connected: false, error: null };
  const params = new URLSearchParams(window.location.search);
  return { connected: params.get("google") === "connected", error: params.get("google_error") || null };
};

/** Takes ?google= and ?google_error= out of the address bar, keeping the router's history state. */
export const clearGoogleReturn = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("google") && !url.searchParams.has("google_error")) return;
  url.searchParams.delete("google");
  url.searchParams.delete("google_error");
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

/** The plain message for ?google_error=<code>. */
export const connectErrorText = (code) =>
  code === "denied" || code === "cancelled" || code === "access_denied"
    ? "You didn't allow access. Press Connect Google and choose Allow."
    : "Google could not be connected. Please try again.";

// Google's ways to verify, in plain words. GrowthOS can finish all of these here.
export const VERIFY_METHODS = {
  ADDRESS: {
    label: "Postcard",
    help: "Google posts a code to the business address.",
    sent: "A postcard with your code is on its way to the business address. It usually takes a few days. Enter the code when it arrives.",
  },
  PHONE_CALL: {
    label: "Phone call",
    help: "Google calls the business phone and reads out a code.",
    sent: "Google is calling the business phone with your code. Enter it here.",
  },
  SMS: {
    label: "Text message",
    help: "Google texts a code to the business phone.",
    sent: "Google sent your code by text message. Enter it here.",
  },
  EMAIL: {
    label: "Email",
    help: "Google emails a code.",
    sent: "Google sent your code by email. Enter it here.",
  },
  AUTO: {
    label: "Verify now",
    help: "Google can verify this business straight away.",
    sent: "Google is checking your business.",
  },
};

// The verification code: 4 to 8 letters or numbers (GrowthOS checks the same).
export const isVerifyCode = (value) => /^[0-9A-Za-z]{4,8}$/.test(String(value || "").trim());

// ── The new profile form ────────────────────────────────────────────────────

export const PROFILE_LIMITS = {
  title: 100,
  address: 80,
  locality: 80,
  administrative_area: 80,
  postal_code: 12,
  phone: 20,
  description: 750,
};

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const WEEKDAY_IDS = WEEKDAYS.map((d) => d.id);

const isWebAddress = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/** The form's first values, from GrowthOS's prefill. `account` is the chosen Google business account. */
export const profileFormFrom = (prefill, account) => {
  const f = prefill?.form || {};
  const lines = Array.isArray(f.address_lines) ? f.address_lines : [];
  const hours = f.hours && typeof f.hours === "object" ? f.hours : null;
  return {
    account_name: account || "",
    location_id: f.location_id || prefill?.locations?.[0]?.id || "",
    title: f.title || "",
    category: f.category?.name || "",
    category_name: f.category?.display_name || "",
    region_code: f.region_code || "",
    address_line1: lines[0] || "",
    address_line2: lines.slice(1).join(", "),
    locality: f.locality || "",
    administrative_area: f.administrative_area || "",
    postal_code: f.postal_code || "",
    phone: f.phone || "",
    website: f.website || "",
    description: f.description || "",
    with_hours: hours !== null,
    days: Array.isArray(hours?.days) ? hours.days.filter((d) => WEEKDAY_IDS.includes(d)) : [],
    open: toTimeInput(hours?.open),
    close: toTimeInput(hours?.close),
  };
};

/** { field: message } for every value that is not right yet (same rules as GrowthOS's profileFormSchema). */
export const checkProfileForm = (v) => {
  const errors = {};
  const need = (field, message, max) => {
    const value = String(v[field] || "").trim();
    if (!value) errors[field] = message;
    else if (max && value.length > max) errors[field] = `Use at most ${max} characters.`;
  };
  if (!v.account_name) errors.account_name = "Choose a Google business account.";
  if (!v.location_id) errors.location_id = "Choose a location.";
  need("title", "Enter the business name.", PROFILE_LIMITS.title);
  if (!v.category) errors.category = "Search and choose a category from Google's list.";
  if (!/^[A-Z]{2}$/.test(v.region_code || "")) errors.region_code = "The country is missing. Contact HappyWedz support.";
  need("address_line1", "Enter the street address.", PROFILE_LIMITS.address);
  if (String(v.address_line2 || "").trim().length > PROFILE_LIMITS.address)
    errors.address_line2 = `Use at most ${PROFILE_LIMITS.address} characters.`;
  need("locality", "Enter the city.", PROFILE_LIMITS.locality);
  need("administrative_area", "Enter the state.", PROFILE_LIMITS.administrative_area);
  need("postal_code", "Enter the PIN code.", PROFILE_LIMITS.postal_code);
  if (String(v.phone || "").trim().length > PROFILE_LIMITS.phone) errors.phone = `Use at most ${PROFILE_LIMITS.phone} characters.`;
  const website = String(v.website || "").trim();
  if (website && !isWebAddress(website)) errors.website = "Enter a valid web address, starting with https://";
  if (String(v.description || "").trim().length > PROFILE_LIMITS.description)
    errors.description = `Google allows up to ${PROFILE_LIMITS.description} characters.`;
  if (v.with_hours) {
    if (!v.days.length) errors.days = "Choose the days you are open.";
    if (!v.open) errors.open = "Enter the opening time.";
    else if (!TIME.test(v.open)) errors.open = "Enter a time like 09:30.";
    if (!v.close) errors.close = "Enter the closing time.";
    else if (!TIME.test(v.close)) errors.close = "Enter a time like 18:00.";
    if (!errors.open && !errors.close && v.close <= v.open) errors.close = "Closing time must be after opening time.";
  }
  return errors;
};

/** Form values → the body GrowthOS takes for create/check and create. */
export const profileBody = (v) => ({
  account_name: v.account_name,
  location_id: v.location_id,
  title: v.title.trim(),
  category: v.category,
  category_name: v.category_name,
  region_code: v.region_code,
  address_lines: [v.address_line1, v.address_line2].map((line) => String(line || "").trim()).filter(Boolean),
  locality: v.locality.trim(),
  administrative_area: v.administrative_area.trim(),
  postal_code: v.postal_code.trim(),
  phone: v.phone.trim() || null,
  website: v.website.trim() || null,
  description: v.description.trim() || null,
  // Kept in week order, whatever order they were ticked in.
  hours: v.with_hours ? { days: WEEKDAY_IDS.filter((d) => v.days.includes(d)), open: v.open, close: v.close } : null,
});

// The server's field paths (address_lines.0, hours.close …) → the form's fields.
const FIELD_OF_PATH = {
  address_lines: "address_line1",
  "address_lines.0": "address_line1",
  "address_lines.1": "address_line2",
  hours: "days",
  "hours.days": "days",
  "hours.open": "open",
  "hours.close": "close",
};

/** The server's field messages (validation_error → details.fields), as { field: message }. */
export const serverFieldErrors = (error) => {
  const fields = error?.response?.data?.details?.fields || error?.response?.data?.fields;
  if (!Array.isArray(fields)) return {};
  const out = {};
  fields.forEach((f) => {
    if (!f || typeof f.message !== "string") return;
    const path = Array.isArray(f.path) ? f.path.join(".") : String(f.path || "");
    const field = FIELD_OF_PATH[path] || path.split(".")[0];
    if (field && !(field in out)) out[field] = f.message;
  });
  return out;
};
