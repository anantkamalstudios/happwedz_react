import { ArrowUpLeftFromSquare } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { Link } from "react-router-dom";

const HomeGennie = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [budget, setBudget] = useState("50000");
  const [guests, setGuests] = useState("500");
  const [city, setCity] = useState("Pune");
  const [currentQuestion, setCurrentQuestion] = useState("budget");

  const messageContainerRef = useRef(null);

  useEffect(() => {
    const el = messageContainerRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            type: "ai",
            text: "👋 Hey there! I'm your Wedding Genie. Let's plan your dream wedding, step by step. Start by telling me — what's your approximate budget? 💰",
          },
        ]);
      }, 400);
    }
  }, [isChatOpen]);

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
                text: "I didn't catch a number there. Could you please tell me your budget in numbers? For example: 50000 or 100000 💰",
              },
            ]);
          }, 1000);
        }
      } else if (currentQuestion === "guests") {
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
      } else if (currentQuestion === "city") {
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
      } else {
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
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <div
          role="button"
          onClick={() => setIsChatOpen(true)}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "4px solid transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            background: "#C31162",
            transition: "transform 0.3s ease",
            backgroundClip: "padding-box",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              padding: "5px",
              background:
                "conic-gradient(from 0deg, #C31162, #60A5FA, #f0f4ff, #C31162)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              animation: "rotateGradient 3s linear infinite",
            }}
          />
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          <style>
            {`
              @keyframes rotateGradient {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}

      {/* Responsive Chat Overlay */}
      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            right: "0",
            width: "min(420px, 100vw)",
            height: "min(650px, 100vh)",
            maxHeight: "100vh",
            background:
              "linear-gradient(to top, #f9d8ec 0%, #ffffff 60%, #fce7f3 100%)",
            borderRadius: window.innerWidth <= 640 ? "20px 20px 0 0" : "20px",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1001,
            animation: "slideUp 0.3s ease-out",
            margin: window.innerWidth <= 640 ? "0" : "20px",
          }}
        >
          <style>
            {`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }

              @media (max-width: 640px) {
                .chat-container {
                  width: 100vw !important;
                  height: 100vh !important;
                  border-radius: 0 !important;
                  margin: 0 !important;
                  bottom: 0 !important;
                  right: 0 !important;
                }
              }

              @media (max-width: 480px) {
                .chat-button {
                  width: 60px !important;
                  height: 60px !important;
                  bottom: 20px !important;
                  right: 20px !important;
                }
              }
            `}
          </style>

          {/* Chat Header */}
          <div
            style={{
              padding: window.innerWidth <= 640 ? "15px" : "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginTop: window.innerWidth <= 640 ? "10px" : "20px",
              }}
            >
              <div
                style={{ fontSize: window.innerWidth <= 640 ? "20px" : "24px" }}
              >
                ✨
              </div>
              <div>
                <h5
                  style={{
                    margin: "auto",
                    fontSize: window.innerWidth <= 640 ? "20px" : "24px",
                    fontWeight: "400",
                    color: "#000",
                  }}
                >
                  Ask our AI anything
                </h5>
              </div>
            </div>
          </div>

          {/* Closing buttons */}
          <div
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: window.innerWidth <= 640 ? "8px" : "10px",
            }}
          >
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
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              <ArrowUpLeftFromSquare
                size={window.innerWidth <= 640 ? 16 : 20}
                style={{ color: "#C31162" }}
              />
            </Link>
            <button
              onClick={() => setIsChatOpen(false)}
              style={{
                border: "none",
                borderRadius: "50%",
                width: window.innerWidth <= 640 ? "30px" : "35px",
                height: window.innerWidth <= 640 ? "30px" : "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "transparent",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
              }
            >
              <svg
                width={window.innerWidth <= 640 ? "16" : "20"}
                height={window.innerWidth <= 640 ? "16" : "20"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C31162"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={messageContainerRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: window.innerWidth <= 640 ? "15px" : "20px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
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
                    maxWidth: window.innerWidth <= 640 ? "85%" : "80%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: window.innerWidth <= 640 ? "9px" : "10px",
                      fontWeight: "600",
                      color: msg.type === "user" ? "#d946ef" : "#ea33d8ff",
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
                      padding:
                        window.innerWidth <= 640 ? "10px 14px" : "12px 16px",
                      borderRadius:
                        msg.type === "user"
                          ? "15px 15px 0 15px"
                          : "15px 15px 15px 0",
                      backgroundColor:
                        msg.type === "user" ? "#f45fe0ff" : "#fff",
                      color: msg.type === "user" ? "#fff" : "#333",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                      fontSize: window.innerWidth <= 640 ? "13px" : "14px",
                      lineHeight: "1.5",
                      wordWrap: "break-word",
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
              padding: window.innerWidth <= 640 ? "12px 15px" : "15px 20px",
              borderTop: "1px solid rgba(252, 231, 243, 0.5)",
            }}
          >
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  width: "100%",
                  padding:
                    window.innerWidth <= 640
                      ? "10px 45px 10px 12px"
                      : "12px 50px 12px 15px",
                  borderRadius: "10px",
                  border: "2px solid #fce7f3",
                  fontSize: window.innerWidth <= 640 ? "13px" : "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onBlur={(e) => (e.target.style.borderColor = "#fce7f3")}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  position: "absolute",
                  right: "5px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  borderRadius: "50%",
                  width: window.innerWidth <= 640 ? "32px" : "36px",
                  height: window.innerWidth <= 640 ? "32px" : "36px",
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
                  width={window.innerWidth <= 640 ? "16" : "18"}
                  height={window.innerWidth <= 640 ? "16" : "18"}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeGennie;
