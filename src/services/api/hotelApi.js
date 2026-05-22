import axiosInstance from "./axiosInstance";

const getErrorMessage = (error, fallback) => {
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  if (typeof error?.response?.data?.message === "string" && error.response.data.message.trim()) {
    return error.response.data.message;
  }
  if (typeof error?.response?.data?.error === "string" && error.response.data.error.trim()) {
    return error.response.data.error;
  }
  return fallback;
};

export const suggestHotels = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/suggestions", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel suggestions"));
    throw error;
  }
};

export const searchHotels = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/search", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error searching hotels"));
    throw error;
  }
};

export const getHotelFilters = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/filters", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel filters"));
    throw error;
  }
};

export const getHotelDetail = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/detail", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel detail"));
    throw error;
  }
};

export const getHotelStaticContent = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/static-content", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel static content"));
    throw error;
  }
};

export const trackHotelAnalyticsEvent = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/analytics-event", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error tracking hotel analytics event"));
    throw error;
  }
};

export const trackTripjackAnalyticsEvent = async (payload) => {
  try {
    const response = await fetch("https://apitest.tripjack.com/xms/v1/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`TripJack analytics request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    try {
      const response = await axiosInstance.post("hotels/analytics-event", payload);
      return response.data;
    } catch (proxyError) {
      console.error(getErrorMessage(proxyError, "Error tracking TripJack analytics event"));
      throw proxyError;
    }
  }
};

export const reviewHotelBooking = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/review", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error reviewing hotel booking"));
    throw error;
  }
};

export const getHotelCancellationPolicy = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/cancellation-policy", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel cancellation policy"));
    throw error;
  }
};

export const bookHotel = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/book", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error creating hotel booking"));
    throw error;
  }
};

export const createHotelPaymentOrder = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/create-payment-order", payload);
    return response.data;
  } catch (error) {
    if (!error?.response?.data?.duplicateBookingBlocked) {
      console.error(getErrorMessage(error, "Error creating hotel payment order"));
    }
    throw error;
  }
};

export const verifyHotelPaymentAndBook = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/verify-payment-and-book", payload, {
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error verifying hotel payment"));
    throw error;
  }
};

export const holdHotelBooking = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/hold", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error creating hotel hold booking"));
    throw error;
  }
};

export const confirmHotelBooking = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/confirm-book", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error confirming hotel booking"));
    throw error;
  }
};

export const getHotelBookingDetails = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/booking-details", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel booking details"));
    throw error;
  }
};

export const cancelHotelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.post(`hotels/cancel-booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error cancelling hotel booking"));
    throw error;
  }
};

export const getRecentHotelBookings = async (payload) => {
  try {
    const response = await axiosInstance.post("hotels/recent-bookings", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching recent hotel bookings"));
    throw error;
  }
};

export const getAllHotelBookings = async (params = {}) => {
  try {
    const response = await axiosInstance.get("hotels/all-bookings", { params });
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel bookings"));
    throw error;
  }
};
