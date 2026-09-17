import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { FaInstagram } from "react-icons/fa6";
import instagramApi from "../../../../services/api/instagramApi";

export default function InstagramConnect() {
  const { vendor } = useSelector((state) => state.vendorAuth || {});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connection, setConnection] = useState(null);
  const [error, setError] = useState("");

  const fetchConnection = useCallback(async () => {
    try {
      setLoading(true);
      const data = await instagramApi.getConnection();
      setConnection(data?.connected ? data.connection : null);
    } catch (err) {
      console.error("Failed to load Instagram connection:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  // The popup posts back here once the OAuth exchange finishes.
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "instagram-connected") {
        setConnecting(false);
        fetchConnection();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchConnection]);

  const handleConnect = async () => {
    if (!vendor?.id) return;

    setError("");
    setConnecting(true);

    // Open the popup straight from the click so the browser doesn't block it,
    // then send it to Instagram once the server has signed the request.
    const popup = window.open("", "InstagramLogin", "width=600,height=700");

    try {
      const { url } = await instagramApi.getAuthUrl();
      if (!popup || popup.closed) {
        setError("Please allow pop-ups for this site to connect Instagram.");
        setConnecting(false);
        return;
      }
      popup.location.href = url;
    } catch (err) {
      popup?.close();
      setError(
        err.response?.data?.error ||
          "Could not start the Instagram connection. Please try again."
      );
      setConnecting(false);
      return;
    }

    // The popup finishes on the main site, which may be a different origin from
    // this dashboard, so it can't always message back. Re-read the connection
    // once it closes.
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        setConnecting(false);
        fetchConnection();
      }
    }, 800);
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect this Instagram account?")) return;
    try {
      await instagramApi.disconnect();
      setConnection(null);
    } catch (err) {
      console.error("Failed to disconnect Instagram:", err);
      setError("Failed to disconnect Instagram. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <Spinner animation="border" size="sm" /> Loading Instagram connection...
      </div>
    );
  }

  return (
    <div>
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {connection ? (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded p-3">
          <div className="d-flex align-items-center gap-3">
            {connection.profile_picture_url ? (
              <img
                src={connection.profile_picture_url}
                alt={connection.username}
                width={48}
                height={48}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                  color: "#fff",
                }}
              >
                <FaInstagram size={22} />
              </div>
            )}
            <div>
              <div className="fw-semibold">@{connection.username || "instagram"}</div>
              <div className="text-muted small">
                {connection.account_type || "Business"} · Connected
              </div>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              style={{ flex: "0 0 auto", width: "auto" }}
              onClick={() => navigate("/vendor-dashboard/vendor-instagram?tab=posts")}
            >
              View posts &amp; stories →
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              style={{ flex: "0 0 auto", width: "auto" }}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded p-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                color: "#fff",
              }}
            >
              <FaInstagram size={22} />
            </div>
            <div>
              <div className="fw-semibold">Instagram</div>
              <div className="text-muted small">Not connected</div>
            </div>
          </div>
          <Button
            style={{
              backgroundColor: "#e83e8c",
              border: "none",
              flex: "0 0 auto",
              width: "auto",
            }}
            size="sm"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Connecting...
              </>
            ) : (
              "Connect Instagram"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
