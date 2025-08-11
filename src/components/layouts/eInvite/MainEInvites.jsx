import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import EInviteCard from "./EInviteCard";
import { Container } from "react-bootstrap";
import "./MainEInvites.css";

const sampleData = [
  {
    image:
      "https://image.wedmegood.com/e-invite-images/ec553b5f-80da-4228-8ff5-7ead0cd50b73-Cover.JPEG",
    title: "Royal Garden",
    price: 499,
  },
  {
    image:
      "https://image.wedmegood.com/e-invite-images/ec553b5f-80da-4228-8ff5-7ead0cd50b73-Cover.JPEG",
    title: "Palace Theme",
    price: 599,
  },
  {
    image:
      "https://image.wedmegood.com/e-invite-images/ec553b5f-80da-4228-8ff5-7ead0cd50b73-Cover.JPEG",
    title: "Floral Mandap",
    price: 399,
  },
  {
    image:
      "https://image.wedmegood.com/e-invite-images/ec553b5f-80da-4228-8ff5-7ead0cd50b73-Cover.JPEG",
    title: "Pink Curtain",
    price: 499,
  },
  {
    image:
      "https://image.wedmegood.com/e-invite-images/ec553b5f-80da-4228-8ff5-7ead0cd50b73-Cover.JPEG",
    title: "Fairy Night",
    price: 699,
  },
];

const MainEInvites = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewClicked, setViewClicked] = useState(false);

  const handleViewAllClick = () => {
    setViewClicked(true);
    // Scroll or navigate logic can go here
  };

  return (
    <Container className="einvites-wrapper my-5">
      <h1 className="section-title">Wedding E‑Invitations</h1>

      <Swiper
        spaceBetween={30}
        navigation
        loop={false}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        breakpoints={{
          0: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
        modules={[Navigation]}
      >
        {sampleData.map((item, idx) => (
          <SwiperSlide key={idx}>
            <EInviteCard {...item} zoom={idx === activeIndex} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="view-all-wrapper">
        <button
          className={`view-all-button ${viewClicked ? "clicked" : ""}`}
          onClick={handleViewAllClick}
        >
          View All
        </button>
      </div>
    </Container>
  );
};

export default MainEInvites;
