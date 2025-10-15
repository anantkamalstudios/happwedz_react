import React, { useState, useEffect, useMemo } from "react";
import { Alert } from "react-bootstrap";
import {
  Inbox,
  MailOpen,
  Archive,
  Calendar,
  Clock,
  MessageCircleReply,
  Settings,
  FileText,
  Crown,
  Download,
  Search,
  User,
  Mail,
  Phone,
  ChevronRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import { useSelector } from "react-redux";
import QuotationModal from "./QuotationModal";
import { useToast } from "../../layouts/toasts/Toast";

const API_BASE_URL = "https://happywedz.com/api";

const EnquiryManagement = () => {
  const [activeFolder, setActiveFolder] = useState("all");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [error, setError] = useState(null);
  const { token: vendorToken } = useSelector((state) => state.vendorAuth);
  const [counts, setCounts] = useState({ total: 0, unread: 0, archived: 0 });
  const [filter, setFilter] = useState("all");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { addToast } = useToast();

  const [stats, setStats] = useState({
    pending: 0,
    booked: 0,
    discarded: 0,
  });

  const fetchInbox = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE_URL}/inbox${
        filter !== "all" ? `?filter=${filter}` : ""
      }`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });

      if (!res.ok) throw new Error("Failed to fetch inbox");

      const data = await res.json();
      const fetchedLeads = Array.isArray(data.inbox) ? data.inbox : [];
      setLeads(fetchedLeads);

      setCounts({
        total: data.totalInbox || 0,
        unread: data.unreadCount || 0,
        archived: data.archivedCount || 0,
      });

      setStats({
        booked: fetchedLeads.filter((l) => l.request?.status === "booked")
          .length,
        declined: fetchedLeads.filter((l) => l.request?.status === "declined")
          .length,
        pending: fetchedLeads.filter((l) => l.request?.status === "pending")
          .length,
      });

      if (
        fetchedLeads.length > 0 &&
        (!selectedLead || !fetchedLeads.find((l) => l.id === selectedLead.id))
      ) {
        setSelectedLead(fetchedLeads[0]);
      } else if (fetchedLeads.length === 0) {
        setSelectedLead(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorToken) {
      fetchInbox();
    }
  }, [vendorToken, filter]);

  const handleAction = async (lead, action) => {
    const inboxId = lead.id;
    const requestId = lead.request?.id;

    const isArchiveAction = action === "archive" || action === "unarchive";
    const isReadAction = action === "read";
    const isStatusAction = ["pending", "booked", "declined"].includes(action);

    try {
      const headers = { Authorization: `Bearer ${vendorToken}` };
      let url;
      const options = { method: "PATCH" };

      if (isStatusAction) {
        // The request ID is required for status updates.
        if (!requestId) {
          console.error("No request ID found for this lead:", lead);
          throw new Error("Cannot update status without a request ID.");
        }
        url = `${API_BASE_URL}/inbox/request/${requestId}/status`;
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({ newStatus: action });
      } else {
        url = `${API_BASE_URL}/inbox/${inboxId}/${action}`;
      }
      options.headers = headers;

      const res = await fetch(url, options);

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || `Failed to ${action} lead`);
      }

      setLeads((prevLeads) =>
        prevLeads.map((l) => {
          if (l.id !== inboxId) return l;

          let updatedLead = { ...l };

          if (isReadAction) updatedLead.isRead = true;
          if (isArchiveAction) updatedLead.isArchived = action === "archive";
          if (isStatusAction) {
            updatedLead.request = { ...updatedLead.request, status: action };
          }

          return updatedLead;
        })
      );

      if (
        isArchiveAction &&
        selectedLead?.id === inboxId &&
        filter !== "archived"
      ) {
        setSelectedLead(null);
      }

      if (
        isStatusAction &&
        selectedLead?.id === inboxId &&
        filter !== "all" &&
        filter !== action
      ) {
        setSelectedLead(null);
      }

      // Refetch to ensure data consistency
      fetchInbox();
    } catch (err) {
      console.error(`Error on action '${action}':`, err);
      setError(err.message);
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    if (!lead.isRead) {
      handleAction(lead, "read");
    }
  };

  const folders = useMemo(
    () => [
      {
        id: "all",
        name: "All Enquiries",
        count: counts.total,
        icon: <Inbox size={18} />,
      },
      {
        id: "unread",
        name: "Unread",
        count: counts.unread,
        icon: <MailOpen size={18} />,
      },
      {
        id: "archived",
        name: "Archived",
        count: counts.archived,
        icon: <Archive size={18} />,
      },
    ],
    [counts]
  );

  const statuses = useMemo(
    () => [
      { id: "pending", name: "Pending", color: "#f39c12" },
      // { id: "replied", name: "Replied", color: "#3498db" },
      { id: "booked", name: "Booked", color: "#27ae60" },
      { id: "declined", name: "Declined", color: "#e74c3c" },
    ],
    []
  );

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
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "40px" }}>
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="text-dark mb-1 fw-bold">Enquiry Management</h2>
                <p className="text-muted mb-0">
                  Manage your wedding enquiries efficiently
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm">
                  <BarChart3 size={16} className="me-1" /> Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div
              className="card border-0 shadow-sm"
              style={{
                // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "16px",
              }}
            >
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 small">Pending</p>
                    <h3 className="mb-0 fw-bold">{stats.pending}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded">
                    <MessageCircleReply size={24} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-white-50">
                    <TrendingUp size={12} /> This month
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div
              className="card border-0 shadow-sm"
              style={{
                // background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                borderRadius: "16px",
              }}
            >
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 small">Booked</p>
                    <h3 className="mb-0 fw-bold">{stats.booked}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-white-50">
                    <TrendingUp size={12} /> This month
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div
              className="card border-0 shadow-sm"
              style={{
                // background: "",
                borderRadius: "16px",
              }}
            >
              <div className="card-body text-dark">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1  small">Declined</p>
                    <h3 className="mb-0 fw-bold">{stats.declined}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded">
                    <Archive size={24} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-white-50">This month</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div
              className="card border-0 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "16px",
              }}
            >
              {/* <div className="card-body text-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 text-white-50 small">Avg Response</p>
                    <h3 className="mb-0 fw-bold">{stats.avgResponseTime}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-2 rounded">
                    <Clock size={24} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-white-50">Response time</small>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          <div className="col-12">
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              <div className="row g-0">
                {/* Sidebar */}
                <div
                  className="col-md-3 col-lg-2"
                  style={{
                    background: "#f8f9fa",
                    borderRight: "1px solid #e9ecef",
                  }}
                >
                  <div className="p-4">
                    {/* Folders */}
                    <div className="mb-4">
                      <h6
                        className="text-uppercase text-muted fw-bold mb-3"
                        style={{ fontSize: "11px", letterSpacing: "1px" }}
                      >
                        Folders
                      </h6>
                      {folders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`d-flex align-items-center p-3 mb-2 ${
                            filter === folder.id ? "text-white" : "text-dark"
                          }`}
                          role="button"
                          onClick={() => setFilter(folder.id)}
                          style={{
                            borderRadius: "12px",
                            background:
                              filter === folder.id
                                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                : "transparent",
                            transition: "all 0.3s ease",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) => {
                            if (filter !== folder.id) {
                              e.currentTarget.style.background = "#e9ecef";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (filter !== folder.id) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          <span className="me-2">{folder.icon}</span>
                          <span className="flex-grow-1 fw-semibold">
                            {folder.name}
                          </span>
                          <span
                            className={`badge ${
                              filter === folder.id
                                ? "bg-white text-primary"
                                : "bg-light text-dark"
                            } rounded-pill`}
                          >
                            {folder.count}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Status Filters */}
                    <div className="mb-4">
                      <h6
                        className="text-uppercase text-muted fw-bold mb-3"
                        style={{ fontSize: "11px", letterSpacing: "1px" }}
                      >
                        Status
                      </h6>
                      {statuses.map((status) => (
                        <div
                          key={status.id}
                          className="d-flex align-items-center p-3 mb-2"
                          role="button"
                          onClick={() => setFilter(status.id)}
                          style={{
                            borderRadius: "12px",
                            background:
                              filter === status.id ? "#e9ecef" : "transparent",
                            transition: "all 0.3s ease",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) => {
                            if (filter !== status.id) {
                              e.currentTarget.style.background = "#f8f9fa";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (filter !== status.id) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: status.color,
                              marginRight: "12px",
                            }}
                          ></span>
                          <span className="flex-grow-1">{status.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tools */}
                    <div>
                      <h6
                        className="text-uppercase text-muted fw-bold mb-3"
                        style={{ fontSize: "11px", letterSpacing: "1px" }}
                      >
                        Tools
                      </h6>
                      {tools.map((tool) => (
                        <div
                          key={tool.id}
                          className="d-flex align-items-center p-3 mb-2"
                          role="button"
                          style={{
                            borderRadius: "12px",
                            transition: "all 0.3s ease",
                            fontSize: "14px",
                            color: tool.premium ? "#f39c12" : "#6c757d",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f8f9fa")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          {tool.icon}
                          <span className="ms-2">{tool.name}</span>
                          {tool.premium && <Crown size={14} className="ms-2" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Leads List */}
                <div
                  className="col-md-4 col-lg-4"
                  style={{
                    background: "#ffffff",
                    borderRight: "1px solid #e9ecef",
                  }}
                >
                  <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0 fw-bold">
                        {folders.find((f) => f.id === filter)?.name ||
                          statuses.find((s) => s.id === filter)?.name ||
                          "Enquiries"}
                      </h5>
                    </div>

                    {loading ? (
                      <div className="text-center py-5 w-100">
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
                      <div className="text-center py-5">
                        <Inbox className="text-muted mb-3" size={48} />
                        <div className="fw-bold mb-1">No messages found</div>
                        <div className="text-muted small">
                          No messages in this folder.
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          maxHeight: "calc(100vh - 300px)",
                          overflowY: "auto",
                        }}
                      >
                        {leads.map((lead) => (
                          <div
                            key={lead.id}
                            className={`card mb-3 border-0 ${
                              selectedLead?.id === lead.id
                                ? "shadow"
                                : "shadow-sm"
                            }`}
                            role="button"
                            onClick={() => handleLeadClick(lead)}
                            style={{
                              borderRadius: "16px",
                              borderLeft: `4px solid ${
                                statuses.find(
                                  (s) => s.id === lead.request?.status
                                )?.color || "#95a5a6"
                              }`,
                              background:
                                selectedLead?.id === lead.id
                                  ? "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)"
                                  : "#fff",
                              transition: "all 0.3s ease",
                              transform:
                                selectedLead?.id === lead.id
                                  ? "scale(1.02)"
                                  : "scale(1)",
                            }}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      background:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {lead.request?.user?.name?.charAt(0) || "?"}
                                  </div>
                                  <div>
                                    <h6
                                      className={`mb-0 ${
                                        !lead.isRead ? "fw-bold" : "fw-semibold"
                                      }`}
                                      style={{ fontSize: "14px" }}
                                    >
                                      {lead.request?.user?.name || "No Name"}
                                    </h6>
                                    <small className="text-muted">
                                      {lead.request?.user?.email}
                                    </small>
                                  </div>
                                </div>
                                {!lead.isRead && (
                                  <span
                                    className="badge bg-primary rounded-pill"
                                    style={{ fontSize: "10px" }}
                                  >
                                    New
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-muted mb-2 small"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: "2",
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {lead.request?.message || "No message"}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span
                                  className="badge rounded-pill px-3 py-1"
                                  style={{
                                    backgroundColor: `${
                                      statuses.find(
                                        (s) => s.id === lead.request?.status
                                      )?.color
                                    }20`,
                                    color: statuses.find(
                                      (s) => s.id === lead.request?.status
                                    )?.color,
                                    fontSize: "11px",
                                  }}
                                >
                                  {
                                    statuses.find(
                                      (s) => s.id === lead.request?.status
                                    )?.name
                                  }
                                </span>
                                <small className="text-muted">
                                  <Calendar size={12} className="me-1" />
                                  {new Date(
                                    lead.request?.eventDate
                                  ).toLocaleDateString("en-IN", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lead Detail */}
                <div
                  className="col-md-5 col-lg-6"
                  style={{ background: "#fafbfc" }}
                >
                  <div className="p-4 h-100">
                    {selectedLead ? (
                      <>
                        {/* Header */}
                        <div className="mb-4">
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{
                                width: "60px",
                                height: "60px",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                fontSize: "24px",
                              }}
                            >
                              {selectedLead.request?.user?.name?.charAt(0) ||
                                "?"}
                            </div>
                            <div className="flex-grow-1">
                              <h4 className="mb-1 fw-bold">
                                {selectedLead.request?.user?.name}
                              </h4>
                              <div className="d-flex flex-column gap-1">
                                <div className="d-flex align-items-center text-muted small">
                                  <Mail size={14} className="me-2" />
                                  <a
                                    href={`mailto:${selectedLead.request?.user?.email}`}
                                    className="text-decoration-none text-muted"
                                  >
                                    {selectedLead.request?.user?.email}
                                  </a>
                                </div>
                                <div className="d-flex align-items-center text-muted small">
                                  <Phone size={14} className="me-2" />
                                  <span>
                                    {selectedLead.request?.user?.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-pill"
                              onClick={() =>
                                handleAction(
                                  selectedLead,
                                  selectedLead.isArchived
                                    ? "unarchive"
                                    : "archive"
                                )
                              }
                            >
                              <Archive size={14} className="me-1" />
                              {selectedLead.isArchived
                                ? "Unarchive"
                                : "Archive"}
                            </button>
                          </div>

                          {/* Meta Info Cards */}
                          <div className="row g-2">
                            <div className="col-6">
                              <div
                                className="card border-0 shadow-sm"
                                style={{
                                  borderRadius: "12px",
                                  background: "#fff",
                                }}
                              >
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <Calendar
                                      size={16}
                                      className="text-primary"
                                    />
                                    <small className="text-muted">
                                      Event Date
                                    </small>
                                  </div>
                                  <div className="fw-semibold">
                                    {new Date(
                                      selectedLead.request.eventDate
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div
                                className="card border-0 shadow-sm"
                                style={{
                                  borderRadius: "12px",
                                  background: "#fff",
                                }}
                              >
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-center gap-2 mb-1">
                                    <Clock size={16} className="text-info" />
                                    <small className="text-muted">
                                      Received
                                    </small>
                                  </div>
                                  <div className="fw-semibold">
                                    {new Date(
                                      selectedLead.createdAt
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4">
                          <span
                            className="badge rounded-pill px-4 py-2"
                            style={{
                              backgroundColor: statuses.find(
                                (s) => s.id === selectedLead.request.status
                              )?.color,
                              fontSize: "13px",
                            }}
                          >
                            {
                              statuses.find(
                                (s) => s.id === selectedLead.request.status
                              )?.name
                            }
                          </span>
                        </div>

                        {/* Message */}
                        <div className="mb-4">
                          <h6 className="fw-bold mb-3">Message</h6>
                          <div
                            className="card border-0 shadow-sm"
                            style={{ borderRadius: "16px", background: "#fff" }}
                          >
                            <div className="card-body p-4">
                              <p className="mb-0" style={{ lineHeight: "1.8" }}>
                                {selectedLead.request.message ||
                                  "No message provided."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h6 className="fw-bold mb-3">Update Status</h6>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {statuses.map((status) => (
                              <button
                                key={status.id}
                                className="btn btn-sm rounded-pill"
                                style={{
                                  background:
                                    selectedLead.request.status === status.id
                                      ? status.color
                                      : `${status.color}20`,
                                  color:
                                    selectedLead.request.status === status.id
                                      ? "#fff"
                                      : status.color,
                                  border: "none",
                                  fontWeight: "600",
                                  padding: "8px 20px",
                                }}
                                onClick={() =>
                                  handleAction(selectedLead, status.id)
                                }
                              >
                                {status.name}
                              </button>
                            ))}
                          </div>
                          <button
                            className="btn btn-lg w-100 text-white fw-semibold shadow"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              border: "none",
                              borderRadius: "12px",
                              padding: "14px",
                            }}
                            onClick={() => {
                              if (selectedLead) {
                                setShowQuoteModal(true);
                              } else {
                                addToast(
                                  "Please select a lead to reply to.",
                                  "warning"
                                );
                              }
                            }}
                          >
                            <MessageCircleReply size={18} className="me-2" />
                            Reply to Enquiry
                          </button>
                        </div>
                      </>
                    ) : (
                      !loading && (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center mb-3"
                            style={{
                              width: "80px",
                              height: "80px",
                              background:
                                "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                            }}
                          >
                            <MailOpen size={40} className="text-muted" />
                          </div>
                          <h5 className="fw-bold mb-2">Select an Enquiry</h5>
                          <p className="text-muted">
                            Choose a lead from the list to view details
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedLead && (
        <QuotationModal
          show={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          lead={selectedLead}
          vendorToken={vendorToken}
        />
      )}
    </div>
  );
};

export default EnquiryManagement;
