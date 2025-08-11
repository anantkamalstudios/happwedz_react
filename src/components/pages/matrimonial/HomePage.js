// src/pages/HomePage.js
import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import FeaturedProfiles from "../components/FeaturedProfiles";
import SuccessStories from "../components/SuccessStories";
import MembershipPlans from "../components/MembershipPlans";
import MobileAppSection from "../components/MobileAppSection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <HeroSection />
      <SearchSection />
      <FeaturedProfiles />
      <SuccessStories />
      <MembershipPlans />
      <MobileAppSection />
      <Footer />
    </div>
  );
};

export default HomePage;
