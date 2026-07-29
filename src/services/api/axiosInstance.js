import axios from "axios";
import store from "../../redux/store";
import { logout } from "../../redux/authSlice";
import {
  vendorLogout,
  isVendorTokenExpired,
} from "../../redux/vendorAuthSlice";
// This module is imported eagerly (App.jsx and Header.jsx), so a static
// react-toastify import put the whole library — ~180 KB — in the entry chunk
// just to serve three session-expiry messages that almost never fire.
// Fetching it on demand keeps it off the critical path.
const notifySessionExpired = () => {
  import("react-toastify")
    .then(({ toast }) =>
      toast.error("Your session has expired. Please login again."),
    )
    // A redirect usually follows immediately; never let the toast break it.
    .catch(() => {});
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://happywedz.com/api";

const AI_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://www.happywedz.com/ai/api";

const SHADI_AI_API_BASE_URL =
  import.meta.env.VITE_SHADI_AI_API_BASE_URL ||
  "https://shaadiai.happywedz.com/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const aiAxiosInstance = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const handle401Error = (error) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest?._retry) {
    if (originalRequest) {
      originalRequest._retry = true;
    }

    const token = localStorage.getItem("token");
    const vendorToken = localStorage.getItem("vendorToken");

    const redirectWithReason = (path) => {
      const url = new URL(path, window.location.origin);
      url.searchParams.set("session", "expired");
      window.location.href = url.pathname + url.search + url.hash;
    };

    if (token) {
      store.dispatch(logout());
      notifySessionExpired();

      if (!window.location.pathname.startsWith("/customer-login")) {
        redirectWithReason("/customer-login");
      }
    } else if (vendorToken) {
      store.dispatch(vendorLogout());
      notifySessionExpired();

      if (!window.location.pathname.startsWith("/vendor-login")) {
        redirectWithReason("/vendor-login");
      }
    }
  }
};

const requestInterceptor = (config) => {
  config.withCredentials = true;
  config.withCredentials = true;

  const token = localStorage.getItem("token");
  const vendorToken = localStorage.getItem("vendorToken");

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (vendorToken && !token && !config.headers.Authorization) {
    if (isVendorTokenExpired()) {
      store.dispatch(vendorLogout());
      notifySessionExpired();

      if (!window.location.pathname.startsWith("/vendor-login")) {
        const url = new URL("/vendor-login", window.location.origin);
        url.searchParams.set("session", "expired");
        window.location.href = url.pathname + url.search + url.hash;
      }

      return Promise.reject(
        new axios.Cancel("Vendor token expired. Redirecting to login."),
      );
    }

    config.headers.Authorization = `Bearer ${vendorToken}`;
  }

  return config;
};

const errorInterceptor = (error) => {
  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(requestInterceptor, errorInterceptor);

aiAxiosInstance.interceptors.request.use(requestInterceptor, errorInterceptor);

const responseInterceptor = (response) => {
  return response;
};

const responseErrorInterceptor = (error) => {
  if (error.response?.status === 401) {
    handle401Error(error);
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);
aiAxiosInstance.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor,
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handle401Error(error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    handle401Error(error);
    return Promise.reject(error);
  },
);

export { axiosInstance, aiAxiosInstance };

export default axiosInstance;
