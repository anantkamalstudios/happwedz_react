import React from "react";
import Navbar from "../../layouts/matrimonial/Navbar";
import Hero from "./Home/Hero";
import MembersPlan from "./Home/MembersPlan";
import HomeSlider from "./Home/HomeSlider";
// import MatrimonialDashboard from "./dashboard/MatrimonialDashboard";

const MatrimonialMain = () => {
  return (
    <div>
      <Hero />
      <MembersPlan />
      <HomeSlider />
      {/* <MatrimonialDashboard /> */}
    </div>
  );
};

export default MatrimonialMain;
