import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "../../layouts/toasts/Toast";
import Swal from "sweetalert2";
import QuotationModal from "./QuotationModal";
import axiosInstance from "../../../services/api/axiosInstance";

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
    // Read possible date filter from query params (passed from HomeAdmin)
    const location = window.location; // fallback
    try {
      // prefer react-router location if available
    } catch {}

    const params = new URLSearchParams(window.location.search);
    const dateFilterParam = params.get("dateFilter");
    const customStartParam = params.get("customStart");
    const customEndParam = params.get("customEnd");

    const computeRange = () => {
      const now = new Date();
      let start = null;
      let end = null;

      if (dateFilterParam === "this_week") {
        const day = now.getDay();
        const diff = day === 0 ? 6 : day - 1;
        start = new Date(now);
        start.setDate(now.getDate() - diff);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
      } else if (dateFilterParam === "this_month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
      } else if (dateFilterParam === "last_month") {
        const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthEnd = new Date(firstOfThisMonth.getTime() - 1);
        start = new Date(
          lastMonthEnd.getFullYear(),
          lastMonthEnd.getMonth(),
          1
        );
        start.setHours(0, 0, 0, 0);
        end = new Date(
          lastMonthEnd.getFullYear(),
          lastMonthEnd.getMonth(),
          lastMonthEnd.getDate()
        );
        end.setHours(23, 59, 59, 999);
      } else if (
        dateFilterParam === "custom" &&
        customStartParam &&
        customEndParam
      ) {
        start = new Date(customStartParam);
        start.setHours(0, 0, 0, 0);
        end = new Date(customEndParam);
        end.setHours(23, 59, 59, 999);
      }

      return { start, end };
    };

    const getRowDateValue = (row) => {
      return (
        row.createdAt ||
        row.created_at ||
        row.eventDate ||
        row.event_date ||
        row.date ||
        row.addedAt ||
        null
      );
    };

    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          "/request-pricing/vendor/dashboard",
          {
            headers: { Authorization: `Bearer ${vendorToken}` },
          }
        );

        const data = response.data || {};
        let items = [];
        if (data && Array.isArray(data.requests)) {
          items = data.requests;
        } else if (data && Array.isArray(data.leads)) {
          items = data.leads;
        } else if (data && Array.isArray(data.data)) {
          items = data.data;
        } else if (Array.isArray(data)) {
          items = data;
        }

        // Apply date filtering if a dateFilter param was provided
        const { start, end } = computeRange();
        if (start && end) {
          const filtered = items.filter((r) => {
            const dVal = getRowDateValue(r);
            if (!dVal) return false;
            const t = new Date(dVal).getTime();
            return t >= start.getTime() && t <= end.getTime();
          });
          setRows(filtered);
        } else {
          setRows(items);
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
  return (
    <div className="container my-5">
      <div className="d-flex align-items-center mb-3 gap-2 justify-content-end flex-wrap">
        <button
          type="button"
          className="btn btn-outline-primary col-12 col-sm-4 col-md-2"
          onClick={exportToCSV}
          disabled={exporting || rows.length === 0}
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>

        <button
          type="button"
          className="btn btn-outline-success col-12 col-sm-4 col-md-2"
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
