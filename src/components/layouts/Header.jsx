// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import LocationModalWithCategories from "./LocationModalWithCategories";
// import { RiMenuFill } from "react-icons/ri";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../../redux/authSlice";
// import { vendorLogout } from "../../redux/vendorAuthSlice";
// import { setLocation } from "../../redux/locationSlice";
// import { FaArrowRightLong } from "react-icons/fa6";
// import {
//   FaRing,
//   FaClipboardList,
//   FaStore,
//   FaUsers,
//   FaPiggyBank,
//   FaHeart,
//   FaShoppingCart,
//   FaEnvelopeOpenText,
//   FaUserFriends,
//   FaUser,
// } from "react-icons/fa";
// import axios from "axios";
// import usePhotography from "../../hooks/usePhotography";

// const Header = () => {
//   const dispatch = useDispatch();
//   const { slug } = useParams();
//   const reduxLocation = useSelector((state) => state.location.selectedLocation);
//   const [activeTab, setActiveTab] = useState("");
//   const [selectedCity, setSelectedCity] = useState(reduxLocation);
//   const [openMenu, setOpenMenu] = useState(null);
//   const navigate = useNavigate();
//   const formatName = (name) => name.replace(/\band\b/gi, "&");
//   const weddingCategories = [
//     "South Indian wedding",
//     "Real Brides Reveal",
//     "Bridal Buys",
//     "Real Wedding",
//     "Mehendi Ideas",
//     "Indian Wedding Ideas",
//   ];
//   const weddingTopics = [
//     "Bridal Makeup",
//     "Honeymoon Travel",
//     "Wedding Songs and Videos",
//     "Bridal Hairstyles",
//     "Wedding Decor Ideas",
//     "Bridal Style Advice",
//     "Wedding Gifts and Favors",
//     "Budget Weddings",
//     "More",
//   ];

//   const weddingIdeas = [
//     "Wedding Songs",
//     "Best Bridal Entry Songs",
//     "Chandni Chowk Lehengas",
//     "Best Bridal Hairstyles",
//     "Bridal Mehendi Designs",
//     "Best Groom Entry Songs",
//     "Wittiest Wedding Hashtags",
//     "2025 Marriage Dates",
//     "Latest Sabyasachi Lehengas",
//     "Bridal Blouse Designs",
//   ];

//   const byCity = ["Mumbai", "Bangalore", "Pune", "Kolkata", "Jaipur", "Others"];
//   const byCulture = [
//     "Maharashtrian",
//     "Punjabi / Sikh",
//     "Bengali",
//     "Gujarati",
//     "Marwari",
//     "Telugu",
//     "Others",
//   ];
//   const byTheme = [
//     "Destination",
//     "Grand & Luxurious",
//     "Pocket Friendly Stunners",
//     "Intimate & Minimalist",
//     "Modern & Stylish",
//     "International",
//     "Others",
//   ];

//   const handleLogout = () => {
//     if (isVendorLoggedIn) {
//       dispatch(vendorLogout());
//     } else {
//       dispatch(logout());
//     }
//     localStorage.clear();
//   };

//   const { user, token: userToken } = useSelector((state) => state.auth);
//   const { vendor, token: vendorToken } = useSelector(
//     (state) => state.vendorAuth
//   );

//   const isUserLoggedIn = !!userToken && !!user;
//   const isVendorLoggedIn = !!vendorToken && !!vendor;
//   const isLoggedIn = isUserLoggedIn || isVendorLoggedIn;

//   const toSlug = (text) =>
//     text
//       ?.toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^a-z0-9\-]/g, "") || "";

//   const location = window.location.pathname;
//   useEffect(() => {
//     const collapse = document.getElementById("mainNav");
//     if (collapse && collapse.classList.contains("show")) {
//       collapse.classList.remove("show");
//     }
//     if (window.bootstrap && window.bootstrap.Collapse) {
//       try {
//         const bsCollapse =
//           window.bootstrap.Collapse.getOrCreateInstance(collapse);
//         bsCollapse.hide();
//       } catch {}
//     }
//   }, [location]);

//   const tabs = [
//     {
//       id: "wedding",
//       slug: "my-wedding",
//       label: "My Wedding",
//       img: "/images/userDashboard/mywedding-img.svg",
//       // icon: <FaRing style={{ color: "#fff" }} />,
//     },
//     {
//       id: "checklist",
//       slug: "checklist",
//       label: "Checklist",
//       // icon: <FaClipboardList style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/checklist-img.svg",
//     },
//     {
//       id: "vendors",
//       slug: "vendor",
//       label: "Vendor",
//       // icon: <FaStore style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/vendor-img.svg",
//     },
//     {
//       id: "guest-list",
//       slug: "guest-list",
//       label: "Guest list",
//       // icon: <FaUsers style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/guestlist-img.svg",
//     },
//     {
//       id: "budget",
//       slug: "budget",
//       label: "Budget",
//       // icon: <FaPiggyBank style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/budget-img.svg",
//     },
//     {
//       id: "wishlist",
//       slug: "wishlist",
//       label: "Wishlist",
//       // icon: <FaHeart style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/wishlist-img.svg",
//     },
//     // { id: "booking", slug: "booking", label: "Booking", icon: <FaShoppingCart /> },
//     {
//       id: "message",
//       slug: "message",
//       label: "Message",
//       // icon: <FaEnvelopeOpenText style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/message-img.svg",
//     },
//     {
//       id: "real-wedding",
//       slug: "real-wedding",
//       label: "Real wedding",
//       // icon: <FaUserFriends style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/real-wedding-img.svg",
//     },
//     {
//       id: "user-profile",
//       slug: "user-profile",
//       label: "Profile",
//       // icon: <FaUser style={{ color: "#fff" }} />,
//       img: "/images/userDashboard/userProfile-img.svg",
//     },
//   ];

//   const [venueSubcategories, setVenueSubcategories] = useState([]);
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       try {
//         const response = await fetch(
//           "https://happywedz.com/api/vendor-types/with-subcategories/all"
//         );
//         const data = await response.json();
//         const venues = data.find(
//           (vendor) => vendor.name && vendor.name.toLowerCase() === "venues"
//         );
//         if (venues && Array.isArray(venues.subcategories)) {
//           setVenueSubcategories(venues.subcategories);
//         } else {
//           setVenueSubcategories([]);
//         }
//       } catch (error) {
//         console.error("Error fetching subcategories:", error);
//       }
//     };
//     fetchSubcategories();
//   }, []);

//   const [vendorCategories, setVendorCategories] = useState([]);
//   const [einviteCategories, setEinviteCategories] = useState([
//     {
//       cardType: "wedding_einvite",
//       title: "Wedding E-Invitations",
//       icon: "bi-heart",
//     },
//     { cardType: "video", title: "Video Invitations", icon: "bi-play-circle" },
//     {
//       cardType: "save_the_date",
//       title: "Save the Date",
//       icon: "bi-calendar-heart",
//     },
//   ]);

//   useEffect(() => {
//     const fetchVendorCategories = async () => {
//       try {
//         const response = await fetch(
//           "https://happywedz.com/api/vendor-types/with-subcategories/all"
//         );
//         const data = await response.json();
//         setVendorCategories(Array.isArray(data) ? data : []);
//       } catch (error) {
//         setVendorCategories([]);
//         console.error("Error fetching vendor categories:", error);
//       }
//     };
//     fetchVendorCategories();
//   }, []);

//   const {
//     typesWithCategories,
//     fetchTypesWithCategories,
//     loading: photographyLoading,
//     error: photographyError,
//   } = usePhotography();

//   const [photography, setPhotography] = useState([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       await fetchTypesWithCategories();
//     };
//     fetchData();
//   }, []);
//   useEffect(() => {
//     setPhotography(typesWithCategories);
//   }, [typesWithCategories]);

//   const vendorType = encodeURIComponent("Venues");
//   const cityParam = selectedCity
//     ? `&city=${encodeURIComponent(selectedCity)}`
//     : "";

//   const targetURL = `/vendors/all?vendorType=${vendorType}${cityParam}`;

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
//       <div className="container-fluid p-0">
//         {/* Mobile view: logo left + toggle right */}
//         <div className="d-flex d-lg-none justify-content-between align-items-center w-100 py-2">
//           <Link className="navbar-brand m-0" to="/">
//             <img src="/happywed_white.png" alt="HappyWedz" height="30" />
//             {/* <img src="/images/logo.webp" alt="HappyWedz" height="30" /> */}
//           </Link>

//           <button
//             className="navbar-toggler border-0"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#mainNav"
//             aria-controls="mainNav"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <RiMenuFill color="white" size={35} />
//           </button>
//         </div>

//         <div className="collapse navbar-collapse w-100" id="mainNav">
//           <div className="row w-100" style={{ margin: 0, padding: 0 }}>
//             <div className="col-12 bg-white p-2">
//               <div className="container w-100 p-0">
//                 <div className="row align-items-center gy-2">
//                   {/* Left: Tagline */}
//                   <div className="col-12 col-sm-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-sm-start">
//                     <a
//                       className="nav-link fw-bold top-header-heading"
//                       href="#"
//                       style={{ color: "#C31162" }}
//                     >
//                       India's Favourite Wedding Planning Platform
//                     </a>
//                   </div>

//                   {/* Middle: Location Selector */}
//                   <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center justify-content-sm-start">
//                     <LocationModalWithCategories />
//                   </div>

//                   {/* Right: Store Icons */}
//                   <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center justify-content-lg-end gap-4">
//                     <img
//                       src="/images/header/playstore.png"
//                       alt="Play Store"
//                       title="Download on Play Store"
//                       className="img-fluid"
//                       style={{
//                         maxHeight: "28px",
//                         width: "auto",
//                         cursor: "pointer",
//                       }}
//                     />

//                     <img
//                       src="/images/header/appstore.png"
//                       alt="App Store"
//                       title="Download on App Store"
//                       className="img-fluid"
//                       style={{
//                         maxHeight: "28px",
//                         width: "auto",
//                         cursor: "pointer",
//                       }}
//                     />

//                     <Link
//                       to="/try"
//                       state={{ title: "Try" }}
//                       title="Try Design Studio"
//                     >
//                       <img
//                         src="/images/header/tryimg.png"
//                         alt="Design Studio"
//                         className="img-fluid"
//                         style={{
//                           maxHeight: "50px",
//                           width: "auto",
//                           cursor: "pointer",
//                         }}
//                       />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Bottom */}
//             <div className="col-12 py-0">
//               <div className="container" style={{ maxWidth: "1400px" }}>
//                 <div className="d-flex w-100 justify-content-center">
//                   <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-between flex-nowrap">
//                     <div className="text-center d-none d-lg-block">
//                       <Link className="navbar-brand-logo" to="/">
//                         <img
//                           src="/images/logo.webp"
//                           alt="HappyWedz"
//                           height="40"
//                           className="mx-auto d-block"
//                         />
//                       </Link>
//                     </div>
//                     <ul className="navbar-nav d-flex flex-wrap justify-content-center gap-2">
//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("planning")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <button
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             Planning Tools
//                           </button>

//                           <div
//                             className="dropdown-menu mega-dropdown w-75 border-0 mt-0 p-4 rounded-0 shadow-sm bg-white"
//                             style={{
//                               display:
//                                 openMenu === "planning" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container">
//                               <div className="row g-4">
//                                 {/* LEFT SECTION */}
//                                 <div className="col-md-8">
//                                   <h6 className="fw-semibold text-dark mb-4 fs-5">
//                                     Plan your unique wedding
//                                   </h6>

//                                   <div
//                                     style={{
//                                       display: "grid",
//                                       gridTemplateColumns: "repeat(3, 1fr)",
//                                       gap: "1.25rem 1rem",
//                                     }}
//                                   >
//                                     {tabs.map((tab) => (
//                                       <div
//                                         key={tab.id}
//                                         onClick={() =>
//                                           navigate(
//                                             `/user-dashboard/${tab.slug}`
//                                           )
//                                         }
//                                         className="d-flex align-items-center"
//                                         style={{
//                                           cursor: "pointer",
//                                           transition: "color 0.2s ease-in-out",
//                                         }}
//                                         onMouseEnter={(e) =>
//                                           (e.currentTarget.style.color =
//                                             "#e91e63")
//                                         }
//                                         onMouseLeave={(e) =>
//                                           (e.currentTarget.style.color =
//                                             "#212529")
//                                         }
//                                       >
//                                         {/* <span
//                                           className="fs-18"
//                                           style={{
//                                             fontSize: "30px",
//                                             color: "#555",
//                                             display: "inline-flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             width: "40px",
//                                             height: "40px",
//                                             borderRadius: "50%",
//                                             backgroundColor: "#C31162",
//                                           }}
//                                         >
//                                           {tab.icon}
//                                         </span> */}
//                                         <div
//                                           className="d-flex align-items-center justify-content-center"
//                                           style={{
//                                             width: "45px",
//                                             height: "45px",
//                                             borderRadius: "50%",
//                                             backgroundColor: "#ed1173",
//                                             color: "#fff",
//                                           }}
//                                         >
//                                           <div
//                                             style={{
//                                               height: "45px",
//                                               width: "45px",
//                                               padding: "5px",
//                                               border: "none",
//                                             }}
//                                           >
//                                             <img
//                                               src={tab.img}
//                                               alt=""
//                                               style={{
//                                                 height: "100%",
//                                                 width: "100%",
//                                                 objectFit: "contain",
//                                                 borderRadius: "50%",
//                                               }}
//                                             />
//                                           </div>
//                                         </div>
//                                         <span className="ms-2 small">
//                                           {tab.label}
//                                         </span>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>

//                                 {/* RIGHT SECTION */}
//                                 <div className="col-md-4">
//                                   <div className="d-flex flex-column gap-3">
//                                     {[
//                                       {
//                                         title: "Get the HappyWedz App",
//                                         desc: "Plan your wedding on the go with the HappyWedz app.",
//                                         image: "/images/header/playstore.png",
//                                       },
//                                       {
//                                         title: "Happywedz Website",
//                                         desc: "Showcase your wedding website to friends and family.",
//                                         image: "/images/couple.png",
//                                         route: "/choose-template",
//                                       },
//                                     ].map((item, i) => (
//                                       <div
//                                         key={i}
//                                         className="p-3 rounded-4 bg-white shadow-lg border-2"
//                                         style={{
//                                           border: "1px solid #f0f0f0",
//                                           cursor: "pointer",
//                                           transition: "all 0.2s ease-in-out",
//                                         }}
//                                         onMouseEnter={(e) =>
//                                           (e.currentTarget.style.boxShadow =
//                                             "0 4px 12px rgba(0,0,0,0.08)")
//                                         }
//                                         onMouseLeave={(e) =>
//                                           (e.currentTarget.style.boxShadow =
//                                             "0 2px 4px rgba(0,0,0,0.04)")
//                                         }
//                                       >
//                                         <Link
//                                           to={item.route}
//                                           target="_blank"
//                                           rel="noopener noreferrer"
//                                           className="text-decoration-none d-flex justify-content-between align-items-center"
//                                         >
//                                           <div className="me-3">
//                                             <h6 className="fw-semibold mb-1 text-dark fs-6">
//                                               {item.title}
//                                             </h6>
//                                             <p
//                                               className="mb-0 text-muted"
//                                               style={{
//                                                 fontSize: "13px",
//                                                 lineHeight: "1.4",
//                                               }}
//                                             >
//                                               {item.desc}
//                                             </p>
//                                           </div>
//                                           <img
//                                             src={item.image}
//                                             alt={item.title}
//                                             style={{
//                                               width: "38px",
//                                               height: "38px",
//                                               borderRadius: "8px",
//                                               objectFit: "cover",
//                                             }}
//                                           />
//                                         </Link>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("venues")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <Link
//                           // to={targetURL}
//                           to="/venues"
//                           className="nav-link dropdown-toggle text-white fs-18"
//                           onClick={() => setOpenMenu(null)}
//                         >
//                           Venues
//                         </Link>

//                         <div
//                           className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 rounded-0"
//                           style={{
//                             display: openMenu === "venues" ? "block" : "none",
//                           }}
//                           onClick={() => setOpenMenu(null)}
//                         >
//                           <div className="container-fluid">
//                             <div className="row g-4">
//                               <div className="col-md-4 d-none d-md-block">
//                                 <div className="primary-light-bg rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
//                                   <div>
//                                     <h6 className="fw-bold mb-3">
//                                       Popular Categories
//                                     </h6>
//                                     <div className="d-flex flex-column flex-wrap gap-2">
//                                       <Link
//                                         to="/venues"
//                                         className="primary-text py-2 small me-2 d-flex align-items-center justify-content-between"
//                                       >
//                                         Wedding Venues <FaArrowRightLong />
//                                       </Link>

//                                       <Link
//                                         to="/venues"
//                                         className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
//                                       >
//                                         Popular Locations <FaArrowRightLong />
//                                       </Link>

//                                       {!isLoggedIn && (
//                                         <Link
//                                           to="/vendor-login"
//                                           className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
//                                         >
//                                           Are You Vendor <FaArrowRightLong />
//                                         </Link>
//                                       )}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>

//                               <div className="col-md-5 p-4">
//                                 <h6 className="fw-bold primary-text text-uppercase mb-3">
//                                   By Type
//                                 </h6>
//                                 <div className="row">
//                                   {(venueSubcategories.length > 0
//                                     ? [
//                                         ...venueSubcategories.map(
//                                           (s) => s.name
//                                         ),
//                                         "View All Venues",
//                                       ]
//                                     : [
//                                         "Banquet Halls",
//                                         "Marriage Garden / Lawns",
//                                         "Wedding Resorts",
//                                         "Small Function / Party Halls",
//                                         "Destination Wedding Venues",
//                                         "Kalyana Mandapams",
//                                         "4 Star & Above Wedding Hotels",
//                                         "Venue Concierge Services",
//                                         "View All Venues",
//                                       ]
//                                   ).map((item, i) => {
//                                     const isShowMore =
//                                       item === "View All Venues";
//                                     const path = isShowMore
//                                       ? "/venues"
//                                       : `/venues/${item
//                                           .toLowerCase()
//                                           .replace(/\s+/g, "-")
//                                           .replace(/[^a-z0-9\-]/g, "")}`;
//                                     return (
//                                       <div className="col-12 mb-2" key={i}>
//                                         <Link
//                                           to={path}
//                                           className={`dropdown-link d-flex align-items-center ${
//                                             isShowMore
//                                               ? "primary-text fw-bold text-decoration-underline"
//                                               : ""
//                                           }`}
//                                         >
//                                           <i className="bi bi-check-circle text-primary"></i>
//                                           <span className="small">{item}</span>
//                                         </Link>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>

//                               <div className="col-md-3 p-4">
//                                 <h6 className="fw-bold primary-text text-uppercase mb-3">
//                                   By City
//                                 </h6>
//                                 <div className="row">
//                                   {[
//                                     "Mumbai",
//                                     "Bangalore",
//                                     "Pune",
//                                     "Kolkata",
//                                     "Jaipur",
//                                     "Lucknow",
//                                     "Hyderabad",
//                                     "More",
//                                   ].map((city, i) => {
//                                     const isMore = city === "More";
//                                     const path = isMore
//                                       ? "/venues"
//                                       : `/venues?city=${encodeURIComponent(
//                                           city
//                                         )}`;
//                                     return (
//                                       <div className="col-12 mb-2" key={i}>
//                                         <Link
//                                           to={path}
//                                           onClick={() => {
//                                             if (!isMore) {
//                                               dispatch(setLocation(city));
//                                             }
//                                           }}
//                                           className={`dropdown-link d-flex align-items-center ${
//                                             isMore
//                                               ? "primary-text fw-bold text-decoration-underline"
//                                               : ""
//                                           }`}
//                                         >
//                                           <i className="bi bi-geo-alt text-primary"></i>
//                                           <span className="small">{city}</span>
//                                         </Link>
//                                       </div>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       {/* Vendors Dropdown */}
//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("vendors")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <Link
//                             to="/vendors"
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             Vendors
//                           </Link>
//                           <div
//                             className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
//                             style={{
//                               display:
//                                 openMenu === "vendors" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container">
//                               <div
//                                 style={{
//                                   columnCount: 4,
//                                   columnGap: "1rem",
//                                 }}
//                                 className="grid-layout"
//                               >
//                                 {vendorCategories.length > 0 &&
//                                   vendorCategories.map((cat, i) => (
//                                     <div
//                                       className="mb-4 d-inline-block w-100"
//                                       key={cat.id || i}
//                                     >
//                                       <div className="fw-bold primary-text text-uppercase mb-2">
//                                         {cat.name}
//                                       </div>
//                                       {Array.isArray(cat.subcategories) &&
//                                         cat.subcategories.length > 0 && (
//                                           <ul className="list-unstyled">
//                                             {cat.subcategories.map((sub, j) => (
//                                               <li
//                                                 key={sub.id || j}
//                                                 className="mb-1"
//                                               >
//                                                 <Link
//                                                   to={`/vendors/${toSlug(
//                                                     sub.name
//                                                   )}${
//                                                     reduxLocation
//                                                       ? `?city=${encodeURIComponent(
//                                                           reduxLocation
//                                                         )}`
//                                                       : ""
//                                                   }`}
//                                                   className="dropdown-link small d-block"
//                                                 >
//                                                   {formatName(sub.name)}
//                                                 </Link>
//                                               </li>
//                                             ))}
//                                           </ul>
//                                         )}
//                                     </div>
//                                   ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("photography")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <Link
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             to="/photography"
//                             id="photoDropdown"
//                             role="button"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             Photography
//                           </Link>
//                           <div
//                             className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
//                             style={{
//                               display:
//                                 openMenu === "photography" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container">
//                               <div
//                                 style={{
//                                   columnCount: 4,
//                                   columnGap: "1rem",
//                                 }}
//                                 className="grid-layout"
//                               >
//                                 {photography.length > 0 &&
//                                   photography.map((cat, i) => (
//                                     <div
//                                       className="mb-4 d-inline-block w-100"
//                                       key={cat.id || i}
//                                     >
//                                       <div className="fw-bold primary-text text-uppercase mb-2">
//                                         {cat.name}
//                                       </div>
//                                       {Array.isArray(cat.categories) &&
//                                         cat.categories.length > 0 && (
//                                           <ul className="list-unstyled">
//                                             {cat.categories.map((sub, j) => (
//                                               <li
//                                                 key={sub.id || j}
//                                                 className="mb-1"
//                                               >
//                                                 <Link
//                                                   to={`/photography/${toSlug(
//                                                     sub.name
//                                                   )}`}
//                                                   className="dropdown-link small d-block"
//                                                 >
//                                                   {formatName(sub.name)}
//                                                 </Link>
//                                               </li>
//                                             ))}
//                                           </ul>
//                                         )}
//                                     </div>
//                                   ))}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("einvites")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <Link
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             to="/einvites"
//                             state={{ title: "E-Invites" }}
//                             id="einvitesDropdown"
//                             role="button"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             E-Invites
//                           </Link>

//                           <div
//                             className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
//                             style={{
//                               display:
//                                 openMenu === "einvites" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container p-0">
//                               <div className="row g-4">
//                                 <div className="col-md-12">
//                                   <h6 className="fw-semibold mb-3 primary-text text-uppercase">
//                                     E-Invitation Categories
//                                   </h6>
//                                   <ul className="list-unstyled col m-0 p-0">
//                                     {einviteCategories.map((sub, j) => (
//                                       <li
//                                         key={sub.id || j}
//                                         className="col-12 col-md-4 mb-1 p-0"
//                                       >
//                                         <Link
//                                           to={`/einvites/category/${sub.cardType}`}
//                                           className="dropdown-link small d-block"
//                                         >
//                                           {formatName(sub.title)}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("blog")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <Link
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             to="/blog"
//                             state={{ title: "Blog" }}
//                             id="blog"
//                             role="button"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             Blog
//                           </Link>

//                           <div
//                             className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
//                             style={{
//                               display: openMenu === "blog" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container">
//                               <div className="row">
//                                 <div className="col-12 col-md-4">
//                                   <div className="fw-bold primary-text text-uppercase">
//                                     Browse by Category
//                                   </div>
//                                   <ul className="list-unstyled col mt-2 p-0">
//                                     {weddingTopics.map((topic, index) => (
//                                       <li
//                                         key={index}
//                                         className="dropdown-link small d-block mb-2"
//                                       >
//                                         <Link
//                                           to="/blog"
//                                           style={{
//                                             textDecoration: " none",
//                                             color: "#212529",
//                                             marginBottom: "10px",
//                                           }}
//                                         >
//                                           {topic}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>

//                                 <div className="col-12 col-md-4">
//                                   <h6 className="primary-text fw-bold">
//                                     Popular Sections
//                                   </h6>
//                                   <ul className="list-unstyled mt-2">
//                                     {weddingCategories.map(
//                                       (category, index) => (
//                                         <li
//                                           key={index}
//                                           className="dropdown-link small d-block mb-2"
//                                         >
//                                           <Link
//                                             to="/blog"
//                                             style={{
//                                               textDecoration: " none",
//                                               color: "#212529",
//                                             }}
//                                           >
//                                             {category}
//                                           </Link>
//                                         </li>
//                                       )
//                                     )}
//                                   </ul>
//                                 </div>

//                                 <div className="col-12 col-md-4">
//                                   <h6 className="primary-text fw-bold">
//                                     Most Searched Blogs
//                                   </h6>
//                                   <ul className="list-unstyled mb-0 mt-2">
//                                     {weddingIdeas.map((idea, index) => (
//                                       <li
//                                         key={index}
//                                         className="dropdown-link small d-block mb-2"
//                                       >
//                                         <Link
//                                           to="/blog"
//                                           style={{
//                                             textDecoration: " none",
//                                             color: "#212529",
//                                           }}
//                                         >
//                                           {idea}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
//                         <div className="dropdown-wrapper">
//                           <Link
//                             className="nav-link text-white fs-18"
//                             to="/genie"
//                             state={{ title: "Genie" }}
//                             id="photoDropdown"
//                             role="button"
//                           >
//                             Genie
//                           </Link>
//                         </div>
//                       </li>

//                       <li
//                         className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
//                         onMouseEnter={() => setOpenMenu("real-wedding")}
//                         onMouseLeave={() => setOpenMenu(null)}
//                       >
//                         <div className="dropdown-wrapper">
//                           <Link
//                             className="nav-link dropdown-toggle text-white fs-18"
//                             to="/real-wedding"
//                             state={{ title: "Real Wedding" }}
//                             id="real-wedding"
//                             role="button"
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             Real Wedding
//                           </Link>

//                           <div
//                             className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
//                             style={{
//                               display:
//                                 openMenu === "real-wedding" ? "block" : "none",
//                             }}
//                             onClick={() => setOpenMenu(null)}
//                           >
//                             <div className="container">
//                               <div className="row">
//                                 <div className="col-12 col-md-4">
//                                   <div className="fw-bold primary-text text-uppercase">
//                                     By City
//                                   </div>
//                                   <ul className="list-unstyled mb-0 mt-2">
//                                     {byCity.map((city, index) => (
//                                       <li
//                                         key={index}
//                                         className="dropdown-link small d-block mb-2"
//                                       >
//                                         <Link
//                                           to="/real-wedding"
//                                           style={{
//                                             textDecoration: " none",
//                                             color: "#212529",
//                                           }}
//                                         >
//                                           {city}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>

//                                 <div className="col-12 col-md-4">
//                                   <h6 className="primary-text fw-bold">
//                                     By Culture
//                                   </h6>
//                                   <ul className="list-unstyled mb-0 mt-2">
//                                     {byCulture.map((culture, index) => (
//                                       <li
//                                         key={index}
//                                         className="dropdown-link small d-block mb-2"
//                                       >
//                                         <Link
//                                           to="/real-wedding"
//                                           style={{
//                                             textDecoration: " none",
//                                             color: "#212529",
//                                           }}
//                                         >
//                                           {culture}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>

//                                 <div className="col-12 col-md-4">
//                                   <h6 className="primary-text fw-bold">
//                                     By Theme
//                                   </h6>
//                                   <ul className="list-unstyled mb-0 mt-2">
//                                     {byTheme.map((theme, index) => (
//                                       <li
//                                         key={index}
//                                         className="dropdown-link small d-block mb-2"
//                                       >
//                                         <Link
//                                           to="/real-wedding"
//                                           style={{
//                                             textDecoration: " none",
//                                             color: "#212529",
//                                           }}
//                                         >
//                                           {theme}
//                                         </Link>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </li>

//                       {isUserLoggedIn ? (
//                         <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
//                           <div className="dropdown-wrapper">
//                             <Link
//                               to="/user-dashboard"
//                               className="nav-link text-white fs-18"
//                             >
//                               User Dashboard
//                             </Link>
//                           </div>
//                         </li>
//                       ) : isVendorLoggedIn ? (
//                         <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
//                           <div className="dropdown-wrapper">
//                             <Link
//                               to="/vendor-dashboard"
//                               className="nav-link text-white fs-18"
//                             >
//                               Vendor Dashboard
//                             </Link>
//                           </div>
//                         </li>
//                       ) : (
//                         <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
//                           <div className="dropdown-wrapper">
//                             <Link
//                               to="/customer-login"
//                               className="nav-link text-white fs-18"
//                             >
//                               Login
//                             </Link>
//                           </div>
//                         </li>
//                       )}

//                       {isLoggedIn && (
//                         <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
//                           <div className="dropdown-wrapper">
//                             <button
//                               onClick={handleLogout}
//                               className="nav-link text-white btn fs-18"
//                               style={{ textDecoration: "none" }}
//                             >
//                               Logout
//                             </button>
//                           </div>
//                         </li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Header;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LocationModalWithCategories from "./LocationModalWithCategories";
import { RiMenuFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { vendorLogout } from "../../redux/vendorAuthSlice";
import { setLocation } from "../../redux/locationSlice";
import {
  FaArrowRightLong,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa6";
import {
  FaRing,
  FaClipboardList,
  FaStore,
  FaUsers,
  FaPiggyBank,
  FaHeart,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import usePhotography from "../../hooks/usePhotography";

const Header = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCity, setSelectedCity] = useState(reduxLocation);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const navigate = useNavigate();

  const formatName = (name) => name.replace(/\band\b/gi, "&");

  const weddingCategories = [
    "South Indian wedding",
    "Real Brides Reveal",
    "Bridal Buys",
    "Real Wedding",
    "Mehendi Ideas",
    "Indian Wedding Ideas",
  ];

  const weddingTopics = [
    "Bridal Makeup",
    "Honeymoon Travel",
    "Wedding Songs and Videos",
    "Bridal Hairstyles",
    "Wedding Decor Ideas",
    "Bridal Style Advice",
    "Wedding Gifts and Favors",
    "Budget Weddings",
    "More",
  ];

  const weddingIdeas = [
    "Wedding Songs",
    "Best Bridal Entry Songs",
    "Chandni Chowk Lehengas",
    "Best Bridal Hairstyles",
    "Bridal Mehendi Designs",
    "Best Groom Entry Songs",
    "Wittiest Wedding Hashtags",
    "2025 Marriage Dates",
    "Latest Sabyasachi Lehengas",
    "Bridal Blouse Designs",
  ];

  const byCity = ["Mumbai", "Bangalore", "Pune", "Kolkata", "Jaipur", "Others"];
  const byCulture = [
    "Maharashtrian",
    "Punjabi / Sikh",
    "Bengali",
    "Gujarati",
    "Marwari",
    "Telugu",
    "Others",
  ];
  const byTheme = [
    "Destination",
    "Grand & Luxurious",
    "Pocket Friendly Stunners",
    "Intimate & Minimalist",
    "Modern & Stylish",
    "International",
    "Others",
  ];

  const handleLogout = () => {
    if (isVendorLoggedIn) {
      dispatch(vendorLogout());
    } else {
      dispatch(logout());
    }
    localStorage.clear();
    setMobileMenuOpen(false);
  };

  const { user, token: userToken } = useSelector((state) => state.auth);
  const { vendor, token: vendorToken } = useSelector(
    (state) => state.vendorAuth
  );

  const isUserLoggedIn = !!userToken && !!user;
  const isVendorLoggedIn = !!vendorToken && !!vendor;
  const isLoggedIn = isUserLoggedIn || isVendorLoggedIn;

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  const location = window.location.pathname;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  }, [location]);

  const tabs = [
    {
      id: "wedding",
      slug: "my-wedding",
      label: "My Wedding",
      img: "/images/userDashboard/mywedding-img.svg",
    },
    {
      id: "checklist",
      slug: "checklist",
      label: "Checklist",
      img: "/images/userDashboard/checklist-img.svg",
    },
    {
      id: "vendors",
      slug: "vendor",
      label: "Vendor",
      img: "/images/userDashboard/vendor-img.svg",
    },
    {
      id: "guest-list",
      slug: "guest-list",
      label: "Guest list",
      img: "/images/userDashboard/guestlist-img.svg",
    },
    {
      id: "budget",
      slug: "budget",
      label: "Budget",
      img: "/images/userDashboard/budget-img.svg",
    },
    {
      id: "wishlist",
      slug: "wishlist",
      label: "Wishlist",
      img: "/images/userDashboard/wishlist-img.svg",
    },
    {
      id: "message",
      slug: "message",
      label: "Message",
      img: "/images/userDashboard/message-img.svg",
    },
    {
      id: "real-wedding",
      slug: "real-wedding",
      label: "Real wedding",
      img: "/images/userDashboard/real-wedding-img.svg",
    },
    {
      id: "user-profile",
      slug: "user-profile",
      label: "Profile",
      img: "/images/userDashboard/userProfile-img.svg",
    },
  ];

  const [venueSubcategories, setVenueSubcategories] = useState([]);
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        const venues = data.find(
          (vendor) => vendor.name && vendor.name.toLowerCase() === "venues"
        );
        if (venues && Array.isArray(venues.subcategories)) {
          setVenueSubcategories(venues.subcategories);
        } else {
          setVenueSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  const [vendorCategories, setVendorCategories] = useState([]);
  const [einviteCategories, setEinviteCategories] = useState([
    {
      cardType: "wedding_einvite",
      title: "Wedding E-Invitations",
      icon: "bi-heart",
    },
    { cardType: "video", title: "Video Invitations", icon: "bi-play-circle" },
    {
      cardType: "save_the_date",
      title: "Save the Date",
      icon: "bi-calendar-heart",
    },
  ]);

  useEffect(() => {
    const fetchVendorCategories = async () => {
      try {
        const response = await fetch(
          "https://happywedz.com/api/vendor-types/with-subcategories/all"
        );
        const data = await response.json();
        setVendorCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        setVendorCategories([]);
        console.error("Error fetching vendor categories:", error);
      }
    };
    fetchVendorCategories();
  }, []);

  const {
    typesWithCategories,
    fetchTypesWithCategories,
    loading: photographyLoading,
    error: photographyError,
  } = usePhotography();

  const [photography, setPhotography] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await fetchTypesWithCategories();
    };
    fetchData();
  }, []);

  useEffect(() => {
    setPhotography(typesWithCategories);
  }, [typesWithCategories]);

  const vendorType = encodeURIComponent("Venues");
  const cityParam = selectedCity
    ? `&city=${encodeURIComponent(selectedCity)}`
    : "";

  const targetURL = `/vendors/all?vendorType=${vendorType}${cityParam}`;

  const toggleMobileSubmenu = (menu) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
          style={{
            opacity: 0.5,
            zIndex: 1049,
            transition: "opacity 0.3s ease",
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <nav className="navbar navbar-expand-lg navbar-light shadow-sm primary-bg p-0">
        <div className="container-fluid p-0">
          <div className="d-flex d-lg-none justify-content-between align-items-center w-100 py-2 px-3">
            <Link
              className="navbar-brand m-0"
              to="/"
              onClick={handleMobileLinkClick}
            >
              <img src="/happywed_white.png" alt="HappyWedz" height="30" />
            </Link>

            <button
              className="navbar-toggler border-0 p-0"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <RiMenuFill color="white" size={35} />
            </button>
          </div>

          {/* Mobile Side Drawer */}
          <div
            className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg d-lg-none ${
              mobileMenuOpen ? "mobile-drawer-open" : ""
            }`}
            style={{
              width: "85%",
              maxWidth: "400px",
              zIndex: 1050,
              transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s ease-in-out",
              overflowY: "auto",
            }}
          >
            {/* Drawer Header */}
            <div className="d-flex justify-content-between align-items-center p-3 primary-bg">
              <Link to="/" onClick={handleMobileLinkClick}>
                <img src="/happywed_white.png" alt="HappyWedz" height="30" />
              </Link>
              <button
                className="btn border-0 p-0"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{ textAlign: "end" }}
              >
                <IoClose color="white" size={30} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-3">
              {/* Location Selector */}
              <div className="mb-3 d-flex align-items-center justify-content-between">
                <LocationModalWithCategories />
                <div>
                  <Link
                    to="/try"
                    state={{ title: "Try" }}
                    onClick={handleMobileLinkClick}
                  >
                    <img
                      src="/images/header/tryimg.png"
                      alt="Design Studio"
                      className="img-fluid"
                      style={{ maxHeight: "40px", cursor: "pointer" }}
                    />
                  </Link>
                </div>
              </div>

              {/* Menu Items */}
              <ul className="list-unstyled mb-0">
                {/* Planning Tools */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("planning")}
                  >
                    <span className="fw-semibold">Planning Tools</span>
                    {mobileSubmenu === "planning" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "planning" && (
                    <div className="ps-3 mt-2">
                      {tabs.map((tab) => (
                        <Link
                          key={tab.id}
                          to={`/user-dashboard/${tab.slug}`}
                          className="d-flex align-items-center py-2 text-decoration-none text-dark"
                          onClick={handleMobileLinkClick}
                        >
                          <div
                            className="d-flex align-items-center justify-content-center me-2"
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              backgroundColor: "#ed1173",
                            }}
                          >
                            <img
                              src={tab.img}
                              alt=""
                              style={{
                                height: "25px",
                                width: "25px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <span className="small">{tab.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Venues */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("venues")}
                  >
                    <span className="fw-semibold">Venues</span>
                    {mobileSubmenu === "venues" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "venues" && (
                    <div className="ps-3 mt-2">
                      <h6 className="fw-bold small text-uppercase primary-text mb-2">
                        By Type
                      </h6>
                      {(venueSubcategories.length > 0
                        ? [
                            ...venueSubcategories.map((s) => s.name),
                            "View All Venues",
                          ]
                        : [
                            "Banquet Halls",
                            "Marriage Garden / Lawns",
                            "Wedding Resorts",
                            "Small Function / Party Halls",
                            "Destination Wedding Venues",
                            "Kalyana Mandapams",
                            "4 Star & Above Wedding Hotels",
                            "Venue Concierge Services",
                            "View All Venues",
                          ]
                      ).map((item, i) => {
                        const isShowMore = item === "View All Venues";
                        const path = isShowMore
                          ? "/venues"
                          : `/venues/${item
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9\-]/g, "")}`;
                        return (
                          <Link
                            key={i}
                            to={path}
                            className="d-block py-2 text-decoration-none text-dark small"
                            onClick={handleMobileLinkClick}
                          >
                            {item}
                          </Link>
                        );
                      })}

                      <h6 className="fw-bold small text-uppercase primary-text mt-3 mb-2">
                        By City
                      </h6>
                      {[
                        "Mumbai",
                        "Bangalore",
                        "Pune",
                        "Kolkata",
                        "Jaipur",
                        "Lucknow",
                        "Hyderabad",
                        "More",
                      ].map((city, i) => {
                        const isMore = city === "More";
                        const path = isMore
                          ? "/venues"
                          : `/venues?city=${encodeURIComponent(city)}`;
                        return (
                          <Link
                            key={i}
                            to={path}
                            onClick={() => {
                              if (!isMore) {
                                dispatch(setLocation(city));
                              }
                              handleMobileLinkClick();
                            }}
                            className="d-block py-2 text-decoration-none text-dark small"
                          >
                            {city}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </li>

                {/* Vendors */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("vendors")}
                  >
                    <span className="fw-semibold">Vendors</span>
                    {mobileSubmenu === "vendors" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "vendors" && (
                    <div
                      className="ps-3 mt-2"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {vendorCategories.length > 0 &&
                        vendorCategories.map((cat, i) => (
                          <div key={cat.id || i} className="mb-3">
                            <h6 className="fw-bold small text-uppercase primary-text mb-2">
                              {cat.name}
                            </h6>
                            {Array.isArray(cat.subcategories) &&
                              cat.subcategories.length > 0 && (
                                <div>
                                  {cat.subcategories.map((sub, j) => (
                                    <Link
                                      key={sub.id || j}
                                      to={`/vendors/${toSlug(sub.name)}${
                                        reduxLocation
                                          ? `?city=${encodeURIComponent(
                                              reduxLocation
                                            )}`
                                          : ""
                                      }`}
                                      className="d-block py-2 text-decoration-none text-dark small"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {formatName(sub.name)}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  )}
                </li>

                {/* Photography */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("photography")}
                  >
                    <span className="fw-semibold">Photography</span>
                    {mobileSubmenu === "photography" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "photography" && (
                    <div
                      className="ps-3 mt-2"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {photography.length > 0 &&
                        photography.map((cat, i) => (
                          <div key={cat.id || i} className="mb-3">
                            <h6 className="fw-bold small text-uppercase primary-text mb-2">
                              {cat.name}
                            </h6>
                            {Array.isArray(cat.categories) &&
                              cat.categories.length > 0 && (
                                <div>
                                  {cat.categories.map((sub, j) => (
                                    <Link
                                      key={sub.id || j}
                                      to={`/photography/${toSlug(sub.name)}`}
                                      className="d-block py-2 text-decoration-none text-dark small"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {formatName(sub.name)}
                                    </Link>
                                  ))}
                                </div>
                              )}
                          </div>
                        ))}
                    </div>
                  )}
                </li>

                {/* E-Invites */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("einvites")}
                  >
                    <span className="fw-semibold">E-Invites</span>
                    {mobileSubmenu === "einvites" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "einvites" && (
                    <div className="ps-3 mt-2">
                      {einviteCategories.map((sub, j) => (
                        <Link
                          key={sub.cardType || j}
                          to={`/einvites/category/${sub.cardType}`}
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {formatName(sub.title)}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Blog */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("blog")}
                  >
                    <span className="fw-semibold">Blog</span>
                    {mobileSubmenu === "blog" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "blog" && (
                    <div
                      className="ps-3 mt-2"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      <h6 className="fw-bold small text-uppercase primary-text mb-2">
                        Browse by Category
                      </h6>
                      {weddingTopics.map((topic, index) => (
                        <Link
                          key={index}
                          to="/blog"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {topic}
                        </Link>
                      ))}

                      <h6 className="fw-bold small text-uppercase primary-text mt-3 mb-2">
                        Popular Sections
                      </h6>
                      {weddingCategories.map((category, index) => (
                        <Link
                          key={index}
                          to="/blog"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {category}
                        </Link>
                      ))}

                      <h6 className="fw-bold small text-uppercase primary-text mt-3 mb-2">
                        Most Searched Blogs
                      </h6>
                      {weddingIdeas.map((idea, index) => (
                        <Link
                          key={index}
                          to="/blog"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {idea}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Genie */}
                <li className="mb-2">
                  <Link
                    to="/genie"
                    className="btn w-100 text-start p-3 border-0 bg-light fw-semibold text-dark"
                    onClick={handleMobileLinkClick}
                  >
                    Genie
                  </Link>
                </li>

                {/* Real Wedding */}
                <li className="mb-2">
                  <button
                    className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 border-0 bg-light"
                    onClick={() => toggleMobileSubmenu("real-wedding")}
                  >
                    <span className="fw-semibold">Real Wedding</span>
                    {mobileSubmenu === "real-wedding" ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    )}
                  </button>
                  {mobileSubmenu === "real-wedding" && (
                    <div className="ps-3 mt-2">
                      <h6 className="fw-bold small text-uppercase primary-text mb-2">
                        By City
                      </h6>
                      {byCity.map((city, index) => (
                        <Link
                          key={index}
                          to="/real-wedding"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {city}
                        </Link>
                      ))}

                      <h6 className="fw-bold small text-uppercase primary-text mt-3 mb-2">
                        By Culture
                      </h6>
                      {byCulture.map((culture, index) => (
                        <Link
                          key={index}
                          to="/real-wedding"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {culture}
                        </Link>
                      ))}

                      <h6 className="fw-bold small text-uppercase primary-text mt-3 mb-2">
                        By Theme
                      </h6>
                      {byTheme.map((theme, index) => (
                        <Link
                          key={index}
                          to="/real-wedding"
                          className="d-block py-2 text-decoration-none text-dark small"
                          onClick={handleMobileLinkClick}
                        >
                          {theme}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>

                {/* Auth Links */}
                <li className="mb-2">
                  {isUserLoggedIn ? (
                    <Link
                      to="/user-dashboard"
                      className="btn w-100 text-start p-3 border-0 bg-light fw-semibold text-dark"
                      onClick={handleMobileLinkClick}
                    >
                      User Dashboard
                    </Link>
                  ) : isVendorLoggedIn ? (
                    <Link
                      to="/vendor-dashboard"
                      className="btn w-100 text-start p-3 border-0 bg-light fw-semibold text-dark"
                      onClick={handleMobileLinkClick}
                    >
                      Vendor Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/customer-login"
                      className="btn w-100 text-start p-3 border-0 bg-light fw-semibold text-dark"
                      onClick={handleMobileLinkClick}
                    >
                      Login
                    </Link>
                  )}
                </li>

                {isLoggedIn && (
                  <li className="mb-2">
                    <button
                      onClick={handleLogout}
                      className="btn w-100 text-start p-3 border-0 bg-danger text-white fw-semibold"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>

              {/* App Download Section */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="fw-semibold mb-3">Get the App</h6>
                <div className="d-flex gap-2 mb-3">
                  <img
                    src="/images/header/playstore.png"
                    alt="Play Store"
                    className="img-fluid"
                    style={{ maxHeight: "35px", cursor: "pointer" }}
                  />
                  <img
                    src="/images/header/appstore.png"
                    alt="App Store"
                    className="img-fluid"
                    style={{ maxHeight: "35px", cursor: "pointer" }}
                  />
                </div>
                {/* <Link
                  to="/try"
                  state={{ title: "Try" }}
                  onClick={handleMobileLinkClick}
                >
                  <img
                    src="/images/header/tryimg.png"
                    alt="Design Studio"
                    className="img-fluid"
                    style={{ maxHeight: "40px", cursor: "pointer" }}
                  />
                </Link> */}
              </div>
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="d-none d-lg-block w-100">
            <div className="row w-100" style={{ margin: 0, padding: 0 }}>
              <div className="col-12 bg-white p-2">
                <div className="container w-100 p-0">
                  <div className="row align-items-center gy-2">
                    {/* Left: Tagline */}
                    <div className="col-12 col-sm-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-sm-start">
                      <a
                        className="nav-link fw-bold top-header-heading"
                        href="#"
                        style={{ color: "#C31162" }}
                      >
                        India's Favourite Wedding Planning Platform
                      </a>
                    </div>

                    {/* Middle: Location Selector */}
                    <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center justify-content-sm-start">
                      <LocationModalWithCategories />
                    </div>

                    {/* Right: Store Icons */}
                    <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center justify-content-lg-end gap-4">
                      <img
                        src="/images/header/playstore.png"
                        alt="Play Store"
                        title="Download on Play Store"
                        className="img-fluid"
                        style={{
                          maxHeight: "28px",
                          width: "auto",
                          cursor: "pointer",
                        }}
                      />

                      <img
                        src="/images/header/appstore.png"
                        alt="App Store"
                        title="Download on App Store"
                        className="img-fluid"
                        style={{
                          maxHeight: "28px",
                          width: "auto",
                          cursor: "pointer",
                        }}
                      />

                      <Link
                        to="/try"
                        state={{ title: "Try" }}
                        title="Try Design Studio"
                      >
                        <img
                          src="/images/header/tryimg.png"
                          alt="Design Studio"
                          className="img-fluid"
                          style={{
                            maxHeight: "50px",
                            width: "auto",
                            cursor: "pointer",
                          }}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom */}
              <div className="col-12 py-0">
                <div className="container" style={{ maxWidth: "1400px" }}>
                  <div className="d-flex w-100 justify-content-center">
                    <div className="col-lg-12 d-flex flex-column flex-lg-row align-items-center justify-content-between flex-nowrap">
                      <div className="text-center">
                        <Link className="navbar-brand-logo" to="/">
                          <img
                            src="/images/logo.webp"
                            alt="HappyWedz"
                            height="40"
                            className="mx-auto d-block"
                          />
                        </Link>
                      </div>
                      <ul className="navbar-nav d-flex flex-wrap justify-content-center gap-2">
                        {/* Planning Tools Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("planning")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <button
                              className="nav-link dropdown-toggle text-white fs-18"
                              onClick={() => setOpenMenu(null)}
                            >
                              Planning Tools
                            </button>

                            <div
                              className="dropdown-menu mega-dropdown w-75 border-0 mt-0 p-4 rounded-0 shadow-sm bg-white"
                              style={{
                                display:
                                  openMenu === "planning" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row g-4">
                                  {/* LEFT SECTION */}
                                  <div className="col-md-8">
                                    <h6 className="fw-semibold text-dark mb-4 fs-5">
                                      Plan your unique wedding
                                    </h6>

                                    <div
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "1.25rem 1rem",
                                      }}
                                    >
                                      {tabs.map((tab) => (
                                        <div
                                          key={tab.id}
                                          onClick={() =>
                                            navigate(
                                              `/user-dashboard/${tab.slug}`
                                            )
                                          }
                                          className="d-flex align-items-center"
                                          style={{
                                            cursor: "pointer",
                                            transition:
                                              "color 0.2s ease-in-out",
                                          }}
                                          onMouseEnter={(e) =>
                                            (e.currentTarget.style.color =
                                              "#e91e63")
                                          }
                                          onMouseLeave={(e) =>
                                            (e.currentTarget.style.color =
                                              "#212529")
                                          }
                                        >
                                          <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                              width: "45px",
                                              height: "45px",
                                              borderRadius: "50%",
                                              backgroundColor: "#ed1173",
                                              color: "#fff",
                                            }}
                                          >
                                            <div
                                              style={{
                                                height: "45px",
                                                width: "45px",
                                                padding: "5px",
                                                border: "none",
                                              }}
                                            >
                                              <img
                                                src={tab.img}
                                                alt=""
                                                style={{
                                                  height: "100%",
                                                  width: "100%",
                                                  objectFit: "contain",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            </div>
                                          </div>
                                          <span className="ms-2 small">
                                            {tab.label}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* RIGHT SECTION */}
                                  <div className="col-md-4">
                                    <div className="d-flex flex-column gap-3">
                                      {[
                                        {
                                          title: "Get the HappyWedz App",
                                          desc: "Plan your wedding on the go with the HappyWedz app.",
                                          image: "/images/header/playstore.png",
                                        },
                                        {
                                          title: "Happywedz Website",
                                          desc: "Showcase your wedding website to friends and family.",
                                          image: "/images/couple.png",
                                          route: "/choose-template",
                                        },
                                      ].map((item, i) => (
                                        <div
                                          key={i}
                                          className="p-3 rounded-4 bg-white shadow-lg border-2"
                                          style={{
                                            border: "1px solid #f0f0f0",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease-in-out",
                                          }}
                                          onMouseEnter={(e) =>
                                            (e.currentTarget.style.boxShadow =
                                              "0 4px 12px rgba(0,0,0,0.08)")
                                          }
                                          onMouseLeave={(e) =>
                                            (e.currentTarget.style.boxShadow =
                                              "0 2px 4px rgba(0,0,0,0.04)")
                                          }
                                        >
                                          <Link
                                            to={item.route}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none d-flex justify-content-between align-items-center"
                                          >
                                            <div className="me-3">
                                              <h6 className="fw-semibold mb-1 text-dark fs-6">
                                                {item.title}
                                              </h6>
                                              <p
                                                className="mb-0 text-muted"
                                                style={{
                                                  fontSize: "13px",
                                                  lineHeight: "1.4",
                                                }}
                                              >
                                                {item.desc}
                                              </p>
                                            </div>
                                            <img
                                              src={item.image}
                                              alt={item.title}
                                              style={{
                                                width: "38px",
                                                height: "38px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Venues Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("venues")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <Link
                            to="/venues"
                            className="nav-link dropdown-toggle text-white fs-18"
                            onClick={() => setOpenMenu(null)}
                          >
                            Venues
                          </Link>

                          <div
                            className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 rounded-0"
                            style={{
                              display: openMenu === "venues" ? "block" : "none",
                            }}
                            onClick={() => setOpenMenu(null)}
                          >
                            <div className="container-fluid">
                              <div className="row g-4">
                                <div className="col-md-4 d-none d-md-block">
                                  <div className="primary-light-bg rounded-4 shadow-sm p-4 h-100 d-flex flex-column justify-content-between">
                                    <div>
                                      <h6 className="fw-bold mb-3">
                                        Popular Categories
                                      </h6>
                                      <div className="d-flex flex-column flex-wrap gap-2">
                                        <Link
                                          to="/venues"
                                          className="primary-text py-2 small me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Wedding Venues <FaArrowRightLong />
                                        </Link>

                                        <Link
                                          to="/venues"
                                          className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
                                        >
                                          Popular Locations <FaArrowRightLong />
                                        </Link>

                                        {!isLoggedIn && (
                                          <Link
                                            to="/vendor-login"
                                            className="primary-text  py-2 small me-2 d-flex align-items-center justify-content-between"
                                          >
                                            Are You Vendor <FaArrowRightLong />
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-5 p-4">
                                  <h6 className="fw-bold primary-text text-uppercase mb-3">
                                    By Type
                                  </h6>
                                  <div className="row">
                                    {(venueSubcategories.length > 0
                                      ? [
                                          ...venueSubcategories.map(
                                            (s) => s.name
                                          ),
                                          "View All Venues",
                                        ]
                                      : [
                                          "Banquet Halls",
                                          "Marriage Garden / Lawns",
                                          "Wedding Resorts",
                                          "Small Function / Party Halls",
                                          "Destination Wedding Venues",
                                          "Kalyana Mandapams",
                                          "4 Star & Above Wedding Hotels",
                                          "Venue Concierge Services",
                                          "View All Venues",
                                        ]
                                    ).map((item, i) => {
                                      const isShowMore =
                                        item === "View All Venues";
                                      const path = isShowMore
                                        ? "/venues"
                                        : `/venues/${item
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            .replace(/[^a-z0-9\-]/g, "")}`;
                                      return (
                                        <div className="col-12 mb-2" key={i}>
                                          <Link
                                            to={path}
                                            className={`dropdown-link d-flex align-items-center ${
                                              isShowMore
                                                ? "primary-text fw-bold text-decoration-underline"
                                                : ""
                                            }`}
                                          >
                                            <i className="bi bi-check-circle text-primary"></i>
                                            <span className="small">
                                              {item}
                                            </span>
                                          </Link>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="col-md-3 p-4">
                                  <h6 className="fw-bold primary-text text-uppercase mb-3">
                                    By City
                                  </h6>
                                  <div className="row">
                                    {[
                                      "Mumbai",
                                      "Bangalore",
                                      "Pune",
                                      "Kolkata",
                                      "Jaipur",
                                      "Lucknow",
                                      "Hyderabad",
                                      "More",
                                    ].map((city, i) => {
                                      const isMore = city === "More";
                                      const path = isMore
                                        ? "/venues"
                                        : `/venues?city=${encodeURIComponent(
                                            city
                                          )}`;
                                      return (
                                        <div className="col-12 mb-2" key={i}>
                                          <Link
                                            to={path}
                                            onClick={() => {
                                              if (!isMore) {
                                                dispatch(setLocation(city));
                                              }
                                            }}
                                            className={`dropdown-link d-flex align-items-center ${
                                              isMore
                                                ? "primary-text fw-bold text-decoration-underline"
                                                : ""
                                            }`}
                                          >
                                            <i className="bi bi-geo-alt text-primary"></i>
                                            <span className="small">
                                              {city}
                                            </span>
                                          </Link>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Vendors Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("vendors")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              to="/vendors"
                              className="nav-link dropdown-toggle text-white fs-18"
                              onClick={() => setOpenMenu(null)}
                            >
                              Vendors
                            </Link>
                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "vendors" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div
                                  style={{
                                    columnCount: 4,
                                    columnGap: "1rem",
                                  }}
                                  className="grid-layout"
                                >
                                  {vendorCategories.length > 0 &&
                                    vendorCategories.map((cat, i) => (
                                      <div
                                        className="mb-4 d-inline-block w-100"
                                        key={cat.id || i}
                                      >
                                        <div className="fw-bold primary-text text-uppercase mb-2">
                                          {cat.name}
                                        </div>
                                        {Array.isArray(cat.subcategories) &&
                                          cat.subcategories.length > 0 && (
                                            <ul className="list-unstyled">
                                              {cat.subcategories.map(
                                                (sub, j) => (
                                                  <li
                                                    key={sub.id || j}
                                                    className="mb-1"
                                                  >
                                                    <Link
                                                      to={`/vendors/${toSlug(
                                                        sub.name
                                                      )}${
                                                        reduxLocation
                                                          ? `?city=${encodeURIComponent(
                                                              reduxLocation
                                                            )}`
                                                          : ""
                                                      }`}
                                                      className="dropdown-link small d-block"
                                                    >
                                                      {formatName(sub.name)}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Photography Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("photography")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-18"
                              to="/photography"
                              id="photoDropdown"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Photography
                            </Link>
                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "photography" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div
                                  style={{
                                    columnCount: 4,
                                    columnGap: "1rem",
                                  }}
                                  className="grid-layout"
                                >
                                  {photography.length > 0 &&
                                    photography.map((cat, i) => (
                                      <div
                                        className="mb-4 d-inline-block w-100"
                                        key={cat.id || i}
                                      >
                                        <div className="fw-bold primary-text text-uppercase mb-2">
                                          {cat.name}
                                        </div>
                                        {Array.isArray(cat.categories) &&
                                          cat.categories.length > 0 && (
                                            <ul className="list-unstyled">
                                              {cat.categories.map((sub, j) => (
                                                <li
                                                  key={sub.id || j}
                                                  className="mb-1"
                                                >
                                                  <Link
                                                    to={`/photography/${toSlug(
                                                      sub.name
                                                    )}`}
                                                    className="dropdown-link small d-block"
                                                  >
                                                    {formatName(sub.name)}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* E-Invites Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("einvites")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-18"
                              to="/einvites"
                              state={{ title: "E-Invites" }}
                              id="einvitesDropdown"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              E-Invites
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "einvites" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container p-0">
                                <div className="row g-4">
                                  <div className="col-md-12">
                                    <h6 className="fw-semibold mb-3 primary-text text-uppercase">
                                      E-Invitation Categories
                                    </h6>
                                    <ul className="list-unstyled col m-0 p-0">
                                      {einviteCategories.map((sub, j) => (
                                        <li
                                          key={sub.id || j}
                                          className="col-12 col-md-4 mb-1 p-0"
                                        >
                                          <Link
                                            to={`/einvites/category/${sub.cardType}`}
                                            className="dropdown-link small d-block"
                                          >
                                            {formatName(sub.title)}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Blog Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("blog")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-18"
                              to="/blog"
                              state={{ title: "Blog" }}
                              id="blog"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Blog
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display: openMenu === "blog" ? "block" : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-12 col-md-4">
                                    <div className="fw-bold primary-text text-uppercase">
                                      Browse by Category
                                    </div>
                                    <ul className="list-unstyled col mt-2 p-0">
                                      {weddingTopics.map((topic, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <Link
                                            to="/blog"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                              marginBottom: "10px",
                                            }}
                                          >
                                            {topic}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-4">
                                    <h6 className="primary-text fw-bold">
                                      Popular Sections
                                    </h6>
                                    <ul className="list-unstyled mt-2">
                                      {weddingCategories.map(
                                        (category, index) => (
                                          <li
                                            key={index}
                                            className="dropdown-link small d-block mb-2"
                                          >
                                            <Link
                                              to="/blog"
                                              style={{
                                                textDecoration: " none",
                                                color: "#212529",
                                              }}
                                            >
                                              {category}
                                            </Link>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-4">
                                    <h6 className="primary-text fw-bold">
                                      Most Searched Blogs
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {weddingIdeas.map((idea, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <Link
                                            to="/blog"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {idea}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Genie */}
                        <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link text-white fs-18"
                              to="/genie"
                              state={{ title: "Genie" }}
                              id="photoDropdown"
                              role="button"
                            >
                              Genie
                            </Link>
                          </div>
                        </li>

                        {/* Real Wedding Dropdown */}
                        <li
                          className="py-2 nav-item dropdown mega-dropdown-wrapper position-static"
                          onMouseEnter={() => setOpenMenu("real-wedding")}
                          onMouseLeave={() => setOpenMenu(null)}
                        >
                          <div className="dropdown-wrapper">
                            <Link
                              className="nav-link dropdown-toggle text-white fs-18"
                              to="/real-wedding"
                              state={{ title: "Real Wedding" }}
                              id="real-wedding"
                              role="button"
                              onClick={() => setOpenMenu(null)}
                            >
                              Real Wedding
                            </Link>

                            <div
                              className="dropdown-menu mega-dropdown w-75 shadow border-0 mt-0 p-4 rounded-0"
                              style={{
                                display:
                                  openMenu === "real-wedding"
                                    ? "block"
                                    : "none",
                              }}
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="container">
                                <div className="row">
                                  <div className="col-12 col-md-4">
                                    <div className="fw-bold primary-text text-uppercase">
                                      By City
                                    </div>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {byCity.map((city, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <Link
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {city}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-4">
                                    <h6 className="primary-text fw-bold">
                                      By Culture
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {byCulture.map((culture, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <Link
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {culture}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="col-12 col-md-4">
                                    <h6 className="primary-text fw-bold">
                                      By Theme
                                    </h6>
                                    <ul className="list-unstyled mb-0 mt-2">
                                      {byTheme.map((theme, index) => (
                                        <li
                                          key={index}
                                          className="dropdown-link small d-block mb-2"
                                        >
                                          <Link
                                            to="/real-wedding"
                                            style={{
                                              textDecoration: " none",
                                              color: "#212529",
                                            }}
                                          >
                                            {theme}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>

                        {/* Auth Links */}
                        {isUserLoggedIn ? (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/user-dashboard"
                                className="nav-link text-white fs-18"
                              >
                                User Dashboard
                              </Link>
                            </div>
                          </li>
                        ) : isVendorLoggedIn ? (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/vendor-dashboard"
                                className="nav-link text-white fs-18"
                              >
                                Vendor Dashboard
                              </Link>
                            </div>
                          </li>
                        ) : (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <Link
                                to="/customer-login"
                                className="nav-link text-white fs-18"
                              >
                                Login
                              </Link>
                            </div>
                          </li>
                        )}

                        {isLoggedIn && (
                          <li className="py-2 nav-item dropdown mega-dropdown-wrapper position-static">
                            <div className="dropdown-wrapper">
                              <button
                                onClick={handleLogout}
                                className="nav-link text-white btn fs-18"
                                style={{ textDecoration: "none" }}
                              >
                                Logout
                              </button>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
