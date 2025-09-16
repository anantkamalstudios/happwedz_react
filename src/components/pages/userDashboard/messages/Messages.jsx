// Messages.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiClock,
  FiChevronLeft,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

// Vendors
const vendors = [
  {
    id: "vendor1",
    name: "Timp's Studio",
    description:
      "Professional wedding photography & videography — years of experience capturing moments with style.",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
  },
  {
    id: "vendor2",
    name: "SwarSamrat DJ",
    description: "Top-tier DJ and music setup services for weddings & parties.",
    phone: "+91 91234 56789",
    location: "Delhi, India",
  },
];

const sampleMessages = [
  {
    id: 1,
    vendorId: "vendor1",
    sender: "vendor",
    name: "Tom's Studio",
    text: "Hi! Thanks for reaching out — how can I help with your event?",
    time: "2025-09-08T10:12:00",
  },
  {
    id: 2,
    vendorId: "vendor1",
    sender: "user",
    name: "You",
    text: "Hi Tom — what packages do you offer for a 200-person wedding?",
    time: "2025-09-08T10:14:00",
  },
  {
    id: 3,
    vendorId: "vendor1",
    sender: "vendor",
    name: "Tom's Studio",
    text: "We have three tiered packages. I can share details or schedule a call.",
    time: "2025-09-08T10:15:30",
  },
  {
    id: 4,
    vendorId: "vendor2",
    sender: "vendor",
    name: "SwarSamrat DJ",
    text: "We have DJ packages starting at ₹50,000. Shall I share details?",
    time: "2025-09-08T10:16:00",
  },
];

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Avatar = ({ name, size = 36 }) => {
  const initial = (name || "U").trim().charAt(0).toUpperCase();
  return (
    <div
      className="d-inline-flex align-items-center justify-content-center text-white fw-bold"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#6c757d",
        fontSize: Math.max(12, Math.floor(size / 2.5)),
      }}
    >
      {initial}
    </div>
  );
};

const QuickChip = ({ label, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(label)}
    className="btn btn-sm border rounded-pill me-2 mb-2 text-truncate"
    style={{
      minWidth: 120,
      background: "#f8f9fa",
    }}
  >
    {label}
  </button>
);

const Messages = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [input, setInput] = useState("");
  const [activeVendorId, setActiveVendorId] = useState("vendor1");
  const [quickReplies] = useState([
    "I'm Interested",
    "Still Thinking",
    "No Thanks",
  ]);
  const scrollRef = useRef(null);

  const activeVendor = vendors.find((v) => v.id === activeVendorId);
  const filteredMessages = messages.filter(
    (m) => m.vendorId === activeVendorId
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeVendorId]);

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;
    const newMsg = {
      id: Date.now(),
      vendorId: activeVendorId,
      sender: "user",
      name: "You",
      text: text.trim(),
      time: new Date().toISOString(),
    };
    setMessages((m) => [...m, newMsg]);
    setInput("");
  };

  const handleQuick = (label) => sendMessage(label);

  return (
    <div className="container my-4">
      <style>{`
        .chat-card { min-height: 540px; max-height: 80vh; }
        .msg-bubble { max-width: 100%; padding: .55rem .75rem; border-radius: 14px; line-height:1.25;}
        .msg-vendor { background:#f1f3f5; color: #212529; border-top-left-radius: 4px; }
        .msg-user { background: rgb(237 17 115); color: #fff; border-top-right-radius: 4px; }
        .msg-time { font-size: .75rem; color: #6c757d; }
        .chat-scroll { overflow-y: auto; max-height: 58vh; padding-right: 8px; }
        .vendor-card { cursor: pointer; transition: background .2s; }
        .vendor-card:hover { background:#f8f9fa; }
        .chip-scroll { overflow-x:auto; -webkit-overflow-scrolling: touch; }
        .chip-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="row g-3">
        {/* Left: Vendors List */}
        <div className="col-12 col-md-4">
          <div className="card border-0 rounded-4 shadow-sm p-3 h-100">
            <h6 className="fw-bold mb-3">Vendors</h6>
            <div className="list-group">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className={`list-group-item border-0 vendor-card rounded-3 mb-2 p-3 ${
                    activeVendorId === v.id ? "bg-light" : ""
                  }`}
                  onClick={() => setActiveVendorId(v.id)}
                >
                  <div className="d-flex align-items-center overflow-hidden">
                    <Avatar name={v.name} size={40} />
                    <div className="ms-3">
                      <div className="fw-bold">{v.name}</div>
                      <div className="small text-muted text-truncate">
                        {v.description.length > 30
                          ? v.description.slice(0, 30) + "..."
                          : v.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="col-12 col-md-8">
          <div className="card border-0 rounded-4 shadow-sm chat-card d-flex flex-column">
            {/* Header */}
            <div className="card-body border-bottom py-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <Avatar name={activeVendor.name} size={44} />
                <div className="ms-3">
                  <div className="fw-bold">{activeVendor.name}</div>
                  <div className="small text-muted">
                    Online • Last seen {formatTime(new Date().toISOString())}
                  </div>
                </div>
              </div>
              <div className="text-muted small d-none d-md-block">
                <FiClock className="me-1" /> {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Messages */}
            <div className="card-body chat-scroll" ref={scrollRef}>
              <div className="d-flex flex-column gap-3">
                {filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`d-flex ${
                      m.sender === "user"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    {m.sender === "vendor" ? (
                      <div className="d-flex align-items-start">
                        <div className="me-2">
                          <Avatar name={m.name} size={36} />
                        </div>
                        <div>
                          <div className="msg-time mb-1 small">
                            {m.name} • {formatTime(m.time)}
                          </div>
                          <div className="msg-bubble msg-vendor">{m.text}</div>
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
                          <div className="msg-bubble msg-user">{m.text}</div>
                        </div>
                        <Avatar name="You" size={36} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

export default Messages;
