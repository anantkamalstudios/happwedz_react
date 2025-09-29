// import axios from "axios";

// const API_BASE_URL = "https://happywedz.com/api";

// const vendorServicesApi = {
//   createOrUpdateService: async (serviceData, token) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/vendor-services`,
//         serviceData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Use multipart for file uploads
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error creating/updating vendor service:",
//         error.response?.data || error.message
//       );
//       throw error.response?.data || new Error("API request failed");
//     }
//   },
// };

// export default vendorServicesApi;

import axios from "axios";

const API_BASE_URL = "https://happywedz.com/api";

const vendorServicesApi = {
  /**
   * Get vendor service details by ID
   * @param {number|string} id - Vendor service ID
   */
  getVendorServiceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vendor-services/${id}`);

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching vendor service:",
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("API request failed");
    }
  },

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
