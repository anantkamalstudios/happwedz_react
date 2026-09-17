import React, { useCallback, useEffect, useState } from "react";
import { FiFilm, FiGrid, FiUserCheck } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import { TbCircleDashed } from "react-icons/tb";
import { useNavigate, useSearchParams } from "react-router-dom";
import instagramApi from "../../../services/api/instagramApi";
import InstagramAccountTab from "./instagram/InstagramAccountTab";
import InstagramMediaTab from "./instagram/InstagramMediaTab";
import InstagramStoriesTab from "./instagram/InstagramStoriesTab";
import { EmptyState, LoadingState } from "./instagram/InstagramStates";
import { useInstagramMedia, useInstagramStories } from "./instagram/useInstagramFeeds";
import "./instagram/InstagramDashboard.css";

// Connecting happens in Settings → Integrations, which owns the OAuth popup flow.
const INTEGRATIONS_PATH = "/vendor-dashboard/vendor-setting?tab=integrations";

const TABS = [
  { id: "account", label: "Connected Account", Icon: FiUserCheck },
  { id: "posts", label: "Posts", Icon: FiGrid },
  { id: "stories", label: "Stories", Icon: TbCircleDashed },
  { id: "reels", label: "Reels", Icon: FiFilm },
];

export default function InstagramPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = TABS.some((t) => t.id === requestedTab) ? requestedTab : "account";

  const [status, setStatus] = useState("loading"); // loading | failed | disconnected | connected
  const [connection, setConnection] = useState(null);
  const media = useInstagramMedia();
  const stories = useInstagramStories();

  const loadConnection = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setStatus("loading");
    try {
      const data = await instagramApi.getConnection();
      setConnection(data?.connected ? data.connection : null);
      setStatus(data?.connected ? "connected" : "disconnected");
    } catch (err) {
      console.error("Failed to load Instagram connection:", err);
      if (!silent) setStatus("failed");
    }
  }, []);

  useEffect(() => {
    loadConnection();
  }, [loadConnection]);

  const selectTab = (id) => setSearchParams({ tab: id }, { replace: true });
  const goToIntegrations = () => navigate(INTEGRATIONS_PATH);

  const { reset: resetMedia } = media;
  const { reset: resetStories } = stories;
  const handleDisconnected = () => {
    setConnection(null);
    setStatus("disconnected");
    resetMedia();
    resetStories();
  };

  const renderTab = () => {
    if (status === "loading") return <LoadingState />;

    if (status === "failed") {
      return (
        <EmptyState
          title="Couldn't load your Instagram connection"
          text="Something went wrong. Please try again."
          action={
            <button type="button" className="igd-btn" onClick={() => loadConnection()}>
              Try again
            </button>
          }
        />
      );
    }

    if (activeTab === "account") {
      return (
        <InstagramAccountTab
          connection={connection}
          onRefresh={() => loadConnection({ silent: true })}
          onDisconnected={handleDisconnected}
          onConnect={goToIntegrations}
        />
      );
    }

    if (status === "disconnected") {
      return (
        <EmptyState
          icon={<FaInstagram />}
          title="Connect your Instagram"
          text="Your posts, stories and reels will appear here once your Instagram Business account is connected."
          action={
            <button type="button" className="igd-btn igd-btn-primary" onClick={goToIntegrations}>
              Connect Instagram
            </button>
          }
        />
      );
    }

    if (activeTab === "stories") {
      return <InstagramStoriesTab stories={stories} onReconnect={goToIntegrations} />;
    }

    return (
      <InstagramMediaTab
        key={activeTab}
        kind={activeTab}
        media={media}
        onReconnect={goToIntegrations}
      />
    );
  };

  return (
    <div className="igd-page">
      <div className="igd-container">
        <header className="igd-header">
          <h1 className="igd-title">Instagram</h1>
          <p className="igd-subtitle">
            Manage your connected Instagram account and browse your posts, stories and reels.
          </p>
        </header>

        <div className="igd-layout">
          <nav className="igd-tabs" role="tablist" aria-label="Instagram sections">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                className={`igd-tab ${activeTab === id ? "is-active" : ""}`}
                onClick={() => selectTab(id)}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </nav>

          <div className="igd-tab-panel" role="tabpanel">
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
