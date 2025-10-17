import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";
import DynamicAside from "../layouts/aside/DynamicAside";
import useApiData from "../../hooks/useApiData";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { ChevronLeft, ChevronRight } from "lucide-react";
const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vendorType = searchParams.get("vendorType");
  const cityFromQuery = searchParams.get("city");
  const title = slug ? toTitleCase(slug) : "";

  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [view, setView] = useState("images");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(
    cityFromQuery || reduxLocation
  );

  const {
    data: apiData,
    loading,
    error,
    refetch,
    pagination,
    nextPage,
    prevPage,
    goToPage,
  } = useApiData(section, slug, selectedCity, vendorType);

  // Modal handlers
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

  // Sync selectedCity with URL query first, then Redux location state
  useEffect(() => {
    if (cityFromQuery && cityFromQuery !== "all") {
      setSelectedCity(cityFromQuery);
      return;
    }
    setSelectedCity(reduxLocation);
  }, [cityFromQuery, reduxLocation]);

  const dataToSend = useMemo(() => {
    if (section === "photography") {
      return [];
    }

    // Return empty array if no data, don't use fallback dummy data
    if (error || !apiData || apiData.length === 0) {
      return [];
    }

    return apiData;
  }, [section, apiData, error]);

  useEffect(() => { }, [
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
    return (
      <div className="container-fluid">
        <MainSearch
          title={title}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCityChange={handleCityChange}
        />
        <Photos title={title} />
      </div>
    );
  }

  // Show error state only if no fallback data available
  if (error && (!dataToSend || dataToSend.length === 0)) {
  }

  // Show loading state only when loading and no data
  if (loading && dataToSend.length === 0) {
    return <LoadingState title={title} />;
  }

  return (
    <div className="container-fluid">
      <MainSearch
        title={title}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onCityChange={handleCityChange}
      />

      {loading && dataToSend.length > 0 && (
        <div className="alert alert-info my-4 text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Updating data...
        </div>
      )}

      {/* Main content */}
      {dataToSend.length === 0 ? (
        <EmptyState section={section} title={title} />
      ) : (
        <>
          <DynamicAside section={section} view={view} setView={setView} />

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

          {/* Pagination */}




          {pagination?.totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center my-4 gap-3">
              {/* Previous Button */}
              <button
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor:
                    pagination.page <= 1 ? "#f8d7da" : "#e91e63",
                  color: pagination.page <= 1 ? "#ccc" : "#fff",
                  border: "none",
                  transition: "0.3s ease",
                  cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                }}
                disabled={pagination.page <= 1 || loading}
                onClick={() => prevPage()}
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>

              {/* Page Numbers */}
              <div className="d-flex align-items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
                  .filter((page) => {
                    const total = pagination.totalPages;
                    const current = pagination.page;
                    return (
                      page === 1 ||
                      page === total ||
                      (page >= current - 2 && page <= current + 2)
                    );
                  })
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && page - arr[idx - 1] > 1 && (
                        <span className="text-secondary">...</span>
                      )}
                      <button
                        className="btn fw-medium"
                        style={{
                          borderRadius: "8px",
                          fontSize: "14px",
                          padding: "5px 10px",
                          backgroundColor:
                            pagination.page === page ? "#f8f8f8" : "transparent",
                          color: "#e91e63",
                          border:
                            pagination.page === page
                              ? "1px solid #e91e63"
                              : "1px solid transparent",
                          transition: "0.2s ease",
                        }}
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              {/* Next Button */}
              <button
                className="d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor:
                    pagination.page >= pagination.totalPages ? "#f8d7da" : "#e91e63",
                  color:
                    pagination.page >= pagination.totalPages ? "#ccc" : "#fff",
                  border: "none",
                  transition: "0.3s ease",
                  cursor:
                    pagination.page >= pagination.totalPages ? "not-allowed" : "pointer",
                }}
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => nextPage()}
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          )}


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
