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
import usePhotography from "../../hooks/usePhotography";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";

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

  // Photography hook
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

  // Fetch photography data when in photography section
  useEffect(() => {
    if (section === "photography") {
      fetchTypesWithCategories();
      if (slug) {
        // Find the category ID from typesWithCategories based on slug
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
            title={title}
            images={photographyData}
            loading={photographyLoading}
          />
        )}
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
