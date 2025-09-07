import React, { useState } from "react";

const VendorMedia = () => {
  const [formData, setFormData] = useState({
    media: {
      coverImage: "",
      gallery: [],
      video: { type: "", url: "", thumbnail: "" },
      view360: { type: "", embedCode: "", panoImage: "", modelUrl: "" },
      brochurePdf: "",
    },
  });

  const handleFileUpload = (field, file) => {
    if (!file) return;

    // Create a preview URL for images
    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    switch (field) {
      case "coverImage":
        setFormData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            coverImage: file,
            coverImagePreview: previewUrl,
          },
        }));
        break;

      case "videoFile":
        setFormData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            video: {
              ...prev.media.video,
              file: file,
            },
          },
        }));
        break;

      case "videoThumbnail":
        setFormData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            video: {
              ...prev.media.video,
              thumbnail: file,
              thumbnailPreview: previewUrl,
            },
          },
        }));
        break;

      case "brochurePdf":
        setFormData((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            brochurePdf: file,
          },
        }));
        break;

      default:
        break;
    }
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

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Media & Gallery</h6>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Cover Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("coverImage", e.target.files[0])
              }
            />
            {formData.media.coverImage && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {formData.media.coverImage.name}
                </small>
              </div>
            )}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Video File</label>
            <input
              type="file"
              className="form-control"
              accept="video/*"
              onChange={(e) => handleFileUpload("videoFile", e.target.files[0])}
            />
            {formData.media.video.file && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {formData.media.video.file.name}
                </small>
              </div>
            )}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Video Thumbnail</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                handleFileUpload("videoThumbnail", e.target.files[0])
              }
            />
            {formData.media.video.thumbnail && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {formData.media.video.thumbnail.name}
                </small>
              </div>
            )}
          </div>

          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Brochure PDF</label>
            <input
              type="file"
              className="form-control"
              accept=".pdf"
              onChange={(e) =>
                handleFileUpload("brochurePdf", e.target.files[0])
              }
            />
            {formData.media.brochurePdf && (
              <div className="mt-2">
                <small className="text-muted">
                  Selected: {formData.media.brochurePdf.name}
                </small>
              </div>
            )}
          </div>
        </div>

        <button className="btn btn-primary mt-2">Save Media Details</button>
      </div>
    </div>
  );
};

export default VendorMedia;
