import React, { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import InstagramMediaCard from "./InstagramMediaCard";
import { EmptyState, FeedErrorBanner, LoadingState, RefreshButton } from "./InstagramStates";

const STORY_LIFETIME_MS = 24 * 60 * 60 * 1000;

const expiresIn = (iso) => {
  if (!iso) return null;
  const minutesLeft = Math.floor(
    (new Date(iso).getTime() + STORY_LIFETIME_MS - Date.now()) / 60000
  );
  if (minutesLeft <= 0) return "Expiring now";
  if (minutesLeft < 60) return `Expires in ${minutesLeft}m`;
  return `Expires in ${Math.floor(minutesLeft / 60)}h`;
};

export default function InstagramStoriesTab({ stories, onReconnect }) {
  const [refreshing, setRefreshing] = useState(false);
  const { items, loaded, loading, error, load } = stories;

  useEffect(() => {
    if (!loaded && !loading && !error) load();
  }, [loaded, loading, error, load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load({ refresh: true });
    setRefreshing(false);
  };

  const renderList = () => {
    if (loading && !loaded) return <LoadingState />;
    if (!loaded) return null;
    if (items.length === 0) {
      return (
        <EmptyState
          icon={<FaInstagram />}
          title="No active stories"
          text="Stories you share on Instagram appear here for 24 hours. Just posted one? Click Refresh."
        />
      );
    }
    return (
      <div className="igd-grid is-portrait">
        {items.map((story) => {
          const expiry = expiresIn(story.timestamp);
          return (
            <InstagramMediaCard
              key={story.id}
              item={story}
              portrait
              showCaption={false}
              note={
                expiry && (
                  <span className="igd-card-note">
                    <FiClock size={14} /> {expiry}
                  </span>
                )
              }
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="igd-panel igd-toolbar">
        <span className="igd-toolbar-note">
          <FiClock size={16} /> Stories stay visible on Instagram for 24 hours.
        </span>
        <RefreshButton onClick={handleRefresh} busy={refreshing} disabled={loading} />
      </div>

      {error && (
        <FeedErrorBanner error={error} onRetry={() => load()} onReconnect={onReconnect} />
      )}

      {renderList()}
    </>
  );
}
