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
const Home = () => {
  return (
    <>
      <Herosection />
      {/* <StatisticsSection /> */}
      <WeddingCategories />
      <MansoryImageSection />
      <CtaPanel
        logo={logo}
        img={image}
        heading="Design Studio"
        subHeading="Try Virtual Makeup & Grooming Looks for Your Big Day"
        link="/try"
        title="Create Your Look !"
        subtitle="Experience How You'll Look on Your Wedding Day with AI-Powered Virtual Makeover"
        btnName="Try Virtual Look"
      />
      <VenueSlider />
      <HowItWorksSection />
      <FeaturedVendorsSection />
      <CtaPanel
        logo={logo}
        img={einviteImage}
        heading="Digital Wedding Invitations"
        subHeading="Personalize & Send Invites Instantly"
        title="Create Stunning Digital Wedding Invitations That Wow"
        subtitle="Design beautiful e-invites using our easy-to-use editor. Customize templates, add your personal touch, and send invites digitally to your guests in minutes."
        link="/e-invites"
        btnName="Create Your E-Invite"
      />

      <TestimonialsSection />
      <RealWeddings />
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
      <PlanningToolsCTA />
      <MainTestimonial />
      <BlogInspirationTeasers />
      {/* <NewsletterSection /> */}
      <AppDownloadSection />

      <MetroCities />
    </>
  );
};

export default Home;
