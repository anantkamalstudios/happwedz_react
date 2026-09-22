import { formatDate, toPaise, toRupeeInput } from "./crmFormat";

// Editable line-item rows for quotations and invoices, and conversion to and
// from what the API stores (paise).

const newKey = () => Math.random().toString(36).slice(2);

export const blankItem = (gstRate = 18) => ({ key: newKey(), description: "", quantity: "1", rate: "", gstRate: String(gstRate), sac: "" });

// One line per event, priced as on the client.
export const itemsFromEvents = (events, gstRate = 18, sac = "") =>
  events.map((event) => ({
    key: newKey(),
    description: [event.name, event.eventDate ? formatDate(event.eventDate) : null, event.venue].filter(Boolean).join(" – "),
    quantity: "1",
    rate: toRupeeInput(event.pricePaise),
    gstRate: String(gstRate),
    sac: sac || "",
  }));

// Saved line items (paise) back into editable rows.
export const itemsFromSaved = (items) =>
  items.map((item) => ({
    key: newKey(),
    description: [item.eventName, item.description].filter(Boolean).join(" – "),
    quantity: String(item.quantity),
    rate: toRupeeInput(item.ratePaise),
    gstRate: String(item.gstRate || 0),
    sac: item.sac || "",
  }));

export const itemsToPayload = (items) =>
  items.map((item) => ({
    description: item.description.trim(),
    quantity: Number(item.quantity) || 0,
    ratePaise: toPaise(item.rate),
    gstRate: Number(item.gstRate) || 0,
    sac: item.sac || undefined,
  }));

// Returns an error message, or "" when the rows can be saved.
export const validateItems = (items) => {
  if (!items.length) return "Add at least one item.";
  for (const [index, item] of items.entries()) {
    if (!item.description.trim()) return `Item ${index + 1} needs a description.`;
    if (!(Number(item.quantity) > 0)) return `Item ${index + 1}: quantity must be more than 0.`;
    if (item.rate === "" || Number.isNaN(toPaise(item.rate))) return `Item ${index + 1}: enter a rate.`;
  }
  return "";
};
