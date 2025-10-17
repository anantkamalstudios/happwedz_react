// import React, { useState } from "react";
// import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
// import {
//   FaWhatsapp,
//   FaCheck,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaUsers,
//   FaTags,
//   FaHandshake,
//   FaHeadset,
//   FaFileContract,
//   FaEnvelope,
//   FaGift,
// } from "react-icons/fa";

// const Genie = () => {
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const handlePackageSelect = (pkg) => {
//     setSelectedPackage(pkg);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedPackage(null);
//   };

//   const packages = [
//     {
//       id: 1,
//       title: "Destination Wedding Package",
//       description:
//         "Perfect for all your destination wedding venue and vendor needs.",
//       price: "₹ 10",
//       crossPrice: "₹ 4999",
//       validity: "30 days",
//       features: [
//         "Find venues with all-inclusive pricing (rooms, 3 meals, and event spaces), with available dates and quotes that fit your budget.",
//         "Get personalized vendor recommendations for photographers, decorators, planners, caterers, makeup artists, and more",
//         "Enjoy up to two meetings (virtual or in-person) for expert assistance",
//         "Benefit from top-tier price negotiations",
//         "Continuous support through follow-ups and virtual assistance until booking is finalized",
//         "Professional vetting of vendor contracts",
//         "Choose a free digital invite or enjoy 50% off Video invites",
//       ],
//       icon: <FaMapMarkerAlt className="hw-text-primary" size={25} />,
//     },
//     {
//       id: 2,
//       title: "City Wedding Package",
//       description: "Ideal for hometown or local wedding planning.",
//       price: "₹ 100",
//       crossPrice: "₹ 4999",
//       validity: "60 days",
//       features: [
//         "Resolve venue suggestions with date availability and quotes tailored to your budget and location",
//         "Get expert vendor recommendations in any 5 categories of your choice",
//         "One video meeting for personalized assistance",
//         "Benefit from the best price negotiations",
//         "Ongoing virtual support until the booking is finalized",
//         "Enjoy 20% off on Video invites",
//       ],
//       icon: <FaUsers className="hw-text-primary" size={25} />,
//     },
//     {
//       id: 3,
//       title: "Single Wedding Service",
//       description: "Ideal for venue booking or single wedding service",
//       price: "₹ 1000",
//       crossPrice: "₹ 4999",
//       validity: "45 days",
//       features: [
//         "Tailored suggestions for venues or vendors (based on your selection), customized to your budget and preferred location (One city)",
//         "Expert price negotiations to ensure the best deals",
//         "Ongoing virtual support until your booking is confirmed",
//       ],
//       icon: <FaHandshake className="hw-text-primary" size={25} />,
//     },
//   ];

//   return (
//     <div className="genie-service-page">
//       {/* Header Section */}
//       <header className="genie-header py-5">
//         <Container>
//           <Row className="align-items-center">
//             <Col lg={6}>
//               <div className="mb-4">
//                 <h1 className="display-4 fw-bold">
//                   <span className="hw-text-primary">HW</span> Genie
//                 </h1>
//                 <h2 className="h3 mb-3">Virtual Planning Service</h2>
//                 <p className="lead">
//                   The smart way to find venues & vendors for your wedding
//                 </p>
//               </div>
//             </Col>
//             <Col lg={6}>
//               <img
//                 src="https://testimage.wedmegood.com/resized-nw/1900X/uploads/Genie_Banner_Web.jpg"
//                 alt="HW Genie Service"
//                 className="img-fluid rounded shadow"
//               />
//             </Col>
//           </Row>
//         </Container>
//       </header>

//       {/* Features Section */}
//       <section className="features-section py-5 bg-light">
//         <Container>
//           <Row>
//             <Col md={4} className="text-center mb-4">
//               <div className="feature-icon mx-auto mb-3">
//                 <FaUsers size="2.5rem" className="hw-text-primary" />
//               </div>
//               <h4>Tailored Vendor Picks</h4>
//               <p className="text-muted">
//                 Personalized recommendations based on your preferences
//               </p>
//             </Col>
//             <Col md={4} className="text-center mb-4">
//               <div className="feature-icon mx-auto mb-3">
//                 <FaTags size="2.5rem" className="hw-text-primary" />
//               </div>
//               <h4>Best Deals</h4>
//               <p className="text-muted">
//                 Get the most value with our negotiation expertise
//               </p>
//             </Col>
//             <Col md={4} className="text-center mb-4">
//               <div className="feature-icon mx-auto mb-3">
//                 <FaHeadset size="2.5rem" className="hw-text-primary" />
//               </div>
//               <h4>Expert Help & Support</h4>
//               <p className="text-muted">
//                 Guidance from wedding planning experts
//               </p>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Contact Section */}
//       <section className="contact-section py-5">
//         <Container>
//           <Row className="justify-content-center">
//             <Col lg={8} className="text-center">
//               <div className="contact-card p-4 bg-primary text-white rounded shadow">
//                 <h3 className="mb-3">Have Questions?</h3>
//                 <p className="mb-3">Connect with our genie experts on</p>
//                 <div className="d-flex align-items-center justify-content-center">
//                   <FaWhatsapp size="1.5rem" className="me-2" />
//                   <a
//                     href="https://wa.me/91882665276"
//                     className="text-white h5 mb-0 text-decoration-none"
//                   >
//                     +91882665276 (Whatsapp only)
//                   </a>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </Container>
//       </section>

//       {/* Packages Section */}
//       <section className="packages-section py-5">
//         <Container>
//           <Row className="justify-content-center mb-5">
//             <Col lg={8} className="text-center">
//               <h2 className="section-title mb-3">Select Package</h2>
//               <p className="lead">HW Genie can help out!</p>
//             </Col>
//           </Row>

//           <Row>
//             {packages.map((pkg) => (
//               <Col lg={4} md={6} className="mb-4" key={pkg.id}>
//                 <Card className="package-card h-100 shadow-sm border-0">
//                   <Card.Body className="p-4">
//                     <div className="text-center mb-4">
//                       {/* Icon + Price Row */}
//                       <div className="d-flex flex-column align-items-center mb-3">
//                         {/* Icon */}
//                         <div className="package-icon mb-2">{pkg.icon}</div>

//                         {/* Price */}
//                         <div className="price-section d-flex flex-column align-items-center">
//                           <span
//                             className="fw-bold"
//                             style={{
//                               fontSize: "20px",
//                               color: "var(--primary-color)",
//                             }}
//                           >
//                             {pkg.price}
//                           </span>
//                           <span
//                             className="text-muted"
//                             style={{
//                               textDecoration: "line-through",
//                               fontSize: "14px",
//                             }}
//                           >
//                             {pkg.crossPrice}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Title + Description (unchanged) */}
//                       <div>
//                         <h4
//                           className="card-title mb-2 text-center justify-content-center"
//                           style={{ margin: 0 }}
//                         >
//                           {pkg.title}
//                         </h4>
//                         <p className="text-muted mb-0 text-center">
//                           {pkg.description}
//                         </p>
//                       </div>
//                     </div>

//                     <ul className="features-list list-unstyled mb-4">
//                       {pkg.features.map((feature, index) => (
//                         <li key={index} className="mb-2">
//                           <FaCheck
//                             size="0.8rem"
//                             className="text-success me-2"
//                           />
//                           <small>{feature}</small>
//                         </li>
//                       ))}
//                     </ul>

//                     <div className="package-meta d-flex justify-content-between mb-4">
//                       <div>
//                         <small className="text-muted">
//                           Offer valid for {pkg.validity}
//                         </small>
//                       </div>
//                     </div>

//                     <Button
//                       variant="primary"
//                       className="w-100"
//                       onClick={() => handlePackageSelect(pkg)}
//                     >
//                       Continue &gt;
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </Container>
//       </section>

//       {/* Package Selection Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Genie Booking Assistance</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedPackage && (
//             <Container>
//               <Row>
//                 {/* Left Side - Form */}
//                 <Col md={7}>
//                   <form>
//                     <div className="mb-3">
//                       <label className="form-label">Full name*</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter your name"
//                       />
//                     </div>
//                     <Row>
//                       <Col md={6}>
//                         <div className="mb-3">
//                           <label className="form-label">Email address*</label>
//                           <input
//                             type="email"
//                             className="form-control"
//                             placeholder="Enter your email"
//                           />
//                         </div>
//                       </Col>
//                       <Col md={6}>
//                         <div className="mb-3">
//                           <label className="form-label">Mobile number*</label>
//                           <input
//                             type="tel"
//                             className="form-control"
//                             placeholder="+91"
//                           />
//                         </div>
//                       </Col>
//                     </Row>
//                     <Row>
//                       <Col md={6}>
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Function date (From)*
//                           </label>
//                           <input
//                             type="date"
//                             className="form-control rounded-0"
//                           />
//                         </div>
//                       </Col>

//                       <Col md={6}>
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Function date (To)*
//                           </label>
//                           <input
//                             type="date"
//                             className="form-control rounded-0"
//                           />
//                         </div>
//                       </Col>
//                     </Row>

//                     <Row>
//                       <Col md={12}>
//                         <div className="mb-3">
//                           <label className="form-label">Wedding city*</label>
//                           <input
//                             type="text"
//                             className="form-control rounded-0"
//                             placeholder="Wedding city"
//                           />
//                         </div>
//                       </Col>
//                     </Row>
//                   </form>
//                 </Col>

//                 {/* Right Side - Checkout Summary */}
//                 <Col md={5}>
//                   <Card className="border-0 shadow-sm checkout-card">
//                     <Card.Body>
//                       <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h6 className="mb-0">
//                           <FaTags className="me-2 text-danger" /> All Coupons
//                         </h6>
//                         <a
//                           href="#"
//                           className="small text-decoration-none hw-text-primary"
//                         >
//                           View All &gt;
//                         </a>
//                       </div>
//                       <div className="input-group mb-3">
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="Enter Coupon code"
//                         />
//                         <button className="btn btn-dark">APPLY</button>
//                       </div>

//                       <div className="mb-3">
//                         <small className="text-muted">
//                           {selectedPackage.title}
//                         </small>
//                         <h5 className="fw-bold mb-0">
//                           {selectedPackage.price}
//                         </h5>
//                       </div>
//                       <Button
//                         variant="danger"
//                         className="w-100 fw-bold py-2"
//                         onClick={() => {
//                           alert("Proceed to Razorpay Checkout");
//                         }}
//                       >
//                         {selectedPackage.price} – Continue
//                       </Button>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               </Row>
//               <Container className="border-2 bg-light p-4">
//                 {selectedPackage && (
//                   <div>
//                     <p className="lead">{selectedPackage.description}</p>
//                     <h6 className="mb-3">Package Includes:</h6>
//                     <ul className="list-unstyled">
//                       {selectedPackage.features.map((feature, index) => (
//                         <li key={index} className="mb-2">
//                           <FaCheck
//                             size="0.8rem"
//                             className="text-success me-2"
//                           />
//                           {feature}
//                         </li>
//                       ))}
//                     </ul>
//                     <p className="text-muted">
//                       Offer valid for {selectedPackage.validity}
//                     </p>
//                   </div>
//                 )}
//               </Container>
//             </Container>
//           )}
//         </Modal.Body>
//       </Modal>

//       <style jsx>{`
//         .genie-service-page {
//           font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
//         }

//         .genie-header {
//           background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
//         }

//         .feature-icon {
//           width: 80px;
//           height: 80px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: #f8f9fa;
//           border-radius: 50%;
//         }

//         .contact-card {
//           background: linear-gradient(135deg, #ff8d9aff 0%, #f5576cff 100%);
//         }

//         .section-title {
//           position: relative;
//           padding-bottom: 15px;
//         }

//         .section-title:after {
//           content: "";
//           position: absolute;
//           bottom: 0;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 60px;
//           height: 3px;
//           background-color: #4e54c8;
//         }

//         .package-card {
//           transition: transform 0.3s, box-shadow 0.3s;
//           border-radius: 12px;
//         }

//         .package-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
//         }

//         .package-icon {
//           width: 70px;
//           height: 70px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background-color: #f0f5ff;
//           border-radius: 50%;
//         }

//         .features-list li {
//           font-size: 0.9rem;
//         }
//         .checkout-card {
//           background: #fff5f6;
//           border-radius: 12px;
//         }
//         .checkout-card h5 {
//           color: #d63384;
//         }
//         .form-control {
//           border-radius: 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Genie;

import React, { useEffect, useRef, useState } from "react";

const Genie = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [budget, setBudget] = useState("0");
  const [guests, setGuests] = useState("0");
  const [city, setCity] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("budget"); 


const messagesContainerRef = useRef(null);

useEffect(()=>{
  setTimeout(()=>{
    setMessages([
      {
        type: "ai",
        text: "👋 Hey there! I'm your Wedding Genie. Let's plan your dream wedding, step by step. Start by telling me — what's your approximate budget? ",
      },
    ]);
  }, 400)
},[])

useEffect(() => {
  const el = messagesContainerRef.current;
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  });
}, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages([...messages, { type: "user", text: userMessage }]);


      if (currentQuestion === "budget") {
        const budgetValue = userMessage.match(/\d+/);
        if (budgetValue) {
          setBudget(budgetValue[0]);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                text: `Great! Your budget of ₹${budgetValue[0]} has been noted. 📝 Now, how many guests are you planning to invite? 👥`,
              },
            ]);
            setCurrentQuestion("guests");
          }, 1000);
        } else {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                text: "I didn't catch a number there. Could you please tell me your budget in numbers? For example: 50000 or 100000",
              },
            ]);
          }, 1000);
        }
      }
      else if (currentQuestion === "guests") {
        const guestsValue = userMessage.match(/\d+/);
        if (guestsValue) {
          setGuests(guestsValue[0]);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                text: `Perfect! ${guestsValue[0]} guests noted. 🎉 Which city are you planning your wedding in? 🏙️`,
              },
            ]);
            setCurrentQuestion("city");
          }, 1000);
        } else {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                type: "ai",
                text: "Please provide the number of guests you're expecting. For example: 200 or 500 👥",
              },
            ]);
          }, 1000);
        }
      }

      else if (currentQuestion === "city") {
        setCity(userMessage);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              text: `Wonderful! ${userMessage} is a great choice for a wedding! 💒 Your wedding summary has been updated. What else would you like to know or plan? 🎊`,
            },
          ]);
          setCurrentQuestion("general");
        }, 1000);
      }
      else {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              type: "ai",
              text: "That's great! I'm here to help you plan your perfect wedding. Feel free to ask me anything about venues, catering, decorations, or any other wedding-related questions! 💐",
            },
          ]);
        }, 1000);
      }

      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  return (
    <div
      style={{
        maxHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 50%, rgba(137, 188, 255, 0.32) 0%,rgba(137, 188, 255, 0.1) 15%,rgba(238, 174, 202, 0.2) 21%, rgba(238, 174, 202, 0.1) 100%",
      }}
    >
      <div className="container-fluid">
        <div className="row" style={{ maxHeight: "100vh" }}>
          {/* Sidebar */}
          <div
            className="col-md-3 col-lg-2 p-4"
            style={{
              backgroundColor: "#fff",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
            }}
          >
            {/* Logo */}
            <div className="mb-4">
              <h4
                style={{
                  color: "#d946ef",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                « HappyWedz AI
              </h4>
            </div>

            {/* Summary Section */}
            <div className="mb-4">
              <h6
                style={{
                  fontWeight: "600",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ✨ Summary
              </h6>

              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Budget
                </label>
                <span
                  style={{
                    display: "inline-block",
                    width: "60px",
                    height: "30px",
                    lineHeight: "30px",
                    textAlign: "center",
                    backgroundColor: "#fce7f3",
                    color: "#d946ef",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                >
                  {budget}
                </span>
              </div>

              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  Guests
                </label>
                <span
                  style={{
                    display: "inline-block",
                    width: "60px",
                    height: "30px",
                    lineHeight: "30px",
                    textAlign: "center",
                    backgroundColor: "#fce7f3",
                    color: "#d946ef",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                >
                  {guests}
                </span>
              </div>

              <div
                className="mb-3"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  City
                </label>
                <span
                  style={{
                    display: "inline-block",
                    width: "60px",
                    height: "30px",
                    lineHeight: "30px",
                    textAlign: "center",
                    backgroundColor: "#fce7f3",
                    color: "#d946ef",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                >
                  {city}
                </span>
              </div>
            </div>

            {/* Checklist Section */}
            <div>
              <h6
                style={{
                  fontWeight: "600",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                ✨ Checklist
              </h6>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                Venue - Delhi Club
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 p-0">
            <div
              style={{
                height: "82vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  background: "transparent",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    marginBottom: "10px",
                  }}
                >
                  ✨
                </div>
                <h3
                  style={{
                    color: "#d946ef",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  Ask our AI anything
                </h3>
              </div>

              {/* Chat Messages */}
              <div
              className="no-scrollbar"
                ref={messagesContainerRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* Watermark */}
                <div
                  style={{
                    textAlign: "center",
                    opacity: "0.15",
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "#fff",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  <span>HAPPYWEDZ</span>
                </div>

                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.type === "user" ? "flex-end" : "flex-start",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: msg.type === "user" ? "#d946ef" : "#9333ea",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          paddingLeft: msg.type === "user" ? "0" : "10px",
                          paddingRight: msg.type === "user" ? "10px" : "0",
                          textAlign: msg.type === "user" ? "right" : "left",
                        }}
                      >
                        {msg.type === "user" ? "USER" : "OUR AI"}
                      </div>
                      <div
                        style={{
                          padding: "15px 20px",
                          borderRadius: "10px",
                          backgroundColor:
                            msg.type === "user" ? "#fff" : "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          fontSize: "15px",
                          lineHeight: "1.6",
                          color: "#333",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div
                style={{
                  padding: "20px 40px 50px",
                  backgroundColor: "transparent",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    maxWidth: "900px",
                    margin: "0 auto",
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask me anything about your projects"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{
                      padding: "15px 60px 15px 20px",
                      border: "2px solid #C31162",
                      fontSize: "15px",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 15px rgba(217, 70, 239, 0.15)",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform =
                        "translateY(-50%) scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform =
                        "translateY(-50%) scale(1)")
                    }
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C31162"
                      strokeWidth="2"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Genie;
