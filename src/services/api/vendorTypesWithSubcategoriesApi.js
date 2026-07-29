import { API_BASE_URL } from "../../config/constants";
import { dedupeRequest } from "./dedupeApi";

export const VENDOR_TYPES_URL = `${API_BASE_URL}/vendor-types/with-subcategories/all`;

// Three separate call sites hit this endpoint on the homepage alone (header,
// hero, category grid). Going through dedupeRequest with one shared URL string
// collapses them into a single network request.
export const fetchVendorTypesWithSubcategoriesApi = async () => {
  try {
    const res = await dedupeRequest(VENDOR_TYPES_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    return [];
  }
};
