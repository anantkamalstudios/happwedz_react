const handleNewChat = () => {
  setSessionId(null);
  setMessages([
    {
      type: "ai",
      text: "Hi! I am ShaadiAI 👋\n\nHow can I help you plan your dream wedding today?",
    },
  ]);
  setInputValue("");
};
import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Menu, Plus, SendHorizonal } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa6";

const HomeGennie = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messageContainerRef = useRef(null);
  const getIdFromToken = (token) => {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.id || decoded.userId || null;
    } catch (_) {
      return null;
    }
  };
  const tokenId = localStorage.getItem("token");
  const userId = getIdFromToken(tokenId);

  const handleOpenClick = () => {
    if (tokenId) {
      setIsChatOpen(true);
    } else {
      navigate("/customer-login", { state: { from: location } });
    }
  };

  const callChatApi = async (query) => {
    if (!query) return null;

    try {
      const payload = { user_query: query, user_id: userId };
      if (sessionId) payload.session_id = sessionId;

      const res = await fetch("https://shaadiai.happywedz.com/api/user_chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(tokenId ? { Authorization: `Bearer ${tokenId}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const raw = await res.json();
      const wrapped = raw?.data ? raw.data : raw;
      if (wrapped?.session_id) setSessionId(wrapped.session_id);
      const response = wrapped?.response || {};
      return {
        summary: response?.summary || "No response received.",
        results: Array.isArray(response?.results) ? response.results : null,
      };
    } catch (err) {
      console.error("API ERROR:", err);
      return {
        summary: "⚠️ Server not responding. Try again later.",
        results: null,
      };
    }
  };

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
            text: "Hi! I am ShaadiAI 👋\n\nHow can I help you plan your dream wedding today?",
          },
        ]);
      }, 800);
    }
  }, [isChatOpen]);

  const handleSendMessage = async () => {
    if (inputValue.trim() && !isTyping) {
      const userMessage = inputValue.trim();
      setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
      setInputValue("");
      setIsTyping(true);
      const apiResponse = await callChatApi(userMessage);
      setIsTyping(false);

      if (apiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            text: apiResponse.summary,
            results: apiResponse.results,
          },
        ]);
      }
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
          onClick={handleOpenClick}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            width: "74px",
            height: "74px",
            borderRadius: "50%",
            // background: "linear-gradient(135deg, #ec4899 0%, #9333ea 100%)",
            background: "white",
            border: "none",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 999,
            transition: "transform 0.3s ease",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/shadi.mp4" type="video/mp4" />
            <img
              src="/images/logo.png"
              alt="logo"
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          </video>
        </button>
      )}

      {isChatOpen && (
        <div
          style={{
            position: "fixed",
            bottom: window.innerWidth <= 576 ? "0" : "24px",
            right: window.innerWidth <= 576 ? "0" : "24px",
            width: window.innerWidth <= 576 ? "100vw" : "440px",
            height: window.innerWidth <= 576 ? "80dvh" : "650px",
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
                    src="/gennie-logo.png"
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
                to="/shaadi-ai"
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
                      src="/shaadi.jpg"
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
                    Welcome to Wedding ShaadiAI! ✨
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
                  alignItems: "flex-end",
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
                      src="/gennie-logo.png"
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
                    background: "white",
                    color: "#1f2937",
                    border: "1px solid #f3f4f6",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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

                  {msg.results && msg.results.length > 0 && (
                    <div
                      style={{
                        marginTop: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {msg.results.map((result, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: "#f9fafb",
                            padding: "12px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "600",
                              color: "#ec4899",
                              marginBottom: "6px",
                              fontSize: "13px",
                            }}
                          >
                            {result.name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: "4px",
                            }}
                          >
                            📍 {result.location}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#9ca3af",
                              marginBottom: "6px",
                            }}
                          >
                            {result.type}
                          </div>
                          {result.rating > 0 && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                marginBottom: "8px",
                              }}
                            >
                              ⭐ {result.rating}
                            </div>
                          )}
                          {result.why_consider &&
                            result.why_consider.length > 0 && (
                              <div style={{ marginTop: "8px" }}>
                                <div
                                  style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "#4b5563",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Why consider:
                                </div>
                                <ul
                                  style={{
                                    margin: "0",
                                    paddingLeft: "16px",
                                    fontSize: "11px",
                                    color: "#6b7280",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {result.why_consider.map((reason, i) => (
                                    <li key={i} style={{ marginBottom: "3px" }}>
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
                    src="/gennie-logo.png"
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
                onClick={handleNewChat}
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
                  disabled={isTyping}
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
                  disabled={!inputValue.trim() || isTyping}
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
                    cursor:
                      inputValue.trim() && !isTyping
                        ? "pointer"
                        : "not-allowed",
                    transition: "transform 0.2s",
                    opacity: inputValue.trim() && !isTyping ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) =>
                    inputValue.trim() &&
                    !isTyping &&
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
