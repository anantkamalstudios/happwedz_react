import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".success-stories-container"
    );
    let scrollAmount = 0;

    const autoScroll = setInterval(() => {
      if (scrollContainer) {
        scrollAmount += 1;
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollContainer.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 50);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="success-stories-container container-fluid">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {successStories.map((story) => (
          <SwiperSlide key={story.id}>
            <div className="success-card">
              <img
                src={story.img}
                alt={`${story.name} wedding`}
                className="couple-img"
              />
              <h4>{story.name}</h4>
              <p>Married: {story.date}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
