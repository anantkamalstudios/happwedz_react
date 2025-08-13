import React from "react";
import Navbar from "../../layouts/matrimonial/Navbar";
import Hero from "./Home/Hero";
import MembersPlan from "./Home/MembersPlan";
import HomeSlider from "./Home/HomeSlider";

const MatrimonialMain = () => {
  return (
    <div>
      <Hero />
      <MembersPlan />
      <HomeSlider />
    </div>
  );
};

export default MatrimonialMain;
