// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   (import.meta.env.DEV ? "/api" : "https://www.happywedz.com/ai/api");

// class BeautyApiService {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   async makeJsonRequest(path, options = {}) {
//     const url = `${this.baseURL}${path}`;
//     const defaultOptions = {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     };
//     const config = {
//       ...defaultOptions,
//       ...options,
//       headers: {
//         ...defaultOptions.headers,
//         ...(options.headers || {}),
//       },
//     };
//     const response = await fetch(url, config);
//     if (!response.ok) {
//       const text = await response.text().catch(() => "");
//       throw new Error(
//         `HTTP ${response.status}: ${text || response.statusText}`
//       );
//     }
//     return response.json().catch(() => ({}));
//   }

//   async makeFormRequest(path, formData, options = {}) {
//     const url = `${this.baseURL}${path}`;
//     const config = {
//       method: "POST",
//       body: formData,
//       ...(options || {}),
//       headers: {
//         Accept: "application/json",
//         ...((options && options.headers) || {}),
//       },
//     };
//     const response = await fetch(url, config);
//     if (!response.ok) {
//       const text = await response.text().catch(() => "");
//       throw new Error(
//         `HTTP ${response.status}: ${text || response.statusText}`
//       );
//     }
//     return response.json().catch(() => ({}));
//   }

//   async getFilteredProducts(category, detailedCategory) {
//     const qs = new URLSearchParams();
//     if (category) qs.set("category", category);
//     if (detailedCategory) qs.set("detailed_category", detailedCategory);
//     return this.makeJsonRequest(`/products/filter_products?${qs.toString()}`, {
//       method: "GET",
//     });
//   }

//   async uploadImage(file, imageType = "ORIGINAL") {
//     const form = new FormData();
//     form.append("image", file);
//     form.append("file", file);
//     form.append("image_type", imageType);
//     return this.makeFormRequest(`/images`, form);
//   }

//   async applyMakeup(payload) {
//     return this.makeJsonRequest(`/images/apply-makeup`, {
//       method: "POST",
//       body: JSON.stringify(payload),
//     });
//   }

//   // async getImageById(imageId) {
//   //   return this.makeJsonRequest(`/images/${imageId}`, { method: "GET" });
//   // }
//   async getImageById(imageId) {
//     return this.makeJsonRequest(`/api/images/${imageId}`, { method: "GET" });
//   }
// }

// export const beautyApi = new BeautyApiService();
// export { BeautyApiService };

// src/services/BeautyApiService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

class BeautyApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic JSON request
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

  // Generic FormData request
  async makeFormRequest(path, formData, options = {}) {
    const url = `${this.baseURL}${path}`;
    const config = {
      method: "POST",
      body: formData,
      ...(options || {}),
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

  // Get filtered products
  async getFilteredProducts(category, detailedCategory) {
    const qs = new URLSearchParams();
    if (category) qs.set("category", category);
    if (detailedCategory) qs.set("detailed_category", detailedCategory);

    return this.makeJsonRequest(`/products/filter_products?${qs.toString()}`, {
      method: "GET",
    });
  }

  // Upload an image
  async uploadImage(file, imageType = "ORIGINAL") {
    const form = new FormData();
    form.append("image", file);
    form.append("file", file);
    form.append("image_type", imageType);

    return this.makeFormRequest(`/images`, form);
  }

  // Apply makeup to an image
  async applyMakeup(payload) {
    return this.makeJsonRequest(`/images/apply-makeup`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Get image by ID
  async getImageById(imageId) {
    return this.makeJsonRequest(`/images/${imageId}`, { method: "GET" });
  }
}

export const beautyApi = new BeautyApiService();
export { BeautyApiService };
