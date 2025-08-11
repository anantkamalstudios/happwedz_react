import React from "react";
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

const MainSection = () => {
  const { section } = useParams();

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
        <TopSlider />
        <SortSection />
        <FactorsList />
        <FaqsSection />
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

  if (section === "by-theme") {
    return (
      <>
        <VenuesSearch title="By Theme" />
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
      </>
    );
  }

  return <NotFound />;
};

export default MainSection;
