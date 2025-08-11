import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import NotFound from "./NotFound";
import MainByRegion from "../layouts/Main/MainByRegion";
import FindMain from "../layouts/Main/FindMain";
import MainHeroSection from "../layouts/Main/MainHeroSection";
import FactorsList from "../layouts/Main/FactorsList";
import FaqsSection from "../layouts/Main/FaqsSection";
import TopSlider from "../layouts/photography/TopSlider";
import SortSection from "../layouts/photography/SortSection";
import MainEInvites from "../layouts/eInvite/MainEInvites";
import GridImages from "../layouts/photography/GridImages";
import GroomeSlider from "../layouts/twoSoul/GroomeSlider";
import BrideSlider from "../layouts/twoSoul/BrideSlider";
import MainPhotages from "../layouts/twoSoul/MainPhotages";
import Detailed from "../layouts/Detailed";
import PricingModal from "../layouts/PricingModal";

const MainSection = () => {
  const { section } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (section === "venues") {
    return (
      <>
        <VendorsSearch />
        <MainByRegion />
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "vendors") {
    return (
      <>
        <VenuesSearch title="Wedding Vendor" />
        <MainByRegion />
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "photography") {
    return (
      <>
        <VenuesSearch title="Photography" />
        {/* <MainByRegion /> */}

        <TopSlider onCategorySelect={setSelectedCategory} />
        <SortSection
          category={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />
        <GridImages category={selectedCategory} searchQuery={searchQuery} />
        {/* <FactorsList />
        <FaqsSection /> */}
      </>
    );
  }

  if (section === "real-wedding") {
    return (
      <>
        <VenuesSearch title="Real Wedding" />
        <MainByRegion />
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "e-invites") {
    return (
      <>
        <VenuesSearch title="E Invites" />
        {/* <MainByRegion /> */}
        <MainEInvites />
        {/* <FindMain /> */}
        {/* <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection /> */}
      </>
    );
  }

  if (section === "twosoul") {
    return (
      <>
        <VenuesSearch title="Two Soul" />
        <MainByRegion />
        <GroomeSlider />
        <MainPhotages />
        <BrideSlider />
      </>
    );
  }

  if (section === "latest-real-weddings") {
    return (
      <>
        <VenuesSearch title="latest Real Weddings" />
        <MainByRegion />
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "matrimonial") {
    return (
      <>
        <VenuesSearch title="Matrimonial" />
        <MainByRegion />
        <FindMain />
        <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "genie") {
    return (
      <>
        <VenuesSearch title="Genie" />
        <PricingModal />
      </>
    );
  }

  return <NotFound />;
};

export default MainSection;
