// src/pages/adminpanel/HomeAdmin.js
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Tabs,
  Tab,
  Badge,
  ProgressBar,
  Dropdown,
  Nav,
} from "react-bootstrap";
import {
  FiFilter,
  FiCalendar,
  FiEye,
  FiMail,
  FiPhone,
  FiStar,
  FiDollarSign,
  FiDownload,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiPercent,
} from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HomeAdmin = () => {
  const [dateFilter, setDateFilter] = useState("this_month");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Stats data
  const statsData = {
    leads: {
      title: "Total Leads",
      value: 142,
      change: "+12%",
      trend: "up",
      daily_avg: 4.7,
      icon: <FiUsers size={24} />,
    },
    impressions: {
      title: "Impressions",
      value: "24.8K",
      change: "+8.5%",
      trend: "up",
      daily_avg: "827",
      icon: <FiEye size={24} />,
    },
    profile_views: {
      title: "Profile Views",
      value: "1.2K",
      change: "+5.2%",
      trend: "up",
      daily_avg: "40",
      icon: <FiBarChart2 size={24} />,
    },
    conversion: {
      title: "Phone number views",
      value: "6.8%",
      change: "+1.2%",
      trend: "up",
      daily_avg: "0.23%",
      icon: <FiPercent size={24} />,
    },
  };

  // Leads data
  const leads = [
    {
      id: 1,
      name: "Sarah Johnson",
      date: "Today, 10:30 AM",
      service: "Wedding Photography",
      status: "New",
      source: "Website",
      priority: "High",
      contacted: false,
    },
    {
      id: 2,
      name: "Michael & Lisa",
      date: "Yesterday, 3:45 PM",
      service: "Full Wedding Package",
      status: "Contacted",
      source: "WeddingWire",
      priority: "Medium",
      contacted: true,
    },
    {
      id: 3,
      name: "Robert Chen",
      date: "Oct 12, 2023",
      service: "Videography",
      status: "Follow Up",
      source: "Website",
      priority: "High",
      contacted: true,
    },
    {
      id: 4,
      name: "Jennifer Lopez",
      date: "Oct 11, 2023",
      service: "Bridal Makeup",
      status: "New",
      source: "WeddingWire",
      priority: "Low",
      contacted: false,
    },
    {
      id: 5,
      name: "David Wilson",
      date: "Oct 10, 2023",
      service: "Wedding Photography",
      status: "Converted",
      source: "Google",
      priority: "High",
      contacted: true,
    },
    {
      id: 6,
      name: "Amanda Smith",
      date: "Oct 9, 2023",
      service: "Full Wedding Package",
      status: "Lost",
      source: "WeddingWire",
      priority: "Medium",
      contacted: true,
    },
  ];

  // Sort leads
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Chart data
  const leadsChartData = {
    labels: [
      "1 Oct",
      "5 Oct",
      "10 Oct",
      "15 Oct",
      "20 Oct",
      "25 Oct",
      "30 Oct",
    ],
    datasets: [
      {
        label: "Leads",
        data: [8, 12, 6, 14, 10, 16, 12],
        borderColor: "#8e44ad",
        backgroundColor: "rgba(142, 68, 173, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Impressions",
        data: [1200, 1800, 1500, 2200, 1900, 2500, 2100],
        borderColor: "#e67e22",
        backgroundColor: "rgba(230, 126, 34, 0.2)",
        tension: 0.3,
        yAxisID: "y1",
        fill: true,
      },
    ],
  };

  const sourcesChartData = {
    labels: ["WeddingWire", "Website", "Google", "Social Media", "Referrals"],
    datasets: [
      {
        label: "Leads by Source",
        data: [42, 28, 18, 8, 4],
        backgroundColor: [
          "#8e44ad",
          "#3498db",
          "#2ecc71",
          "#f1c40f",
          "#e74c3c",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const leadsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Leads",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Impressions",
        },
      },
    },
  };

  const sourcesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Container className="leads-dashboard-page">
      <div className="page-header mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start gap-3">
          <div>
            <h2 className="page-title">Leads Dashboard</h2>
            <p className="text-muted mb-0">
              Track your business growth and engagement
            </p>
          </div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                className="d-flex align-items-center"
              >
                <FiCalendar className="me-2" />
                {dateFilter === "this_week"
                  ? "This Week"
                  : dateFilter === "this_month"
                  ? "This Month"
                  : dateFilter === "last_month"
                  ? "Last Month"
                  : "Custom Range"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setDateFilter("this_week")}>
                  This Week
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("this_month")}>
                  This Month
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("last_month")}>
                  Last Month
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("custom")}>
                  Custom Range
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="outline-primary"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FiFilter className="me-1" /> Filters
            </Button>
            <Button variant="primary">
              <FiDownload className="me-1" /> Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {Object.entries(statsData).map(([key, data]) => (
          <Col xl={3} md={6} key={key} className="mb-4">
            <Card className="stat-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-uppercase text-muted mb-1">
                      {data.title}
                    </h6>
                    <h3 className="mb-0">{data.value}</h3>
                  </div>
                  <div
                    className={`icon-circle bg-${
                      data.trend === "up" ? "success" : "danger"
                    }-light`}
                  >
                    {data.icon}
                  </div>
                </div>
                <p className="mt-3 mb-0">
                  {/* <span
                    className={`text-${
                      data.trend === "up" ? "success" : "danger"
                    } me-2`}
                  >
                    <span>{data.trend === "up" ? "+" : "-"}</span>
                    {data.change}
                  </span> */}
                </p>
                <p className="text-muted mb-0 mt-1">
                  <small>Daily avg: {data.daily_avg}</small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Card.Title className="mb-0">
                  Leads & Impressions Overview
                </Card.Title>
                <div className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm">
                    Leads
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Impressions
                  </Button>
                  <Button variant="primary" size="sm">
                    Both
                  </Button>
                </div>
              </div>
              <div style={{ height: "300px" }}>
                <Line data={leadsChartData} options={leadsChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Leads by Source</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar data={sourcesChartData} options={sourcesChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leads Table */}
      {/* <Card>
      {/* {/* <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Card.Title className="mb-0">Recent Leads</Card.Title>
            <div className="d-flex gap-2">
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search leads..."
                  className="ps-5"
                />
                <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              </div>
              <Button variant="outline-primary">
                <FiFilter className="me-1" /> Filter
              </Button>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="leads" title="All Leads" />
            <Tab eventKey="new" title="New" />
            <Tab eventKey="contacted" title="Contacted" />
            <Tab eventKey="converted" title="Converted" />
          </Tabs>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => requestSort("name")}
                    >
                      Lead Name{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none"
                      onClick={() => requestSort("date")}
                    >
                      Date{" "}
                      {sortConfig.key === "date" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </Button>
                  </th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar me-3">{lead.name.charAt(0)}</div>
                        <div>
                          <div className="fw-medium">{lead.name}</div>
                          <div className="text-muted small">{lead.source}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-muted small">{lead.date}</div>
                    </td>
                    <td>{lead.service}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>
                      <Badge bg="light" text="dark" className="text-uppercase">
                        {lead.source}
                      </Badge>
                    </td>
                    <td>
                      <PriorityBadge priority={lead.priority} />
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button variant="light" size="sm">
                          <FiEye />
                        </Button>
                        <Button
                          variant={
                            lead.contacted
                              ? "outline-success"
                              : "outline-primary"
                          }
                          size="sm"
                        >
                          {lead.contacted ? <FiPhone /> : <FiMail />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted">Showing 1 to 6 of 42 entries</div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                Previous
              </Button>
              <Button variant="primary" size="sm">
                1
              </Button>
              <Button variant="outline-secondary" size="sm">
                2
              </Button>
              <Button variant="outline-secondary" size="sm">
                3
              </Button>
              <Button variant="outline-secondary" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card> */}

      {/* Phone number views */}
      <Card className="mt-4">
        <Card.Body>
          <Card.Title className="mb-4">Lead Phone number views</Card.Title>
          <Row>
            <Col md={3} className="text-center mb-4 mb-md-0">
              <div className="display-4 fw-bold text-primary">6.8%</div>
              <div className="text-muted">Overall Phone number views</div>
            </Col>
            <Col md={9}>
              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">New Leads</div>
                <div className="fw-medium">42%</div>
              </div>
              <ProgressBar variant="primary" now={42} className="mb-3" />

              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Contacted</div>
                <div className="fw-medium">28%</div>
              </div>
              <ProgressBar variant="info" now={28} className="mb-3" />

              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Follow Up</div>
                <div className="fw-medium">18%</div>
              </div>
              <ProgressBar variant="warning" now={18} className="mb-3" />

              <div className="d-flex justify-content-between mb-2">
                <div className="text-muted">Converted</div>
                <div className="fw-medium">12%</div>
              </div>
              <ProgressBar variant="success" now={12} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default HomeAdmin;
