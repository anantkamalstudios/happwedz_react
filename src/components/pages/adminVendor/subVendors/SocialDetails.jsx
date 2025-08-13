import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaPinterestP,
} from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SocialDetails() {
  return (
    <div className="container mt-4">
      <h5 className="mb-3">Add Your Professional Links</h5>
      <form className="row g-3">
        {/* Facebook */}
        <div className="col-md-6">
          <label className="form-label">Facebook</label>
          <div className="input-group">
            <span className="input-group-text bg-primary text-white">
              <FaFacebookF />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="facebook.com/username"
            />
          </div>
        </div>

        {/* Instagram */}
        <div className="col-md-6">
          <label className="form-label">Instagram</label>
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <FaInstagram />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="instagram.com/username"
            />
          </div>
        </div>

        {/* X (Twitter) */}
        <div className="col-md-6">
          <label className="form-label">X (Twitter)</label>
          <div className="input-group">
            <span className="input-group-text bg-dark text-white">
              <FaXTwitter />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="x.com/username"
            />
          </div>
        </div>

        {/* Pinterest */}
        <div className="col-md-6">
          <label className="form-label">Pinterest</label>
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <FaPinterestP />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="pinterest.com/username"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn"
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
