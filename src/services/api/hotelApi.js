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
