import axiosInstance from "./axiosInstance";

const API_BASE = "/instagram";

export const instagramApi = {
  getConnection: () =>
    axiosInstance.get(`${API_BASE}/`).then((res) => res.data),
  getAuthUrl: () =>
    axiosInstance.get(`${API_BASE}/auth-url`).then((res) => res.data),
  disconnect: () =>
    axiosInstance.delete(`${API_BASE}/`).then((res) => res.data),
};

export default instagramApi;
