import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const API_BASE_URL = "https://happywedz.com";

export default function VendorLeadsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    service: "",
    date: "",
    message: "",
  });
  const { token: vendorToken } = useSelector((state) => state.vendorAuth);

  useEffect(() => {
    if (!vendorToken) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      setRows([]);
      return;
    }

    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/request-pricing/all`,
          {
            headers: { Authorization: `Bearer ${vendorToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch leads.");

        const data = await response.json();
        // Check for a 'leads' property in the response object first.
        if (data && Array.isArray(data.leads)) {
          setRows(data.leads);
        } else if (data && Array.isArray(data.data)) {
          // Fallback for { data: [...] }
          setRows(data.data);
        } else if (Array.isArray(data)) {
          // Fallback for a direct array [...]
          setRows(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [vendorToken]);

  // prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const openModal = (row) => {
    setActiveRow(row);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveRow(null);
    setFormData({ price: "", service: "", date: "", message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeRow) return;

    setSubmitting(true);
    setError(null);

    try {
      if (!vendorToken) throw new Error("Authentication token not found.");

      const payload = {
        price: formData.price,
        services: formData.service,
        validTill: formData.date,
        message: formData.message,
      };

      const response = await fetch(
        `${API_BASE_URL}/api-main/request-pricing/requests/${activeRow.id}/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${vendorToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send quotation.");
      }

      alert(result.message || "Quotation sent successfully!");
      closeModal();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="table-responsive shadow-sm bg-white rounded">
        <table className="table align-middle mb-0">
          <thead>
            <tr className="table-header">
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Event Date</th>
              <th>Message</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="6" className="text-center text-danger py-4">
                  Error: {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{`${row.firstName || ""} ${row.lastName || ""}`}</td>
                  <td>{row.email}</td>
                  <td>{row.phone}</td>
                  <td>{new Date(row.eventDate).toLocaleDateString()}</td>
                  <td className="text-wrap" style={{ maxWidth: 240 }}>
                    {row.message}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-pink"
                      onClick={() => openModal(row)}
                    >
                      Send quotation
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && !error && rows.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  You have no new leads.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* React-controlled modal */}
      {showModal && (
        <>
          <div className="custom-backdrop" onClick={closeModal}></div>

          <div className="custom-modal" role="dialog" aria-modal="true">
            <div
              className="modal-content custom-modal-card"
              style={{ borderRadius: "15px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header custom-modal-header">
                <div className="text-center w-100 mb-4">
                  <h5 className="modal-title mb-0 text-danger">Quotations</h5>
                  <small className="text-light d-block text-dark">
                    Fill up details
                  </small>
                </div>
                <button
                  type="button"
                  className="close-circle"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      type="number"
                      className="form-control"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Services</label>
                    <input
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      placeholder="Service Name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Valid Till Date</label>
                    <input
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      type="date"
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control"
                      rows="5"
                      maxLength="2000"
                      placeholder="Your Message"
                    />
                    <div className="form-text text-end">
                      Max. 2000 characters
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-3">
                  <button
                    type="submit"
                    className="btn btn-pink w-100"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
