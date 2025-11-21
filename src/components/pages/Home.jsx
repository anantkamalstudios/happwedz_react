import React, { useEffect, useState } from "react";
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
// import image from "../../../public/images/home/try.png";
import image from "../../../public/images/home/1.jpg";
import einviteImage from "../../../public/images/home/einvite.png";
import MainTestimonial from "../home/MainTestimonial";
import MetroCities from "../home/MetroCities";
import HomeGennie from "../common/HomeGennie";
import bigleafcta1 from "../../../public/images/home/bigleafcta1.jpg";
import bigleafcta5 from "../../../public/images/home/bigleafcta5.jpg";
import bigleaf from "../../../public/images/home/bigleaf.png";
import cmsApi from "../../services/api/cmsApi";
const Home = () => {
  const [designBanner, setDesignBanner] = useState(null);
  const [einviteBanner, setEinviteBanner] = useState(null);
  const [realWeddingData, setRealWeddingData] = useState(null);
  const [couplesSaysData, setCouplesSaysData] = useState(null);
  const normalizeUrl = (u) => {
    if (!u || typeof u !== "string") return null;
    const cleaned = u.replace(/`/g, "").trim();
    try {
      return encodeURI(cleaned);
    } catch {
      return cleaned;
    }
  };
  useEffect(() => {
    const run = async () => {
      try {
        const ds = await cmsApi.designStudioBanner.getBanner();
        setDesignBanner(ds?.data || null);
      } catch {}
      try {
        const ei = await cmsApi.einviteBanner.getBanner();
        setEinviteBanner(ei?.data || null);
      } catch {}
      try {
        const rw = await cmsApi.realWeddingPhoto.getData();
        setRealWeddingData(rw || null);
      } catch {}
      try {
        const cs = await cmsApi.whatCouplesSays.getData();
        setCouplesSaysData(cs?.data || null);
      } catch {}
    };
    run();
  }, []);
  return (
    <div style={{ position: "relative" }}>
      <Herosection />
      <WeddingCategories />
      <CtaPanel
        logo={normalizeUrl(designBanner?.logo) || logo}
        img={normalizeUrl(designBanner?.mainImage) || image}
        heading={designBanner?.heading || "Design Studio_"}
        subHeading={
          designBanner?.subheading ||
          "Try Virtual Makeup & Grooming Looks for Your Big Day_"
        }
        link={`/${(designBanner?.btnRedirect || "try").replace(/^\/+/, "")}`}
        title={designBanner?.title || "Create Your Look !"}
        subtitle={
          designBanner?.description ||
          "Experience How You'll Look in Your Wedding Day with AI-Powered Virtual Makeover."
        }
        btnName={designBanner?.btnName || "Try Virtual Look"}
        background={normalizeUrl(designBanner?.bgImage) || bigleafcta1}
      />
      <PlanningToolsCTA />
      <MansoryImageSection />
      <VenueSlider />
      <CtaPanel
        logo={normalizeUrl(einviteBanner?.logo) || logo}
        img={normalizeUrl(einviteBanner?.mainImage) || einviteImage}
        heading={einviteBanner?.heading || "E-INVITES"}
        subHeading={
          einviteBanner?.subheading ||
          "Create Stunning Digital Wedding Invitations That Wow"
        }
        title={
          einviteBanner?.title ||
          "Design Beautiful E-Invites with Our Easy-to-Use Editor !"
        }
        subtitle={
          einviteBanner?.description ||
          "Discover curated options that fit your style, budget and location. Search and compare instantly."
        }
        link={`/${(einviteBanner?.btnRedirect || "einvites").replace(
          /^\/+/,
          ""
        )}`}
        btnName={einviteBanner?.btnName || "Create Your E-Invite"}
        background={normalizeUrl(einviteBanner?.bgImage) || bigleafcta5}
      />
      <RealWeddings
        icon={normalizeUrl(realWeddingData?.icon)}
        title={realWeddingData?.title}
        subtitle={realWeddingData?.subtitle}
        btnName={realWeddingData?.btnName}
        redirectUrl={realWeddingData?.redirectUrl}
        images={(Array.isArray(realWeddingData?.images)
          ? realWeddingData.images
          : []
        ).map(normalizeUrl)}
      />
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
      <MainTestimonial
        heading={couplesSaysData?.heading}
        subHeading={couplesSaysData?.subHeading}
        mainImage={normalizeUrl(couplesSaysData?.mainImage)}
        sections={
          Array.isArray(couplesSaysData?.sections)
            ? couplesSaysData.sections.map((s) => ({
                ...s,
                img: normalizeUrl(s.img),
              }))
            : []
        }
      />
      <BlogInspirationTeasers />
      {/* <NewsletterSection /> */}
      <HowItWorksSection />
      <AppDownloadSection />
      <MetroCities />
      {/* <div
        style={{
          position: "fixed",
          bottom: "10vh",
          right: "60px",
          zIndex: "99",
        }}
      >
        <HomeGennie />
      </div> */}
    </div>
  );
};

export default Home;
