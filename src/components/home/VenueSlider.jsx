import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Link } from "react-router-dom";

const venues = [
  {
    id: 1,
    name: "The Regent",
    image:
      "https://img.freepik.com/free-photo/decorated-banquet-hall-with-served-round-table-with-hydrangea-centerpiece-chiavari-chairs_8353-10059.jpg?w=740&q=80",
    rating: 4.93,
    reviews: 111,
  },
  {
    id: 2,
    name: "The Regent",
    image:
      "https://img.freepik.com/free-photo/decorated-banquet-hall-with-served-round-table-with-hydrangea-centerpiece-chiavari-chairs_8353-10059.jpg?w=740&q=80",
    rating: 4.93,
    reviews: 111,
  },
  {
    id: 3,
    name: "The Regent",
    image:
      "https://img.freepik.com/free-photo/decorated-banquet-hall-with-served-round-table-with-hydrangea-centerpiece-chiavari-chairs_8353-10059.jpg?w=740&q=80",
    rating: 4.93,
    reviews: 111,
  },
  {
    id: 4,
    name: "Grand Palace",
    image:
      "https://img.freepik.com/free-photo/decorated-banquet-hall-with-served-round-table-with-hydrangea-centerpiece-chiavari-chairs_8353-10059.jpg?w=740&q=80",
    rating: 4.85,
    reviews: 98,
  },
];

const VenueSlider = () => {
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Top Rated");

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
        {venues.map((venue) => (
          <SwiperSlide key={venue.id}>
            <div className="venues-slider-card shadow-sm">
              <div className="venues-slider-image-container">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="venues-slider-image"
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
                    {venue.rating}
                  </span>
                  <span className="venues-slider-review-count">
                    ({venue.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VenueSlider;
