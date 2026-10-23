// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-22, docs/partner-api-gbp-contract.md §4.4).
// "Improve with AI" helpers (helper D): a small loader hook, the hint for the error codes a vendor can act on, the
// photo categories, and what each checklist "need:" means in plain words. Plain functions and hooks only, so the
// .jsx files export components only. Shapes: GrowthOS fixPlanSchema (ai-commands.ts), keywordSchema (google.ts).
import { useCallback, useEffect, useRef, useState } from "react";
import { errorCode } from "../../../../../services/api/googleProfileApi";

/** Loads one thing when the tab opens: { status: loading | ready | error, data, error, reload, setData }. */
export const useLoad = (fetcher) => {
  const ref = useRef(fetcher);
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  const reload = useCallback(async (quiet = false) => {
    if (!quiet) setState((s) => ({ ...s, status: "loading", error: null }));
    try {
      const data = await ref.current();
      setState({ status: "ready", data, error: null });
      return data;
    } catch (error) {
      setState((s) => (quiet && s.status === "ready" ? s : { ...s, status: "error", error }));
      return null;
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const setData = useCallback((update) => {
    setState((s) => ({ ...s, status: "ready", error: null, data: typeof update === "function" ? update(s.data) : update }));
  }, []);

  return { ...state, reload, setData };
};

/** A short extra line for the error codes the vendor can do something about. */
const CODE_HINTS = {
  ai_limit_reached: "The AI allowance is used up for now. You can still add these yourself.",
  ai_unavailable: "You can still add them yourself below.",
  feature_disabled: "This is switched off for your profile right now.",
  rate_limited: "Too many tries at once. Please wait a moment and try again.",
  network: "Check your internet connection and try again.",
};

export const errorHint = (error) => (error ? CODE_HINTS[errorCode(error)] || "" : "");

/** A list from a { data, meta } page or a plain array. */
export const listOf = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

/** The AI's service ideas, whichever way the answer wraps them. */
export const suggestionsOf = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.suggestions)) return value.suggestions;
  if (Array.isArray(value?.services)) return value.services;
  return [];
};

export const isOpenFix = (f) => f.status === "pending_approval" || f.status === "escalated";

/** Keywords that count towards the 5 needed. */
export const KEYWORDS_NEEDED = 5;
export const activeKeywords = (list) => list.filter((k) => k.status === "active");

/** At most this many storefront photos go to Google in one go (cover and logo included). */
export const PHOTOS_MAX = 10;

// GrowthOS PHOTO_CATEGORIES with GrowthOS's plain labels (Cover and Logo are picked separately).
export const PHOTO_CATEGORIES = [
  ["EXTERIOR", "Exterior"],
  ["INTERIOR", "Interior"],
  ["PRODUCT", "Product"],
  ["AT_WORK", "At work"],
  ["TEAMS", "Team"],
  ["FOOD_AND_DRINK", "Food and drink"],
  ["MENU", "Menu"],
  ["COMMON_AREA", "Common area"],
  ["ROOMS", "Rooms"],
  ["ADDITIONAL", "Other"],
];
export const DEFAULT_PHOTO_CATEGORY = "ADDITIONAL";

/** The fix plan's checklist rows of one kind ("need", "fixed", "ok" …), as their reason keys. */
export const checklistKeys = (plan, kind) =>
  (plan?.checklist || [])
    .filter((row) => typeof row?.result === "string" && row.result.startsWith(`${kind}:`))
    .map((row) => row.result.slice(kind.length + 1));

// What each checklist "need:" asks of the vendor, and where it is done: a dashboard tab, or one of the steps above.
// agent_on is left out: the AI helper switch at the top covers it.
const NEED_WORDS = {
  primary_category: {
    title: "Choose your main category on Google",
    body: "Google needs one main category for your business. Pick it in the Profile tab, under Categories.",
    action: "Open Profile",
    tab: "profile",
  },
  location_hours: {
    title: "Add your opening hours",
    body: "Your opening hours are missing. Add them in the Profile tab.",
    action: "Open Profile",
    tab: "profile",
  },
  website: {
    title: "Add your website",
    body: "No website is set for your business. Add it in the Profile tab.",
    action: "Open Profile",
    tab: "profile",
  },
  attribute_facts: {
    title: "Answer Google's questions about your business",
    body: "Google asks things like payment options and wheelchair access. Answer them in the Profile tab, under Attributes.",
    action: "Open Profile",
    tab: "profile",
  },
  services: {
    title: "Add your services",
    body: "The AI needs your services before it can list them on Google.",
    action: "Go to Services",
    step: "services",
  },
  keywords: {
    title: "Add keywords",
    body: "The AI uses your keywords in your description and posts.",
    action: "Go to Keywords",
    step: "keywords",
  },
  logo: {
    title: "Pick your logo",
    body: "Choose your logo from your storefront photos.",
    action: "Go to Photos",
    step: "photos",
  },
  cover: {
    title: "Pick your cover photo",
    body: "Choose a cover photo from your storefront photos.",
    action: "Go to Photos",
    step: "photos",
  },
  library_photos: {
    title: "Add real photos of your business",
    body: "Pick photos from your storefront to send to Google. AI never makes fake photos.",
    action: "Go to Photos",
    step: "photos",
  },
};

const FIXED_WORDS = {
  primary_category: "Main category",
  location_hours: "Opening hours",
  website: "Website",
  attribute_facts: "Google's questions",
  services: "Services",
  keywords: "Keywords",
  logo: "Logo",
  cover: "Cover photo",
  library_photos: "Photos",
};

/**
 * What only the vendor can do, from the fix plan: the checklist's need: rows, low-rated reviews, review replies that
 * wait to be published, and photos. Each { key, title, body, action, tab | step }. Plus what was fixed since the check.
 */
export const vendorNeeds = (plan) => {
  if (!plan) return { needs: [], fixed: [] };
  const seen = new Set();
  const needs = [];
  const add = (key, item) => {
    if (seen.has(key)) return;
    seen.add(key);
    needs.push({ key, ...item });
  };
  checklistKeys(plan, "need").forEach((reason) => {
    const words = NEED_WORDS[reason];
    if (!words) return;
    // Logo, cover and library photos are all picked in the Photos step.
    add(words.step === "photos" ? "photos" : reason, words);
  });
  (plan.needs_you || []).forEach((n) => {
    if (n?.key === "photos") {
      add("photos", {
        title: `Add ${n.count} real ${n.count === 1 ? "photo" : "photos"} of your business`,
        body: "Profiles with 10 or more photos look trusted. AI never makes fake photos.",
        action: "Go to Photos",
        step: "photos",
      });
    } else if (n?.key === "low_reviews") {
      add("low_reviews", {
        title: `${n.count} low-rated ${n.count === 1 ? "review waits" : "reviews wait"} for your reply`,
        body: "Replies to 1–3★ reviews always need you. The AI prepares a draft you can use.",
        action: "Open Reviews",
        tab: "reviews",
      });
    }
  });
  const replies = (plan.reviews || []).filter((r) => !r.blocked);
  if (replies.length) {
    add("replies", {
      title: `${replies.length} ${replies.length === 1 ? "reply is" : "replies are"} ready for 4–5★ reviews`,
      body: "The AI drafted them. Check each reply and publish it in Reviews.",
      action: "Open Reviews",
      tab: "reviews",
    });
  }
  const fixed = [...new Set(checklistKeys(plan, "fixed").map((reason) => FIXED_WORDS[reason]).filter(Boolean))];
  return { needs, fixed };
};
