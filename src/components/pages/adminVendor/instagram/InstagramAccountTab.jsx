import React, { useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiExternalLink } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { TbUnlink } from "react-icons/tb";
import instagramApi from "../../../../services/api/instagramApi";
import { EmptyState, RefreshButton } from "./InstagramStates";

export default function InstagramAccountTab({ connection, onRefresh, onDisconnected, onConnect }) {
  const [profile, setProfile] = useState(null);
  const [pictureFailed, setPictureFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState("");

  // The saved picture link expires on Instagram's side; the live profile has a
  // fresh one. If it can't be fetched the saved details are still shown.
  const loadProfile = useCallback(async (refresh = false) => {
    try {
      const data = await instagramApi.getProfile({ refresh });
      setProfile(data.profile);
      setPictureFailed(false);
    } catch {
      // keep the saved connection details
    }
  }, []);

  useEffect(() => {
    if (connection) loadProfile();
  }, [connection, loadProfile]);

  if (!connection) {
    return (
      <EmptyState
        icon={<FaInstagram />}
        title="No Instagram account connected"
        text="Connect your Instagram Business account to see your posts, stories and reels here."
        action={
          <button type="button" className="igd-btn igd-btn-primary" onClick={onConnect}>
            Connect Instagram
          </button>
        }
      />
    );
  }

  const username = profile?.username || connection.username;
  const name = profile?.name || connection.name;
  const accountType = profile?.account_type || connection.account_type;
  const picture = profile?.profile_picture_url || connection.profile_picture_url;
  const isExpired =
    connection.token_expires_at && new Date(connection.token_expires_at) < new Date();
  const profileUrl = username
    ? `https://www.instagram.com/${encodeURIComponent(username)}/`
    : null;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([onRefresh(), loadProfile(true)]);
    setRefreshing(false);
  };

  const handleDisconnect = async () => {
    if (!window.confirm(`Disconnect @${username || "this account"} from HappyWedz?`)) return;
    setDisconnecting(true);
    setError("");
    try {
      await instagramApi.disconnect();
      onDisconnected();
    } catch (err) {
      console.error("Failed to disconnect Instagram:", err);
      setError("Failed to disconnect Instagram. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <>
      <div className="igd-panel igd-toolbar">
        <span className="igd-toolbar-note">
          The Instagram professional account linked to your HappyWedz storefront.
        </span>
        <RefreshButton onClick={handleRefresh} busy={refreshing} />
      </div>

      {error && (
        <div className="igd-alert" role="alert">
          {error}
        </div>
      )}

      <div className="igd-panel igd-table-panel">
        <div className="igd-table-scroll">
          <table className="igd-table">
            <thead>
              <tr>
                <th>Instagram Account</th>
                <th>Name</th>
                <th>Status</th>
                <th className="is-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="igd-account">
                    {picture && !pictureFailed ? (
                      <img
                        src={picture}
                        alt=""
                        className="igd-account-avatar"
                        referrerPolicy="no-referrer"
                        onError={() => setPictureFailed(true)}
                      />
                    ) : (
                      <span className="igd-account-icon">
                        <FaInstagram />
                      </span>
                    )}
                    <div>
                      <div className="igd-strong">{username || "instagram"}</div>
                      <div className="igd-muted">{isExpired ? "Needs reconnect" : "Connected"}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="igd-strong">{name || "—"}</div>
                  {accountType && <div className="igd-muted">{accountType}</div>}
                </td>
                <td>
                  <span className={`igd-status ${isExpired ? "is-expired" : "is-active"}`}>
                    {isExpired ? "Expired" : "Active"}
                  </span>
                </td>
                <td className="is-end">
                  <div className="igd-actions">
                    {isExpired && (
                      <button type="button" className="igd-btn igd-btn-primary" onClick={onConnect}>
                        Reconnect
                      </button>
                    )}
                    {profileUrl && (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="igd-icon-btn"
                        title="View on Instagram"
                        aria-label="View on Instagram"
                      >
                        <FiExternalLink size={17} />
                      </a>
                    )}
                    <button
                      type="button"
                      className="igd-icon-btn is-danger"
                      title="Disconnect"
                      aria-label="Disconnect"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                    >
                      {disconnecting ? <Spinner animation="border" size="sm" /> : <TbUnlink size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
