// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// A small loader for helper D's tabs: loads on mount, again when `key` changes, and again on reload().
// Answers that arrive after a newer request (or after the tab closed) are ignored.
import { useCallback, useEffect, useRef, useState } from "react";

export default function useOverviewLoad(load, key) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [attempt, setAttempt] = useState(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, status: "loading", error: null }));
    Promise.resolve()
      .then(() => loadRef.current())
      .then((data) => {
        if (live) setState({ status: "ready", data, error: null });
      })
      .catch((error) => {
        if (live) setState({ status: "error", data: null, error });
      });
    return () => {
      live = false;
    };
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, reload };
}
