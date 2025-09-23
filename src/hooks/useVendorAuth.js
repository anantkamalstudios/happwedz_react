// import { useState } from "react";
// import axios from "axios";

// const API_URL = "https://happywedz.com/api/vendor";


// export const useVendorAuth = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ---------------- Register Vendor ----------------
//   const registerVendor = async (vendorData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.post(`${API_URL}/register`, vendorData);

//       return response.data; // return data to component
//     } catch (err) {
//       setError(err.response?.data?.message || "Registration failed");
//       throw err; // rethrow for component to handle
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------------- Login Vendor ----------------
//   // const loginVendor = async (credentials) => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);
//   //     const response = await axios.post(`${API_URL}/login`, credentials);

//   //     // save token in localStorage
//   //     localStorage.setItem("vendorToken", response.data.token);

//   //     return response.data;
//   //   } catch (err) {
//   //     setError(err.response?.data?.message || "Login failed");
//   //     throw err;
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const loginVendor = async (email, password, captchaToken) => {
//     try {
//       const payload = { email, password, captchaToken };
//       console.log("Payload sent:", payload);

//       const response = await axios.post(
//         "https://happywedz.com/api/vendor/login",
//         payload,
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("Login success:", response.data);
//       localStorage.setItem("vendorToken", response.data.token);
//       return response.data;
//     } catch (err) {
//       console.error("Login error response:", err.response?.data);
//       throw err;
//     }
//   };


//   // ---------------- Logout Vendor ----------------
//   const logoutVendor = () => {
//     localStorage.removeItem("vendorToken");
//   };

//   // ---------------- Check Auth ----------------
//   const getVendorToken = () => {
//     return localStorage.getItem("vendorToken");
//   };

//   return {
//     registerVendor,
//     loginVendor,
//     logoutVendor,
//     getVendorToken,
//     loading,
//     error,
//   };
// };
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
      const response = await axios.post(`${API_URL}/register`, vendorData, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Login Vendor ----------------
  const loginVendor = async ({ email, password, captchaToken }) => {
    try {
      setLoading(true);
      setError(null);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const payload = { email, password, captchaToken };

      const response = await axios.post(`${API_URL}/login`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // save token in localStorage
      if (response.data.token) {
        localStorage.setItem("vendorToken", response.data.token);
      }

      return response.data;
    } catch (err) {
      console.error("Login error response: ", err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutVendor = () => {
    localStorage.removeItem("vendorToken");
  };

  const getVendorToken = () => localStorage.getItem("vendorToken");

  return {
    registerVendor,
    loginVendor,
    logoutVendor,
    getVendorToken,
    loading,
    error,
  };
};
