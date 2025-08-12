import React from "react";

const BusinessDetails = () => {
  return (
    <div className="my-5">
      {/* Login Information */}
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
          <a href="">Reset Password</a>
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
      <button className="btn btn-danger mt-2">Submit</button>
    </div>
  );
};

export default BusinessDetails;
