import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
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
import useApiData from "../../hooks/useApiData";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const location = useLocation();
  // Parse query string
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

  const getFallbackData = (section) => {
    switch (section) {
      case "vendors":
        return subVendorsData;
      case "venues":
        return subVenuesData;
      case "twosoul":
        return twoSoul;
      default:
        return [];
    }
  };

  const dataToSend = useMemo(() => {
    if (section === "photography") {
      return [];
    }

    if (error || !apiData || apiData.length === 0) {
      return getFallbackData(section);
    }

    return apiData;
  }, [section, apiData, error]);

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

  console.log("dts", dataToSend);
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
