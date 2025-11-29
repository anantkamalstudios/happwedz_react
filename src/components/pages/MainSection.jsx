import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import NotFound from "./NotFound";
import MainByRegion from "../layouts/Main/MainByRegion";
import FindMain from "../layouts/Main/FindMain";
import MainHeroSection from "../layouts/Main/MainHeroSection";
import FactorsList from "../layouts/Main/FactorsList";
import FaqsSection from "../layouts/Main/FaqsSection";
import TopSlider from "../layouts/photography/TopSlider";
import SortSection from "../layouts/photography/SortSection";
import MainEInvites from "../layouts/eInvite/MainEInvites";
import GridImages from "../layouts/photography/GridImages";
import GroomeSlider from "../layouts/twoSoul/GroomeSlider";
import BrideSlider from "../layouts/twoSoul/BrideSlider";
import MainPhotages from "../layouts/twoSoul/MainPhotages";
import PricingModal from "../layouts/PricingModal";
import WeddingCardDesigns from "../layouts/eInvite/WeddingCardDesigns";
import MainSearch from "../layouts/Main/MainSearch";
import RealWedding from "./RealWedding";
import Genie from "./Genie";
import AllCategories from "../layouts/AllCategories";
import WeddingCategories from "../home/WeddingCategories";
import VenueInfoSection from "../layouts/Main/VenueInfoSection";
import GridView from "../layouts/Main/GridView";
import LoadingState from "../LoadingState";
import EmptyState from "../EmptyState";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { MyContext } from "../../context/useContext";
import axios from "axios";
import ViewSwitcher from "../layouts/Main/ViewSwitcher";
import ListView from "../layouts/Main/ListView";
import UserPrivateRoute from "../routes/UserPrivateRoute";
import DynamicAside from "../layouts/aside/DynamicAside";
import { useMemo } from "react";
import MapView from "../layouts/Main/MapView";

const MainSection = () => {
  const { section } = useParams();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const storageKey = useMemo(() => `viewMode:${section}:main`, [section]);

  const [view, setView] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    return saved || "images";
  });

  const [photos, setPhotos] = useState([]);
  const [heroInfo, setHeroInfo] = useState([]);
  const [venueFilters, setVenueFilters] = useState({});

  const { data, loading, error, hasMore, loadMore } = useInfiniteScroll(
    "venues",
    null,
    selectedCity,
    "Venues",
    9,
    venueFilters
  );
  const [searchQuery, setSearchQuery] = useState("");
  const {
    selectedCategory,
    setSelectedCategory,
    selectedCategoryName,
    setSelectedCategoryName,
    displayPhotos,
    loading: photosLoading,
    sortBy,
    setSortBy,
  } = useContext(MyContext);

  useEffect(() => {
    setSelectedCity(reduxLocation);
  }, [reduxLocation]);

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
    } catch (e) { }
  }, [view, storageKey]);

  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedId(null);
  };

  if (section === "venues") {
    return (
      <>
        <MainSearch />
        {!reduxLocation && <MainByRegion type="Venues" />}
        {loading && data.length === 0 && <LoadingState title="Venues" />}
        {!loading && data.length === 0 && (
          <EmptyState section="venues" title="Venues" />
        )}

        <DynamicAside
          section="venues"
          view={view}
          setView={setView}
          onFiltersChange={setVenueFilters}
        />

        {view === "map" && (
          <MapView
            subVenuesData={data}
            section="venues"
            onClose={() => setView("images")}
          />
        )}

        {data.length > 0 && (
          <div className="container-fluid">
            <InfiniteScroll
              dataLength={data.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="text-center my-4">
                  <div className="scroll-down-loader mx-auto"></div>
                  <p className="text-muted mt-2 small fw-medium">
                    Scroll Down to Load More Venues
                  </p>
                </div>
              }
              endMessage={
                <div className="text-center my-5">
                  <p className="text-muted fw-medium">
                    You've seen all available venues!
                  </p>
                </div>
              }
              scrollThreshold={0.7}
              style={{ overflow: "visible" }}
            >
              {view === "images" && (
                <GridView
                  subVenuesData={data}
                  section="venues"
                  handleShow={handleShow}
                />
              )}
              {view === "list" && (
                <ListView
                  subVenuesData={data}
                  section="venues"
                  handleShow={handleShow}
                />
              )}
            </InfiniteScroll>
            <PricingModal
              show={show}
              handleClose={handleClose}
              vendorId={selectedId}
            />
          </div>
        )}
        <VenueInfoSection />
      </>
    );
  }

  if (section === "vendors") {
    return (
      <>
        <MainSearch title="Wedding Vendor" />
        {!reduxLocation && <MainByRegion type="vendors" />}
        <AllCategories />
        {/* <FindMain /> */}
        <FaqsSection />
      </>
    );
  }

  if (section === "photography") {
    return (
      <div className="container">
        <h3 className="mt-5 fw-bold primary-text h2">
          Every Smile, Every Tear, Every Moment — Perfectly Captured
        </h3>
        <h6>
          Find the latest trends and heartfelt inspiration to shape your perfect wedding story
        </h6>
        <TopSlider
          onCategorySelect={(id, name) => {
            setSelectedCategory(id);
            setSelectedCategoryName(name);
          }}
        />

        <SortSection
          category={selectedCategoryName}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {photosLoading ? (
          <p className="text-center my-5">Loading photos...</p>
        ) : (
          <GridImages
            photos={displayPhotos}
            category={selectedCategory}
            searchQuery={searchQuery}
          />
        )}
      </div>
    );
  }

  if (section === "real-wedding") {
    return (
      <>
        <RealWedding />
      </>
    );
  }

  if (section === "e-invites") {
    return (
      <>
        <MainSearch title="E Invites" />
        <WeddingCardDesigns />
        <FaqsSection />
      </>
    );
  }
  if (section === "e-invite-wedding-card-designs") {
    return (
      <>
        <WeddingCardDesigns />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "twosoul") {
    return (
      <>
        <MainSearch title="Two Soul" />
        {!reduxLocation && <MainByRegion />}
        <GroomeSlider />
        <MainPhotages />
        <BrideSlider />
      </>
    );
  }

  if (section === "latest-real-weddings") {
    return (
      <>
        <MainSearch title="latest Real Weddings" />
        {!reduxLocation && <MainByRegion />}
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  // if (section === "matrimonial") {
  //   return (
  //     <>
  //       <VenuesSearch title="Matrimonial" />
  //       <MainByRegion />
  //       <FindMain />
  //       <MainHeroSection loc={"Panjab"} />
  //       <MainHeroSection loc={"Karela "} />
  //       <MainHeroSection loc={"Goa"} />
  //       <FactorsList />
  //       <FaqsSection />
  //     </>
  //   );
  // }

  if (section === "shaadi-ai") {
    return (
      <>
        <UserPrivateRoute>
          <Genie />
        </UserPrivateRoute>
      </>
    );
  }

  return <NotFound />;
};

export default MainSection;
