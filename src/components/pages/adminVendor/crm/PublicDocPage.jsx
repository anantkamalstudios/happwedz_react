import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Download, FileText } from "lucide-react";
import { API_BASE_URL } from "../../../../config/constants";
import "./crm.css";

const KINDS = {
  invoice: { path: "invoices", label: "invoice" },
  receipt: { path: "receipts", label: "receipt" },
};

// The link a vendor sends for an invoice or receipt (/crm/doc/invoice/:token).
// It opens the PDF straight away; the button is there if the browser doesn't.
const PublicDocPage = () => {
  const { kind, token } = useParams();
  const doc = KINDS[kind];
  const valid = doc && /^[a-f0-9]{32}$/.test(token || "");
  const pdfUrl = valid ? `${API_BASE_URL}/crm/public/${doc.path}/${token}/pdf` : "";

  useEffect(() => {
    if (pdfUrl) window.location.replace(pdfUrl);
  }, [pdfUrl]);

  return (
    <div className="crm">
      <div className="crm-wrap" style={{ maxWidth: 520 }}>
        <div className="crm-card crm-empty">
          {valid ? (
            <>
              <FileText size={36} style={{ color: "#ed1173", marginBottom: 10 }} />
              <h3>Opening your {doc.label}…</h3>
              <p>If it doesn't open by itself, tap below.</p>
              <a className="crm-btn crm-btn-primary" href={pdfUrl}>
                <Download size={16} /> Open {doc.label} (PDF)
              </a>
            </>
          ) : (
            <>
              <h3>This link is not valid</h3>
              <p>Please ask the vendor to send it again.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicDocPage;
