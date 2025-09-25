// import { useState } from "react";
// import { BsPlusLg } from "react-icons/bs";
// import { FaCheck, FaHeart } from "react-icons/fa6";
// import { Link, useNavigate } from "react-router-dom";
// import { PiChatCircleDotsLight } from "react-icons/pi";
// import PricingModal from "../../../layouts/PricingModal";
// import { GoPlus } from "react-icons/go";
// import { MdOutlineCancel } from "react-icons/md";
// import { IoClose } from "react-icons/io5";

// // Sample wishlist data - replace with your API data
// const wishlistData = [
//   {
//     id: 1,
//     image:
//       "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     title: "Priyal Digital Photography",
//     subtitle: "Professional Wedding Photography | Nashik, Maharashtra",
//     status: "Evaluating",
//     rating: 4,
//     pricing: "₹45,000",
//     phone: "+91 98765 43210",
//     note: "Excellent portfolio, need to check availability for December dates",
//   },
//   {
//     id: 2,
//     image:
//       "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     title: "Royal Banquet Hall",
//     subtitle: "Premium Wedding Venue | Panchavati, Nashik",
//     status: "Negotiation",
//     rating: 5,
//     pricing: "₹2,50,000",
//     phone: "+91 87654 32109",
//     note: "",
//   },
//   {
//     id: 3,
//     image:
//       "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
//     title: "Spice Garden Caterers",
//     subtitle: "Multi-Cuisine Wedding Catering | Nashik",
//     status: "Preselecting",
//     rating: 4,
//     pricing: "₹850/plate",
//     phone: "+91 76543 21098",
//     note: "Great food quality, discussing menu options",
//   },
// ];

// const categories = [
//   { name: "Venues", count: 2, slug: "venues" },
//   { name: "Photography", count: 1, slug: "photography" },
//   { name: "Caterers", count: 1, slug: "caterers" },
//   { name: "Decorations", count: 0, slug: "decorations" },
//   { name: "Music & DJ", count: 0, slug: "dj" },
// ];

// // Main Wishlist Component
// export default function WishList() {
//   const [wishlist, setWishlist] = useState(wishlistData);
//   const [showNoteInput, setShowNoteInput] = useState({});
//   const [show, setShow] = useState(false);
//   const navigate = useNavigate();

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   // Remove item from wishlist
//   const removeFromWishlist = (id) => {
//     setWishlist(wishlist.filter((item) => item.id !== id));
//   };

//   // Update status
//   const updateStatus = (id, newStatus) => {
//     setWishlist(
//       wishlist.map((item) =>
//         item.id === id ? { ...item, status: newStatus } : item
//       )
//     );
//   };

//   // Update rating
//   const updateRating = (id, newRating) => {
//     setWishlist(
//       wishlist.map((item) =>
//         item.id === id ? { ...item, rating: newRating } : item
//       )
//     );
//   };

//   // Update pricing
//   const updatePricing = (id, newPricing) => {
//     setWishlist(
//       wishlist.map((item) =>
//         item.id === id ? { ...item, pricing: newPricing } : item
//       )
//     );
//   };

//   // Update note
//   const updateNote = (id, newNote) => {
//     setWishlist(
//       wishlist.map((item) =>
//         item.id === id ? { ...item, note: newNote } : item
//       )
//     );
//     setShowNoteInput({ ...showNoteInput, [id]: false });
//   };

//   // Toggle note input
//   const toggleNoteInput = (id) => {
//     setShowNoteInput({ ...showNoteInput, [id]: !showNoteInput[id] });
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case "Not Available":
//         return "bg-danger";
//       case "Evaluating":
//         return "bg-warning";
//       case "Preselecting":
//         return "bg-info";
//       case "Negotiation":
//         return "bg-primary";
//       case "Hired":
//         return "bg-success";
//       default:
//         return "bg-secondary";
//     }
//   };

//   return (
//     <>
//       <div className="container py-4">
//         <div className="row g-4">
//           {/* Professional Sidebar */}
//           <div className="col-lg-3">
//             <div
//               className="bg-white rounded-4 shadow-sm border-0 p-4 sticky-top"
//               style={{ top: "20px" }}
//             >
//               {/* Search Section */}
//               <div className="mb-4">
//                 <h6
//                   className="text-uppercase fw-bold text-muted mb-3"
//                   style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
//                 >
//                   Your Search
//                 </h6>
//                 <div className="position-relative">
//                   <input
//                     type="text"
//                     className="form-control border-2 rounded-3 pe-5"
//                     value="Wedding Services"
//                     readOnly
//                     style={{ backgroundColor: "#f8f9fa", fontSize: "0.95rem" }}
//                   />
//                   <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
//                 </div>
//               </div>

//               <div>
//                 <h6
//                   className="text-uppercase fw-bold text-muted mb-3"
//                   style={{ fontSize: "0.85rem", letterSpacing: "0.5px" }}
//                 >
//                   By Category
//                 </h6>
//                 <div className="list-group list-group-flush">
//                   {categories.map((category, index) => (
//                     <Link
//                       key={index}
//                       to={`/venues/${category.slug}`}
//                       style={{ textDecoration: "none" }}
//                     >
//                       <div className="list-group-item border-0 px-0 py-3 d-flex justify-content-between align-items-center">
//                         <span
//                           className="fw-medium text-dark"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           {category.name}
//                         </span>
//                         <span
//                           className={`badge rounded-pill ${
//                             category.count > 0
//                               ? "bg-primary"
//                               : "bg-light text-muted"
//                           } px-3`}
//                         >
//                           {category.count}
//                         </span>
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </div>

//               {/* Statistics */}
//               <div className="mt-4 pt-4 border-top">
//                 <div className="text-center">
//                   <div className="fw-bold text-primary fs-4 mb-1">
//                     {wishlist.length}
//                   </div>
//                   <div className="text-muted small">Items in Wishlist</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="col-lg-9">
//             {/* Header */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h2 className="fw-bold text-dark mb-1">My Wishlist</h2>
//                 <p className="text-muted mb-0">
//                   Manage your selected wedding services
//                 </p>
//               </div>
//               <button className="btn btn-primary rounded-3 px-4">
//                 <i className="bi bi-plus-lg me-2"></i>
//                 Add Vendor
//               </button>
//             </div>

//             {/* Wishlist Cards */}
//             <div className="row g-4">
//               {wishlist.map((item) => (
//                 <div key={item.id} className="col-xl-6 col-12">
//                   <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
//                     {/* Card Header with Image */}
//                     <div className="position-relative">
//                       <img
//                         src={item.image}
//                         alt={item.title}
//                         className="card-img-top"
//                         style={{ height: "220px", objectFit: "cover" }}
//                       />

//                       <button
//                         type="button"
//                         className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center rounded-circle shadow"
//                         style={{
//                           width: "36px",
//                           height: "36px",
//                           backgroundColor: "#fff",
//                           border: "none",
//                         }}
//                         onClick={() => removeFromWishlist(item.id)}
//                         aria-label="Remove from wishlist"
//                       >
//                         <IoClose size={22} />
//                       </button>

//                       {/* Status Badge */}
//                       <div className="position-absolute bottom-0 start-0 m-3">
//                         <span
//                           className={`badge ${getStatusBadgeClass(
//                             item.status
//                           )} px-3 py-2 rounded-pill`}
//                         >
//                           {item.status}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="card-body p-4">
//                       {/* Title & Subtitle */}
//                       <div className="mb-3">
//                         <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
//                         <p
//                           className="text-muted mb-0"
//                           style={{ fontSize: "0.95rem" }}
//                         >
//                           {item.subtitle}
//                         </p>
//                       </div>

//                       {/* Status Dropdown */}
//                       <div className="mb-3">
//                         <label className="form-label fw-semibold text-muted small mb-2">
//                           STATUS
//                         </label>
//                         <select
//                           className="form-select border-2 rounded-3"
//                           value={item.status}
//                           onChange={(e) =>
//                             updateStatus(item.id, e.target.value)
//                           }
//                         >
//                           <option>Not Available</option>
//                           <option>Evaluating</option>
//                           <option>Preselecting</option>
//                           <option>Negotiation</option>
//                           <option>Hired</option>
//                         </select>
//                       </div>

//                       {/* Rating & Pricing Row */}
//                       <div className="row g-3 mb-3">
//                         <div className="col-7">
//                           <label className="form-label fw-semibold text-muted small mb-2">
//                             WHAT DO YOU THINK
//                           </label>
//                           <div className="d-flex align-items-center">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                               <button
//                                 key={star}
//                                 className="btn btn-sm p-0 me-1 border-0 bg-transparent"
//                                 onClick={() => updateRating(item.id, star)}
//                               >
//                                 <FaHeart
//                                   size={20}
//                                   color={star <= item.rating ? "red" : "#ccc"}
//                                   style={{
//                                     cursor: "pointer",
//                                     transition: "0.2s",
//                                   }}
//                                 />
//                               </button>
//                             ))}
//                           </div>
//                         </div>
//                         <div className="col-5">
//                           <label className="form-label fw-semibold text-muted small mb-2">
//                             PRICING
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control border-2 rounded-3"
//                             value={item.pricing}
//                             onChange={(e) =>
//                               updatePricing(item.id, e.target.value)
//                             }
//                             placeholder="Enter price"
//                           />
//                         </div>
//                       </div>

//                       {/* Notes Section */}
//                       <div className="mb-3">
//                         <div className="d-flex justify-content-between align-items-center mb-2">
//                           <label className="form-label fw-semibold text-muted small mb-0">
//                             NOTES
//                           </label>
//                           <button
//                             className="btn btn-primary rounded-pill px-3 d-flex align-items-center"
//                             onClick={() => toggleNoteInput(item.id)}
//                           >
//                             {showNoteInput[item.id] ? (
//                               <>
//                                 <MdOutlineCancel size={15} className="me-2" />
//                                 <span>Cancel</span>
//                               </>
//                             ) : (
//                               <>
//                                 <GoPlus size={15} className="me-2" />
//                                 <span>Add Note</span>
//                               </>
//                             )}
//                           </button>
//                         </div>

//                         {showNoteInput[item.id] ? (
//                           <div className="d-flex gap-2 mt-3">
//                             <input
//                               type="text"
//                               className="form-control border-2 rounded-3"
//                               placeholder="Add your note..."
//                               defaultValue={item.note}
//                               onKeyPress={(e) => {
//                                 if (e.key === "Enter") {
//                                   updateNote(item.id, e.target.value);
//                                 }
//                               }}
//                             />
//                             <button
//                               className="btn btn-primary rounded-2"
//                               onClick={(e) => {
//                                 const input = e.target.previousElementSibling;
//                                 updateNote(item.id, input.value);
//                               }}
//                             >
//                               <FaCheck size={10} />
//                             </button>
//                           </div>
//                         ) : (
//                           item.note && (
//                             <div className="bg-light rounded-3 p-3">
//                               <p
//                                 className="mb-0 text-muted"
//                                 style={{ fontSize: "0.9rem" }}
//                               >
//                                 {item.note}
//                               </p>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </div>

//                     {/* Card Footer */}
//                     {/* <div className="card-footer bg-light border-0 p-4">
//                       <div className="d-flex justify-content-center align-items-center text-center">
//                         <button
//                           className="btn btn-primary rounded-3 px-4"
//                           onClick={handleShow}
//                         >
//                           <PiChatCircleDotsLight className="me-2" size={18} />
//                           Connect Us
//                         </button>
//                       </div>
//                     </div> */}
//                     <div className="card-footer bg-light border-0 p-4">
//                       <div className="d-flex justify-content-center align-items-center text-center">
//                         <button
//                           className="btn btn-primary rounded-3 px-4"
//                           onClick={() => navigate("/user-dashboard/message")} // Change here
//                         >
//                           <PiChatCircleDotsLight className="me-2" size={18} />
//                           Connect Us
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {wishlist.length === 0 && (
//               <div className="text-center py-5">
//                 <div className="mb-4">
//                   <i
//                     className="bi bi-heart text-muted"
//                     style={{ fontSize: "4rem" }}
//                   ></i>
//                 </div>
//                 <h4 className="fw-bold text-muted mb-3">
//                   Your wishlist is empty
//                 </h4>
//                 <p className="text-muted mb-4">
//                   Start adding vendors to keep track of your wedding planning
//                 </p>
//                 <button className="btn btn-primary rounded-3 px-4">
//                   <BsPlusLg className="me-2" size={18} />
//                   Browse Vendors
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <PricingModal show={show} handleClose={handleClose} />
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { FaCheck, FaHeart } from "react-icons/fa6";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { GoPlus } from "react-icons/go";
import { MdOutlineCancel } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const WishlistPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [vendors, setVendors] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 4;

  // Fetch vendors from API
  useEffect(() => {
    if (!token) return;
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://happywedz.com/api/sub-vendors?page=${currentPage}&limit=${vendorsPerPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setVendors(data.data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchVendors();
  }, [token, currentPage]);

  // Pagination
  const totalPages = Math.ceil(vendors.length / vendorsPerPage);

  // Wishlist actions
  const addToWishlist = (vendor) => {
    if (!wishlist.find((w) => w.id === vendor.id)) {
      setWishlist([...wishlist, vendor]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const toggleNoteInput = (id) => {
    setShowNoteInput({ ...showNoteInput, [id]: !showNoteInput[id] });
  };

  const updateNote = (id, newNote) => {
    setWishlist(
      wishlist.map((item) => (item.id === id ? { ...item, note: newNote } : item))
    );
    setShowNoteInput({ ...showNoteInput, [id]: false });
  };

  const updateRating = (id, newRating) => {
    setWishlist(
      wishlist.map((item) => (item.id === id ? { ...item, rating: newRating } : item))
    );
  };

  const updateStatus = (id, status) => {
    setWishlist(
      wishlist.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const updatePricing = (id, pricing) => {
    setWishlist(
      wishlist.map((item) => (item.id === id ? { ...item, pricing } : item))
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Not Available":
        return "bg-danger";
      case "Evaluating":
        return "bg-warning";
      case "Preselecting":
        return "bg-info";
      case "Negotiation":
        return "bg-primary";
      case "Hired":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="bg-white rounded-4 shadow-sm border-0 p-4 sticky-top" style={{ top: "20px" }}>
            <div className="mb-4">
              <h6 className="text-uppercase fw-bold text-muted mb-3" style={{ fontSize: "0.85rem" }}>
                Your Search
              </h6>
              <input
                type="text"
                className="form-control border-2 rounded-3"
                value="Wedding Services"
                readOnly
                style={{ backgroundColor: "#f8f9fa", fontSize: "0.95rem" }}
              />
            </div>
            <div className="mt-4 pt-4 border-top text-center">
              <div className="fw-bold text-primary fs-4 mb-1">{wishlist.length}</div>
              <div className="text-muted small">Items in Wishlist</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold text-dark mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">Manage your selected wedding services</p>
            </div>
            <Link to="/vendors" className="btn btn-primary rounded-3 px-4">
              <BsPlusLg className="me-2" size={18} /> Add Vendor
            </Link>
          </div>

          {/* Vendors List */}
          <div className="row g-4">
            {loading && <p>Loading vendors...</p>}
            {!loading &&
              vendors.map((vendor) => (
                <div key={vendor.id} className="col-xl-6 col-12">
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                    <div className="position-relative">
                      <img
                        src={vendor.image || "https://via.placeholder.com/400x220"}
                        alt={vendor.title}
                        className="card-img-top"
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                      <button
                        className="position-absolute top-0 end-0 m-2 d-flex align-items-center justify-content-center rounded-circle shadow"
                        style={{ width: "36px", height: "36px", backgroundColor: "#fff", border: "none" }}
                        onClick={() => removeFromWishlist(vendor.id)}
                      >
                        <IoClose size={22} />
                      </button>
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className={`badge ${getStatusBadgeClass(vendor.status)} px-3 py-2 rounded-pill`}>
                          {vendor.status || "Evaluating"}
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <h5 className="fw-bold text-dark mb-2">{vendor.title}</h5>
                        <p className="text-muted mb-0">{vendor.subtitle}</p>
                      </div>
                      {/* Status & Rating */}
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted small mb-2">STATUS</label>
                        <select
                          className="form-select border-2 rounded-3"
                          value={vendor.status || "Evaluating"}
                          onChange={(e) => updateStatus(vendor.id, e.target.value)}
                        >
                          <option>Not Available</option>
                          <option>Evaluating</option>
                          <option>Preselecting</option>
                          <option>Negotiation</option>
                          <option>Hired</option>
                        </select>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-7">
                          <label className="form-label fw-semibold text-muted small mb-2">WHAT DO YOU THINK</label>
                          <div className="d-flex align-items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                className="btn btn-sm p-0 me-1 border-0 bg-transparent"
                                onClick={() => updateRating(vendor.id, star)}
                              >
                                <FaHeart
                                  size={20}
                                  color={star <= (vendor.rating || 0) ? "red" : "#ccc"}
                                  style={{ cursor: "pointer", transition: "0.2s" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="col-5">
                          <label className="form-label fw-semibold text-muted small mb-2">PRICING</label>
                          <input
                            type="text"
                            className="form-control border-2 rounded-3"
                            value={vendor.pricing || ""}
                            onChange={(e) => updatePricing(vendor.id, e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <label className="form-label fw-semibold text-muted small mb-0">NOTES</label>
                          <button
                            className="btn btn-primary rounded-pill px-3 d-flex align-items-center"
                            onClick={() => toggleNoteInput(vendor.id)}
                          >
                            {showNoteInput[vendor.id] ? (
                              <>
                                <MdOutlineCancel size={15} className="me-2" /> Cancel
                              </>
                            ) : (
                              <>
                                <GoPlus size={15} className="me-2" /> Add Note
                              </>
                            )}
                          </button>
                        </div>
                        {showNoteInput[vendor.id] ? (
                          <div className="d-flex gap-2 mt-3">
                            <input
                              type="text"
                              className="form-control border-2 rounded-3"
                              defaultValue={vendor.note || ""}
                              placeholder="Add your note..."
                              onKeyPress={(e) => {
                                if (e.key === "Enter") updateNote(vendor.id, e.target.value);
                              }}
                            />
                            <button
                              className="btn btn-primary rounded-2"
                              onClick={(e) => {
                                const input = e.target.previousElementSibling;
                                updateNote(vendor.id, input.value);
                              }}
                            >
                              <FaCheck size={10} />
                            </button>
                          </div>
                        ) : (
                          vendor.note && (
                            <div className="bg-light rounded-3 p-3">
                              <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
                                {vendor.note}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="card-footer bg-light border-0 p-4">
                      <div className="d-flex justify-content-center align-items-center text-center">
                        <button
                          className="btn btn-primary rounded-3 px-4"
                          onClick={() => navigate("/user-dashboard/message")}
                        >
                          <PiChatCircleDotsLight className="me-2" size={18} /> Connect Us
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4 gap-3">
            <button
              className="btn btn-outline-primary"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span className="align-self-center">{currentPage}</span>
            <button
              className="btn btn-outline-primary"
              disabled={vendors.length < vendorsPerPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>

          {wishlist.length === 0 && (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-heart text-muted" style={{ fontSize: "4rem" }}></i>
              </div>
              <h4 className="fw-bold text-muted mb-3">Your wishlist is empty</h4>
              <p className="text-muted mb-4">Start adding vendors to keep track of your wedding planning</p>
              <button className="btn btn-primary rounded-3 px-4">
                <BsPlusLg className="me-2" size={18} /> Browse Vendors
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
