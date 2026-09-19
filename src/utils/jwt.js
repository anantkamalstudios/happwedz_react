/**
 * Expiry of a JWT in epoch milliseconds, read from its `exp` claim. Returns
 * null when the token is missing, malformed or carries no expiry. Nothing is
 * verified here — the server does that; this only avoids sending a token we
 * already know it will reject.
 */
export const getJwtExpiryMs = (token) => {
  try {
    const part = String(token || "").split(".")[1];
    if (!part) return null;
    const payload = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * True only when the token states an expiry and it has passed. A token without
 * a readable expiry is left for the server to judge rather than treated as dead.
 */
export const isJwtExpired = (token, now = Date.now()) => {
  const expiry = getJwtExpiryMs(token);
  return expiry != null && now >= expiry;
};
