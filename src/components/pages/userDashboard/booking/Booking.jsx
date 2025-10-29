import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Spinner, Dropdown, Badge } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";

const Booking = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        console.warn("No token found, redirecting...");
        window.location.href = "/customer-login";
        return;
      }

      try {
        const res = await axios.get(
          "https://happywedz.com/api/request-pricing/user/quotations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setBookings(res.data.quotations);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const handleActionChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, localStatus: newStatus } : b))
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "replied":
        return <FaCheckCircle />;
      case "pending":
        return <FaClock />;
      default:
        return <FaTimesCircle />;
    }
  };

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="user-booking-container">
      <div className="user-booking-header">
        <div className="user-booking-header-content">
          <div className="user-booking-title-section">
            <h1 className="user-booking-main-title">My Bookings</h1>
            <p className="user-booking-subtitle">
              Manage and track all your service bookings
            </p>
          </div>

          <div className="user-booking-filter-section">
            <div className="user-booking-filter-tabs">
              <button
                className={`user-booking-filter-tab ${
                  filterStatus === "all" ? "active" : ""
                }`}
                onClick={() => setFilterStatus("all")}
              >
                All ({bookings.length})
              </button>
              <button
                className={`user-booking-filter-tab ${
                  filterStatus === "replied" ? "active" : ""
                }`}
                onClick={() => setFilterStatus("replied")}
              >
                Replied ({bookings.filter((b) => b.status === "replied").length}
                )
              </button>
              <button
                className={`user-booking-filter-tab ${
                  filterStatus === "pending" ? "active" : ""
                }`}
                onClick={() => setFilterStatus("pending")}
              >
                Pending ({bookings.filter((b) => b.status === "pending").length}
                )
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="user-booking-loading">
          <Spinner animation="border" className="user-booking-spinner" />
          <p className="user-booking-loading-text">Loading your bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="user-booking-empty">
          <div className="user-booking-empty-icon">
            <CiBookmarkCheck />
          </div>
          <h3 className="user-booking-empty-title">No Bookings Found</h3>
          <p className="user-booking-empty-text">
            {filterStatus === "all"
              ? "You haven't made any bookings yet. Start exploring services!"
              : `No ${filterStatus} bookings at the moment.`}
          </p>
        </div>
      ) : (
        <div className="user-booking-grid-container">
          <Row className="g-4">
            {filteredBookings.map((item) => (
              <Col md={6} xl={4} key={item.id}>
                <Card className="user-booking-card">
                  <div className="user-booking-card-image-wrapper">
                    <img
                      src={
                        item.vendor?.profileImage || "/images/imageNotFound.jpg"
                      }
                      alt={item.vendor?.businessName}
                      className="user-booking-card-image"
                    />
                    <div className="user-booking-image-overlay"></div>
                    <Badge
                      bg="none"
                      className={`user-booking-status-badge user-booking-status-${item.status}`}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ms-1">{item.status}</span>
                    </Badge>
                  </div>

                  <Card.Body className="user-booking-card-body">
                    <div className="user-booking-vendor-section">
                      <h3 className="user-booking-vendor-name">
                        {item.vendor?.businessName || "Unknown Vendor"}
                      </h3>
                      <p className="user-booking-vendor-location">
                        <FaMapMarkerAlt />
                        <span>
                          {item.vendor?.city || "Unknown"}, {item.vendor?.state}
                        </span>
                      </p>
                    </div>

                    <div className="user-booking-info-section">
                      <h4 className="user-booking-section-title">
                        Booking Details
                      </h4>
                      <div className="user-booking-info-grid">
                        <div className="user-booking-info-item">
                          <FaUser className="user-booking-info-icon" />
                          <span className="user-booking-info-text">
                            {item.firstName} {item.lastName}
                          </span>
                        </div>
                        <div className="user-booking-info-item">
                          <FaEnvelope className="user-booking-info-icon" />
                          <span className="user-booking-info-text">
                            {item.email}
                          </span>
                        </div>
                        <div className="user-booking-info-item">
                          <FaPhone className="user-booking-info-icon" />
                          <span className="user-booking-info-text">
                            {item.phone}
                          </span>
                        </div>
                        <div className="user-booking-info-item">
                          <FaCalendarAlt className="user-booking-info-icon" />
                          <span className="user-booking-info-text">
                            <strong>{item.eventDate}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="user-booking-quote-section">
                      <h4 className="user-booking-section-title">
                        Quotation Details
                      </h4>
                      <div className="user-booking-quote-card">
                        <div className="user-booking-quote-item">
                          <span className="user-booking-quote-label">
                            Quote Price
                          </span>
                          <span className="user-booking-quote-value user-booking-quote-price">
                            {item.quote?.price
                              ? `₹ ${item.quote.price}`
                              : "Not provided"}
                          </span>
                        </div>
                        <div className="user-booking-quote-item">
                          <span className="user-booking-quote-label">
                            Valid Till
                          </span>
                          <span className="user-booking-quote-value">
                            {item.quote?.validTill || "N/A"}
                          </span>
                        </div>
                        {item.quote?.message && (
                          <div className="user-booking-quote-message">
                            <span className="user-booking-quote-label">
                              Message
                            </span>
                            <p className="user-booking-quote-message-text">
                              {item.quote.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="user-booking-actions">
                      <div className="user-booking-service-badge">
                        <CiBookmarkCheck />
                        <span>Service Booked</span>
                      </div>
                      <Dropdown
                        onSelect={(key) => handleActionChange(item.id, key)}
                      >
                        <Dropdown.Toggle className="user-booking-action-dropdown text-white">
                          {item.localStatus || "Update Status"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="user-booking-dropdown-menu">
                          <Dropdown.Item eventKey="Booked">
                            Booked
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="Pending">
                            Pending
                          </Dropdown.Item>
                          <Dropdown.Item eventKey="Discussed">
                            Discussed
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default Booking;
