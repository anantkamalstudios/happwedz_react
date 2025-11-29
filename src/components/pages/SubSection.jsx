import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
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
const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vendorType = searchParams.get("vendorType");
  const stateCity = location.state?.city;
  const stateMinRating = location.state?.minRating;
  const cityFromQuery = stateCity || searchParams.get("city");
  const minRatingFromQuery =
    stateMinRating !== undefined && stateMinRating !== null
      ? String(stateMinRating)
      : searchParams.get("minRating");
  const title = slug ? toTitleCase(slug) : "";

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

  const dataToSend = useMemo(() => {
    if (section === "photography") {
      return [];
    }

    if (error || !apiData || apiData.length === 0) {
      return [];
    }

    return apiData;
  }, [section, apiData, error]);

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
            title={title}
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
