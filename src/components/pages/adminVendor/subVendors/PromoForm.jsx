import React, { useState } from "react";

export default function PromoForm() {
  const [form, setForm] = useState({
    title: "",
    promoCode: "",
    type: "percentage",
    value: "",
    startDate: "",
    endDate: "",
    description: "",
    termsAccepted: false,
    active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
    if (!file) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = "Title is required.";
    if (!form.promoCode.trim()) err.promoCode = "Promo code is required.";
    if (!form.value || isNaN(form.value) || Number(form.value) <= 0)
      err.value = "Enter a valid discount value.";
    if (!form.startDate) err.startDate = "Start date is required.";
    if (!form.endDate) err.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      err.date = "End date must be after start date.";
    if (!form.termsAccepted) err.termsAccepted = "You must accept terms.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, imageName: imageFile?.name || null };
    localStorage.setItem("promoDraft", JSON.stringify(payload));
    alert("Promotion saved successfully!");
  };

  const resetForm = () => {
    setForm({
      title: "",
      promoCode: "",
      type: "percentage",
      value: "",
      startDate: "",
      endDate: "",
      description: "",
      termsAccepted: false,
      active: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  const formattedValue = () =>
    form.type === "percentage" ? `${form.value}% off` : `₹ ${form.value} off`;

  return (
    <div className="promo-form-container my-5">
      {/* <div className="promo-header">
        <div className="promo-header-content">
          <h1>Create Special Offers for Couples</h1>
          <p>Attract more couples with exclusive promotions and discounts</p>
        </div>
      </div> */}

      <div className="promo-form-wrapper">
        <div className="form-section">
          <div className="form-card">
            <h2>Promotion Details</h2>
            <p className="form-description">
              Fill in the details of your special offer for couples
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Offer Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={`form-control ${errors.title ? "error" : ""}`}
                  placeholder="e.g. 10% off for WeddingWire couples"
                />
                {errors.title && (
                  <div className="error-message">{errors.title}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Promo Code</label>
                  <input
                    name="promoCode"
                    value={form.promoCode}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.promoCode ? "error" : ""
                    }`}
                    placeholder="E.g. WWCOUPLE10"
                  />
                  {errors.promoCode && (
                    <div className="error-message">{errors.promoCode}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <div className="switch-container">
                    <label className="switch">
                      <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span className="switch-label">
                      {form.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Discount Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Discount Value</label>
                  <div className="input-with-icon">
                    <span className="input-icon">
                      {form.type === "percentage" ? "%" : "₹"}
                    </span>
                    <input
                      name="value"
                      value={form.value}
                      onChange={handleChange}
                      className={`form-control ${errors.value ? "error" : ""}`}
                      placeholder={form.type === "percentage" ? "10" : "500"}
                    />
                  </div>
                  {errors.value && (
                    <div className="error-message">{errors.value}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.startDate || errors.date ? "error" : ""
                    }`}
                  />
                  {errors.startDate && (
                    <div className="error-message">{errors.startDate}</div>
                  )}
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className={`form-control ${
                      errors.endDate || errors.date ? "error" : ""
                    }`}
                  />
                  {(errors.endDate || errors.date) && (
                    <div className="error-message">
                      {errors.endDate || errors.date}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="form-control"
                  placeholder="Short note about terms or what customers get"
                />
              </div>

              <div className="form-group">
                <label>Promotion Image</label>
                <div className="file-upload">
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      className="file-input"
                    />
                    <span className="file-upload-button">Choose File</span>
                    <span className="file-name">
                      {imageFile ? imageFile.name : "No file chosen"}
                    </span>
                  </label>
                  <small className="file-hint">
                    Recommended size: 800x400px (JPG, PNG)
                  </small>
                </div>
              </div>

              <div className="form-group terms-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={form.termsAccepted}
                    onChange={handleChange}
                  />
                  <span
                    className={`checkmark ${
                      errors.termsAccepted ? "error" : ""
                    }`}
                  ></span>
                  I confirm this offer and its terms
                </label>
                {errors.termsAccepted && (
                  <div className="error-message">{errors.termsAccepted}</div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)",
                  }}
                >
                  Save Promotion
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn-preview"
                  onClick={() => alert("Preview opened")}
                >
                  Preview
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="preview-section">
          <div className="preview-card">
            <div className="preview-header">
              <h3>Promotion Preview</h3>
              <p>This is how couples will see your offer</p>
            </div>

            <div className="promo-preview">
              <div className="preview-content">
                <div className="preview-top">
                  <div>
                    <h4>{form.title || "Promotion title"}</h4>
                    <div className="promo-code">
                      {form.promoCode || "PROMOCODE"}
                    </div>
                  </div>
                  <div className="discount-badge">{formattedValue()}</div>
                </div>

                <div className="preview-image">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="promo"
                      className="preview-img"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <div className="placeholder-icon">
                        <svg
                          width="151px"
                          height="151px"
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
                            <circle
                              cx="12"
                              cy="13"
                              r="3"
                              stroke="#1C274C"
                              stroke-width="1.5"
                            ></circle>{" "}
                            <path
                              d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18"
                              stroke="#1C274C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{" "}
                            <path
                              d="M19 10H18"
                              stroke="#1C274C"
                              stroke-width="1.5"
                              stroke-linecap="round"
                            ></path>{" "}
                          </g>
                        </svg>
                      </div>
                      <p>Promotion image preview</p>
                    </div>
                  )}
                </div>

                <div className="preview-dates">
                  <span className="date-label">Valid:</span>
                  <span className="dates">
                    {form.startDate || "Start"} — {form.endDate || "End"}
                  </span>
                </div>

                <div className="preview-description">
                  <p>
                    {form.description ||
                      "Short description of the offer appears here."}
                  </p>
                  <p className="terms-note">
                    Terms apply. See full terms on booking.
                  </p>
                </div>

                <div className="preview-actions">
                  <button
                    className="action-button apply-btn"
                    style={{
                      background:
                        "linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)",
                    }}
                  >
                    Apply Code
                  </button>
                  <button className="action-button share-btn">
                    Share Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
