/**
 * Safe Storage Utility
 * Handles QuotaExceededError and provides fallback to sessionStorage / automated cache pruning.
 */

export const sanitizeForStorage = (data) => {
  if (!data || typeof data !== "object") return data;
  try {
    const clean = Array.isArray(data) ? [...data] : { ...data };
    for (const key of Object.keys(clean)) {
      if (typeof clean[key] === "string" && clean[key].length > 40000) {
        // Strip out excessively large strings (e.g. embedded base64 images or PDFs)
        delete clean[key];
      }
    }
    return clean;
  } catch {
    return data;
  }
};

export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`localStorage.setItem("${key}") failed:`, error);
    // If quota exceeded, clear expendable caches and retry
    if (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22 ||
      error.code === 1014
    ) {
      try {
        const nonCriticalKeys = [
          "shaadi_ai_chats",
          "weddingFormDraft",
          "happywedz_recently_viewed",
          "happywedz_user_activity",
          "happywedz_last_search",
          "wedding_decisions_log",
          "favorites",
        ];
        nonCriticalKeys.forEach((k) => {
          try {
            localStorage.removeItem(k);
          } catch (e) {
            console.warn(`Failed to remove key ${k}:`, e);
          }
        });
        localStorage.setItem(key, value);
        return true;
      } catch (evictError) {
        console.warn("Storage eviction retry failed, falling back to sessionStorage:", evictError);
      }
    }
    // Fallback to sessionStorage so login/session flow never crashes
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (sessionError) {
      console.error("SessionStorage fallback also failed:", sessionError);
      return false;
    }
  }
};

export const safeGetItem = (key) => {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
  } catch (e) {
    console.warn(`localStorage.getItem("${key}") failed:`, e);
  }
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove ${key} from localStorage:`, e);
  }
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove ${key} from sessionStorage:`, e);
  }
};
