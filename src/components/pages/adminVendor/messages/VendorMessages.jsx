import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FiSend, FiSmile, FiClock } from "react-icons/fi";
import vendorMessagesApi from "../../../../services/api/vendorMessagesApi";
import { vendorsApi } from "../../../../services/api/vendorAuthApi";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://happywedz.com/api";
const ONLINE_WINDOW_MS = 60 * 1000;
function isOnline(lastActiveAtIso) {
  if (!lastActiveAtIso) return false;
  return Date.now() - new Date(lastActiveAtIso).getTime() <= ONLINE_WINDOW_MS;
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Avatar = ({ name, size = 36, imageUrl }) => {
  const fallback = "/images/no-image.png";
  return (
    <img
      src={imageUrl || fallback}
      alt={name || "Avatar"}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        }
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
};

const QuickChip = ({ label, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(label)}
    className="btn btn-sm border rounded-pill me-2 mb-2 text-truncate"
    style={{ minWidth: 120, background: "#f8f9fa" }}
  >
    {label}
  </button>
);

const VendorMessages = () => {
  const { token: vendorToken } = useSelector((s) => s.vendorAuth || {});
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const [quickReplies] = useState([
    "Hello 👋",
    "Thanks for reaching out!",
    "Share quote",
  ]);
  const [vendorImage, setVendorImage] = useState(null);
  const [userImages, setUserImages] = useState({}); // userId -> image URL
  const [userLastActive, setUserLastActive] = useState({}); // userId -> lastActiveAt
  const scrollRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const selectConversation = (id) => {
    setActiveConversationId(id);
    // Optimistically reset vendor unread for this thread
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, vendorUnreadCount: 0 } : c))
    );
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeConversationId]);

  // Presence heartbeat for vendor
  useEffect(() => {
    if (!vendorToken) return;
    let stopped = false;
    let timer;
    const send = async () => {
      try {
        if (document.visibilityState === "visible") {
          await axios.post(`${API_BASE}/presence/heartbeat`, null, {
            headers: { Authorization: `Bearer ${vendorToken}` },
          });
        }
      } catch {}
      if (!stopped) timer = setTimeout(send, 45000);
    };
    send();
    const onVis = () => {
      if (document.visibilityState === "visible") {
        axios
          .post(`${API_BASE}/presence/heartbeat`, null, {
            headers: { Authorization: `Bearer ${vendorToken}` },
          })
          .catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [vendorToken]);

  // Load conversations
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoadingConversations(true);
      setError(null);
      try {
        const res = await vendorMessagesApi.getConversations();
        const list = Array.isArray(res)
          ? res
          : res?.data || res?.conversations || [];
        // enrich: fetch vendor self image (from any conversation vendorId)
        const first = list?.[0];
        if (first?.vendorId) {
          try {
            const v = await vendorsApi.getVendorById(first.vendorId);
            const vendorData = v?.data || v;
            setVendorImage(
              vendorData?.profileImage || vendorData?.image || null
            );
          } catch {}
        }
        // enrich: fetch each user's profile image
        const userIds = [...new Set(list.map((c) => c.userId).filter(Boolean))];
        const fetched = await Promise.all(
          userIds.map((id) =>
            axios
              .get(`${API_BASE}/user/${id}`, {
                headers: vendorToken
                  ? { Authorization: `Bearer ${vendorToken}` }
                  : {},
              })
              .then((r) => ({
                id,
                data: r.data?.user || r.data?.data || r.data,
              }))
              .catch(() => ({ id, data: null }))
          )
        );
        const map = {};
        const lastActiveMap = {};
        fetched.forEach(({ id, data }) => {
          if (data) {
            map[id] = data.profileImage || null;
            lastActiveMap[id] = data.lastActiveAt || null;
          }
        });
        if (!isMounted) return;
        setUserImages(map);
        setUserLastActive(lastActiveMap);
        setConversations(list);
        if (list.length > 0 && !activeConversationId) {
          setActiveConversationId(list[0].id);
        }
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || "Failed to load conversations");
      } finally {
        if (isMounted) setLoadingConversations(false);
      }
    };
    if (vendorToken) load();
    return () => {
      isMounted = false;
    };
  }, [vendorToken]);

  // Load messages
  useEffect(() => {
    let isMounted = true;
    const loadMsgs = async () => {
      if (!activeConversationId) return;
      setLoadingMessages(true);
      setError(null);
      try {
        const res = await vendorMessagesApi.getMessages(activeConversationId, {
          page: 1,
          limit: 50,
        });
        const list = Array.isArray(res)
          ? res
          : res?.data || res?.messages || [];
        // normalize for vendor perspective: vendor is "self", user is "other"
        const mapped = list.map((m) => {
          const isVendor = (m.senderType || "").toLowerCase() === "vendor";
          return {
            id: m.id,
            sender: isVendor ? "vendor" : "user",
            name: isVendor ? "You" : "Customer",
            text: m.message || "",
            time: m.createdAt || new Date().toISOString(),
            userId: isVendor ? null : m.senderId,
          };
        });
        if (!isMounted) return;
        setMessages(mapped);
      } catch (e) {
        if (!isMounted) return;
        setError(e.message || "Failed to load messages");
      } finally {
        if (isMounted) setLoadingMessages(false);
      }
    };
    if (vendorToken) loadMsgs();
    return () => {
      isMounted = false;
    };
  }, [vendorToken, activeConversationId]);

  // Polling: conversations (10s) and active conversation messages (4s)
  useEffect(() => {
    if (!vendorToken) return;
    const interval = setInterval(async () => {
      try {
        const res = await vendorMessagesApi.getConversations();
        const list = Array.isArray(res)
          ? res
          : res?.data || res?.conversations || [];
        setConversations((prev) => {
          const byId = new Map(prev.map((c) => [c.id, c]));
          return list.map((c) => {
            const old = byId.get(c.id);
            return old
              ? {
                  ...c,
                  // preserve any local UI only fields if you add later
                  vendorUnreadCount:
                    activeConversationId === c.id ? 0 : c.vendorUnreadCount,
                }
              : c;
          });
        });
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, [vendorToken, activeConversationId]);

  useEffect(() => {
    if (!vendorToken || !activeConversationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await vendorMessagesApi.getMessages(activeConversationId, {
          page: 1,
          limit: 50,
        });
        const list = Array.isArray(res)
          ? res
          : res?.data || res?.messages || [];
        const mapped = list.map((m) => {
          const isVendor = (m.senderType || "").toLowerCase() === "vendor";
          return {
            id: m.id,
            sender: isVendor ? "vendor" : "user",
            name: isVendor ? "You" : "Customer",
            text: m.message || "",
            time: m.createdAt || new Date().toISOString(),
            userId: isVendor ? null : m.senderId,
          };
        });
        setMessages(mapped);
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [vendorToken, activeConversationId]);

  const sendMessage = async (text) => {
    if (!text || !text.trim() || !activeConversationId) return;
    const optimistic = {
      id: `tmp-${Date.now()}`,
      sender: "vendor",
      name: "You",
      text: text.trim(),
      time: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);
    setInput("");
    try {
      const res = await vendorMessagesApi.sendMessage(activeConversationId, {
        message: text.trim(),
      });
      const saved = res && typeof res === "object" ? res : null;
      if (saved) {
        const normalized = {
          id: saved.id,
          sender: "vendor",
          name: "You",
          text: saved.message || text.trim(),
          time: saved.createdAt || optimistic.time,
        };
        setMessages((m) =>
          m.map((x) => (x.id === optimistic.id ? normalized : x))
        );
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  lastMessagePreview: saved.message || text.trim(),
                  lastMessageAt: saved.createdAt || new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (e) {
      setError(e.message || "Failed to send message");
      setMessages((m) => m.filter((x) => x.id !== optimistic.id));
    }
  };

  const handleQuick = (label) => sendMessage(label);

  return (
    <div className="container my-4">
      <style>{`
        .chat-card { min-height: 540px; max-height: 80vh; }
        .msg-bubble { max-width: 100%; padding: .55rem .75rem; border-radius: 14px; line-height:1.25;}
        .msg-user { background:#f1f3f5; color: #212529; border-top-left-radius: 4px; } /* other */
        .msg-vendor { background: rgb(237 17 115); color: #fff; border-top-right-radius: 4px; } /* self */
        .msg-time { font-size: .75rem; color: #6c757d; }
        .chat-scroll { overflow-y: auto; max-height: 58vh; padding-right: 8px; }
        .vendor-card { cursor: pointer; transition: background .2s; }
        .vendor-card:hover { background:#f8f9fa; }
        .chip-scroll { overflow-x:auto; -webkit-overflow-scrolling: touch; }
        .chip-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="row g-3">
        {/* Left: Conversation List (customers) */}
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">Conversations</h6>
            <div className="list-group">
              {loadingConversations ? (
                <div className="p-3 text-muted small">
                  Loading conversations…
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-3 text-muted small">
                  No conversations yet.
                </div>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`list-group-item border-0 vendor-card rounded-3 mb-2 p-3 ${
                      activeConversationId === c.id ? "bg-light" : ""
                    }`}
                    onClick={() => selectConversation(c.id)}
                  >
                    <div className="d-flex align-items-center overflow-hidden">
                      <Avatar
                        name={"Customer"}
                        imageUrl={userImages[c.userId]}
                        size={40}
                      />
                      <div className="ms-3">
                        <div className="d-flex align-items-center">
                          <div className="fw-bold me-2">Customer</div>
                          {c.vendorUnreadCount > 0 && (
                            <span className="badge bg-primary rounded-pill">
                              {c.vendorUnreadCount}
                            </span>
                          )}
                        </div>
                        <div className="small text-muted text-truncate">
                          {c.lastMessagePreview || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="col-12 col-md-8">
          <div className="card border-0 rounded-4 shadow-sm chat-card d-flex flex-column">
            {/* Header */}
            <div className="card-body border-bottom py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Avatar name={"You"} imageUrl={vendorImage} size={44} />
                <div className="ms-3">
                  <div className="fw-bold">You (Vendor)</div>
                  <div className="small text-muted">
                    {/* Show customer's presence when a conversation is selected */}
                    {activeConversation?.userId &&
                    isOnline(userLastActive[activeConversation.userId])
                      ? "Customer Online"
                      : `Customer last seen ${formatTime(
                          userLastActive[activeConversation?.userId] ||
                            activeConversation?.lastMessageAt ||
                            new Date().toISOString()
                        )}`}
                  </div>
                </div>
              </div>
              <div className="text-muted small d-none d-md-block">
                <FiClock className="me-1" /> {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Messages */}
            <div className="card-body chat-scroll" ref={scrollRef}>
              {error && !loadingMessages && activeConversationId ? (
                <div
                  className="alert alert-danger py-2 px-3 small"
                  role="alert"
                >
                  {error || "Failed to load messages."}
                </div>
              ) : loadingMessages ? (
                <div className="text-muted small">Loading messages…</div>
              ) : !activeConversationId ? (
                <div className="text-muted small">Select a conversation</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`d-flex ${
                        m.sender === "vendor"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      {m.sender === "user" ? (
                        <div className="d-flex align-items-start">
                          <div className="me-2">
                            <Avatar
                              name={"Customer"}
                              imageUrl={userImages[m.userId]}
                              size={36}
                            />
                          </div>
                          <div>
                            <div className="msg-time mb-1 small">
                              Customer • {formatTime(m.time)}
                            </div>
                            <div className="msg-bubble msg-user">{m.text}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex align-items-end">
                          <div
                            className="me-2 text-end"
                            style={{ marginRight: 8 }}
                          >
                            <div className="msg-time mb-1 small">
                              {formatTime(m.time)}
                            </div>
                            <div className="msg-bubble msg-vendor">
                              {m.text}
                            </div>
                          </div>
                          <Avatar
                            name={"You"}
                            imageUrl={vendorImage}
                            size={36}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="px-3 pt-2">
              <div className="chip-scroll d-flex align-items-center py-2">
                {quickReplies.map((q) => (
                  <QuickChip key={q} label={q} onClick={handleQuick} />
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="card-body border-top py-3">
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => setInput(input + " 😊")}
                >
                  <FiSmile />
                </button>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                />
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center"
                  onClick={() => sendMessage(input)}
                  style={{ height: "40px", width: "44px", borderRadius: 8 }}
                >
                  <FiSend color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorMessages;
