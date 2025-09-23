import { useState } from "react";
import axios from "axios";

const API_URL = "https://happywedz.com/api/vendor";


export const useVendorAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ---------------- Register Vendor ----------------
  const registerVendor = async (vendorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/register`, vendorData);

      return response.data; // return data to component
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err; // rethrow for component to handle
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Login Vendor ----------------
  const loginVendor = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/login`, credentials);

      // save token in localStorage
      localStorage.setItem("vendorToken", response.data.token);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Logout Vendor ----------------
  const logoutVendor = () => {
    localStorage.removeItem("vendorToken");
  };

  // ---------------- Check Auth ----------------
  const getVendorToken = () => {
    return localStorage.getItem("vendorToken");
  };

  return {
    registerVendor,
    loginVendor,
    logoutVendor,
    getVendorToken,
    loading,
    error,
  };
};
