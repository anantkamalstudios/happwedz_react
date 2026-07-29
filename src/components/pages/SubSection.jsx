import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";
import DynamicAside from "../layouts/aside/DynamicAside";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import usePhotography from "../../hooks/usePhotography";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import Loader from "../ui/Loader";
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";
import { buildAbsoluteCategoryUrl, buildCategoryUrl } from "../../utils/urlUtils";
import CityCategoryLocalContent, { MIN_LISTING_THRESHOLD } from "../common/CityCategoryLocalContent";
import "../../styles/shared.css";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

/** Build a human-readable section label for metadata */
const SECTION_LABELS = {
  venues: "Wedding Venues",
  vendors: "Wedding Vendors",
  photographers: "Wedding Photographers",
  "makeup-artists": "Bridal Makeup Artists",
  decorators: "Wedding Decorators",
  caterers: "Wedding Caterers",
  photography: "Wedding Photography",
};

const getSectionLabel = (section, slug) => {
  if (slug) return toTitleCase(slug);
  return SECTION_LABELS[section] || toTitleCase(section || "");
};

const buildSubSectionMeta = (section, slug, city) => {
  const effectiveSlug = slug && slug !== "all" ? slug : "";
  const label = effectiveSlug ? getSectionLabel(section, effectiveSlug) : getSectionLabel(section, null);
  const cityStr = city && city !== "all" ? ` in ${toTitleCase(city)}` : " in India";
  
  // Single canonical URL builder enforcing /[section]/[city]/[subcategory]/
  const cleanUrl = buildAbsoluteCategoryUrl(section, city, effectiveSlug);

  return {
    title: `Best ${label}${cityStr} (2026) — Verified Reviews & Prices | HappyWedz`,
    description: `Browse the best top-rated ${label.toLowerCase()}${cityStr}. Compare prices, read real reviews, and contact vendors directly on HappyWedz — India's wedding marketplace.`,
    keywords: `best ${label.toLowerCase()}${cityStr.toLowerCase()}, best ${label.toLowerCase()}, ${label.toLowerCase()} prices, wedding vendors${cityStr.toLowerCase()}`,
    ogUrl: cleanUrl,
    canonicalUrl: cleanUrl,
  };
};

// Maps URL section to the vendorType value the API expects.
// This ensures /venues/noida sends vendorType=Venues to the API,
// matching exactly what MainSection sends — so both local and live
// get identical filtered results.
const SECTION_TO_VENDOR_TYPE = {
  venues: "Venues",
  vendors: null,       // no type filter — show all vendor types
  vendor: null,
  photography: "Photography",
  photographers: "Photography",
};

const SubSection = () => {
  const { section, slug: param1, city: param2 } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const stateCity = location.state?.city;
  const stateMinRating = location.state?.minRating;

  // Use ?vendorType= from URL if present; otherwise derive from section.
  // This is the key fix: without this, /venues/noida sends no vendorType
  // to the API and gets ALL vendor types mixed together.
  const vendorTypeFromQuery = searchParams.get("vendorType");
  const vendorType =
    vendorTypeFromQuery !== null
      ? vendorTypeFromQuery
      : section in SECTION_TO_VENDOR_TYPE
      ? SECTION_TO_VENDOR_TYPE[section]
      : null;

  // Comprehensive list of known Indian cities to disambiguate /:section/:city/:slug vs /:section/:slug/:city
  const knownCities = [
    "mumbai", "pune", "delhi", "bangalore", "kolkata", "chennai", "hyderabad",
    "jaipur", "goa", "all", "mysore", "kanpur", "udaipur", "lucknow", "agra",
    "varanasi", "gurgaon", "noida", "ghaziabad", "faridabad", "ahmedabad", "surat",
    "vadodara", "nagpur", "nashik", "indore", "bhopal", "patna", "ranchi", "coimbatore"
  ];
  
  let resolvedCity = null;
  let resolvedSlug = null;

  if (param1 && param2) {
    const p1Lower = param1.toLowerCase();
    const p2Lower = param2.toLowerCase();

    if (knownCities.includes(p1Lower)) {
      // /vendors/mysore/kanpur/ (Kanpur is category slug, Mysore is city)
      resolvedCity = param1;
      resolvedSlug = param2;
    } else if (knownCities.includes(p2Lower)) {
      // Legacy order: /vendors/kanpur/mysore/
      resolvedCity = param2;
      resolvedSlug = param1;
    } else {
      // Default city-first convention: /vendors/:city/:category/
      resolvedCity = param1;
      resolvedSlug = param2;
    }
  } else if (param1) {
    if (knownCities.includes(param1.toLowerCase())) {
      resolvedCity = param1;
      resolvedSlug = "all";
    } else {
      resolvedSlug = param1;
      resolvedCity = "all";
    }
  }

  const cityFromQuery = resolvedCity || stateCity || searchParams.get("city") || "all";
  const slug = resolvedSlug || "all";
  const minRatingFromQuery =
    stateMinRating !== undefined && stateMinRating !== null
      ? String(stateMinRating)
      : searchParams.get("minRating");
  const title = slug && slug !== "all" ? toTitleCase(slug) : "";

  // Standardize URL: redirect legacy URLs (e.g. /venues/destination-wedding-venues)
  // to the unified canonical path: /:section/:city/:slug/
  useEffect(() => {
    const currentPath = location.pathname;
    const normalizedCurrent = currentPath.endsWith("/") ? currentPath : `${currentPath}/`;
    const expectedPath = buildCategoryUrl(section, cityFromQuery, slug);

    if (normalizedCurrent.toLowerCase() !== expectedPath.toLowerCase() && !currentPath.endsWith(".html")) {
      navigate(`${expectedPath}${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, section, cityFromQuery, slug, navigate]);

  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const storageKey = useMemo(
    () => `viewMode:${section}:${slug || "all"}`,
    [section, slug]
  );

  const [view, setView] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    return saved || "images";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeFilters, setActiveFilters] = useState(() => {
    if (minRatingFromQuery) {
      return { Rating: [`${minRatingFromQuery}+`] };
    }
    return {};
  });

  const {
    typesWithCategories,
    photosByCategory,
    allPhotos,
    loading: photographyLoading,
    error: photographyError,
    fetchTypesWithCategories,
    fetchPhotosByCategory,
    fetchAllPhotos,
  } = usePhotography();

  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(
    cityFromQuery || reduxLocation
  );

  const {
    data: apiData,
    loading,
    error,
    hasMore,
    loadMore,
  } = useInfiniteScroll(
    section,
    slug,
    selectedCity,
    vendorType,
    9,
    activeFilters
  );

  const dataToSend = useMemo(() => {
    if (section === "photography") {
      return [];
    }

    if (error || !apiData || apiData.length === 0) {
      return [];
    }

    return apiData;
  }, [section, apiData, error]);

  const isThinPage = !loading && !photographyLoading && dataToSend.length < MIN_LISTING_THRESHOLD;

  // Dynamic metadata based on section + slug + city
  const subSectionMeta = useMemo(
    () => {
      const meta = buildSubSectionMeta(section, slug, cityFromQuery || reduxLocation);
      if (isThinPage) {
        meta.robots = "noindex, follow";
      }
      return meta;
    },
    [section, slug, cityFromQuery, reduxLocation, isThinPage]
  );
  useDocumentMetadata(subSectionMeta);

  const handleClose = () => {
    setShow(false);
    setSelectedId(null);
  };

  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleFiltersChange = (filters) => {
    setActiveFilters(filters);
  };

  useEffect(() => {
    if (minRatingFromQuery) {
      setActiveFilters({ Rating: [`${minRatingFromQuery}+`] });
    } else {
      setActiveFilters({});
    }
  }, [section, slug, minRatingFromQuery]);

  useEffect(() => {
    if (cityFromQuery && cityFromQuery !== "all") {
      setSelectedCity(cityFromQuery);
      return;
    }
    setSelectedCity(reduxLocation);
  }, [cityFromQuery, reduxLocation]);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (saved && saved !== view) {
      setView(saved);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, view);
      }
    } catch (e) {}
  }, [view, storageKey]);

  useEffect(() => {
    if (section === "photography") {
      fetchTypesWithCategories();
      if (slug) {
        const findCategoryBySlug = () => {
          for (const type of typesWithCategories) {
            if (Array.isArray(type.categories)) {
              const category = type.categories.find(
                (cat) =>
                  cat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9\-]/g, "") === slug
              );
              if (category) return category.id;
            }
          }
          return null;
        };

        const categoryId = findCategoryBySlug();
        if (categoryId) {
          fetchPhotosByCategory(categoryId);
        }
      } else {
        fetchAllPhotos();
      }
    }
  }, [section, slug, typesWithCategories.length]);

  useEffect(() => {}, [
    section,
    slug,
    title,
    selectedCity,
    apiData,
    loading,
    error,
    dataToSend,
  ]);

  if (section === "photography") {
    const photographyData = slug ? photosByCategory : allPhotos;

    return (
      <div className="container-fluid">
        <MainSearch
          title={title}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCityChange={handleCityChange}
        />
        {photographyLoading ? (
          <LoadingState title={title} />
        ) : photographyError ? (
          <ErrorState error={photographyError} />
        ) : (
          <Photos
            images={photographyData}
            loading={photographyLoading}
          />
        )}
      </div>
    );
  }

  if (view === "map") {
    return (
      <MapView
        subVenuesData={dataToSend}
        section={section}
        onClose={() => setView("images")}
      />
    );
  }

  if (loading && dataToSend.length === 0) {
    return <Loader />;
  }

  return (
    <div className="container-fluid">
      <MainSearch
        title={title}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onCityChange={handleCityChange}
      />

      {loading && dataToSend.length === 0 ? (
        <Loader />
      ) : dataToSend.length === 0 ? (
        <EmptyState section={section} title={title} />
      ) : (
        <>
          <DynamicAside
            section={section}
            view={view}
            setView={setView}
            onFiltersChange={handleFiltersChange}
            vendorType={vendorType}
          />

          <InfiniteScroll
            dataLength={dataToSend.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="text-center my-4">
                <div className="scroll-down-loader mx-auto"></div>
                <p className="text-muted mt-2 small fw-medium">
                  Scroll Down to Load More {title}
                </p>
              </div>
            }
            endMessage={
              <div className="text-center my-5">
                <p className="text-muted fw-medium">
                  You've seen all available {title.toLowerCase()}!
                </p>
              </div>
            }
            scrollThreshold={0.7}
            style={{ overflow: "visible" }}
          >
            {view === "images" && (
              <GridView
                subVenuesData={dataToSend}
                section={section}
                handleShow={handleShow}
              />
            )}

            {view === "list" && (
              <ListView
                subVenuesData={dataToSend}
                section={section}
                handleShow={handleShow}
              />
            )}
            {view === "map" && (
              <MapView subVenuesData={dataToSend} section={section} />
            )}
          </InfiniteScroll>

          <div className="container">
            {(() => {
              // Extract real prices from vendor listings array synchronously
              const isVenue = section === "venues";
              const prices = dataToSend
                .map((v) => Number(v?.attributes?.price || v?.attributes?.starting_price || v?.attributes?.price_per_plate))
                .filter((p) => !isNaN(p) && p > 0);

              const calculatedLow = prices.length > 0 ? Math.min(...prices) : (isVenue ? 1200 : 18000);
              const calculatedHigh = prices.length > 0 ? Math.max(...prices) : (isVenue ? 3500 : 55000);
              const topVendor = dataToSend[0];
              const topName = topVendor?.attributes?.vendor_name || topVendor?.attributes?.name || "";
              const topRating = topVendor?.attributes?.rating || 4.9;

              return (
                <CityCategoryLocalContent
                  categoryLabel={getSectionLabel(section, slug)}
                  categorySlug={slug}
                  cityLabel={selectedCity}
                  citySlug={selectedCity}
                  vendorCount={dataToSend.length}
                  priceLow={calculatedLow}
                  priceHigh={calculatedHigh}
                  priceUnit={isVenue ? "plate / day" : "full event package"}
                  popularLocalities={
                    selectedCity && selectedCity.toLowerCase() === "mumbai"
                      ? ["Bandra", "Andheri West", "Colaba"]
                      : selectedCity && selectedCity.toLowerCase() === "pune"
                      ? ["Koregaon Park", "Baner", "Kothrud"]
                      : selectedCity && selectedCity.toLowerCase() === "goa"
                      ? ["Panjim", "Calangute", "Cavelossim"]
                      : ["City Center", "Central Hubs", "Suburbs"]
                  }
                  topRatedVendorName={topName}
                  topRatedVendorRating={topRating}
                />
              );
            })()}
          </div>

          <PricingModal
            show={show}
            handleClose={handleClose}
            vendorId={selectedId}
          />
        </>
      )}
    </div>
  );
};

export default SubSection;
