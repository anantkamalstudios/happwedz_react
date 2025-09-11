import React, { useState } from "react";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiUpload,
  FiImage,
  FiEdit3,
  FiPlus,
  FiX,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";

const RealWeddingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    slug: "",
    weddingDate: "",
    city: "",
    venues: [],

    // Couple Info
    brideName: "",
    brideBio: "",
    groomName: "",
    groomBio: "",

    // Wedding Story
    story: "",

    // Events
    events: [],

    // Vendors
    vendors: [],

    // Gallery
    coverPhoto: null,
    highlightPhotos: [],
    allPhotos: [],

    // Highlights
    themes: [],
    brideOutfit: "",
    groomOutfit: "",
    specialMoments: "",

    // Credits
    photographer: "",
    makeup: "",
    decor: "",
    additionalCredits: [],

    // Publish
    status: "draft",
    featured: false,
  });

  const steps = [
    "Basic Info",
    "Couple",
    "Wedding Story",
    "Events",
    "Vendors",
    "Gallery",
    "Highlights",
    "Credits & Publish",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], value],
    }));
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log("Form submitted:", formData);
  };

  // Render the appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <CoupleInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <WeddingStoryStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <EventsStep
            formData={formData}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
          />
        );
      case 4:
        return (
          <VendorsStep
            formData={formData}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
          />
        );
      case 5:
        return (
          <GalleryStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <HighlightsStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 7:
        return (
          <CreditsPublishStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      default:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
    }
  };

  return (
    <div className="user-dashboard-wedding-submission-form">
      <div className="form-container">
        <div className="form-header">
          <h1 className="form-title">Share Your Wedding Story</h1>
          <p>Inspire thousands of couples with your special day</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${index === currentStep ? "active" : ""} ${
                index < currentStep ? "completed" : ""
              }`}
            >
              <div className="step-icon">{index + 1}</div>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Render current step */}
          {renderStep()}

          {/* Form Footer with Navigation */}
          <div className="form-footer">
            <div className="footer-buttons">
              {currentStep > 0 ? (
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <FiChevronLeft /> Previous
                </button>
              ) : (
                <div></div>
              )}

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" className="btn-draft">
                  Save Draft
                </button>

                {currentStep < steps.length - 1 ? (
                  <button type="button" className="btn-next" onClick={nextStep}>
                    Next <FiChevronRight />
                  </button>
                ) : (
                  <button type="submit" className="btn-next">
                    Submit for Approval
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Step Components
const BasicInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiCalendar /> Basic Information
      </h2>

      <div className="form-group">
        <label className="form-label">Wedding Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="e.g., Emma and James' Romantic Beach Wedding"
        />
      </div>

      <div className="form-group">
        <label className="form-label">URL Slug</label>
        <input
          type="text"
          className="form-control"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          placeholder="e.g., emma-james-beach-wedding"
        />
        <small className="text-muted">
          This will be used for the wedding story URL
        </small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Wedding Date</label>
          <input
            type="date"
            className="form-control"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">City</label>
          <select
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          >
            <option value="">Select a city</option>
            <option value="bali">Bali, Indonesia</option>
            <option value="paris">Paris, France</option>
            <option value="tuscany">Tuscany, Italy</option>
            <option value="santorini">Santorini, Greece</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Venues</label>
        <input
          type="text"
          className="form-control"
          placeholder="Add a venue and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.target.value.trim()) {
                handleArrayChange("venues", e.target.value.trim());
                e.target.value = "";
              }
            }
          }}
        />

        <div className="chips-container">
          {formData.venues.map((venue, index) => (
            <div key={index} className="chip">
              {venue}
              <span
                className="chip-remove"
                onClick={() => handleRemoveItem("venues", index)}
              >
                <FiX />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CoupleInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiUser /> Couple Information
      </h2>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Bride's Name</label>
          <input
            type="text"
            className="form-control"
            name="brideName"
            value={formData.brideName}
            onChange={handleInputChange}
            placeholder="e.g., Emma Smith"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Groom's Name</label>
          <input
            type="text"
            className="form-control"
            name="groomName"
            value={formData.groomName}
            onChange={handleInputChange}
            placeholder="e.g., James Wilson"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Bride's Bio</label>
        <textarea
          className="form-control"
          name="brideBio"
          value={formData.brideBio}
          onChange={handleInputChange}
          rows="4"
          placeholder="Tell us about the bride..."
        ></textarea>
      </div>

      <div className="form-group">
        <label className="form-label">Groom's Bio</label>
        <textarea
          className="form-control"
          name="groomBio"
          value={formData.groomBio}
          onChange={handleInputChange}
          rows="4"
          placeholder="Tell us about the groom..."
        ></textarea>
      </div>
    </div>
  );
};

const WeddingStoryStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiEdit3 /> Wedding Story
      </h2>

      <div className="form-group">
        <label className="form-label">Your Wedding Story</label>
        <textarea
          className="form-control"
          name="story"
          value={formData.story}
          onChange={handleInputChange}
          rows="10"
          placeholder="Share the beautiful story of your special day..."
        ></textarea>
        <div className="text-right mt-2">
          <small className="text-muted">{formData.story.length} words</small>
        </div>
      </div>
    </div>
  );
};

const EventsStep = ({ formData, handleArrayChange, handleRemoveItem }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiCalendar /> Wedding Events
      </h2>

      <div className="form-group">
        <label className="form-label">Add Wedding Events</label>

        {formData.events.length > 0 &&
          formData.events.map((event, index) => (
            <div key={index} className="event-card mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">{event.name || `Event ${index + 1}`}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveItem("events", index)}
                >
                  <FiX />
                </button>
              </div>
              <p className="mb-1">
                <strong>Date:</strong> {event.date}
              </p>
              <p className="mb-1">
                <strong>Venue:</strong> {event.venue}
              </p>
              <p className="mb-0">{event.description}</p>
            </div>
          ))}

        <button type="button" className="add-item-btn">
          <FiPlus /> Add Event
        </button>
      </div>
    </div>
  );
};

const VendorsStep = ({ formData, handleArrayChange, handleRemoveItem }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiUser /> Vendors
      </h2>

      <div className="form-group">
        <label className="form-label">Add Your Wedding Vendors</label>

        {formData.vendors.length > 0 &&
          formData.vendors.map((vendor, index) => (
            <div key={index} className="vendor-card mb-3 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">
                  {vendor.category}: {vendor.name}
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveItem("vendors", index)}
                >
                  <FiX />
                </button>
              </div>
            </div>
          ))}

        <button type="button" className="add-item-btn">
          <FiPlus /> Add Vendor
        </button>
      </div>
    </div>
  );
};

const GalleryStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiImage /> Gallery
      </h2>

      <div className="form-group">
        <label className="form-label">Cover Photo</label>
        <div className="upload-area">
          <div className="upload-icon">
            <FiUpload />
          </div>
          <p className="upload-text">
            Drag & drop your cover photo here or click to browse
          </p>
          <p className="upload-hint">Recommended size: 1200x800 pixels</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleInputChange({
                  target: {
                    name: "coverPhoto",
                    value: e.target.files[0],
                    type: "file",
                  },
                });
              }
            }}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Highlight Photos</label>
        <div className="upload-area">
          <div className="upload-icon">
            <FiUpload />
          </div>
          <p className="upload-text">
            Drag & drop your highlight photos here or click to browse
          </p>
          <p className="upload-hint">Select 5-10 of your best photos</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">All Wedding Photos</label>
        <div className="upload-area">
          <div className="upload-icon">
            <FiUpload />
          </div>
          <p className="upload-text">
            Drag & drop all your wedding photos here or click to browse
          </p>
          <p className="upload-hint">You can upload up to 100 photos</p>
        </div>
      </div>
    </div>
  );
};

const HighlightsStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiImage /> Highlights
      </h2>

      <div className="form-group">
        <label className="form-label">Wedding Themes</label>
        <input
          type="text"
          className="form-control"
          placeholder="Add a theme and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.target.value.trim()) {
                handleArrayChange("themes", e.target.value.trim());
                e.target.value = "";
              }
            }
          }}
        />

        <div className="chips-container">
          {formData.themes.map((theme, index) => (
            <div key={index} className="chip">
              {theme}
              <span
                className="chip-remove"
                onClick={() => handleRemoveItem("themes", index)}
              >
                <FiX />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Bride's Outfit</label>
          <input
            type="text"
            className="form-control"
            name="brideOutfit"
            value={formData.brideOutfit}
            onChange={handleInputChange}
            placeholder="Describe the bride's outfit"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Groom's Outfit</label>
          <input
            type="text"
            className="form-control"
            name="groomOutfit"
            value={formData.groomOutfit}
            onChange={handleInputChange}
            placeholder="Describe the groom's outfit"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Special Moments</label>
        <textarea
          className="form-control"
          name="specialMoments"
          value={formData.specialMoments}
          onChange={handleInputChange}
          rows="4"
          placeholder="Share the most memorable moments from your wedding..."
        ></textarea>
      </div>
    </div>
  );
};

const CreditsPublishStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiUser /> Credits & Publish
      </h2>

      <div className="form-group">
        <label className="form-label">Photographer</label>
        <input
          type="text"
          className="form-control"
          name="photographer"
          value={formData.photographer}
          onChange={handleInputChange}
          placeholder="Photographer's name or business"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Makeup Artist</label>
          <input
            type="text"
            className="form-control"
            name="makeup"
            value={formData.makeup}
            onChange={handleInputChange}
            placeholder="Makeup artist's name or business"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Decor & Floral</label>
          <input
            type="text"
            className="form-control"
            name="decor"
            value={formData.decor}
            onChange={handleInputChange}
            placeholder="Decorator's name or business"
          />
        </div>
      </div>

      <div className="form-divider"></div>

      <div className="form-group">
        <label className="form-label d-block">Featured Wedding</label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
          />
          <span className="toggle-slider"></span>
        </label>
        <small className="text-muted d-block mt-1">
          Feature this wedding on the homepage and category pages
        </small>
      </div>
    </div>
  );
};

export default RealWeddingForm;
