import React, { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";
import "../../styles/routes/main-section.css";
import "../../styles/shared.css";

// Metadata config per top-level section
const SECTION_META = {
  venues: {
    title: "Best Wedding Venues in India — Banquet Halls, Lawns & Resorts | HappyWedz",
    description:
      "Find the best wedding venue across India. Browse banquet halls, lawns, resorts, and hotels — filter by city, capacity, budget, and catering policy on HappyWedz.",
    keywords: "best wedding venues india, banquet halls, wedding lawns, wedding resorts, wedding hotels",
    ogUrl: "https://happywedz.com/venues",
    canonicalUrl: "https://happywedz.com/venues",
  },
  vendors: {
    title: "Best Wedding Vendors in India — Photographers, Decorators & More | HappyWedz",
    description:
      "Discover the best verified wedding vendors across India. Compare photographers, makeup artists, decorators, caterers, and more — with real reviews and prices on HappyWedz.",
    keywords: "best wedding vendors india, wedding photographers, bridal makeup, wedding decorators, caterers",
    ogUrl: "https://happywedz.com/vendors",
    canonicalUrl: "https://happywedz.com/vendors",
  },
  photography: {
    title: "Wedding Photography Inspiration — Real Wedding Photos | HappyWedz",
    description:
      "Explore thousands of stunning wedding photos for inspiration. Bridal looks, décor, pre-wedding shoots, and more — curated from real Indian weddings on HappyWedz.",
    keywords: "wedding photography inspiration, bridal photos, wedding décor ideas, pre-wedding shoot",
    ogUrl: "https://happywedz.com/photography",
    canonicalUrl: "https://happywedz.com/photography",
  },
  "real-wedding": {
    title: "Real Weddings — True Love Stories & Wedding Inspiration | HappyWedz",
    description:
      "Read real wedding stories from couples across India. Get inspired by genuine celebrations, stunning décor, and heartfelt moments only on HappyWedz.",
    keywords: "real weddings india, wedding stories, wedding inspiration, true weddings",
    ogUrl: "https://happywedz.com/real-wedding",
    canonicalUrl: "https://happywedz.com/real-wedding",
  },
  "e-invites": {
    title: "Digital Wedding E-Invites & Card Designs | HappyWedz",
    description:
      "Browse beautiful wedding e-invite card designs. Create your personalized digital invitation in minutes and share via WhatsApp, Email, or QR code.",
    keywords: "wedding e-invites, digital wedding cards, online invitation cards",
    ogUrl: "https://happywedz.com/e-invites",
    canonicalUrl: "https://happywedz.com/e-invites",
  },
  "shaadi-ai": {
    title: "Shaadi AI — Your AI Wedding Planner | HappyWedz",
    description:
      "Let Shaadi AI help you plan your perfect wedding. Get instant vendor recommendations, budget guidance, and personalized suggestions powered by AI.",
    keywords: "AI wedding planner, shaadi ai, wedding planning tool india",
    ogUrl: "https://happywedz.com/shaadi-ai",
    canonicalUrl: "https://happywedz.com/shaadi-ai",
  },
};

const MainSection = () => {
  const { section } = useParams();
  const location = useLocation();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);

  const navigate = useNavigate();

  // Read ?city= from URL first (live site uses /venues/?city=noida),
  // fall back to the Redux-persisted city selection.
  const cityFromQuery = new URLSearchParams(location.search).get("city");
  const initialCity = cityFromQuery || reduxLocation;

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Redirect legacy query-param URLs to clean path-based URLs:
  // /venues/?city=mumbai  →  /venues/mumbai/
  // /vendors/?city=delhi  →  /vendors/delhi/
  useEffect(() => {
    const qCity = new URLSearchParams(location.search).get("city");
    if (qCity && section) {
      const citySlug = qCity.toLowerCase().replace(/\s+/g, "-");
      navigate(`/${section}/${citySlug}/`, { replace: true });
    }
  }, [location.search, section, navigate]);

  // Apply per-section metadata
  const sectionMeta = SECTION_META[section] || {
    title: "HappyWedz - Find Top Wedding Vendors, Venues & Planning Tools",
    description:
      "Discover top-rated wedding vendors, venues, and planning tools for your perfect wedding on HappyWedz.",
  };
  useDocumentMetadata(sectionMeta);

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

  // Keep selectedCity in sync: URL query param takes priority over Redux store
  useEffect(() => {
    const qCity = new URLSearchParams(location.search).get("city");
    setSelectedCity(qCity || reduxLocation);
  }, [location.search, reduxLocation]);

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
        {!selectedCity && <MainByRegion type="Venues" />}

        <DynamicAside
          section="venues"
          view={view}
          setView={setView}
          onFiltersChange={setVenueFilters}
        />

        {loading && data.length === 0 && <LoadingState title="Venues" />}

        {!loading && data.length === 0 && (
          <EmptyState section="venues" title="Venues" />
        )}

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
          Find the latest trends and heartfelt inspiration to shape your perfect
          wedding story
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
