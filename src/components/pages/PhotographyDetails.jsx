import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaShareAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPinterest,
} from "react-icons/fa";
import { IMAGE_BASE_URL } from "../../config/constants";
import usePhotography from "../../hooks/usePhotography";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { CiCalendarDate } from "react-icons/ci";

const PhotographyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const {
    photo,
    photosByCategory,
    loading,
    error,
    fetchPhotoById,
    fetchPhotosByCategory,
  } = usePhotography();

  useEffect(() => {
    if (id) {
      fetchPhotoById(id);
    }
  }, [id]);

  useEffect(() => {
    if (photo && photo.photography_category_id) {
      fetchPhotosByCategory(photo.photography_category_id);
    }
  }, [photo?.photography_category_id]);

  const normalizeImageUrl = (url) => {
    if (!url) return "./images/noimage.jpeg";
    if (url.startsWith("http")) {
      return url.replace("http://happywedz.com/", IMAGE_BASE_URL);
    }
    return IMAGE_BASE_URL + url.replace(/^\/+/, "");
  };

  const getFallbackImageUrl = (url) => {
    if (!url) return null;
    // Handle both full URLs and relative paths
    if (url.includes("/uploads/photography/")) {
      return url.replace("/uploads/photography/", "/uploads/blogs/");
    }
    // If it's already a blogs URL or doesn't contain photography path, return null
    return null;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo?.title || "Photography",
          text: photo?.description || "Check out this amazing photography!",
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  if (loading && !photo) {
    return <LoadingState title="Loading Photography Details" />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!photo) {
    return (
      <div className="container py-5 text-center">
        <h3>Photography not found</h3>
        <button className="btn btn-pink mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const images = photo.images || [];
  const thumbnails = photo.thumbnails || images;
  const similarPhotos =
    photosByCategory?.filter((p) => p.id !== photo.id) || [];

  return (
    <>
      <div
        className="container-fluid py-4 bg-light"
        style={{ minHeight: "100vh" }}
      >
        {/* Breadcrumb */}
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb bg-transparent px-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link
                  to="/photography"
                  className="text-decoration-none text-muted"
                >
                  Photography
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {photo.title}
              </li>
            </ol>
          </nav>
        </div>

        <div className="container">
          <div className="row g-4">
            {/* Main Image Section */}
            <div className="col-lg-8">
              <div className="bg-white rounded shadow-sm overflow-hidden">
                {/* Main Image */}
                <div
                  className="position-relative"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    src={normalizeImageUrl(
                      images[selectedImageIndex] || thumbnails[0]
                    )}
                    alt={photo.title}
                    loading="lazy"
                    className="w-100"
                    style={{
                      height: "600px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      const fallbackUrl = getFallbackImageUrl(e.target.src);
                      if (fallbackUrl && e.target.src !== fallbackUrl) {
                        e.target.src = fallbackUrl;
                      } else {
                        e.target.onerror = null;
                        e.target.src = "./images/noimage.jpeg";
                      }
                    }}
                  />
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="p-3 border-top">
                    <div className="d-flex gap-2 overflow-auto pb-2">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className={`position-relative ${
                            selectedImageIndex === index
                              ? "thumbnail-selected"
                              : ""
                          }`}
                          style={{ minWidth: "100px" }}
                        >
                          <img
                            src={normalizeImageUrl(thumbnails[index] || img)}
                            alt={`Thumbnail ${index + 1}`}
                            className="rounded"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border:
                                selectedImageIndex === index
                                  ? "3px solid #e91e63"
                                  : "3px solid transparent",
                            }}
                            onClick={() => setSelectedImageIndex(index)}
                            onError={(e) => {
                              const fallbackUrl = getFallbackImageUrl(
                                e.target.src
                              );
                              if (fallbackUrl && e.target.src !== fallbackUrl) {
                                e.target.src = fallbackUrl;
                              } else {
                                e.target.onerror = null;
                                e.target.src = "./images/noimage.jpeg";
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {photo.description && (
                <div className="bg-white rounded shadow-sm p-4 mt-4">
                  <h5 className="fw-bold mb-3">About this Photography</h5>
                  <p className="text-muted mb-0" style={{ lineHeight: "1.8" }}>
                    {photo.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar - Details */}
            <div className="col-lg-4">
              <div
                className="bg-white rounded shadow-sm p-4 sticky-top"
                style={{ top: "20px" }}
              >
                {/* Upload Date */}
                {photo.createdAt && (
                  <div className="d-flex align-items-center gap-2 mb-3 text-muted">
                    <CiCalendarDate size={20} />
                    <small>
                      Uploaded{" "}
                      {new Date(photo.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </small>
                  </div>
                )}

                {/* Title */}
                <h4 className="fw-bold mb-4">{photo.title}</h4>

                {/* View More Album Section */}
                {similarPhotos.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      View More photos from this Album
                    </h6>
                    <div className="d-flex gap-2 overflow-auto pb-2">
                      {similarPhotos.slice(0, 3).map((item) => {
                        const itemImage =
                          Array.isArray(item.images) && item.images.length > 0
                            ? item.images[0]
                            : item.image_url || item.url;

                        return (
                          <Link
                            key={item.id}
                            to={`/photography/details/${item.id}`}
                            className="text-decoration-none"
                          >
                            <img
                              src={normalizeImageUrl(itemImage)}
                              alt={item.title}
                              className="rounded"
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                const fallbackUrl = getFallbackImageUrl(
                                  e.target.src
                                );
                                if (
                                  fallbackUrl &&
                                  e.target.src !== fallbackUrl
                                ) {
                                  e.target.src = fallbackUrl;
                                } else {
                                  e.target.onerror = null;
                                  e.target.src = "./images/noimage.jpeg";
                                }
                              }}
                            />
                          </Link>
                        );
                      })}
                      {similarPhotos.length > 3 && (
                        <Link
                          to="/photography"
                          className="d-flex align-items-center justify-content-center bg-dark bg-opacity-75 text-white rounded text-decoration-none"
                          style={{
                            width: "80px",
                            height: "80px",
                            minWidth: "80px",
                          }}
                        >
                          <span className="fw-bold">
                            +{similarPhotos.length - 3} More
                          </span>
                        </Link>
                      )}
                      <button
                        className="btn btn-link text-pink p-0 ms-2"
                        onClick={() => navigate("/photography")}
                        style={{ minWidth: "30px" }}
                      >
                        <FaChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tags Section */}
                {photo.tags && photo.tags.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Picture Tags</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {photo.tags.map((tag, index) => (
                        <span key={index} className="badge-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="position-relative mb-4">
                  {/* Enhanced Like & Share Section */}
                  <div
                    className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light bg-opacity-50"
                    style={{
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                    }}
                  >
                    {/* Like Button with Counter */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className={`btn position-relative overflow-hidden ${
                          isLiked ? "btn-pink" : "btn-light"
                        }`}
                        onClick={handleLike}
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "16px",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          transform: isLiked ? "scale(1.1)" : "scale(1)",
                          boxShadow: isLiked
                            ? "0 8px 16px rgba(255, 105, 180, 0.3)"
                            : "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <FaHeart
                          size={20}
                          style={{
                            color: isLiked ? "#fff" : "#6c757d",
                            transition: "all 0.3s ease",
                          }}
                        />
                      </button>
                      <div className="d-flex flex-column align-items-start">
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1.125rem", lineHeight: "1.2" }}
                        >
                          {photo.likes !== undefined
                            ? photo.likes + (isLiked ? 1 : 0)
                            : 6}
                        </span>
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          likes
                        </small>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        width: "1px",
                        height: "40px",
                        background:
                          "linear-gradient(to bottom, transparent, #dee2e6, transparent)",
                      }}
                    ></div>

                    {/* Share Button */}
                    <button
                      className="btn btn-light d-flex align-items-center gap-2 px-3"
                      onClick={handleShare}
                      style={{
                        height: "48px",
                        borderRadius: "16px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0,0,0,0.1)";
                      }}
                    >
                      <FaShareAlt size={18} className="text-secondary" />
                      <span className="fw-semibold text-secondary">Share</span>
                    </button>
                  </div>
                </div>

                {/* Enhanced Info Section */}
                <div
                  className="rounded-4 p-4 mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  {photo.photographer_name && (
                    <div
                      className="d-flex align-items-center gap-3 mb-4 pb-3"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <FaUser size={20} style={{ color: "#fff" }} />
                      </div>
                      <div className="flex-grow-1">
                        <small
                          className="text-uppercase fw-semibold text-muted d-block"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Photographer
                        </small>
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1rem", color: "#2d3748" }}
                        >
                          {photo.photographer_name}
                        </span>
                      </div>
                    </div>
                  )}
                  {photo.city_name && (
                    <div className="d-flex align-items-center gap-3 pb-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
                        }}
                      >
                        <FaMapMarkerAlt size={20} style={{ color: "#fff" }} />
                      </div>
                      <div className="flex-grow-1">
                        <small
                          className="text-uppercase fw-semibold text-muted d-block"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Location
                        </small>
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1rem", color: "#2d3748" }}
                        >
                          {photo.city_name}
                        </span>
                      </div>
                    </div>
                  )}
                  {photo.photography_category_name && (
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "48px",
                          height: "48px",
                          background:
                            "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                          boxShadow: "0 4px 12px rgba(79, 172, 254, 0.3)",
                        }}
                      >
                        <FaTag size={20} style={{ color: "#fff" }} />
                      </div>
                      <div className="flex-grow-1">
                        <small
                          className="text-uppercase fw-semibold text-muted d-block"
                          style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
                        >
                          Category
                        </small>
                        <span
                          className="fw-bold"
                          style={{ fontSize: "1rem", color: "#2d3748" }}
                        >
                          {photo.photography_category_name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                {/* <div className="d-grid gap-2 mt-4">
                                    <button className="btn btn-pink btn-lg">
                                        Contact Photographer
                                    </button>
                                    <button className="btn btn-outline-pink">
                                        View Portfolio
                                    </button>
                                </div> */}
              </div>
            </div>
          </div>

          {/* Similar Photography Section */}
          {similarPhotos.length > 0 && (
            <div className="mt-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">More from this Collection</h4>
                <Link
                  to="/photography"
                  className="btn btn-outline-pink btn-sm col-1"
                >
                  View All
                </Link>
              </div>

              <div className="row g-3">
                {similarPhotos.slice(0, 6).map((item) => {
                  const itemImage =
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : item.image_url || item.url;

                  return (
                    <div key={item.id} className="col-6 col-md-4 col-lg-2">
                      <Link
                        to={`/photography/details/${item.id}`}
                        className="text-decoration-none"
                      >
                        <div className="card border-0 shadow-sm h-100 hover-card">
                          <img
                            src={normalizeImageUrl(itemImage)}
                            alt={item.title}
                            className="card-img-top"
                            style={{
                              height: "200px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const fallbackUrl = getFallbackImageUrl(
                                e.target.src
                              );
                              if (fallbackUrl && e.target.src !== fallbackUrl) {
                                e.target.src = fallbackUrl;
                              } else {
                                e.target.onerror = null;
                                e.target.src = "./images/noimage.jpeg";
                              }
                            }}
                          />
                          <div className="card-body p-2">
                            <h6 className="mb-1 text-truncate small">
                              {item.title}
                            </h6>
                            <small
                              className="text-muted"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {item.photographer_name || "Unknown"}
                            </small>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            className="btn btn-light position-absolute rounded-circle lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
          >
            <FaTimes size={20} />
          </button>

          <img
            src={normalizeImageUrl(images[selectedImageIndex] || thumbnails[0])}
            alt={photo.title}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              const fallbackUrl = getFallbackImageUrl(e.target.src);
              if (fallbackUrl && e.target.src !== fallbackUrl) {
                e.target.src = fallbackUrl;
              } else {
                e.target.onerror = null;
                e.target.src = "./images/noimage.jpeg";
              }
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="btn btn-light position-absolute rounded-circle lightbox-nav-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev > 0 ? prev - 1 : images.length - 1
                  );
                }}
              >
                <FaChevronLeft size={20} />
              </button>
              <button
                className="btn btn-light position-absolute rounded-circle lightbox-nav-right"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex((prev) =>
                    prev < images.length - 1 ? prev + 1 : 0
                  );
                }}
              >
                <FaChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .btn-pink {
          background-color: #e91e63;
          color: white;
          border: none;
        }
        .btn-pink:hover {
          background-color: #c2185b;
          color: white;
        }
        .btn-outline-pink {
          border: 2px solid #e91e63;
          color: #e91e63;
          background: transparent;
        }
        .btn-outline-pink:hover {
          background-color: #e91e63;
          color: white;
        }
        .text-pink {
          color: #e91e63;
        }
        .badge-tag {
          display: inline-block;
          padding: 8px 16px;
          background-color: #fff;
          border: 2px solid #e91e63;
          color: #e91e63;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .badge-tag:hover {
          background-color: #e91e63;
          color: white;
        }
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .thumbnail-selected {
          animation: pulse 0.3s ease;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.95);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .lightbox-image {
          max-height: 90vh;
          max-width: 90vw;
          object-fit: contain;
          border-radius: 8px;
        }
        .lightbox-close {
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          z-index: 10000;
        }
        .lightbox-nav-left {
          left: 20px;
          width: 50px;
          height: 50px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10000;
        }
        .lightbox-nav-right {
          right: 20px;
          width: 50px;
          height: 50px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10000;
        }
        .overflow-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: #e91e63;
          border-radius: 10px;
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #c2185b;
        }
      `}</style>
    </>
  );
};

export default PhotographyDetails;
