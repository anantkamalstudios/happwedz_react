import React from "react";
import Herosection from "../home/Herosection";
import WeddingCategories from "../home/WeddingCategories";
import VenueSlider from "../home/VenueSlider";
import PopularSearches from "../home/PopularSearches";

const Home = () => {
  return (
    <>
      <Herosection />
      <WeddingCategories />

      <VenueSlider />
      <PopularSearches />
    </>
  );
};

export default Home;
