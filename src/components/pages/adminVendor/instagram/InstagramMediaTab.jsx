import React, { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";
import InstagramMediaCard from "./InstagramMediaCard";
import { EmptyState, FeedErrorBanner, LoadingState, RefreshButton } from "./InstagramStates";

const KINDS = {
  posts: {
    isMatch: (item) => item.productType !== "REELS",
    portrait: false,
    emptyTitle: "No posts yet",
    emptyText: "Photos and carousels you share on Instagram will appear here.",
  },
  reels: {
    isMatch: (item) => item.productType === "REELS",
    portrait: true,
    emptyTitle: "No reels yet",
    emptyText: "Reels you share on Instagram will appear here.",
  },
};

export default function InstagramMediaTab({ kind, media, onReconnect }) {
  const config = KINDS[kind];
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const sentinelRef = useRef(null);
  const { items, loaded, loading, error, nextCursor, loadingMore, moreFailed, load, loadMore } = media;

  useEffect(() => {
    if (!loaded && !loading && !error) load();
  }, [loaded, loading, error, load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter(config.isMatch)
      .filter((item) => !q || item.caption.toLowerCase().includes(q));
  }, [items, config, query]);

  // Keep loading pages while the end of the list is on screen. This also fills the
  // tab when a page of Instagram media is mostly the other kind (posts vs reels).
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextCursor || moreFailed || error) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, moreFailed, error, loadMore]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await load({ refresh: true });
    setRefreshing(false);
  };

  const renderList = () => {
    if (loading && !loaded) return <LoadingState />;
    if (visible.length > 0) {
      return (
        <div className={`igd-grid ${config.portrait ? "is-portrait" : ""}`}>
          {visible.map((item) => (
            <InstagramMediaCard key={item.id} item={item} portrait={config.portrait} />
          ))}
        </div>
      );
    }
    if (!loaded || nextCursor) return null;
    return query.trim() ? (
      <EmptyState title="No matches" text={`Nothing in your ${kind} mentions "${query.trim()}".`} />
    ) : (
      <EmptyState
        icon={<FaInstagram />}
        title={config.emptyTitle}
        text={`${config.emptyText} Just shared something? Click Refresh.`}
      />
    );
  };

  return (
    <>
      <div className="igd-panel igd-toolbar">
        <label className="igd-search">
          <FiSearch size={18} className="igd-search-icon" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by caption..."
            aria-label="Search by caption"
          />
        </label>
        <RefreshButton onClick={handleRefresh} busy={refreshing} disabled={loading} />
      </div>

      {error && (
        <FeedErrorBanner error={error} onRetry={() => load()} onReconnect={onReconnect} />
      )}

      {renderList()}

      {nextCursor && !error && (
        <div ref={sentinelRef} className="igd-more">
          {moreFailed ? (
            <button type="button" className="igd-btn" onClick={loadMore}>
              Load more
            </button>
          ) : (
            loadingMore && <Spinner animation="border" size="sm" />
          )}
        </div>
      )}
    </>
  );
}
