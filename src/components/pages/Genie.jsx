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
import React, { useEffect, useRef, useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { useSelector } from "react-redux";

const Genie = () => {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hey there! I'm your Wedding Genie. Ask me anything! 💜✨",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesContainerRef = useRef(null);

  const tokenId = useSelector((store) => store.auth.token);

  function getIdFromToken(token) {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded.userId || null;
    } catch (_) {
      return null;
    }
  }

  const userId = getIdFromToken(tokenId);

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
          session_id: "session-1",
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 80% 50%, rgba(137, 188, 255, 0.32) 0%,rgba(137, 188, 255, 0.1) 15%,rgba(238, 174, 202, 0.2) 21%, rgba(238, 174, 202, 0.1) 100%)",
      }}
    >
      <div className="container-fluid">
        <div
          className="row"
          style={{ minHeight: "calc(100vh - clamp(60px, 10vw, 200px))" }}
        >
          {/* Sidebar (UI unchanged) */}
          <div
            className="col-md-3 col-lg-2 p-4"
            style={{
              backgroundColor: "#fff",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
              minHeight: "100vh",
            }}
          >
            <h4 style={{ color: "#d946ef", fontWeight: "bold" }}>
              « HappyWedz AI
            </h4>

            <h6 style={{ marginTop: "40px" }}>✨ Summary</h6>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
              Ask anything to begin…
            </div>
          </div>

          {/* Chat Section */}
          <div className="col-md-9 col-lg-10 p-0">
            <div
              style={{
                height: "82vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ color: "#d946ef", fontWeight: "600" }}>
                  Ask our AI anything 💬✨
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
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        background: "#fff",
                        padding: "15px 20px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        color: "#333",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {msg.text}

                      {msg.results && msg.results.length > 0 && (
                        <div
                          style={{
                            marginTop: "15px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                          }}
                        >
                          {msg.results.map((result, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: "#f9f9f9",
                                padding: "15px",
                                borderRadius: "10px",
                                border: "1px solid #f0f0f0",
                                flex: "1 1 calc(33.333% - 12px)",
                                minWidth: "250px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  color: "#d946ef",
                                  marginBottom: "8px",
                                  fontSize: "15px",
                                }}
                              >
                                {result.name}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#666",
                                  marginBottom: "5px",
                                }}
                              >
                                📍 {result.location}
                              </div>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#888",
                                  marginBottom: "8px",
                                }}
                              >
                                {result.type}
                              </div>
                              {result.rating > 0 && (
                                <div
                                  style={{
                                    fontSize: "13px",
                                    color: "#666",
                                    marginBottom: "10px",
                                  }}
                                >
                                  ⭐ {result.rating}
                                </div>
                              )}
                              {result.why_consider &&
                                result.why_consider.length > 0 && (
                                  <div style={{ marginTop: "10px" }}>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "#555",
                                        marginBottom: "6px",
                                      }}
                                    >
                                      Why consider:
                                    </div>
                                    <ul
                                      style={{
                                        margin: "0",
                                        paddingLeft: "18px",
                                        fontSize: "12px",
                                        color: "#666",
                                        lineHeight: "1.5",
                                      }}
                                    >
                                      {result.why_consider.map((reason, i) => (
                                        <li
                                          key={i}
                                          style={{ marginBottom: "4px" }}
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
                  </div>
                ))}

                {isLoading && (
                  <div style={{ color: "#d946ef" }}>Thinking… ✨</div>
                )}
              </div>

              {/* Input */}
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
                      border: "2px solid #C31162",
                      fontSize: "15px",
                      boxShadow: "0 4px 15px rgba(217, 70, 239, 0.15)",
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
