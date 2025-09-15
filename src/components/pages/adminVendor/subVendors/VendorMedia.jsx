import React from "react";

const VendorMedia = ({ formData, setFormData }) => {
  const media = formData.media || {
    coverImage: "",
    gallery: [],
    video: { type: "", url: "", thumbnail: "" },
    view360: { type: "", embedCode: "", panoImage: "", modelUrl: "" },
    brochurePdf: "",
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (subSection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        [subSection]: {
          ...prev.media[subSection],
          [field]: value,
        },
      },
    }));
  };

  // Add URL to gallery array
  const handleAddUrl = () => {
    if (formData.mediaUrl && formData.mediaUrl.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          gallery: [...(prev.media.gallery || []), prev.mediaUrl],
        },
        mediaUrl: "",
      }));
    }
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Media & Gallery (URLs Only)</h6>
        <div className="row">
          {/* Cover Image URL */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Cover Image URL</label>
            <input
              type="url"
              className="form-control"
              value={
                typeof media.coverImage === "string" ? media.coverImage : ""
              }
              onChange={(e) => handleInputChange("coverImage", e.target.value)}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          {/* Video URL */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Video URL</label>
            <input
              type="url"
              className="form-control"
              value={media.video?.url || ""}
              onChange={(e) =>
                handleNestedInputChange("video", "url", e.target.value)
              }
              placeholder="https://example.com/video.mp4"
            />
          </div>

          {/* Video Thumbnail URL */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">
              Video Thumbnail URL
            </label>
            <input
              type="url"
              className="form-control"
              value={
                typeof media.video?.url === "string" ? media.video.url : ""
              }
              onChange={(e) =>
                handleNestedInputChange("video", "url", e.target.value)
              }
              placeholder="https://example.com/video.mp4"
            />
          </div>

          {/* Brochure PDF URL */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Brochure PDF URL</label>
            <input
              type="url"
              className="form-control"
              value={
                typeof media.brochurePdf === "string" ? media.brochurePdf : ""
              }
              onChange={(e) => handleInputChange("brochurePdf", e.target.value)}
              placeholder="https://example.com/brochure.pdf"
            />
          </div>

          {/* Gallery List */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Gallery URLs</label>
            <ul>
              {(media.gallery || []).map((url, idx) => (
                <li key={idx}>{url}</li>
              ))}
            </ul>
          </div>
        </div>

        <button className="btn btn-primary mt-2">Save Media Details</button>
      </div>
    </div>
  );
};

export default VendorMedia;
