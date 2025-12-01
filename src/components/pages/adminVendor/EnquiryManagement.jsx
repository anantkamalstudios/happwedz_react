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
  SearchIcon,
} from "lucide-react";

import { useSelector } from "react-redux";
import QuotationModal from "./QuotationModal";
import { useToast } from "../../layouts/toasts/Toast";
import axios from "axios";

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
  const [searchMail, setSearchEmail] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);

  // Global stats across all enquiries (not affected by current filter)
  const [globalStats, setGlobalStats] = useState({
    pending: 0,
    booked: 0,
    declined: 0,
  });
  // Filtered stats (optional, not shown in the header cards anymore)
  const [stats, setStats] = useState({ pending: 0, booked: 0, declined: 0 });

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

      // Update stats for the current filtered view (not shown in header cards)
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

  // Fetch global stats regardless of the active filter
  const fetchGlobalStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/inbox`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch global stats");
      const data = await res.json();
      const allLeads = Array.isArray(data.inbox) ? data.inbox : [];
      setGlobalStats({
        booked: allLeads.filter((l) => l.request?.status === "booked").length,
        declined: allLeads.filter((l) => l.request?.status === "declined")
          .length,
        pending: allLeads.filter((l) => l.request?.status === "pending").length,
      });
    } catch (_) {}
  };

  const handleSearchMail = (e) => {
    const searchValue = e.target.value;
    setSearchEmail(searchValue);

    if (!searchValue.trim()) {
      setFilteredLeads(leads);
      return;
    }

    const filtered = leads.filter(
      (lead) =>
        lead.request?.user?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        lead.request?.user?.email
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        lead.request?.service?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
    );

    setFilteredLeads(filtered);
  };

  useEffect(() => {
    if (vendorToken) {
      fetchInbox();
    }
  }, [vendorToken, filter]);

  // Load global stats on login/token change
  useEffect(() => {
    if (vendorToken) {
      fetchGlobalStats();
    }
  }, [vendorToken]);

  useEffect(() => {
    setFilteredLeads(leads);
  }, [leads]);

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
      } else if (isArchiveAction) {
        url = `${API_BASE_URL}/inbox/${inboxId}/archive`;
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
          const updatedLead = { ...l };
          if (isReadAction) updatedLead.isRead = true;
          if (isArchiveAction) updatedLead.isArchived = action === "archive";
          if (isStatusAction) {
            updatedLead.request = { ...updatedLead.request, status: action };
          }
          return updatedLead;
        })
      );

      setSelectedLead((prev) => {
        if (!prev || prev.id !== inboxId) return prev;
        const next = { ...prev };
        if (isReadAction) next.isRead = true;
        if (isArchiveAction) next.isArchived = action === "archive";
        if (isStatusAction) {
          next.request = { ...next.request, status: action };
        }
        return next;
      });

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

      fetchInbox();
    } catch (err) {
      console.error(`Error on action '${action}':`, err);
      setError(err.message);
    }
  };

  const handleDeleteEmail = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/inbox/${id}`, {
        headers: { Authorization: `Bearer ${vendorToken} ` },
      });
      fetchInbox();
    } catch (e) {
      console.log(e);
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
      // {
      //   id: "read",
      //   name: "Read",
      //   count: counts.read,
      //   icon: <MailOpen size={18} />,
      // },
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
                <h4 className="text-dark mb-1 fw-bold">Enquiry Management</h4>
                <p className="text-muted mb-0 f-14">
                  Manage your wedding enquiries efficiently
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4 lw-stats-row">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="lw-stats-card lw-stats-pending">
              <div className="lw-stats-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 small text-muted">Pending</p>
                    <h3 className="mb-0 fw-bold">{globalStats.pending}</h3>
                  </div>
                  <div className="lw-stats-icon">
                    <MessageCircleReply size={22} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted d-flex align-items-center gap-1">
                    <TrendingUp size={12} /> This month
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="lw-stats-card lw-stats-booked">
              <div className="lw-stats-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 small text-muted">Booked</p>
                    <h3 className="mb-0 fw-bold">{globalStats.booked}</h3>
                  </div>
                  <div className="lw-stats-icon">
                    <Calendar size={22} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted d-flex align-items-center gap-1">
                    <TrendingUp size={12} /> This month
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-3">
            <div className="lw-stats-card lw-stats-declined">
              <div className="lw-stats-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-1 small text-muted">Declined</p>
                    <h3 className="mb-0 fw-bold">{globalStats.declined}</h3>
                  </div>
                  <div className="lw-stats-icon">
                    <Archive size={22} />
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted d-flex align-items-center gap-1">
                    <TrendingUp size={12} /> This month
                  </small>
                </div>
              </div>
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
                            filter === folder.id ? "text-dark" : "text-dark"
                          }`}
                          role="button"
                          onClick={() => setFilter(folder.id)}
                          style={{
                            borderRadius: "12px",
                            background:
                              filter === folder.id ? "" : "transparent",
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
                          maxHeight: "calc(100vh - 50px)",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }}
                      >
                        <div className="w-100 px-4">
                          <div
                            style={{
                              width: "100%",
                              border: "2px solid #d1d5db",
                              borderRadius: "20px",
                              padding: "6px 12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{ color: "#6b7280", fontSize: "18px" }}
                            >
                              <SearchIcon />
                            </span>
                            <input
                              type="text"
                              value={searchMail}
                              onChange={handleSearchMail}
                              placeholder="Search here"
                              style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                fontSize: "15px",
                              }}
                            />
                          </div>
                        </div>

                        {filteredLeads.map((lead) => {
                          const statusObj = statuses.find(
                            (s) => s.id === lead.request?.status
                          );
                          return (
                            <div
                              key={lead.id}
                              className={`lead-card card border-0 ${
                                selectedLead?.id === lead.id ? "active" : ""
                              }`}
                              role="button"
                              onClick={() => handleLeadClick(lead)}
                              style={{
                                borderLeft: `4px solid ${
                                  statusObj?.color || "#95a5a6"
                                }`,
                                background:
                                  selectedLead?.id === lead.id
                                    ? "#fafafa"
                                    : "#fff",
                              }}
                            >
                              <div className="lead-card-body">
                                <div className="lead-header">
                                  <div className="lead-avatar">
                                    {lead.request?.user?.name?.charAt(0) || "?"}
                                  </div>
                                  <div className="lead-info">
                                    <h6
                                      className={`lead-name ${
                                        !lead.isRead ? "fw-bold" : ""
                                      }`}
                                    >
                                      {lead.request?.user?.name || "No Name"}
                                    </h6>
                                    <p className="lead-email">
                                      {lead.request?.user?.email}
                                    </p>
                                  </div>
                                  {!lead.isRead && (
                                    <span className="lead-badge">New</span>
                                  )}
                                </div>

                                <p className="lead-message">
                                  {lead.request?.message || "No message"}
                                </p>

                                <div className="lead-footer">
                                  <span
                                    className="lead-status"
                                    style={{
                                      backgroundColor: `${statusObj?.color}20`,
                                      color: statusObj?.color,
                                    }}
                                  >
                                    {statusObj?.name}
                                  </span>
                                  <div className="lead-date">
                                    <Calendar size={13} className="me-1" />
                                    {new Date(
                                      lead.request?.eventDate
                                    ).toLocaleDateString("en-IN", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lead Detail */}
                <div className="col-md-5 col-lg-6 lw-panel">
                  <div className="lw-container p-4 h-100">
                    {selectedLead ? (
                      <>
                        {/* Header Section */}
                        <div className="lw-header mb-4">
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div className="lw-avatar">
                              {selectedLead.request?.user?.name?.charAt(0) ||
                                "?"}
                            </div>

                            <div className="flex-grow-1">
                              <h5 className="lw-name mb-1 fw-bold">
                                {selectedLead.request?.user?.name}
                              </h5>
                              <div className="d-flex flex-column gap-1">
                                <div className="lw-contact small">
                                  <Mail size={14} className="me-2 text-muted" />
                                  <a
                                    href={`mailto:${selectedLead.request?.user?.email}`}
                                    className="text-decoration-none text-muted"
                                  >
                                    {selectedLead.request?.user?.email}
                                  </a>
                                </div>
                                <div className="lw-contact small">
                                  <Phone
                                    size={14}
                                    className="me-2 text-muted"
                                  />
                                  <span>
                                    {selectedLead.request?.user?.phone}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-light btn-sm lw-btn-action"
                                onClick={() =>
                                  handleAction(
                                    selectedLead,
                                    selectedLead.isArchived
                                      ? "unarchive"
                                      : "archive"
                                  )
                                }
                              >
                                {selectedLead.isArchived
                                  ? "Unarchive"
                                  : "Archive"}
                              </button>
                              <button
                                className="btn btn-outline-light btn-sm lw-btn-action"
                                onClick={() =>
                                  handleDeleteEmail(selectedLead.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Meta Cards */}
                          <div className="row g-3">
                            <div className="col-6">
                              <div className="lw-card">
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
                            <div className="col-6">
                              <div className="lw-card">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                  <Clock size={16} className="text-info" />
                                  <small className="text-muted">Received</small>
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

                        {/* Status */}
                        <div className="mb-4">
                          <span
                            className="lw-status badge rounded-pill px-4 py-2"
                            style={{
                              backgroundColor: statuses.find(
                                (s) => s.id === selectedLead.request.status
                              )?.color,
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
                        <div className="lw-message mb-4">
                          <h6 className="fw-bold mb-3">Message</h6>
                          <div className="lw-card lw-msg-card">
                            <p className="mb-0">
                              {selectedLead.request.message ||
                                "No message provided."}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lw-actions">
                          <h6 className="fw-bold mb-3">Update Status</h6>
                          <div className="d-flex flex-wrap gap-2 mb-3">
                            {statuses.map((status) => (
                              <button
                                key={status.id}
                                className={`lw-status-btn btn btn-sm rounded-pill ${
                                  selectedLead.request.status === status.id
                                    ? "active"
                                    : ""
                                }`}
                                style={{
                                  "--lw-color": status.color,
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
                            className="lw-reply-btn btn text-white fw-semibold"
                            onClick={() => {
                              if (selectedLead) setShowQuoteModal(true);
                              else
                                addToast(
                                  "Please select a lead to reply to.",
                                  "warning"
                                );
                            }}
                          >
                            <MessageCircleReply size={18} className="me-2" />
                            Reply to Enquiry
                          </button>
                        </div>
                      </>
                    ) : (
                      !loading && (
                        <div className="lw-empty h-100 d-flex flex-column align-items-center justify-content-center text-center">
                          <div className="lw-empty-icon">
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
