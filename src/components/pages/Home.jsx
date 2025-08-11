import React from "react";
import Herosection from "../home/Herosection";
import WeddingCategories from "../home/WeddingCategories";
import VenueSlider from "../home/VenueSlider";
import PopularSearches from "../home/PopularSearches";
import RealWeddings from "../home/RealWeddings";
import PlanningToolsCTA from "../home/PlanningToolsCTA";
import AppDownloadSection from "../home/AppDownloadSection";
import BlogInspirationTeasers from "../home/BlogInspirationTeasers";

const Home = () => {
  return (
    <>
      <Herosection />
      <WeddingCategories />
      <VenueSlider />
      <RealWeddings />
      <PlanningToolsCTA />
      <BlogInspirationTeasers />
      <AppDownloadSection />
    </>
  );
};

export default Home;
