import { useCallback, useState } from "react";
import instagramApi from "../../../../services/api/instagramApi";

export const readInstagramError = (err) => ({
  reconnect: err?.response?.data?.code === "INSTAGRAM_RECONNECT",
  message:
    err?.response?.data?.error ||
    "Could not load from Instagram. Please try again later.",
});

// Posts and reels come from the same Instagram media list, so both tabs share it
// and switching between them doesn't refetch.
export function useInstagramMedia() {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    setMoreFailed(false);
    try {
      const data = await instagramApi.getPosts(undefined, { refresh });
      setItems(data.posts);
      setNextCursor(data.nextCursor);
      setLoaded(true);
    } catch (err) {
      setError(readInstagramError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setMoreFailed(false);
    try {
      const data = await instagramApi.getPosts(nextCursor);
      setItems((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      const readable = readInstagramError(err);
      if (readable.reconnect) setError(readable);
      setMoreFailed(true);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  const reset = useCallback(() => {
    setItems([]);
    setNextCursor(null);
    setLoaded(false);
    setError(null);
    setMoreFailed(false);
  }, []);

  return { items, nextCursor, loaded, loading, loadingMore, moreFailed, error, load, loadMore, reset };
}

export function useInstagramStories() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async ({ refresh = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await instagramApi.getStories({ refresh });
      setItems(data.stories);
      setLoaded(true);
    } catch (err) {
      setError(readInstagramError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setItems([]);
    setLoaded(false);
    setError(null);
  }, []);

  return { items, loaded, loading, error, load, reset };
}
