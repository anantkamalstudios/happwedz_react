// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL ||
//   (import.meta.env.DEV ? "/ai" : "https://www.happywedz.com/ai");

// class BeautyApiService {
//   constructor() {
//     this.baseURL = API_BASE_URL.replace(/\/+$/, "");
//   }

//   buildUrl(path) {
//     const cleanPath = path.replace(/^\/+/, "");
//     return `${this.baseURL}/${cleanPath}`;
//   }

//   async makeJsonRequest(path, options = {}) {
//     const url = this.buildUrl(path);

//     const defaultOptions = {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//     };

//     const { signal, ...rest } = options;
//     const config = {
//       ...defaultOptions,
//       ...rest,
//       signal,
//       headers: {
//         ...defaultOptions.headers,
//         ...(rest.headers || {}),
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
//     const url = this.buildUrl(path);

//     const { signal, ...rest } = options;
//     const config = {
//       method: "POST",
//       body: formData,
//       signal,
//       ...rest,
//       headers: {
//         Accept: "application/json",
//         ...(rest.headers || {}),
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

//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     const role = userInfo?.role;

//     if (category) qs.set("category", category);
//     if (detailedCategory) qs.set("detailed_category", detailedCategory);
//     if (role) qs.set("user", role);

//     return this.makeJsonRequest(`/products/filter_products?${qs.toString()}`, {
//       method: "GET",
//     });
//   }

//   async uploadImage(file, imageType = "ORIGINAL", signal) {
//     const form = new FormData();
//     form.append("image", file);
//     form.append("file", file);
//     form.append("image_type", imageType);

//     return this.makeFormRequest("/images", form, { signal });
//   }

//   async applyMakeup(payload, signal) {
//     return this.makeJsonRequest("/images/apply-makeup", {
//       method: "POST",
//       body: JSON.stringify(payload),
//       signal,
//     });
//   }

//   async getImageById(imageId, signal) {
//     return this.makeJsonRequest(`/images/${imageId}`, {
//       method: "GET",
//       signal,
//     });
//   }
// }

// export const beautyApi = new BeautyApiService();
// export { BeautyApiService };

import { aiAxiosInstance } from "./axiosInstance";

class BeautyApiService {
  async makeJsonRequest(path, options = {}) {
    try {
      const { signal, ...rest } = options;
      const response = await aiAxiosInstance({
        method: rest.method || "GET",
        url: path,
        data: rest.body ? JSON.parse(rest.body) : undefined,
        params: rest.params,
        signal,
        headers: {
          "Content-Type": "application/json",
          ...(rest.headers || {}),
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message;
        throw new Error(`HTTP ${error.response.status}: ${errorMessage}`);
      }
      throw error;
    }
  }

  async makeFormRequest(path, formData, options = {}) {
    try {
      const { signal, ...rest } = options;
      const response = await aiAxiosInstance({
        method: "POST",
        url: path,
        data: formData,
        signal,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(rest.headers || {}),
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || error.message;
        throw new Error(`HTTP ${error.response.status}: ${errorMessage}`);
      }
      throw error;
    }
  }

  async getFilteredProducts(category, detailedCategory) {
    const qs = new URLSearchParams();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const role = userInfo?.role;

    if (category) qs.set("category", category);
    if (detailedCategory) qs.set("detailed_category", detailedCategory);
    if (role) qs.set("user", role);

    return this.makeJsonRequest(`/products/filter_products?${qs.toString()}`);
  }

  async uploadImage(file, imageType = "ORIGINAL", signal) {
    const form = new FormData();
    form.append("image", file);
    form.append("file", file);
    form.append("image_type", imageType);

    return this.makeFormRequest("/images", form, { signal });
  }

  async applyMakeup(payload, signal) {
    return this.makeJsonRequest("/images/apply-makeup", {
      method: "POST",
      method: "POST",
      body: JSON.stringify(payload),
      signal,
    });
  }

  async getImageById(imageId, signal) {
    return this.makeJsonRequest(`/images/${imageId}`, {
      method: "GET",
      signal,
    });
  }
}

export const beautyApi = new BeautyApiService();
export { BeautyApiService };
