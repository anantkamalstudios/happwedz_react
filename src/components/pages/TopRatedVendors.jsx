import React from "react";

const TopRatedVendors = () => {
  const weddingLists = [
    {
      title: "20 Best Banquet halls in Chattarpur",
      slug: "best-banquet-halls-chattarpur",
    },
    {
      title: "10 Best Farmhouses in Chattarpur",
      slug: "best-farmhouses-chattarpur",
    },
    {
      title: "Best 20 Wedding photographers in Gurgaon",
      slug: "best-wedding-photographers-gurgaon",
    },
    {
      title: "10 Best poolside wedding venues in Delhi NCR",
      slug: "best-poolside-wedding-venues-delhi-ncr",
    },
    {
      title: "10 Best pre wedding venues in Delhi NCR",
      slug: "best-pre-wedding-venues-delhi-ncr",
    },
    {
      title: "20 Best banquet halls in Delhi NCR",
      slug: "best-banquet-halls-delhi-ncr",
    },
    {
      title: "10 Best 5 Star hotels in Delhi NCR for Weddings",
      slug: "best-5-star-hotels-weddings-delhi-ncr",
    },
    {
      title: "20 Best rated Candid Photographers in Delhi",
      slug: "best-rated-candid-photographers-delhi",
    },
    {
      title: "Best marriage halls in Bangalore",
      slug: "best-marriage-halls-bangalore",
    },
    {
      title: "20 Best banquet halls in Mumbai",
      slug: "best-banquet-halls-mumbai",
    },
    {
      title: "10 Best Terrace Wedding Venues in Delhi NCR",
      slug: "best-terrace-wedding-venues-delhi-ncr",
    },
    {
      title: "14 Best rated destination wedding photographers for Goa",
      slug: "best-destination-wedding-photographers-goa",
    },
    {
      title: "15 Best banquet halls in South delhi",
      slug: "best-banquet-halls-south-delhi",
    },
    {
      title: "Best Pre-wedding venues in Bangalore (Engagement / Sangeet)",
      slug: "best-pre-wedding-venues-bangalore",
    },
  ];

  return (
    <div
      style={{
        padding: "40px",
      }}
    >
      <h4>Top Rated Vendors Page</h4>
      <p style={{ color: "gray" }}>
        Meet out top vendors famoues in the various cities
      </p>
      <div
        style={{
          marginTop: "20px",
        }}
      >
        {weddingLists.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
            }}
          >
            <a
              href={`/wedding-lists/${item.slug}`}
              style={{
                textDecoration: "none",
                color: "#C31162",
              }}
            >
              {item.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedVendors;
