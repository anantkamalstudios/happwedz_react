// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const VendorRegister = () => {

//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     brandName: "",
//     vendorType: "",
//     email: "",
//     password: "",
//     phone: "",
//     city: "",
//     country: "India", // Default country set to India
//   });

//   const [errors, setErrors] = useState({
//     brandName: "",
//     vendorType: "",
//     email: "",
//     password: "",
//     phone: "",
//     city: "",
//   });

//   const [cities, setCities] = useState([]);

//   const togglePasswordVisibility = () => {
//     setPasswordVisible((prev) => !prev);
//   };

//   // Fetch cities of India when the component mounts (useEffect) or the country changes
//   useEffect(() => {
//     if (!formData.country) return;

//     axios
//       .post("https://countriesnow.space/api/v0.1/countries/cities", {
//         country: "India",
//       })
//       .then((res) => {
//         if (res.data && res.data.data) {
//           setCities(res.data.data);
//         } else {
//           setCities([]);
//         }
//       })
//       .catch(() => setCities([]));
//   }, [formData.country]);

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let formErrors = {};

//     if (!formData.brandName.trim()) {
//       formErrors.brandName = "Brand Name is required.";
//     }

//     if (!formData.vendorType) {
//       formErrors.vendorType = "Vendor Type is required.";
//     }

//     if (!formData.email.trim()) {
//       formErrors.email = "Email is required.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       formErrors.email = "Invalid email address.";
//     }

//     if (!formData.phone.trim()) {
//       formErrors.phone = "Phone number is required.";
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       formErrors.phone = "Phone number must be exactly 10 digits.";
//     }

//     if (!formData.password.trim()) {
//       formErrors.password = "Password is required.";
//     }

//     if (!formData.city) {
//       formErrors.city = "City is required.";
//     }

//     setErrors(formErrors);

//     if (Object.keys(formErrors).length === 0) {
//       setIsSubmitting(true);
//       try {
//         // Submit logic here
//         console.log("Form submitted", formData);
//         await new Promise((res) => setTimeout(res, 1500));
//       } catch (err) {
//         console.error("Submit error", err);
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   return (
//     <div className="container py-5" style={{ maxWidth: "1200px" }}>
//       <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
//         {/* Left Image */}
//         <div
//           className="col-lg-5 d-none d-lg-block position-relative"
//           style={{
//             background:
//               "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop') center/cover",
//             minHeight: "600px",
//           }}
//         >
//           <div className="position-absolute bottom-0 start-0 p-5 text-white">
//             <h2 className="display-5 fw-light mb-3">
//               Your Perfect Wedding Starts Here
//             </h2>
//             <p className="mb-0">
//               Join thousands of vendors who help couples plan their dream
//               wedding.
//             </p>
//           </div>
//         </div>

//         {/* Right Form */}
//         <div className="col-lg-7 p-5">
//           <div className="text-center mb-5">
//             <h2 className="fw-bold text-dark mb-2">Vendor Registration</h2>
//             <p className="text-muted">
//               Create your vendor account to start providing services for
//               weddings.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} noValidate>
//             <div className="row g-3 mb-4">
//               {/* Brand Name */}
//               <div className="col-md-6">
//                 <div className="form-floating">
//                   <input
//                     type="text"
//                     name="brandName"
//                     className={`form-control ${errors.brandName ? "is-invalid" : ""
//                       }`}
//                     placeholder="Brand Name"
//                     value={formData.brandName}
//                     onChange={handleChange}
//                   />
//                   <label>Brand Name</label>
//                   {errors.brandName && (
//                     <div className="invalid-feedback">{errors.brandName}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Vendor Type */}
//               <div className="col-md-6">
//                 <div className="form-floating">
//                   <select
//                     name="vendorType"
//                     className={`form-select ${errors.vendorType ? "is-invalid" : ""
//                       }`}
//                     value={formData.vendorType}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select Vendor Type</option>
//                     <option value="venue">Venue</option>
//                     <option value="caterer">Caterer</option>
//                     <option value="photographer">Photographer</option>
//                     <option value="florist">Florist</option>
//                     <option value="dj">DJ</option>
//                     <option value="wedding-planner">Wedding Planner</option>
//                   </select>
//                   <label>Vendor Type</label>
//                   {errors.vendorType && (
//                     <div className="invalid-feedback">{errors.vendorType}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Email + City */}
//               <div className="col-md-6">
//                 <div className="form-floating">
//                   <input
//                     type="email"
//                     name="email"
//                     className={`form-control ${errors.email ? "is-invalid" : ""
//                       }`}
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                   />
//                   <label>Email</label>
//                   {errors.email && (
//                     <div className="invalid-feedback">{errors.email}</div>
//                   )}
//                 </div>
//               </div>

//               <div className="col-md-6">
//                 <div className="form-floating">
//                   <select
//                     name="city"
//                     className={`form-select ${errors.city ? "is-invalid" : ""}`}
//                     value={formData.city}
//                     onChange={handleChange}
//                   >
//                     <option value="">Select city</option>
//                     {cities.map((city, i) => (
//                       <option key={i} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   <label>City</label>
//                   {errors.city && (
//                     <div className="invalid-feedback">{errors.city}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Password with view/hide toggle */}
//               <div className="col-md-6">
//                 <div className="form-floating position-relative">
//                   <input
//                     type={passwordVisible ? "text" : "password"}
//                     name="password"
//                     className={`form-control ${errors.password ? "is-invalid" : ""
//                       }`}
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                   <label>Password</label>
//                   <button
//                     type="button"
//                     className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
//                     onClick={togglePasswordVisibility}
//                   >
//                     <i
//                       className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"
//                         }`}
//                     ></i>
//                   </button>
//                   {errors.password && (
//                     <div className="invalid-feedback">{errors.password}</div>
//                   )}
//                 </div>
//               </div>

//               {/* Phone */}
//               <div className="col-md-6">
//                 <div className="form-floating">
//                   <input
//                     type="tel"
//                     name="phone"
//                     className={`form-control ${errors.phone ? "is-invalid" : ""
//                       }`}
//                     placeholder="Phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                   />
//                   <label>Phone</label>
//                   {errors.phone && (
//                     <div className="invalid-feedback">{errors.phone}</div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="d-grid mb-4">
//               <button
//                 type="submit"
//                 className="btn btn-lg btn-primary fw-medium py-3"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting && (
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                 )}
//                 Create Vendor Account
//               </button>
//             </div>

//             <div className="text-center d-flex justify-content-between">
//               <p className="text-muted">
//                 I have an account?
//                 <Link
//                   to="/vendor-login"
//                   className="fw-semibold px-2 wedding-link"
//                 >
//                   Vendor Login
//                 </Link>
//               </p>
//               <p className="text-muted">
//                 I Am a Customer?
//                 <Link
//                   to="/customer-login"
//                   className="fw-semibold px-2 wedding-link"
//                 >
//                   Customer Login
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorRegister;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setVendorCredentials } from "../../redux/vendorAuthSlice";
import vendorsAuthApi from "../../services/api/vendorAuthApi";

const API_BASE = "https://happywedz.com/api";
const VendorRegister = () => {

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brandName: "",
    vendorType: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "India",
  });

  const [errors, setErrors] = useState({
    brandName: "",
    vendorType: "", // Changed businessName to brandName to match the form
    email: "",
    password: "",
    phone: "",
    city: "",
  });

  const [cities, setCities] = useState([]);
  const [vendorTypes, setVendorTypes] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Fetch cities of India when the component mounts (useEffect) or the country changes
  useEffect(() => {
    if (!formData.country) return;

    axios
      .post("https://countriesnow.space/api/v0.1/countries/cities", {
        country: "India",
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

  // Fetch vendor types
  useEffect(() => {
    axios
      .get(`${API_BASE}/vendor-types`)
      .then((res) => {
        if (res.data) {
          setVendorTypes(res.data);
        } else {
          setVendorTypes([]);
        }
      })
      .catch((err) => console.error("Error fetching vendor types:", err));
  }, []);


  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    if (!formData.brandName.trim()) {
      formErrors.brandName = "Brand Name is required.";
    }

    if (!formData.vendorType) {
      formErrors.vendorType = "Vendor Type is required.";
    }

    if (!formData.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Invalid email address.";
    }

    if (!formData.phone?.trim()) {
      formErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      formErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!formData.password.trim()) {
      formErrors.password = "Password is required.";
    }

    if (!formData.city) {
      formErrors.city = "City is required.";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Submit logic here
        console.log("Form submitted", formData);
        const payload = {
          businessName: formData.brandName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          city: formData.city,
          vendor_type_id: formData.vendorType, // Send vendor type ID
        };

        console.log("Payload being sent:", payload);
        const data = await vendorsAuthApi.register(payload);

        // Some backends return token on register, others don't.
        const token = data?.data?.token || data?.token;
        const vendor = data?.data?.vendor || data?.vendor || {
          businessName: formData.brandName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          vendor_type_id: formData.vendorType,
        };

        if (token && vendor) {
          dispatch(setVendorCredentials({ token, vendor }));
          navigate("/vendor-dashboard/vendor-home", { replace: true });
        } else {
          // If no token (likely verify email flow), send to login
          navigate("/vendor-login", { replace: true });
        }
      } catch (err) {
        console.log("Error response:", err.response);
        console.error("Submit error", err);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "1200px" }}>
      <div className="row g-0 shadow-lg rounded-4 overflow-hidden bg-white">
        {/* Left Image */}
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
              Join thousands of vendors who help couples plan their dream
              wedding.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="col-lg-7 p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Vendor Registration</h2>
            <p className="text-muted">
              Create your vendor account to start providing services for
              weddings.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-4">
              {/* Brand Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    name="brandName"
                    className={`form-control ${errors.brandName ? "is-invalid" : ""
                      }`}
                    placeholder="Brand Name"
                    value={formData.brandName}
                    onChange={handleChange}
                  />
                  <label>Brand Name</label>
                  {errors.brandName && (
                    <div className="invalid-feedback">{errors.brandName}</div>
                  )}
                </div>
              </div>

              {/* Vendor Type */}
              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    name="vendorType"
                    className={`form-select ${errors.vendorType ? "is-invalid" : ""
                      }`}
                    value={formData.vendorType}
                    onChange={handleChange}
                  >
                    <option value="">Select Vendor Type</option>
                    {vendorTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                    <option value="wedding-planner">Wedding Planner</option>
                  </select>
                  <label>Vendor Type</label>
                  {errors.vendorType && (
                    <div className="invalid-feedback">{errors.vendorType}</div>
                  )}
                </div>
              </div>

              {/* Email + City */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""
                      }`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label>Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
              </div>

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

              {/* Password with view/hide toggle */}
              <div className="col-md-6">
                <div className="form-floating position-relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""
                      }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label>Password</label>
                  <button
                    type="button"
                    className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    <i
                      className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"
                        }`}
                    ></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? "is-invalid" : ""
                      }`}
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <label>Phone</label>
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
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
                {isSubmitting ? ( // Wrap the conditional expression in curly braces
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : null}
                Create Vendor Account
              </button>
            </div>

            <div className="text-center d-flex justify-content-between">
              <p className="text-muted">
                I have an account?
                <Link
                  to="/vendor-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Vendor Login
                </Link>
              </p>
              <p className="text-muted">
                I Am a Customer?
                <Link
                  to="/customer-login"
                  className="fw-semibold px-2 wedding-link"
                >
                  Customer Login
                </Link>
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default VendorRegister;