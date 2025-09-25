const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class BeautyApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async makeJsonRequest(path, options = {}) {
    const url = `${this.baseURL}${path}`;
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
        ...(options.headers || {}),
      },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `HTTP ${response.status}: ${text || response.statusText}`
      );
    }
    return response.json().catch(() => ({}));
  }

  async makeFormRequest(path, formData, options = {}) {
    const url = `${this.baseURL}${path}`;
    const config = {
      method: "POST",
      body: formData,
      ...(options || {}),
      // Let the browser set Content-Type with boundary
      headers: {
        Accept: "application/json",
        ...((options && options.headers) || {}),
      },
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `HTTP ${response.status}: ${text || response.statusText}`
      );
    }
    return response.json().catch(() => ({}));
  }

  // GET products by category (e.g., category=MAKEUP) and optional detailed_category
  async getFilteredProducts(category, detailedCategory) {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (detailedCategory) qs.set("detailed_category", detailedCategory);
    return this.makeJsonRequest(`/products/filter_products?${qs.toString()}`, {
      method: "GET",
    });
  }

  // POST an image file to the server, expecting an image id in response
  async uploadImage(file, imageType = "ORIGINAL") {
    const form = new FormData();
    // Common server keys: "image" or "file". We send both for compatibility.
    form.append("image", file);
    form.append("file", file);
    form.append("image_type", imageType);
    return this.makeFormRequest(`/images`, form);
  }

  // POST apply makeup with payload containing image_id, product_ids, and intensities
  async applyMakeup(payload) {
    return this.makeJsonRequest(`/images/apply-makeup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // GET processed image by id
  async getImageById(imageId) {
    return this.makeJsonRequest(`/images/${imageId}`, { method: "GET" });
  }
}

export const beautyApi = new BeautyApiService();
export { BeautyApiService };
