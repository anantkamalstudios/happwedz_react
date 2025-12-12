import React from "react";
import { useSelector } from "react-redux";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SocialDetails({
  formData,
  setFormData,
  onSave,
  onShowSuccess,
}) {
  const { vendor } = useSelector((state) => state.vendorAuth || {});

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...(prev?.attributes || {}), [name]: value },
    }));
  };

  const getValue = (key) => {
    // Prefer formData (user edits), then vendor (saved data), then empty
    return formData?.attributes?.[key] || vendor?.[key] || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSave) await onSave();
    if (onShowSuccess) onShowSuccess();
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Add Your Professional Links</h4>
      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Facebook */}
        <div className="col-md-6">
          <label className="form-label fs-16">Facebook</label>
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <FaFacebookF />
            </span>
            <input
              type="url"
              className="form-control fs-14"
              placeholder="https://facebook.com/yourpage"
              value={getValue("facebook_link")}
              onChange={(e) => handleChange("facebook_link", e.target.value)}
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="col-md-6">
          <label className="form-label fs-16">Instagram</label>
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <FaInstagram />
            </span>
            <input
              type="url"
              className="form-control fs-14"
              placeholder="https://instagram.com/yourprofile"
              value={getValue("instagram_link")}
              onChange={(e) => handleChange("instagram_link", e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label fs-16">Website</label>
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <i className="fa-solid fa-globe"></i>
            </span>
            <input
              type="url"
              className="form-control fs-14"
              placeholder="https://yourwebsite.com"
              value={getValue("website")}
              onChange={(e) => handleChange("website", e.target.value)}
            />
          </div>
        </div>

        {/* X (Twitter) */}
        <div className="col-md-6">
          <label className="form-label fs-16">X (Twitter)</label>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white">
              <FaXTwitter />
            </span>
            <input
              type="url"
              className="form-control fs-14"
              placeholder="https://x.com/yourhandle"
              value={getValue("twitter_link")}
              onChange={(e) => handleChange("twitter_link", e.target.value)}
            />
          </div>
        </div>

        {/* Pinterest */}
        <div className="col-md-6">
          <label className="form-label fs-16">Pinterest</label>
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <FaPinterestP />
            </span>
            <input
              type="url"
              className="form-control fs-14"
              placeholder="https://pinterest.com/yourprofile"
              value={getValue("pinterest_link")}
              onChange={(e) => handleChange("pinterest_link", e.target.value)}
            />
          </div>
        </div>

        {/* Save button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn fs-14"
            style={{
              backgroundColor: "#e83e8c",
              color: "white",
              border: "none",
            }}
          >
            Save Links
          </button>
        </div>
      </form>
    </div>
  );
}
