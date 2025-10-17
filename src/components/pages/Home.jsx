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
        subHeading="Personalize & Send Invites Instantly"
        link="/e-invites"
        title="Create Stunning Digital Wedding Invitations That Wow"
        subtitle="Design beautiful e-invites using our easy-to-use editor. Customize templates, add your personal touch, and send invites digitally to your guests in minutes."
        btnName="Get Started"
      />
      <PlanningToolsCTA />
      <MansoryImageSection />
      <VenueSlider />
      <CtaPanel
        logo={logo}
        img={einviteImage}
        heading="Digital Wedding Invitations"
        subHeading="Customize & Share in Moments"
        title="Make a Statement with Stylish Online Wedding Invites"
        subtitle="Design beautiful e-invites using our easy-to-use editor. Customize templates, add your personal touch, and send invites digitally to your guests in minutes."
        link="/e-invites"
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
