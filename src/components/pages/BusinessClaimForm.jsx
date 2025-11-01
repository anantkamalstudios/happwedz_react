import React, { useState } from "react";
import { FiUpload, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const BusinessClaimForm = ({ setShowClaimForm }) => {
  const { user, userToken: token } = useSelector((state) => state.auth);
  const location = useLocation();
  const isOnClaimPage = location.pathname === "/claim-your-buisness";

  const [expandedSections, setExpandedSections] = useState({
    policyholder: true,
    owner: true,
    proof: true,
    additional: true,
    declaration: true,
  });

  const [formData, setFormData] = useState({
    businessName: "",
    registeredAddress: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    category: "",
    registrationNumber: "",
    claimantFullName: "",
    claimantRole: "",
    claimantMobile: "",
    claimantEmail: "",
    businessDescription: "",
    facebookLink: "",
    instagramLink: "",
    linkedinLink: "",
    additionalDocuments: "",
    contactMethod: "",
    dateSigned: "",
    agreed: false,
  });

  const [files, setFiles] = useState({
    aadharCard: null,
    panCard: null,
    shopLicense: null,
    udyamCertificate: null,
    gstCertificate: null,
    otherRegistration: null,
    addressProof: null,
    businessPhoto: null,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [fileKey]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !user) {
      alert("Please login to submit the claim form");
      return;
    }

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    });

    formDataToSend.append("userId", user.id);

    try {
      const response = await fetch(
        "https://happywedz.com/api/claim-your-buisness",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          businessName: "",
          registeredAddress: "",
          phoneNumber: "",
          emailAddress: "",
          website: "",
          category: "",
          registrationNumber: "",
          claimantFullName: "",
          claimantRole: "",
          claimantMobile: "",
          claimantEmail: "",
          businessDescription: "",
          facebookLink: "",
          instagramLink: "",
          linkedinLink: "",
          additionalDocuments: "",
          contactMethod: "",
          dateSigned: "",
          agreed: false,
        });
        setFiles({
          aadharCard: null,
          panCard: null,
          shopLicense: null,
          udyamCertificate: null,
          gstCertificate: null,
          otherRegistration: null,
          addressProof: null,
          businessPhoto: null,
        });
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const FileUploadBox = ({ label, fileKey, helpText }) => (
    <div className="col-md-6 mb-4">
      <div className="claim-business-upload-box">
        <input
          type="file"
          id={fileKey}
          className="claim-business-file-input"
          onChange={(e) => handleFileChange(e, fileKey)}
        />
        <label htmlFor={fileKey} className="claim-business-upload-label">
          <FiUpload className="claim-business-upload-icon" />
          <span>{label}</span>
        </label>
        <small className="claim-business-help-text">{helpText}</small>
        {files[fileKey] && (
          <div className="claim-business-file-name">{files[fileKey].name}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="claim-business-card position-relative">
          <h1 className="claim-business-title">Business Claim Form</h1>
          <p className="claim-business-subtitle">
            Please take a moment to fill out this form in complete detail.
          </p>

          <div
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => setShowClaimForm(false)}
          >
            <IoClose size={30} style={{ color: "#000", cursor: "pointer" }} />
          </div>

          <div>
            {/* Policyholder Information */}
            <div className="claim-business-section">
              <div
                className="claim-business-section-header"
                onClick={() => toggleSection("policyholder")}
              >
                <h2 className="claim-business-section-title">
                  Policyholder Information
                </h2>
                {expandedSections.policyholder ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </div>
              {expandedSections.policyholder && (
                <div className="claim-business-section-content">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Registered Business Address"
                        name="registeredAddress"
                        value={formData.registeredAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="tel"
                        className="claim-business-input"
                        placeholder="Business Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        className="claim-business-input"
                        placeholder="Business Email Address"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="url"
                        className="claim-business-input"
                        placeholder="Business Website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Business Category / Type"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Business Registration Number (if applicable)"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Owner / Claimant Information */}
            <div className="claim-business-section">
              <div
                className="claim-business-section-header"
                onClick={() => toggleSection("owner")}
              >
                <h2 className="claim-business-section-title">
                  Owner / Claimant Information
                </h2>
                {expandedSections.owner ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.owner && (
                <div className="claim-business-section-content">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Claimant Full Name"
                        name="claimantFullName"
                        value={formData.claimantFullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Claimant Role / Designation"
                        name="claimantRole"
                        value={formData.claimantRole}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="tel"
                        className="claim-business-input"
                        placeholder="Claimant Mobile Number"
                        name="claimantMobile"
                        value={formData.claimantMobile}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="email"
                        className="claim-business-input"
                        placeholder="Claimant Email Address"
                        name="claimantEmail"
                        value={formData.claimantEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Proof of Ownership Documents */}
            <div className="claim-business-section">
              <div
                className="claim-business-section-header"
                onClick={() => toggleSection("proof")}
              >
                <h2 className="claim-business-section-title">
                  Proof of Ownership Documents
                </h2>
                {expandedSections.proof ? <FiChevronUp /> : <FiChevronDown />}
              </div>
              {expandedSections.proof && (
                <div className="claim-business-section-content">
                  <div className="row">
                    <FileUploadBox
                      label="Upload Aadhar Card file"
                      fileKey="aadharCard"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload PAN Card file"
                      fileKey="panCard"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload Shop Act License / Trade License file"
                      fileKey="shopLicense"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload Udyam Registration Certificate file"
                      fileKey="udyamCertificate"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload GST Registration Certificate file"
                      fileKey="gstCertificate"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload Other Business Registration Document file"
                      fileKey="otherRegistration"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload Proof of Business Address file"
                      fileKey="addressProof"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                    <FileUploadBox
                      label="Upload Recent Photograph of Business Premises file"
                      fileKey="businessPhoto"
                      helpText="Attach file size of your document should not exceed 50MB"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="claim-business-section">
              <div
                className="claim-business-section-header"
                onClick={() => toggleSection("additional")}
              >
                <h2 className="claim-business-section-title">
                  Additional Information
                </h2>
                {expandedSections.additional ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </div>
              {expandedSections.additional && (
                <div className="claim-business-section-content">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Business Description"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="url"
                        className="claim-business-input"
                        placeholder="Social Media Profiles (Facebook link)"
                        name="facebookLink"
                        value={formData.facebookLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="url"
                        className="claim-business-input"
                        placeholder="Social Media Profiles (Instagram link)"
                        name="instagramLink"
                        value={formData.instagramLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="url"
                        className="claim-business-input"
                        placeholder="Social Media Profiles (LinkedIn link)"
                        name="linkedinLink"
                        value={formData.linkedinLink}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Additional Documents or Links (optional / URL)"
                        name="additionalDocuments"
                        value={formData.additionalDocuments}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        className="claim-business-input"
                        placeholder="Preferred Contact Method"
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Declaration / Authorization */}
            <div className="claim-business-section">
              <div
                className="claim-business-section-header"
                onClick={() => toggleSection("declaration")}
              >
                <h2 className="claim-business-section-title">
                  Declaration / Authorization
                </h2>
                {expandedSections.declaration ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </div>
              {expandedSections.declaration && (
                <div className="claim-business-section-content">
                  <div className="claim-business-checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="declaration"
                      className="claim-business-checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="declaration"
                      className="claim-business-checkbox-label"
                    >
                      I hereby declare that the information provided in this
                      claim form is true and accurate to the best of my
                      knowledge. I understand that any false statements may
                      result in denial of the claim.
                    </label>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                      <label className="claim-business-label">
                        Policyholder's Signature:
                      </label>
                      <button
                        type="button"
                        className="claim-business-signature-btn"
                      >
                        <span className="claim-business-signature-icon">✎</span>
                        Add Signature
                      </button>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="claim-business-label">
                        Date Signed:
                      </label>
                      <input
                        type="date"
                        className="claim-business-input"
                        name="dateSigned"
                        value={formData.dateSigned}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="claim-business-submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>

            {!isOnClaimPage && (
              <>
                <hr />
                <Link
                  to="/claim-your-buisness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-flex primary-text text-center justify-content-center text-decoration-none"
                >
                  Open Claim Form Separately
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessClaimForm;
