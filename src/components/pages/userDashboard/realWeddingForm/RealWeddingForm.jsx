import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SummernoteEditor from "../../../ui/SummernoteEditor";

const RealWeddingForm = ({ user, token }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorTypes, setVendorTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("India");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    weddingDate: "",
    country: "India",
    city: "",
    cultures: "",
    venues: [],

    brideName: "",
    brideBio: "",
    groomName: "",
    groomBio: "",

    story: "",

    events: [],

    vendors: [],

    coverPhoto: null,
    highlightPhotos: [],
    allPhotos: [],

    themes: [],
    brideOutfit: "",
    groomOutfit: "",
    specialMoments: "",

    photographer: "",
    makeup: "",
    decor: "",
    additionalCredits: [],

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
    "Highlights & Credits",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (name === "title") {
        const slug = value
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
        return {
          ...prev,
          title: value,
          slug,
        };
      }
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      country: country,
      city: "",
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
        console.error("Failed to load vendor types", err);
      }
    };

    const loadCountries = async () => {
      try {
        const res = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/"
        );
        if (res.data && res.data.data) {
          setCountries(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load countries", err);
      }
    };

    const loadCultures = async () => {
      try {
        const res = await axios.get(
          "https://happywedz.com/api/real-wedding-culture/public"
        );
        if (res.data && res.data.cultures && Array.isArray(res.data.cultures)) {
          setCultures(res.data.cultures);
        } else if (Array.isArray(res.data)) {
          setCultures(res.data);
        } else {
          setCultures([]);
        }
      } catch (err) {
        console.error("Failed to load cultures", err);
      }
    };

    const loadDraft = () => {
      try {
        const savedDraft = localStorage.getItem("weddingFormDraft");
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          setFormData((prev) => ({ ...prev, ...draftData }));
        }
      } catch (err) {
        console.error("Error loading draft:", err);
      }
    };

    loadVendorTypes();
    loadCountries();
    loadCultures();
    loadDraft();
  }, []);

  const nextStep = () => {
    console.log(
      "Next clicked. Current step:",
      currentStep,
      "Total steps:",
      steps.length
    );
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      console.log("Moving to step:", currentStep + 1);
    } else {
      console.log("Already on last step, cannot go next");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    try {
      const draftData = {
        ...formData,
        coverPhoto: null,
        highlightPhotos: [],
        allPhotos: [],
      };
      localStorage.setItem("weddingFormDraft", JSON.stringify(draftData));
      Swal.fire({
        icon: "success",
        title: "Draft Saved",
        text: "Your progress has been saved!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error saving draft:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save draft",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Form submitted on step:", currentStep);

    if (currentStep !== steps.length - 1) {
      console.error(
        "Form submitted on wrong step! Current:",
        currentStep,
        "Expected:",
        steps.length - 1
      );
      Swal.fire({
        icon: "warning",
        title: "Please Complete All Steps",
        text: "Please navigate through all steps before submitting.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (key === "highlightPhotos" || key === "allPhotos") {
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
        data.append(key, JSON.stringify(value));
        return;
      }
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    data.set("status", "pending");

    try {
      const response = await axios.post(
        "https://happywedz.com/api/realwedding",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        title: "Success!",
        text: "Your wedding story has been submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting the form."
      );
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
            handleCountryChange={handleCountryChange}
            countries={countries}
            selectedCountry={selectedCountry}
            cultures={cultures}
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
          <HighlightsAndCreditsStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
          />
        );
      default:
        return (
          <BasicInfoStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleArrayChange={handleArrayChange}
            handleRemoveItem={handleRemoveItem}
            handleCountryChange={handleCountryChange}
            countries={countries}
            selectedCountry={selectedCountry}
            cultures={cultures}
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
        <form
          onSubmit={handleSubmit}
          onKeyPress={(e) => {
            if (e.key === "Enter" && e.target.type !== "submit") {
              e.preventDefault();
              return false;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const tag = e.target.tagName.toLowerCase();
              const type = e.target.getAttribute("type");
              const isSubmitButton = type === "submit";

              if (
                !isSubmitButton &&
                (tag === "input" || tag === "textarea" || tag === "select")
              ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }
          }}
        >
          {/* Render current step */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
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
                <button type="button" className="btn-draft" onClick={saveDraft}>
                  Save Draft
                </button>

                {currentStep < steps.length - 1 ? (
                  <button type="button" className="btn-next" onClick={nextStep}>
                    Next <FiChevronRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-next"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                  >
                    {isLoading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Submit for Approval"
                    )}
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

const VenueSearchInput = ({ onSelectVenue }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const performSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setLoadingSearch(true);
    try {
      const apiUrl = `https://happywedz.com/api/vendor-services?search=${encodeURIComponent(
        query
      )}&vendorType=Venues&limit=10`;

      const response = await axios.get(apiUrl);
      const results = response.data?.data || [];

      console.log("Venue search results:", results);
      console.log("Venue API URL:", apiUrl);

      setSearchResults(results);
      if (results.length > 0) {
        setShowResults(true);
      } else if (query.length >= 2) {
        setShowResults(true);
      }
    } catch (error) {
      console.error("Venue search error:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    } else if (value.length < 2) {
      setShowResults(false);
      setSearchResults([]);
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const handleSelectVenue = (venue) => {
    const venueName =
      venue.attributes?.vendor_name ||
      venue.vendor?.businessName ||
      venue.name ||
      "";
    if (venueName) {
      onSelectVenue(venueName);
      setSearchQuery("");
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        onSelectVenue(searchQuery.trim());
        setSearchQuery("");
        setShowResults(false);
        setSearchResults([]);
      }
    }
  };

  return (
    <div
      className="form-group"
      ref={searchRef}
      style={{ position: "relative" }}
    >
      <input
        type="text"
        className="form-control"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (searchQuery.length >= 2 && searchResults.length > 0) {
            setShowResults(true);
          }
        }}
        placeholder="Search venues or type and press Enter"
      />
      {showResults && searchQuery.length >= 2 && (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 mt-2"
          style={{
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          }}
        >
          {loadingSearch ? (
            <div className="p-4 text-center">
              <div
                className="spinner-border spinner-border-sm me-2"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span style={{ fontSize: "0.9rem" }}>Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleSelectVenue(result)}
                  className="d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer"
                  style={{
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  <div
                    className="flex-shrink-0 overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      width: "50px",
                      height: "50px",
                    }}
                  >
                    <img
                      src={
                        result.attributes?.image_url ||
                        result.media?.[0]?.url ||
                        "/images/imageNotFound.jpg"
                      }
                      alt={result.attributes?.vendor_name || "Venue"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/imageNotFound.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6
                      className="mb-1 fw-semibold"
                      style={{
                        fontSize: "0.9rem",
                        color: "#1f2937",
                      }}
                    >
                      {result.attributes?.vendor_name ||
                        result.vendor?.businessName ||
                        "Venue"}
                    </h6>
                    <p
                      className="mb-0"
                      style={{
                        fontSize: "0.85rem",
                        color: "#6b7280",
                      }}
                    >
                      {result.attributes?.city ||
                        result.vendor?.city ||
                        "Location"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p
                className="mb-0"
                style={{ fontSize: "0.9rem", color: "#6b7280" }}
              >
                No venues found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BasicInfoStep = ({
  formData,
  handleInputChange,
  handleArrayChange,
  handleRemoveItem,
  handleCountryChange,
  countries,
  selectedCountry,
  cultures,
}) => {
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
          onChange={(e) => {
            handleInputChange(e);

            // Auto-generate slug from title
            const newTitle = e.target.value;
            const slug = newTitle
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
          }}
          placeholder="e.g., krishna and Radha Romantic Beach Wedding"
        />
      </div>

      <div className="form-group">
        <label className="form-label">URL Slug</label>
        <input
          type="text"
          className="form-control"
          name="slug"
          value={formData.slug}
          disabled
          placeholder="e.g., emma-james-beach-wedding"
        />
        <small className="form-text text-muted">
          This will be used for the wedding story URL
        </small>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Wedding Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={formData.weddingDate ? dayjs(formData.weddingDate) : null}
              onChange={(newValue) => {
                const dateString = newValue
                  ? dayjs(newValue).format("YYYY-MM-DD")
                  : "";
                handleInputChange({
                  target: { name: "weddingDate", value: dateString },
                });
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Select wedding date",
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="form-group">
          <label className="form-label">Country</label>
          <select
            className="form-control"
            name="country"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country.country}>
                {country.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your city (e.g., Mumbai, Delhi, New York)"
          />
          <small className="form-text text-muted">
            Enter the city where your wedding took place
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Culture</label>
          <select
            className="form-control"
            name="cultures"
            value={formData.cultures}
            onChange={handleInputChange}
          >
            <option value="">Select a culture</option>
            {cultures.map((culture, index) => {
              // Handle culture object with id and name properties
              const cultureId = culture?.id || culture?.value || index;
              const cultureName =
                culture?.name || culture?.label || String(culture || "");
              return (
                <option key={cultureId} value={cultureName}>
                  {cultureName}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Venues</label>
        <VenueSearchInput
          onSelectVenue={(venueName) => {
            if (venueName && !formData.venues.includes(venueName)) {
              handleArrayChange("venues", venueName);
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
        <small className="text-muted">
          Search venues or type and press Enter to add
        </small>
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
  // Helper function to count words from HTML (strips HTML tags)
  const countWords = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]*>/g, " ").trim();
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiEdit3 /> Wedding Story
      </h2>

      <div className="form-group">
        <label className="form-label">Your Wedding Story</label>
        <SummernoteEditor
          value={formData.story || ""}
          onChange={(htmlContent) => {
            handleInputChange({
              target: { name: "story", value: htmlContent },
            });
          }}
        />
        <div className="text-right mt-2">
          <small className="text-muted">
            {countWords(formData.story)} words
          </small>
        </div>
      </div>
    </div>
  );
};

const EventCreator = ({ onAdd }) => {
  const [local, setLocal] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
  });
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
              if (e.key === "Enter" && canAdd) {
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={local.date ? dayjs(local.date) : null}
              onChange={(newValue) => {
                const dateString = newValue
                  ? dayjs(newValue).format("YYYY-MM-DD")
                  : "";
                setLocal({ ...local, date: dateString });
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  placeholder: "Select event date",
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <div className="form-group">
          <label className="form-label">Venue</label>
          <input
            type="text"
            className="form-control"
            value={local.venue}
            onChange={(e) => setLocal({ ...local, venue: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canAdd) {
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

const VendorCreator = ({ vendorTypes = [], onAdd }) => {
  const [local, setLocal] = useState({ typeId: "", type: "", name: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (local.typeId && vendorTypes?.length) {
      const found = vendorTypes.find(
        (v) => String(v.id) === String(local.typeId)
      );
      setLocal((prev) => ({ ...prev, type: found?.name || prev.type }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local.typeId]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setLoadingSearch(true);
    try {
      let apiUrl = `https://happywedz.com/api/vendor-services?search=${encodeURIComponent(
        searchQuery
      )}&limit=10`;

      if (local.typeId && local.type) {
        const isVenueType = local.type.toLowerCase() === "venues";

        if (isVenueType) {
          apiUrl += `&vendorType=Venues`;
        } else {
          apiUrl += `&vendorType=${encodeURIComponent(local.type)}`;
        }
      }

      const response = await axios.get(apiUrl);
      const results = response.data?.data || [];

      console.log("Search results:", results);
      console.log("API URL:", apiUrl);

      setSearchResults(results);
      if (results.length > 0) {
        setShowResults(true);
      } else if (searchQuery.length >= 2) {
        // Show "No results" message
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleVendorNameChange = (e) => {
    const value = e.target.value;
    setLocal({ ...local, name: value });

    if (value.length >= 2 && searchResults.length > 0) {
      setShowResults(true);
    } else if (value.length < 2) {
      setShowResults(false);
      setSearchResults([]);
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 500);
  };

  const handleSelectVendor = (vendor) => {
    const vendorName =
      vendor.attributes?.vendor_name ||
      vendor.vendor?.businessName ||
      vendor.name ||
      "";
    setLocal({ ...local, name: vendorName });
    setShowResults(false);
  };

  const canAdd = local.type && local.name;

  return (
    <div className="mb-3 p-3 border rounded">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Vendor Type</label>
          <select
            className="form-control"
            value={local.typeId}
            onChange={(e) => {
              setLocal({ ...local, typeId: e.target.value, name: "" });
              setSearchResults([]);
              setShowResults(false);
            }}
          >
            <option value="">Select type</option>
            {vendorTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div
          className="form-group"
          ref={searchRef}
          style={{ position: "relative" }}
        >
          <label className="form-label">Vendor Name</label>
          <input
            type="text"
            className="form-control"
            value={local.name}
            onChange={handleVendorNameChange}
            onFocus={() => {
              if (local.name.length >= 2 && searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            placeholder="e.g., DreamWed Planners"
          />
          {showResults && local.name.length >= 2 && (
            <div
              className="position-absolute bg-white shadow-lg rounded-3 mt-2"
              style={{
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
                border: "1px solid #e5e7eb",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              {loadingSearch ? (
                <div className="p-4 text-center">
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span style={{ fontSize: "0.9rem" }}>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleSelectVendor(result)}
                      className="d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer"
                      style={{
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <div
                        className="flex-shrink-0 overflow-hidden"
                        style={{
                          borderRadius: "8px",
                          width: "50px",
                          height: "50px",
                        }}
                      >
                        <img
                          src={
                            result.attributes?.image_url ||
                            result.media?.[0]?.url ||
                            "/images/imageNotFound.jpg"
                          }
                          alt={result.attributes?.vendor_name || "Vendor"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/imageNotFound.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h6
                          className="mb-1 fw-semibold"
                          style={{
                            fontSize: "0.9rem",
                            color: "#1f2937",
                          }}
                        >
                          {result.attributes?.vendor_name ||
                            result.vendor?.businessName ||
                            "Vendor"}
                        </h6>
                        <p
                          className="mb-0"
                          style={{
                            fontSize: "0.85rem",
                            color: "#6b7280",
                          }}
                        >
                          {result.attributes?.city ||
                            result.vendor?.city ||
                            "Location"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.9rem", color: "#6b7280" }}
                  >
                    No vendors found
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className="add-item-btn"
        onClick={() => {
          if (canAdd) {
            onAdd({ name: local.name, type: local.type });
            setLocal({ typeId: "", type: "", name: "" });
            setSearchResults([]);
            setShowResults(false);
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
                    style={{ width: "40px", height: "40px" }}
                    className="btn btn-sm btn-outline-danger f-flex justify-content-center align-items-center col-1 rounded-circle"
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

const VendorsStep = ({
  formData,
  handleArrayChange,
  handleRemoveItem,
  vendorTypes,
}) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiUser /> Vendors
      </h2>

      <div className="form-group">
        <label className="form-label">Add Your Wedding Vendors</label>

        <VendorCreator
          vendorTypes={vendorTypes}
          onAdd={(v) => handleArrayChange("vendors", v)}
        />

        {formData.vendors.length > 0 && (
          <div className="mt-3">
            {formData.vendors.map((vendor, index) => (
              <div key={index} className="vendor-card mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2 col-12">
                  <h5 className="mb-0">
                    {vendor.type}: {vendor.name}
                  </h5>
                  <button
                    type="button"
                    style={{ width: "40px", height: "40px" }}
                    className="btn btn-sm btn-outline-danger f-flex justify-content-center align-items-center col-1 rounded-circle"
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

const GalleryStep = ({
  formData,
  handleInputChange,
  handleFilesAdd,
  handleRemoveFile,
}) => {
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
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 6,
                }}
              />
              <button
                type="button"
                style={{
                  width: "40px",
                  height: "40px",
                  position: "relative",
                  top: -30,
                  right: 30,
                }}
                className="btn btn-sm btn-outline-danger f-flex justify-content-center align-items-center col-1 rounded-circle"
                onClick={() => handleRemoveFile("coverPhoto")}
              >
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
              <div
                key={idx}
                className="position-relative"
                style={{ width: 100 }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Highlight ${idx + 1}`}
                  style={{
                    width: 100,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <button
                  type="button"
                  style={{
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    top: -8,
                    right: -8,
                  }}
                  className="btn btn-sm btn-outline-danger f-flex justify-content-center align-items-center col-1 rounded-circle"
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
              <div
                key={idx}
                className="position-relative"
                style={{ width: 100 }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`All ${idx + 1}`}
                  style={{
                    width: 100,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
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

const HighlightsAndCreditsStep = ({
  formData,
  handleInputChange,
  handleArrayChange,
  handleRemoveItem,
}) => {
  return (
    <div className="form-card">
      <h2 className="form-section-title">
        <FiImage /> Highlights
      </h2>

      <div className="form-group">
        <label className="form-label">Wedding Themes</label>
        {/* <input
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
        /> */}
        <select
          className="form-control"
          defaultValue=""
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              handleArrayChange("themes", value);
              e.target.value = "";
            }
          }}
        >
          <option value="" disabled>
            Select a theme
          </option>

          <option value="Destination">Destination</option>
          <option value="Classic">Classic</option>
          <option value="Grand & Luxurious"> Grand & Luxurious</option>
          <option value="Pocket Friendly Stunners">
            Pocket Friendly Stunners
          </option>
          <option value="Intimate & Minimalist">Intimate & Minimalist</option>
          <option value="Modern & Stylish"> Modern & Stylish</option>
          <option value="International">International</option>
          <option value="Others">Others</option>
        </select>

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

      <div
        className="form-divider"
        style={{ margin: "2rem 0", borderTop: "2px solid #e0e0e0" }}
      ></div>

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

      <div className="form-divider" style={{ margin: "1.5rem 0" }}></div>

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
