import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../services/api/axiosInstance";
import {
  FiImage,
  FiVideo,
  FiFolder,
  FiClock,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiSearch,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "./tokens-sharing.css"; // Reuse existing styles

const Galleries = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/media/");
      if (response.data.success) {
        setMediaItems(response.data.media);
      } else {
        setError("Failed to load galleries");
      }
    } catch (err) {
      console.error("Error fetching media:", err);
      setError("Failed to fetch media galleries");
    } finally {
      setLoading(false);
    }
  };

  const getS3Url = (s3Key) => {
    return `https://happywedz-s3-bucket.s3.ap-south-1.amazonaws.com/${s3Key}`;
  };

  const handleCopyUrl = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const formatFileSize = (mb) => {
    return `${parseFloat(mb).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group media by collection
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

  if (loading) {
    return (
      <div className="tokens-container d-flex justify-content-center align-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tokens-container">
      {/* Header */}
      <div className="tokens-header">
        <div>
          <h1 className="page-title">Galleries</h1>
          <p className="page-subtitle">
            Manage your event collections and media files
          </p>
        </div>
        <div className="d-flex gap-3">
          <div
            className="email-input-wrapper d-flex align-items-center p-2"
            style={{ minHeight: "auto", height: "45px" }}
          >
            <FiSearch className="text-muted me-2" />
            <input
              type="text"
              placeholder="Search..."
              className="email-input p-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Collection Filters */}
      <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
        {collections.map((collection) => (
          <button
            key={collection}
            className={`btn ${
              selectedCollection === collection
                ? "btn-primary"
                : "btn-secondary"
            }`}
            onClick={() => setSelectedCollection(collection)}
            style={{ whiteSpace: "nowrap" }}
          >
            <FiFolder size={16} />
            {collection}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="row g-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="table-card h-100 d-flex flex-column transition-hover">
                <div
                  className="position-relative"
                  style={{ paddingTop: "75%" }}
                >
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center overflow-hidden">
                    {item.s3_key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={getS3Url(item.s3_key)}
                        alt={`Media ${item.id}`}
                        className="w-100 h-100 object-fit-cover transition-transform"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/300?text=Image+Error";
                        }}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <FiVideo size={48} className="mb-2" />
                        <p className="small m-0">Video File</p>
                      </div>
                    )}
                  </div>
                  <div className="position-absolute top-0 end-0 p-2">
                    <span
                      className={`badge ${
                        item.visibility === "public"
                          ? "badge-public"
                          : "badge-private"
                      }`}
                    >
                      {item.visibility === "public" ? (
                        <FiEye size={12} className="me-1" />
                      ) : (
                        <FiEyeOff size={12} className="me-1" />
                      )}
                      {item.visibility}
                    </span>
                  </div>
                </div>

                <div className="p-3 d-flex flex-column flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6
                      className="fw-bold mb-0 text-truncate"
                      title={item.collection}
                    >
                      {item.collection}
                    </h6>
                    <small className="text-muted bg-light px-2 py-1 rounded">
                      ID: {item.event_id}
                    </small>
                  </div>

                  <div className="mt-auto pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center small text-muted mb-2">
                      <span className="d-flex align-items-center gap-1">
                        <FiClock size={14} />
                        {formatDate(item.created_at)}
                      </span>
                      <span>{formatFileSize(item.file_size_mb)}</span>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <a
                        href={getS3Url(item.s3_key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                      >
                        <FiDownload size={14} /> View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <FiImage size={48} />
          <h3>No Media Found</h3>
          <p>No media files found for the selected collection.</p>
        </div>
      )}
    </div>
  );
};

export default Galleries;
