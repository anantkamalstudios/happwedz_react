import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instagramApi from "../../../services/api/instagramApi";

export default function InstagramCallback() {
  const { vendor } = useSelector((state) => state.vendorAuth || {});
  const [status, setStatus] = useState("connecting"); // connecting | success | error
  const [message, setMessage] = useState("Connecting Instagram...");

  useEffect(() => {
    const connect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        setStatus("error");
        setMessage("Instagram authorization was cancelled or denied.");
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Instagram authorization failed.");
        return;
      }

      if (!vendor?.id || String(state) !== String(vendor.id)) {
        setStatus("error");
        setMessage("Invalid or expired request. Please try connecting again.");
        return;
      }

      try {
        await instagramApi.connect({
          code,
          redirect_uri: `${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL}/instagram-callback`,
        });

        setStatus("success");
        setMessage("Instagram connected successfully!");

        if (window.opener) {
          window.opener.postMessage({ type: "instagram-connected" }, window.location.origin);
          setTimeout(() => window.close(), 1200);
        }
      } catch (err) {
        console.error("Instagram connection failed", err.response?.data || err);
        setStatus("error");
        setMessage(
          err.response?.data?.error || "Instagram connection failed. Please try again."
        );
      }
    };

    connect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "inherit",
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <h5 style={{ color: status === "error" ? "#dc3545" : "#212529" }}>{message}</h5>
      {status === "error" && (
        <button
          type="button"
          className="btn"
          style={{ backgroundColor: "#e83e8c", color: "#fff", border: "none", marginTop: 12 }}
          onClick={() => window.close()}
        >
          Close Window
        </button>
      )}
    </div>
  );
}
