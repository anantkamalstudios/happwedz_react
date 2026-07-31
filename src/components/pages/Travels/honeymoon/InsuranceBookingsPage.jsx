import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Shield,
  Download,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  CreditCard,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getUserInsuranceBookings,
  getInsurancePolicyPdf,
} from "../../../../services/api/insurancePaymentApi";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Booked", value: "SUCCESS" },
  { label: "Payment Pending", value: "PAYMENT_PENDING" },
  { label: "Failed", value: "BOOK_FAILED_AFTER_PAYMENT" },
];

function getStatusMeta(status) {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "SUCCESS") {
    return { label: "Booked", color: "#166534", bg: "#eafaf1" };
  }
  if (normalized === "PAYMENT_PENDING") {
    return { label: "Payment Pending", color: "#b26a00", bg: "#fff7e6" };
  }
  if (normalized === "BOOK_FAILED_AFTER_PAYMENT") {
    return { label: "Booking Failed", color: "#b91c1c", bg: "#fdecec" };
  }
  if (normalized === "FAILED") {
    return { label: "Failed", color: "#b91c1c", bg: "#fdecec" };
  }
  return { label: normalized || "PENDING", color: "#334155", bg: "#f1f5f9" };
}

function formatAmount(amount, currency = "INR") {
  const value = Number(amount || 0);
  if (!Number.isFinite(value) || value <= 0) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function InsuranceBookingsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [downloadingId, setDownloadingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getUserInsuranceBookings(statusFilter ? { status: statusFilter } : {})
      .then((response) => {
        if (!active) return;
        setBookings(
          Array.isArray(response?.bookings) ? response.bookings : [],
        );
      })
      .catch((error) => {
        console.error("Unable to load insurance bookings", error);
        if (active) setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [statusFilter, refreshKey]);

  const filteredCountLabel = useMemo(() => {
    if (!statusFilter) return `${bookings.length} bookings`;
    const selected = STATUS_OPTIONS.find((o) => o.value === statusFilter);
    return `${bookings.length} ${
      selected?.label?.toLowerCase() || "filtered"
    } bookings`;
  }, [bookings.length, statusFilter]);

  const handleDownload = async (bookingId) => {
    if (!bookingId) return;
    try {
      setDownloadingId(bookingId);
      const blob = await getInsurancePolicyPdf(bookingId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `insurance-policy-${bookingId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Policy PDF download failed", err);
      toast.error("Could not download policy PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6ebe1 0%, #fbf7f2 32%, #ffffff 100%)",
        padding: "120px 0 64px",
      }}
    >
      <Container>
        <div
          style={{
            background: "#132238",
            color: "#fff",
            borderRadius: "28px",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap">
            <div>
              <div
                style={{
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#f4c8d8",
                  fontSize: "0.82rem",
                }}
              >
                TripJack TripSafe Insurance
              </div>
              <h1
                style={{
                  margin: "0.35rem 0 0.5rem",
                  fontSize: "2.25rem",
                  lineHeight: 1.1,
                }}
              >
                My Insurance Bookings
              </h1>
              <div style={{ color: "rgba(255,255,255,0.72)" }}>
                {user?.name ? `Signed in as ${user.name} · ` : ""}
                {filteredCountLabel}
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 flex-wrap">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{
                  borderRadius: "999px",
                  padding: "0.8rem 1rem",
                  border: "none",
                  minWidth: 220,
                }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRefreshKey((c) => c + 1)}
                style={{
                  color: "#132238",
                  background: "#fff",
                  borderRadius: "999px",
                  padding: "0.8rem 1rem",
                  fontWeight: 700,
                  border: "none",
                }}
              >
                Refresh
              </button>
              <Link
                to="/honeymoon"
                style={{
                  color: "#132238",
                  background: "#fff",
                  borderRadius: "999px",
                  padding: "0.8rem 1rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Book New
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#334155", fontWeight: 600 }}>
            Loading insurance bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
              textAlign: "center",
            }}
          >
            <Shield size={36} color="#ed1173" />
            <h4 style={{ marginTop: "1rem" }}>No insurance bookings yet</h4>
            <p style={{ color: "#64748b" }}>
              Book your first travel insurance from the honeymoon hub.
            </p>
            <Link
              to="/honeymoon"
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                padding: "0.6rem 1.4rem",
                borderRadius: "999px",
                background: "#ed1173",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Explore plans
            </Link>
          </div>
        ) : (
          <div className="d-grid gap-3">
            {bookings.map((booking) => {
              const statusMeta = getStatusMeta(booking.booking_status);
              const isSuccess =
                String(booking.booking_status || "").toUpperCase() === "SUCCESS";
              const travellers = Array.isArray(booking.travellers)
                ? booking.travellers
                : [];
              const isExpanded = expandedId === booking.id;
              return (
                <div
                  key={booking.id}
                  style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "1.35rem 1.5rem",
                    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div className="d-flex justify-content-between gap-3 flex-wrap">
                    <div>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "#132238",
                        }}
                      >
                        {booking.plan_label || "Insurance Plan"}{" "}
                        {booking.coverage_amount
                          ? `· ${booking.coverage_amount}`
                          : ""}
                      </div>
                      <div style={{ color: "#64748b", marginTop: "0.25rem" }}>
                        Booking ID: {booking.tripjack_booking_id}
                      </div>
                      <div style={{ color: "#64748b", marginTop: "0.35rem" }}>
                        Travel: {formatDate(booking.start_date)} to{" "}
                        {formatDate(booking.end_date)}
                      </div>
                      <div style={{ color: "#64748b", marginTop: "0.35rem" }}>
                        Region: {booking.region_name || "—"} · Travellers:{" "}
                        {booking.traveller_count || travellers.length || 1}
                      </div>
                      {booking.primary_name && (
                        <div
                          style={{
                            color: "#475569",
                            marginTop: "0.35rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          Primary: <strong>{booking.primary_name}</strong>
                          {booking.primary_email
                            ? ` · ${booking.primary_email}`
                            : ""}
                          {booking.primary_contact
                            ? ` · ${booking.primary_contact}`
                            : ""}
                        </div>
                      )}
                      <div style={{ color: "#94a3b8", marginTop: "0.35rem" }}>
                        Booked: {formatDate(booking.created_at)}
                      </div>
                    </div>

                    <div className="text-md-end">
                      <div
                        style={{
                          fontWeight: 700,
                          color: statusMeta.color,
                          background: statusMeta.bg,
                          borderRadius: "999px",
                          padding: "0.3rem 0.7rem",
                          display: "inline-block",
                        }}
                      >
                        {statusMeta.label}
                      </div>
                      <div style={{ color: "#475569", marginTop: "0.25rem" }}>
                        Payment: {booking.payment_status || "PENDING"}
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#132238",
                          marginTop: "0.75rem",
                        }}
                      >
                        {formatAmount(booking.amount, booking.currency || "INR")}
                      </div>

                      <div className="d-flex gap-2 mt-3 flex-wrap justify-content-md-end">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : booking.id)
                          }
                          style={{
                            border: "1px solid #cbd5e1",
                            color: "#334155",
                            background: "#f8fafc",
                            borderRadius: "999px",
                            padding: "0.35rem 0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp size={14} style={{ marginRight: 4 }} />
                              Hide travellers
                            </>
                          ) : (
                            <>
                              <ChevronDown size={14} style={{ marginRight: 4 }} />
                              Travellers ({travellers.length || booking.traveller_count || 0})
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/honeymoon/insurance/booking/${booking.tripjack_booking_id}`,
                            )
                          }
                          style={{
                            border: "1px solid #132238",
                            color: "#132238",
                            background: "#fff",
                            borderRadius: "999px",
                            padding: "0.35rem 0.9rem",
                            fontWeight: 600,
                          }}
                        >
                          <FileText size={14} style={{ marginRight: 4 }} />
                          View Details
                        </button>
                        {isSuccess && (
                          <button
                            type="button"
                            disabled={downloadingId === booking.tripjack_booking_id}
                            onClick={() =>
                              handleDownload(booking.tripjack_booking_id)
                            }
                            style={{
                              border: "1px solid #ed1173",
                              color: "#fff",
                              background: "#ed1173",
                              borderRadius: "999px",
                              padding: "0.35rem 0.9rem",
                              fontWeight: 600,
                            }}
                          >
                            {downloadingId === booking.tripjack_booking_id ? (
                              <>
                                <Loader2
                                  size={14}
                                  className="spin"
                                  style={{ marginRight: 4 }}
                                />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <Download
                                  size={14}
                                  style={{ marginRight: 4 }}
                                />
                                Download PDF
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        marginTop: "1.25rem",
                        borderTop: "1px dashed #e2e8f0",
                        paddingTop: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#132238",
                          marginBottom: "0.6rem",
                        }}
                      >
                        Filled traveller details
                      </div>
                      {travellers.length === 0 ? (
                        <div style={{ color: "#94a3b8" }}>
                          Traveller information unavailable.
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "0.75rem",
                          }}
                        >
                          {travellers.map((t, idx) => (
                            <div
                              key={t.id || idx}
                              style={{
                                border: "1px solid #f1f5f9",
                                borderRadius: "16px",
                                padding: "0.9rem 1rem",
                                background: "#fbfbfd",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 700,
                                  color: "#0f172a",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {idx + 1}. {t.fullName}
                              </div>
                              <div
                                style={{
                                  color: "#64748b",
                                  fontSize: "0.85rem",
                                  marginBottom: "0.4rem",
                                }}
                              >
                                {t.age ? `${t.age} yrs` : ""}
                                {t.gender ? ` · ${t.gender}` : ""}
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gap: "0.3rem",
                                  fontSize: "0.85rem",
                                  color: "#334155",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                  }}
                                >
                                  <CreditCard size={13} />
                                  Passport: <strong>{t.passport}</strong>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                  }}
                                >
                                  <Mail size={13} />
                                  {t.email}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                  }}
                                >
                                  <Phone size={13} />
                                  {t.mobile}
                                </div>
                                <div style={{ color: "#64748b" }}>
                                  Pincode: {t.pincode}
                                </div>
                                <div style={{ color: "#64748b" }}>
                                  Nominee: {t.nomineeName} ({t.nomineeRelation})
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
