import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../services/api/axiosInstance";
import {
  FiImage,
  FiVideo,
  FiSearch,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./gallery.css";

const Galleries = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/media/");
      if (response.data.success) {
        setMediaItems(response.data.media);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      toast.error("Failed to fetch media galleries");
    } finally {
      setLoading(false);
    }
  };

  const getS3Url = (s3Key) => {
    return `https://happywedz-s3-bucket.s3.ap-south-1.amazonaws.com/${s3Key}`;
  };

  const handleDownload = async (s3Key, collection, e) => {
    if (e) e.stopPropagation();
    try {
      const url = getS3Url(s3Key);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${collection}_${Date.now()}.${s3Key.split(".").pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredMedia.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredMedia.length) % filteredMedia.length
    );
  };

  const formatFileSize = (mb) => {
    return `${parseFloat(mb).toFixed(2)} MB`;
  };

  const collections = [
    "All",
    ...new Set(mediaItems.map((item) => item.collection)),
  ];

  const filteredMedia = mediaItems.filter((item) => {
    const matchesCollection =
      selectedCollection === "All" || item.collection === selectedCollection;
    const matchesSearch =
      item.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.token.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollection && matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  if (loading) {
    return (
      <div className="gallery-container">
        <div className="gallery-loader">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const currentMedia = filteredMedia[currentImageIndex];

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div>
          <h3 className="gallery-title">Galleries</h3>
          <p className="gallery-subtitle">Manage your event collections</p>
        </div>
        <div className="gallery-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="gallery-filters py-3">
        {collections.map((collection) => (
          <button
            key={collection}
            className={`filter-btn ${
              selectedCollection === collection ? "active" : ""
            }`}
            onClick={() => setSelectedCollection(collection)}
          >
            {collection}
          </button>
        ))}
      </div>

      {filteredMedia.length > 0 ? (
        <div className="gallery-grid">
          {filteredMedia.map((item, index) => (
            <div key={item.id} className="gallery-card">
              <div
                className="card-image"
                onClick={() =>
                  item.s3_key.match(/\.(jpg|jpeg|png|gif|webp)$/i) &&
                  openLightbox(index)
                }
                style={{
                  cursor: item.s3_key.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                    ? "pointer"
                    : "default",
                }}
              >
                {item.s3_key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={getS3Url(item.s3_key)}
                    alt={item.collection}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Error";
                    }}
                  />
                ) : (
                  <div className="video-placeholder">
                    <FiVideo size={40} />
                    <span>Video File</span>
                  </div>
                )}
                <div className="card-badges">
                  <div className="card-badge">
                    {item.visibility === "public" ? (
                      <FiEye size={12} />
                    ) : (
                      <FiEyeOff size={12} />
                    )}
                    <span>{item.visibility}</span>
                  </div>
                  <button
                    className="card-download-btn"
                    onClick={(e) =>
                      handleDownload(item.s3_key, item.collection, e)
                    }
                    title="Download"
                  >
                    <FiDownload size={14} />
                  </button>
                </div>
              </div>

              <div className="card-content">
                <h3 className="card-title">{item.collection}</h3>
                <p className="card-price">
                  {formatFileSize(item.file_size_mb)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiImage size={64} />
          <h3>No Media Found</h3>
          <p>No media files match your search criteria</p>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && currentMedia && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FiX size={24} />
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <FiChevronLeft size={32} />
          </button>

          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <FiChevronRight size={32} />
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getS3Url(currentMedia.s3_key)}
              alt={currentMedia.collection}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <div className="lightbox-details">
                <h3>{currentMedia.collection}</h3>
                <p>{formatFileSize(currentMedia.file_size_mb)}</p>
              </div>
              <button
                className="lightbox-download-btn"
                onClick={() =>
                  handleDownload(currentMedia.s3_key, currentMedia.collection)
                }
              >
                <FiDownload size={16} />
                Download
              </button>
            </div>
          </div>

          <div className="lightbox-counter">
            {currentImageIndex + 1} / {filteredMedia.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Galleries;
