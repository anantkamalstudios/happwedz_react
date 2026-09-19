import axiosInstance from "./axiosInstance";

const API_BASE = "/instagram";

// `refresh` skips the server's short feed cache, for the vendor's Refresh button.
const feedParams = (params, refresh) => (refresh ? { ...params, refresh: 1 } : params);

export const instagramApi = {
  getConnection: () =>
    axiosInstance.get(`${API_BASE}/`).then((res) => res.data),
  getAuthUrl: () =>
    axiosInstance.get(`${API_BASE}/auth-url`).then((res) => res.data),
  getProfile: ({ refresh = false } = {}) =>
    axiosInstance
      .get(`${API_BASE}/profile`, { params: feedParams({}, refresh) })
      .then((res) => res.data),
  getPosts: (after, { refresh = false } = {}) =>
    axiosInstance
      .get(`${API_BASE}/posts`, { params: feedParams(after ? { after } : {}, refresh) })
      .then((res) => res.data),
  getStories: ({ refresh = false } = {}) =>
    axiosInstance
      .get(`${API_BASE}/stories`, { params: feedParams({}, refresh) })
      .then((res) => res.data),
  disconnect: () =>
    axiosInstance.delete(`${API_BASE}/`).then((res) => res.data),
};

export default instagramApi;
