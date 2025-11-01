import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import FILTER_CONFIG, { DEFAULT_FILTERS } from "../data/filtersConfig";

// Backend-ready hook to retrieve filters dynamically per section/subcategory.
// Manages both filter options and active selections.
const useFilters = ({ section, slug }) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const preservedFiltersRef = useRef({});

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
        if (isMounted) {
          setFilters(local);
          // Preserve existing activeFilters when config changes (don't clear user selections)
          if (Object.keys(preservedFiltersRef.current).length > 0) {
            setActiveFilters(preservedFiltersRef.current);
          }
        }
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

  // Preserve activeFilters in ref when they change
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      preservedFiltersRef.current = activeFilters;
    }
  }, [activeFilters]);

  // Toggle a filter value
  const toggleFilter = useCallback((group, value) => {
    setActiveFilters((prev) => {
      const groupFilters = prev[group] || [];
      const exists = groupFilters.includes(value);
      
      if (exists) {
        // Remove filter
        const updated = groupFilters.filter((v) => v !== value);
        if (updated.length === 0) {
          const { [group]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [group]: updated };
      } else {
        // Add filter
        return { ...prev, [group]: [...groupFilters, value] };
      }
    });
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  // Clear specific filter group
  const clearFilterGroup = useCallback((group) => {
    setActiveFilters((prev) => {
      const { [group]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Check if a filter is active
  const isFilterActive = useCallback((group, value) => {
    return activeFilters[group]?.includes(value) || false;
  }, [activeFilters]);

  // Get count of active filters in a group
  const getActiveCount = useCallback((group) => {
    return activeFilters[group]?.length || 0;
  }, [activeFilters]);

  // Get total active filter count
  const totalActiveCount = useMemo(() => {
    return Object.values(activeFilters).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
  }, [activeFilters]);

  return {
    filters,
    activeFilters,
    loading,
    error,
    toggleFilter,
    clearFilters,
    clearFilterGroup,
    isFilterActive,
    getActiveCount,
    totalActiveCount,
  };
};

export default useFilters;
