// import React, { useState } from "react";
// import { Modal, Button, Toast } from "react-bootstrap";

// const VendorBasicInfo = ({ formData, setFormData }) => {
//   // Modal state for vendor request
//   const [showModal, setShowModal] = useState(false);
//   const [requestCategory, setRequestCategory] = useState("");
//   const [requestMsg, setRequestMsg] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   return (
//     <div className="my-5">
//       <div className="p-3 border rounded bg-white">
//         <h6 className="mb-3 fw-bold">Basic Information</h6>
//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Vendor Name *</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, name: e.target.value }))
//               }
//               placeholder="Enter vendor name"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Slug</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.slug}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, slug: e.target.value }))
//               }
//               placeholder="vendor-name-slug"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Tagline</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.tagline}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, tagline: e.target.value }))
//               }
//               placeholder="Short catchy tagline"
//             />
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Subtitle</label>
//             <input
//               type="text"
//               className="form-control"
//               value={formData.subtitle}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
//               }
//               placeholder="Brief subtitle"
//             />
//           </div>
//           <div className="col-12 mb-3">
//             <label className="form-label fw-semibold">Description</label>
//             <textarea
//               className="form-control"
//               rows="4"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   description: e.target.value,
//                 }))
//               }
//               placeholder="Detailed description of your business"
//             />
//           </div>
//           <div className="col-md-6 mb-3 position-relative">
//             <label className="form-label fw-semibold">Vendor Type</label>
//             <select
//               className="form-select"
//               value={formData.vendorType}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, vendorType: e.target.value }))
//               }
//             >
//               <option value="venue">Venue</option>
//               <option value="caterer">Caterer</option>
//               <option value="photographer">Photographer</option>
//               <option value="decorator">Decorator</option>
//               <option value="dj">DJ</option>
//               <option value="makeup">Makeup Artist</option>
//               <option value="other">Other</option>
//             </select>
//             {/* Clickable Note */}
//             <div
//               className="vendor-note mt-2 fw-semibold text-decoration-underline"
//               style={{ cursor: "pointer", fontSize: "14px", color: "red" }}
//               onClick={() => setShowModal(true)}
//               tabIndex={0}
//               role="button"
//             >
//               Note: If you want a different category, reach out to admin.
//             </div>
//             {/* Modal for request */}
//             <Modal
//               show={showModal}
//               onHide={() => setShowModal(false)}
//               centered
//               dialogClassName="vendor-request-modal"
//             >
//               <Modal.Header closeButton>
//                 <Modal.Title>Request New Category</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <div className="mb-3">
//                   <label className="form-label">Category Type</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={requestCategory}
//                     onChange={(e) => setRequestCategory(e.target.value)}
//                     placeholder="e.g. Haldi, Mehndi, etc."
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label className="form-label">Message</label>
//                   <textarea
//                     className="form-control"
//                     rows={3}
//                     value={requestMsg}
//                     onChange={(e) => setRequestMsg(e.target.value)}
//                     placeholder="Briefly describe why you need this category."
//                   />
//                 </div>
//               </Modal.Body>
//               <Modal.Footer>
//                 <button
//                   className="btn btn-primary mt-2 w-100 "
//                   onClick={() => {
//                     setShowModal(false);
//                     setShowToast(true);
//                     setRequestCategory("");
//                     setRequestMsg("");
//                   }}
//                   disabled={!requestCategory || !requestMsg}
//                 >
//                   Save Basic Info
//                 </button>
//               </Modal.Footer>
//             </Modal>
//             {/* Toast for feedback */}
//             <Toast
//               show={showToast}
//               onClose={() => setShowToast(false)}
//               delay={3000}
//               autohide
//               style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
//             >
//               <Toast.Header>
//                 <strong className="me-auto">Info</strong>
//               </Toast.Header>
//               <Toast.Body>Thank you! We'll inform you soon.</Toast.Body>
//             </Toast>
//           </div>
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Status</label>
//             <select
//               className="form-select"
//               value={formData.status}
//               onChange={(e) =>
//                 setFormData((prev) => ({ ...prev, status: e.target.value }))
//               }
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//               <option value="archived">Archived</option>
//             </select>
//           </div>
//         </div>
//         <button className="btn btn-primary mt-2">Save Basic Info</button>
//       </div>
//     </div>
//   );
// };

// export default VendorBasicInfo;





import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal, Toast } from "react-bootstrap";
import axios from "axios";

const VendorBasicInfo = ({ formData, setFormData, onSave }) => {
  const { vendor } = useSelector((state) => state.vendorAuth);

  const [vendorTypeName, setVendorTypeName] = useState("Loading...");
  const [subCategories, setSubCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [requestCategory, setRequestCategory] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Prefill formData.attributes when vendor loads
  useEffect(() => {
    if (vendor) {
      setFormData((prev) => ({
        ...prev,
        vendor_subcategory_id: prev.vendor_subcategory_id || vendor.vendor_subcategory_id || "",
        vendor_type_id: vendor.vendor_type_id,
        attributes: {
          ...prev.attributes,
          name: prev.attributes?.name || vendor.businessName || "",
          slug: prev.attributes?.slug || "",
          tagline: prev.attributes?.tagline || "",
          subtitle: prev.attributes?.subtitle || "",
          description: prev.attributes?.description || "",
        },
        status: prev.status || vendor.status || "draft",
      }));
    }
  }, [vendor, setFormData]);

  // Fetch Vendor Type Name + Subcategories
  useEffect(() => {
    const fetchVendorType = async () => {
      if (vendor?.vendor_type_id) {
        try {
          const response = await axios.get(
            `https://happywedz.com/api/vendor-types/${vendor.vendor_type_id}`
          );
          const vendorTypeData = response.data; // API should return a single object for a given ID
          setVendorTypeName(vendorTypeData?.name || "Unknown Type");
          setSubCategories(vendorTypeData?.subcategories || []);
        } catch (err) {
          console.error("Failed to fetch vendor type + subcategories:", err.response?.data || err);
          setVendorTypeName("Could not load type");
          setSubCategories([]);
        }
      }
    };
    fetchVendorType();
  }, [vendor?.vendor_type_id, setFormData]);

  // Update attributes in formData
  const handleAttributeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updatedAttributes = { ...prev.attributes, [name]: value };
      if (name === "name" && !prev.attributes?.slug) {
        updatedAttributes.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
      }
      return { ...prev, attributes: updatedAttributes };
    });
  };

  // Update root-level fields (like status)
  const handleRootChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="my-5">
      <div className="p-3 border rounded bg-white">
        <h6 className="mb-3 fw-bold">Basic Information</h6>
        <div className="row">
          {/* Vendor Name */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Vendor Name </label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.attributes?.businessName || ""}
              onChange={handleAttributeChange}
              placeholder="Enter vendor name"
            />
          </div>

          {/* Slug */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Slug</label>
            <input
              type="text"
              name="slug"
              className="form-control"
              value={formData.attributes?.slug || ""}
              onChange={handleAttributeChange}
              placeholder="vendor-name-slug"
            />
          </div>

          {/* Tagline */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Tagline</label>
            <input
              type="text"
              name="tagline"
              className="form-control"
              value={formData.attributes?.tagline || ""}
              onChange={handleAttributeChange}
              placeholder="Short catchy tagline"
            />
          </div>

          {/* Subtitle */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              className="form-control"
              value={formData.attributes?.subtitle || ""}
              onChange={handleAttributeChange}
              placeholder="Brief subtitle"
            />
          </div>

          {/* Description */}
          <div className="col-12 mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="4"
              value={formData.attributes?.description || ""}
              onChange={handleAttributeChange}
              placeholder="Detailed description of your business"
            />
          </div>

          {/* Vendor Type */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Vendor Type</label>
            <input
              type="text"
              className="form-control"
              value={vendorTypeName}
              disabled
            />

            {/* Subcategories */}
            <div className="mt-3">
              <label className="form-label fw-semibold">
                Primary Subcategory *
              </label>
              <select
                name="vendor_subcategory_id"
                className="form-select"
                value={formData.vendor_subcategory_id || ""}
                onChange={handleRootChange}
                required
              >
                <option value="" disabled>
                  -- Select a subcategory --
                </option>
                {subCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {formData.vendor_subcategory_id && (
                <div className="mt-2 p-2 bg-light border rounded small">
                  <strong>Selected: </strong>
                  {subCategories.find(
                    (s) => s.id == formData.vendor_subcategory_id
                  )?.name || "..."}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status || "draft"}
              onChange={handleRootChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <button type="button" className="btn btn-primary mt-2" onClick={onSave}>
          Save Basic Info
        </button>
      </div>
    </div>
  );
};

export default VendorBasicInfo;
