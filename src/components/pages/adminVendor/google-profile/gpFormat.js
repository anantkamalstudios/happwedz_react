// Small helpers shared by the Google Profile screens. Kept out of the .jsx files so
// those export components only.

export const STOREFRONT_PATH = "/vendor-dashboard/vendor-store-front";
// The login email (sent to GrowthOS as the owner email) is changed in Settings, not in the Storefront.
export const SETTINGS_PATH = "/vendor-dashboard/vendor-setting";
export const GROWTHOS_PRIVACY_URL = "https://gmb.aslai.cloud/legal/privacy";
export const GROWTHOS_LOGIN_FALLBACK = "https://gmb.aslai.cloud/login";

export const STEPS = [
  "Send details",
  "Set password",
  "Connect Google",
  "Google verification",
  "Live on Google",
];

// How many steps are finished on each screen. 5 = all done ("live").
export const STEP_FOR_SCREEN = {
  start: 0,
  taken: 0,
  invited: 1,
  expired: 1,
  connect: 2,
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
