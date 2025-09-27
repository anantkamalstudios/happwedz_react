import axios from "axios";

const API_BASE_URL = "https://happywedz.com/api";

const vendorServicesApi = {
  /**
   * Create or update a vendor service.
   * @param {FormData} serviceData - FormData including attributes, media, etc.
   * @param {string} token - JWT token
   * @param {number|string} [id] - If provided, will update (PUT) /vendor-services/:id
   */
  createOrUpdateService: async (serviceData, token, id = null) => {
    try {
      let url = `${API_BASE_URL}/vendor-services`;
      let method = "post";
      if (id) {
        url = `${API_BASE_URL}/vendor-services/${id}`;
        method = "put";
      }
      const response = await axios({
        method,
        url,
        data: serviceData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error creating/updating vendor service:",
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("API request failed");
    }
  },
};

export default vendorServicesApi;
