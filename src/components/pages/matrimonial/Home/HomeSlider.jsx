import React, { useEffect } from "react";
import "../../../../Matrimonial.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const HomeSlider = () => {
  const successStories = [
    {
      id: 1,
      name: "Raj & Priya",
      date: "Mar 2023",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
    {
      id: 2,
      name: "Amit & Neha",
      date: "Jan 2023",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
    {
      id: 3,
      name: "Vikram & Anjali",
      date: "Dec 2022",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
    {
      id: 4,
      name: "Sanjay & Meera",
      date: "Oct 2022",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
    {
      id: 5,
      name: "Rahul & Shreya",
      date: "Aug 2022",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
    {
      id: 6,
      name: "Arjun & Pooja",
      date: "Jun 2022",
      img: "https://image.wedmegood.com/resized/450X/uploads/images/a9be0dac3e0b47c79e41dd7e0a82ec93realwedding/b(6)Large.jpeg?crop=102,322,812,457",
    },
  ];

  return (
    <div className="success-stories-container container-fluid">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30} // Increased space between slides
        slidesPerView={3}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 20, // Space for mobile
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 25, // Space for tablet
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30, // Space for desktop
          },
        }}
      >
        {successStories.map((story) => (
          <SwiperSlide key={story.id}>
            <div
              className="success-card"
              style={{
                margin: "0 10px", // Added horizontal margin
                padding: "10px",
                background: "white",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={story.img}
                alt={`${story.name} wedding`}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h4 style={{ margin: "10px 0 5px 0", textAlign: "center" }}>
                {story.name}
              </h4>
              <p style={{ margin: 0, textAlign: "center", color: "#666" }}>
                Married: {story.date}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
