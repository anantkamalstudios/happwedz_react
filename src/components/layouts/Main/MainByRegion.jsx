import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import regions from "../../../data/regions";

const MainByRegion = ({ type }) => {
  const navigate = useNavigate();

  const handleRegionClick = (regionName) => {
    const slug = regionName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/venues/${slug}`);
  };

  return (
    <div className="container">
      <div className="venue-region-section px-4 my-5">
        <h3 className="fw-bold mb-0 text-dark mb-5">
          {type === "venues" ? "Venues" : "Vendors"} by region
        </h3>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          slidesPerView={6.2}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2.5, spaceBetween: 6 },
            576: { slidesPerView: 3.5, spaceBetween: 6 },
            768: { slidesPerView: 4.5, spaceBetween: 6 },
            992: { slidesPerView: 5.5, spaceBetween: 8 },
            1200: { slidesPerView: 6.2, spaceBetween: 8 },
          }}
        >
          {regions.map((region) => (
            <SwiperSlide key={region.id}>
              <div
                className="text-center region-slide-card cursor-pointer"
                onClick={() => handleRegionClick(region.name)}
                style={{ cursor: "pointer" }}
              >
                <div className="region-slide-card">
                  <div className="region-img-wrapper mb-2">
                    <img
                      src={region.image}
                      alt={region.name}
                      className="region-img"
                    />
                  </div>
                </div>
                <div className="region-title fw-medium">{region.name}</div>
                <div className="text-muted small">
                  {region.venueCount} venues
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default MainByRegion;
