import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToast } from "../../layouts/toasts/Toast";
import Swal from "sweetalert2";

const API_BASE_URL = "https://happywedz.com";

export default function VendorLeadsPage() {
  const [rows, setRows] = useState([]);
  const [exporting, setExporting] = useState(false);
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
  const { addToast } = useToast();

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
          `${API_BASE_URL}/api/request-pricing/vendor/dashboard`,
          {
            headers: { Authorization: `Bearer ${vendorToken}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch leads.");

        const data = await response.json();
        // Check for a 'leads' property in the response object first.
        if (data && Array.isArray(data.requests)) {
          setRows(data.requests);
        } else if (data && Array.isArray(data.leads)) {
          setRows(data.leads); // Keep old fallbacks just in case
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

  const exportToCSV = () => {
    if (!rows || rows.length === 0) {
      addToast("No leads to export", "error");
      return;
    }
    setExporting(true);
    try {
      const headers = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "eventDate",
        "message",
      ];
      const csvRows = [headers.join(",")];
      for (const r of rows) {
        const vals = headers.map((h) => {
          const v = r[h] ?? "";
          // Escape quotes and wrap in quotes if necessary
          const s = String(v).replace(/"/g, '""');
          return s.includes(",") || s.includes("\n") ? `"${s}"` : s;
        });
        csvRows.push(vals.join(","));
      }
      const csvString = csvRows.join("\r\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `leads-${ts}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      addToast(`Exported ${rows.length} leads as CSV`, "success");
    } catch (err) {
      console.error("CSV export error:", err);
      addToast(`Export failed: ${err?.message || err}`, "error");
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async () => {
    if (!rows || rows.length === 0) {
      addToast("No leads to export", "error");
      return;
    }
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Event Date",
        "Message",
      ];
      // map rows to objects with readable headers
      const data = rows.map((r) => ({
        [headers[0]]: r.firstName || "",
        [headers[1]]: r.lastName || "",
        [headers[2]]: r.email || "",
        [headers[3]]: r.phone || "",
        [headers[4]]: r.eventDate || "",
        [headers[5]]: r.message || "",
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Leads");
      const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      // writeFile will trigger a download in browser
      XLSX.writeFile(wb, `leads-${ts}.xlsx`);
      addToast(`Exported ${rows.length} leads as Excel`, "success");
    } catch (err) {
      console.error("Excel export error:", err);
      addToast(`Excel export failed: ${err?.message || err}`, "error");
    } finally {
      setExporting(false);
    }
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
        userId: activeRow.userId,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/request-pricing/requests/${activeRow.id}/quotation`,
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
      addToast("Quotation sent successfully!", "success");

      // alert(result.message || "Quotation sent successfully!");
      closeModal();
    } catch (err) {
      // alert(`Error: ${err.message}`);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error: ${err.message}`,
        confirmButtonText: "OK",
        confirmButtonColor: "#ed1173",
        timer: "3000",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex align-items-center mb-3 gap-2 justify-content-end">
        <button
          type="button"
          className="btn btn-outline-primary col-2"
          onClick={exportToCSV}
          disabled={exporting || rows.length === 0}
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>

        <button
          type="button"
          className="btn btn-outline-success col-2"
          onClick={exportToExcel}
          disabled={exporting || rows.length === 0}
        >
          {exporting ? "Exporting..." : "Export Excel"}
        </button>
      </div>
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
                      className="btn btn-pink text-white"
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
