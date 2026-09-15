import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Spinner } from "react-bootstrap";
import { FaInstagram } from "react-icons/fa6";
import instagramApi from "../../../../services/api/instagramApi";

export default function InstagramConnect() {
  const { vendor } = useSelector((state) => state.vendorAuth || {});
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

  const handleConnect = () => {
    if (!vendor?.id) return;

    setError("");
    setConnecting(true);

    const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    const igAppId = import.meta.env.VITE_INSTAGRAM_APP_ID;

    if (!igAppId) {
      setError("Instagram App ID is not configured (VITE_INSTAGRAM_APP_ID).");
      setConnecting(false);
      return;
    }

    const redirectUri = `${apiUrl}/instagram-callback`;

    const authUrl =
      "https://www.instagram.com/oauth/authorize" +
      "?enable_fb_login=0" +
      "&force_authentication=1" +
      `&client_id=${igAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      "&response_type=code" +
      "&scope=" +
      "instagram_business_basic," +
      "instagram_business_manage_messages," +
      "instagram_business_manage_comments," +
      "instagram_business_content_publish" +
      `&state=${vendor.id}`;

    const popup = window.open(authUrl, "InstagramLogin", "width=600,height=700");

    // If the user just closes the popup without finishing, stop showing the spinner.
    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        setConnecting(false);
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
          <Button
            variant="outline-danger"
            size="sm"
            style={{ flex: "0 0 auto", width: "auto" }}
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
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
