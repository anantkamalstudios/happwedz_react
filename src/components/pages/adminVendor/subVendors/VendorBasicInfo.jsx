import React, { useState } from "react";

const VendorBasicInfo = () => {
  const [formData, setFormData] = useState({
    status: "draft",
    vendorType: "venue",
    name: "",
    slug: "",
    tagline: "",
    subtitle: "",
    description: "",
  });

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Basic Information</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Vendor Name *</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter vendor name"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Slug</label>
            <input
              type="text"
              className="form-control"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="vendor-name-slug"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Tagline</label>
            <input
              type="text"
              className="form-control"
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="Short catchy tagline"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Subtitle</label>
            <input
              type="text"
              className="form-control"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              placeholder="Brief subtitle"
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of your business"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Vendor Type</label>
            <select
              className="form-select"
              value={formData.vendorType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, vendorType: e.target.value }))
              }
            >
              <option value="venue">Venue</option>
              <option value="caterer">Caterer</option>
              <option value="photographer">Photographer</option>
              <option value="decorator">Decorator</option>
              <option value="dj">DJ</option>
              <option value="makeup">Makeup Artist</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-2">Save Basic Info</button>
      </div>
    </div>
  );
};

export default VendorBasicInfo;
