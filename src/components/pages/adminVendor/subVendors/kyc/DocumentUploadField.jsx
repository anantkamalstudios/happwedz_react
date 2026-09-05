import React, { useCallback, useRef, useState } from "react";

/**
 * One document slot: drag-and-drop or click to browse, with validation and a preview
 * row once a file is chosen.
 *
 * Styled to match the profile-image dropzone already in BusinessDetails so the new
 * fields read as part of the same form rather than a bolted-on section.
 */

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const describeAccept = (accept) =>
  accept
    .split(",")
    .map((t) => t.trim().replace("application/", "").replace("image/", ""))
    .map((t) => (t === "pdf" ? "PDF" : t.toUpperCase()))
    .filter((t, i, arr) => arr.indexOf(t) === i)
    .join(", ");

const DocumentUploadField = ({
  id,
  label,
  hint,
  accept = "application/pdf",
  file = null,
  existingName = null,
  required = false,
  disabled = false,
  error = "",
  onChange,
  onRemove,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  const acceptedTypes = accept.split(",").map((t) => t.trim());
  const shownError = error || localError;

  const validateAndSet = useCallback(
    (picked) => {
      setLocalError("");
      if (!picked) return;

      if (!acceptedTypes.includes(picked.type)) {
        setLocalError(`Please upload a ${describeAccept(accept)} file.`);
        return;
      }
      if (picked.size > MAX_FILE_SIZE_BYTES) {
        setLocalError(
          `File must be under ${MAX_FILE_SIZE_MB} MB (this one is ${formatSize(picked.size)}).`
        );
        return;
      }

      onChange?.(picked);
    },
    [accept, acceptedTypes, onChange]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e) => {
    // The dropzone is a div, so it needs its own keyboard affordance.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const hasFile = Boolean(file);
  const hasExisting = Boolean(existingName) && !hasFile;

  return (
    <div className="mb-3">
      <label className="form-label fs-16 mb-1" htmlFor={id}>
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {hint && <p className="text-muted small mb-2">{hint}</p>}

      {hasFile || hasExisting ? (
        <div
          className="d-flex align-items-center justify-content-between gap-3 border rounded-3 px-3 py-2"
          style={{
            borderColor: "#fce7f3",
            backgroundColor: "#fff8fb",
          }}
        >
          <div className="d-flex align-items-center gap-2 text-truncate">
            <span
              className="d-inline-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#fce7f3",
                color: "#ed1173",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
              aria-hidden="true"
            >
              {hasFile
                ? (file.name.split(".").pop() || "").slice(0, 3).toUpperCase()
                : "DOC"}
            </span>
            <div className="text-truncate">
              <div className="fw-semibold text-dark text-truncate" style={{ fontSize: "0.88rem" }}>
                {hasFile ? file.name : existingName}
              </div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                {hasFile ? formatSize(file.size) : "Already uploaded"}
              </div>
            </div>
          </div>

          {!disabled && (
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={openPicker}
              >
                Replace
              </button>
              {hasFile && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-danger text-decoration-none p-0 px-1"
                  onClick={() => {
                    setLocalError("");
                    onRemove?.();
                  }}
                  aria-label={`Remove ${label}`}
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className="border rounded-3 p-3 text-center fs-14"
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          style={{
            borderStyle: "dashed",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
            borderColor: shownError ? "#ef4444" : isDragging ? "#ed1173" : "#cbd5e1",
            backgroundColor: isDragging ? "#fff1f6" : "#f8fafc",
            transition: "all 0.2s ease",
          }}
          onClick={openPicker}
          onKeyDown={handleKeyDown}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <p className="mb-1 fw-bold text-dark">Upload {label}</p>
          <p className="text-muted small mb-1">Drag &amp; drop or click to browse</p>
          <span
            className="badge bg-light text-secondary border px-2 py-1"
            style={{ fontSize: "0.75rem", fontWeight: 500 }}
          >
            Max size: {MAX_FILE_SIZE_MB} MB ({describeAccept(accept)})
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        className="d-none"
        disabled={disabled}
        onChange={(e) => {
          validateAndSet(e.target.files?.[0]);
          // Reset so picking the same file twice still fires a change event.
          e.target.value = "";
        }}
      />

      {shownError && (
        <p className="small text-danger mt-2 mb-0 fw-semibold">⚠️ {shownError}</p>
      )}
    </div>
  );
};

export default DocumentUploadField;
export { MAX_FILE_SIZE_MB };
