// src/pages/adminpanel/HomeAdmin.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
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

const API_BASE_URL = "https://happywedz.com";

const HomeAdmin = () => {
  const [dateFilter, setDateFilter] = useState("this_month");
  const [showFilter, setShowFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("leads");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [leadCount, setLeadCount] = useState(0);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [stats, setStats] = useState({
    impressions: 0,
    profileViews: 0,
    chartData: { labels: [], leads: [], impressions: [] },
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const { token: vendorToken } = useSelector((state) => state.vendorAuth || {});

  useEffect(() => {
    if (!vendorToken) {
      setLoadingLeads(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoadingLeads(true);
        setLoadingStats(true); // We'll load stats and leads together

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
        const leads = data?.requests || [];

        // 1. Set total lead count
        setLeadCount(data?.count ?? leads.length);

        // 2. Process leads for the chart
        const leadsByDate = leads.reduce((acc, lead) => {
          const date = new Date(lead.createdAt).toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        // Create labels for the last 30 days
        const labels = [];
        for (let i = 29; i >= 0; i--) {
          labels.push(
            new Date(Date.now() - i * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          );
        }

        const leadChartValues = labels.map((label) => leadsByDate[label] || 0);

        // 3. Update stats state with new chart data
        setStats((prev) => ({
          ...prev, // Keep existing impressions/views if they come from another API
          chartData: {
            labels: labels.map((d) =>
              new Date(d).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            ),
            leads: leadChartValues,
            impressions: prev.chartData.impressions, // Preserve impressions data
          },
        }));
      } catch (err) {
        console.error("Error fetching leads count:", err);
        setLeadCount(0); // Set to 0 on error
      } finally {
        setLoadingLeads(false);
      }
    };

    fetchDashboardData();
    // You can keep the separate fetchStats call if it provides different data like impressions.
    // For this example, I've integrated leads data processing into one call.
    // fetchStats();
  }, [vendorToken]);

  // Stats data
  const statsData = {
    leads: {
      title: "Total Leads",
      value: loadingLeads ? "..." : leadCount,
      change: "+12%",
      trend: "up",
      // daily_avg: 4.7,
      icon: <FiUsers size={24} />,
    },
    impressions: {
      title: "Impressions",
      value: loadingStats ? "..." : stats.impressions.toLocaleString(),
      change: "+8.5%",
      trend: "up",
      // daily_avg: "827",
      icon: <FiEye size={24} />,
    },
    profile_views: {
      title: "Profile Views",
      value: loadingStats ? "..." : stats.profileViews.toLocaleString(),
      change: "+5.2%",
      trend: "up",
      // daily_avg: "40",
      icon: <FiBarChart2 size={24} />,
    },
    conversion: {
      title: "Phone number views",
      // value: "6.8%",
      change: "+1.2%",
      trend: "up",
      // daily_avg: "0.23%",
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
    labels: stats.chartData.labels,
    datasets: [
      {
        label: "Leads",
        data: stats.chartData.leads,
        borderColor: "#8e44ad",
        backgroundColor: "rgba(142, 68, 173, 0.2)",
        tension: 0.3,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Impressions",
        data: stats.chartData.impressions,
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
        {Object.entries(statsData).map(([key, data]) => {
          const cardContent = (
            <Card className="stat-card h-100">
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
                <p className="text-muted mb-0 mt-3">
                  <small>Daily avg: {data.daily_avg}</small>
                </p>
              </Card.Body>
            </Card>
          );

          return (
            <Col xl={3} md={6} key={key} className="mb-4">
              {key === "leads" ? (
                <Link
                  to="/vendor-dashboard/total-leads"
                  style={{ textDecoration: "none" }}
                >
                  {cardContent}
                </Link>
              ) : (
                cardContent
              )}
            </Col>
          );
        })}
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={12} className="mb-4 mb-lg-0">
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
      </Row>
    </Container>
  );
};

export default HomeAdmin;
