import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToast } from "../../layouts/toasts/Toast";
import Swal from "sweetalert2";
import QuotationModal from "./QuotationModal";

const API_BASE_URL = "https://happywedz.com";

export default function VendorLeadsPage() {
  const [rows, setRows] = useState([]);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
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

  // QuotationModal manages its own scroll lock

  const openModal = (row) => {
    // Map VendorLeads row to the structure expected by QuotationModal
    // QuotationModal expects: lead.request.id and lead.request.user.id
    const mapped = {
      id: row.id,
      request: {
        id: row.id,
        user: { id: row.userId },
      },
    };
    setSelectedLead(mapped);
    setShowQuoteModal(true);
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

  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedLead(null);
  };

  // Form handling moved to QuotationModal

  // Submission handled by QuotationModal

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

      {selectedLead && (
        <QuotationModal
          show={showQuoteModal}
          onClose={closeQuoteModal}
          lead={selectedLead}
          vendorToken={vendorToken}
        />
      )}
    </div>
  );
}
