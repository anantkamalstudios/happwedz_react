import axiosInstance from "./axiosInstance";

export const createInsurancePaymentOrder = async (payload) => {
  const response = await axiosInstance.post(
    "insurance_payment/create_order",
    payload
  );
  return response.data;
};

export const verifyInsurancePaymentAndBook = async (payload) => {
  const response = await axiosInstance.post(
    "insurance_payment/verify_and_book",
    payload
  );
  return response.data;
};

export const getUserInsuranceBookings = async (params = {}) => {
  const response = await axiosInstance.get("insurance_payment/bookings", {
    params,
  });
  return response.data;
};

export const getInsurancePolicyPdf = async (bookingId) => {
  const response = await axiosInstance.get(
    `insurance_payment/policy/${bookingId}`,
    { responseType: "blob" }
  );
  return response.data;
};

export const loadRazorpayScript = () => {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
