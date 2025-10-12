import React, { useEffect } from "react";
import { useState, useRef, useCallback } from "react";
import { FiX } from "react-icons/fi";

const VideoGallery = ({ videos = [], onVideosChange }) => {
  const [localVideos, setLocalVideos] = useState(videos);
  const [newVideoUrl, setNewVideoUrl] = useState("");

  const handleAddUrl = () => {
    if (newVideoUrl.trim()) {
      const newVideo = {
        id: Math.random().toString(36).substr(2, 9),
        url: newVideoUrl.trim(),
        preview: newVideoUrl.trim(),
        title: "",
        type: "video",
        file: null,
      };
      const updatedVideos = [...localVideos, newVideo];
      setLocalVideos(updatedVideos);
      // Immediately notify parent so backend can store the url
      if (onVideosChange) {
        // Only send id, url, title, type (no preview/file)
        onVideosChange(
          updatedVideos.map(({ id, url, title, type }) => ({
            id,
            url,
            title,
            type,
          }))
        );
      }
      setNewVideoUrl("");
    }
  };

  const handleTitleChange = (id, value) => {
    setLocalVideos((prev) =>
      prev.map((img) => (img.id === id ? { ...img, title: value } : img))
    );
  };

  const handleRemoveVideo = (id) => {
    const updatedVideos = localVideos.filter((img) => img.id !== id);
    setLocalVideos(updatedVideos);
    // Immediately notify parent so backend stays in sync
    if (onVideosChange) {
      onVideosChange(
        updatedVideos.map(({ id, url, title, type }) => ({
          id,
          url,
          title,
          type,
        }))
      );
    }
  };

  // Sync down from parent when prop changes
  useEffect(() => {
    // Accept both uploaded videos (with preview) and videos with a URL (from backend)
    if (Array.isArray(videos)) {
      const normalized = videos.map((v) => {
        // If the video has a preview (local upload), keep as is
        if (v.preview) return v;
        // If the video has a url/path (from backend), show as preview
        if (v.url || v.path) {
          return {
            ...v,
            preview: v.url || v.path,
            id: v.id || Math.random().toString(36).substr(2, 9),
            type: v.type || "video",
            title: v.title || "",
            file: null,
          };
        }
        return v;
      });
      setLocalVideos(normalized);
    } else {
      setLocalVideos([]);
    }
  }, [videos]);

  // Notify parent on change
  useEffect(() => {
    if (onVideosChange) {
      // Only send id, url, title, type (no preview/file)
      onVideosChange(
        localVideos.map(({ id, url, title, type }) => ({
          id,
          url,
          title,
          type,
        }))
      );
    }
  }, [localVideos, onVideosChange]);

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h3 className="mb-4 text-center text-gradient">
            <span className="primary-text">
              Upload your best videos to showcase your work
            </span>
          </h3>

          {/* URL Input Section */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Add Video by URL</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Paste video URL (MP4, WebM, etc.)"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleAddUrl}
                disabled={!newVideoUrl.trim()}
              >
                Add
              </button>
            </div>
            <div className="form-text">
              Only direct video URLs (MP4, WebM, etc.) are supported.
            </div>
          </div>

          {/* Preview Section */}
          {localVideos.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-4">Preview Videos</h4>
              <div className="row g-4">
                {localVideos.map((video) => (
                  <div key={video.id} className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="position-relative">
                        <video
                          src={video.preview || video.url || video.path}
                          className="card-img-top object-fit-cover"
                          style={{ height: "150px" }}
                          controls
                        />
                        <button
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                          onClick={() => handleRemoveVideo(video.id)}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      <div className="card-body">
                        <input
                          type="text"
                          className="form-control border-0 border-bottom rounded-0 px-0"
                          placeholder="Video title"
                          value={video.title}
                          onChange={(e) =>
                            handleTitleChange(video.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;
