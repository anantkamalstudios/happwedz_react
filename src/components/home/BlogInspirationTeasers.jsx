import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import blogs from "../../data/blogs";

const blogsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div
      className="wedding-blog-section py-3 px-3"
      style={{
        background: "linear-gradient(135deg, #fdf5f8 0%, #f8f4fa 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23e9b0ce' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          opacity: 0.3,
          zIndex: 0,
        }}
      ></div>

      <div className="position-absolute top-0 end-0" style={{ zIndex: 0 }}>
        <svg
          width="250"
          height="250"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#e9b0ce"
            opacity="0.1"
            d="M44.3,-48.8C55.4,-40.7,61.2,-22.7,61.4,-4.5C61.5,13.7,56,32.1,45.9,41.1C35.8,50.1,21.1,49.7,3.4,53.9C-14.3,58.1,-28.6,67,-39.1,62.3C-49.5,57.5,-56.1,39.2,-61.3,19.8C-66.4,0.4,-70.1,-20.1,-63.8,-36.1C-57.4,-52.1,-41.1,-63.6,-23.8,-69.2C-6.6,-74.8,11.7,-74.6,27.5,-68.1C43.4,-61.7,56.8,-49.1,61.8,-34.3C66.8,-19.4,63.4,-2.4,59.6,12.1C55.8,26.6,51.6,38.8,43.3,47.2C35,55.6,22.6,60.3,8.2,65.6C-6.2,70.9,-20.6,76.9,-31.3,73.1C-42.1,69.3,-49.3,55.7,-55.4,41.6C-61.5,27.4,-66.6,12.7,-67.2,-2.3C-67.8,-17.4,-63.9,-34.8,-55.1,-45.5C-46.2,-56.2,-32.4,-60.1,-17.2,-65.8C-1.9,-71.4,14.7,-78.7,26.5,-75.5C38.3,-72.4,45.3,-58.7,51.5,-44.6C57.7,-30.5,63.1,-15.9,64.1,-0.8C65.1,14.2,61.7,28.9,54.1,39.8C46.5,50.6,34.7,57.6,21.7,63.7C8.7,69.9,-5.5,75.2,-19.1,74.4C-32.7,73.5,-45.7,66.5,-53.3,55.1C-60.9,43.7,-63.1,27.8,-64.9,11.6C-66.6,-4.6,-67.9,-21.1,-62.6,-34.5C-57.4,-47.9,-45.6,-58.1,-32.6,-65.1C-19.7,-72.1,-5.5,-75.9,8.3,-73.9C22.1,-71.8,36.1,-63.9,44.3,-48.8Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="text-center mb-6">
          <h2
            className="display-5 fw-light mb-3"
            style={{
              color: "#8a5a76",
              fontWeight: 400,
            }}
          >
            Inspiration Teasers
          </h2>
          <div
            className="divider mx-auto mb-4"
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(to right, #e9b0ce, #d8a1bd)",
            }}
          ></div>
          <p
            className="text-muted lead"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Discover the latest trends, tips, and real wedding stories
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="position-relative"
        >
          {blogs.map((blogs, i) => (
            <SwiperSlide key={i}>
              <div
                className="blog-blogs h-100 rounded-4 overflow-hidden position-relative shadow-lg"
                style={{
                  background: "#fff",
                  margin: "15px",
                  transition: "all 0.4s ease",
                  transform: activeIndex === i ? "scale(1)" : "scale(0.98)",
                  zIndex: activeIndex === i ? 10 : 1,
                }}
              >
                <div
                  className="position-relative overflow-hidden"
                  style={{ height: "250px" }}
                >
                  <img
                    loading="lazy"
                    src={blogs.img}
                    alt={blogs.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(138,90,118,0.5) 0%, rgba(138,90,118,0) 50%)",
                    }}
                  ></div>
                  <div className="position-absolute top-0 end-0 mt-3 me-3">
                    <span
                      className="badge rounded-pill px-3 py-2"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        color: "#8a5a76",
                        fontWeight: 500,
                      }}
                    >
                      {blogs.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h5
                    className="mb-3"
                    style={{
                      color: "#8a5a76",
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    {blogs.title}
                  </h5>
                  <p className="text-muted mb-4">{blogs.desc}</p>
                  <div className="d-flex align-items-center mb-3">
                    <div className="d-flex align-items-center me-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#b57e9f"
                        viewBox="0 0 16 16"
                        className="me-1"
                      >
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-1v1a.5.5 0 0 1-1 0V2H3v1a.5.5 0 0 1-1 0V2H2z" />
                        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                      </svg>
                      <small className="text-muted">{blogs.date}</small>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div
            className="swiper-button-prev"
            style={{
              color: "#8a5a76",
              left: "-40px",
              width: "48px",
              height: "48px",
              marginLeft: "3rem",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          ></div>
          <div
            className="swiper-button-next"
            style={{
              color: "#8a5a76",
              right: "-40px",
              width: "48px",
              height: "48px",
              marginRight: "3rem",
              background: "rgba(255,255,255,0.9)",
              borderRadius: "50%",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          ></div>
        </Swiper>
      </div>

      <style jsx>{`
        .wedding-blog-section {
          position: relative;
          overflow: hidden;
        }

        .blog-blogs {
          transition: all 0.4s ease;
          transform-origin: center bottom;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(232, 183, 213, 0.2);
        }

        .blog-blogs:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(216, 161, 189, 0.2);
        }

        .wedding-link {
          color: #b57e9f !important;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .wedding-link:hover {
          color: #8a5a76 !important;
          letter-spacing: 0.5px;
        }

        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 20px;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default blogsCarousel;
