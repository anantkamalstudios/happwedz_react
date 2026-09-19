// Links and messages used when a couple shares their invitation.

import { pageTitle } from "../design/einviteDesign";

export const siteOrigin = () => (typeof window === "undefined" ? "https://happywedz.com" : window.location.origin);

// The card's plain link shows every card; share links show a chosen set.
export const cardViewUrl = (cardId) => `${siteOrigin()}/einvites/view/${cardId}`;
export const shareLinkUrl = (token) => `${siteOrigin()}/einvites/i/${token}`;

export const inviteMessage = ({ cardName, url, guestName }) =>
  `${guestName ? `Dear ${guestName},\n\n` : ""}You're invited! 💌\nPlease view ${cardName || "our invitation"} and let us know if you can come:\n${url}`;

// wa.me needs the number with its country code and no symbols. Ten-digit
// numbers are taken to be Indian.
export const whatsappNumber = (phone) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 && digits.length <= 15 ? digits : "";
};

export const whatsappUrl = (message, phone) => {
  const number = whatsappNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

export const emailUrl = ({ to = "", subject, body }) =>
  `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// Opens a tab straight away (so popup blockers allow it) and points it at a
// URL that is only known after a request finishes.
export const openAfter = async (getUrl) => {
  const tab = window.open("", "_blank");
  try {
    const url = await getUrl();
    if (tab) tab.location.href = url;
    else window.open(url, "_blank");
  } catch (error) {
    if (tab) tab.close();
    throw error;
  }
};

export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// null (every card) or the chosen ids, in the invitation's order.
export const pickedPageIds = (pages, selected) =>
  selected.length === pages.length ? null : pages.map((page) => page.id).filter((id) => selected.includes(id));

export const cardNames = (pages, pageIds) => {
  if (!Array.isArray(pageIds)) return "All cards";
  const names = pages
    .map((page, index) => (pageIds.includes(page.id) ? pageTitle(page, index) : null))
    .filter(Boolean);
  return names.length ? names.join(" · ") : "All cards";
};
