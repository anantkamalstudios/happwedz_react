// import React, { useState, useEffect } from "react";
// import { FaBolt, FaPalette, FaMobileAlt } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import LoginPopup from "./DesignStudio.LoginPopup";
// import { setRoleType } from "../../../redux/roleSlice";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Card, CardActionArea, CardMedia } from "@mui/material";

// const TryLanding = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const user = useSelector((state) => state.auth.user);

//   var settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1500,
//     pauseOnHover: false,
//     arrows: false,
//   };

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   const handleLoginSuccess = () => {
//     setShowLoginPopup(false);
//     setShowModal(true);
//   };

//   const handleGetStarted = () => {
//     if (!user) {
//       setShowLoginPopup(true);
//     } else {
//       setShowModal(true);
//     }
//   };

//   const handleModalClose = () => {
//     setShowModal(false);
//   };
//   const handleLoginClose = () => setShowLoginPopup(false);

//   const handleCategorySelect = (category) => {
//     setShowModal(false);
//   };

//   return (
//     <>
//       <style>
//         {`
//           .slick-dots li button:before {
//             color: #2196F3 !important;   /* dot color */
//             font-size: 12px;
//           }
//           .slick-dots li.slick-active button:before {
//             color: #C31162 !important;   /* active dot color */
//           }
//           /* Ensure slider takes up the wrapper height so slides/images can size */
//           .slick-slider, .slick-list, .slick-track {
//             height: 100%;
//           }
//           /* Slick adds an extra wrapper div inside each slide; ensure it also fills height */
//           .slick-slide > div { height: 100%; }
//         `}
//       </style>
//       <div className="try-first-page-container">
//         {/* Hero Section */}
//         <div
//           className={`try-first-page-hero ${
//             isLoaded ? "try-first-page-loaded" : ""
//           }`}
//         >
//           {/* <div className="try-first-page-hero-particles">
//             <div className="try-first-page-particle"></div>
//             <div className="try-first-page-particle"></div>
//             <div className="try-first-page-particle"></div>
//             <div className="try-first-page-particle"></div>
//             <div className="try-first-page-particle"></div>
//           </div> */}

//           <div
//             style={{
//               height: "100%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "3rem",
//               position: "relative",
//             }}
//           >
//             <div
//               className="try-first-page-hero-content px-6"
//               style={{
//                 placeSelf: "flex-end",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-end",
//                 width: "100%",
//                 gap: "2rem",
//               }}
//             >
//               <div
//                 className="try-first-page-content-wrapper"
//                 style={{
//                   marginBottom: "2rem",
//                   marginLeft: "3rem",
//                   maxWidth: "520px",
//                   width: "100%",
//                 }}
//               >
//                 <h1
//                   className="try-first-page-title"
//                   style={{
//                     fontWeight: "400",
//                     textAlign: "start",
//                     color: "#C31162",
//                   }}
//                 >
//                   Virtual Try On
//                 </h1>
//                 <p
//                   style={{
//                     fontSize: "1.6rem",
//                     fontWeight: "500",
//                     wordSpacing: "1.5px",
//                     color: "#C31162",
//                   }}
//                 >
//                   Makeup, Jewellary & Outfits in One Place
//                 </p>
//                 <button
//                   style={{
//                     background: "linear-gradient(to right, #E83580, #821E48)",
//                     color: "#fff",
//                     border: "2px solid #C31162",
//                     padding: "0.5rem 0",
//                     fontWeight: "500",
//                     borderRadius: "10px",
//                     fontSize: "1.5rem",
//                     width: "100%",
//                   }}
//                   onClick={handleGetStarted}
//                 >
//                   Get Started
//                 </button>
//               </div>
//             </div>
//             <div
//               style={{
//                 maxWidth: "850px",
//                 height: "500px",
//               }}
//             >
//               <Slider {...settings} style={{ borderRadius: "20px" }}>
//                 <div
//                   style={{
//                     width: "100%",
//                     borderRadius: "20px",
//                     boxShadow: " 0 8px 40px #C31162",
//                     overflow: "hidden",
//                     background: "gray",
//                     padding: "0 20px",
//                     height: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   {/* <div
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       width: "100%",
//                       height: "100%",
//                       justifyContent: "center",
//                       alignItems: "center",
//                       padding: "1rem",
//                       borderRadius: "20px",
//                     }}
//                   >
//                     <Card
//                       style={{ flex: 1, borderRadius: "20px", height: "400px" }}
//                     >
//                       <CardActionArea>
//                         <CardMedia
//                           component="img"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                           image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop&q=80"
//                           alt="green iguana"
//                         />
//                       </CardActionArea>
//                     </Card>

//                     <Card
//                       style={{ flex: 1, borderRadius: "20px", height: "400px" }}
//                     >
//                       <CardActionArea>
//                         <CardMedia
//                           component="img"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                           image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop&q=80"
//                           alt="green iguana"
//                         />
//                       </CardActionArea>
//                     </Card>

//                     <Card
//                       style={{ flex: 1, borderRadius: "20px", height: "400px" }}
//                     >
//                       <CardActionArea>
//                         <CardMedia
//                           component="img"
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                           }}
//                           image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop&q=80"
//                           alt="green iguana"
//                         />
//                       </CardActionArea>
//                     </Card>
//                   </div> */}
//                   <img
//                     src="/images/try/carousel-img-1.png"
//                     alt="carousel 1"
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>

//                 <div
//                   style={{
//                     width: "100%",
//                     borderRadius: "20px",
//                     boxShadow: " 0 8px 40px #C31162",
//                     overflow: "hidden",
//                     background: "gray",
//                     padding: "0 20px",
//                     height: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src="/images/try/carousel-img-2.png"
//                     alt="carousel 2"
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//                 <div
//                   style={{
//                     width: "100%",
//                     borderRadius: "20px",
//                     boxShadow: " 0 8px 40px #C31162",
//                     overflow: "hidden",
//                     background: "gray",
//                     padding: "0 20px",
//                     height: "100%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <img
//                     src="/images/try/carousel-img-3.png"
//                     alt="carousel 3"
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//               </Slider>
//             </div>
//           </div>
//         </div>

//         {/* Enhanced Modal */}

//         {showModal && (
//           <div
//             className="try-first-page-modal-backdrop"
//             onClick={handleModalClose}
//           >
//             <div
//               className="try-first-page-modal"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="try-first-page-modal-header">
//                 <h2 style={{ color: "#C31162" }}>Choose One</h2>
//                 <p style={{ color: "#000", fontWeight: "600" }}>
//                   Instantly try on makeup look and find your perfect shades
//                 </p>

//                 <button
//                   className="try-first-page-modal-close"
//                   onClick={handleModalClose}
//                 >
//                   <span>×</span>
//                 </button>
//               </div>

//               <div className="try-first-page-modal-content">
//                 <div className="row g-4 text-center">
//                   {/* Bride */}
//                   <div className="col-md-4">
//                     <div
//                       role="button"
//                       onClick={() => {
//                         const userInfo = { role: "bride" };
//                         localStorage.setItem(
//                           "userInfo",
//                           JSON.stringify(userInfo)
//                         );
//                         dispatch(setRoleType({ role: "bride" }));
//                         navigate("/try/bride");
//                       }}
//                       className="d-flex flex-column align-items-center"
//                       style={{ height: "320px" }}
//                     >
//                       <img
//                         src="/images/try/Bride.png"
//                         alt="Bride"
//                         className=""
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                         }}
//                       />

//                       <h4
//                         className="mt-3 fw-semibold"
//                         style={{ color: "#C31162" }}
//                       >
//                         Bride
//                       </h4>
//                     </div>
//                   </div>

//                   {/* Groom */}
//                   <div className="col-md-4">
//                     <div
//                       role="button"
//                       onClick={() => {
//                         localStorage.removeItem("userInfo");
//                         navigate("/try/groom");
//                         dispatch(setRoleType({ role: "groom" }));
//                         const userInfo = { role: "groom" };
//                         localStorage.setItem(
//                           "userInfo",
//                           JSON.stringify(userInfo)
//                         );
//                       }}
//                       className="d-flex flex-column align-items-center"
//                     >
//                       <div
//                         className="position-relative w-100 try-modal-container"
//                         style={{ height: "320px" }}
//                       >
//                         <img
//                           src="/images/try/Groome.png"
//                           alt="Groom"
//                           className=" w-100 h-100"
//                           style={{ objectFit: "cover" }}
//                         />

//                         <h4 className="mt-3 fw-semibold">Groom</h4>
//                         {/* <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
//                           <span className="text-white fs-4 fw-bold">
//                             Coming Soon
//                           </span>
//                         </div> */}
//                       </div>
//                       <h4
//                         className="mt-3 fw-semibold"
//                         style={{ color: "#C31162" }}
//                       >
//                         Groom
//                       </h4>
//                     </div>
//                   </div>

//                   {/* Other */}
//                   <div className="col-md-4">
//                     <div
//                       role="button"
//                       onClick={() => {}}
//                       // onClick={() => handleCategorySelect("other")}
//                       className="d-flex flex-column align-items-center"
//                       disabled={true}
//                     >
//                       <div
//                         className="position-relative w-100 try-modal-container"
//                         style={{ height: "320px" }}
//                       >
//                         <img
//                           src="/images/try/Others.png"
//                           alt="Other"
//                           className="w-100 h-100"
//                           style={{ objectFit: "cover" }}
//                         />
//                         {/* Unique Overlay */}
//                         <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
//                           <span className="text-white fs-4 fw-bold">
//                             Coming Soon
//                           </span>
//                         </div>
//                       </div>
//                       <h4
//                         className="mt-3 fw-semibold"
//                         style={{ color: "#C31162" }}
//                       >
//                         Other
//                       </h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showLoginPopup && (
//           <LoginPopup isOpen={showLoginPopup} onClose={handleLoginClose} />
//         )}
//       </div>
//     </>
//   );
// };

// export default TryLanding;

import React, { useState, useEffect, useRef } from "react";
import { FaBolt, FaPalette, FaMobileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LoginPopup from "./DesignStudio.LoginPopup";
import { setRoleType } from "../../../redux/roleSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardActionArea, CardMedia } from "@mui/material";

const TryLanding = () => {
  const [showModal, setShowModal] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track image loading
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const sliderRef = useRef(null);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: false,
    arrows: false,
    adaptiveHeight: false, // Important
    responsive: [],
  };

  // List of image paths
  const imageSources = [
    "/images/try/carousel-img-1.png",
    "/images/try/carousel-img-2.png",
    "/images/try/carousel-img-3.png",
  ];

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = imageSources.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Count even if error (to avoid hang)
    });
  }, []);

  // Reinitialize slider after images load
  useEffect(() => {
    if (imagesLoaded && sliderRef.current) {
      setTimeout(() => {
        try {
          sliderRef.current.slickGoTo(0);
          // Force resize to recalculate
          window.dispatchEvent(new Event("resize"));
        } catch (e) {}
      }, 100);
    }
  }, [imagesLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    setShowModal(true);
  };

  const handleGetStarted = () => {
    if (!user) {
      setShowLoginPopup(true);
    } else {
      setShowModal(true);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleLoginClose = () => setShowLoginPopup(false);

  return (
    <>
      <style>
        {`
          .slick-dots li button:before {
            color: #2196F3 !important;
            font-size: 12px;
          }
          .slick-dots li.slick-active button:before {
            color: #C31162 !important;
          }
          .slick-dots {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            position: absolute !important;
            bottom: 12px !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            list-style: none !important;
            z-index: 50;
          }
          .slick-dots li {
            margin: 0 6px !important;
          }
          .slick-slider, .slick-list, .slick-track, .slick-slide > div {
            height: 100% !important;
          }
          .slider-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        `}
      </style>

      <div className="try-first-page-container">
        {/* Hero Section */}
        <div
          className={`try-first-page-hero ${
            isLoaded ? "try-first-page-loaded" : ""
          }`}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              position: "relative",
            }}
          >
            <div
              className="try-first-page-hero-content px-6"
              style={{
                placeSelf: "flex-end",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                width: "100%",
                gap: "2rem",
              }}
            >
              <div
                className="try-first-page-content-wrapper"
                style={{
                  marginBottom: "2rem",
                  marginLeft: "3rem",
                  maxWidth: "520px",
                  width: "100%",
                }}
              >
                <h1
                  className="try-first-page-title"
                  style={{
                    fontWeight: "400",
                    textAlign: "start",
                    color: "#C31162",
                  }}
                >
                  Virtual Try On
                </h1>
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: "500",
                    wordSpacing: "1.5px",
                    color: "#C31162",
                  }}
                >
                  Makeup, Jewellary & Outfits in One Place
                </p>
                <button
                  style={{
                    background: "linear-gradient(to right, #E83580, #821E48)",
                    color: "#fff",
                    border: "2px solid #C31162",
                    padding: "0.5rem 0",
                    fontWeight: "500",
                    borderRadius: "10px",
                    fontSize: "1.5rem",
                    width: "100%",
                  }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Slider Container */}
            <div
              style={{
                maxWidth: "850px",
                height: "500px",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              {imagesLoaded ? (
                <Slider ref={sliderRef} {...settings}>
                  {imageSources.map((src, index) => (
                    <div key={index}>
                      <div
                        style={{
                          height: "500px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          borderRadius: "20px",
                          // boxShadow: "0 8px 40px #C31162",
                          padding: "0 20px",
                        }}
                      >
                        <img
                          src={src}
                          alt={`carousel ${index + 1}`}
                          className="slider-image"
                          style={{ borderRadius: "16px" }}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              ) : (
                <div
                  style={{
                    height: "500px",
                    background: "transparent",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: "1.2rem",
                  }}
                >
                  Loading...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal & Login Popup - unchanged */}
        {showModal && (
          <div
            className="try-first-page-modal-backdrop"
            onClick={handleModalClose}
          >
            <div
              className="try-first-page-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="try-first-page-modal-header">
                <h2 style={{ color: "#C31162" }}>Choose One</h2>
                <p style={{ color: "#000", fontWeight: "600" }}>
                  Instantly try on makeup look and find your perfect shades
                </p>
                <button
                  className="try-first-page-modal-close"
                  onClick={handleModalClose}
                >
                  <span>×</span>
                </button>
              </div>

              <div className="try-first-page-modal-content">
                <div className="row g-4 text-center">
                  {/* Bride */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => {
                        const userInfo = { role: "bride" };
                        localStorage.setItem(
                          "userInfo",
                          JSON.stringify(userInfo)
                        );
                        dispatch(setRoleType({ role: "bride" }));
                        navigate("/try/bride");
                      }}
                      className="d-flex flex-column align-items-center"
                      style={{ height: "320px" }}
                    >
                      <img
                        src="/images/try/Bride.png"
                        alt="Bride"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Bride
                      </h4>
                    </div>
                  </div>

                  {/* Groom */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      onClick={() => {
                        const userInfo = { role: "groom" };
                        localStorage.setItem(
                          "userInfo",
                          JSON.stringify(userInfo)
                        );
                        dispatch(setRoleType({ role: "groom" }));
                        navigate("/try/groom");
                      }}
                      className="d-flex flex-column align-items-center"
                    >
                      <div
                        className="position-relative w-100 try-modal-container"
                        style={{ height: "320px" }}
                      >
                        <img
                          src="/images/try/Groome.png"
                          alt="Groom"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Groom
                      </h4>
                    </div>
                  </div>

                  {/* Other */}
                  <div className="col-md-4">
                    <div
                      role="button"
                      className="d-flex flex-column align-items-center"
                      style={{ opacity: 0.6, pointerEvents: "none" }}
                    >
                      <div
                        className="position-relative w-100 try-modal-container"
                        style={{ height: "320px" }}
                      >
                        <img
                          src="/images/try/Others.png"
                          alt="Other"
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="try-modal-hover-overlay-custom d-flex justify-content-center align-items-center rounded-5">
                          <span className="text-white fs-4 fw-bold">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                      <h4
                        className="mt-3 fw-semibold"
                        style={{ color: "#C31162" }}
                      >
                        Other
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLoginPopup && (
          <LoginPopup isOpen={showLoginPopup} onClose={handleLoginClose} />
        )}
      </div>
    </>
  );
};

export default TryLanding;
