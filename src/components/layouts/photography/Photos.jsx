import React from "react";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../../config/constants";

const Photos = ({ title, images = [], loading = false }) => {
  const displayImages = images && images.length > 0 ? images : [];

  const normalizeImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/450x300?text=Image+Not+Available";
    if (url.startsWith("http")) {
      return url.replace("http://happywedz.com/", IMAGE_BASE_URL);
    }
    return IMAGE_BASE_URL + url.replace(/^\/+/, "");
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="alert alert-info">
          <h5>No photos available</h5>
          <p>There are no photos in this category yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5">
      {title && (
        <div className="mb-4">
          <h2 className="text-center">{title}</h2>
        </div>
      )}

      <div className="masonry">
        {displayImages.map((img, index) => {
          const rawUrl =
            Array.isArray(img.images) && img.images.length > 0
              ? img.images[0]
              : img.image_url || img.url || img.image;

          const imageUrl = normalizeImageUrl(rawUrl);
          const imageName = img.title || img.name || "Wedding Photo";
          const imageType = img.category_name || img.type_name || img.type || "";

          return (
            <div key={img.id || index} className="masonry-item">
              <Link
                to={`/photography/details/${img.id}`}
                className="text-decoration-none"
                style={{ cursor: "pointer" }}
              >
                <div className="card border-0 shadow-sm hover-card">
                  <img
                    src={imageUrl}
                    alt={imageName}
                    className="card-img-top"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/450x300?text=Image+Not+Available";
                    }}
                  />
                  <div className="card-body p-2">
                    <h6 className="mb-1 text-dark">{imageName}</h6>
                    {imageType && <small className="text-muted">{imageType}</small>}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Photos;
