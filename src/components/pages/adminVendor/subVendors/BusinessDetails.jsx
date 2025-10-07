import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import vendorsAuthApi, {
  vendorsApi,
} from "../../../../services/api/vendorAuthApi";

const BusinessDetails = ({ formData, setFormData }) => {
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [profileImageFile, setProfileImageFile] = React.useState(null);
  const [validationErrors, setValidationErrors] = React.useState({});

  const { vendor, token } = useSelector((state) => state.vendorAuth || {});
  // Pre-fill data from Redux when the component loads
  useEffect(() => {
    if (vendor) {
      setFormData((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          email: prev.attributes?.email || vendor.email || "",
          businessName:
            prev.attributes?.businessName || vendor.businessName || "",
          phone: prev.attributes?.phone || vendor.phone || "",
          username: prev.attributes?.username || vendor.email || "",
          vendor_type_id:
            prev.attributes?.vendor_type_id || vendor.vendor_type_id || "",
          years_in_business:
            prev.attributes?.years_in_business ||
            vendor.years_in_business ||
            "",
          firstName: prev.attributes?.firstName || vendor.firstName || "",
          lastName: prev.attributes?.lastName || vendor.lastName || "",
          city: prev.attributes?.city || vendor.city || "",
          state: prev.attributes?.state || vendor.state || "",
          zip: prev.attributes?.zip || vendor.zip || "",
          website: prev.attributes?.website || vendor.website || "",
          facebook_link:
            prev.attributes?.facebook_link || vendor.facebook_link || "",
          instagram_link:
            prev.attributes?.instagram_link || vendor.instagram_link || "",
        },
      }));
    }
  }, [vendor, setFormData]);

  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [name]: value },
    }));
  };

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImageFile(file);
  };

  const buildRegisterPayload = () => {
    const a = formData.attributes || {};
    const payload = {
      businessName: a.businessName || "",
      email: a.email || "",
      phone: a.phone || "",
      city: a.city || "",
      state: a.state || null,
      zip: a.zip || null,
      website: a.website || null,
      facebook_link: a.facebook_link || null,
      instagram_link: a.instagram_link || null,
      vendor_type_id: a.vendor_type_id ? Number(a.vendor_type_id) : null,
      years_in_business: a.years_in_business
        ? Number(a.years_in_business)
        : null,
      firstName: a.firstName || null,
      lastName: a.lastName || null,
    };
    if (newPassword && newPassword === confirmPassword) {
      payload.password = newPassword;
    }
    return payload;
  };

  const handleSubmitRegister = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");
    setValidationErrors({});
    try {
      const payload = buildRegisterPayload();

      // Validate required fields
      const requiredFields = ["businessName", "email", "phone", "city"];
      const errors = {};
      requiredFields.forEach((f) => {
        const value = payload[f];
        if (value === undefined || value === null || `${value}`.trim() === "") {
          errors[f] = "Required";
        }
      });

      // On register, password is required if creating new vendor (no vendor.id)
      const isNew = !vendor?.id;
      if (isNew && !payload.password) {
        errors.password = "Required";
      }

      if (Object.keys(errors).length) {
        setValidationErrors(errors);
        throw new Error("Required fields missing");
      }

      if (vendor?.id) {
        // Update existing vendor
        await vendorsApi.updateVendor(vendor.id, payload);
      } else {
        // Register new vendor
        await vendorsAuthApi.register(payload);
      }
      setSuccess("Business details saved.");
    } catch (e) {
      // Prefer server message if available
      const serverMsg =
        e?.response?.data?.message || e?.response?.data || e?.message;
      setError(typeof serverMsg === "string" ? serverMsg : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      {/* <div className="p-3 border rounded mb-4 bg-white">
        <h6 className="mb-3 fw-bold">Login Information</h6>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            type="text"
            className="form-control"
            placeholder="Enter username"
            value={formData.attributes?.username || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          {!showPasswordFields ? (
            <button
              type="button"
              className="btn btn-link text-danger p-0"
              onClick={() => setShowPasswordFields(true)}
              style={{ textDecoration: "none" }}
            >
              Reset Password
            </button>
          ) : (
            <div>
              <div className="mb-3">
                <label className="form-label">Your Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="mt-3">
                  <a
                    href="#"
                    style={{
                      fontSize: "0.9em",
                      color: "red",
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitRegister}
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Submit"}
              </button>
            </div>
          )}
        </div>
      </div>
     
      <div className="p-3 border rounded mb-4 bg-white">
        <h6 className="mb-3 fw-bold">About</h6>
        <textarea
          name="about"
          className="form-control"
          rows="4"
          placeholder="Write about your business..."
          value={formData.attributes?.about || ""}
          onChange={handleAttributeChange}
        ></textarea>
      </div> */}
      {/* Contact Details */}
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Contact Details</h6>
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleProfileImage}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Business Name *</label>
          <input
            name="businessName"
            type="text"
            className="form-control"
            placeholder="Enter business name"
            value={formData.attributes?.businessName || ""}
            onChange={handleAttributeChange}
          />
          {validationErrors.businessName && (
            <div className="text-danger small">
              {validationErrors.businessName}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={formData.attributes?.email || ""}
            onChange={handleAttributeChange}
          />
          {validationErrors.email && (
            <div className="text-danger small">{validationErrors.email}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile Number *</label>
          <input
            name="phone"
            type="text"
            className="form-control"
            placeholder="Enter phone number"
            value={formData.attributes?.phone || ""}
            onChange={handleAttributeChange}
          />
          {validationErrors.phone && (
            <div className="text-danger small">{validationErrors.phone}</div>
          )}
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            name="mobile"
            type="text"
            className="form-control"
            placeholder="Enter mobile number"
            value={formData.attributes?.mobile || ""}
            onChange={handleAttributeChange}
          />
        </div> */}
        {/* <div className="mb-3">
          <label className="form-label">Fax</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter fax number"
          />
        </div> */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            name="city"
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={formData.attributes?.city || ""}
            onChange={handleAttributeChange}
          />
          {validationErrors.city && (
            <div className="text-danger small">{validationErrors.city}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">State</label>
          <input
            name="state"
            type="text"
            className="form-control"
            placeholder="Enter state"
            value={formData.attributes?.state || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Zip</label>
          <input
            name="zip"
            type="text"
            className="form-control"
            placeholder="Enter zip"
            value={formData.attributes?.zip || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input
            name="website"
            type="url"
            className="form-control"
            placeholder="Enter website URL"
            value={formData.attributes?.website || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Facebook Link</label>
          <input
            name="facebook_link"
            type="url"
            className="form-control"
            placeholder="Facebook profile/page URL"
            value={formData.attributes?.facebook_link || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Instagram Link</label>
          <input
            name="instagram_link"
            type="url"
            className="form-control"
            placeholder="Instagram profile URL"
            value={formData.attributes?.instagram_link || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          <input
            name="vendor_type_id"
            type="hidden"
            className="form-control"
            value={vendor?.vendor_type_id || ""}
            readOnly
          />
          <input
            type="hidden"
            name="vendor_type_id"
            value={vendor?.vendor_type_id || ""}
          />

          {validationErrors.vendor_type_id && (
            <div className="text-danger small">
              {validationErrors.vendor_type_id}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Years in Business</label>
          <input
            name="years_in_business"
            type="number"
            className="form-control"
            placeholder="e.g. 5"
            value={formData.attributes?.years_in_business || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            name="firstName"
            type="text"
            className="form-control"
            placeholder="First name"
            value={formData.attributes?.firstName || ""}
            onChange={handleAttributeChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            name="lastName"
            type="text"
            className="form-control"
            placeholder="Last name"
            value={formData.attributes?.lastName || ""}
            onChange={handleAttributeChange}
          />
        </div>
      </div>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      {success && <div className="alert alert-success mt-2">{success}</div>}
      <button
        className="btn btn-primary mt-2 folder-item"
        onClick={handleSubmitRegister}
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Save Business Details"}
      </button>
    </div>
  );
};

export default BusinessDetails;
