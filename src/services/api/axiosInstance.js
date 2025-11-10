import axios from "axios";
import store from "../../redux/store";
import { logout } from "../../redux/authSlice";
import { vendorLogout } from "../../redux/vendorAuthSlice";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://happywedz.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const handle401Error = (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest?._retry) {
    if (originalRequest) {
      originalRequest._retry = true;
    }

    const token = localStorage.getItem("token");
    const vendorToken = localStorage.getItem("vendorToken");

    if (token) {
      store.dispatch(logout());
      toast.error("Your session has expired. Please login again.");

      if (window.location.pathname !== "/customer-login") {
        window.location.href = "/customer-login";
      }
    } else if (vendorToken) {
      store.dispatch(vendorLogout());
      toast.error("Your session has expired. Please login again.");

      if (window.location.pathname !== "/vendor-login") {
        window.location.href = "/vendor-login";
      }
    }
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const vendorToken = localStorage.getItem("vendorToken");

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (vendorToken && !token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${vendorToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handle401Error(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handle401Error(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
