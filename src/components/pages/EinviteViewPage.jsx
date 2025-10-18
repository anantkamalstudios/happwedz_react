import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { einviteApi } from "../../services/api/einviteApi";
import { getImageUrl, handleImageError } from "../../utils/imageUtils";
import { FaHeart, FaMapMarkerAlt, FaComment } from "react-icons/fa";

const EinviteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestComment, setGuestComment] = useState("");
  const [showRsvpForm, setShowRsvpForm] = useState(false);

  useEffect(() => {
    const fetchEinvite = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching e-invite with ID:", id);
        
        const response = await einviteApi.getPublicEinviteInstance(id);
        console.log("Received response:", response);
        
        // Handle different response structures
        let data = null;
        if (response.success && response.data) {
          data = response.data;
        } else if (response.data) {
          data = response.data;
        } else if (response.success === true || response.success === false) {
          // Response might be the data itself
          data = response;
        } else {
          data = response;
        }
        
        if (data && (data.id || data._id)) {
          console.log("Setting card data:", data);
          setCardData(data);
        } else {
          console.error("Invalid data structure:", data);
          setError("E-invite not found or invalid data format");
        }
      } catch (err) {
        console.error("Error fetching e-invite:", err);
        setError(`Failed to load e-invite: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEinvite();
    }
  }, [id]);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send RSVP data to backend
    alert(`Thank you ${guestName}! Your RSVP has been recorded.`);
    setShowRsvpForm(false);
    setGuestName("");
    setGuestComment("");
    setRsvpStatus("");
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your invitation...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger mb-3">Oops!</h3>
        <p>{error || "E-invite not found"}</p>
        <div className="alert alert-info mt-3 text-start" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h6>Debug Information:</h6>
          <p className="mb-1"><strong>ID:</strong> {id}</p>
          <p className="mb-1"><strong>Error:</strong> {error}</p>
          <p className="mb-0 small">Check the browser console (F12) for more details.</p>
        </div>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  const bgUrl = getImageUrl(cardData.backgroundUrl || cardData.background_url);
  const editableFields = Array.isArray(cardData.editableFields)
    ? cardData.editableFields
    : typeof cardData.editableFields === "string"
    ? JSON.parse(cardData.editableFields)
    : [];

  return (
    <div className="einvite-view-page" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingTop: "2rem", paddingBottom: "3rem" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            {/* E-Invite Card Display */}
            <div className="card border-0 shadow-lg mb-4">
              <div className="position-relative" style={{ backgroundColor: "#ffffff" }}>
                {bgUrl ? (
                  <img
                    src={bgUrl}
                    alt="E-Invite"
                    className="w-100 h-auto d-block"
                    style={{ objectFit: "contain" }}
                    onError={(e) => handleImageError(e, cardData.backgroundUrl || cardData.background_url)}
                  />
                ) : (
                  <div className="text-center text-muted p-5" style={{ minHeight: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No background image found
                  </div>
                )}

                {/* Text Fields Overlay */}
                {editableFields.map((field) => (
                  <div
                    key={field.id}
                    style={{
                      position: "absolute",
                      left: field.x,
                      top: field.y,
                      color: field.color,
                      fontFamily: field.fontFamily,
                      fontSize: `${field.fontSize}px`,
                      userSelect: "none",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                    }}
                  >
                    {field.defaultText}
                  </div>
                ))}
              </div>
            </div>

            {/* Card Info */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body text-center">
                <h4 className="mb-3">{cardData.name || "Wedding Invitation"}</h4>
                <p className="text-muted mb-4">
                  You're invited to celebrate this special occasion with us!
                </p>

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => setShowRsvpForm(!showRsvpForm)}
                  >
                    <FaHeart /> RSVP
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <FaMapMarkerAlt /> View Location
                  </button>
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <FaComment /> Leave a Comment
                  </button>
                </div>
              </div>
            </div>

            {/* RSVP Form */}
            {showRsvpForm && (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="mb-4">RSVP</h5>
                  <form onSubmit={handleRsvpSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Will you attend?</label>
                      <select
                        className="form-select"
                        value={rsvpStatus}
                        onChange={(e) => setRsvpStatus(e.target.value)}
                        required
                      >
                        <option value="">Select...</option>
                        <option value="yes">Yes, I'll be there!</option>
                        <option value="no">Sorry, can't make it</option>
                        <option value="maybe">Maybe</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={guestComment}
                        onChange={(e) => setGuestComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Submit RSVP
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowRsvpForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EinviteViewPage;
