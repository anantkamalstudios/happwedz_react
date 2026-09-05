import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import CenteredModal from "../../../ui/CenteredModal";

/**
 * Views a subscription invoice and offers it as a download.
 *
 * The PDF is fetched as a Blob rather than linked to directly: the endpoint is
 * authenticated, and a plain link or window.open would send the request without the
 * bearer token and come back as a 401 page inside the viewer.
 *
 * @param {function} fetchInvoice  () => Promise<{ blob, fileName }>
 */
const InvoiceViewerModal = ({ show, onClose, fetchInvoice, title = "Invoice" }) => {
  const [state, setState] = useState({ loading: true, url: null, error: "" });
  const [fileName, setFileName] = useState("invoice.pdf");
  // Object URLs are held until the modal closes, then revoked — leaving them alive
  // keeps the whole PDF in memory for the rest of the session.
  const urlRef = useRef(null);

  const revoke = useCallback(() => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  const load = useCallback(async () => {
    setState({ loading: true, url: null, error: "" });
    revoke();
    try {
      const { blob, fileName: name } = await fetchInvoice();
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setFileName(name);
      setState({ loading: false, url, error: "" });
    } catch (err) {
      // A blob-typed error response has to be read back as text before the server's
      // message can be shown, otherwise this renders "[object Blob]".
      let message = "Could not open this invoice.";
      const data = err.response?.data;
      if (data instanceof Blob) {
        try {
          message = JSON.parse(await data.text()).message || message;
        } catch (_) {
          /* keep the default */
        }
      } else if (data?.message) {
        message = data.message;
      }
      setState({ loading: false, url: null, error: message });
    }
  }, [fetchInvoice, revoke]);

  useEffect(() => {
    if (show) load();
    return () => {
      if (!show) revoke();
    };
  }, [show, load, revoke]);

  useEffect(() => revoke, [revoke]);

  const download = () => {
    if (!state.url) return;
    const a = document.createElement("a");
    a.href = state.url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <CenteredModal
      show={show}
      onClose={onClose}
      maxWidth={880}
      labelledBy="hw-invoice-title"
    >
      <div
        className="d-flex align-items-center justify-content-between gap-3"
        style={{ padding: "18px 24px", borderBottom: "1px solid #e9e1e5" }}
      >
        <h5
          id="hw-invoice-title"
          style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1d1117", margin: 0 }}
        >
          {title}
        </h5>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            border: 0, background: "transparent", fontSize: "1.5rem", lineHeight: 1,
            color: "#6f5c66", cursor: "pointer", padding: "0 4px",
          }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          background: "#f4f1f2", flex: 1, minHeight: "60vh",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {state.loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "#c2185b" }} role="status">
              <span className="visually-hidden">Loading</span>
            </div>
            <p className="mb-0 mt-3" style={{ color: "#6f5c66" }}>
              Preparing your invoice…
            </p>
          </div>
        )}

        {!state.loading && state.error && (
          <div className="alert alert-danger m-4 d-flex justify-content-between align-items-center">
            <span>{state.error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={load}>
              Retry
            </button>
          </div>
        )}

        {!state.loading && state.url && (
          <iframe
            title={title}
            src={state.url}
            style={{ width: "100%", height: "70vh", border: "none", background: "#fff" }}
          />
        )}
      </div>

      <div
        className="d-flex align-items-center justify-content-between gap-3"
        style={{ padding: "14px 24px", borderTop: "1px solid #e9e1e5" }}
      >
        <small style={{ color: "#6f5c66" }}>
          Keep this for your records — it is your proof of payment.
        </small>
        <div className="d-flex gap-2">
          <button className="btn btn-light" onClick={onClose} style={{ minWidth: 100 }}>
            Close
          </button>
          <button
            className="btn"
            onClick={download}
            disabled={!state.url}
            style={{
              background: "#c2185b", borderColor: "#c2185b", color: "#fff",
              minWidth: 130, fontWeight: 600,
            }}
          >
            <FiDownload className="me-2" size={15} />
            Download
          </button>
        </div>
      </div>
    </CenteredModal>
  );
};

export default InvoiceViewerModal;
