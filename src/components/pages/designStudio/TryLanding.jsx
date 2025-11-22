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
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const autoplayRef = useRef(null);

  // List of image paths
  const imageSources = [
    "/images/try/carousel-img-1.png",
    "/images/try/carousel-img-2.png",
    "/images/try/carousel-img-3.png",
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Autoplay effect
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSources.length);
    }, 1500);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

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
      img.onerror = handleImageLoad;
    });
  }, []);

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
      {/* Responsive hero layout: added styles to stack on md/sm screens */}
      <style>
        {`
          /* Responsive: hero stacks into column on md and sm screens */
          @media (max-width: 992px) {
            /* md and below */
            .try-hero-flex {
              flex-direction: column !important;
              align-items: center !important;
              height: auto !important;
              max-height: none !important;
              gap: 1.5rem !important;
            }
            .try-hero-left {
              align-self: stretch !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
              flex: 0 0 100% !important;
            }
            .try-hero-left .try-first-page-content-wrapper {
              margin-left: 0 !important;
              margin-bottom: 1rem !important;
              max-width: 100% !important;
            }
            .try-hero-right {
              align-self: stretch !important;
              margin-top: 0 !important;
              max-width: 100% !important;
              flex: 0 0 100% !important;
            }
            .try-hero-right .carousel-shell {
              max-height: 380px !important;
              height: auto !important;
            }
          }

          @media (max-width: 576px) {
            /* sm and below */
            .try-hero-right .carousel-shell {
              max-height: 320px !important;
            }
          }
        `}
      </style>
      <div className="try-first-page-container">
        {/* Hero Section */}
        <div
          className={`try-first-page-hero ${isLoaded ? "try-first-page-loaded" : ""
            }`}
        >
          <div
            style={{
              minHeight: "calc(100vh - 150px)",
              height: "auto",
              position: "relative",
              paddingTop: 0,
            }}
          >
            {/* Wrapper: added try-hero-flex to control responsive column layout */}
            <div
              className="try-hero-flex"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                gap: "3rem",
                height: "calc(100vh - 150px)",
                maxHeight: "680px",
                paddingTop: 0,
              }}
            >
              {/* Heading Container */}
              {/* Added try-hero-left class for responsive stacking */}
              <div
                className="try-first-page-hero-content px-6 try-hero-left"
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "flex-end",
                  flex: "0 0 40%",
                  gap: "2rem",
                }}
              >
                <div
                  className="try-first-page-content-wrapper"
                  style={{
                    marginBottom: "3rem",
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
                      border: "2px solid #e9277fff",
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
              {/* Added try-hero-right class for responsive stacking */}
              <div
                className="try-hero-right"
                style={{
                  maxWidth: "850px",
                  height: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                  alignSelf: "flex-start",
                  marginTop: "-20px",
                  flex: "1 1 60%",
                }}
              >
                {imagesLoaded ? (
                  /* Added carousel-shell to adjust height at breakpoints */
                  <div
                    className="carousel-shell"
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      maxHeight: "480px",
                      overflow: "hidden",
                      borderRadius: "20px",
                      background: "transparent",
                    }}
                  >
                    {/* Slides Container */}
                    <div
                      style={{
                        display: "flex",
                        height: "100%",

                        transform: `translateX(-${currentSlide * 100}%)`,
                        transition: "transform 500ms ease-in-out",
                      }}
                    >
                      {imageSources.map((src, index) => (
                        <div
                          key={index}
                          style={{
                            minWidth: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={src}
                            alt={`carousel ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "stretch",
                              borderRadius: "16px",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; color: white; font-size: 24px;">Image ${index + 1
                                }</div>`;
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Dots Navigation */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "0",
                        right: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        zIndex: 50,
                      }}
                    >
                      {imageSources.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          style={{
                            width: "8px",
                            height: "12px",
                            borderRadius: "50%",
                            border: "none",
                            background:
                              currentSlide === index ? "#C31162" : "#ed1147",
                            cursor: "pointer",
                            transition: "all 300ms ease",
                            opacity: currentSlide === index ? 1 : 0.6,
                          }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "100%",
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
