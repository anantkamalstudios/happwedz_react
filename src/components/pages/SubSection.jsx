import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import { subVendorsData } from "../../data/subVendorsData";
import { twoSoul } from "../../data/twoSoul";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";
import DynamicAside from "../layouts/aside/DynamicAside";
import { IMAGE_BASE_URL } from "../../config/constants";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const title = slug ? toTitleCase(slug) : "";
  const [show, setShow] = useState(false);
  const [view, setView] = useState("list");
  const [isLoading, setIsLoading] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Local vendors state (direct API fetch)
  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [vendorsError, setVendorsError] = useState(null);
  const [vendorsRefreshTick, setVendorsRefreshTick] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [venueApiData, setVenueApiData] = useState(null);
  const [venueApiLoading, setVenueApiLoading] = useState(false);
  const [venueApiError, setVenueApiError] = useState(null);

  useEffect(() => {
    if (section === "venues" && section === "vendors" && slug) {
      setVenueApiLoading(true);
      setVenueApiError(null);
      setVenueApiData(null);
      const subCategory = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      fetch(
        `https://happywedz.com/api/vendor-services?subCategory=${encodeURIComponent(
          subCategory
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("venueApiData Res: ", res);
          console.log("venueApiData Data: ", data);
          setVenueApiData(Array.isArray(data) ? data : []);
          console.log("venueApiData: ", venueApiData);
          setVenueApiLoading(false);
        })
        .catch((err) => {
          setVenueApiError("Failed to load data from API.", err);
          setVenueApiLoading(false);
        });
    } else {
      setVenueApiData(null);
      setVenueApiLoading(false);
      setVenueApiError(null);
    }
  }, [section, slug]);

  useEffect(() => {
    if (section !== "vendors") return;
    if (slug) {
      setVendorsLoading(true);
      setVendorsError(null);
      setVendors([]);
      const subCategory = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      fetch(
        `https://happywedz.com/api/vendor-services?subCategory=${encodeURIComponent(
          subCategory
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          const items = Array.isArray(data) ? data : [];
          const transformed = transformVendorsData(items);
          setVendors(transformed);
        })
        .catch(() => {
          setVendorsError("Failed to load data from API.");
        })
        .finally(() => {
          setVendorsLoading(false);
        });
    }
  }, [section, slug]);

  useEffect(() => {
    if (section === "vendors" && Array.isArray(vendors) && vendors.length > 0) {
      console.log("Transformed vendor sample:", {
        name: vendors[0].name,
        image: vendors[0].image,
        price: vendors[0].price,
        location: vendors[0].location,
        slug: vendors[0].slug,
        rating: vendors[0].rating,
        reviews: vendors[0].reviews,
        capacity: vendors[0].capacity,
        call: vendors[0].call,
      });
    }
  }, [section, vendors]);

  const transformVendorsData = (items) => {
    return items.map((item) => {
      const media = item.media || {};
      const location = item.location || {};
      const vendor = item.vendor || {};
      const attributes = item.attributes || {};
      const priceRange = item.price_range || {};

      return {
        id: item.id,
        name: item.name || vendor.businessName || "Unknown Vendor",
        subtitle: item.subtitle || attributes.subtitle || "",
        description: item.description || attributes.description || "",
        slug: item.slug,

        image: item.coverImage
          ? IMAGE_BASE_URL + item.coverImage
          : media.coverImage
          ? IMAGE_BASE_URL + media.coverImage
          : null,

        gallery: (item.gallery || media.gallery || [])
          .map((img) =>
            typeof img === "string"
              ? IMAGE_BASE_URL + img
              : img?.id
              ? IMAGE_BASE_URL + img.id
              : null
          )
          .filter(Boolean),

        videos: media.videos || [],

        price:
          priceRange.min && priceRange.max
            ? `${priceRange.min} - ${priceRange.max} ${item.currency || "INR"}`
            : item.starting_price
            ? `${item.starting_price} ${item.currency || "INR"}`
            : null,

        price_unit: item.price_unit || null,

        location: `${location.city || vendor.city || ""}${
          location.state ? ", " + location.state : ""
        }`,
        address: location.address || "",

        rating: attributes.rating || 0,
        reviews: attributes.reviews || 0,
        capacity:
          item.capacity_min || item.capacity_max
            ? `${item.capacity_min || 0} - ${item.capacity_max || 0}`
            : attributes.capacity_min || attributes.capacity_max
            ? `${attributes.capacity_min || 0} - ${
                attributes.capacity_max || 0
              }`
            : null,

        call: item.cta_phone || vendor.phone || null,
        whatsapp: vendor.whatsapp || item.contact?.whatsapp || null,
        website: vendor.website || item.contact?.website || null,
        email: vendor.email || item.email || null,

        alcohol_policy:
          item.alcohol_policy || attributes.alcohol_policy || null,
        catering_policy:
          item.catering_policy || attributes.catering_policy || null,
        deco_policy: item.deco_policy || attributes.deco_policy || null,
        dj_policy: item.dj_policy || attributes.dj_policy || null,
        refund_policy: item.refund_policy || null,
        cancellation_policy: item.cancellation_policy || null,

        car_parking: item.car_parking || attributes.car_parking || null,
        rooms: item.rooms || null,
        indoor_outdoor: item.indoor_outdoor || null,

        timing_open: item.timing_open || null,
        timing_close: item.timing_close || null,
        timing_last_entry: item.timing_last_entry || null,

        is_featured: item.is_featured || false,
        is_feature_available: item.is_feature_available || false,
        within_24hr_available: item.within_24hr_available || false,
      };
    });
  };

  const filteredVenuesData = useMemo(() => {
    if (section === "venues" && slug && venueApiData) {
      return venueApiData;
    }
    if (section === "venues" && slug) {
      const searchTerm = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const venueTypes = [
        "Banquet Halls",
        "Marriage Garden / Lawns",
        "Wedding Resorts",
        "Small Function / Party Halls",
        "Destination Wedding Venues",
        "Kalyana Mandapams",
        "4 Star & Above Wedding Hotels",
        "Venue Concierge Services",
      ];

      const isVenueType = venueTypes.some(
        (type) =>
          type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm.toLowerCase().includes(type.toLowerCase())
      );

      if (isVenueType) {
        return subVenuesData.filter(
          (venue) =>
            venue.venueType &&
            venue.venueType.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        return subVenuesData.filter((venue) =>
          venue.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    return subVenuesData;
  }, [section, slug, venueApiData]);

  let dataToSend = filteredVenuesData;
  if (section === "vendors") {
    dataToSend = vendorsError ? subVendorsData : vendors;
  } else if (section === "twosoul") {
    dataToSend = twoSoul;
  }

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, section]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRefresh = () => {
    if (section === "vendors") {
      setVendorsRefreshTick((x) => x + 1);
    }
  };

  if (section === "vendors" && vendorsError) {
    dataToSend = subVendorsData;
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Vendors</h4>
          <p>{vendorsError}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show loading state for vendors
  if (section === "vendors" && vendorsLoading && vendors.length === 0) {
    return (
      <div className="container-fluid">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {section === "venues" && <MainSearch title={title} />}
      {section === "venues" && venueApiLoading && (
        <div className="my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="text-muted mt-2">Loading {title}...</div>
        </div>
      )}
      {section === "venues" && venueApiError && (
        <div className="alert alert-warning my-4 text-center">
          {venueApiError} Showing local data instead.
        </div>
      )}
      {section === "vendors" && (
        <MainSearch
          title={title}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
        />
      )}
      {(section === "photography" || section === "twosoul") && (
        <MainSearch title={title} />
      )}

      {section === "photography" ? (
        <Photos title={title} />
      ) : (
        <>
          {isLoading ? (
            <div className="container my-5">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <div className="bg-light rounded-4 p-5">
                    <div className="mb-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <h4 className="text-muted mb-3">Loading...</h4>
                    <p className="text-muted mb-4">
                      Please wait while we fetch the data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : dataToSend.length === 0 ? (
            <div className="container my-5">
              <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                  <div className="bg-light rounded-4 p-5">
                    <div className="mb-4">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto text-muted"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <h4 className="text-muted mb-3">
                      {section === "venues"
                        ? `No ${title} Available`
                        : section === "vendors"
                        ? `No ${title} Available`
                        : `No ${title} Available`}
                    </h4>
                    <p className="text-muted mb-4">
                      {section === "venues"
                        ? `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try searching for a different venue type or location.`
                        : section === "vendors"
                        ? `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try searching for a different vendor category or location.`
                        : `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try a different search.`}
                    </p>

                    {/* Suggestions section */}
                    {section === "venues" && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-3">
                          💡 Try these popular venue types instead:
                        </h6>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          {[
                            "Banquet Halls",
                            "Wedding Resorts",
                            "Marriage Garden / Lawns",
                            "Destination Wedding Venues",
                          ].map((type) => (
                            <Link
                              key={type}
                              to={`/venues/${type
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9\-]/g, "")}`}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              {type}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {section === "vendors" && (
                      <div className="mb-4">
                        <h6 className="text-muted mb-3">
                          💡 Try these popular vendor categories instead:
                        </h6>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          {[
                            "Wedding Photographers",
                            "Wedding Videography",
                            "Caterers",
                            "Wedding Planners",
                          ].map((category) => (
                            <Link
                              key={category}
                              to={`/vendors/${category
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/[^a-z0-9\-]/g, "")}`}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="d-flex flex-wrap justify-content-center gap-3">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => window.history.back()}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                      </button>
                      <Link to="/" className="btn btn-primary">
                        <i className="bi bi-house me-2"></i>
                        Browse All
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DynamicAside section={section} view={view} setView={setView} />

              {/* <ViewSwitcher view={view} setView={setView} /> */}

              {view === "list" && (
                <ListView
                  subVenuesData={dataToSend}
                  section={section}
                  handleShow={handleShow}
                />
              )}

              {view === "images" && (
                <GridView
                  subVenuesData={dataToSend}
                  section={section}
                  handleShow={handleShow}
                />
              )}

              {view === "map" && (
                <MapView subVenuesData={dataToSend} section={section} />
              )}

              <PricingModal show={show} handleClose={handleClose} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SubSection;
