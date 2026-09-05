import axiosInstance from "./axiosInstance";

const BASE = "/vendor/subscription";

/**
 * Plans, checkout and payment history.
 *
 * The amount is never sent from here — the server reads it from the plans table when it
 * creates the Razorpay order, so a tampered client cannot name its own price.
 */
const vendorSubscriptionApi = {
  getPlans: () => axiosInstance.get(`${BASE}/plans`).then((res) => res.data),

  createOrder: (planId) =>
    axiosInstance.post(`${BASE}/order`, { planId }).then((res) => res.data),

  verify: ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
    axiosInstance
      .post(`${BASE}/verify`, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      .then((res) => res.data),

  getHistory: () => axiosInstance.get(`${BASE}/history`).then((res) => res.data),

  /**
   * The invoice PDF as a Blob.
   *
   * Fetched rather than linked: the endpoint needs the vendor's bearer token, and a
   * plain <a href> or window.open would send the request without it.
   */
  getInvoice: (paymentId) =>
    axiosInstance
      .get(`${BASE}/invoice/${paymentId}`, {
        params: { disposition: "inline" },
        responseType: "blob",
      })
      .then((res) => ({
        blob: res.data,
        fileName:
          /filename="?([^"]+)"?/.exec(res.headers["content-disposition"] || "")?.[1] ||
          `HappyWedz_Invoice_${paymentId}.pdf`,
      })),
};

export default vendorSubscriptionApi;
