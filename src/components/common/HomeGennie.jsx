// import { ArrowUpLeftFromSquare } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { BiRightArrow } from "react-icons/bi";
// import { Link } from "react-router-dom";

// const HomeGennie = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [budget, setBudget] = useState("50000");
//   const [guests, setGuests] = useState("500");
//   const [city, setCity] = useState("Pune");
//   const [currentQuestion, setCurrentQuestion] = useState("budget");

//   const messageContainerRef = useRef(null);

//   useEffect(() => {
//     const el = messageContainerRef.current;
//     if (!el) return;
//     requestAnimationFrame(() => {
//       el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//     });
//   }, [messages]);

//   useEffect(() => {
//     if (isChatOpen && messages.length === 0) {
//       setTimeout(() => {
//         setMessages([
//           {
//             type: "ai",
//             text: "👋 Hey there! I'm your Wedding Genie. Let's plan your dream wedding, step by step. Start by telling me — what's your approximate budget? 💰",
//           },
//         ]);
//       }, 400);
//     }
//   }, [isChatOpen]);

//   const handleSendMessage = () => {
//     if (inputValue.trim()) {
//       const userMessage = inputValue.trim();
//       setMessages([...messages, { type: "user", text: userMessage }]);

//       if (currentQuestion === "budget") {
//         const budgetValue = userMessage.match(/\d+/);
//         if (budgetValue) {
//           setBudget(budgetValue[0]);
//           setTimeout(() => {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 type: "ai",
//                 text: `Great! Your budget of ₹${budgetValue[0]} has been noted. 📝 Now, how many guests are you planning to invite? 👥`,
//               },
//             ]);
//             setCurrentQuestion("guests");
//           }, 1000);
//         } else {
//           setTimeout(() => {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 type: "ai",
//                 text: "I didn't catch a number there. Could you please tell me your budget in numbers? For example: 50000 or 100000 💰",
//               },
//             ]);
//           }, 1000);
//         }
//       } else if (currentQuestion === "guests") {
//         const guestsValue = userMessage.match(/\d+/);
//         if (guestsValue) {
//           setGuests(guestsValue[0]);
//           setTimeout(() => {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 type: "ai",
//                 text: `Perfect! ${guestsValue[0]} guests noted. 🎉 Which city are you planning your wedding in? 🏙️`,
//               },
//             ]);
//             setCurrentQuestion("city");
//           }, 1000);
//         } else {
//           setTimeout(() => {
//             setMessages((prev) => [
//               ...prev,
//               {
//                 type: "ai",
//                 text: "Please provide the number of guests you're expecting. For example: 200 or 500 👥",
//               },
//             ]);
//           }, 1000);
//         }
//       } else if (currentQuestion === "city") {
//         setCity(userMessage);
//         setTimeout(() => {
//           setMessages((prev) => [
//             ...prev,
//             {
//               type: "ai",
//               text: `Wonderful! ${userMessage} is a great choice for a wedding! 💒 Your wedding summary has been updated. What else would you like to know or plan? 🎊`,
//             },
//           ]);
//           setCurrentQuestion("general");
//         }, 1000);
//       } else {
//         setTimeout(() => {
//           setMessages((prev) => [
//             ...prev,
//             {
//               type: "ai",
//               text: "That's great! I'm here to help you plan your perfect wedding. Feel free to ask me anything about venues, catering, decorations, or any other wedding-related questions! 💐",
//             },
//           ]);
//         }, 1000);
//       }

//       setInputValue("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSendMessage();
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         position: "relative",
//         overflow: "hidden",
//         padding: "20px",
//       }}
//     >
//       {/* Floating Chat Button */}
//       {!isChatOpen && (
//         <div
//           role="button"
//           onClick={() => setIsChatOpen(true)}
//           style={{
//             position: "fixed",
//             bottom: "30px",
//             right: "30px",
//             width: "70px",
//             height: "70px",
//             borderRadius: "50%",
//             border: "4px solid transparent",
//             cursor: "pointer",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//             background: "#C31162",
//             transition: "transform 0.3s ease",
//             backgroundClip: "padding-box",
//           }}
//           onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//           onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           <div
//             style={{
//               position: "absolute",
//               width: "100%",
//               height: "100%",
//               borderRadius: "50%",
//               padding: "5px",
//               background:
//                 "conic-gradient(from 0deg, #C31162, #60A5FA, #f0f4ff, #C31162)",
//               WebkitMask:
//                 "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//               WebkitMaskComposite: "xor",
//               maskComposite: "exclude",
//               animation: "rotateGradient 3s linear infinite",
//             }}
//           />
//           <svg
//             width="30"
//             height="30"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="white"
//             strokeWidth="2"
//           >
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//           </svg>

//           <style>
//             {`
//               @keyframes rotateGradient {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}
//           </style>
//         </div>
//       )}

//       {/* Responsive Chat Overlay */}
//       {isChatOpen && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "0",
//             right: "0",
//             width: "min(420px, 100vw)",
//             height: "min(650px, 100vh)",
//             maxHeight: "100vh",
//             background:
//               "linear-gradient(to top, #f9d8ec 0%, #ffffff 60%, #fce7f3 100%)",
//             borderRadius: window.innerWidth <= 640 ? "20px 20px 0 0" : "20px",
//             boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             zIndex: 1001,
//             animation: "slideUp 0.3s ease-out",
//             margin: window.innerWidth <= 640 ? "0" : "20px",
//           }}
//         >
//           <style>
//             {`
//               @keyframes slideUp {
//                 from {
//                   transform: translateY(100%);
//                   opacity: 0;
//                 }
//                 to {
//                   transform: translateY(0);
//                   opacity: 1;
//                 }
//               }

//               @media (max-width: 640px) {
//                 .chat-container {
//                   width: 100vw !important;
//                   height: 100vh !important;
//                   border-radius: 0 !important;
//                   margin: 0 !important;
//                   bottom: 0 !important;
//                   right: 0 !important;
//                 }
//               }

//               @media (max-width: 480px) {
//                 .chat-button {
//                   width: 60px !important;
//                   height: 60px !important;
//                   bottom: 20px !important;
//                   right: 20px !important;
//                 }
//               }
//             `}
//           </style>

//           {/* Chat Header */}
//           <div
//             style={{
//               padding: window.innerWidth <= 640 ? "15px" : "20px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               color: "white",
//               position: "relative",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 gap: "10px",
//                 marginTop: window.innerWidth <= 640 ? "10px" : "20px",
//               }}
//             >
//               <div
//                 style={{ fontSize: window.innerWidth <= 640 ? "20px" : "24px" }}
//               >
//                 ✨
//               </div>
//               <div>
//                 <h5
//                   style={{
//                     margin: "auto",
//                     fontSize: window.innerWidth <= 640 ? "20px" : "24px",
//                     fontWeight: "400",
//                     color: "#000",
//                   }}
//                 >
//                   Ask our AI anything
//                 </h5>
//               </div>
//             </div>
//           </div>

//           {/* Closing buttons */}
//           <div
//             style={{
//               position: "absolute",
//               top: 0,
//               width: "100%",
//               display: "flex",
//               justifyContent: "space-between",
//               padding: window.innerWidth <= 640 ? "8px" : "10px",
//             }}
//           >
//             <Link
//               to="/genie"
//               style={{
//                 border: "none",
//                 borderRadius: "50%",
//                 width: window.innerWidth <= 640 ? "30px" : "35px",
//                 height: window.innerWidth <= 640 ? "30px" : "35px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 background: "rgba(255, 255, 255, 0.2)",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
//               }
//             >
//               <ArrowUpLeftFromSquare
//                 size={window.innerWidth <= 640 ? 16 : 20}
//                 style={{ color: "#C31162" }}
//               />
//             </Link>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               style={{
//                 border: "none",
//                 borderRadius: "50%",
//                 width: window.innerWidth <= 640 ? "30px" : "35px",
//                 height: window.innerWidth <= 640 ? "30px" : "35px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 cursor: "pointer",
//                 background: "transparent",
//               }}
//               onMouseOver={(e) =>
//                 (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
//               }
//               onMouseOut={(e) =>
//                 (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
//               }
//             >
//               <svg
//                 width={window.innerWidth <= 640 ? "16" : "20"}
//                 height={window.innerWidth <= 640 ? "16" : "20"}
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="#C31162"
//                 strokeWidth="2.5"
//               >
//                 <path d="M18 6L6 18M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Chat Messages */}
//           <div
//             ref={messageContainerRef}
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               padding: window.innerWidth <= 640 ? "15px" : "20px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "15px",
//               scrollbarWidth: "none",
//               msOverflowStyle: "none",
//             }}
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     msg.type === "user" ? "flex-end" : "flex-start",
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: window.innerWidth <= 640 ? "85%" : "80%",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "4px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: window.innerWidth <= 640 ? "9px" : "10px",
//                       fontWeight: "600",
//                       color: msg.type === "user" ? "#d946ef" : "#ea33d8ff",
//                       textTransform: "uppercase",
//                       letterSpacing: "0.5px",
//                       paddingLeft: msg.type === "user" ? "0" : "10px",
//                       paddingRight: msg.type === "user" ? "10px" : "0",
//                       textAlign: msg.type === "user" ? "right" : "left",
//                     }}
//                   >
//                     {msg.type === "user" ? "USER" : "OUR AI"}
//                   </div>
//                   <div
//                     style={{
//                       padding:
//                         window.innerWidth <= 640 ? "10px 14px" : "12px 16px",
//                       borderRadius:
//                         msg.type === "user"
//                           ? "15px 15px 0 15px"
//                           : "15px 15px 15px 0",
//                       backgroundColor:
//                         msg.type === "user" ? "#f45fe0ff" : "#fff",
//                       color: msg.type === "user" ? "#fff" : "#333",
//                       boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
//                       fontSize: window.innerWidth <= 640 ? "13px" : "14px",
//                       lineHeight: "1.5",
//                       wordWrap: "break-word",
//                     }}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input Area */}
//           <div
//             style={{
//               padding: window.innerWidth <= 640 ? "12px 15px" : "15px 20px",
//               borderTop: "1px solid rgba(252, 231, 243, 0.5)",
//             }}
//           >
//             <div style={{ position: "relative" }}>
//               <input
//                 type="text"
//                 placeholder="Ask me anything..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 style={{
//                   width: "100%",
//                   padding:
//                     window.innerWidth <= 640
//                       ? "10px 45px 10px 12px"
//                       : "12px 50px 12px 15px",
//                   borderRadius: "10px",
//                   border: "2px solid #fce7f3",
//                   fontSize: window.innerWidth <= 640 ? "13px" : "14px",
//                   outline: "none",
//                   transition: "border-color 0.2s",
//                   boxSizing: "border-box",
//                 }}
//                 onBlur={(e) => (e.target.style.borderColor = "#fce7f3")}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 style={{
//                   position: "absolute",
//                   right: "5px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   background: "transparent",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: window.innerWidth <= 640 ? "32px" : "36px",
//                   height: window.innerWidth <= 640 ? "32px" : "36px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   cursor: "pointer",
//                   transition: "transform 0.2s",
//                 }}
//                 onMouseOver={(e) =>
//                   (e.currentTarget.style.transform =
//                     "translateY(-50%) scale(1.05)")
//                 }
//                 onMouseOut={(e) =>
//                   (e.currentTarget.style.transform =
//                     "translateY(-50%) scale(1)")
//                 }
//               >
//                 <svg
//                   width={window.innerWidth <= 640 ? "16" : "18"}
//                   height={window.innerWidth <= 640 ? "16" : "18"}
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#000"
//                   strokeWidth="2"
//                 >
//                   <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomeGennie;

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu, Plus, SendHorizonal } from "lucide-react";
import { Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";

const HomeGennie = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [budget, setBudget] = useState("50000");
  const [guests, setGuests] = useState("500");
  const [city, setCity] = useState("Pune");
  const [currentQuestion, setCurrentQuestion] = useState("budget");
  const [isTyping, setIsTyping] = useState(false);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const el = messageContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            type: "ai",
            text: "Hi! I am Genie 👋\n\nHow can I help you plan your dream wedding today?",
          },
        ]);
      }, 800);
    }
  }, [isChatOpen]);

  const addAIMessage = (text, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text }]);
    }, delay);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages([...messages, { type: "user", text: userMessage }]);

      if (currentQuestion === "budget") {
        const budgetValue = userMessage.match(/\d+/);
        if (budgetValue) {
          setBudget(budgetValue[0]);
          addAIMessage(
            `Great! Your budget of ₹${budgetValue[0]} has been noted. 📝\n\nNow, how many guests are you planning to invite? 👥`
          );
          setCurrentQuestion("guests");
        } else {
          addAIMessage(
            "I didn't catch a number there. Could you please tell me your budget in numbers?\n\nFor example: 50000 or 100000 💰"
          );
        }
      } else if (currentQuestion === "guests") {
        const guestsValue = userMessage.match(/\d+/);
        if (guestsValue) {
          setGuests(guestsValue[0]);
          addAIMessage(
            `Perfect! ${guestsValue[0]} guests noted. 🎉\n\nWhich city are you planning your wedding in? 🏙️`
          );
          setCurrentQuestion("city");
        } else {
          addAIMessage(
            "Please provide the number of guests you're expecting.\n\nFor example: 200 or 500 👥"
          );
        }
      } else if (currentQuestion === "city") {
        setCity(userMessage);
        addAIMessage(
          `Wonderful! ${userMessage} is a great choice for a wedding! 💒\n\nYour wedding summary has been updated. What else would you like to know or plan? 🎊`
        );
        setCurrentQuestion("general");
      } else {
        addAIMessage(
          "That's great! I'm here to help you plan your perfect wedding.\n\nFeel free to ask me anything about venues, catering, decorations, or any other wedding-related questions! 💐"
        );
      }

      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: "💰", label: "Budget", action: "budget" },
    { icon: "🏛️", label: "Venues", action: "venues" },
    { icon: "📋", label: "Checklist", action: "checklist" },
    { icon: "🎨", label: "Themes", action: "themes" },
  ];

  const popularQuestions = [
    "Plan my dream destination wedding",
    "Show me the best wedding venues",
  ];

  return (
    <div
      style={{
        maxHeight: "90vh",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ec4899 0%, #9333ea 100%)",
            border: "none",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 50,
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src="./gennie-logo.png"
            alt="logo"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
        </button>
      )}

      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: window.innerWidth <= 576 ? "0" : "24px",
            right: window.innerWidth <= 576 ? "0" : "24px",
            width: window.innerWidth <= 576 ? "100vw" : "440px",
            height: window.innerWidth <= 576 ? "100vh" : "650px",
            backgroundColor: "white",
            borderRadius: window.innerWidth <= 576 ? "0" : "24px",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                <button
                  onClick={() => setIsChatOpen(false)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.2)")
                  }
                >
                  <FaChevronLeft
                    style={{ width: "20px", height: "20px", color: "#ec4899" }}
                  />
                </button>
                <div
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="./gennie-logo.png"
                    alt="logo"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontWeight: 600,
                      fontSize: "18px",
                      margin: 0,
                      color: "#ec4899",
                    }}
                  >
                    Ask our AI anything
                  </h2>
                </div>
              </div>
              <Link
                to="/genie"
                style={{
                  border: "none",
                  borderRadius: "50%",
                  width: window.innerWidth <= 640 ? "30px" : "35px",
                  height: window.innerWidth <= 640 ? "30px" : "35px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.2)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.3)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.2)")
                }
              >
                <Menu
                  style={{ width: "20px", height: "20px", color: "#ec4899" }}
                />
              </Link>
            </div>
          </div>

          <div
            ref={messageContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              background:
                "linear-gradient(180deg, rgba(252, 231, 243, 0.3) 0%, white 100%)",
            }}
          >
            {messages.length === 0 && !isTyping && (
              <div>
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      margin: "0 auto 16px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="./gennie-logo.png"
                      alt="logo"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      fontWeight: 600,
                      color: "#ec4899",
                      marginBottom: "8px",
                    }}
                  >
                    Welcome to Wedding Genie! ✨
                  </h3>
                  <p style={{ fontSize: "14px", color: "#ec4899" }}>
                    Let's plan your dream wedding together
                  </p>
                </div>

                <div className="row g-2 mb-4">
                  {quickActions.map((action, idx) => (
                    <div key={idx} className="col-3">
                      <button
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px",
                          borderRadius: "16px",
                          backgroundColor: "white",
                          border: "1px solid #fce7f3",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#fbcfe8";
                          e.currentTarget.style.boxShadow =
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#fce7f3";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>{action.icon}</span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#374151",
                          }}
                        >
                          {action.label}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#6b7280",
                      padding: "0 4px",
                      marginBottom: "8px",
                    }}
                  >
                    Popular questions for you!
                  </p>
                  {popularQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputValue(question)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "16px",
                        borderRadius: "16px",
                        backgroundColor: "white",
                        border: "1px solid #fce7f3",
                        cursor: "pointer",
                        marginBottom: "8px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#fbcfe8";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#fce7f3";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                            fontWeight: 500,
                          }}
                        >
                          {question}
                        </span>
                        <ArrowLeft
                          style={{
                            width: "16px",
                            height: "16px",
                            color: "#ec4899",
                            transform: "rotate(180deg)",
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  marginBottom: "16px",
                  justifyContent:
                    msg.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.type === "ai" && (
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "center",
                      marginRight: "2px",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="./gennie-logo.png"
                      alt="logo"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius:
                      msg.type === "user"
                        ? "24px 24px 4px 24px"
                        : "24px 24px 24px 4px",
                    background:
                      msg.type === "user"
                        ? "linear-gradient(135deg, #ec4899 0%, #9333ea 100%)"
                        : "white",
                    color: msg.type === "user" ? "white" : "#1f2937",
                    border: msg.type === "user" ? "none" : "1px solid #f3f4f6",
                    boxShadow:
                      msg.type === "user"
                        ? "none"
                        : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.6",
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: "flex", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #ec4899 0%, #9333ea 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "8px",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="./gennie-logo.png"
                    alt="logo"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    border: "1px solid #f3f4f6",
                    borderRadius: "24px 24px 24px 4px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    padding: "12px 20px",
                  }}
                >
                  <div style={{ display: "flex", gap: "4px" }}>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#9ca3af",
                        borderRadius: "50%",
                        animation: "bounce 1s infinite",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#9ca3af",
                        borderRadius: "50%",
                        animation: "bounce 1s infinite 0.1s",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        backgroundColor: "#9ca3af",
                        borderRadius: "50%",
                        animation: "bounce 1s infinite 0.2s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              borderTop: "1px solid #f3f4f6",
              padding: "16px",
              backgroundColor: "white",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#fce7f3",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fbcfe8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fce7f3")
                }
              >
                <span style={{ fontSize: "20px" }}>
                  <Plus style={{ color: "#ec4899" }} />
                </span>
              </button>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Ask me questions..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={{
                    width: "100%",
                    padding: "12px 48px 12px 16px",
                    borderRadius: "50px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#fbcfe8";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(252, 231, 243, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  style={{
                    position: "absolute",
                    right: "4px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: inputValue.trim() ? "pointer" : "not-allowed",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    inputValue.trim() &&
                    (e.currentTarget.style.transform =
                      "translateY(-50%) scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform =
                      "translateY(-50%) scale(1)")
                  }
                >
                  <SendHorizonal
                    style={{ width: "16px", height: "16px", color: "#ec4899" }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default HomeGennie;
