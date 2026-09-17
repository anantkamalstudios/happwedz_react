import React, { useEffect } from "react";

// The backend finishes the connection before redirecting here, so this page only
// reports the result. `reason` is a fixed code, never text taken from the URL.
const ERROR_MESSAGES = {
  denied: "Instagram authorization was cancelled or denied.",
  expired: "This connection link has expired. Please try connecting again.",
  duplicate: "This Instagram account is already connected to another vendor.",
  failed: "Instagram connection failed. Please try again.",
};

export default function InstagramCallback() {
  const params = new URLSearchParams(window.location.search);
  const isSuccess = params.get("status") === "success";
  const message = isSuccess
    ? "Instagram connected successfully!"
    : ERROR_MESSAGES[params.get("reason")] || ERROR_MESSAGES.failed;

  useEffect(() => {
    if (!isSuccess) return undefined;
    // Only delivered when the dashboard is on this same origin; otherwise the
    // dashboard notices the popup closing and refreshes itself.
    window.opener?.postMessage({ type: "instagram-connected" }, window.location.origin);
    const timer = setTimeout(() => window.close(), 1200);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily: "inherit",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <h5 style={{ color: isSuccess ? "#212529" : "#dc3545" }}>{message}</h5>
      <button
        type="button"
        className="btn"
        style={{
          backgroundColor: "#e83e8c",
          color: "#fff",
          border: "none",
          marginTop: 12,
          flex: "0 0 auto",
          width: "auto",
          height: "auto",
        }}
        onClick={() => window.close()}
      >
        Close Window
      </button>
    </div>
  );
}
