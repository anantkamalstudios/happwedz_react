import React, { useState } from "react";
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

const EnquiryManagement = () => {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");

  const folders = [
    { id: "inbox", name: "Inbox", count: 0, icon: Inbox, color: "primary" },
    { id: "unread", name: "Unread", count: 0, icon: Mail, color: "warning" },
    { id: "read", name: "Read", count: 0, icon: MailOpen, color: "success" },
    {
      id: "archived",
      name: "Archived",
      count: 0,
      icon: Archive,
      color: "secondary",
    },
    { id: "pending", name: "Pending", count: 0, icon: Clock, color: "info" },
    {
      id: "replied",
      name: "Replied",
      count: 0,
      icon: MessageCircleReply,
      color: "success",
    },
    {
      id: "booked",
      name: "Booked",
      count: 0,
      icon: Calendar,
      color: "primary",
    },
    {
      id: "discarded",
      name: "Discarded",
      count: 0,
      icon: Trash2,
      color: "danger",
    },
  ];

  const tools = [
    { id: "settings", name: "Settings", icon: Settings, color: "dark" },
    { id: "templates", name: "Templates", icon: FileText, color: "info" },
    {
      id: "premium",
      name: "PREMIUM",
      icon: Crown,
      color: "warning",
      premium: true,
    },
    { id: "export", name: "Export leads", icon: Download, color: "success" },
  ];

  const stats = {
    replied: 0,
    booked: 0,
    discarded: 0,
    avgResponseTime: "-- : --",
  };

  return (
    <div className="enquiry-management-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="main-card">
              <div className="row g-0">
                {/* Sidebar */}
                <div className="col-md-2">
                  <div className="sidebar">
                    <div className="sidebar-header">
                      <div className="d-flex align-items-center">
                        <Inbox className="me-2" size={20} />
                        Enquiry Management
                      </div>
                    </div>

                    {/* Folders Section */}
                    <div className="folder-section">
                      <div className="section-title">Folders</div>
                      {folders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`folder-item ${
                            activeFolder === folder.id ? "active" : ""
                          }`}
                          onClick={() => setActiveFolder(folder.id)}
                        >
                          <folder.icon className="folder-icon" />
                          <span className="folder-name">{folder.name}</span>
                          <span className="folder-count">{folder.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tools Section */}
                    {/* <div className="tools-section">
                      <div className="section-title">Tools</div>
                      {tools.map((tool) => (
                        <div
                          key={tool.id}
                          className={`tool-item ${
                            tool.premium ? "premium pulse" : ""
                          }`}
                        >
                          <tool.icon className="folder-icon" />
                          <span className="folder-name">{tool.name}</span>
                          {tool.premium && (
                            <Star size={16} className="ms-auto" />
                          )}
                        </div>
                      ))}
                    </div> */}
                  </div>
                </div>

                {/* Main Content */}
                <div className="col-md-10">
                  <div className="main-content">
                    {/* Header with Search */}
                    <div className="content-header">
                      <div className="row align-items-center">
                        <div className="col-md-12">
                          <div className="search-bar">
                            <input
                              type="text"
                              className="form-control search-input"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              style={{ padding: "10px 10px" }}
                            />
                            <Search className="search-icon" size={18} />
                          </div>
                        </div>
                        {/* <div className="col-md-4 text-end">
                          <button className="filter-button">
                            <Filter size={16} className="me-2" />
                            Filters
                          </button>
                        </div> */}
                      </div>
                    </div>

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

                      <div className="empty-state">
                        <Mail className="empty-icon" />
                        <div className="empty-title">No messages found</div>
                        <div className="empty-message">
                          No messages have been found in this folder.
                          <br />
                          New enquiries will appear here when they arrive.
                        </div>
                      </div>
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
