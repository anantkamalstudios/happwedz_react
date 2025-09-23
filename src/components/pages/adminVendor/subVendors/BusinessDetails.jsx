import React, { useState } from "react";

const BusinessDetails = () => {
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  return (
    <div className="">
      <div className="p-3 border rounded mb-4 bg-white">
        <h6 className="mb-3 fw-bold">Login Information</h6>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter username"
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
                // onClick={handlePasswordSubmit} // implement as needed
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      {/* About Section */}
      <div className="p-3 border rounded mb-4 bg-white">
        <h6 className="mb-3 fw-bold">About</h6>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Write about your business..."
        ></textarea>
      </div>
      {/* Contact Details */}
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Contact Details</h6>
        <div className="mb-3">
          <label className="form-label">Contact Person *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter contact person name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter mobile number"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fax</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter fax number"
          />
        </div>
        <div>
          <label className="form-label">Website</label>
          <input
            type="url"
            className="form-control"
            placeholder="Enter website URL"
          />
        </div>
      </div>
      <button className="btn btn-primary mt-2 folder-item">Submit</button>
    </div>
  );
};

export default BusinessDetails;
