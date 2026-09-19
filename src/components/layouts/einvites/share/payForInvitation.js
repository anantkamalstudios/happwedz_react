import { einviteApi } from "../../../../services/api/einviteApi";
import { loadRazorpayScript } from "../../../../services/api/cabApi";

// Opens Razorpay for a couple's paid video and confirms the payment with our
// server. Resolves with the paid order, or with null if they close the popup.
export const payForInvitation = async (cardId) => {
  if (!(await loadRazorpayScript())) {
    throw new Error("Couldn't open the payment window. Please check your connection and try again.");
  }
  const { order, razorpay } = await einviteApi.checkout(cardId);

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: razorpay.keyId,
      order_id: razorpay.orderId,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: razorpay.name,
      description: razorpay.description,
      prefill: razorpay.prefill,
      notes: { order_number: order.orderNumber },
      theme: { color: "#ed1173" },
      handler: async (response) => {
        try {
          resolve(await einviteApi.verifyPayment(response));
        } catch (error) {
          // The webhook still confirms a real payment, so it isn't lost.
          reject(new Error(`${error.message}. If money was taken, it will be confirmed shortly.`));
        }
      },
      // A failed attempt shows Razorpay's own message and lets them retry in
      // the same window, so only closing it ends the payment.
      modal: { ondismiss: () => resolve(null) },
    });
    checkout.open();
  });
};
