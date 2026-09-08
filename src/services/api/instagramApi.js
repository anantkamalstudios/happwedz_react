import axiosInstance from "./axiosInstance";

const API_BASE = "/instagram";

export const instagramApi = {
  getConnection: () =>
    axiosInstance.get(`${API_BASE}/`).then((res) => res.data),
  connect: ({ code, redirect_uri }) =>
    axiosInstance
      .post(`${API_BASE}/connect`, { code, redirect_uri })
      .then((res) => res.data),
  disconnect: () =>
    axiosInstance.delete(`${API_BASE}/`).then((res) => res.data),
};

export default instagramApi;
