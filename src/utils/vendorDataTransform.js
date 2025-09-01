/**
 * Transform API vendor data to match the expected component format
 * This ensures compatibility with existing components while using dynamic data
 */

export const transformVendorData = (apiVendor) => {
  if (!apiVendor) return null;

  return {
    id: apiVendor.id,
    name: apiVendor.name,
    description: apiVendor.description || apiVendor.tagline || "",
    location: formatLocation(apiVendor.location),
    rating: parseFloat(apiVendor.rating) || 0,
    reviews: apiVendor.reviews_count || 0,
    capacity: apiVendor.capacity_max || apiVendor.capacity_min || 0,
    call: apiVendor.within_24hr_available ? "Responds within 24 hours" : null,
    price: formatPrice(apiVendor.starting_price, apiVendor.currency),
    image: getPrimaryImage(apiVendor.media),
    // Additional fields from API
    vendor_type: apiVendor.vendor_type,
    category_id: apiVendor.category_id,
    status: apiVendor.status,
    slug: apiVendor.slug,
    tagline: apiVendor.tagline,
    subtitle: apiVendor.subtitle,
    badges: apiVendor.badges,
    contact: apiVendor.contact,
    price_range: apiVendor.price_range,
    currency: apiVendor.currency,
    deals: apiVendor.deals,
    packages: apiVendor.packages,
    capacity_min: apiVendor.capacity_min,
    capacity_max: apiVendor.capacity_max,
    rooms: apiVendor.rooms,
    car_parking: apiVendor.car_parking,
    hall_types_note: apiVendor.hall_types_note,
    indoor_outdoor: apiVendor.indoor_outdoor,
    alcohol_policy: apiVendor.alcohol_policy,
    dj_policy: apiVendor.dj_policy,
    catering_policy: apiVendor.catering_policy,
    deco_policy: apiVendor.deco_policy,
    timing_open: apiVendor.timing_open,
    timing_close: apiVendor.timing_close,
    timing_last_entry: apiVendor.timing_last_entry,
    cancellation_policy: apiVendor.cancellation_policy,
    refund_policy: apiVendor.refund_policy,
    payment_terms: apiVendor.payment_terms,
    tnc: apiVendor.tnc,
    blackout_dates: apiVendor.blackout_dates,
    available_slots: apiVendor.available_slots,
    primary_cta: apiVendor.primary_cta,
    cta_phone: apiVendor.cta_phone,
    cta_url: apiVendor.cta_url,
    auto_reply: apiVendor.auto_reply,
    is_featured: apiVendor.is_featured,
    within_24hr_available: apiVendor.within_24hr_available,
    is_feature_available: apiVendor.is_feature_available,
    sort_weight: apiVendor.sort_weight,
    tags: apiVendor.tags,
    owner_id: apiVendor.owner_id,
    notes: apiVendor.notes,
    createdAt: apiVendor.createdAt,
    updatedAt: apiVendor.updatedAt,
    deletedAt: apiVendor.deletedAt,
  };
};

export const transformVendorsData = (apiVendors) => {
  if (!Array.isArray(apiVendors)) return [];
  return apiVendors.map(transformVendorData).filter(Boolean);
};

// Helper functions
const formatLocation = (location) => {
  if (!location) return "";

  if (typeof location === "string") {
    return location;
  }

  if (typeof location === "object") {
    const parts = [];
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    return parts.join(", ");
  }

  return "";
};

const formatPrice = (price, currency = "INR") => {
  if (!price) return "";

  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return "";

  // Convert to lakhs if price is in lakhs range
  if (numPrice >= 100000) {
    const lakhs = (numPrice / 100000).toFixed(1);
    return `${lakhs} Lakh`;
  }

  // Convert to thousands if price is in thousands range
  if (numPrice >= 1000) {
    const thousands = (numPrice / 1000).toFixed(0);
    return `${thousands}K`;
  }

  return `${numPrice}`;
};

const getPrimaryImage = (media) => {
  if (!media || !media.images || !Array.isArray(media.images)) {
    return "https://cdn.shopify.com/s/files/1/0553/6422/3136/files/brian-bossany-0100-_brianbossany.jpg";
  }

  return (
    media.images[0] ||
    "https://cdn.shopify.com/s/files/1/0553/6422/3136/files/brian-bossany-0100-_brianbossany.jpg"
  );
};

// Filter functions for different vendor types
export const filterVendorsByType = (vendors, vendorType) => {
  if (!vendorType) return vendors;
  return vendors.filter((vendor) => vendor.vendor_type === vendorType);
};

export const filterVendorsByCategory = (vendors, categoryId) => {
  if (!categoryId) return vendors;
  return vendors.filter((vendor) => vendor.category_id === categoryId);
};

export const filterVendorsByLocation = (vendors, location) => {
  if (!location) return vendors;
  return vendors.filter((vendor) =>
    vendor.location.toLowerCase().includes(location.toLowerCase())
  );
};

export const searchVendors = (vendors, searchTerm) => {
  if (!searchTerm) return vendors;

  const term = searchTerm.toLowerCase();
  return vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(term) ||
      vendor.description.toLowerCase().includes(term) ||
      vendor.location.toLowerCase().includes(term) ||
      vendor.tagline?.toLowerCase().includes(term) ||
      vendor.tags?.some((tag) => tag.toLowerCase().includes(term))
  );
};

// Sort functions
export const sortVendors = (vendors, sortBy = "name", sortOrder = "asc") => {
  const sorted = [...vendors].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "desc") {
      return bValue > aValue ? 1 : -1;
    }

    return aValue > bValue ? 1 : -1;
  });

  return sorted;
};
