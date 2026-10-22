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
  setup: (body) => view(axiosInstance.post(`${BASE}/setup`, body)),
  resend: () => view(axiosInstance.post(`${BASE}/resend`)),
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

export const gpManageApi = {
  // Overview and numbers
  overview: () => view(axiosInstance.get(`${BASE}/overview`)),
  performance: (days = 30) => view(axiosInstance.get(`${BASE}/performance`, { params: { days } })),

  // Reviews
  reviewsStatus: () => view(axiosInstance.get(`${BASE}/reviews/status`)),
  reviews: ({ filter = "all", page: p = 1, page_size = 20 } = {}) =>
    page(axiosInstance.get(`${BASE}/reviews`, { params: { filter, page: p, page_size } })),
  syncReviews: () => view(axiosInstance.post(`${BASE}/reviews/sync`)),
  draftReply: (reviewId) => view(axiosInstance.post(`${BASE}/reviews/${enc(reviewId)}/draft`)),
  saveReply: (reviewId, reply) => view(axiosInstance.put(`${BASE}/reviews/${enc(reviewId)}/reply`, { reply })),
  publishReply: (reviewId, reply) => view(axiosInstance.post(`${BASE}/reviews/${enc(reviewId)}/publish`, { reply })),
  editPublishedReply: (reviewId, reply) =>
    view(axiosInstance.put(`${BASE}/reviews/${enc(reviewId)}/published-reply`, { reply })),
  deleteReply: (reviewId) => view(axiosInstance.delete(`${BASE}/reviews/${enc(reviewId)}/reply`)),

  // Read the profile, photos and posts from Google now (once every 5 minutes).
  syncGoogle: () => view(axiosInstance.post(`${BASE}/sync`)),

  // Posts
  posts: (status) => page(axiosInstance.get(`${BASE}/posts`, { params: status ? { status } : {} })),
  generatePost: (body) => view(axiosInstance.post(`${BASE}/posts/generate`, body)),
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
  generateDescription: (body = {}) => view(axiosInstance.post(`${BASE}/profile/description/generate`, body)),
  categories: (q, region) =>
    view(axiosInstance.get(`${BASE}/profile/categories`, { params: { q, ...(region ? { region } : {}) } })),
  places: (q) => view(axiosInstance.get(`${BASE}/profile/places`, { params: { q } })),
  googleUpdates: () => view(axiosInstance.get(`${BASE}/profile/google-updates`)),
  answerGoogleUpdates: (body) => view(axiosInstance.post(`${BASE}/profile/google-updates`, body)),

  // Photos
  photos: () => view(axiosInstance.get(`${BASE}/photos`)),
  addPhoto: (file, category) => upload("/photos", file, { category }),
  deletePhoto: (name) => view(axiosInstance.delete(`${BASE}/photos`, { params: { name } })),

  // Fixes
  fixes: () => view(axiosInstance.get(`${BASE}/fixes`)),
  prepareFixes: () => view(axiosInstance.post(`${BASE}/fixes/prepare`)),
  approveFix: (actionId) => view(axiosInstance.post(`${BASE}/fixes/${enc(actionId)}/approve`)),
  rejectFix: (actionId) => view(axiosInstance.post(`${BASE}/fixes/${enc(actionId)}/reject`)),
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
