import { useEffect, useMemo, useState } from "react";
import FILTER_CONFIG, { DEFAULT_FILTERS } from "../data/filtersConfig";

// Backend-ready hook to retrieve filters dynamically per section/subcategory.
// Currently uses local FILTER_CONFIG as a fallback while backend endpoints are finalized.
const useFilters = ({ section, slug }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const key = useMemo(() => {
    if (section === "venues" && !slug) return "venues";
    if (slug) return slug;
    return section || "";
  }, [section, slug]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Placeholder for backend-driven filters.
        // Example future endpoint:
        // const qs = new URLSearchParams({ section, slug }).toString();
        // const res = await fetch(`https://happywedz.com/api/filters?${qs}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   if (isMounted) setFilters(data);
        //   return;
        // }

        const local = FILTER_CONFIG[key] || DEFAULT_FILTERS;
        if (isMounted) setFilters(local);
      } catch (e) {
        if (isMounted) {
          setError(e);
          setFilters(FILTER_CONFIG[key] || DEFAULT_FILTERS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [key, section, slug]);

  return { filters, loading, error };
};

export default useFilters;
