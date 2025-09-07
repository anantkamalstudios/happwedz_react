import React, { useState } from "react";

const VendorContact = () => {
  const [formData, setFormData] = useState({
    contact: {
      contactName: "",
      phone: "",
      altPhone: "",
      email: "",
      website: "",
      whatsappNumber: "",
      inquiryEmail: "",
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Contact Details</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Contact Person *</label>
            <input
              type="text"
              className="form-control"
              value={formData.contact.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              placeholder="Enter contact person name"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Primary Phone *</label>
            <input
              type="tel"
              className="form-control"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter primary phone number"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Alternative Phone</label>
            <input
              type="tel"
              className="form-control"
              value={formData.contact.altPhone}
              onChange={(e) => handleInputChange("altPhone", e.target.value)}
              placeholder="Enter alternative phone number"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">WhatsApp Number</label>
            <input
              type="tel"
              className="form-control"
              value={formData.contact.whatsappNumber}
              onChange={(e) =>
                handleInputChange("whatsappNumber", e.target.value)
              }
              placeholder="Enter WhatsApp number"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Email *</label>
            <input
              type="email"
              className="form-control"
              value={formData.contact.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Inquiry Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.contact.inquiryEmail}
              onChange={(e) =>
                handleInputChange("inquiryEmail", e.target.value)
              }
              placeholder="Enter inquiry email"
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Website</label>
            <input
              type="url"
              className="form-control"
              value={formData.contact.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://your-website.com"
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2">Save Contact Details</button>
      </div>
    </div>
  );
};

export default VendorContact;
