const API_BASE_URL = "https://happywedz.com/api";

class VendorsApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/sub-vendors`;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
        pagination: data.pagination,
        message: data.message,
      };
    } catch (error) {
      console.error("API Request failed:", error);
      return {
        success: false,
        data: null,
        message: error.message || "An error occurred while making the request",
      };
    }
  }

  // Get all vendors with optional filters
  async getVendors(params = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== null &&
        params[key] !== undefined &&
        params[key] !== ""
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `?${queryString}` : "";

    return this.makeRequest(endpoint, {
      method: "GET",
    });
  }

  // Get vendor by ID
  async getVendorById(id) {
    if (!id) {
      return {
        success: false,
        data: null,
        message: "Vendor ID is required",
      };
    }

    return this.makeRequest(`/${id}`, {
      method: "GET",
    });
  }

  // Create new vendor
  async createVendor(vendorData) {
    return this.makeRequest("", {
      method: "POST",
      body: JSON.stringify(vendorData),
    });
  }

  // Update vendor
  async updateVendor(id, vendorData) {
    if (!id) {
      return {
        success: false,
        data: null,
        message: "Vendor ID is required",
      };
    }

    return this.makeRequest(`/${id}`, {
      method: "PUT",
      body: JSON.stringify(vendorData),
    });
  }

  // Delete vendor
  async deleteVendor(id) {
    if (!id) {
      return {
        success: false,
        data: null,
        message: "Vendor ID is required",
      };
    }

    return this.makeRequest(`/${id}`, {
      method: "DELETE",
    });
  }

  // Get vendors by category
  async getVendorsByCategory(categoryId, params = {}) {
    return this.getVendors({
      category_id: categoryId,
      ...params,
    });
  }

  // Get vendors by type
  async getVendorsByType(vendorType, params = {}) {
    return this.getVendors({
      vendor_type: vendorType,
      ...params,
    });
  }

  // Search vendors
  async searchVendors(searchTerm, params = {}) {
    return this.getVendors({
      search: searchTerm,
      ...params,
    });
  }

  // Get vendors by location
  async getVendorsByLocation(location, params = {}) {
    return this.getVendors({
      location,
      ...params,
    });
  }

  // Get featured vendors
  async getFeaturedVendors(params = {}) {
    return this.getVendors({
      is_featured: true,
      ...params,
    });
  }

  // Get vendors with availability
  async getAvailableVendors(date, params = {}) {
    return this.getVendors({
      available_date: date,
      ...params,
    });
  }
}

export const vendorsApi = new VendorsApiService();

export { VendorsApiService };
