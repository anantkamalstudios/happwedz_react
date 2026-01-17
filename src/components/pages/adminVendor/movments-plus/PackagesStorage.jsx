import React, { useState, useEffect } from "react";
import axiosInstance from "../../../../services/api/axiosInstance";
import Loader from "../../../ui/Loader";
import "./packages.css";
import { CiStar } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

const PackagesStorage = () => {
  const [availablePackages, setAvailablePackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardRes = await axiosInstance.get(
          "/vendor/dashboard/analytics"
        );
        if (dashboardRes.data.success) {
          setCurrentPackage(dashboardRes.data.package);
        }

        const packagesRes = await axiosInstance.get("/admin/package");
        const list = Array.isArray(packagesRes.data?.packages)
          ? packagesRes.data.packages
          : [];
        setAvailablePackages(list);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPackage || !message.trim()) {
      setResponseMessage({
        type: "error",
        text: "Please select a package and enter a message.",
      });
      return;
    }

    const submitRequest = async () => {
      try {
        setSubmitting(true);
        setResponseMessage(null);
        const res = await axiosInstance.post(
          "/vendor/request-package-upgrade",
          {
            package_id: selectedPackage.id,
            message: message.trim(),
          }
        );
        const msg =
          res.data?.message || "Your package upgrade request has been sent.";
        setResponseMessage({ type: "success", text: msg });
        setMessage("");
        setSelectedPackage(null);
      } catch (err) {
        setResponseMessage({
          type: "error",
          text:
            err.response?.data?.message || "Failed to submit upgrade request.",
        });
      } finally {
        setSubmitting(false);
      }
    };

    submitRequest();
  };

  if (loading) {
    return (
      <div
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="packages-storage-container">
      <div className="packages-header mb-5">
        <h1 className="packages-main-title inter">Packages & Storage</h1>
        <p className="packages-subtitle inter">
          Choose the perfect plan for your photography business
        </p>
      </div>

      {error && (
        <div className="custom-alert custom-alert-danger inter mb-4">
          {error}
        </div>
      )}

      <div className="packages-grid mb-5">
        {availablePackages.map((pkg, index) => {
          const isCurrent =
            currentPackage?.name &&
            pkg.name &&
            pkg.name.toLowerCase() === currentPackage.name.toLowerCase();
          const isSelected = selectedPackage?.id === pkg.id;
          const isMostPopular = pkg.name.toLowerCase() === "standard";
          const features = pkg.message
            ? pkg.message.split("\n").filter((f) => f.trim())
            : [];

          return (
            <div
              key={pkg.id}
              className={`package-card-wrapper ${
                isSelected ? "selected-card" : ""
              } ${isCurrent ? "current-card" : ""} ${
                isMostPopular ? "popular-card" : ""
              }`}
              onClick={() => {
                if (isCurrent) return;
                setSelectedPackage(pkg);
                setResponseMessage(null);
              }}
            >
              {isMostPopular && !isCurrent && (
                <div className="popular-badge inter">
                  <span className="star-icon">
                    <CiStar />
                  </span>
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="current-badge inter">✓ Current Plan</div>
              )}

              <div className="package-card-header">
                <h3 className="package-name inter">{pkg.name}</h3>
                <p className="package-storage-info inter">
                  {pkg.storage_limit_gb} GB Storage
                </p>
              </div>

              <div className="package-pricing">
                <div className="package-price inter">
                  <span className="currency">₹</span>
                  {Number(pkg.price).toLocaleString("en-IN")}
                </div>
                <p className="package-billing inter">
                  Per month, {pkg.duration_days} days validity
                </p>
              </div>

              <ul className="package-features-list inter">
                {features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="fs-16">
                      <IoCheckmark />
                    </span>
                    <span className="fs-16">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`package-select-btn inter ${
                  isCurrent ? "btn-disabled" : "btn-primary-pink"
                }`}
                disabled={isCurrent}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrent) return;
                  setSelectedPackage(pkg);
                  setResponseMessage(null);
                }}
              >
                {isCurrent ? "Current Plan" : `Select ${pkg.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div className="request-upgrade-section">
        <div className="request-header">
          <h2 className="request-title inter">Request Package Upgrade</h2>
          <p className="request-description inter">
            {selectedPackage
              ? `You've selected the ${selectedPackage.name} plan. Send a message to admin to proceed.`
              : "Select a package above to request an upgrade"}
          </p>
        </div>

        <div className="request-form-container">
          <div className="form-group-custom">
            <label className="form-label-custom inter">Message to Admin</label>
            <textarea
              className="form-textarea-custom inter"
              rows={4}
              placeholder={
                selectedPackage
                  ? `I would like to upgrade to the ${selectedPackage.name} plan. Please process my request.`
                  : "Select a package above to continue..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!selectedPackage}
            />
            {!selectedPackage && (
              <small className="form-helper-text inter">
                Please select a package above to enable the message field.
              </small>
            )}
          </div>

          {responseMessage && (
            <div
              className={`custom-alert inter ${
                responseMessage.type === "success"
                  ? "custom-alert-success"
                  : "custom-alert-danger"
              }`}
            >
              {responseMessage.text}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="submit-request-btn inter btn-primary-pink"
              disabled={submitting || !selectedPackage || !message.trim()}
              onClick={handleSubmit}
            >
              {submitting ? "Sending Request..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesStorage;

// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../../../services/api/axiosInstance";
// import Loader from "../../../ui/Loader";
// import "./packages.css";

// const PackagesStorage = () => {
//   const [availablePackages, setAvailablePackages] = useState([]);
//   const [currentPackage, setCurrentPackage] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [message, setMessage] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [responseMessage, setResponseMessage] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch current package info
//         const dashboardRes = await axiosInstance.get(
//           "/vendor/dashboard/analytics"
//         );
//         if (dashboardRes.data.success) {
//           setCurrentPackage(dashboardRes.data.package);
//         }

//         // Fetch available packages
//         const packagesRes = await axiosInstance.get("/admin/package");
//         const list = Array.isArray(packagesRes.data?.packages)
//           ? packagesRes.data.packages
//           : [];
//         setAvailablePackages(list);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedPackage || !message.trim()) {
//       setResponseMessage({
//         type: "error",
//         text: "Please select a package and enter a message.",
//       });
//       return;
//     }
//     try {
//       setSubmitting(true);
//       setResponseMessage(null);
//       const res = await axiosInstance.post("/vendor/request-package-upgrade", {
//         package_id: selectedPackage.id,
//         message: message.trim(),
//       });
//       const msg =
//         res.data?.message || "Your package upgrade request has been sent.";
//       setResponseMessage({ type: "success", text: msg });
//       setMessage("");
//     } catch (err) {
//       setResponseMessage({
//         type: "error",
//         text:
//           err.response?.data?.message || "Failed to submit upgrade request.",
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="w-100 d-flex justify-content-center py-5">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <div className="movments-plus-dashboard-container">
//       <div className="dashboard-header px-0 mb-4">
//         <div className="header-left w-100 px-2">
//           <h3 className="dashboard-title text-start text-black">
//             Packages & Storage
//           </h3>
//           <p className="text-muted">
//             Manage your subscription plan and storage capacity
//           </p>
//         </div>
//       </div>

//       {error && <div className="alert alert-danger mb-3">{error}</div>}

//       <div className="content-card mb-4">
//         <div className="card-header">
//           <h5>Available Plans</h5>
//           {currentPackage && (
//             <span className="badge bg-light text-dark border">
//               Current: {currentPackage.name}
//             </span>
//           )}
//         </div>
//         <div className="p-4">
//           <div className="row g-4">
//             {availablePackages.map((item) => {
//               const isCurrent =
//                 currentPackage?.name &&
//                 item.name &&
//                 item.name.toLowerCase() === currentPackage.name.toLowerCase();
//               const isSelected = selectedPackage?.id === item.id;

//               return (
//                 <div key={item.id} className="col-md-4 col-lg-4">
//                   <div
//                     className={`plan-card ${
//                       isSelected ? "selected" : ""
//                     } h-100`}
//                     onClick={() => {
//                       if (isCurrent) return;
//                       setSelectedPackage(item);
//                       setResponseMessage(null);
//                     }}
//                     style={{
//                       cursor: isCurrent ? "default" : "pointer",
//                       display: "flex",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <div className="plan-header d-flex justify-content-between align-items-center">
//                       <div className="d-flex flex-column">
//                         <span className="plan-name">{item.name}</span>
//                         <span className="plan-meta">
//                           {item.storage_limit_gb} GB storage •{" "}
//                           {item.duration_days} days
//                         </span>
//                       </div>
//                       {isCurrent && (
//                         <span className="badge bg-success">Active</span>
//                       )}
//                     </div>
//                     <div className="plan-price my-3">
//                       ₹{Number(item.price).toLocaleString("en-IN")}
//                     </div>
//                     <ul className="plan-features flex-grow-1">
//                       <li>Access to core vendor tools</li>
//                       <li>Gallery and media management</li>
//                       <li>Lead and enquiry tracking</li>
//                     </ul>
//                     <button
//                       type="button"
//                       className={`btn-primary w-100 mt-3 ${
//                         isCurrent ? "disabled" : ""
//                       }`}
//                       disabled={isCurrent}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         if (isCurrent) return;
//                         setSelectedPackage(item);
//                       }}
//                     >
//                       {isCurrent ? "Current Plan" : `Select ${item.name}`}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="content-card">
//         <div className="card-header">
//           <h5>Request Upgrade</h5>
//         </div>
//         <div className="p-4">
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Message to Admin</label>
//               <textarea
//                 className="form-control"
//                 rows={3}
//                 placeholder={
//                   selectedPackage
//                     ? `I would like to upgrade to the ${selectedPackage.name} plan...`
//                     : "Select a package above to continue..."
//                 }
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 disabled={!selectedPackage}
//               />
//               {!selectedPackage && (
//                 <small className="text-muted">
//                   Please select a package above to enable the message field.
//                 </small>
//               )}
//             </div>
//             {responseMessage && (
//               <div
//                 className={`alert ${
//                   responseMessage.type === "success"
//                     ? "alert-success"
//                     : "alert-danger"
//                 } mb-3`}
//               >
//                 {responseMessage.text}
//               </div>
//             )}
//             <div className="d-flex justify-content-end">
//               <button
//                 type="submit"
//                 className="btn-primary"
//                 disabled={submitting || !selectedPackage || !message.trim()}
//               >
//                 {submitting ? "Sending Request..." : "Submit Request"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PackagesStorage;
