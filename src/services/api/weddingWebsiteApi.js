// import { API_BASE_URL } from '../../config/constants';

// class WeddingWebsiteApiService {
//     constructor() {
//         this.baseURL = API_BASE_URL;
//     }

//     // Get auth token from localStorage or Redux store
//     getAuthToken() {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             throw new Error('No authentication token found');
//         }
//         return token;
//     }

//     // Create a new wedding website
//     async createWebsite(data) {
//         try {
//             const token = this.getAuthToken();
//             const formData = this.createFormData(data);

//             const response = await fetch(`${this.baseURL}/wedding-websites`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to create website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error creating wedding website:', error);
//             throw error;
//         }
//     }

//     async getMyWebsites() {
//         try {
//             const token = this.getAuthToken();

//             const response = await fetch(`${this.baseURL}/wedding-websites`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to fetch websites: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching wedding websites:', error);
//             throw error;
//         }
//     }

//     // Get a specific wedding website by ID
//     async getWebsiteById(id) {
//         try {
//             const token = this.getAuthToken();

//             const response = await fetch(`${this.baseURL}/wedding-websites/${id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to fetch website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching wedding website:', error);
//             throw error;
//         }
//     }

//     // Update a wedding website
//     async updateWebsite(id, data) {
//         try {
//             const token = this.getAuthToken();
//             const formData = this.createFormData(data);

//             const response = await fetch(`${this.baseURL}/wedding-websites/${id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to update website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error updating wedding website:', error);
//             throw error;
//         }
//     }

//     // Delete a wedding website
//     async deleteWebsite(id) {
//         try {
//             const token = this.getAuthToken();

//             const response = await fetch(`${this.baseURL}/wedding-websites/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to delete website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error deleting wedding website:', error);
//             throw error;
//         }
//     }

//     // Publish a wedding website
//     async publishWebsite(id) {
//         try {
//             const token = this.getAuthToken();

//             const response = await fetch(`${this.baseURL}/wedding-websites/${id}/publish`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to publish website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error publishing wedding website:', error);
//             throw error;
//         }
//     }

//     // Get public wedding website by URL (no auth required)
//     async getPublicWebsite(websiteUrl) {
//         try {
//             const response = await fetch(`${this.baseURL}/wedding/${websiteUrl}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Failed to fetch public website: ${errorText}`);
//             }

//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching public wedding website:', error);
//             throw error;
//         }
//     }

//     // Helper method to create FormData from wedding website data
//     createFormData(data) {
//         const formData = new FormData();

//         // Add template ID and wedding date
//         if (data.templateId) formData.append('templateId', data.templateId);
//         if (data.weddingDate) formData.append('weddingDate', data.weddingDate);

//         // Add JSON data fields
//         if (data.brideData) formData.append('brideData', JSON.stringify(data.brideData));
//         if (data.groomData) formData.append('groomData', JSON.stringify(data.groomData));
//         if (data.loveStory) formData.append('loveStory', JSON.stringify(data.loveStory));
//         if (data.weddingParty) formData.append('weddingParty', JSON.stringify(data.weddingParty));
//         if (data.whenWhere) formData.append('whenWhere', JSON.stringify(data.whenWhere));
//         if (data.galleryImages) formData.append('galleryImages', JSON.stringify(data.galleryImages));

//         // Add files
//         if (data.sliderImages && data.sliderImages.length > 0) {
//             data.sliderImages.forEach(file => {
//                 if (file instanceof File) formData.append('slider', file);
//             });
//         }

//         if (data.brideImage && data.brideImage instanceof File) {
//             formData.append('bride', data.brideImage);
//         }

//         if (data.groomImage && data.groomImage instanceof File) {
//             formData.append('groom', data.groomImage);
//         }

//         if (data.loveStoryImages && data.loveStoryImages.length > 0) {
//             data.loveStoryImages.forEach(file => {
//                 if (file instanceof File) formData.append('loveStory', file);
//             });
//         }

//         if (data.weddingPartyImages && data.weddingPartyImages.length > 0) {
//             data.weddingPartyImages.forEach(file => {
//                 if (file instanceof File) formData.append('weddingParty', file);
//             });
//         }

//         if (data.whenWhereImages && data.whenWhereImages.length > 0) {
//             data.whenWhereImages.forEach(file => {
//                 if (file instanceof File) formData.append('whenWhere', file);
//             });
//         }

//         if (data.galleryFiles && data.galleryFiles.length > 0) {
//             data.galleryFiles.forEach(file => {
//                 if (file instanceof File) formData.append('gallery', file);
//             });
//         }

//         return formData;
//     }
// }

// // Create and export a singleton instance
// export const weddingWebsiteApi = new WeddingWebsiteApiService();
// export { WeddingWebsiteApiService };

import axios from "axios";

const API_BASE_URL = "https://happywedz.com/api";

const getAuthHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const createWebsite = async (formData, token) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/wedding-websites`, formData, {
      headers: {
        ...getAuthHeader(token),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error creating wedding website:",
      err.response?.data || err.message
    );
    throw new Error(
      `Failed to create website: ${JSON.stringify(
        err.response?.data || err.message
      )}`
    );
  }
};

export const getMyWebsites = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/wedding-websites`, {
      headers: getAuthHeader(token),
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error fetching websites:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const getWebsiteById = async (id, token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/wedding-websites/${id}`, {
      headers: getAuthHeader(token),
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error fetching website:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const updateWebsite = async (id, formData, token) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/wedding-websites/${id}`,
      formData,
      {
        headers: {
          ...getAuthHeader(token),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error updating website:",
      err.response?.data || err.message
    );
    throw new Error(
      `Failed to update website: ${JSON.stringify(
        err.response?.data || err.message
      )}`
    );
  }
};

export const deleteWebsite = async (id, token) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/wedding-websites/${id}`, {
      headers: getAuthHeader(token),
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error deleting website:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const publishWebsite = async (id, token) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/wedding-websites/${id}/publish`,
      {},
      {
        headers: getAuthHeader(token),
      }
    );
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error publishing website:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const viewPublicWebsite = async (websiteUrl, token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/wedding/${websiteUrl}`, {
      headers: getAuthHeader(token),
    });
    return res.data;
  } catch (err) {
    console.error(
      "❌ Error loading public website:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const weddingWebsiteApi = {
  createWebsite,
  getMyWebsites,
  getWebsiteById,
  updateWebsite,
  deleteWebsite,
  publishWebsite,
  viewPublicWebsite,
};
