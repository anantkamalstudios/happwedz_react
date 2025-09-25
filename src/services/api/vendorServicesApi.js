import axios from "axios";

const API_BASE_URL = "https://happywedz.com/api"; 

const vendorServicesApi = {

  createOrUpdateService: async (serviceData, token) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/vendor-services`,
        serviceData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Use multipart for file uploads
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating/updating vendor service:", error.response?.data || error.message);
      throw error.response?.data || new Error("API request failed");
    }
  },
};

export default vendorServicesApi;
