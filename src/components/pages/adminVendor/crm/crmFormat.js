// Labels, formatting and the same GST arithmetic the server uses, so the
// quotation builder shows exactly the totals that will be saved.

export const LEAD_SOURCES = [
  { id: "happywedz", label: "HappyWedz" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "google", label: "Google" },
  { id: "referral", label: "Referral" },
  { id: "website", label: "Website" },
  { id: "walk_in", label: "Walk-in" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "other", label: "Other" },
];

export const CLIENT_STATUSES = [
  { id: "lead", label: "Lead" },
  { id: "quoted", label: "Quoted" },
  { id: "booked", label: "Booked" },
  { id: "completed", label: "Completed" },
  { id: "lost", label: "Lost" },
  { id: "cancelled", label: "Cancelled" },
];

export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "upi", label: "UPI" },
  { id: "bank_transfer", label: "Bank transfer" },
  { id: "card", label: "Card" },
  { id: "cheque", label: "Cheque" },
  { id: "other", label: "Other" },
];

export const GST_RATES = [0, 5, 12, 18, 28];

export const EVENT_SUGGESTIONS = ["Roka", "Engagement", "Mehendi", "Haldi", "Sangeet", "Cocktail", "Wedding", "Reception", "Pre-wedding shoot"];

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const labelOf = (list, id) => list.find((item) => item.id === id)?.label || id || "";

export const rupees = (paise, { decimals = false } = {}) => {
  const value = Math.round(Number(paise) || 0) / 100;
  return (
    "₹" +
    value.toLocaleString("en-IN", {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : value % 1 ? 2 : 0,
    })
  );
};

// Paise → the plain number a rupee input shows ("12500.5").
export const toRupeeInput = (paise) => {
  if (paise === null || paise === undefined || paise === "") return "";
  return String(Math.round(Number(paise)) / 100);
};

export const toPaise = (rupeeText) => {
  if (rupeeText === "" || rupeeText === null || rupeeText === undefined) return 0;
  const n = Number(String(rupeeText).replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : NaN;
};

export const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(String(value).length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export const todayIso = () => new Date().toLocaleDateString("en-CA");

export const addDaysIso = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
};

// Same rules as the server (services/crm/crmMath.js).
export const taxModeFor = (profile, clientState) => {
  if (!profile?.gstin) return "none";
  if (!clientState) return "intra";
  return String(profile.state || "").trim().toLowerCase() === String(clientState).trim().toLowerCase() ? "intra" : "inter";
};

export const computeTotals = (items, discountPaise, taxMode) => {
  const lines = items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const ratePaise = toPaise(item.rate);
    return {
      amountPaise: Math.round(quantity * (Number.isNaN(ratePaise) ? 0 : ratePaise)),
      gstRate: taxMode === "none" ? 0 : Number(item.gstRate) || 0,
    };
  });
  const subtotal = lines.reduce((s, l) => s + l.amountPaise, 0);
  const discount = Math.min(Math.max(0, discountPaise || 0), subtotal);
  let spread = 0;
  let cgst = 0;
  let igst = 0;
  lines.forEach((line, index) => {
    const share = index === lines.length - 1 ? discount - spread : subtotal ? Math.round((discount * line.amountPaise) / subtotal) : 0;
    spread += share;
    const taxable = line.amountPaise - share;
    if (taxMode === "intra") cgst += Math.round((taxable * line.gstRate) / 200);
    if (taxMode === "inter") igst += Math.round((taxable * line.gstRate) / 100);
  });
  const tax = cgst * 2 + igst;
  return { subtotal, discount, cgst, sgst: cgst, igst, tax, total: subtotal - discount + tax, lines };
};

export const STATUS_TONES = {
  lead: "blue",
  quoted: "violet",
  booked: "green",
  completed: "grey",
  lost: "red",
  cancelled: "red",
  draft: "grey",
  sent: "blue",
  accepted: "green",
  rejected: "red",
  expired: "amber",
  unpaid: "amber",
  part_paid: "blue",
  paid: "green",
};

export const QUOTATION_STATUS_LABELS = { draft: "Draft", sent: "Sent", accepted: "Accepted", rejected: "Declined", expired: "Expired" };
export const INVOICE_STATE_LABELS = { unpaid: "Unpaid", part_paid: "Part paid", paid: "Paid", cancelled: "Cancelled" };
