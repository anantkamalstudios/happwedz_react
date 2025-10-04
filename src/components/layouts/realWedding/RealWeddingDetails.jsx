// import React, { useEffect, useState } from "react";
// import { IoCameraOutline, IoMusicalNotesOutline } from "react-icons/io5";
// import { GiOvermind } from "react-icons/gi";
// import { BsFeather } from "react-icons/bs";
// import { IoIosColorFilter } from "react-icons/io";
// import {
//   FaChevronLeft,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaCamera,
//   FaHeart,
//   FaFeather,
//   FaMusic,
//   FaBuilding,
//   FaClock,
//   FaPalette,
//   FaUtensils,
//   FaRing,
// } from "react-icons/fa";

// const RealWeddingDetails = ({ post, onBackClick }) => {
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getImageUrl = (path) => {
//     if (!path) {
//       return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop";
//     }
//     return `https://happywedzbackend.happywedz.com${path}`;
//   };

//   const openLightbox = (index) => {
//     setCurrentImage(index);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => {
//     setLightboxOpen(false);
//   };

//   const navigateImage = (direction) => {
//     const allPhotos = [
//       ...(post.highlightPhotos || []),
//       ...(post.allPhotos || []),
//     ];
//     if (direction === "next") {
//       setCurrentImage((prev) => (prev + 1) % allPhotos.length);
//     } else {
//       setCurrentImage(
//         (prev) => (prev - 1 + allPhotos.length) % allPhotos.length
//       );
//     }
//   };

//   return (
//     <div
//       className="wedding-blog"
//       style={{ fontFamily: '"Cormorant Garamond", serif' }}
//     >
//       {/* Cover Banner */}
//       <div className="container">
//         <section className="wedding-cover-banner position-relative rounded-5 mt-5">
//           <div
//             className="wedding-cover-image"
//             style={{
//               backgroundImage: `url(${getImageUrl(post.coverPhoto)})`,
//               height: "70vh",
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           ></div>
//           <div className="wedding-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end">
//             <div className="container">
//               <div className="row justify-content-center">
//                 <div className="col-lg-10 text-center text-white">
//                   <span className="wedding-category-badge badge bg-white bg-opacity-80 text-dark px-3 py-2 rounded-pill mb-3">
//                     {post.category || "Real Wedding"}
//                   </span>
//                   <h1 className="display-3 fw-bold mb-2 wedding-title">
//                     {post.title}
//                   </h1>
//                   <p className="h4 mb-2 wedding-couple-names">
//                     {post.brideName} & {post.groomName}
//                   </p>
//                   <div className="d-flex justify-content-center align-items-center flex-wrap wedding-meta">
//                     <span className="d-flex align-items-center me-4 mb-2">
//                       <FaCalendarAlt className="me-2" />
//                       {post.weddingDate ? formatDate(post.weddingDate) : ""}
//                     </span>
//                     <span className="d-flex align-items-center mb-2">
//                       <FaMapMarkerAlt className="me-2" />
//                       {post.city}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <button
//             className="wedding-back-btn btn btn-light position-absolute d-flex align-items-center justify-content-center"
//             onClick={onBackClick}
//             aria-label="Back"
//           >
//             <FaChevronLeft />
//           </button>
//         </section>
//       </div>

//       {/* Couple Section */}
//       <section className="wedding-couple-section py-5">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 The Couple
//               </h2>
//               <div className="row">
//                 <div className="col-md-6 mb-4 mb-md-0">
//                   <div className="wedding-couple-card text-center p-4 rounded-4 shadow-sm">
//                     <div className="wedding-portrait-wrapper mb-4 mx-auto">
//                       <img
//                         src={getImageUrl(post.bridePortrait || post.coverPhoto)}
//                         alt={post.brideName}
//                         className="img-fluid rounded-circle wedding-portrait"
//                       />
//                     </div>
//                     <h3 className="h4 mb-3">{post.brideName}</h3>
//                     <p className="text-muted mb-3">{post.brideBio}</p>
//                     <div className="wedding-outfit-info">
//                       <FaFeather className="text-pink me-2" />
//                       <span className="small">{post.brideOutfit}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="wedding-couple-card text-center p-4 rounded-4 shadow-sm">
//                     <div className="wedding-portrait-wrapper mb-4 mx-auto">
//                       <img
//                         src={getImageUrl(post.groomPortrait || post.coverPhoto)}
//                         alt={post.groomName}
//                         className="img-fluid rounded-circle wedding-portrait"
//                       />
//                     </div>
//                     <h3 className="h4 mb-3">{post.groomName}</h3>
//                     <p className="text-muted mb-3">{post.groomBio}</p>
//                     <div className="wedding-outfit-info">
//                       <FaFeather className="text-pink me-2" />
//                       <span className="small">{post.groomOutfit}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Story Section */}
//       <section className="wedding-story-section py-5 bg-light">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-8">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Their Love Story
//               </h2>
//               <div className="wedding-story-content p-4 p-md-5 rounded-4 bg-white shadow-sm">
//                 <p className="lead text-center text-muted mb-4 wedding-story-quote">
//                   "The beginning of a beautiful journey together"
//                 </p>
//                 <div
//                   className="wedding-story-text"
//                   style={{ lineHeight: "1.8", fontSize: "1.1rem" }}
//                 >
//                   {post.story}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Events Timeline */}
//       <section className="wedding-events-section py-5">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Wedding Events
//               </h2>
//               <div className="wedding-timeline">
//                 {post.events?.map((event, index) => (
//                   <div
//                     key={index}
//                     className="wedding-timeline-item position-relative"
//                   >
//                     <div className="row">
//                       <div className="col-md-6 mb-4 mb-md-0">
//                         <div className="wedding-event-date d-flex align-items-center h-100">
//                           <div className="wedding-event-icon rounded-circle d-flex align-items-center justify-content-center me-4">
//                             {event.name.includes("Haldi") && (
//                               <FaPalette className="fs-4" />
//                             )}
//                             {event.name.includes("Mehendi") && (
//                               <FaFeather className="fs-4" />
//                             )}
//                             {event.name.includes("Wedding") && (
//                               <FaRing className="fs-4" />
//                             )}
//                             {event.name.includes("Reception") && (
//                               <FaUtensils className="fs-4" />
//                             )}
//                             {event.name.includes("Sangeet") && (
//                               <IoMusicalNotesOutline className="fs-4" />
//                             )}
//                           </div>
//                           <div>
//                             <h4 className="mb-1">{event.name}</h4>
//                             <p className="mb-1 text-muted">
//                               <FaCalendarAlt className="me-2" />
//                               {formatDate(event.date)}
//                             </p>
//                             <p className="mb-0 text-muted">
//                               <FaClock className="me-2" />
//                               {event.time}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-md-6">
//                         <div className="wedding-event-details p-3 rounded-3 bg-light h-100">
//                           <p className="mb-2">
//                             <FaMapMarkerAlt className="me-2 text-danger" />
//                             <strong>Venue:</strong> {event.venue}
//                           </p>
//                           <p className="mb-0">{event.description}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Vendors Section */}
//       <section className="wedding-vendors-section py-5 bg-light">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Our Vendors
//               </h2>
//               <div className="row">
//                 {post.vendors?.map((vendor, index) => (
//                   <div key={index} className="col-md-6 col-lg-4 mb-4">
//                     <div className="wedding-vendor-card card h-100 border-0 shadow-sm rounded-4">
//                       <div className="card-body text-center p-4">
//                         <div className="wedding-vendor-icon rounded-circle bg-pastel d-inline-flex align-items-center justify-content-center mb-3">
//                           {vendor.type.includes("photo") && (
//                             <FaCamera className="fs-4" />
//                           )}
//                           {vendor.type.includes("makeup") && (
//                             <FaFeather className="fs-4" />
//                           )}
//                           {vendor.type.includes("decor") && (
//                             <FaPalette className="fs-4" />
//                           )}
//                           {vendor.type.includes("plan") && (
//                             <FaBuilding className="fs-4" />
//                           )}
//                           {vendor.type.includes("music") && (
//                             <FaMusic className="fs-4" />
//                           )}
//                         </div>
//                         <h5 className="card-title">{vendor.type}</h5>
//                         <p className="card-text mb-2">{vendor.name}</p>
//                         {vendor.link && (
//                           <a
//                             href={vendor.link}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="small text-decoration-none"
//                           >
//                             View Profile
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Highlights Section */}
//       <section className="wedding-highlights-section py-5">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Special Highlights
//               </h2>

//               <div className="wedding-themes mb-5">
//                 <h4 className="mb-3">Wedding Themes</h4>
//                 <div className="d-flex flex-wrap">
//                   {post.themes?.map((theme, index) => (
//                     <span
//                       key={index}
//                       className="wedding-theme-badge badge bg-pastel text-dark me-2 mb-2 px-3 py-2 rounded-pill"
//                     >
//                       #{theme}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="row">
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-highlight-card p-4 rounded-4 bg-light shadow-sm h-100">
//                     <h4 className="d-flex align-items-center mb-3">
//                       <FaHeart className="text-pink me-2" />
//                       Special Moments
//                     </h4>
//                     <p className="mb-0">{post.specialMoments}</p>
//                   </div>
//                 </div>
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-highlight-card p-4 rounded-4 bg-light shadow-sm h-100">
//                     <h4 className="d-flex align-items-center mb-3">
//                       <FaFeather className="text-pink me-2" />
//                       Outfit Details
//                     </h4>
//                     <p className="mb-1">
//                       <strong>Bride:</strong> {post.brideOutfit}
//                     </p>
//                     <p className="mb-0">
//                       <strong>Groom:</strong> {post.groomOutfit}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Gallery Section */}
//       <section className="wedding-gallery-section py-5 bg-light">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Gallery
//               </h2>
//               <div className="row">
//                 {post.highlightPhotos?.map((photo, index) => (
//                   <div key={index} className="col-md-6 col-lg-4 mb-4">
//                     <div
//                       className="wedding-gallery-item position-relative overflow-hidden rounded-4 shadow-sm"
//                       onClick={() => openLightbox(index)}
//                     >
//                       <img
//                         src={getImageUrl(photo)}
//                         alt={`Highlight ${index + 1}`}
//                         className="img-fluid w-100 wedding-gallery-image"
//                         style={{ height: "300px", objectFit: "cover" }}
//                       />
//                       <div className="wedding-gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
//                         <FaCamera className="text-white fs-3" />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {post.allPhotos?.map((photo, index) => (
//                   <div key={index} className="col-md-4 col-lg-3 mb-4">
//                     <div
//                       className="wedding-gallery-item position-relative overflow-hidden rounded-4 shadow-sm"
//                       onClick={() =>
//                         openLightbox(
//                           index + (post.highlightPhotos?.length || 0)
//                         )
//                       }
//                     >
//                       <img
//                         src={getImageUrl(photo)}
//                         alt={`Gallery ${index + 1}`}
//                         className="img-fluid w-100 wedding-gallery-image"
//                         style={{ height: "200px", objectFit: "cover" }}
//                       />
//                       <div className="wedding-gallery-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
//                         <FaCamera className="text-white fs-3" />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Credits Footer */}
//       <section className="wedding-credits-section py-5">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-8">
//               <h2 className="text-center mb-5 wedding-section-title">
//                 Credits
//               </h2>
//               <div className="row">
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-credit-card card border-0 shadow-sm rounded-4 h-100">
//                     <div className="card-body p-4">
//                       <h4 className="d-flex align-items-center mb-3">
//                         <IoCameraOutline className="text-primary me-2" />
//                         Photography
//                       </h4>
//                       <p className="mb-0">{post.photographer}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-credit-card card border-0 shadow-sm rounded-4 h-100">
//                     <div className="card-body p-4">
//                       <h4 className="d-flex align-items-center mb-3">
//                         <BsFeather className="text-pink me-2" />
//                         Makeup & Styling
//                       </h4>
//                       <p className="mb-0">{post.makeup}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-credit-card card border-0 shadow-sm rounded-4 h-100">
//                     <div className="card-body p-4">
//                       <h4 className="d-flex align-items-center mb-3">
//                         <IoIosColorFilter className="text-warning me-2" />
//                         Decor
//                       </h4>
//                       <p className="mb-0">{post.decor}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="col-md-6 mb-4">
//                   <div className="wedding-credit-card card border-0 shadow-sm rounded-4 h-100">
//                     <div className="card-body p-4">
//                       <h4 className="d-flex align-items-center mb-3">
//                         <GiOvermind className="text-success me-2" />
//                         Planning
//                       </h4>
//                       <p className="mb-0">{post.planner}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Lightbox Modal */}
//       {lightboxOpen && (
//         <div className="wedding-lightbox-modal modal d-block" tabIndex="-1">
//           <div className="modal-dialog modal-dialog-centered modal-lg">
//             <div className="modal-content border-0 bg-transparent">
//               <div className="modal-header border-0">
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={closeLightbox}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body position-relative">
//                 <img
//                   src={getImageUrl(
//                     [
//                       ...(post.highlightPhotos || []),
//                       ...(post.allPhotos || []),
//                     ][currentImage]
//                   )}
//                   alt="Gallery"
//                   className="img-fluid rounded-3"
//                 />
//                 <button
//                   className="wedding-lightbox-prev position-absolute top-50 start-0 translate-middle-y btn btn-light"
//                   onClick={() => navigateImage("prev")}
//                 >
//                   <FaChevronLeft />
//                 </button>
//                 <button
//                   className="wedding-lightbox-next position-absolute top-50 end-0 translate-middle-y btn btn-light"
//                   onClick={() => navigateImage("next")}
//                 >
//                   <FaChevronLeft className="rotate-180" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .wedding-blog {
//           --wedding-pastel-pink: #f8d7da;
//           --wedding-blush-pink: #f4c2c2;
//           --wedding-rose-pink: #e7a6b5;
//           --wedding-peach-pink: #f7cac9;
//           --wedding-ballet-pink: #f2b2c4;
//           --wedding-dusty-rose: #d8a7b1;
//           --wedding-hot-pink: #ff8da1;
//           --wedding-coral-pink: #f88379;
//           --wedding-deep-rose: #c94c67;
//         }

//         .wedding-cover-banner {
//           overflow: hidden;
//         }

//         .wedding-overlay {
//           background: linear-gradient(
//             to top,
//             rgba(0, 0, 0, 0.7) 0%,
//             transparent 100%
//           );
//           padding-bottom: 4rem;
//         }

//         .wedding-back-btn {
//           top: 2rem;
//           left: 2rem;
//           width: 50px;
//           height: 50px;
//           border-radius: 50%;
//           z-index: 10;
//         }

//         .wedding-section-title {
//           font-weight: 600;
//           position: relative;
//           padding-bottom: 1rem;
//         }

//         .wedding-section-title:after {
//           content: "";
//           position: absolute;
//           bottom: 0;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 80px;
//           height: 2px;
//           background-color: var(--wedding-pastel-pink);
//         }

//         .wedding-couple-card {
//           background: white;
//           transition: transform 0.3s ease;
//         }

//         .wedding-couple-card:hover {
//           transform: translateY(-5px);
//         }

//         .wedding-portrait-wrapper {
//           width: 180px;
//           height: 180px;
//         }

//         .wedding-portrait {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .wedding-story-content {
//           background: white;
//         }

//         .wedding-timeline-item {
//           padding: 2rem 0;
//         }

//         .wedding-timeline-item:not(:last-child):after {
//           content: "";
//           position: absolute;
//           bottom: 0;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 2px;
//           height: 100%;
//           background-color: var(--wedding-pastel-pink);
//           z-index: -1;
//         }

//         .wedding-event-icon {
//           width: 60px;
//           height: 60px;
//           background-color: var(--wedding-pastel-pink);
//         }

//         .wedding-vendor-icon {
//           width: 70px;
//           height: 70px;
//           background-color: var(--wedding-pastel-blue);
//         }

//         .bg-pastel {
//           background-color: var(--wedding-pastel-pink);
//         }

//         .wedding-gallery-item {
//           cursor: pointer;
//           transition: transform 0.3s ease;
//         }

//         .wedding-gallery-item:hover {
//           transform: scale(1.03);
//         }

//         .wedding-gallery-item:hover .wedding-gallery-image {
//           transform: scale(1.1);
//         }

//         .wedding-gallery-image {
//           transition: transform 0.5s ease;
//         }

//         .wedding-gallery-overlay {
//           background-color: rgba(0, 0, 0, 0.3);
//           opacity: 0;
//           transition: opacity 0.3s ease;
//         }

//         .wedding-gallery-item:hover .wedding-gallery-overlay {
//           opacity: 1;
//         }

//         .wedding-lightbox-modal {
//           background-color: rgba(0, 0, 0, 0.9);
//           z-index: 1080;
//         }

//         .wedding-lightbox-prev,
//         .wedding-lightbox-next {
//           width: 50px;
//           height: 50px;
//           border-radius: 50%;
//         }

//         .rotate-180 {
//           transform: rotate(180deg);
//         }

//         .text-pink {
//           color: #d63384;
//         }

//         @media (max-width: 768px) {
//           .wedding-title {
//             font-size: 2.5rem;
//           }

//           .wedding-couple-names {
//             font-size: 1.5rem;
//           }

//           .wedding-portrait-wrapper {
//             width: 140px;
//             height: 140px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RealWeddingDetails;

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCameraRetro,
  FaChevronLeft,
  FaGem,
  FaLandmark,
  FaMapMarkerAlt,
  FaPaintBrush,
  FaTag,
} from "react-icons/fa";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import {
  FaPalette,
  FaStar,
  FaTshirt,
  FaUserTie,
  FaFemale,
} from "react-icons/fa";

export default function WeddingPage({ post, onBackClick }) {
  const vendorTypeIcons = {
    photographers: <FaCameraRetro />,
    venues: <FaLandmark />,
    "bridal makeup": <FaPaintBrush />,
    "bridal wear": <FaTshirt />,
    jewellery: <FaGem />,
    default: <FaTag />,
  };

  const iconStyle = {
    fontSize: "1.8rem",
    color: "#C31162",
    marginRight: "1rem",
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <div
        className="position-relative text-center text-white"
        style={{
          backgroundImage: `url(https://happywedzbackend.happywedz.com/${post.coverPhoto})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
        }}
      >
        <div
          className="position-absolute top-50 start-50 translate-middle p-4 d-flex flex-column align-items-center justify-content-center gap-4"
          style={{
            // backgroundColor: "rgba(253, 7, 93, 0.4)",
            backgroundColor: "#C31162",
            opacity: "0.3",
            borderRadius: "8px",
            minWidth: "1000px",
            minHeight: "350px",
          }}
        >
          <h1
            className="fw-bold display-5"
            style={{
              fontSize: "5rem",
              letterSpacing: "1px",
              wordSpacing: "5px",
              fontWeight: "lighter",
            }}
          >
            {post.brideName} and {post.groomName}
          </h1>
          <p className="mb-1" style={{ fontSize: "2rem" }}>
            {post.weddingDate} – {post.city}
          </p>
          {post.story && (
            <p className="medium mb-0">
              {post.story.slice(0, 80)}...
              <a className="text-warning fw-bold">Read More</a>
            </p>
          )}
        </div>
        <button
          className="wedding-back-btn btn btn-light position-absolute d-flex align-items-center justify-content-center"
          onClick={onBackClick}
          aria-label="Back"
          style={{
            top: "2rem",
            left: "2rem",
            height: "50px",
            width: "50px",
            borderRadius: "50%",
          }}
        >
          <FaChevronLeft />
        </button>
      </div>

      {/* Couples Bio */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Couple Bio
        </h3>

        <Row className="align-items-start">
          {/* Groom Bio */}
          <Col md={6} className="mb-4 mb-md-0">
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaUserEdit
                  size={22}
                  color="#C31162"
                  className="me-2"
                  style={{ minWidth: "22px" }}
                />
                <h5 className="mb-0" style={{ color: "#C31162" }}>
                  {post.groomName}
                </h5>
              </div>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.groomBio}
              </p>
            </div>
          </Col>

          {/* Bride Bio */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <div className="d-flex align-items-center justify-content-center mb-3">
                <FaUserEdit
                  size={22}
                  color="#C31162"
                  className="me-2"
                  style={{ minWidth: "22px" }}
                />
                <h5 className="mb-0" style={{ color: "#C31162" }}>
                  {post.brideName}
                </h5>
              </div>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.brideBio}
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Photo Gallery */}
      <div className="container my-5">
        <h3 className="mb-3 fw-semibold">Photo Gallery</h3>

        <div
          className="p-2 mb-3"
          style={{ backgroundColor: "#f8d7da", borderRadius: "6px" }}
        >
          <span className="fw-semibold text-danger">Top Photos</span>
        </div>

        <div className="row g-3">
          {post.highlightPhotos && post.highlightPhotos.length > 0 ? (
            post.highlightPhotos.map((src, i) => (
              <div className="col-6 col-md-3" key={i}>
                <img
                  src={"https://happywedzbackend.happywedz.com/" + src}
                  className="img-fluid rounded"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "200px",
                  }}
                  alt="highlight"
                />
              </div>
            ))
          ) : (
            <p className="text-muted">No highlight photos available</p>
          )}
        </div>
      </div>

      {/* Love story */}
      <Container className="my-5">
        {/* Inline animation CSS */}
        <style>
          {`
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
        </style>

        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Their Love Story
        </h3>

        <div
          className="mx-auto text-center"
          style={{
            position: "relative",
            maxWidth: "800px",
            borderRadius: "16px",
            padding: "2rem",
            background: "#fff",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            zIndex: 1,
          }}
        >
          {/* Animated gradient border */}
          <div
            style={{
              content: '""',
              position: "absolute",
              inset: "-3px",
              borderRadius: "18px",
              padding: "3px",
              background: "linear-gradient(270deg, #C31162, #ff66b2, #C31162)",
              backgroundSize: "400% 400%",
              animation: "gradientMove 6s ease infinite",
              zIndex: -1,
            }}
          ></div>

          <p
            className="mb-0 text-muted"
            style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
          >
            {post.story}
          </p>
        </div>
      </Container>

      {/* Events */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Wedding Events
        </h3>

        <Row className="g-4">
          {post.events?.map((event, index) => (
            <Col md={4} key={index}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5
                    className="card-title d-flex align-items-center"
                    style={{ color: "#C31162" }}
                  >
                    <FaRegStar className="me-2" /> {event.eventName}
                  </h5>
                  <p className="card-text mb-2 d-flex align-items-center">
                    <FaCalendarAlt color="#C31162" className="me-2" />
                    {event.date}
                  </p>
                  <p className="card-text d-flex align-items-center">
                    <FaMapMarkerAlt color="#C31162" className="me-2" />
                    {event.venue}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Special highlighted */}
      <Container className="my-5">
        <h3
          className="text-center mb-4"
          style={{ color: "#C31162", fontWeight: 600 }}
        >
          Special Highlights
        </h3>

        {/* THEMES */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {post.themes?.map((theme, index) => (
            <span
              key={index}
              className="badge d-flex align-items-center px-3 py-2"
              style={{
                backgroundColor: "#fff0f6",
                color: "#C31162",
                fontSize: "0.95rem",
                border: "1px solid #C31162",
                borderRadius: "20px",
              }}
            >
              <FaPalette className="me-2" /> {theme}
            </span>
          ))}
        </div>

        <Row className="g-4">
          {/* Special Moments */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <h5
                className="mb-3 d-flex align-items-center"
                style={{ color: "#C31162" }}
              >
                <FaStar className="me-2" /> Special Moments
              </h5>
              <p className="mb-0 text-muted" style={{ lineHeight: "1.6" }}>
                {post.specialMoments || "Their most cherished wedding moments"}
              </p>
            </div>
          </Col>

          {/* Outfit Details */}
          <Col md={6}>
            <div
              className="p-4 rounded shadow-sm h-100"
              style={{
                backgroundColor: "#fffafc",
                border: "1px solid #C3116230",
              }}
            >
              <h5
                className="mb-3 d-flex align-items-center"
                style={{ color: "#C31162" }}
              >
                <FaTshirt className="me-2" /> Outfit Details
              </h5>

              {/* Groom Outfit */}
              <div className="mb-3">
                <h6
                  className="mb-1 d-flex align-items-center"
                  style={{ color: "#C31162" }}
                >
                  <FaUserTie className="me-2" /> Groom
                </h6>
                <p className="mb-0 text-muted">
                  {post.groomOutfit || "Groom outfit details here."}
                </p>
              </div>

              {/* Bride Outfit */}
              <div>
                <h6
                  className="mb-1 d-flex align-items-center"
                  style={{ color: "#C31162" }}
                >
                  <FaFemale className="me-2" /> Bride
                </h6>
                <p className="mb-0 text-muted">
                  {post.brideOutfit || "Bride outfit details here."}
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* <div className="container mb-5">
        <h4 className="mb-3 fw-semibold">Tagged Vendors</h4>
        <div className="row g-4">
          {post.vendors && post.vendors.length > 0 ? (
            post.vendors.map((vendor, i) => (
              <div className="col-12 col-md-3" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <img
                    src="https://picsum.photos/400/250"
                    className="card-img-top"
                    alt={vendor.name}
                  />
                  <div className="card-body text-center">
                    <h6 className="mb-1" style={{ fontSize: "1.3rem" }}>
                      {vendor.name}
                    </h6>
                    <p className="text-muted small mb-0">{vendor.type}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No vendors tagged</p>
          )}
        </div>
      </div> */}

      {/* Tagged Vendors */}
      <Container className="container mb-5">
        <h4 className="mb-4 fw-semibold">Tagged Vendors</h4>
        <Row className="g-4">
          {post.vendors && post.vendors.length > 0 ? (
            post.vendors.map((vendor, i) => {
              const typeKey = vendor.type?.toLowerCase() || "";
              const icon = vendorTypeIcons[typeKey] || vendorTypeIcons.default;

              return (
                <Col xs={12} md={6} lg={4} key={i}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="d-flex align-items-center">
                      <div style={iconStyle}>{icon}</div>
                      <div>
                        <Card.Title
                          style={{ fontSize: "1.1rem", marginBottom: "0.2rem" }}
                        >
                          {vendor.name}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-0">
                          {vendor.type}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p className="text-muted">No vendors tagged</p>
          )}
        </Row>
      </Container>
    </div>
  );
}
