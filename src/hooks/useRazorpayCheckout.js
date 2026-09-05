import { useCallback, useRef, useState } from "react";
import vendorSubscriptionApi from "../services/api/vendorSubscriptionApi";

/**
 * Opens Razorpay Checkout for a subscription plan and confirms the result with our API.
 *
 * The script is loaded on demand rather than in index.html — most visitors to the
 * dashboard never open the checkout, and this keeps a third-party script off every other
 * page load.
 *
 * If the vendor dismisses the modal or the confirmation call fails after the money was
 * taken, the webhook on the server still activates the subscription. That is why the
 * dismissal message says the payment may still complete rather than claiming it failed.
 */

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;

function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("script failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      // Allow a later attempt to retry rather than caching the failure forever.
      scriptPromise = null;
      reject(new Error("Could not load the payment window. Check your connection."));
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export default function useRazorpayCheckout({ onSuccess, onError } = {}) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  // Which plan the vendor actually clicked. Without this every plan button shows
  // "Preparing your payment…" at once, because they all read one shared flag.
  const [activePlanId, setActivePlanId] = useState(null);
  // Guards against a double click opening two Razorpay orders for the same vendor.
  const inFlight = useRef(false);

  const fail = useCallback(
    (message) => {
      setProcessing(false);
      inFlight.current = false;
      setStatus("");
      setActivePlanId(null);
      onError?.(message);
    },
    [onError]
  );

  const startCheckout = useCallback(
    async (plan) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setProcessing(true);
      setActivePlanId(plan?.id ?? null);

      try {
        setStatus("Preparing your payment…");
        await loadRazorpayScript();

        const order = await vendorSubscriptionApi.createOrder(plan.id);

        setStatus("Opening payment window…");

        const rzp = new window.Razorpay({
          key: order.razorpayKeyId,
          amount: order.order.amount,
          currency: order.order.currency,
          order_id: order.order.id,
          name: "HappyWedz",
          description: `${order.plan.name} plan`,
          image:
            "https://happywedz-s3-bucket.s3.ap-south-1.amazonaws.com/uploads/logo/happyWedz.png",
          prefill: order.prefill,
          theme: { color: "#E91E63" },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              inFlight.current = false;
              setStatus("");
              setActivePlanId(null);
              onError?.(
                "Payment window closed. If money was deducted, your plan will activate automatically within a few minutes."
              );
            },
          },
          handler: async (response) => {
            try {
              setStatus("Confirming your payment…");
              const result = await vendorSubscriptionApi.verify(response);
              setProcessing(false);
              inFlight.current = false;
              setStatus("");
              setActivePlanId(null);
              onSuccess?.(result);
            } catch (err) {
              fail(
                err.response?.data?.message ||
                  "Your payment went through but we could not confirm it here. It will be activated automatically — please refresh in a minute."
              );
            }
          },
        });

        rzp.on("payment.failed", (response) => {
          fail(
            response?.error?.description ||
              "The payment did not go through. No money has been taken."
          );
        });

        rzp.open();
      } catch (err) {
        fail(
          err.response?.data?.message ||
            err.message ||
            "Could not start the payment. Please try again."
        );
      }
    },
    [fail, onError, onSuccess]
  );

  return { startCheckout, processing, status, activePlanId };
}
