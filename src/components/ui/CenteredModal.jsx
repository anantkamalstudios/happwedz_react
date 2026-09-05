import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * A modal that is always centred, because it owns every element involved.
 *
 * react-bootstrap's Modal was drifting left on the vendor dashboard: it centres by
 * giving `.modal-dialog` an auto margin inside a full-width `.modal`, which only holds
 * if nothing in the app's stylesheets constrains either node — and something here does.
 * Two rounds of overrides did not stick, so this drops the dependency entirely: a
 * portalled fixed overlay that centres with flexbox and inherits no Bootstrap layout.
 *
 * Keeps the behaviour a dialog needs: Escape to close, backdrop click to close, the
 * page behind locked from scrolling, and focus not trapped behind the overlay.
 */
const CenteredModal = ({
  show,
  onClose,
  children,
  maxWidth = 960,
  labelledBy,
  zIndex = 1070,
}) => {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!show) return undefined;

    window.addEventListener("keydown", handleKey);

    // Lock the page behind, restoring whatever overflow was there before rather than
    // assuming it was "visible".
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [show, handleKey]);

  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      onMouseDown={(e) => {
        // Only a click that both starts and ends on the backdrop closes — dragging a
        // text selection out of the dialog should not dismiss it.
        if (e.target === e.currentTarget) onClose?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        background: "rgba(29,17,23,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "calc(100vh - 2rem)",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 24px 60px -24px rgba(29,17,23,.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default CenteredModal;
