import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";
import useApiData from "../../hooks/useApiData";

const IMAGE_BASE_URL = "https://happywedzbackend.happywedz.com";

const VenueSlider = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Top Rated");

  // Fetch 9 venues from API
  const { data: venues, loading, error } = useApiData(
    "venues",
    null,
    null,
    "Venues",
    1,
    9
  );

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

  // Show loading state
  if (loading) {
    return (
      <div className="venues-slider-container">
        <div className="venues-slider-header">
          <h2 className="venues-slider-title">Pick your Venue</h2>
          <Link to="/venues" className="venues-slider-see-more">
            SEE MORE
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

  // Show error state
  if (error) {
    return (
      <div className="venues-slider-container">
        <div className="venues-slider-header">
          <h2 className="venues-slider-title">Pick your Venue</h2>
        </div>
        <div className="text-center py-5 text-danger">
          <p>Failed to load venues. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Don't render if no venues
  if (!venues || venues.length === 0) {
    return null;
  }

  return (
    <div className="venues-slider-container">
      {/* Header */}
      <div className="venues-slider-header">
        <h2 className="venues-slider-title">Pick your Venue</h2>
        <Link to="/venues" className="venues-slider-see-more">
          SEE MORE
        </Link>
      </div>

      {/* Filters */}
      <div className="venues-slider-filters px-2 fs-12">
        {filterOptions.map((filter, index) => (
          <Link
            key={index}
            onClick={() => setActiveFilter(filter.name)}
            className={`venues-slider-filter-btn ${activeFilter === filter.name ? "active" : ""
              }`}
            to={`/${filter.slug}`}
            style={{ textDecoration: "none" }}
          >
            {filter.name}
          </Link>
        ))}
      </div>

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
        {venues.map((venue) => {
          const imageUrl = venue.image
            ? venue.image.startsWith("http")
              ? venue.image
              : `${IMAGE_BASE_URL}${venue.image}`
            : "/images/imageNotFound.jpg";


          return (
            <SwiperSlide key={venue.id}>
              <div className="venues-slider-card shadow-sm">
                <Link
                  to={`/details/info/${venue.id}`}
                  className="text-decoration-none"
                >
                  <div className="venues-slider-image-container">
                    <img
                      src={imageUrl}
                      alt={venue.name}
                      className="venues-slider-image"
                      onError={(e) => {
                        
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    <button
                      onClick={() => toggleFavorite(venue.id)}
                      className="venues-slider-favorite-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={favorites.includes(venue.id) ? "#e91e63" : "none"}
                        stroke={favorites.includes(venue.id) ? "#e91e63" : "white"}
                        strokeWidth="2"
                        className="venues-slider-heart-icon"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>

                  <div className="venues-slider-content">
                    <h5 className="venues-slider-name">{venue.name}</h5>
                    <div className="venues-slider-rating">
                      <svg
                        className="venues-slider-star"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="venues-slider-rating-number">
                        {venue.rating || 0}
                      </span>
                      <span className="venues-slider-review-count">
                        ({venue.reviews || venue.review_count || 0} reviews)
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default VenueSlider;
