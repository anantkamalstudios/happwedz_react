import React from "react";
import Herosection from "../home/Herosection";
import WeddingCategories from "../home/WeddingCategories";
import StatisticsSection from "../home/StatisticsSection";
import VenueSlider from "../home/VenueSlider";
import FeaturedVendorsSection from "../home/FeaturedVendorsSection";
import HowItWorksSection from "../home/HowItWorksSection";
import TestimonialsSection from "../home/TestimonialsSection";
import RealWeddings from "../home/RealWeddings";
import PlanningToolsCTA from "../home/PlanningToolsCTA";
import BlogInspirationTeasers from "../home/BlogInspirationTeasers";
import NewsletterSection from "../home/NewsletterSection";
import AppDownloadSection from "../home/AppDownloadSection";
import MansoryImageSection from "../home/MansoryImageSection";
import CtaPanel from "../home/CtaPanel";
import logo from "../../../public/happywed_white.png";
import image from "../../../public/images/home/try.png";
import einviteImage from "../../../public/images/home/einvite.png";
import MainTestimonial from "../home/MainTestimonial";
import MetroCities from "../home/MetroCities";
import HomeGennie from "../common/HomeGennie";
const Home = () => {
  return (
    <div style={{ position: "relative" }}>
      <Herosection />
      {/* <StatisticsSection /> */}
      <WeddingCategories />
      <CtaPanel
        logo={logo}
        img={image}
        heading="Design Studio"
        subHeading="Try Virtual Makeup & Grooming Looks for Your Big Day"
        link="/try"
        title="Create Your Look !"
        subtitle="Experience How You'll Look in Your Wedding Day with AI-Powered Virtual Makeover."
        btnName="Try Virtual Look"
      />
      <PlanningToolsCTA />
      <MansoryImageSection />
      <VenueSlider />
      <CtaPanel
        logo={logo}
        img={einviteImage}
        heading="E-INVITES"
        subHeading="Create Stunning Digital Wedding Invitations That Wow"
        title="Design Beautiful E-Invites with Our Easy-to-Use Editor !" 
        subtitle="Discover curated options that fit your style, budget and location. Search and compare instantly."
        link="/einvites"
        btnName="Create Your E-Invite"
      />
      <RealWeddings />
      {/* <FeaturedVendorsSection /> */}

      {/* <TestimonialsSection /> */}
      {/* <CtaPanel
        logo={logo}
        img={image}
        heading="Matrimonial Services"
        subHeading="Connecting Hearts Across Communities"
        title="Find Your Perfect Match with Our Trusted Matrimonial Services"
        subtitle="Bringing Hearts Together for a Lifetime of Happiness. Explore verified profiles, personalized matches, and start your journey towards a meaningful relationship."
        link="/matrimonial"
        btnName="Start Your Journey"
      /> */}
      <MainTestimonial />
      <BlogInspirationTeasers />
      {/* <NewsletterSection /> */}
      <HowItWorksSection />
      <AppDownloadSection />
      <MetroCities />
      <div
        style={{
          position: "fixed",
          bottom: "10vh",
          right: "60px",
          zIndex: "99",
        }}
      >
        <HomeGennie />
      </div>
    </div>
  );
};

export default Home;
