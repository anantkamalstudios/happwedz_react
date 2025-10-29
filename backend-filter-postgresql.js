const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

router.get("/vendor-services", async (req, res) => {
  try {
    const {
      vendorType,
      subCategory,
      city,
      page = 1,
      limit = 9,
      filters,
    } = req.query;

    let parsedFilters = {};
    if (filters) {
      try {
        parsedFilters = JSON.parse(filters);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "Invalid filters format",
        });
      }
    }

    // Build Sequelize WHERE clause
    const whereClause = {};
    const attributesWhere = {}; // For JSONB attributes column

    // Basic filters
    if (vendorType) {
      whereClause["$vendor.vendorType.name$"] = vendorType;
    }
    if (subCategory && subCategory.toLowerCase() !== "all") {
      whereClause["$subcategory.name$"] = subCategory;
    }
    if (city && city !== "all") {
      whereClause["$vendor.city$"] = city;
    }

    // Apply dynamic filters based on filter type
    const filterConditions = buildFilterConditions(
      parsedFilters,
      subCategory || vendorType
    );

    // Merge filter conditions
    if (filterConditions.length > 0) {
      whereClause[Op.and] = filterConditions;
    }

    console.log("🔍 Final WHERE clause:", JSON.stringify(whereClause, null, 2));

    // Calculate pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const { count, rows } = await VendorService.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Vendor,
          as: "vendor",
          include: [
            {
              model: VendorType,
              as: "vendorType",
            },
          ],
        },
        {
          model: Subcategory,
          as: "subcategory",
          include: [
            {
              model: VendorType,
              as: "vendorType",
            },
          ],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [
        [{ model: "attributes", as: "rating" }, "DESC"],
        [{ model: "attributes", as: "review_count" }, "DESC"],
      ],
      distinct: true,
    });

    console.log(`✅ Found ${count} results`);

    // Return response
    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
      },
      appliedFilters: parsedFilters,
    });
  } catch (error) {
    console.error("❌ Error in vendor-services endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

/**
 * Build filter conditions for Sequelize
 * Handles all filter types from filtersConfig.js
 */
function buildFilterConditions(filters, categoryKey) {
  const conditions = [];

  if (!filters || Object.keys(filters).length === 0) {
    return conditions;
  }

  // Iterate through each filter group
  for (const [filterKey, filterValues] of Object.entries(filters)) {
    if (!filterValues || filterValues.length === 0) continue;

    const filterCondition = buildSingleFilterCondition(
      filterKey,
      filterValues,
      categoryKey
    );
    if (filterCondition) {
      conditions.push(filterCondition);
    }
  }

  return conditions;
}

/**
 * Build condition for a single filter type
 */
function buildSingleFilterCondition(filterKey, filterValues, categoryKey) {
  const lowerKey = filterKey.toLowerCase();

  // RATING FILTERS
  if (lowerKey === "rating") {
    return buildRatingCondition(filterValues);
  }

  // REVIEW COUNT FILTERS
  if (lowerKey === "review count" || lowerKey === "reviewcount") {
    return buildReviewCountCondition(filterValues);
  }

  // PRICE FILTERS (Multiple types)
  if (lowerKey.includes("price") || lowerKey === "prices") {
    return buildPriceCondition(filterKey, filterValues, categoryKey);
  }

  // LOCALITY FILTER
  if (lowerKey === "locality") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.locality": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // NO OF DAYS FILTER
  if (lowerKey === "no of days") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.no_of_days": value,
      })),
    };
  }

  // SERVICES FILTER
  if (lowerKey === "services") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.services": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // SPECIALTY FILTER
  if (lowerKey === "specialty" || lowerKey === "speciality") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.specialty": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // TRAVELS TO VENUE FILTER
  if (lowerKey === "travels to venue") {
    const travelsValue = filterValues.includes("travels to venue");
    return {
      "attributes.travels_to_venue": travelsValue,
    };
  }

  // VENUE TYPE FILTER
  if (lowerKey === "venue type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.venue_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // CAPACITY FILTER
  if (lowerKey === "capacity") {
    return buildCapacityCondition(filterValues);
  }

  // CUISINES FILTER
  if (lowerKey === "cuisines") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.cuisines": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // JEWELRY TYPE FILTER
  if (
    lowerKey === "jewelry type" ||
    lowerKey === "jewellery type" ||
    lowerKey === "type"
  ) {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // RENTAL AVAILABLE FILTER
  if (lowerKey === "rental available") {
    const rentalValue = filterValues.includes("yes");
    return {
      "attributes.rental_available": rentalValue,
    };
  }

  // FLAVORS FILTER
  if (lowerKey === "flavors") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.flavors": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // TIERS FILTER
  if (lowerKey === "tiers") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.tiers": value,
      })),
    };
  }

  // EGG LESS AVAILABLE FILTER
  if (lowerKey === "egg less available") {
    const egglessValue = filterValues.includes("yes");
    return {
      "attributes.eggless_available": egglessValue,
    };
  }

  // INVITATION TYPE FILTER
  if (lowerKey === "invitation type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.invitation_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // DELIVERY TIME FILTER
  if (lowerKey === "delivery time") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.delivery_time": value,
      })),
    };
  }

  // MIN ORDER QUANTITY FILTER
  if (lowerKey === "min order quantity") {
    return buildMinOrderQuantityCondition(filterValues);
  }

  // STORE TYPE FILTER
  if (lowerKey === "store type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.store_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // WEAR TYPE FILTER
  if (lowerKey === "wear type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.wear_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // OUTFIT TYPE FILTER
  if (lowerKey === "outfit type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.outfit_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // DANCE STYLE FILTER
  if (lowerKey === "dance style") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.dance_style": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // GROUP SIZE FILTER
  if (lowerKey === "group size") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.group_size": value,
      })),
    };
  }

  // GIFT TYPE FILTER
  if (lowerKey === "gift type") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.gift_type": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // DESTINATIONS FILTER
  if (lowerKey === "destinations") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.destinations": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // BUDGET FILTER (for honeymoon)
  if (lowerKey === "budget") {
    return buildBudgetCondition(filterValues);
  }

  // DURATION FILTER
  if (lowerKey === "duration") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.duration": value,
      })),
    };
  }

  // EVENTS FILTER
  if (lowerKey === "events") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.events": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // TRAVEL PREFERENCES FILTER
  if (lowerKey === "travel preferences") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.travel_preferences": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // EXPERIENCE FILTER
  if (lowerKey === "experience") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.experience": value,
      })),
    };
  }

  // LANGUAGES FILTER
  if (lowerKey === "languages") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.languages": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // CULTURE FILTER
  if (lowerKey === "culture") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.culture": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // PRICING FILTER (for pandits, etc.)
  if (lowerKey === "pricing") {
    return buildPricingCondition(filterValues);
  }

  // ACCESSORIES FILTER
  if (lowerKey === "accessories") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.accessories": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // SPACE AVAILABLE FILTER
  if (lowerKey === "space available") {
    return {
      [Op.or]: filterValues.map((value) => ({
        "attributes.space_available": { [Op.iLike]: `%${value}%` },
      })),
    };
  }

  // AWARD FILTER
  if (lowerKey === "award") {
    return {
      "attributes.award": { [Op.ne]: null },
    };
  }

  // STARTING PRICE FILTER
  if (lowerKey === "starting price") {
    return buildStartingPriceCondition(filterValues);
  }

  // DESIGN COST FILTER
  if (lowerKey === "design cost") {
    // Usually "on request", so just check if it exists
    return {
      "attributes.design_cost": { [Op.ne]: null },
    };
  }

  // PHYSICAL INVITE PRICE FILTER
  if (lowerKey === "physical invite price") {
    return buildPhysicalInvitePriceCondition(filterValues);
  }

  // MAX CAPACITY FILTER
  if (lowerKey === "max capacity") {
    return buildMaxCapacityCondition(filterValues);
  }

  // MIN CAPACITY FILTER
  if (lowerKey === "min capacity") {
    return buildMinCapacityCondition(filterValues);
  }

  // PACKAGE PRICE FILTER
  if (lowerKey.includes("package price")) {
    return buildPackagePriceCondition(filterKey, filterValues);
  }

  // HOME FUNCTION DECOR FILTER
  if (lowerKey === "home function decor") {
    return buildHomeDecorPriceCondition(filterValues);
  }

  // DECOR PRICE FILTER
  if (lowerKey === "decor price") {
    return buildDecorPriceCondition(filterValues);
  }

  // BRIDAL PRICE FILTER (for mehandi)
  if (lowerKey === "bridal price") {
    return buildBridalPriceCondition(filterValues);
  }

  // PRICE PER KG FILTER
  if (lowerKey === "price per kg") {
    return buildPricePerKgCondition(filterValues);
  }

  // PRICING FOR 200 GUESTS FILTER
  if (lowerKey === "pricing for 200 guests") {
    return buildPricingFor200GuestsCondition(filterValues);
  }

  // Default: Try to match as generic attribute
  return {
    [Op.or]: filterValues.map((value) => ({
      [`attributes.${filterKey.toLowerCase().replace(/\s+/g, "_")}`]: {
        [Op.iLike]: `%${value}%`,
      },
    })),
  };
}

/**
 * Build RATING filter condition
 */
function buildRatingCondition(values) {
  const conditions = values
    .map((value) => {
      if (value === "all ratings") return null;
      if (value === "rated <4") return { "attributes.rating": { [Op.lt]: 4 } };
      if (value === "rated 4+") return { "attributes.rating": { [Op.gte]: 4 } };
      if (value === "rated 4.5+")
        return { "attributes.rating": { [Op.gte]: 4.5 } };
      if (value === "rated 4.8+")
        return { "attributes.rating": { [Op.gte]: 4.8 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build REVIEW COUNT filter condition
 */
function buildReviewCountCondition(values) {
  const conditions = values
    .map((value) => {
      if (value === "<5 reviews")
        return { "attributes.review_count": { [Op.lt]: 5 } };
      if (value === "5+ reviews")
        return { "attributes.review_count": { [Op.gte]: 5 } };
      if (value === "15+ reviews")
        return { "attributes.review_count": { [Op.gte]: 15 } };
      if (value === "30+ reviews")
        return { "attributes.review_count": { [Op.gte]: 30 } };
      if (value === "under 50 reviews")
        return { "attributes.review_count": { [Op.lt]: 50 } };
      if (value === "50 - 100 reviews")
        return {
          "attributes.review_count": { [Op.between]: [50, 100] },
        };
      if (value === "100 - 500 reviews")
        return {
          "attributes.review_count": { [Op.between]: [100, 500] },
        };
      if (value === "500+ reviews")
        return { "attributes.review_count": { [Op.gte]: 500 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PRICE filter condition (generic for all price types)
 */
function buildPriceCondition(filterKey, values, categoryKey) {
  const lowerKey = filterKey.toLowerCase();
  let fieldName = "starting_price";

  // Determine the correct field name based on filter key
  if (lowerKey.includes("bridal makeup")) {
    fieldName = "bridal_makeup_price";
  } else if (lowerKey.includes("engagement")) {
    fieldName = "engagement_price";
  } else if (lowerKey.includes("per plate")) {
    fieldName = "price_per_plate";
  } else if (lowerKey === "prices") {
    fieldName = "starting_price";
  }

  const conditions = values
    .map((range) => {
      return parsePriceRange(range, fieldName);
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Parse price range string and return condition
 */
function parsePriceRange(range, fieldName = "starting_price") {
  // Remove commas and parse
  const cleanRange = range.replace(/,/g, "");

  // Handle "less than" ranges
  if (cleanRange.startsWith("<") || cleanRange.startsWith("under")) {
    const value = parseInt(cleanRange.replace(/[^0-9]/g, ""));
    return { [`attributes.${fieldName}`]: { [Op.lte]: value } };
  }

  // Handle "greater than" ranges with +
  if (cleanRange.includes("+")) {
    const value = parseInt(cleanRange.replace(/[^0-9]/g, ""));
    return { [`attributes.${fieldName}`]: { [Op.gte]: value } };
  }

  // Handle range with dash
  if (cleanRange.includes("-")) {
    const parts = cleanRange
      .split("-")
      .map((p) => parseInt(p.replace(/[^0-9]/g, "")));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return {
        [`attributes.${fieldName}`]: {
          [Op.between]: [parts[0], parts[1]],
        },
      };
    }
  }

  // Handle single value
  const value = parseInt(cleanRange.replace(/[^0-9]/g, ""));
  if (!isNaN(value)) {
    return { [`attributes.${fieldName}`]: { [Op.lte]: value } };
  }

  return null;
}

/**
 * Build CAPACITY filter condition
 */
function buildCapacityCondition(values) {
  const conditions = values
    .map((range) => {
      if (range === "<100") return { "attributes.capacity": { [Op.lt]: 100 } };
      if (range === "100-200")
        return { "attributes.capacity": { [Op.between]: [100, 200] } };
      if (range === "200-500")
        return { "attributes.capacity": { [Op.between]: [200, 500] } };
      if (range === "500-1000")
        return { "attributes.capacity": { [Op.between]: [500, 1000] } };
      if (range === "1000+")
        return { "attributes.capacity": { [Op.gte]: 1000 } };
      if (range === "<100") return { "attributes.capacity": { [Op.lt]: 100 } };
      if (range === "100-300")
        return { "attributes.capacity": { [Op.between]: [100, 300] } };
      if (range === "300-500")
        return { "attributes.capacity": { [Op.between]: [300, 500] } };
      if (range === "500+") return { "attributes.capacity": { [Op.gte]: 500 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build HOME FUNCTION DECOR price condition
 */
function buildHomeDecorPriceCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "home_function_decor_price");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build DECOR PRICE condition
 */
function buildDecorPriceCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "decor_price");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build BRIDAL PRICE condition (for mehandi)
 */
function buildBridalPriceCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "bridal_price");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PACKAGE PRICE condition
 */
function buildPackagePriceCondition(filterKey, values) {
  const fieldName = filterKey.toLowerCase().replace(/\s+/g, "_");
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, fieldName);
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build BUDGET condition (for honeymoon)
 */
function buildBudgetCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "budget");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PRICING condition (for pandits)
 */
function buildPricingCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "pricing");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build STARTING PRICE condition
 */
function buildStartingPriceCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "starting_price");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PHYSICAL INVITE PRICE condition
 */
function buildPhysicalInvitePriceCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "physical_invite_price");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PRICE PER KG condition
 */
function buildPricePerKgCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "price_per_kg");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build PRICING FOR 200 GUESTS condition
 */
function buildPricingFor200GuestsCondition(values) {
  const conditions = values
    .map((range) => {
      return parsePriceRange(range, "pricing_for_200_guests");
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build MAX CAPACITY condition
 */
function buildMaxCapacityCondition(values) {
  const conditions = values
    .map((range) => {
      if (range === "<100")
        return { "attributes.max_capacity": { [Op.lt]: 100 } };
      if (range === "100-500")
        return { "attributes.max_capacity": { [Op.between]: [100, 500] } };
      if (range === "500-1000")
        return { "attributes.max_capacity": { [Op.between]: [500, 1000] } };
      if (range === "1000+")
        return { "attributes.max_capacity": { [Op.gte]: 1000 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build MIN CAPACITY condition
 */
function buildMinCapacityCondition(values) {
  const conditions = values
    .map((range) => {
      if (range === "<30")
        return { "attributes.min_capacity": { [Op.lt]: 30 } };
      if (range === "<50")
        return { "attributes.min_capacity": { [Op.lt]: 50 } };
      if (range === "<70")
        return { "attributes.min_capacity": { [Op.lt]: 70 } };
      if (range === "<100")
        return { "attributes.min_capacity": { [Op.lt]: 100 } };
      if (range === "<200")
        return { "attributes.min_capacity": { [Op.lt]: 200 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

/**
 * Build MIN ORDER QUANTITY condition
 */
function buildMinOrderQuantityCondition(values) {
  const conditions = values
    .map((range) => {
      if (range === "<30")
        return { "attributes.min_order_quantity": { [Op.lt]: 30 } };
      if (range === "30-50")
        return { "attributes.min_order_quantity": { [Op.between]: [30, 50] } };
      if (range === "50-100")
        return { "attributes.min_order_quantity": { [Op.between]: [50, 100] } };
      if (range === "100-150")
        return {
          "attributes.min_order_quantity": { [Op.between]: [100, 150] },
        };
      if (range === "150+")
        return { "attributes.min_order_quantity": { [Op.gte]: 150 } };
      return null;
    })
    .filter(Boolean);

  return conditions.length > 0 ? { [Op.or]: conditions } : null;
}

module.exports = router;
