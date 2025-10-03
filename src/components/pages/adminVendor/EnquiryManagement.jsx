import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import {
  Inbox,
  Mail,
  MailOpen,
  Archive,
  Clock,
  MessageCircleReply,
  Calendar,
  Trash2,
  Settings,
  FileText,
  Crown,
  Download,
  Filter,
  Search,
  MoreVertical,
  Star,
} from "lucide-react";

import { useSelector } from "react-redux";

const API_BASE_URL = "https://happywedz.com";

const EnquiryManagement = () => {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token: vendorToken } = useSelector((state) => state.vendorAuth);

  useEffect(() => {
    if (!vendorToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}/api/request-pricing/vendor/dashboard`,
          {
            headers: { Authorization: `Bearer ${vendorToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leads.");
        }

        const data = await response.json();
        if (data && Array.isArray(data.requests)) {
          setLeads(data.requests);
        } else {
          setLeads([]);
        }
      } catch (err) {
        setError(err.message);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [vendorToken]);

  const folders = [
    { id: "inbox", name: "Inbox", count: leads.length },
    { id: "unread", name: "Unread", count: 0 },
    { id: "read", name: "Read", count: 0 },
    { id: "archived", name: "Archived", count: 0 },
  ];

  const stats = {
    replied: leads.filter((l) => l.status === "replied").length,
    booked: leads.filter((l) => l.status === "booked").length,
    discarded: leads.filter((l) => l.status === "discarded").length,
    avgResponseTime: "-- : --",
  };

  const statuses = [
    { id: "pending", name: "Pending", count: 0, color: "#f39c12" },
    { id: "replied", name: "Replied", count: 0, color: "#3498db" },
    { id: "booked", name: "Booked", count: 0, color: "#27ae60" },
    { id: "discarded", name: "Discarded", count: 0, color: "#e74c3c" },
  ];

  const tools = [
    { id: "settings", name: "Settings", icon: <Settings size={18} /> },
    { id: "templates", name: "Templates", icon: <FileText size={18} /> },
    {
      id: "export",
      name: "Export leads",
      icon: <Download size={18} />,
      premium: true,
    },
  ];

  return (
    <div className="enquiry-management-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="main-card">
              <div className="row g-0">
                {/* Sidebar */}
                <div className="col-md-2 col-12 mb-4">
                  <div className="p-3 rounded bg-white">
                    {/* Folders */}
                    <div className="folder-section mb-4">
                      <div className="section-title fw-bold text-uppercase small mb-2">
                        Folders
                      </div>
                      {folders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`d-flex justify-content-between align-items-center py-2 px-2 rounded folder-item ${
                            activeFolder === folder.id
                              ? "bg-light fw-semibold"
                              : ""
                          }`}
                          role="button"
                          onClick={() => setActiveFolder(folder.id)}
                        >
                          <span>{folder.name}</span>
                          <span className="text-muted small">
                            {folder.count}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="status-section mb-4">
                      {statuses.map((status) => (
                        <div
                          key={status.id}
                          className="d-flex justify-content-between align-items-center py-2 px-2 rounded"
                          role="button"
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: status.color,
                                display: "inline-block",
                              }}
                            ></span>
                            {status.name}
                          </div>
                          <span className="text-muted small">
                            {status.count}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tools */}
                    <div className="tools-section">
                      <div className="section-title fw-bold text-uppercase small mb-2">
                        Tools
                      </div>
                      {tools.map((tool) => (
                        <div
                          key={tool.id}
                          className={`d-flex align-items-center gap-2 py-2 px-2 rounded ${
                            tool.premium ? "text-warning fw-semibold" : ""
                          }`}
                          role="button"
                        >
                          {tool.icon}
                          {tool.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-md-10">
                  <div className="container">
                    {/* Stats Section */}
                    <div className="stats-section">
                      <div className="stat-card">
                        <div className="stat-number">{stats.replied}</div>
                        <div className="stat-label">Replied</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">{stats.booked}</div>
                        <div className="stat-label">Booked</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">{stats.discarded}</div>
                        <div className="stat-label">Discarded</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">
                          {stats.avgResponseTime}
                        </div>
                        <div className="stat-label">Average Response Time</div>
                      </div>
                    </div>

                    {/* Messages Section */}
                    <div className="messages-section">
                      <div className="messages-header">
                        <h5 className="messages-title">
                          {folders.find((f) => f.id === activeFolder)?.name ||
                            "Messages"}
                        </h5>
                        <button className="btn btn-link p-0">
                          <MoreVertical size={18} />
                        </button>
                      </div>

                      {loading ? (
                        <div className="text-center py-5">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                      ) : leads.length === 0 ? (
                        <div className="empty-state">
                          <Mail className="empty-icon" />
                          <div className="empty-title">No messages found</div>
                          <div className="empty-message">
                            No messages have been found in this folder.
                            <br />
                            New enquiries will appear here when they arrive.
                          </div>
                        </div>
                      ) : (
                        <div className="leads-list">
                          {leads.map((lead) => (
                            <div key={lead.id} className="lead-item card mb-3">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <h6 className="card-title">
                                    {lead.firstName} {lead.lastName}
                                  </h6>
                                  <small className="text-muted">
                                    {new Date(
                                      lead.createdAt
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                                <p className="card-text small text-muted mb-1">
                                  {lead.email} | {lead.phone}
                                </p>
                                <p className="card-text small">
                                  {lead.message || "No message provided."}
                                </p>
                                <p className="card-text small fw-bold">
                                  Event Date:{" "}
                                  {new Date(
                                    lead.eventDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryManagement;
