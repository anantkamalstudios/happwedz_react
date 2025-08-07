import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TopSlider = () => {
  const categories = [
    {
      label: "All",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Bridal Wear",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Groom Wear",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Venues",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Photographers",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Mehndi",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Makeup",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Decor",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Planning",
      image:
        "https://image.wedmegood.com/resized/200X/uploads/im_cat_image/36/bridal-lehenga.jpg",
    },
    {
      label: "Invitations",
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
