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
import PricingModal from "../layouts/PricingModal";
import WeddingCardDesigns from "../layouts/eInvite/WeddingCardDesigns";
import MainSearch from "../layouts/Main/MainSearch";
import RealWedding from "./RealWedding";
import Genie from "./Genie";
import AllCategories from "../layouts/AllCategories";
import WeddingCategories from "../home/WeddingCategories";

const MainSection = () => {
  const { section } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (section === "venues") {
    return (
      <>
        <MainSearch />
        <MainByRegion />
        <AllCategories />
        {/* <FactorsList /> */}
        <FaqsSection />
      </>
    );
  }

  if (section === "vendors") {
    return (
      <>
        <MainSearch title="Wedding Vendor" />
        <AllCategories />
        <MainByRegion />
        <FindMain />
        {/* <FactorsList /> */}
        <FaqsSection />
      </>
    );
  }

  if (section === "photography") {
    return (
      <>
        <MainSearch title="Photography" />
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
        {/* <MainSearch title="Real Wedding" /> */}
        <RealWedding />
      </>
    );
  }

  if (section === "e-invites") {
    return (
      <>
        <MainSearch title="E Invites" />
        {/* <MainByRegion /> */}
        {/* <MainEInvites /> */}
        <WeddingCardDesigns />
        {/* <FindMain /> */}
        {/* <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        */}
        <FaqsSection />
      </>
    );
  }
  if (section === "e-invite-wedding-card-designs") {
    return (
      <>
        {/* <VenuesSearch title="E Invites" /> */}
        {/* <MainByRegion /> */}
        {/* <MainEInvites /> */}
        <WeddingCardDesigns />
        {/* <FindMain /> */}
        {/* <MainHeroSection loc={"Panjab"} />
        <MainHeroSection loc={"Karela "} />
        <MainHeroSection loc={"Goa"} />
        */}
        <FactorsList />
        <FaqsSection />
      </>
    );
  }

  if (section === "twosoul") {
    return (
      <>
        <MainSearch title="Two Soul" />
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
        <MainSearch title="latest Real Weddings" />
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

  // if (section === "matrimonial") {
  //   return (
  //     <>
  //       <VenuesSearch title="Matrimonial" />
  //       <MainByRegion />
  //       <FindMain />
  //       <MainHeroSection loc={"Panjab"} />
  //       <MainHeroSection loc={"Karela "} />
  //       <MainHeroSection loc={"Goa"} />
  //       <FactorsList />
  //       <FaqsSection />
  //     </>
  //   );
  // }

  if (section === "genie") {
    return (
      <>
        <Genie />
      </>
    );
  }

  return <NotFound />;
};

export default MainSection;
