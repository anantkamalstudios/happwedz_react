import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const HOTELS = [
  {
    id: "aurika-mumbai-airport",
    name: "Aurika, Mumbai International Airport - Luxury by Lemon Tree Hotels",
    location:
      "NS C-04, CTS No. 145 A, Skycity, Sahar Airport Road, Mumbai, India",
    rating: 8.5,
    ratingLabel: "Very Good",
    reviews: 1427,
    locationScore: 8.8,
    priceFrom: "₹18,000",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [
      "https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    tags: [
      "5-star luxury",
      "Near Mumbai Airport",
      "Couples favourite",
      "Very clean rooms",
    ],
    shortDescription:
      "Elegant 5-star stay near Mumbai International Airport with spa, pool, and multiple dining options.",
    overview: [
      "Spa facilities, terrace, outdoor pool, restaurant, bar, and free WiFi.",
      "Family-friendly restaurant with Chinese, Indian, Italian, Japanese, Mexican, local, Asian, and European cuisines.",
      "Rooms with air-conditioning, city views, minibars, and flat-screen TVs.",
      "Free private parking, fitness room, and 24-hour front desk.",
      "Couples rate the location highly for a two-person trip.",
    ],
    breakfastInfo: "Very good breakfast · Continental, American, Buffet",
    facilities: [
      "Outdoor swimming pool",
      "Airport shuttle",
      "Spa and wellness centre",
      "Fitness centre",
      "Room service",
      "3 restaurants",
      "Free parking",
      "Tea/Coffee Maker in all rooms",
      "Bar",
    ],
    propertyHighlights: [
      "Perfect for a 2-night stay",
      "Top location: guests rated it 8.8",
      "Free private parking available at the hotel",
    ],
  },
  {
    id: "romantic-beachfront-resort",
    name: "Romantic Beachfront Resort",
    location: "Goa, India",
    rating: 9.2,
    ratingLabel: "Superb",
    reviews: 124,
    priceFrom: "₹12,500",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    tags: ["Beachfront", "Couples", "Breakfast included"],
    shortDescription:
      "Private beach access, candlelight dinners, and ocean-view suites designed for couples.",
    overview: [
      "Direct access to a private sandy beach.",
      "Romantic sunset experiences curated for couples.",
    ],
    breakfastInfo: "Breakfast included · Continental and local options",
    facilities: [
      "Outdoor pool",
      "Beach access",
      "Spa and wellness centre",
      "Restaurant",
      "Free parking",
    ],
    propertyHighlights: [
      "Highly rated by couples",
      "Popular choice for beach honeymoons",
    ],
  },
  {
    id: "mountain-view-retreat",
    name: "Mountain View Retreat",
    location: "Manali, India",
    rating: 9.0,
    ratingLabel: "Superb",
    reviews: 89,
    priceFrom: "₹9,800",
    image:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    tags: ["Mountain view", "Spa access", "Cozy rooms"],
    shortDescription:
      "Wake up to snow-capped peaks, warm fireplaces, and private balconies.",
    overview: [
      "Rooms with panoramic mountain views.",
      "Cozy fireplaces and in-house spa.",
    ],
    breakfastInfo: "Breakfast included · Buffet",
    facilities: [
      "Spa and wellness centre",
      "Restaurant",
      "Free parking",
      "Room service",
    ],
    propertyHighlights: [
      "Ideal for winter honeymoons",
      "Quiet and scenic surroundings",
    ],
  },
  {
    id: "city-skyline-suite",
    name: "City Skyline Suite",
    location: "Mumbai, India",
    rating: 8.9,
    ratingLabel: "Fabulous",
    reviews: 102,
    priceFrom: "₹14,200",
    image:
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    tags: ["City view", "Rooftop pool", "Luxury"],
    shortDescription:
      "Modern suites with stunning skyline views and a rooftop infinity pool.",
    overview: [
      "Rooftop infinity pool overlooking the city.",
      "Designer suites with floor-to-ceiling windows.",
    ],
    breakfastInfo: "Breakfast available · Continental",
    facilities: ["Rooftop pool", "Bar", "Restaurant", "Fitness centre"],
    propertyHighlights: [
      "Perfect for city-loving couples",
      "Close to shopping and nightlife",
    ],
  },
];

export default function HoneymoonHotelsPage() {
  const navigate = useNavigate();
  const { hotelId } = useParams();

  const selectedHotel = useMemo(
    () => HOTELS.find((hotel) => hotel.id === hotelId),
    [hotelId],
  );

  if (selectedHotel) {
    return (
      <div className="container py-4 py-md-5">
        <button
          type="button"
          className="btn btn-link px-0 mb-3 fs-14"
          onClick={() => navigate("/honeymoon/hotels")}
        >
          ← Back to all honeymoon stays
        </button>

        <div className="row g-4">
          <div className="col-md-7">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-8">
                  <div
                    style={{
                      height: 260,
                      backgroundImage: `url(${
                        selectedHotel.gallery?.[0] || selectedHotel.image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <div className="col-4 d-none d-md-block">
                  <div
                    style={{
                      height: 130,
                      backgroundImage: `url(${
                        selectedHotel.gallery?.[1] || selectedHotel.image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div
                    style={{
                      height: 130,
                      backgroundImage: `url(${
                        selectedHotel.gallery?.[2] || selectedHotel.image
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </div>
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h1 className="h4 mb-1 fs-16">{selectedHotel.name}</h1>
                    <div className="text-muted fs-14">
                      {selectedHotel.location}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-success-subtle text-success px-3 py-2 rounded-3 fs-12">
                      <span className="fw-bold me-1">
                        {selectedHotel.rating.toFixed(1)}
                      </span>
                      <span className="fs-12">
                        {selectedHotel.ratingLabel} · {selectedHotel.reviews}{" "}
                        reviews
                      </span>
                    </div>
                    {selectedHotel.locationScore && (
                      <div className="mt-2 fs-12 text-muted">
                        Great location ·{" "}
                        {selectedHotel.locationScore.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </div>

                <p className="mb-3 fs-14 text-muted">
                  {selectedHotel.shortDescription}
                </p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedHotel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge rounded-pill bg-light text-dark border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {selectedHotel.overview && (
                  <div className="mt-3">
                    <h2 className="h6 mb-2 fs-14">Overview</h2>
                    <ul className="mb-0 ps-3 fs-14 text-muted">
                      {selectedHotel.overview.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-end mb-2">
                  <div>
                    <div className="fs-13 text-muted">Price for tonight</div>
                    <div className="h4 mb-0">{selectedHotel.priceFrom}</div>
                    <div className="fs-12 text-muted">
                      per night · taxes extra
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-primary-subtle text-primary rounded-pill mb-1">
                      Honeymoon special
                    </div>
                    <div className="fs-12 text-muted">
                      Free cancellation on select rooms
                    </div>
                    {selectedHotel.breakfastInfo && (
                      <div className="mt-2 fs-13">
                        <strong>Breakfast:</strong>{" "}
                        {selectedHotel.breakfastInfo}
                      </div>
                    )}
                    {selectedHotel.propertyHighlights && (
                      <ul className="mt-3 mb-0 ps-3 fs-12 text-muted">
                        {selectedHotel.propertyHighlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3 rounded-3"
                >
                  Check availability
                </button>
                <div className="fs-12 text-muted mt-2">
                  No booking fees · Instant confirmation
                </div>
              </div>
            </div>

            {selectedHotel.facilities && (
              <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-3 p-md-4">
                  <h2 className="h6 mb-3 fs-14">Most popular facilities</h2>
                  <div className="row g-2 fs-14 text-muted">
                    {selectedHotel.facilities.map((item) => (
                      <div
                        key={item}
                        className="col-6 d-flex align-items-center"
                      >
                        <span className="me-2">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
        <div>
          <h1 className="h4 mb-1 fs-16">Romantic honeymoon stays</h1>
          <p className="text-muted fs-14 mb-0">
            Handpicked hotels ideal for couples, inspired by your Recommended
            Picks.
          </p>
        </div>
        <div className="fs-13 text-muted">
          Showing <strong>{HOTELS.length}</strong> handpicked stays
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {HOTELS.map((hotel) => (
          <div key={hotel.id} className="col-12">
            <div
              className="card border-0 shadow-sm rounded-4 overflow-hidden"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/honeymoon/hotels/${hotel.id}`)}
            >
              <div className="row g-0">
                <div className="col-md-4">
                  <div
                    style={{
                      height: 160,
                      backgroundImage: `url(${hotel.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body p-3 p-md-4">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div>
                        <h2 className="h5 mb-1 fs-16">{hotel.name}</h2>
                        <div className="text-muted fs-14">{hotel.location}</div>
                      </div>
                      <div className="text-end">
                        <div className="badge bg-success-subtle text-success px-3 py-2 rounded-3">
                          <span className="fw-bold me-1">
                            {hotel.rating.toFixed(1)}
                          </span>
                          <span className="fs-12">
                            {hotel.reviews}+ reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="mb-2 fs-14 text-muted">
                      {hotel.shortDescription}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {hotel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="badge rounded-pill bg-light text-dark border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="d-flex justify-content-between align-items-end">
                      <div className="fs-13 text-muted">
                        Perfect for a{" "}
                        <span className="fw-semibold">2-person trip</span>
                      </div>
                      <div className="text-end">
                        <div className="fs-13 text-muted">Starting from</div>
                        <div className="h5 mb-0">{hotel.priceFrom}</div>
                        <div className="fs-12 text-muted">per night</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
