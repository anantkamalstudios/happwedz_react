import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const TopSlider = ({ onCategorySelect }) => {
  const categories = [
    {
      label: "All",
      slug: "all",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Bridal Wear",
      slug: "Mehendi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Groom Wear",
      slug: "Reception",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Venues",
      slug: "Makeup",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Photographers",
      slug: "Real-Wedding",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Mehndi",
      slug: "Decor",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Makeup",
      slug: "Haldi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Decor",
      slug: "Haldi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Planning",
      slug: "Haldi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Invitations",
      slug: "Haldi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
  ];

  return (
    <div className="container-fluid px-3 py-2 my-5">
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="category-swiper"
      >
        {categories.map((cat, idx) => (
          <SwiperSlide key={idx} style={{ width: "auto" }}>
            <div
              className="category-wrapper"
              onClick={() => onCategorySelect(cat.slug)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="category-image mx-auto d-block mb-2"
                style={{
                  width: "150px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "0.25rem",
                }}
              />
            </div>
            <span
              className="d-flex justify-content-around text-center fa-bold"
              style={{ fontSize: "14px" }}
            >
              {cat.label}
            </span>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopSlider;
