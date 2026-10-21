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

export default googleProfileApi;
