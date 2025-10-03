import React, { useEffect, useState } from "react";
import axios from "axios";
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

const RealWeddingForm = ({ user, token }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [vendorTypes, setVendorTypes] = useState([]);
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

  const handleReplaceItem = (field, index, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? newValue : item)),
    }));
  };

  const handleFilesAdd = (field, files) => {
    setFormData((prev) => {
      if (field === "coverPhoto") {
        return { ...prev, coverPhoto: files[0] || null };
      }
      const filesArray = Array.from(files).filter(Boolean);
      return { ...prev, [field]: [...prev[field], ...filesArray] };
    });
  };

  const handleRemoveFile = (field, index = null) => {
    setFormData((prev) => {
      if (field === "coverPhoto") {
        return { ...prev, coverPhoto: null };
      }
      const next = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: next };
    });
  };

  useEffect(() => {
    const loadVendorTypes = async () => {
      try {
        const res = await axios.get("https://happywedz.com/api/vendor-types");
        setVendorTypes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // do not block form if vendor types fail
        console.error("Failed to load vendor types", err);
      }
    };
    loadVendorTypes();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();

    // Append all fields from formData to FormData object
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === "highlightPhotos" || key === "allPhotos") {
        // Append photos individually as files
        (value || []).forEach((file) => {
          if (file instanceof File) data.append(key, file);
        });
        return;
      }
      if (key === "coverPhoto") {
        if (value instanceof File) data.append("coverPhoto", value);
        return;
      }
      if (Array.isArray(value)) {
        // Send non-file arrays as single JSON strings (backend-friendly)
        data.append(key, JSON.stringify(value));
        return;
      }
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    // Force status to pending on Submit for Approval
    data.set("status", "pending");

    try {
      const response = await axios.post("https://happywedz.com/api/realwedding", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Your wedding story has been submitted successfully!"); 
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting the form.");
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate step component
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
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
            vendorTypes={vendorTypes}
          />
        );
      case 5:
        return (
          <GalleryStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleFilesAdd={handleFilesAdd}
            handleRemoveFile={handleRemoveFile}
          />
        );
      case 6:
        return (
          <HighlightsStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
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
              className={`step ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""
                }`}
            >
              <div className="step-icon">{index + 1}</div>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Prevent accidental submit when pressing Enter in inputs
            const tag = e.target.tagName.toLowerCase();
            const type = e.target.getAttribute("type");
            const isSubmit = type === "submit";
            if (!isSubmit && (tag === "input" || tag === "textarea" || tag === "select")) {
              e.preventDefault();
            }
          }
        }}>
          {/* Render current step */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

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
                  <button type="submit" className="btn-next" disabled={isLoading}>
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : "Submit for Approval"}
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
const BasicInfoStep = ({ formData, handleInputChange, handleArrayChange, handleRemoveItem }) => {
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
        <small className="text-muted">Press Enter to add venue</small>
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

// Small controlled creator for Events
const EventCreator = ({ onAdd }) => {
  const [local, setLocal] = useState({ name: "", date: "", venue: "", description: "" });
  const canAdd = local.name && local.date && local.venue;
  return (
    <div className="mb-3 p-3 border rounded">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            className="form-control"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canAdd) {
                e.preventDefault();
                onAdd({ ...local });
                setLocal({ name: "", date: "", venue: "", description: "" });
              }
            }}
            placeholder="e.g., Mehendi"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={local.date}
            onChange={(e) => setLocal({ ...local, date: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canAdd) {
                e.preventDefault();
                onAdd({ ...local });
                setLocal({ name: "", date: "", venue: "", description: "" });
              }
            }}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Venue</label>
          <input
            type="text"
            className="form-control"
            value={local.venue}
            onChange={(e) => setLocal({ ...local, venue: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canAdd) {
                e.preventDefault();
                onAdd({ ...local });
                setLocal({ name: "", date: "", venue: "", description: "" });
              }
            }}
            placeholder="e.g., City Palace"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description (optional)</label>
        <textarea
          className="form-control"
          rows="2"
          value={local.description}
          onChange={(e) => setLocal({ ...local, description: e.target.value })}
          placeholder="Brief details about this event"
        ></textarea>
      </div>
      <button
        type="button"
        className="add-item-btn"
        onClick={() => {
          if (canAdd) {
            onAdd({ ...local });
            setLocal({ name: "", date: "", venue: "", description: "" });
          }
        }}
        disabled={!canAdd}
      >
        <FiPlus /> Add Event
      </button>
    </div>
  );
};

// Small controlled creator for Vendors
const VendorCreator = ({ vendorTypes = [], onAdd }) => {
  const [local, setLocal] = useState({ typeId: "", type: "", name: "" });
  useEffect(() => {
    if (local.typeId && vendorTypes?.length) {
      const found = vendorTypes.find((v) => String(v.id) === String(local.typeId));
      setLocal((prev) => ({ ...prev, type: found?.name || prev.type }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.typeId]);

  const canAdd = local.type && local.name;

  return (
    <div className="mb-3 p-3 border rounded">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Vendor Type</label>
          <select
            className="form-control"
            value={local.typeId}
            onChange={(e) => setLocal({ ...local, typeId: e.target.value })}
          >
            <option value="">Select type</option>
            {vendorTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Vendor Name</label>
          <input
            type="text"
            className="form-control"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
            placeholder="e.g., DreamWed Planners"
          />
        </div>
      </div>
      <button
        type="button"
        className="add-item-btn"
        onClick={() => {
          if (canAdd) {
            onAdd({ name: local.name, type: local.type });
            setLocal({ typeId: "", type: "", name: "" });
          }
        }}
        disabled={!canAdd}
      >
        <FiPlus /> Add Vendor
      </button>
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

        <EventCreator onAdd={(ev) => handleArrayChange("events", ev)} />

        {formData.events.length > 0 && (
          <div className="mt-3">
            {formData.events.map((event, index) => (
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
                {event.description && (
                  <p className="mb-0">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VendorsStep = ({ formData, handleArrayChange, handleRemoveItem, vendorTypes }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiUser /> Vendors
      </h2>

      <div className="form-group">
        <label className="form-label">Add Your Wedding Vendors</label>

        <VendorCreator vendorTypes={vendorTypes} onAdd={(v) => handleArrayChange("vendors", v)} />

        {formData.vendors.length > 0 && (
          <div className="mt-3">
            {formData.vendors.map((vendor, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryStep = ({ formData, handleInputChange, handleFilesAdd, handleRemoveFile }) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiImage /> Gallery
      </h2>

      <div className="form-group">
        <label className="form-label">Cover Photo</label>
        <div
          className="upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
              handleFilesAdd("coverPhoto", e.dataTransfer.files);
            }
          }}
        >
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
              if (e.target.files && e.target.files.length) {
                handleFilesAdd("coverPhoto", e.target.files);
              }
            }}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>
        {formData.coverPhoto && (
          <div className="mt-2">
            <div className="d-flex align-items-center gap-2">
              <img
                src={URL.createObjectURL(formData.coverPhoto)}
                alt="Cover"
                style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6 }}
              />
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveFile("coverPhoto")}>
                <FiX />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Highlight Photos</label>
        <div
          className="upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
              handleFilesAdd("highlightPhotos", e.dataTransfer.files);
            }
          }}
        >
          <div className="upload-icon">
            <FiUpload />
          </div>
          <p className="upload-text">
            Drag & drop your highlight photos here or click to browse
          </p>
          <p className="upload-hint">Select 5-10 of your best photos</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length) {
                handleFilesAdd("highlightPhotos", e.target.files);
              }
            }}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>
        {formData.highlightPhotos?.length > 0 && (
          <div className="mt-2 d-flex flex-wrap gap-2">
            {formData.highlightPhotos.map((file, idx) => (
              <div key={idx} className="position-relative" style={{ width: 100 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Highlight ${idx + 1}`}
                  style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  style={{ position: "absolute", top: -8, right: -8 }}
                  onClick={() => handleRemoveFile("highlightPhotos", idx)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">All Wedding Photos</label>
        <div
          className="upload-area"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
              handleFilesAdd("allPhotos", e.dataTransfer.files);
            }
          }}
        >
          <div className="upload-icon">
            <FiUpload />
          </div>
          <p className="upload-text">
            Drag & drop all your wedding photos here or click to browse
          </p>
          <p className="upload-hint">You can upload up to 100 photos</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length) {
                handleFilesAdd("allPhotos", e.target.files);
              }
            }}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>
        {formData.allPhotos?.length > 0 && (
          <div className="mt-2 d-flex flex-wrap gap-2">
            {formData.allPhotos.map((file, idx) => (
              <div key={idx} className="position-relative" style={{ width: 100 }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`All ${idx + 1}`}
                  style={{ width: 100, height: 80, objectFit: "cover", borderRadius: 6 }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  style={{ position: "absolute", top: -8, right: -8 }}
                  onClick={() => handleRemoveFile("allPhotos", idx)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const HighlightsStep = ({ formData, handleInputChange, handleArrayChange, handleRemoveItem }) => {
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
        <small className="text-muted">Press Enter to add theme</small>
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
