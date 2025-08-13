import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaBirthdayCake,
  FaLanguage,
  FaVenusMars,
  FaPhone,
  FaCheck,
  FaHeart,
  FaUsers,
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const MatrimonialRegistration = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    profileType: "bride",
    name: "",
    showName: true,
    dob: "",
    motherTongue: "",
    religion: "",
    caste: "",
    casteNoBar: false,
    manglik: "non-manglik",
    phone: "",
    phoneVerified: false,
    brothers: 0,
    marriedBrothers: 0,
    sisters: 0,
    marriedSisters: 0,
    aboutYourself: "",
  });

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.dob) newErrors.dob = "Date of birth is required";
      if (!formData.motherTongue)
        newErrors.motherTongue = "Mother tongue is required";
      if (!formData.religion) newErrors.religion = "Religion is required";
      if (!formData.caste) newErrors.caste = "Caste is required";
    }

    if (step === 4 && !formData.phoneVerified) {
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone))
        newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      console.log("Form submitted:", formData);
      // Submit to backend
      alert("Registration successful!");
    }
  };

  const verifyPhone = () => {
    if (!formData.phone) {
      setErrors({ phone: "Phone number is required" });
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setErrors({ phone: "Invalid phone number" });
      return;
    }

    // In a real app, you would send OTP here
    setFormData((prev) => ({ ...prev, phoneVerified: true }));
  };

  return (
    <div className="matrimonial-registration">
      <div className="container py-4 py-md-5">
        {/* <div className="text-center mb-4"> */}
        {/* <h2 className="text-primary">
            <FaHeart className="me-2" />
            JeevanSaathi
          </h2> */}
        {/* <p className="text-muted">Find your perfect life partner</p>
        </div> */}

        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <ul className="nav nav-tabs card-header-tabs flex-nowrap overflow-auto">
              <li className="nav-item flex-shrink-0">
                <button
                  className={`nav-link ${step === 1 ? "active" : ""}`}
                  onClick={() => setStep(1)}
                >
                  Profile Details
                </button>
              </li>
              <li className="nav-item flex-shrink-0">
                <button
                  className={`nav-link ${step === 2 ? "active" : ""}`}
                  onClick={() => setStep(2)}
                  disabled={step < 2}
                >
                  Family Details
                </button>
              </li>
              <li className="nav-item flex-shrink-0">
                <button
                  className={`nav-link ${step === 3 ? "active" : ""}`}
                  onClick={() => setStep(3)}
                  disabled={step < 3}
                >
                  About Yourself
                </button>
              </li>
              <li className="nav-item flex-shrink-0">
                <button
                  className={`nav-link ${step === 4 ? "active" : ""}`}
                  onClick={() => setStep(4)}
                  disabled={step < 4}
                >
                  Phone Verification
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-3 p-md-4">
            <h4 className="mb-4" style={{ color: "#d63384" }}>
              Hi! You are joining the Best Matchmaking Experience.
            </h4>

            {step === 1 && (
              <div className="profile-details">
                <div className="mb-3">
                  <label className="form-label">
                    <FaUser className="me-2" />
                    {formData.profileType === "bride"
                      ? "Bride's"
                      : "Groom's"}{" "}
                    Name *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <div className="input-group-text">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="showName"
                          checked={formData.showName}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small">
                          Show to All
                        </label>
                      </div>
                    </div>
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>
                  <small className="text-muted">
                    If you wish to hide your name from others, click on settings
                    icon and choose the setting
                  </small>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaBirthdayCake className="me-2" />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.dob ? "is-invalid" : ""
                      }`}
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                    {errors.dob && (
                      <div className="invalid-feedback">{errors.dob}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaLanguage className="me-2" />
                      Mother tongue *
                    </label>
                    <select
                      className={`form-select ${
                        errors.motherTongue ? "is-invalid" : ""
                      }`}
                      name="motherTongue"
                      value={formData.motherTongue}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="hindi">Hindi</option>
                      <option value="english">English</option>
                      <option value="bengali">Bengali</option>
                      <option value="tamil">Tamil</option>
                      <option value="telugu">Telugu</option>
                      <option value="marathi">Marathi</option>
                    </select>
                    {errors.motherTongue && (
                      <div className="invalid-feedback">
                        {errors.motherTongue}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaVenusMars className="me-2" />
                      Religion *
                    </label>
                    <select
                      className={`form-select ${
                        errors.religion ? "is-invalid" : ""
                      }`}
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="hindu">Hindu</option>
                      <option value="muslim">Muslim</option>
                      <option value="christian">Christian</option>
                      <option value="sikh">Sikh</option>
                      <option value="jain">Jain</option>
                    </select>
                    {errors.religion && (
                      <div className="invalid-feedback">{errors.religion}</div>
                    )}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      <FaUsers className="me-2" />
                      Caste *
                    </label>
                    <select
                      className={`form-select ${
                        errors.caste ? "is-invalid" : ""
                      }`}
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      required
                      disabled={!formData.religion}
                    >
                      <option value="">Select</option>
                      {formData.religion === "hindu" && (
                        <>
                          <option value="brahmin">Brahmin</option>
                          <option value="maratha">Maratha</option>
                          <option value="rajput">Rajput</option>
                        </>
                      )}
                      {formData.religion === "muslim" && (
                        <>
                          <option value="sunni">Sunni</option>
                          <option value="shia">Shia</option>
                        </>
                      )}
                    </select>
                    {errors.caste && (
                      <div className="invalid-feedback">{errors.caste}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="casteNoBar"
                    checked={formData.casteNoBar}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Caste no bar (I am open to marry people of all castes)
                  </label>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="fas fa-star me-2"></i>
                    Are you manglik? *
                  </label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="manglik"
                        value="manglik"
                        checked={formData.manglik === "manglik"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Manglik</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="manglik"
                        value="non-manglik"
                        checked={formData.manglik === "non-manglik"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Non-manglik</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="manglik"
                        value="dont-know"
                        checked={formData.manglik === "dont-know"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Don't know</label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-light" disabled>
                    Back
                  </button>
                  <button className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="family-details">
                <h5 className="mb-3">Brothers</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">How many brothers?</label>
                    <div className="btn-group w-100">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={`brothers-${num}`}
                          type="button"
                          className={`btn ${
                            formData.brothers === num
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, brothers: num }))
                          }
                        >
                          {num === 3 ? "3+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">How many married?</label>
                    <div className="btn-group w-100">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={`married-brothers-${num}`}
                          type="button"
                          className={`btn ${
                            formData.marriedBrothers === num
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              marriedBrothers: num,
                            }))
                          }
                          disabled={num > formData.brothers}
                        >
                          {num === 3 ? "3+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <h5 className="mb-3">Sisters</h5>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label">How many sisters?</label>
                    <div className="btn-group w-100">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={`sisters-${num}`}
                          type="button"
                          className={`btn ${
                            formData.sisters === num
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, sisters: num }))
                          }
                        >
                          {num === 3 ? "3+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">How many married?</label>
                    <div className="btn-group w-100">
                      {[0, 1, 2, 3].map((num) => (
                        <button
                          key={`married-sisters-${num}`}
                          type="button"
                          className={`btn ${
                            formData.marriedSisters === num
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              marriedSisters: num,
                            }))
                          }
                          disabled={num > formData.sisters}
                        >
                          {num === 3 ? "3+" : num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-light" onClick={prevStep}>
                    Back
                  </button>
                  <button className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="about-yourself">
                <div className="mb-4">
                  <h5>Here is your chance to make your profile stand out!</h5>
                  <p className="text-muted">
                    Write about yourself, your family, your expectations from
                    partner, etc.
                  </p>
                  <textarea
                    className="form-control"
                    rows="6"
                    name="aboutYourself"
                    value={formData.aboutYourself}
                    onChange={handleChange}
                    placeholder="Tell about yourself, your family background, education, career, hobbies, and what you're looking for in a partner..."
                  ></textarea>
                  <div className="form-text">
                    <a href="#">
                      <FaQuestionCircle className="me-1" /> Need help writing?
                    </a>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-light" onClick={prevStep}>
                    Back
                  </button>
                  <button className="btn btn-primary" onClick={nextStep}>
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="phone-verification text-center">
                {!formData.phoneVerified ? (
                  <>
                    <h4 className="mb-4">Phone Verification</h4>
                    <div className="mb-4">
                      <FaPhone
                        className="text-primary mb-3"
                        style={{ fontSize: "3rem" }}
                      />
                      <p>We'll send an OTP to verify your mobile number</p>
                    </div>
                    <div className="mb-4 mx-auto" style={{ maxWidth: "400px" }}>
                      <label className="form-label">Mobile Number *</label>
                      <div className="input-group">
                        <span className="input-group-text">+91</span>
                        <input
                          type="tel"
                          className={`form-control ${
                            errors.phone ? "is-invalid" : ""
                          }`}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength="10"
                          required
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={verifyPhone}>
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <div
                        className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <FaCheck style={{ fontSize: "2rem" }} />
                      </div>
                      <h4 className="my-3">Congratulations!</h4>
                      <p>
                        Your number +91 {formData.phone} is verified
                        successfully.
                      </p>
                    </div>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Complete Registration
                    </button>
                  </>
                )}
              </div>
            )}

            {step < 4 && (
              <div className="mt-5 pt-4 border-top">
                <h5 className="text-center mb-3">WHY REGISTER</h5>
                <div className="row text-center">
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-light rounded h-100">
                      <FaUsers className="text-primary mb-2 fs-4" />
                      <h6 className="mb-0">Lakhs of Genuine Profiles</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-light rounded h-100">
                      <FaCheckCircle className="text-primary mb-2 fs-4" />
                      <h6 className="mb-0">Many Verified by Personal Visit</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-light rounded h-100">
                      <FaLock className="text-primary mb-2 fs-4" />
                      <h6 className="mb-0">Secure & Family Friendly</h6>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="p-3 bg-light rounded h-100">
                      <FaShieldAlt className="text-primary mb-2 fs-4" />
                      <h6 className="mb-0">Strict Privacy Control</h6>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrimonialRegistration;
