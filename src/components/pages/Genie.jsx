// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";

// const Genie = () => {
//   /* ---------- State ---------- */
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [budget, setBudget] = useState("0");
//   const [guests, setGuests] = useState("0");
//   const [city, setCity] = useState("");
//   const [currentQuestion, setCurrentQuestion] = useState("budget");
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionId] = useState(
//     () => "sess" + Math.random().toString(36).substring(2, 11)
//   );

//   const messagesContainerRef = useRef(null);

//   function getIdFromToken(token) {
//     try {
//       const payload = token.split(".")[1]; // middle part of JWT
//       const decoded = JSON.parse(atob(payload)); // decode base64 → JSON
//       return decoded.id || decoded.userId || null;
//     } catch (err) {
//       console.error("Invalid token", err);
//       return null;
//     }
//   }

//   const tokenId = useSelector((store) => store.auth.token);
//   const userId = getIdFromToken(tokenId);

//   const callChatApi = async (query) => {
//     if (!query)
//       return {
//         response: { summary: "Please enter a valid query", results: [] },
//       };

//     setIsLoading(true);
//     try {
//       console.log("Calling API with query:", query);
//       const response = await fetch("http://192.168.1.15:5000/api/user_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           token: `Bearer ${tokenId}`,
//         },
//         body: JSON.stringify({
//           session_id: sessionId,
//           user_query: query,
//           user_id: userId,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error("API Error:", {
//           status: response.status,
//           statusText: response.statusText,
//           errorData,
//         });
//         return {
//           response: {
//             summary: `Sorry, there was an error (${response.status}): ${response.statusText}`,
//             results: [],
//           },
//         };
//       }

//       const data = await response.json();
//       console.log("API Response:", data);
//       return data;
//     } catch (error) {
//       console.error("API Call Error:", error);
//       return {
//         response: {
//           summary:
//             "I'm having trouble connecting to the server. Please try again later.",
//           results: [],
//         },
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ---------- Welcome message ---------- */
//   useEffect(() => {
//     setTimeout(() => {
//       setMessages([
//         {
//           type: "ai",
//           text: "Hey there! I'm your Wedding Genie. Let's plan your dream wedding, step by step. Start by telling me — what's your approximate budget?",
//         },
//       ]);
//     }, 400);
//   }, []);

//   /* ---------- Auto-scroll ---------- */
//   useEffect(() => {
//     const el = messagesContainerRef.current;
//     if (el) {
//       requestAnimationFrame(() => {
//         el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//       });
//     }
//   }, [messages]);

//   function getIdFromToken(token) {
//     try {
//       const payload = token.split(".")[1];
//       const decoded = JSON.parse(atob(payload));
//       return decoded.id || decoded.userId || null;
//     } catch (err) {
//       console.error("Invalid token", err);
//       return null;
//     }
//   }

//   const formatResponse = (data) => {
//     if (!data?.response) return "Sorry, something went wrong.";

//     const { summary = "", results = [] } = data.response;
//     let txt = summary;

//     if (results.length) {
//       txt += "\n\n**Options:**\n";
//       results.forEach((r, i) => {
//         txt += `${i + 1}. **${r.name}** – ${r.type} in ${r.location} (Rating: ${
//           r.rating ?? "N/A"
//         })\n`;
//         (r.why_consider || []).forEach((w) => (txt += `   • ${w}\n`));
//       });
//     }
//     return txt;
//   };

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMsg = inputValue.trim();
//     setMessages((p) => [...p, { type: "user", text: userMsg }]);
//     setInputValue("");

//     if (currentQuestion === "budget") {
//       const num = userMsg.match(/\d+/);
//       if (num) {
//         setBudget(num[0]);
//         setTimeout(() => {
//           setMessages((p) => [
//             ...p,
//             {
//               type: "ai",
//               text: `Great! Your budget of ₹${num[0]} has been noted. Now, how many guests are you planning to invite?`,
//             },
//           ]);
//           setCurrentQuestion("guests");
//         }, 800);
//       } else {
//         setTimeout(() => {
//           setMessages((p) => [
//             ...p,
//             { type: "ai", text: "Please give a number, e.g. 50000" },
//           ]);
//         }, 800);
//       }
//       return;
//     }

//     if (currentQuestion === "guests") {
//       const num = userMsg.match(/\d+/);
//       if (num) {
//         setGuests(num[0]);
//         setTimeout(() => {
//           setMessages((p) => [
//             ...p,
//             {
//               type: "ai",
//               text: `Perfect! ${num[0]} guests noted. Which city are you planning your wedding in?`,
//             },
//           ]);
//           setCurrentQuestion("city");
//         }, 800);
//       } else {
//         setTimeout(() => {
//           setMessages((p) => [
//             ...p,
//             { type: "ai", text: "Please provide a number, e.g. 200" },
//           ]);
//         }, 800);
//       }
//       return;
//     }

//     if (currentQuestion === "city") {
//       setCity(userMsg);
//       setTimeout(() => {
//         setMessages((p) => [
//           ...p,
//           {
//             type: "ai",
//             text: `Wonderful! ${userMsg} is a great choice! Your summary is updated. Ask me anything else!`,
//           },
//         ]);
//         setCurrentQuestion("general");
//       }, 800);
//       return;
//     }

//     try {
//       const apiData = await callChatApi(userMsg);
//       const aiText = formatResponse(apiData);
//       setMessages((p) => [...p, { type: "ai", text: aiText }]);
//     } catch (error) {
//       console.error("Error in handleSendMessage:", error);
//       setMessages((p) => [
//         ...p,
//         {
//           type: "ai",
//           text: "I'm sorry, I encountered an error. Please try again.",
//         },
//       ]);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSendMessage();
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at 80% 50%, rgba(137, 188, 255, 0.32) 0%,rgba(137, 188, 255, 0.1) 15%,rgba(238, 174, 202, 0.2) 21%, rgba(238, 174, 202, 0.1) 100%",
//       }}
//     >
//       <div className="container-fluid">
//         <div
//           className="row"
//           style={{ minHeight: "calc(100vh - clamp(60px, 10vw, 200px))" }}
//         >
//           {/* Sidebar – unchanged */}
//           <div
//             className="col-md-3 col-lg-2 p-4"
//             style={{
//               backgroundColor: "#fff",
//               boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
//               minHeight: "100vh",
//             }}
//           >
//             <div className="mb-4">
//               <h4
//                 style={{
//                   color: "#d946ef",
//                   fontWeight: "bold",
//                   fontSize: "24px",
//                 }}
//               >
//                 HappyWedz AI
//               </h4>
//             </div>

//             <div className="mb-4">
//               <h6
//                 style={{
//                   fontWeight: "600",
//                   marginBottom: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 Summary
//               </h6>

//               {["Budget", "Guests", "City"].map((label, i) => {
//                 const value = [budget, guests, city][i];
//                 return (
//                   <div
//                     key={label}
//                     className="mb-3"
//                     style={{ display: "flex", justifyContent: "space-between" }}
//                   >
//                     <label
//                       style={{
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         marginBottom: "8px",
//                       }}
//                     >
//                       {label}
//                     </label>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         minWidth: "clamp(60px, 80px, 100px)",
//                         height: "30px",
//                         lineHeight: "30px",
//                         textAlign: "center",
//                         backgroundColor: "#fce7f3",
//                         color: "#d946ef",
//                         borderRadius: "20px",
//                         fontSize: "14px",
//                         fontWeight: "500",
//                         transition: "all 0.3s ease",
//                         padding: "0 5px",
//                       }}
//                     >
//                       {value}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             <div>
//               <h6
//                 style={{
//                   fontWeight: "600",
//                   marginBottom: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 Checklist
//               </h6>
//               <div style={{ fontSize: "14px", color: "#666" }}>
//                 Venue - Delhi Club
//               </div>
//             </div>
//           </div>

//           {/* Main Chat */}
//           <div className="col-md-9 col-lg-10 p-0">
//             <div
//               style={{
//                 height: "82vh",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div
//                 style={{
//                   padding: "30px",
//                   textAlign: "center",
//                   background: "transparent",
//                 }}
//               >
//                 <div style={{ fontSize: "32px", marginBottom: "10px" }}>
//                   Magic
//                 </div>
//                 <h3 style={{ color: "#d946ef", fontWeight: "600", margin: 0 }}>
//                   Ask our AI anything
//                 </h3>
//               </div>

//               <div
//                 className="no-scrollbar"
//                 ref={messagesContainerRef}
//                 style={{
//                   flex: 1,
//                   overflowY: "auto",
//                   padding: "20px 40px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "20px",
//                   scrollbarWidth: "none",
//                   msOverflowStyle: "none",
//                 }}
//               >
//                 <div
//                   style={{
//                     textAlign: "center",
//                     opacity: "0.15",
//                     fontSize: "48px",
//                     fontWeight: "bold",
//                     color: "#fff",
//                     marginBottom: "20px",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "15px",
//                   }}
//                 >
//                   <span>HAPPYWEDZ</span>
//                 </div>

//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     style={{
//                       display: "flex",
//                       justifyContent:
//                         msg.type === "user" ? "flex-end" : "flex-start",
//                       marginBottom: "15px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         maxWidth: "70%",
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "5px",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: "11px",
//                           fontWeight: "600",
//                           color: msg.type === "user" ? "#d946ef" : "#9333ea",
//                           textTransform: "uppercase",
//                           letterSpacing: "0.5px",
//                           paddingLeft: msg.type === "user" ? "0" : "10px",
//                           paddingRight: msg.type === "user" ? "10px" : "0",
//                           textAlign: msg.type === "user" ? "right" : "left",
//                         }}
//                       >
//                         {msg.type === "user" ? "USER" : "OUR AI"}
//                       </div>
//                       <div
//                         style={{
//                           padding: "15px 20px",
//                           borderRadius: "10px",
//                           backgroundColor: "#fff",
//                           boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//                           fontSize: "15px",
//                           lineHeight: "1.6",
//                           color: "#333",
//                           whiteSpace: "pre-line",
//                         }}
//                       >
//                         {msg.text}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div
//                 style={{
//                   padding: "20px 40px 50px",
//                   backgroundColor: "transparent",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "relative",
//                     maxWidth: "900px",
//                     margin: "0 auto",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Ask me anything about your projects"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     style={{
//                       padding: "15px 60px 15px 20px",
//                       border: "2px solid #C31162",
//                       fontSize: "15px",
//                       backgroundColor: "#fff",
//                       boxShadow: "0 4px 15px rgba(217, 70, 239, 0.15)",
//                     }}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     style={{
//                       position: "absolute",
//                       right: "8px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       background: "transparent",
//                       border: "none",
//                       borderRadius: "50%",
//                       width: "40px",
//                       height: "40px",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       cursor: "pointer",
//                       transition: "transform 0.2s",
//                     }}
//                     onMouseOver={(e) =>
//                       (e.currentTarget.style.transform =
//                         "translateY(-50%) scale(1.05)")
//                     }
//                     onMouseOut={(e) =>
//                       (e.currentTarget.style.transform =
//                         "translateY(-50%) scale(1)")
//                     }
//                   >
//                     <svg
//                       width="30"
//                       height="30"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="#C31162"
//                       strokeWidth="2"
//                     >
//                       <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default Genie;
// import React, { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";

// const Genie = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const messagesRef = useRef(null);
//   const token = useSelector((state) => state.auth.token);

//   const sessionId = useRef("sess_" + Date.now()).current;

//   // Decode JWT
//   const decodeToken = (token) => {
//     try {
//       if (!token) return null;
//       const payload = token.split(".")[1];
//       return JSON.parse(atob(payload))?.id || null;
//     } catch {
//       return null;
//     }
//   };

//   const userId = decodeToken(token);

//   useEffect(() => {
//     setMessages([
//       {
//         type: "ai",
//         text: "Hi! I’m your Wedding Genie ✨ Ask me anything about wedding planning!",
//       },
//     ]);
//   }, []);

//   useEffect(() => {
//     const el = messagesRef.current;
//     if (el) {
//       el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//     }
//   }, [messages]);

//   const callChatApi = async (query) => {
//     setIsLoading(true);

//     try {
//       const res = await fetch("http://192.168.1.15:5000/api/user_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? `Bearer ${token}` : "",
//         },
//         body: JSON.stringify({
//           session_id: sessionId,
//           user_query: query,
//           user_id: userId,
//         }),
//       });

//       const data = await res.json();
//       return (
//         data?.response?.summary ||
//         data?.response ||
//         data?.answer ||
//         "I couldn’t understand that!"
//       );
//     } catch (err) {
//       return "⚠️ Server error — Please try again later.";
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const msgText = inputValue.trim();
//     setInputValue("");

//     setMessages((prev) => [...prev, { type: "user", text: msgText }]);

//     const reply = await callChatApi(msgText);
//     setMessages((prev) => [...prev, { type: "ai", text: reply }]);
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div
//       className="container-fluid"
//       style={{ minHeight: "100vh", background: "#F2E9FB" }}
//     >
//       <div className="row justify-content-center">
//         <div
//           className="col-lg-8 col-md-10 p-0 d-flex flex-column"
//           style={{ minHeight: "100vh" }}
//         >
//           {/* Header */}
//           <div className="p-3 text-center">
//             <h3 style={{ color: "#A3047A" }}>Wedding Genie 💬✨</h3>
//             <p style={{ opacity: 0.7 }}>Ask anything about your wedding!</p>
//           </div>

//           {/* Messages */}
//           <div
//             ref={messagesRef}
//             className="flex-grow-1 p-3"
//             style={{
//               overflowY: "auto",
//               background: "#FFF",
//               borderTop: "2px solid #A3047A",
//               borderBottom: "2px solid #A3047A",
//             }}
//           >
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   justifyContent: m.type === "user" ? "flex-end" : "flex-start",
//                   marginBottom: 12,
//                 }}
//               >
//                 <div
//                   style={{
//                     background: m.type === "user" ? "#FFD4ED" : "#E4DAFF",
//                     padding: "12px 16px",
//                     borderRadius: 12,
//                     maxWidth: "70%",
//                     whiteSpace: "pre-line",
//                   }}
//                 >
//                   {m.text}
//                 </div>
//               </div>
//             ))}

//             {isLoading && (
//               <div style={{ color: "#7A1FA2", fontStyle: "italic" }}>
//                 Genie is typing...
//               </div>
//             )}
//           </div>

//           {/* Input */}
//           <div className="p-3 bg-white">
//             <div className="input-group">
//               <input
//                 type="text"
//                 className="form-control"
//                 value={inputValue}
//                 placeholder="Ask anything…"
//                 onKeyDown={handleEnter}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 style={{ borderColor: "#A3047A" }}
//               />
//               <button
//                 className="btn"
//                 onClick={handleSend}
//                 style={{ background: "#A3047A", color: "white" }}
//               >
//                 Send 🚀
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Genie;

// import React, { useEffect, useRef, useState } from "react";
// import { BsStars } from "react-icons/bs";
// import { FaAngleRight } from "react-icons/fa6";
// import { FaTimes } from "react-icons/fa";
// import { LuSendHorizontal } from "react-icons/lu";
// import { MdChatBubbleOutline } from "react-icons/md";
// import { useSelector } from "react-redux";

// const Genie = () => {
//   const [messages, setMessages] = useState([
//     {
//       type: "ai",
//       text: "Hey there! I'm your Wedding Genie. Ask me anything!",
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);

//   const messagesContainerRef = useRef(null);

//   const { tokenId, user } = useSelector((store) => store.auth);
//   const userName = user?.name || "User";

//   function getIdFromToken(token) {
//     try {
//       const payload = token.split(".")[1];
//       const decoded = JSON.parse(atob(payload));
//       return decoded.id || decoded.userId || null;
//     } catch (_) {
//       return null;
//     }
//   }

//   const userId = getIdFromToken(tokenId);

//   const callChatApi = async (query) => {
//     if (!query) return;

//     setIsLoading(true);

//     try {
//       const res = await fetch("http://192.168.1.15:5000/api/user_chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({
//           session_id: "session-1",
//           user_query: query,
//           user_id: userId,
//         }),
//       });

//       const data = await res.json();
//       return {
//         summary: data?.response?.summary || "No response received.",
//         results: data?.response?.results || null,
//       };
//     } catch (err) {
//       console.error("API ERROR:", err);
//       return {
//         summary: "⚠️ Server not responding. Try again later.",
//         results: null,
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       setShowSidebar(!mobile);
//     };

//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   useEffect(() => {
//     const el = messagesContainerRef.current;
//     if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMsg = inputValue.trim();
//     setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
//     setInputValue("");

//     const apiResponse = await callChatApi(userMsg);

//     setMessages((prev) => [
//       ...prev,
//       {
//         type: "ai",
//         text: apiResponse.summary,
//         results: apiResponse.results,
//       },
//     ]);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSendMessage();
//   };

//   const headerHeight = "clamp(60px, 10vw, 200px)";
//   const contentHeight = `calc(100vh - ${headerHeight})`;

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at 80% 50%, rgba(137, 188, 255, 0.32) 0%,rgba(137, 188, 255, 0.1) 15%,rgba(238, 174, 202, 0.2) 21%, rgba(238, 174, 202, 0.1) 100%)",
//       }}
//     >
//       <div className="container-fluid">
//         <div className="row" style={{ minHeight: contentHeight }}>
//           <div
//             className="col-12 col-md-3 p-4"
//             style={{
//               backgroundColor: "#fff",
//               boxShadow: isMobile
//                 ? "4px 0 10px rgba(0,0,0,0.1)"
//                 : "2px 0 10px rgba(0,0,0,0.05)",
//               minHeight: "100vh",
//               position: isMobile ? "fixed" : "relative",
//               top: isMobile ? headerHeight : 0,
//               zIndex: isMobile ? 1000 : 1,
//               overflowY: "auto",
//               width: isMobile ? "min(80vw, 350px)" : "auto",
//               left: isMobile ? 0 : "auto",
//               height: isMobile ? contentHeight : "auto",
//               transform: isMobile
//                 ? showSidebar
//                   ? "translateX(0)"
//                   : "translateX(-100%)"
//                 : "none",
//               transition: isMobile ? "transform 0.3s ease-in-out" : "none",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 cursor: "pointer",
//                 zIndex: 10,
//                 display: isMobile ? "block" : "none",
//               }}
//               onClick={() => setShowSidebar(false)}
//             >
//               <FaTimes size={24} style={{ color: "#d63384" }} />
//             </div>
//             <div
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <img
//                 src="/gennie-logo.png"
//                 alt="gennie-logo"
//                 style={{ height: "100%" }}
//               />
//             </div>
//             <div
//               style={{
//                 marginTop: "30px",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 fontSize: "20px",
//                 color: "#d63384",
//                 cursor: "pointer",
//               }}
//             >
//               <span>Previous history 7 Days</span>
//             </div>

//             <div
//               style={{
//                 marginTop: "20px",
//                 padding: "12px 8px",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 borderBottom: "1px solid #C31162",
//               }}
//             >
//               <div
//                 style={{ display: "flex", alignItems: "center", gap: "8px" }}
//               >
//                 <span>
//                   <MdChatBubbleOutline size={24} />
//                 </span>
//                 <span>Plan my dream destination wedding</span>
//               </div>
//               <span>
//                 <FaAngleRight size={24} />
//               </span>
//             </div>
//             <div style={{ marginTop: "30px" }}>
//               <h6
//                 style={{
//                   color: "#d63384",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <span>
//                   <BsStars size={20} style={{ color: "#C31162" }} />
//                 </span>{" "}
//                 Summary
//               </h6>
//               <div
//                 style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "14px",
//                     color: "#333",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   Budget
//                 </div>
//                 <div
//                   style={{
//                     backgroundColor: "#fce4ec",
//                     color: "#d63384",
//                     padding: "5px 10px",
//                     borderRadius: "20px",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     textAlign: "center",
//                   }}
//                 >
//                   50000
//                 </div>
//               </div>
//               <div
//                 style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "14px",
//                     color: "#333",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   Guests
//                 </div>
//                 <div
//                   style={{
//                     backgroundColor: "#fce4ec",
//                     color: "#d63384",
//                     padding: "5px 10px",
//                     borderRadius: "20px",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     textAlign: "center",
//                   }}
//                 >
//                   500
//                 </div>
//               </div>
//               <div
//                 style={{
//                   marginTop: "10px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: "12px",
//                     color: "#333",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   City
//                 </div>
//                 <div
//                   style={{
//                     backgroundColor: "#fce4ec",
//                     color: "#d63384",
//                     padding: "5px 10px",
//                     borderRadius: "20px",
//                     fontSize: "12px",
//                     fontWeight: "600",
//                     textAlign: "center",
//                   }}
//                 >
//                   Pune
//                 </div>
//               </div>
//             </div>
//             <div style={{ marginTop: "30px" }}>
//               <h6
//                 style={{
//                   color: "#d63384",
//                   fontSize: "16px",
//                   fontWeight: "600",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                 }}
//               >
//                 <span>
//                   {" "}
//                   <BsStars size={20} style={{ color: "#C31162" }} />
//                 </span>{" "}
//                 Checklist
//               </h6>

//               <div
//                 style={{
//                   fontSize: "14px",
//                   color: "#333",
//                   marginTop: "15px",
//                 }}
//               >
//                 Venue - Delhi Club
//               </div>
//             </div>
//           </div>
//           {isMobile && showSidebar && (
//             <div
//               style={{
//                 position: "fixed",
//                 top: headerHeight,
//                 left: 0,
//                 width: "100vw",
//                 height: contentHeight,
//                 backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 zIndex: 999,
//               }}
//               onClick={() => setShowSidebar(false)}
//             />
//           )}
//           <div className="col-12 col-md-9 p-0">
//             <div
//               style={{
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               {isMobile && (
//                 <div
//                   style={{
//                     padding: "10px 20px",
//                     display: "flex",
//                     justifyContent: "flex-start",
//                   }}
//                 >
//                   <button
//                     onClick={() => setShowSidebar(!showSidebar)}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       cursor: "pointer",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-around",
//                       width: 24,
//                       height: 24,
//                       padding: 0,
//                     }}
//                   >
//                     <span
//                       style={{
//                         width: "100%",
//                         height: 3,
//                         backgroundColor: "#C31162",
//                         borderRadius: 2,
//                       }}
//                     ></span>
//                     <span
//                       style={{
//                         width: "100%",
//                         height: 3,
//                         backgroundColor: "#C31162",
//                         borderRadius: 2,
//                       }}
//                     ></span>
//                     <span
//                       style={{
//                         width: "100%",
//                         height: 3,
//                         backgroundColor: "#C31162",
//                         borderRadius: 2,
//                       }}
//                     ></span>
//                   </button>
//                 </div>
//               )}
//               <div
//                 style={{
//                   padding: "10px 30px",
//                   textAlign: "center",
//                 }}
//               >
//                 <p>
//                   <BsStars size={30} style={{ color: "#C31162" }} />
//                 </p>
//                 <h3 style={{ color: "#C31162", fontWeight: "600" }}>
//                   Ask our AI anything
//                 </h3>
//               </div>

//               <div
//                 ref={messagesContainerRef}
//                 className="no-scrollbar"
//                 style={{
//                   flex: 1,
//                   overflowY: "auto",
//                   padding: "20px 40px",
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "20px",
//                 }}
//               >
//                 {messages.map((msg, index) => (
//                   <div
//                     key={index}
//                     style={{
//                       display: "flex",
//                       justifyContent:
//                         msg.type === "user" ? "flex-end" : "flex-start",
//                       marginBottom: "5px",
//                       gap: "5px",
//                       alignItems: "flex-start",
//                     }}
//                   >
//                     {msg.type === "ai" && (
//                       <div
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           borderRadius: "50%",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                           alignSelf: "flex-end",
//                         }}
//                       >
//                         <img src="/gennie-logo.png" alt="" />
//                       </div>
//                     )}
//                     <div
//                       style={{
//                         width: "auto",
//                       }}
//                     >
//                       <div
//                         style={{
//                           background: "#fff",
//                           padding: "8px 16px",
//                           borderRadius:
//                             msg.type === "user"
//                               ? "18px 18px 0 18px"
//                               : "18px 18px 18px 0",
//                           color: "#1f2937",
//                           whiteSpace: "pre-line",
//                           fontSize: "15px",
//                           lineHeight: "1.6",
//                         }}
//                       >
//                         {msg.text}
//                       </div>

//                       {msg.results && msg.results.length > 0 && (
//                         <div
//                           style={{
//                             marginTop: "20px",
//                             display: "grid",
//                             gridTemplateColumns:
//                               "repeat(auto-fit, minmax(280px, 1fr))",
//                             gap: "16px",
//                             maxWidth: "100%",
//                           }}
//                         >
//                           {msg.results.map((result, idx) => (
//                             <div
//                               key={idx}
//                               style={{
//                                 background: "#ffffff",
//                                 padding: "20px",
//                                 borderRadius: "12px",
//                                 border: "1px solid #e5e7eb",
//                                 boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
//                                 transition: "all 0.2s ease",
//                                 cursor: "pointer",
//                                 maxWidth: "380px",
//                                 width: "100%",
//                               }}
//                               onMouseEnter={(e) => {
//                                 e.currentTarget.style.boxShadow =
//                                   "0 4px 12px rgba(0,0,0,0.12)";
//                                 e.currentTarget.style.transform =
//                                   "translateY(-2px)";
//                               }}
//                               onMouseLeave={(e) => {
//                                 e.currentTarget.style.boxShadow =
//                                   "0 1px 3px rgba(0,0,0,0.08)";
//                                 e.currentTarget.style.transform =
//                                   "translateY(0)";
//                               }}
//                             >
//                               <div
//                                 style={{
//                                   fontWeight: "600",
//                                   fontSize: "17px",
//                                   color: "#1f2937",
//                                   marginBottom: "10px",
//                                   lineHeight: "1.4",
//                                 }}
//                               >
//                                 {result.name}
//                               </div>
//                               <div
//                                 style={{
//                                   fontSize: "14px",
//                                   color: "#6b7280",
//                                   marginBottom: "6px",
//                                   fontWeight: "500",
//                                 }}
//                               >
//                                 {result.location}
//                               </div>
//                               <div
//                                 style={{
//                                   fontSize: "13px",
//                                   color: "#9ca3af",
//                                   marginBottom: "10px",
//                                   letterSpacing: "0.3px",
//                                 }}
//                               >
//                                 {result.type}
//                               </div>
//                               {result.rating > 0 && (
//                                 <div
//                                   style={{
//                                     display: "inline-block",
//                                     fontSize: "13px",
//                                     fontWeight: "600",
//                                     color: "#d97706",
//                                     backgroundColor: "#fef3c7",
//                                     padding: "4px 10px",
//                                     borderRadius: "6px",
//                                     marginBottom: "14px",
//                                   }}
//                                 >
//                                   {result.rating} Rating
//                                 </div>
//                               )}
//                               {result.why_consider &&
//                                 result.why_consider.length > 0 && (
//                                   <div
//                                     style={{
//                                       marginTop: "14px",
//                                       paddingTop: "14px",
//                                       borderTop: "1px solid #f3f4f6",
//                                     }}
//                                   >
//                                     <div
//                                       style={{
//                                         fontSize: "12px",
//                                         fontWeight: "600",
//                                         color: "#374151",
//                                         marginBottom: "8px",
//                                         textTransform: "uppercase",
//                                         letterSpacing: "0.5px",
//                                       }}
//                                     >
//                                       Why Consider
//                                     </div>
//                                     <ul
//                                       style={{
//                                         margin: "0",
//                                         paddingLeft: "18px",
//                                         fontSize: "13px",
//                                         color: "#4b5563",
//                                         lineHeight: "1.6",
//                                         listStyleType: "disc",
//                                       }}
//                                     >
//                                       {result.why_consider.map((reason, i) => (
//                                         <li
//                                           key={i}
//                                           style={{
//                                             marginBottom: "6px",
//                                             paddingLeft: "2px",
//                                           }}
//                                         >
//                                           {reason}
//                                         </li>
//                                       ))}
//                                     </ul>
//                                   </div>
//                                 )}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     {msg.type === "user" && (
//                       <div
//                         style={{
//                           width: "40px",
//                           height: "40px",
//                           borderRadius: "50%",
//                           background: "#6b7280",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           flexShrink: 0,
//                           color: "#fff",
//                           fontWeight: "600",
//                           fontSize: "16px",
//                           alignSelf: "flex-end",
//                         }}
//                       >
//                         {userName.slice(0, 1)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//                 <style>
//                   {`
//           @media (max-width: 768px) {
//             div[style*="gridTemplateColumns"] {
//               grid-template-columns: 1fr !important;
//             }
//           }

//           @media (min-width: 769px) and (max-width: 1200px) {
//             div[style*="gridTemplateColumns"] {
//               grid-template-columns: repeat(2, 1fr) !important;
//             }
//           }

//           @media (min-width: 1201px) {
//             div[style*="gridTemplateColumns"] {
//               grid-template-columns: repeat(3, 1fr) !important;
//             }
//           }
//         `}
//                 </style>
//                 {isLoading && (
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <img
//                         src="/gennie-logo.png"
//                         alt=""
//                         style={{ height: "100%" }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: "6px",
//                         background: "#fff",
//                         padding: "12px 12px",
//                         borderRadius: "18px",
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                         width: "fit-content",
//                       }}
//                     >
//                       <div style={{ display: "flex", gap: "4px" }}>
//                         <span
//                           style={{
//                             width: "6px",
//                             height: "6px",
//                             background: "#C31162",
//                             borderRadius: "50%",
//                             animation: "blink 1.4s infinite both",
//                             animationDelay: "0s",
//                           }}
//                         ></span>
//                         <span
//                           style={{
//                             width: "6px",
//                             height: "6px",
//                             background: "#C31162",
//                             borderRadius: "50%",
//                             animation: "blink 1.4s infinite both",
//                             animationDelay: "0.2s",
//                           }}
//                         ></span>
//                         <span
//                           style={{
//                             width: "6px",
//                             height: "6px",
//                             background: "#C31162",
//                             borderRadius: "50%",
//                             animation: "blink 1.4s infinite both",
//                             animationDelay: "0.4s",
//                           }}
//                         ></span>
//                       </div>

//                       <style>
//                         {`
//                     @keyframes blink {
//                       0% { opacity: .2; transform: translateY(0); }
//                       20% { opacity: 1; transform: translateY(-3px); }
//                       100% { opacity: .2; transform: translateY(0); }
//                     }
//                     `}
//                       </style>
//                     </div>
//                   </div>
//                 )}{" "}
//               </div>
//               <div style={{ padding: "20px 40px 50px" }}>
//                 <div
//                   style={{
//                     position: "relative",
//                     maxWidth: "900px",
//                     margin: "0 auto",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     placeholder="Ask me anything..."
//                     className="form-control"
//                     style={{
//                       padding: "15px 60px 15px 20px",
//                       fontSize: "15px",
//                       boxShadow: "0 4px 15px rgba(217, 70, 239, 0.15)",
//                       borderRadius: "50px",
//                     }}
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     style={{
//                       position: "absolute",
//                       right: "10px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                     }}
//                   >
//                     <LuSendHorizontal size={24} style={{ color: "#ed1147" }} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Genie;
import React, { useEffect, useRef, useState } from "react";
import { BsStars } from "react-icons/bs";
import { FaAngleRight } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import { MdChatBubbleOutline } from "react-icons/md";
import { useSelector } from "react-redux";

const Genie = () => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hey there! I'm your Wedding Genie. Ask me anything!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sessionId] = useState(
    () => "sess_" + Math.random().toString(36).substring(2, 10)
  );

  const messagesContainerRef = useRef(null);
  const { token, user } = useSelector((store) => store.auth);
  const userName = user?.name || "User";

  // function getIdFromToken(token) {
  //   try {
  //     const payload = token.split(".")[1];
  //     const decoded = JSON.parse(atob(payload));
  //     return decoded.id || decoded.userId || null;
  //   } catch (_) {
  //     return null;
  //   }
  // }

  function getIdFromToken(token) {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode payload
      return payload.id || payload._id || payload.userId || null;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  const userId = getIdFromToken(token);

  const callChatApi = async (query) => {
    if (!query) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://192.168.1.15:5000/api/user_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_query: query,
          user_id: userId,
        }),
      });

      const data = await res.json();
      return {
        summary: data?.response?.summary || "No response received.",
        results: data?.response?.results || null,
      };
    } catch (err) {
      console.error("API ERROR:", err);
      return {
        summary: "⚠️ Server not responding. Try again later.",
        results: null,
      };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = inputValue.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
    setInputValue("");

    const apiResponse = await callChatApi(userMsg);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: apiResponse.summary,
        results: apiResponse.results,
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const headerHeight = "clamp(60px, 10vw, 200px)";
  const contentHeight = `calc(100vh - ${headerHeight})`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 50%, rgba(137, 188, 255, 0.32) 0%,rgba(137, 188, 255, 0.1) 15%,rgba(238, 174, 202, 0.2) 21%, rgba(238, 174, 202, 0.1) 100%)",
      }}
    >
      <div className="container-fluid">
        <div className="row" style={{ minHeight: contentHeight }}>
          {/* SIDEBAR */}
          <div
            className="col-12 col-md-3 p-4"
            style={{
              backgroundColor: "#fff",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
              minHeight: "100vh",
              overflowY: "auto",
              // Only apply mobile-specific styles when isMobile is true
              ...(isMobile && {
                position: "fixed",
                top: headerHeight,
                left: 0,
                width: "min(80vw, 350px)",
                height: contentHeight,
                zIndex: 1000,
                transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.3s ease-in-out",
                boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
              }),
            }}
          >
            {/* Close button - only visible on mobile */}
            {isMobile && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
                onClick={() => setShowSidebar(false)}
              >
                <FaTimes size={24} style={{ color: "#d63384" }} />
              </div>
            )}

            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/gennie-logo.png"
                alt="gennie-logo"
                style={{ height: "100%" }}
              />
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "20px",
                color: "#d63384",
                cursor: "pointer",
              }}
            >
              <span>Previous history 7 Days</span>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "12px 8px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #C31162",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>
                  <MdChatBubbleOutline size={24} />
                </span>
                <span>Plan my dream destination wedding</span>
              </div>
              <span>
                <FaAngleRight size={24} />
              </span>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h6
                style={{
                  color: "#d63384",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>
                  <BsStars size={20} style={{ color: "#C31162" }} />
                </span>{" "}
                Summary
              </h6>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Budget
                </div>
                <div
                  style={{
                    backgroundColor: "#fce4ec",
                    color: "#d63384",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  50000
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  Guests
                </div>
                <div
                  style={{
                    backgroundColor: "#fce4ec",
                    color: "#d63384",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  500
                </div>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#333",
                    marginBottom: "8px",
                  }}
                >
                  City
                </div>
                <div
                  style={{
                    backgroundColor: "#fce4ec",
                    color: "#d63384",
                    padding: "5px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  Pune
                </div>
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              <h6
                style={{
                  color: "#d63384",
                  fontSize: "16px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>
                  <BsStars size={20} style={{ color: "#C31162" }} />
                </span>{" "}
                Checklist
              </h6>

              <div
                style={{
                  fontSize: "14px",
                  color: "#333",
                  marginTop: "15px",
                }}
              >
                Venue - Delhi Club
              </div>
            </div>
          </div>

          {/* BACKDROP OVERLAY - only on mobile when sidebar is open */}
          {isMobile && showSidebar && (
            <div
              style={{
                position: "fixed",
                top: headerHeight,
                left: 0,
                width: "100vw",
                height: contentHeight,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={() => setShowSidebar(false)}
            />
          )}

          {/* CHAT SECTION */}
          <div className="col-12 col-md-9 p-0">
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                minHeight: contentHeight,
              }}
            >
              {/* Hamburger menu - only on mobile */}
              {isMobile && (
                <div
                  style={{
                    padding: "10px 20px",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      width: 24,
                      height: 24,
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        width: "100%",
                        height: 3,
                        backgroundColor: "#C31162",
                        borderRadius: 2,
                      }}
                    ></span>
                    <span
                      style={{
                        width: "100%",
                        height: 3,
                        backgroundColor: "#C31162",
                        borderRadius: 2,
                      }}
                    ></span>
                    <span
                      style={{
                        width: "100%",
                        height: 3,
                        backgroundColor: "#C31162",
                        borderRadius: 2,
                      }}
                    ></span>
                  </button>
                </div>
              )}

              <div
                style={{
                  padding: "10px 30px",
                  textAlign: "center",
                }}
              >
                <p>
                  <BsStars size={30} style={{ color: "#C31162" }} />
                </p>
                <h3 style={{ color: "#C31162", fontWeight: "600" }}>
                  Ask our AI anything
                </h3>
              </div>

              <div
                ref={messagesContainerRef}
                className="no-scrollbar"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px 40px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.type === "user" ? "flex-end" : "flex-start",
                      marginBottom: "5px",
                      gap: "5px",
                      alignItems: "flex-start",
                    }}
                  >
                    {msg.type === "ai" && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          alignSelf: "flex-end",
                        }}
                      >
                        <BsStars size={30} style={{ color: "#C31162" }} />
                      </div>
                    )}
                    <div
                      style={{
                        width: "auto",
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          padding: "8px 16px",
                          borderRadius:
                            msg.type === "user"
                              ? "18px 18px 0 18px"
                              : "18px 18px 18px 0",
                          color: "#1f2937",
                          whiteSpace: "pre-line",
                          fontSize: "15px",
                          lineHeight: "1.6",
                        }}
                      >
                        {msg.text}
                      </div>

                      {msg.results && msg.results.length > 0 && (
                        <div
                          style={{
                            marginTop: "20px",
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "16px",
                            maxWidth: "100%",
                          }}
                        >
                          {msg.results.map((result, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: "#ffffff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                maxWidth: "380px",
                                width: "100%",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(0,0,0,0.12)";
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 1px 3px rgba(0,0,0,0.08)";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  fontSize: "17px",
                                  color: "#1f2937",
                                  marginBottom: "10px",
                                  lineHeight: "1.4",
                                }}
                              >
                                {result.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  marginBottom: "6px",
                                  fontWeight: "500",
                                }}
                              >
                                {result.location}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#9ca3af",
                                  marginBottom: "10px",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {result.type}
                              </div>
                              {result.rating > 0 && (
                                <div
                                  style={{
                                    display: "inline-block",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#d97706",
                                    backgroundColor: "#fef3c7",
                                    padding: "4px 10px",
                                    borderRadius: "6px",
                                    marginBottom: "14px",
                                  }}
                                >
                                  {result.rating} Rating
                                </div>
                              )}
                              {result.why_consider &&
                                result.why_consider.length > 0 && (
                                  <div
                                    style={{
                                      marginTop: "14px",
                                      paddingTop: "14px",
                                      borderTop: "1px solid #f3f4f6",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "#374151",
                                        marginBottom: "8px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                      }}
                                    >
                                      Why Consider
                                    </div>
                                    <ul
                                      style={{
                                        margin: "0",
                                        paddingLeft: "18px",
                                        fontSize: "13px",
                                        color: "#4b5563",
                                        lineHeight: "1.6",
                                        listStyleType: "disc",
                                      }}
                                    >
                                      {result.why_consider.map((reason, i) => (
                                        <li
                                          key={i}
                                          style={{
                                            marginBottom: "6px",
                                            paddingLeft: "2px",
                                          }}
                                        >
                                          {reason}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {msg.type === "user" && (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: "16px",
                          alignSelf: "flex-end",
                        }}
                      >
                        {userName.slice(0, 1)}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <BsStars size={30} style={{ color: "#C31162" }} />
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#fff",
                        padding: "12px 12px",
                        borderRadius: "18px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        width: "fit-content",
                      }}
                    >
                      <div style={{ display: "flex", gap: "4px" }}>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#C31162",
                            borderRadius: "50%",
                            animation: "blink 1.4s infinite both",
                            animationDelay: "0s",
                          }}
                        ></span>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#C31162",
                            borderRadius: "50%",
                            animation: "blink 1.4s infinite both",
                            animationDelay: "0.2s",
                          }}
                        ></span>
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            background: "#C31162",
                            borderRadius: "50%",
                            animation: "blink 1.4s infinite both",
                            animationDelay: "0.4s",
                          }}
                        ></span>
                      </div>

                      <style>
                        {`
                    @keyframes blink {
                      0% { opacity: .2; transform: translateY(0); }
                      20% { opacity: 1; transform: translateY(-3px); }
                      100% { opacity: .2; transform: translateY(0); }
                    }
                    `}
                      </style>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: "20px 40px 50px" }}>
                <div
                  style={{
                    position: "relative",
                    maxWidth: "900px",
                    margin: "0 auto",
                  }}
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="form-control"
                    style={{
                      padding: "15px 60px 15px 20px",
                      fontSize: "15px",
                      boxShadow: "0 4px 15px rgba(217, 70, 239, 0.15)",
                      borderRadius: "50px",
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <LuSendHorizontal size={24} style={{ color: "#ed1147" }} />
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
