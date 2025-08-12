import React from "react";
import { useState, useRef, useCallback } from "react";
import { FiX } from "react-icons/fi";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  const processFiles = useCallback(
    (files) => {
      const newFiles = files
        .filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/")
        )
        .slice(0, 8 - videos.length)
        .map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          title: "",
          type: file.type.startsWith("video/") ? "video" : "image",
        }));

      setVideos((prev) => [...prev, ...newFiles]);
    },
    [videos]
  );

  const handleTitleChange = (id, value) => {
    setVideos((prev) =>
      prev.map((img) => (img.id === id ? { ...img, title: value } : img))
    );
  };

  const handleRemoveVideo = (id) => {
    setVideos((prev) => prev.filter((img) => img.id !== id));
  };

  // Clean up object URLs
  React.useEffect(() => {
    return () => {
      videos.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [videos]);

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <h3 className="mb-4 text-center text-gradient">
            <span className="text-primary">
              Upload your best videos to showcase your work
            </span>
          </h3>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-4 p-5 text-center ${
              isDragging ? "border-primary bg-blue-10" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleVideoDrop}
          >
            <svg
              width="152px"
              height="152px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M19.5617 7C19.7904 5.69523 18.7863 4.5 17.4617 4.5H6.53788C5.21323 4.5 4.20922 5.69523 4.43784 7"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></path>{" "}
                <path
                  d="M17.4999 4.5C17.5283 4.24092 17.5425 4.11135 17.5427 4.00435C17.545 2.98072 16.7739 2.12064 15.7561 2.01142C15.6497 2 15.5194 2 15.2588 2H8.74099C8.48035 2 8.35002 2 8.24362 2.01142C7.22584 2.12064 6.45481 2.98072 6.45704 4.00434C6.45727 4.11135 6.47146 4.2409 6.49983 4.5"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></path>{" "}
                <path
                  d="M21.1935 16.793C20.8437 19.2739 20.6689 20.5143 19.7717 21.2572C18.8745 22 17.5512 22 14.9046 22H9.09536C6.44881 22 5.12553 22 4.22834 21.2572C3.33115 20.5143 3.15626 19.2739 2.80648 16.793L2.38351 13.793C1.93748 10.6294 1.71447 9.04765 2.66232 8.02383C3.61017 7 5.29758 7 8.67239 7H15.3276C18.7024 7 20.3898 7 21.3377 8.02383C22.0865 8.83268 22.1045 9.98979 21.8592 12"
                  stroke="#1C274C"
                  stroke-width="1.5"
                  stroke-linecap="round"
                ></path>{" "}
                <path
                  d="M14.5812 13.6159C15.1396 13.9621 15.1396 14.8582 14.5812 15.2044L11.2096 17.2945C10.6669 17.6309 10 17.1931 10 16.5003L10 12.32C10 11.6273 10.6669 11.1894 11.2096 11.5258L14.5812 13.6159Z"
                  stroke="#1C274C"
                  stroke-width="1.5"
                ></path>{" "}
              </g>
            </svg>
            <h5 className="mb-2">Drag & Drop videos here</h5>
            <p className="text-muted mb-3">or</p>

            <button
              className="btn btn-primary px-4 rounded-pill fw-medium"
              onClick={handleButtonClick}
              disabled={videos.length >= 4}
            >
              Browse Files
            </button>
            <p className="small text-muted mt-2 mb-0">
              MP4, WebM up to 50MB (Max 4 videos)
            </p>

            {videos.length >= 4 && (
              <div className="mt-3 text-danger">
                Maximum of 4 videos reached
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="video/mp4,video/webm"
            onChange={handleFileChange}
            className="d-none"
          />

          {/* Preview Section */}
          {videos.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-4">Preview Videos</h4>
              <div className="row g-4">
                {videos.map((video) => (
                  <div key={video.id} className="col-md-3 col-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="position-relative">
                        <video
                          src={video.preview}
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
