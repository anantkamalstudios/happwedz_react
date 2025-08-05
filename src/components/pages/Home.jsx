import React from "react";
import Herosection from "../home/Herosection";
import WeddingCategories from "../home/WeddingCategories";
import VenueSlider from "../home/VenueSlider";
import PopularSearches from "../home/PopularSearches";
import BlogInspirationTeasers from "../home/BlogInspirationTeasers";

const Home = () => {
    return (
        <>
            <Herosection />
            <WeddingCategories />
            <VenueSlider />
            <PopularSearches />
            <BlogInspirationTeasers />
        </>
    );
};

export default Home;
