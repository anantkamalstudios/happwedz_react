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
    const response = await axiosInstance.post("/hotels/suggestions", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel suggestions"));
    throw error;
  }
};

export const searchHotels = async (payload) => {
  try {
    const response = await axiosInstance.post("/hotels/search", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error searching hotels"));
    throw error;
  }
};

export const getHotelFilters = async (payload) => {
  try {
    const response = await axiosInstance.post("/hotels/filters", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel filters"));
    throw error;
  }
};

export const getHotelDetail = async (payload) => {
  try {
    const response = await axiosInstance.post("/hotels/detail", payload);
    return response.data;
  } catch (error) {
    console.error(getErrorMessage(error, "Error fetching hotel detail"));
    throw error;
  }
};
