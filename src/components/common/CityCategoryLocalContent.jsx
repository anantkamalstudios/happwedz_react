import React from "react";

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const toTitleCase = (str) =>
  str ? str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "";

export const MIN_LISTING_THRESHOLD = 3;

const CityCategoryLocalContent = ({
  categoryLabel,
  categorySlug,
  cityLabel,
  citySlug,
  vendorCount = 0,
  priceLow = 15000,
  priceHigh = 50000,
  priceUnit = "service package",
  popularLocalities = [],
  topRatedVendorName = "",
  topRatedVendorRating = 4.9,
  styleNote = "",
  seasonalNote = "Peak booking months are Oct–Feb; popular vendors get booked 3-6 months out.",
  avgReviewCount = 12,
}) => {
  const isEligible = Boolean(categoryLabel && cityLabel && vendorCount >= MIN_LISTING_THRESHOLD);

  const formattedCity = toTitleCase(cityLabel);
  const formattedCategory = categoryLabel;
  const lowerCategory = categoryLabel ? categoryLabel.toLowerCase() : "";

  const localitiesText =
    popularLocalities.length > 0
      ? popularLocalities.slice(0, 3).join(", ")
      : `${formattedCity} central areas`;

  // Inject FAQPage Schema ONLY when visible content is rendered
  React.useEffect(() => {
    if (!isEligible) return;

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How much do ${lowerCategory} cost in ${formattedCity}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${formattedCategory} in ${formattedCity} typically charge ₹${priceLow.toLocaleString("en-IN")}–₹${priceHigh.toLocaleString("en-IN")} for a ${priceUnit}, depending on experience level, event requirements, and seasonal demand.`,
          },
        },
        {
          "@type": "Question",
          name: `Which areas in ${formattedCity} have the most ${lowerCategory}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Most ${formattedCity} ${lowerCategory} operate across key hubs like ${localitiesText}, with most vendors providing citywide services.`,
          },
        },
        {
          "@type": "Question",
          name: `When should I book ${lowerCategory} in ${formattedCity}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: seasonalNote,
          },
        },
      ],
    };

    const scriptId = `faq-schema-${citySlug || "city"}-${categorySlug || "cat"}`;
    const scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.id = scriptId;
    scriptTag.text = JSON.stringify(faqSchema);
    document.head.appendChild(scriptTag);

    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [isEligible, formattedCity, formattedCategory, lowerCategory, priceLow, priceHigh, priceUnit, localitiesText, seasonalNote, citySlug, categorySlug]);

  if (!isEligible) return null;

  const seedKey = `${citySlug || cityLabel}-${categorySlug || categoryLabel}`;
  const seed = hashString(seedKey);
  const rotationIndex = seed % 3;

  // PRICING SLOT
  const pricingSlotVariants = [
    `${formattedCategory} in ${formattedCity} generally range from ₹${priceLow.toLocaleString("en-IN")} to ₹${priceHigh.toLocaleString("en-IN")} for a ${priceUnit}, with ${vendorCount} active vendors currently listed on HappyWedz across the city.`,
    `With ${vendorCount} verified ${lowerCategory} serving ${formattedCity}, couples can expect pricing between ₹${priceLow.toLocaleString("en-IN")} and ₹${priceHigh.toLocaleString("en-IN")} per ${priceUnit}, varying by experience and demand during peak wedding season.`,
    `Budgeting for ${lowerCategory} in ${formattedCity}? Most vendors on HappyWedz price a ${priceUnit} between ₹${priceLow.toLocaleString("en-IN")} and ₹${priceHigh.toLocaleString("en-IN")}, and ${formattedCity} has ${vendorCount} top-rated options to compare.`,
  ];

  // STYLE / SEASONAL SLOT
  const defaultStyle = styleNote || `${formattedCity} ${lowerCategory} focus on personalized service, contemporary themes, and seamless event execution.`;
  const styleSlotVariants = [
    `${defaultStyle} ${seasonalNote}`,
    `In ${formattedCity}, ${defaultStyle.charAt(0).toLowerCase() + defaultStyle.slice(1)} ${seasonalNote}`,
    `${seasonalNote} Locally, ${defaultStyle.charAt(0).toLowerCase() + defaultStyle.slice(1)}`,
  ];

  // LOCALITY SLOT
  const defaultVendor = topRatedVendorName || `experienced local professionals`;
  const localitySlotVariants = [
    `Popular areas for ${lowerCategory} in ${formattedCity} include ${localitiesText}, home to some of the city's highest-rated vendors like ${defaultVendor}${topRatedVendorName ? ` (${topRatedVendorRating}★)` : ""}.`,
    `${formattedCity}'s ${lowerCategory} scene is concentrated around ${localitiesText} — with ${defaultVendor} currently among the top-rated choices in the city at ${topRatedVendorRating}★.`,
    `Whether you are based near ${popularLocalities[0] || "the city center"} or ${popularLocalities[1] || "surrounding hubs"}, ${formattedCity} has strong coverage for ${lowerCategory}, led by highly recommended choices like ${defaultVendor}.`,
  ];

  const p1 = pricingSlotVariants[rotationIndex];
  const p2 = styleSlotVariants[rotationIndex];
  const p3 = localitySlotVariants[rotationIndex];

  return (
    <article className="local-content-wrapper my-5 p-4 rounded-3 border bg-white shadow-sm">
      <section className="local-context mb-4">
        <h2 className="h4 fw-bold mb-3 text-dark">
          Planning & Pricing Guide for {formattedCategory} in {formattedCity}
        </h2>
        <p className="fs-15 text-muted lh-base mb-3">{p1}</p>
        <p className="fs-15 text-muted lh-base mb-3">{p2}</p>
        <p className="fs-15 text-muted lh-base mb-0">{p3}</p>
      </section>

      <div className="trust-strip d-flex flex-wrap gap-4 py-3 my-4 border-top border-bottom bg-light px-3 rounded-2">
        <span className="small fw-semibold text-dark">
          ✔ {vendorCount} Verified {formattedCategory} in {formattedCity}
        </span>
        <span className="small fw-semibold text-dark">
          ⭐ Avg. {avgReviewCount}+ Reviews per Listing
        </span>
        <span className="small fw-semibold text-dark">
          🛡️ Verified Vendor Profiles & Direct Quotes
        </span>
      </div>

      <section className="local-faq">
        <h3 className="h5 fw-bold mb-3 text-dark">
          Frequently Asked Questions ({formattedCity} {formattedCategory})
        </h3>

        <div className="faq-item mb-3">
          <h4 className="h6 fw-bold mb-1 text-dark">
            How much do {lowerCategory} cost in {formattedCity}?
          </h4>
          <p className="small text-muted mb-0">
            {formattedCategory} in {formattedCity} typically charge ₹{priceLow.toLocaleString("en-IN")}–₹{priceHigh.toLocaleString("en-IN")} for a {priceUnit}, depending on experience level, event requirements, and seasonal demand.
          </p>
        </div>

        <div className="faq-item mb-3">
          <h4 className="h6 fw-bold mb-1 text-dark">
            Which areas in {formattedCity} have the most {lowerCategory}?
          </h4>
          <p className="small text-muted mb-0">
            Most {formattedCity} {lowerCategory} operate across key hubs like {localitiesText}, with most vendors providing citywide services.
          </p>
        </div>

        <div className="faq-item mb-0">
          <h4 className="h6 fw-bold mb-1 text-dark">
            When should I book {lowerCategory} in {formattedCity}?
          </h4>
          <p className="small text-muted mb-0">{seasonalNote}</p>
        </div>
      </section>
    </article>
  );
};

export default CityCategoryLocalContent;
