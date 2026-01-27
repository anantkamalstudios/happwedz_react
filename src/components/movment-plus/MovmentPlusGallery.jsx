import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import useMovmentPlus from "../../hooks/useMovmentPlus";
import Loader from "../ui/Loader";
import "./movment-plus-gallery.css";

const MovmentPlusGallery = () => {
  const { token } = useParams();
  const location = useLocation();
  const { fetchGalleryByToken, loading, data, error } = useMovmentPlus();
  const [galleryData, setGalleryData] = useState(
    location.state?.galleryData || null,
  );

  // State for collection view and lightbox
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!galleryData && token) {
      fetchGalleryByToken(token).then((res) => {
        if (res && res.success) {
          setGalleryData(res);
        }
      });
    }
  }, [token, galleryData, fetchGalleryByToken]);

  // Lightbox Navigation Handlers
  const currentImages =
    selectedCollection && galleryData?.collections
      ? galleryData.collections[selectedCollection] || []
      : [];

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % currentImages.length : null,
    );
  }, [currentImages.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + currentImages.length) % currentImages.length
        : null,
    );
  }, [currentImages.length]);

  // Keyboard support for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;

      switch (e.key) {
        case "ArrowLeft":
          prevImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "Escape":
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextImage, prevImage, closeLightbox]);

  if (loading && !galleryData) {
    return <Loader />;
  }

  if (error || (!loading && !galleryData)) {
    return (
      <div className="text-center py-5">
        <h3>Gallery not found or access denied.</h3>
      </div>
    );
  }

  // Extract collections from data
  const collections = galleryData?.collections || {};
  const collectionNames = Object.keys(collections);

  // Placeholder data for header
  const eventName = "Wedding Gallery";

  // Try to find a date from the first available media item
  const firstCollectionKey =
    collectionNames.length > 0 ? collectionNames[0] : null;
  const firstMedia = firstCollectionKey
    ? collections[firstCollectionKey][0]
    : null;

  const eventDate = firstMedia?.created_at
    ? new Date(firstMedia.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  // Render Collection View (Images in a folder)
  if (selectedCollection) {
    const images = collections[selectedCollection] || [];

    return (
      <div className="gallery_page_container">
        {/* Collection Header */}
        <header className="gallery_header">
          <div className="container">
            <h1>{eventName}</h1>
            <p>{eventDate}</p>
          </div>
        </header>

        {/* Images Grid */}
        <div className="gallery_grid_container">
          <div className="gallery_grid">
            {images.map((img, index) => (
              <div
                key={index}
                className="collection_card image_card"
                onClick={() => setLightboxIndex(index)}
                style={{ cursor: "pointer" }}
              >
                <div className="card_image_wrapper">
                  <img
                    src={img.url}
                    alt={`Item ${index}`}
                    className="card_image"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
            {images.length === 0 && (
              <div className="text-center w-100 py-5 text-muted">
                No images in this collection yet.
              </div>
            )}
          </div>
        </div>

        {/* Lightbox Overlay */}
        {lightboxIndex !== null && (
          <div className="lightbox_overlay">
            <button className="lightbox_close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            <button
              className="lightbox_nav prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <FaChevronLeft />
            </button>

            <div className="lightbox_content">
              <img
                src={images[lightboxIndex].url}
                alt={`Full screen ${lightboxIndex}`}
                className="lightbox_image"
              />
              <div className="lightbox_counter">
                {lightboxIndex + 1} / {images.length}
              </div>
            </div>

            <button
              className="lightbox_nav next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render Main Gallery View (List of Folders)
  return (
    <div className="gallery_page_container">
      {/* Header */}
      <header className="gallery_header">
        <div className="container">
          <h1>{eventName}</h1>
          <p>{eventDate}</p>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="gallery_grid_container">
        <div className="gallery_grid">
          {collectionNames.map((name, index) => {
            const images = collections[name];
            const coverImage = images && images.length > 0 ? images[0].url : "";

            return (
              <div
                key={index}
                className="collection_card"
                onClick={() => setSelectedCollection(name)}
                style={{ cursor: "pointer" }}
              >
                <div className="card_image_wrapper">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={name}
                      className="card_image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                      <span className="text-muted">No Image</span>
                    </div>
                  )}
                </div>
                <div className="card_content">
                  <h3 className="collection_title">{name}</h3>
                  <span className="text-muted small">
                    {images?.length || 0} items
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {collectionNames.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">No collections found in this gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovmentPlusGallery;
