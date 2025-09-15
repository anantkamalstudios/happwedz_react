// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// const CustomerRegister = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//         event_location: "",
//         country: "",
//         event_date: "",
//         phone: "",
//     });

//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const validate = () => {
//         const newErrors = {};
//         if (!formData.name.trim()) newErrors.name = "Full name is required";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//             newErrors.email = "Valid email is required";
//         if (formData.password.length < 6)
//             newErrors.password = "Password must be at least 6 characters";
//         if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
//         if (!formData.event_date) newErrors.event_date = "Event date is required";

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));

//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validate()) {
//             setIsSubmitting(true);
//             console.log("Form Data Submitted:", formData);
//             // Simulate API call
//             setTimeout(() => {
//                 alert("Registration successful! We'll contact you soon.");
//                 setIsSubmitting(false);
//             }, 1500);
//         }
//     };

//     return (
//         <div className="container py-5" style={{ maxWidth: "1200px" }}>
//             <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
//                 {/* Left side with elegant background */}
//                 <div
//                     className="col-lg-5 d-none d-lg-block position-relative"
//                     style={{
//                         background:
//                             "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop') center/cover",
//                         minHeight: "600px",
//                     }}
//                 >
//                     <div className="position-absolute bottom-0 start-0 p-5 text-white">
//                         <h2 className="display-5 fw-light mb-3">
//                             Your Perfect Wedding Starts Here
//                         </h2>
//                         <p className="mb-0">
//                             Join thousands of couples who planned their dream wedding with us
//                         </p>
//                     </div>
//                 </div>

//                 {/* Right side form */}
//                 <div className="col-lg-7 p-5">
//                     <div className="text-center mb-5">
//                         <h2 className="fw-bold text-dark mb-2">Wedding Registration</h2>
//                         <p className="text-muted">
//                             Create your account to start planning your special day
//                         </p>
//                     </div>

//                     <form onSubmit={handleSubmit} className="needs-validation" noValidate>
//                         <div className="row g-3 mb-4">
//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         className={`form-control ${errors.name ? "is-invalid" : ""
//                                             }`}
//                                         id="nameInput"
//                                         placeholder="Full Name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                     <label htmlFor="nameInput">Full Name</label>
//                                     {errors.name && (
//                                         <div className="invalid-feedback">{errors.name}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         className={`form-control ${errors.email ? "is-invalid" : ""
//                                             }`}
//                                         id="emailInput"
//                                         placeholder="Email"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                     <label htmlFor="emailInput">Email</label>
//                                     {errors.email && (
//                                         <div className="invalid-feedback">{errors.email}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="password"
//                                         name="password"
//                                         className={`form-control ${errors.password ? "is-invalid" : ""
//                                             }`}
//                                         id="passwordInput"
//                                         placeholder="Password"
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                     <label htmlFor="passwordInput">Password</label>
//                                     {errors.password && (
//                                         <div className="invalid-feedback">{errors.password}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="tel"
//                                         name="phone"
//                                         className={`form-control ${errors.phone ? "is-invalid" : ""
//                                             }`}
//                                         id="phoneInput"
//                                         placeholder="Phone"
//                                         value={formData.phone}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                     <label htmlFor="phoneInput">Phone</label>
//                                     {errors.phone && (
//                                         <div className="invalid-feedback">{errors.phone}</div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="text"
//                                         name="event_location"
//                                         className="form-control"
//                                         id="locationInput"
//                                         placeholder="Event Location"
//                                         value={formData.event_location}
//                                         onChange={handleChange}
//                                     />
//                                     <label htmlFor="locationInput">Wedding Venue</label>
//                                 </div>
//                             </div>

//                             <div className="col-md-6">
//                                 <div className="form-floating">
//                                     <input
//                                         type="text"
//                                         name="country"
//                                         className="form-control"
//                                         id="countryInput"
//                                         placeholder="Country"
//                                         value={formData.country}
//                                         onChange={handleChange}
//                                     />
//                                     <label htmlFor="countryInput">Country</label>
//                                 </div>
//                             </div>

//                             <div className="col-12">
//                                 <div className="form-floating">
//                                     <input
//                                         type="date"
//                                         name="event_date"
//                                         className={`form-control ${errors.event_date ? "is-invalid" : ""
//                                             }`}
//                                         id="dateInput"
//                                         value={formData.event_date}
//                                         onChange={handleChange}
//                                         required
//                                     />
//                                     <label htmlFor="dateInput">Wedding Date</label>
//                                     {errors.event_date && (
//                                         <div className="invalid-feedback">{errors.event_date}</div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="d-grid mb-4">
//                             <button
//                                 type="submit"
//                                 className="btn btn-lg fw-medium py-3"
//                                 disabled={isSubmitting}
//                                 style={{
//                                     background:
//                                         "linear-gradient(135deg, #e93b98ff 0%, #fd76bcff 100%)",
//                                 }}
//                             >
//                                 {isSubmitting ? (
//                                     <span
//                                         className="spinner-border spinner-border-sm me-2"
//                                         role="status"
//                                         aria-hidden="true"
//                                     ></span>
//                                 ) : null}
//                                 Create Wedding Account
//                             </button>
//                         </div>

//                         <div className="text-center d-flex justify-content-between">
//                             <p className="text-muted">
//                                 I have an account?
//                                 <link rel="stylesheet" href="" />
//                                 <Link
//                                     to="/customer-login"
//                                     className="text-decoration-none wedding-link fw-semibold p-2"
//                                 >
//                                     Login
//                                 </Link>
//                             </p>
//                             <p className="text-muted">
//                                 I Am Vendor?
//                                 <a
//                                     href="/vendor-login"
//                                     className="text-decoration-none wedding-link fw-semibold p-2"
//                                 >
//                                     Vendor
//                                 </a>
//                             </p>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CustomerRegister;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    wedding_venues: "",
    country: "",
    city: "",
    event_date: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((res) => {
        const sorted = res.data
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sorted);
      });
  }, []);

  useEffect(() => {
    if (!formData.country) return;

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: formData.country,
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setCities(res.data.data);
        } else {
          setCities([]);
        }
      })
      .catch(() => setCities([]));
  }, [formData.country]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.event_date) newErrors.event_date = "Event date is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      console.log("Form Submitted:", formData);
      setTimeout(() => {
        alert("Registration successful!");
        setIsSubmitting(false);
      }, 1500);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
        <div
          className="col-lg-5 d-none d-lg-block position-relative"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop') center/cover",
            minHeight: "600px",
          }}
        >
          <div className="position-absolute bottom-0 start-0 p-5 text-white">
            <h2 className="display-5 fw-light mb-3">
              Your Perfect Wedding Starts Here
            </h2>
            <p className="mb-0">
              Join thousands of couples who planned their dream wedding with us
            </p>
          </div>
        </div>

        <div className="col-lg-7 p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Wedding Registration</h2>
            <p className="text-muted">
              Create your account to start planning your special day
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label>Full Name</label>
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label>Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label>Password</label>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${
                      errors.phone ? "is-invalid" : ""
                    }`}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label>Phone</label>
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="event_location"
                    className="form-control"
                    id="locationInput"
                    placeholder="Event Location"
                    value={formData.event_location}
                    onChange={handleChange}
                  />
                  <label htmlFor="locationInput">Wedding Venue</label>
                </div>
              </div>

              {/* Country */}
              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    name="country"
                    className={`form-select ${
                      errors.country ? "is-invalid" : ""
                    }`}
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <label>Country</label>
                  {errors.country && (
                    <div className="invalid-feedback">{errors.country}</div>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    name="city"
                    className={`form-select ${errors.city ? "is-invalid" : ""}`}
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Select city</option>
                    {cities.map((city, i) => (
                      <option key={i} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <label>City</label>
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="date"
                    name="event_date"
                    className={`form-control ${
                      errors.event_date ? "is-invalid" : ""
                    }`}
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                  />
                  <label>Wedding Date</label>
                  {errors.event_date && (
                    <div className="invalid-feedback">{errors.event_date}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-grid mb-4">
              <button
                type="submit"
                className="btn btn-lg btn-primary fw-medium py-3"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                )}
                Create Wedding Account
              </button>
            </div>

            <div className="text-center d-flex justify-content-between">
              <p className="text-muted">
                I have an account?
                <Link
                  to="/customer-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Login
                </Link>
              </p>
              <p className="text-muted">
                I Am Vendor?
                <Link
                  to="/vendor-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Vendor
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
