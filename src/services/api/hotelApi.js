import axiosInstance from "./axiosInstance";

export const getHotelCountries = async () => {
  try {
    const response = await axiosInstance.get("/hotelcontent/countries");
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel countries:", error);
    throw error;
  }
};

export const getHotelDestinations = async (countryCode) => {
  try {
    const response = await axiosInstance.get("/hotelcontent/destinations", {
      params: { countryCode },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel destinations:", error);
    throw error;
  }
};

export const searchHotels = async (payload) => {
  try {
    const response = await axiosInstance.post("/hotels/search", payload);
    return response.data;
  } catch (error) {
    console.error("Error searching hotels:", error);
    throw error;
  }
};

export const getHotelImages = async (hotelCode) => {
  try {
    const response = await axiosInstance.get("/hotelcontent/images", {
      params: { hotelCode },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching hotel images:", error);
    throw error;
  }
};
