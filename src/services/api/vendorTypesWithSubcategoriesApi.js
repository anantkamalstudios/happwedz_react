export const fetchVendorTypesWithSubcategoriesApi = async () => {
  try {
    const response = await fetch(
      "https://happywedz.com/api/vendor-types/with-subcategories/all"
      // "https://localhost:4000/vendor-types/with-subcategories/all"
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};
