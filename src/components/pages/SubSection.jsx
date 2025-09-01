import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import { twoSoul } from "../../data/twoSoul";
import ViewSwitcher from "../layouts/Main/ViewSwitcher";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";
import { useVendors } from "../../hooks/useVendors";

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

  // Use dynamic vendors hook when section is vendors
  const {
    vendors,
    loading: vendorsLoading,
    error: vendorsError,
    refreshVendors,
  } = useVendors({
    search: searchQuery,
    categoryId: selectedCategory,
    limit: 20,
    autoFetch: section === "vendors",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const filteredVenuesData = useMemo(() => {
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
  }, [section, slug]);

  let dataToSend = filteredVenuesData;
  if (section === "vendors") {
    dataToSend = vendors; // Use dynamic vendors data
  } else if (section === "twosoul") {
    dataToSend = twoSoul;
  }

  const debugInfo = {
    section,
    slug,
    searchTerm: slug
      ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      : "",
    totalVenues: subVenuesData.length,
    filteredCount: dataToSend.length,
    isVenueType:
      section === "venues" && slug
        ? (() => {
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
            return venueTypes.some(
              (type) =>
                type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                searchTerm.toLowerCase().includes(type.toLowerCase())
            );
          })()
        : false,
  };

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [slug, section]);

  // Handle search and category changes for vendors
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleRefresh = () => {
    if (section === "vendors") {
      refreshVendors();
    }
  };

  // Show error state for vendors
  if (section === "vendors" && vendorsError) {
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
              <ViewSwitcher view={view} setView={setView} />

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
