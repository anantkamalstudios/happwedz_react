import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import blogs from "../../data/blogs";
import { FiArrowUpRight } from "react-icons/fi";

const BlogsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="blogs-carousel-wrapper py-5 px-3">
      <div className="container position-relative">
        <div className="text-center mb-1">
          <img
            src="/images/home/inspiredTeaser.png"
            alt="inspiredTeaser"
            srcset=""
            className="w-20 h-20"
          />
          <h2 className="blogs-carousel-heading">Inspiration Teasers</h2>
          <p className="blogs-carousel-subheading">
            Discover the latest trends, tips, and real wedding stories
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          navigation={{
            nextEl: ".blogs-carousel-next",
            prevEl: ".blogs-carousel-prev",
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="blogs-swiper"
        >
          {blogs.map((blog, i) => (
            <SwiperSlide key={i}>
              <div
                className="blogs-card p-2 m-2"
                style={{
                  height: "500px",
                  borderRadius: "0",
                }}
              >
                {/* Image */}
                <div className="blogs-card-image p-2">
                  <img src={blog.img} alt={blog.title} />
                </div>

                {/* Content */}
                <div className="blogs-card-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="blogs-category">{blog.category}</span>
                    <FiArrowUpRight size={20} className="blogs-title-icon" />
                  </div>
                  <h5 className="blogs-title">{blog.title}</h5>
                  <p className="blogs-desc">
                    {blog.desc && blog.desc.length > 120
                      ? blog.desc.slice(0, 120) + "..."
                      : blog.desc}
                  </p>

                  {/* Footer */}
                  <div className="blogs-footer">
                    <div className="blogs-profile">
                      <img
                        src={blog.authorImg || "https://via.placeholder.com/50"}
                        alt={blog.author || "Author"}
                      />
                      <div className="blogs-profile-info">
                        <span className="blogs-author">
                          {blog.author || "Admin"}
                        </span>
                        <small className="blogs-date">{blog.date}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogsCarousel;
