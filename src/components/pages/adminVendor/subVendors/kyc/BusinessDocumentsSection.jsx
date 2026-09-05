import React from "react";
import DocumentUploadField from "./DocumentUploadField";

/**
 * The verification documents block inside Business details.
 *
 * Aadhaar and PAN are fixed single PDF slots. Business documents are repeatable rows the
 * vendor names themselves — that name is what the admin review screen shows, so four
 * files arrive as "GST Certificate", "Shop Act License" and so on rather than four
 * identical tiles.
 */

export const MAX_BUSINESS_DOCS = 5;
export const MIN_BUSINESS_DOCS = 1;

const SUGGESTED_NAMES = [
  "GST Certificate",
  "Shop Act License",
  "Udyam Registration",
  "Trade License",
  "Business Address Proof",
];

const BusinessDocumentsSection = ({
  aadhaar,
  pan,
  businessDocs,
  existing = {},
  errors = {},
  disabled = false,
  onChange,
}) => {
  const setBusinessDoc = (index, patch) => {
    const next = businessDocs.map((doc, i) => (i === index ? { ...doc, ...patch } : doc));
    onChange({ businessDocs: next });
  };

  const addRow = () => {
    if (businessDocs.length >= MAX_BUSINESS_DOCS) return;
    onChange({
      businessDocs: [...businessDocs, { id: `doc-${Date.now()}`, label: "", file: null }],
    });
  };

  const removeRow = (index) => {
    const next = businessDocs.filter((_, i) => i !== index);
    onChange({
      businessDocs: next.length
        ? next
        : [{ id: `doc-${Date.now()}`, label: "", file: null }],
    });
  };

  const existingBusiness = existing.business || [];

  return (
    <div
      className="border rounded-3 p-3 p-md-4 mb-4"
      style={{ borderColor: "#fce7f3", backgroundColor: "#fffafc" }}
    >
      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-1">
        <h5 className="fw-bold mb-0">Verification Documents</h5>
        <span
          className="badge px-2 py-1"
          style={{ background: "#fce7f3", color: "#ed1173", fontWeight: 600 }}
        >
          Required
        </span>
      </div>
      <p className="text-muted small mb-4">
        We verify every business before it goes live. Your documents are stored securely
        and are only visible to our verification team.
      </p>

      <div className="row">
        <div className="col-md-6">
          <DocumentUploadField
            id="kyc-aadhaar"
            label="Aadhaar Card"
            hint="PDF only, single file"
            accept="application/pdf"
            required
            disabled={disabled}
            file={aadhaar}
            existingName={existing.aadhaar?.file_name}
            error={errors.aadhaar}
            onChange={(file) => onChange({ aadhaar: file })}
            onRemove={() => onChange({ aadhaar: null })}
          />
        </div>
        <div className="col-md-6">
          <DocumentUploadField
            id="kyc-pan"
            label="PAN Card"
            hint="PDF only, single file"
            accept="application/pdf"
            required
            disabled={disabled}
            file={pan}
            existingName={existing.pan?.file_name}
            error={errors.pan}
            onChange={(file) => onChange({ pan: file })}
            onRemove={() => onChange({ pan: null })}
          />
        </div>
      </div>

      <hr className="my-4" style={{ borderColor: "#fce7f3" }} />

      <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-1">
        <div>
          <h6 className="fw-bold mb-1">
            Business Documents<span className="text-danger ms-1">*</span>
          </h6>
          <p className="text-muted small mb-0">
            Name each document so our team knows what it is. Add up to {MAX_BUSINESS_DOCS}.
          </p>
        </div>
        <span className="text-muted small">
          {businessDocs.filter((d) => d.file).length + existingBusiness.length} of{" "}
          {MAX_BUSINESS_DOCS}
        </span>
      </div>

      {existingBusiness.length > 0 && (
        <div className="mt-3 mb-2">
          <p className="text-muted small mb-2 fw-semibold">Already uploaded</p>
          <div className="d-flex flex-wrap gap-2">
            {existingBusiness.map((doc) => (
              <span
                key={doc.id}
                className="badge d-inline-flex align-items-center gap-1 px-2 py-2"
                style={{ background: "#f4edf1", color: "#5f4a55", fontWeight: 500 }}
              >
                {doc.label}
                <span className="text-muted fw-normal">· {doc.file_name}</span>
              </span>
            ))}
          </div>
          <p className="text-muted small mt-2 mb-0">
            Uploading new business documents below replaces the ones listed here.
          </p>
        </div>
      )}

      {errors.businessDocs && (
        <p className="small text-danger mt-2 mb-0 fw-semibold">⚠️ {errors.businessDocs}</p>
      )}

      <div className="mt-3">
        {businessDocs.map((doc, index) => (
          <div
            key={doc.id}
            className="border rounded-3 p-3 mb-3"
            style={{ borderColor: "#eee", backgroundColor: "#ffffff" }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">
                Document {index + 1}
              </span>
              {businessDocs.length > MIN_BUSINESS_DOCS && !disabled && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                  onClick={() => removeRow(index)}
                  aria-label={`Remove document ${index + 1}`}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fs-16 mb-1" htmlFor={`kyc-doc-label-${index}`}>
                Document name<span className="text-danger ms-1">*</span>
              </label>
              <input
                id={`kyc-doc-label-${index}`}
                type="text"
                className={`form-control ${
                  errors[`businessDocLabel-${index}`] ? "is-invalid" : ""
                }`}
                placeholder="e.g. GST Certificate"
                list="kyc-doc-name-suggestions"
                maxLength={150}
                value={doc.label}
                disabled={disabled}
                onChange={(e) => setBusinessDoc(index, { label: e.target.value })}
              />
              {errors[`businessDocLabel-${index}`] && (
                <div className="invalid-feedback d-block">
                  {errors[`businessDocLabel-${index}`]}
                </div>
              )}
            </div>

            <DocumentUploadField
              id={`kyc-doc-file-${index}`}
              label="Document file"
              hint="PDF, JPG or PNG"
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
              disabled={disabled}
              file={doc.file}
              error={errors[`businessDocFile-${index}`]}
              onChange={(file) => setBusinessDoc(index, { file })}
              onRemove={() => setBusinessDoc(index, { file: null })}
            />
          </div>
        ))}

        <datalist id="kyc-doc-name-suggestions">
          {SUGGESTED_NAMES.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        {businessDocs.length < MAX_BUSINESS_DOCS && !disabled && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={addRow}
          >
            + Add another document
          </button>
        )}
      </div>
    </div>
  );
};

export default BusinessDocumentsSection;
