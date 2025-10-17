import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
import useApiData from "../../hooks/useApiData";
import DynamicAside from "../layouts/aside/DynamicAside";
import usePhotography from "../../hooks/usePhotography";

const MainSection = () => {
  const { section } = useParams();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("images");
  const [photos, setPhotos] = useState([]);

  const { data, loading, error, pagination, nextPage, prevPage, goToPage } = useApiData(
    "venues",
    null,
    selectedCity,
    "Venues"
  );
  const { fetchAllPhotos, fetchPhotosByType, allPhotos, photosByType } =
    usePhotography();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryName, setSelectedCategoryName] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayPhotos, setDisplayPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      if (selectedCategory === "all") {
        await fetchAllPhotos();
      } else {
        await fetchPhotosByType(selectedCategory);
      }
    };
    loadPhotos();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setDisplayPhotos(allPhotos || []);
    } else {
      setDisplayPhotos(photosByType || []);
    }
  }, [allPhotos, photosByType, selectedCategory]);

  useEffect(() => {
    setSelectedCity(reduxLocation);
  }, [reduxLocation]);

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
        <MainByRegion type="venues" />
        {loading && data.length === 0 && <LoadingState title="Venues" />}
        {!loading && data.length === 0 && (
          <EmptyState section="venues" title="Venues" />
        )}
        {data.length > 0 && (
          <div className="container-fluid">
            {loading && (
              <div className="alert alert-info my-4 text-center">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                Updating data...
              </div>
            )}
            <GridView
              subVenuesData={data}
              section="venues"
              handleShow={handleShow}
            />

            {pagination?.totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center my-4 gap-3">
                <button
                  className="d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: pagination.page <= 1 ? "#f8d7da" : "#e91e63",
                    color: pagination.page <= 1 ? "#ccc" : "#fff",
                    border: "none",
                    transition: "0.3s ease",
                    cursor: pagination.page <= 1 ? "not-allowed" : "pointer",
                  }}
                  disabled={pagination.page <= 1 || loading}
                  onClick={() => prevPage()}
                >
                  <span className="fw-bold">‹</span>
                </button>

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
                  <span className="fw-bold">›</span>
                </button>
              </div>
            )}
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
        <MainByRegion type="vendors" />
        <AllCategories />
        {/* <FindMain /> */}
        <FaqsSection />
      </>
    );
  }

  if (section === "photography") {
    return (
      <>
        <MainSearch title="Photography" />
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
        />

        {loading ? (
          <p className="text-center my-5">Loading photos...</p>
        ) : (
          <GridImages
            photos={displayPhotos}
            category={selectedCategory}
            searchQuery={searchQuery}
          />
        )}
      </>
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
        <MainByRegion />
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
        <MainByRegion />
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

  if (section === "genie") {
    return (
      <>
        <Genie />
      </>
    );
  }

  return <NotFound />;
};

export default MainSection;
