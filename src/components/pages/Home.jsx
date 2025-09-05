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
const Home = () => {
  return (
    <>
      <Herosection />
      {/* <StatisticsSection /> */}
      <WeddingCategories />
      <MansoryImageSection />
      <CtaPanel
        img={logo}
        title="Create Stunning Digital Wedding Invitations That Wow"
        link="/e-invites"
        subtitle="Design Beautiful E-Invites with Our Easy-to-Use Editor"
        btnName="Create Your E-Invite"
      />
      <VenueSlider />
      <HowItWorksSection />
      <FeaturedVendorsSection />
      <CtaPanel
        img={logo}
        title="Find Your Perfect Match with Our Trusted Matrimonial Services"
        link="/matrimonial"
        subtitle="Bringing Hearts Together for a Lifetime of Happiness"
        btnName="Start Your Journey"
      />
      <TestimonialsSection />
      <RealWeddings />
      <CtaPanel
        img={logo}
        title="Try Virtual Makeup & Grooming Looks for Your Big Day"
        link="/try"
        subtitle="Experience How You'll Look on Your Wedding Day with AI-Powered Virtual Makeover"
        btnName="Try Virtual Look"
      />
      <PlanningToolsCTA />
      <BlogInspirationTeasers />
      {/* <NewsletterSection /> */}
      <AppDownloadSection />
    </>
  );
};

export default Home;
