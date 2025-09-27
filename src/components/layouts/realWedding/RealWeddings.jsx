import React, { useState, useEffect } from "react";
import axios from "axios";
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
  FaMapMarkerAlt,
} from "react-icons/fa";
import CtaPanel from "../../home/CtaPanel";

const RealWeddings = ({ onPostClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://happywedz.com/api/realwedding"
        );
        // The API returns an array directly.
        if (response.data && Array.isArray(response.data)) {
          setWeddings(response.data);
        } else {
          setWeddings([]);
        }
        setError(null);
      } catch (err) {
        setError("Failed to fetch wedding stories. Please try again later.");
        console.error("Error fetching weddings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeddings();
  }, []);

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"; // A fallback image
    }
    console.log(path)
    return `https://happywedzbackend.happywedz.com${path}`;
  };

  const WeddingCard = ({ wedding }) => (
    <div
      className="col-lg-4 col-md-6 mb-5"
      onClick={() => onPostClick(wedding)}
    >
      <div className="wedding-card h-100">
        <div className="position-relative overflow-hidden rounded-3 mb-3 main-image-container">
          <img
            src={getImageUrl(wedding.coverPhoto)}
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
          {wedding.highlightPhotos?.slice(0, 2).map((img, index) => (
            <div key={index} className="col-6">
              <div className="position-relative overflow-hidden rounded-2 small-image-container">
                <img
                  src={getImageUrl(img)}
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
                <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
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
            {loading ? (
              <div className="text-center py-5">
                <p className="text-muted fs-4">Loading weddings...</p>
              </div>
            ) : (
              filteredWeddings.slice(0, visibleCount).map((wedding) => (
                <WeddingCard key={wedding.id} wedding={wedding} />
              ))
            )}
          </div>

          {!loading && error && (
            <div className="text-center py-5 text-danger">
              <p className="fs-4">{error}</p>
            </div>
          )}

          {!loading && !error && filteredWeddings.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted fs-4">
                No weddings found matching your search.
              </p>
            </div>
          )}

          {/* Load More Button */}
          {!loading && filteredWeddings.length > visibleCount && (
            <div className="text-center mt-5">
              <button
                className="btn btn btn-primary btn-lg px-5 load-more-btn"
                onClick={handleLoadMore}
              >
                Load More Weddings
              </button>
            </div>
          )}
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
