import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import useApiData from "../../hooks/useApiData";
import { CiStar } from "react-icons/ci";
import { useSelector } from "react-redux";
import axios from "axios";

const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";

const VenueSlider = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Top Rated");
  const { user } = useSelector((state) => state.auth);

  // Fetch 9 venues from API
  const {
    data: venues,
    loading,
    error,
  } = useApiData("venues", null, null, "Venues", 1, 9);

  const filterOptions = [
    { name: "Top Rated", slug: "top-rated" },
    // { name: "Resorts", slug: "top-rated" },
    { name: "Banquet Halls", slug: "venues/banquet-halls" },
    // { name: "Farmhouses", slug: "top-rated" },
    { name: "Recommendation", slug: "ai-recommandation" },
  ];

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const displayData = venues;
  const isLoading = loading;

  // Show loading state
  if (isLoading) {
    return (
      <div className="venues-slider-container">
        <div className="venues-slider-header">
          <h3>Pick your Venue</h3>
          <Link to="/venues" className="see-more-link fs-18">
            SEE MORE
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state (only for standard fetch, or handle rec error differently?)
  if (error && activeFilter !== "Recommendation") {
    return (
      <div className="venues-slider-container">
        <div className="venues-slider-header">
          <h3>Pick your Venue</h3>
        </div>
        <div className="text-center py-5 text-danger">
          <p>Failed to load venues. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Don't render if no venues
  if ((!displayData || displayData.length === 0) && !isLoading) {
    if (activeFilter === "Recommendation" && !user) {
      // Optional: Show login prompt or empty state if user not logged in
      // For now, returning null or empty container
    }
    // return null;
  }

  return (
    <div className="venues-slider-container">
      {/* Header */}
      <div className="venues-slider-header d-flex justify-content-between align-items-end">
        <h3>Pick your Venue</h3>
        <Link to="/venues" className="see-more-link fs-14">
          SEE MORE
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Filters */}
      <div className="venues-slider-filters px-2 fs-12">
        {filterOptions.map((filter, index) => (
          <Link
            key={index}
            onClick={() => setActiveFilter(filter.name)}
            className={`venues-slider-filter-btn ${
              activeFilter === filter.name ? "active" : ""
            }`}
            to={`/${filter.slug}`}
            style={{ textDecoration: "none" }}
          >
            {filter.name}
          </Link>
        ))}
      </div>

      {!displayData || displayData.length === 0 ? (
        <div className="text-center py-5">
          <p>No items found.</p>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {displayData.map((item) => {
            const id = item.id;
            const name = item.name;
            const rating = item.rating || 0;
            const reviews = item.reviews || item.review_count || 0;
            const city = item.location;

            const rawImage = item.image || "";
            const imageUrl = rawImage
              ? rawImage.startsWith("http")
                ? rawImage
                : `${IMAGE_BASE_URL}${rawImage}`
              : "/images/imageNotFound.jpg";

            return (
              <SwiperSlide key={id}>
                <div className="venues-slider-card shadow-sm">
                  <Link
                    to={`/details/info/${id}`}
                    className="text-decoration-none"
                  >
                    <div className="venues-slider-image-container">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="venues-slider-image"
                        onError={(e) => {
                          e.target.src = "/images/imageNotFound.jpg";
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(id);
                        }}
                        className="venues-slider-favorite-btn"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={favorites.includes(id) ? "#e91e63" : "none"}
                          stroke={favorites.includes(id) ? "#e91e63" : "white"}
                          strokeWidth="2"
                          className="venues-slider-heart-icon"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                      </button>
                    </div>

                    <div className="venues-slider-content">
                      <h5 className="fs-16 text-black">{name}</h5>
                      <div className="venues-slider-rating d-flex align-items-center gap-1">
                        <CiStar color="orange" />
                        <span className="venues-slider-rating-number">
                          {rating}
                        </span>
                        <span className="venues-slider-review-count text-muted">
                          ({reviews} reviews)
                        </span>
                      </div>
                      {city && <div className="text-muted fs-14">{city}</div>}
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default VenueSlider;
