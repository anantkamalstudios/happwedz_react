import axios from "axios";

const API_BASE = "https://happywedz.com/api/vendor";
// const API_BASE = "http://localhost:4000/vendor";

export const vendorsApi = {
  getVendors: (params) =>
    axios.get(`${API_BASE}/list`, { params }).then((res) => res.data),
  getVendorById: (id) => axios.get(`${API_BASE}/${id}`).then((res) => res.data),
  createVendor: (data) =>
    axios.post(`${API_BASE}/create`, data).then((res) => res.data),
  updateVendor: (id, data) =>
    axios.put(`${API_BASE}/${id}`, data).then((res) => res.data),
  deleteVendor: (id) =>
    axios.delete(`${API_BASE}/${id}`).then((res) => res.data),
};

// Optional: keep your auth API separate
export const vendorsAuthApi = {
  register: (payload) =>
    axios.post(`${API_BASE}/register`, payload).then((res) => res.data),
  login: (payload) =>
    axios.post(`${API_BASE}/login`, payload).then((res) => res.data),
  changePassword: (payload, token) =>
    axios
      .post(`${API_BASE}/change-password`, payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.data),
};

export default vendorsAuthApi;
