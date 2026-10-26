import axiosInstance from "./axiosInstance";

// The vendor's Google Business Profile, set up by GrowthOS AI (a HappyWedz partner).
// Every call goes to the HappyWedz server, which holds the GrowthOS key; the browser
// never talks to GrowthOS. Each answer is the same "view" of where the vendor is.

const BASE = "/vendor/google-profile";

const view = (promise) => promise.then((res) => res.data?.data ?? null);

// The server's message when it sent one, otherwise a generic line.
export const errorMessage = (error, fallback = "Something went wrong. Please try again.") =>
  error?.response?.data?.message || fallback;

// The server's error code (validation_error, email_taken, PLAN_MODULE_LOCKED …), or
// "network" when the request never got an answer.
export const errorCode = (error) => {
  if (!error?.response) return "network";
  return error.response.data?.code || `http_${error.response.status}`;
};

export const googleProfileApi = {
  get: () => view(axiosInstance.get(BASE)),
  refresh: () => view(axiosInstance.post(`${BASE}/refresh`)),
  // body { has_google_profile, opening_time, closing_time, weekly_off, consent: true, owner_email? }.
  // owner_email (RD-23): a different email for the new GrowthOS account; the login email stays.
  setup: (body) => view(axiosInstance.post(`${BASE}/setup`, body)),
  resend: () => view(axiosInstance.post(`${BASE}/resend`)),

  // RD-23: the login email already has a GrowthOS account. GrowthOS emails its Owner to
  // approve linking that business to HappyWedz (View screen "approve"), and sends it again.
  linkExisting: () => view(axiosInstance.post(`${BASE}/link-existing`)),
  resendLink: () => view(axiosInstance.post(`${BASE}/link-existing/resend`)),

  // ── RD-24: connect Google, pick or create the profile, and verify it, all here ──
  // Contract: GrowthOS/docs/partner-api-gbp-contract.md §6.4. Shapes are GrowthOS's own
  // (growthos-web/src/contracts/google.ts and onboarding.ts).

  // The one-time GrowthOS link that starts Google's sign-in; Google sends the vendor back
  // to this page with ?google=connected or ?google_error=<code>.
  connectUrl: () => view(axiosInstance.get(`${BASE}/google/connect-url`)).then((data) => data?.url || null),
  connection: () => view(axiosInstance.get(`${BASE}/google/connection`)),
  disconnectGoogle: () => axiosInstance.delete(`${BASE}/google/connection`).then(() => null),
  // [{ name: "accounts/…", accountName, type }]
  accounts: () => view(axiosInstance.get(`${BASE}/google/accounts`)),
  // [{ name: "locations/…", title, address, phone, website, category }]
  locations: (account) => view(axiosInstance.get(`${BASE}/google/locations`, { params: { account } })),
  // Use an existing profile: { account_name, location_name }.
  pickLocation: (body) => view(axiosInstance.post(`${BASE}/google/location`, body)),
  // { locations: [{ id, name }], map_pin, storefront_pin, form: { location_id, title, category_query, category,
  //   region_code, address_lines, locality, administrative_area, postal_code, phone, website, description, hours } }
  // storefront_pin (HappyWedz): the storefront has a map location, so "Use my storefront map pin" can be offered.
  prefill: (locationId) =>
    view(axiosInstance.get(`${BASE}/google/create/prefill`, { params: locationId ? { location_id: locationId } : {} })),
  // [{ name: "categories/…", display_name }]
  createCategories: (q, region) =>
    view(axiosInstance.get(`${BASE}/google/create/categories`, { params: { q, ...(region ? { region } : {}) } })),
  // { data: [{ title, address, request_access_uri }], meta: { checked, reason } }
  checkProfile: (body) => page(axiosInstance.post(`${BASE}/google/create/check`, body, SLOW)),
  createProfile: (body) => view(axiosInstance.post(`${BASE}/google/create`, body, SLOW)),
  // The map location Google may need first (RD-24 follow-up): { maps_url } or {} (the storefront's own)
  // -> { latitude, longitude }. Reading a link can take a while.
  savePin: (body = {}) => view(axiosInstance.put(`${BASE}/google/create/pin`, body, SLOW)),
  // { state, method, awaiting_code, options: [{ method, phone, address, email }] }
  verification: () => view(axiosInstance.get(`${BASE}/google/verification`)),
  startVerification: (method) => view(axiosInstance.post(`${BASE}/google/verification`, { method }, SLOW)),
  completeVerification: (pin) => view(axiosInstance.post(`${BASE}/google/verification/complete`, { pin }, SLOW)),
};

// ── Managing the live profile (RD-21) ───────────────────────────────────────
// Reviews, numbers, posts, profile, photos and fixes, once the profile is verified.
// Contract: GrowthOS/docs/partner-api-gbp-contract.md §2. Shapes are GrowthOS's own
// (growthos-web/src/contracts/google.ts, reviews.ts, ai-commands.ts).

// { data, meta } of a list; meta is null for single answers.
const page = (promise) => promise.then((res) => ({ data: res.data?.data ?? null, meta: res.data?.meta ?? null }));

const upload = (path, file, fields = {}) => {
  const form = new FormData();
  form.append("file", file);
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  return view(axiosInstance.post(`${BASE}${path}`, form, { headers: { "Content-Type": "multipart/form-data" } }));
};

const enc = encodeURIComponent;

// AI writing and "sync now" can take up to a minute on GrowthOS; the default 30 s is too short.
const SLOW = { timeout: 100000 };

export const gpManageApi = {
  // Overview and numbers
  overview: () => view(axiosInstance.get(`${BASE}/overview`)),
  performance: (days = 30) => view(axiosInstance.get(`${BASE}/performance`, { params: { days } })),

  // Reviews
  reviewsStatus: () => view(axiosInstance.get(`${BASE}/reviews/status`)),
  reviews: ({ filter = "all", page: p = 1, page_size = 20 } = {}) =>
    page(axiosInstance.get(`${BASE}/reviews`, { params: { filter, page: p, page_size } })),
  syncReviews: () => view(axiosInstance.post(`${BASE}/reviews/sync`, {}, SLOW)),
  draftReply: (reviewId) => view(axiosInstance.post(`${BASE}/reviews/${enc(reviewId)}/draft`, {}, SLOW)),
  saveReply: (reviewId, reply) => view(axiosInstance.put(`${BASE}/reviews/${enc(reviewId)}/reply`, { reply })),
  publishReply: (reviewId, reply) => view(axiosInstance.post(`${BASE}/reviews/${enc(reviewId)}/publish`, { reply })),
  editPublishedReply: (reviewId, reply) =>
    view(axiosInstance.put(`${BASE}/reviews/${enc(reviewId)}/published-reply`, { reply })),
  deleteReply: (reviewId) => view(axiosInstance.delete(`${BASE}/reviews/${enc(reviewId)}/reply`)),

  // Read the profile, photos and posts from Google now (once every 5 minutes).
  syncGoogle: () => view(axiosInstance.post(`${BASE}/sync`, {}, SLOW)),

  // Posts
  posts: (status) => page(axiosInstance.get(`${BASE}/posts`, { params: status ? { status } : {} })),
  generatePost: (body) => view(axiosInstance.post(`${BASE}/posts/generate`, body, SLOW)),
  createPost: (body) => view(axiosInstance.post(`${BASE}/posts`, body)),
  updatePost: (postId, body) => view(axiosInstance.put(`${BASE}/posts/${enc(postId)}`, body)),
  deletePost: (postId) => view(axiosInstance.delete(`${BASE}/posts/${enc(postId)}`)),
  publishPost: (postId) => view(axiosInstance.post(`${BASE}/posts/${enc(postId)}/publish`)),
  schedulePost: (postId) => view(axiosInstance.post(`${BASE}/posts/${enc(postId)}/schedule`)),
  unschedulePost: (postId) => view(axiosInstance.post(`${BASE}/posts/${enc(postId)}/unschedule`)),
  uploadImage: (file) => upload("/images", file),

  // Profile
  profile: () => view(axiosInstance.get(`${BASE}/profile`)),
  saveProfileSection: (section, body) => view(axiosInstance.put(`${BASE}/profile/${enc(section)}`, body)),
  generateDescription: (body = {}) => view(axiosInstance.post(`${BASE}/profile/description/generate`, body, SLOW)),
  categories: (q, region) =>
    view(axiosInstance.get(`${BASE}/profile/categories`, { params: { q, ...(region ? { region } : {}) } })),
  places: (q) => view(axiosInstance.get(`${BASE}/profile/places`, { params: { q } })),
  googleUpdates: () => view(axiosInstance.get(`${BASE}/profile/google-updates`)),
  answerGoogleUpdates: (body) => view(axiosInstance.post(`${BASE}/profile/google-updates`, body)),

  // Photos
  photos: () => view(axiosInstance.get(`${BASE}/photos`)),
  addPhoto: (file, category) => upload("/photos", file, { category }),
  deletePhoto: (name) => view(axiosInstance.delete(`${BASE}/photos`, { params: { name } })),

  // "Improve with AI" (RD-22): the AI helper, keywords, storefront facts, services, storefront photos.
  agent: () => view(axiosInstance.get(`${BASE}/agent`)),
  setAgent: (on) => view(axiosInstance.put(`${BASE}/agent`, { on })),
  keywords: () => page(axiosInstance.get(`${BASE}/keywords`)),
  suggestKeywords: (body = {}) => view(axiosInstance.post(`${BASE}/keywords/suggest`, body, SLOW)),
  addKeyword: (body) => view(axiosInstance.post(`${BASE}/keywords`, body)),
  setKeywordStatus: (keywordId, status) => view(axiosInstance.patch(`${BASE}/keywords/${enc(keywordId)}`, { status })),
  deleteKeyword: (keywordId) => view(axiosInstance.delete(`${BASE}/keywords/${enc(keywordId)}`)),
  storefront: () => view(axiosInstance.get(`${BASE}/storefront`)),
  facts: () => view(axiosInstance.get(`${BASE}/facts`)),
  useStorefront: () => view(axiosInstance.post(`${BASE}/storefront/use`)),
  services: () => page(axiosInstance.get(`${BASE}/services`)),
  suggestServices: () => view(axiosInstance.post(`${BASE}/services/suggest`, {}, SLOW)),
  addService: (body) => view(axiosInstance.post(`${BASE}/services`, body)),
  deleteService: (serviceId) => view(axiosInstance.delete(`${BASE}/services/${enc(serviceId)}`)),
  sendStorefrontPhotos: (items) => view(axiosInstance.post(`${BASE}/storefront/photos`, { items })),

  // Fixes
  fixes: () => view(axiosInstance.get(`${BASE}/fixes`)),
  prepareFixes: () => view(axiosInstance.post(`${BASE}/fixes/prepare`, {}, SLOW)),
  approveFix: (actionId) => view(axiosInstance.post(`${BASE}/fixes/${enc(actionId)}/approve`)),
  rejectFix: (actionId) => view(axiosInstance.post(`${BASE}/fixes/${enc(actionId)}/reject`)),
};

// ── RD-25: the AI assistant chat ("Improve with AI") ────────────────────────
// GrowthOS's Command Center for the Google profile. Contract: GrowthOS/docs/partner-api-gbp-contract.md §7.
// Shapes: growthos-web/src/contracts/ai-commands.ts (Command) and the coach of §7.2. The AI can take up to a
// minute, so every call that may reach it uses the 100 s timeout.
const ASSISTANT = `${BASE}/assistant`;

export const assistantApi = {
  // { score, generated_for, items: [{ key, priority, title, message, points, action }] } — no AI used.
  coach: () => view(axiosInstance.get(`${ASSISTANT}/coach`)),
  // Command[] of the last 30 days, oldest first (questions: kind "question", result = the answer).
  history: () => view(axiosInstance.get(ASSISTANT)),
  clear: () => axiosInstance.delete(ASSISTANT).then(() => null),
  // string[] — starter commands (Google ones only).
  suggestions: () => view(axiosInstance.get(`${ASSISTANT}/suggestions`)),
  // { kind: "question", answer } | { kind: "command", command }
  send: (text, attachmentId) =>
    view(axiosInstance.post(ASSISTANT, { text, ...(attachmentId ? { attachment_id: attachmentId } : {}) }, SLOW)),
  // A photo for the next message, or for a command that asks for one: { id, kind, name, url }.
  attach: (file) => {
    const form = new FormData();
    form.append("file", file);
    return view(
      axiosInstance.post(`${ASSISTANT}/attachments`, form, { ...SLOW, headers: { "Content-Type": "multipart/form-data" } }),
    );
  },
  // Each answers the Command again.
  choose: (commandId, option) => view(axiosInstance.post(`${ASSISTANT}/${enc(commandId)}/choose`, { option }, SLOW)),
  // body { text?, parts?, edits?, photo_id?, attributes? }
  apply: (commandId, body = {}) => view(axiosInstance.post(`${ASSISTANT}/${enc(commandId)}/apply`, body, SLOW)),
  cancel: (commandId) => view(axiosInstance.post(`${ASSISTANT}/${enc(commandId)}/cancel`, {}, SLOW)),
  undo: (commandId) => view(axiosInstance.post(`${ASSISTANT}/${enc(commandId)}/undo`, {}, SLOW)),
  // The logo / cover / photo a command asked for (an attachment id from attach()).
  upload: (commandId, uploadId) =>
    view(axiosInstance.post(`${ASSISTANT}/${enc(commandId)}/upload`, { upload_id: uploadId }, SLOW)),
};

// An image the server serves at /vendor/google-profile/images/<id> needs the vendor's
// token, which an <img src> does not send. Load it through axios and show the object
// URL; call URL.revokeObjectURL on it when the image leaves the screen. Other URLs
// (Google's own) are returned as they are.
export const loadImage = async (url) => {
  if (!url || !url.startsWith(`${BASE}/images/`)) return url;
  const res = await axiosInstance.get(url, { responseType: "blob" });
  return URL.createObjectURL(res.data);
};

export default googleProfileApi;
