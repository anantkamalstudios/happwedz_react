import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import {
  FaHeart,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShare,
  FaSearch,
  FaBars,
  FaUser,
  FaBell,
} from "react-icons/fa";

const RealWeddings = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const weddings = [
    {
      id: 1,
      title: "Diya and Anmol",
      location: "Udaipur",
      views: "8.2k",
      images: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 2,
      title: "Mehaak and Gautam",
      location: "Delhi",
      views: "12.5k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 3,
      title: "Upasana and Gaurav",
      location: "Mumbai",
      views: "9.8k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 4,
      title: "Surbhi and Prashanth",
      location: "Bangalore",
      views: "15.2k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 5,
      title: "Sangeeta and Aditya",
      location: "Jaipur",
      views: "7.9k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 6,
      title: "Harshita and Jay",
      location: "Goa",
      views: "11.3k",
      images: [
        "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 7,
      title: "Puja and Harnarayan",
      location: "Agra",
      views: "6.7k",
      images: [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 8,
      title: "Mahek and Abhilash",
      location: "Kerala",
      views: "13.8k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 9,
      title: "Namita and Devashish",
      location: "Pune",
      views: "10.1k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 10,
      title: "Shilpa and Tushar",
      location: "Chennai",
      views: "8.5k",
      images: [
        "https://images.unsplash.com/photo-1587271636175-90d58cdad458?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=150&h=100&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 11,
      title: "Kavita and Sameer",
      location: "Kolkata",
      views: "9.2k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
    {
      id: 12,
      title: "Anita and Rajesh",
      location: "Hyderabad",
      views: "14.7k",
      images: [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=300&h=300&fit=crop",
      ],
      category: "Real Wedding",
    },
  ];

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const WeddingCard = ({ wedding }) => (
    <div className="col-lg-4 col-md-6 mb-5">
      <div className="wedding-card h-100">
        <div className="position-relative overflow-hidden rounded-3 mb-3 main-image-container">
          <img
            src={wedding.images[0]}
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
          <div className="position-absolute top-0 start-0 p-3">
            <span className="badge bg-white text-dark px-3 py-2 category-badge">
              {wedding.category}
            </span>
          </div>
        </div>

        <div className="row g-2 mb-3">
          {wedding.images.slice(1).map((img, index) => (
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
              {wedding.location}
            </span>
            <span className="d-flex align-items-center">
              <FaEye className="me-1" size={12} />
              {wedding.views}
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
    </div>
  );
};

export default RealWeddings;
