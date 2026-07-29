import { useEffect, useState, lazy, Suspense } from "react";
import Herosection from "../home/Herosection";
import LazyViewportSection from "../common/LazyViewportSection";
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";

const WeddingCategories = lazy(() => import("../home/WeddingCategories"));
const VenueSlider = lazy(() => import("../home/VenueSlider"));
const HowItWorksSection = lazy(() => import("../home/HowItWorksSection"));
const RealWeddings = lazy(() => import("../home/RealWeddings"));
const PlanningToolsCTA = lazy(() => import("../home/PlanningToolsCTA"));
const BlogInspirationTeasers = lazy(() => import("../home/BlogInspirationTeasers"));
const AppDownloadSection = lazy(() => import("../home/AppDownloadSection"));
const MansoryImageSection = lazy(() => import("../home/MansoryImageSection"));
const CtaPanel = lazy(() => import("../home/CtaPanel"));
const MainTestimonial = lazy(() => import("../home/MainTestimonial"));
const MetroCities = lazy(() => import("../home/MetroCities"));
import cmsApi from "../../services/api/cmsApi";

// These are only fallbacks for below-the-fold, lazy CtaPanels. Referencing them
// by their /public URL (instead of importing) keeps them out of the initial
// Home JS chunk — the browser fetches them lazily when the panel scrolls in.
const logo = "/happywed_white.png";
const image = "/images/home/1.jpg";
const einviteImage = "/images/home/einvite.png";
const bigleafcta1 = "/images/home/bigleafcta1.jpg";
const bigleafcta5 = "/images/home/bigleafcta5.jpg";

const Home = () => {
  useDocumentMetadata({
    title: "HappyWedz - Find Top Wedding Vendors, Venues & Planning Tools",
    description: "Discover top-rated wedding vendors, venues, and planning tools for your perfect wedding. Explore real weddings, inspiration, and expert advice with HappyWedz.",
    keywords: "wedding planning, wedding vendors, wedding venues, wedding cards, design studio, shaadi ai",
    ogUrl: "https://happywedz.com/",
    canonicalUrl: "https://happywedz.com/",
  });

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
      <Suspense fallback={<div style={{ minHeight: "200px" }} />}>
        <LazyViewportSection height="300px">
          <WeddingCategories />
        </LazyViewportSection>
        <LazyViewportSection height="400px">
          <CtaPanel
            logo={normalizeUrl(designBanner?.logo) || logo}
            img={normalizeUrl(designBanner?.mainImage) || image}
            heading={designBanner?.heading || "Design Studio"}
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
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <PlanningToolsCTA />
        </LazyViewportSection>
        <LazyViewportSection height="400px">
          <MansoryImageSection />
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <VenueSlider />
        </LazyViewportSection>
        <LazyViewportSection height="400px">
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
              "",
            )}`}
            btnName={einviteBanner?.btnName || "Create Your E-Invite"}
            background={normalizeUrl(einviteBanner?.bgImage) || bigleafcta5}
          />
        </LazyViewportSection>
        <LazyViewportSection height="300px">
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
        </LazyViewportSection>
        <LazyViewportSection height="300px">
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
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <BlogInspirationTeasers />
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <HowItWorksSection />
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <AppDownloadSection />
        </LazyViewportSection>
        <LazyViewportSection height="300px">
          <MetroCities />
        </LazyViewportSection>
      </Suspense>
    </div>
  );
};

export default Home;
