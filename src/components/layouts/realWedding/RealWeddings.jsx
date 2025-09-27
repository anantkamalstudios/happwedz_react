import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import logo from "../../../../public/happywed_white.png";
import einviteImage from "../../../../public/images/home/einvite.png";
import image from "../../../../public/images/home/try.png";

import {
  FaHeart,
  FaEye,
  FaCalendarAlt,
  FaShare,
  FaSearch,
  FaBars,
  FaUser,
  FaBell,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CtaPanel from "../../home/CtaPanel";

const RealWeddings = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const weddings = [
    {
      title: "Diya and Anmol",
      slug: "diya-anmol-udaipur-2023",
      weddingDate: "2023-11-25",
      city: "Udaipur",
      venues: ["City Palace", "Leela Palace"],

      brideName: "Diya Sharma",
      brideBio: "An architect with a love for heritage and culture.",
      groomName: "Anmol Mehta",
      groomBio: "An entrepreneur passionate about travel and luxury events.",

      story:
        "A royal-themed wedding set against the backdrop of Udaipur’s palaces, blending traditions with modern elegance.",

      events: [
        { name: "Mehendi", date: "2023-11-23", venue: "Leela Palace" },
        {
          name: "Sangeet",
          date: "2023-11-24",
          venue: "City Palace Courtyard",
        },
        {
          name: "Wedding",
          date: "2023-11-25",
          venue: "Jagmandir Island Palace",
        },
      ],

      vendors: [
        { type: "Planner", name: "DreamWed Planners" },
        { type: "Caterer", name: "Leela Palace Catering" },
      ],

      coverPhoto:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      highlightPhotos: [
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop",
      ],
      allPhotos: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
      ],

      themes: ["Royal", "Traditional"],
      brideOutfit: "Red Sabyasachi Lehenga",
      groomOutfit: "Ivory Sherwani by Manish Malhotra",
      specialMoments: "Boat ride to the wedding venue at sunset.",

      photographer: "LensArt Studio",
      makeup: "Glow by Neha",
      decor: "Royal Décor Udaipur",
      additionalCredits: ["Fireworks by PyroShow India"],

      status: "published",
      featured: true,
    },
    {
      title: "Lisha and Aman",
      slug: "lisha-aman-goa-2024",
      weddingDate: "2024-02-10",
      city: "Goa",
      venues: ["W Goa Resort", "Beachside Mandap"],

      brideName: "Lisha Verma",
      brideBio: "Fashion designer with a love for beach vibes.",
      groomName: "Aman Kapoor",
      groomBio: "Tech startup founder who enjoys surfing and music.",

      story:
        "A bohemian beach wedding with pastel décor, tropical vibes, and a lively celebration under the stars.",

      events: [
        { name: "Haldi", date: "2024-02-08", venue: "W Goa Poolside" },
        { name: "Sangeet", date: "2024-02-09", venue: "Beach Shack" },
        { name: "Wedding", date: "2024-02-10", venue: "Beachside Mandap" },
      ],

      vendors: [
        { type: "Planner", name: "Beach Bliss Planners" },
        { type: "DJ", name: "DJ Arjun" },
      ],

      coverPhoto:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      highlightPhotos: [
        "https://images.unsplash.com/photo-1499955085172-a104c9463ece?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529634899531-2e66e46008b3?w=800&h=600&fit=crop",
      ],
      allPhotos: [
        "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&h=600&fit=crop",
      ],

      themes: ["Bohemian", "Beach"],
      brideOutfit: "Pastel Lehenga by Anita Dongre",
      groomOutfit: "Linen Kurta with Floral Jacket",
      specialMoments: "Vows exchanged during sunset by the sea.",

      photographer: "Goa Wedding Shoots",
      makeup: "BeachGlow Artists",
      decor: "Tropical Décor Goa",
      additionalCredits: ["Live Band: Ocean Beats"],

      status: "published",
      featured: false,
    },
    {
      title: "Meera and Kunal",
      slug: "meera-kunal-jaipur-2024",
      weddingDate: "2024-03-15",
      city: "Jaipur",
      venues: ["Rambagh Palace", "Samode Haveli"],

      brideName: "Meera Joshi",
      brideBio: "Doctor who loves history and culture.",
      groomName: "Kunal Agarwal",
      groomBio: "Investment banker with a flair for royal architecture.",

      story:
        "A grand Jaipur wedding showcasing vibrant colors, traditional Rajasthani music, and regal settings.",

      events: [
        { name: "Engagement", date: "2024-03-13", venue: "Samode Haveli" },
        { name: "Sangeet", date: "2024-03-14", venue: "Rambagh Palace Lawn" },
        {
          name: "Wedding",
          date: "2024-03-15",
          venue: "Rambagh Palace Courtyard",
        },
      ],

      vendors: [
        { type: "Planner", name: "Royal Rajasthan Planners" },
        { type: "Decorator", name: "Heritage Décor Jaipur" },
      ],

      coverPhoto:
        "https://images.unsplash.com/photo-1524492449090-1a065f2d7d86?w=800&h=600&fit=crop",
      highlightPhotos: [
        "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop",
      ],
      allPhotos: [
        "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1504198266285-165a9a6e2b2e?w=800&h=600&fit=crop",
      ],

      themes: ["Traditional", "Cultural"],
      brideOutfit: "Pink Lehenga by Tarun Tahiliani",
      groomOutfit: "Gold Embroidered Sherwani",
      specialMoments: "Grand Baraat procession through the palace gates.",

      photographer: "Royal Frames Jaipur",
      makeup: "Glam by Ritu",
      decor: "Jaipur Heritage Décor",
      additionalCredits: ["Folk Dance Troupe"],

      status: "published",
      featured: true,
    },
  ];

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const WeddingCard = ({ wedding }) => (
    <div
      className="col-lg-4 col-md-6 mb-5"
      onClick={() => onPostClick(wedding)}
    >
      <div className="wedding-card h-100">
        <div className="position-relative overflow-hidden rounded-3 mb-3 main-image-container">
          <img
            src={wedding.coverPhoto}
            alt={wedding.title}
            className="main-image"
            style={{ objectFit: "cover", width: "100%" }}
          />
          <div className="wedding-overlay">
            <div className="overlay-content">
              <div className="d-flex justify-content-center gap-3">
                <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
                  <FaHeart />
                </button>
                <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
                  <FaEye />
                </button>
                <button className="btn btn-light btn-sm rounded-circle p-2 overlay-btn">
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
          {/* <div className="position-absolute top-0 start-0 p-3">
            <span className="badge bg-white text-dark px-3 py-2 category-badge">
              {wedding.category}
            </span>
          </div> */}
        </div>

        <div className="row g-2 mb-3">
          {wedding.highlightPhotos.map((img, index) => (
            <div key={index} className="col-6">
              <div className="position-relative overflow-hidden rounded-2 small-image-container">
                <img
                  src={img}
                  alt={`${wedding.title} ${index + 2}`}
                  className="img-fluid small-image"
                  style={{
                    aspectRatio: "16/10",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <div className="small-overlay">
                  <FaEye className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wedding-info">
          <h5 className="wedding-title mb-2">{wedding.title}</h5>
          <div className="d-flex justify-content-between align-items-center text-muted small">
            <span className="d-flex align-items-center">
              <FaMapMarkerAlt className="me-1" size={12} />
              {wedding.city}
            </span>
            <span className="d-flex align-items-center">
              <FaCalendarAlt className="me-1" size={12} />
              {new Date(wedding.weddingDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wedding-gallery">
      {/* Filter Bar */}
      <section className="filter-section py-4 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg hero-search"
                  placeholder="Search by couple names or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CiSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="text-muted">
                Showing {filteredWeddings.length} weddings
              </span>
            </div>
          </div>
        </div>
      </section>

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

      {/* Wedding Gallery */}
      <section className="gallery-section py-5">
        <div className="container">
          <div className="row">
            {filteredWeddings.map((wedding) => (
              <WeddingCard key={wedding.id} wedding={wedding} />
            ))}
          </div>

          {filteredWeddings.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted fs-4">
                No weddings found matching your search.
              </p>
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center mt-5">
            <button className="btn btn btn-primary btn-lg px-5 load-more-btn">
              Load More Weddings
            </button>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default RealWeddings;
