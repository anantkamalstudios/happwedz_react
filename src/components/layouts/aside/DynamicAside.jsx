// DynamicAside.jsx
import React, { useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAppliedFilters,
  setAppliedFilters,
  clearFiltersByKey,
} from "../../../redux/filterSlice";
import TopFilter from "./TopFilter";
import useFilters from "../../../hooks/useFilters";

const DynamicAside = ({
  view,
  setView,
  section,
  onFiltersChange,
  vendorType,
}) => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const {
    filters,
    activeFilters,
    toggleFilter,
    clearFilters,
    isFilterActive,
    getActiveCount,
  } = useFilters({ section, slug: vendorType || slug });

  // Get the filter key
  const filterKey = useMemo(() => {
    if (section === "venues" && !slug) return "venues";
    if (slug) return slug;
    return section || "";
  }, [section, slug]);

  // Get applied filters from Redux
  const appliedFilters = useSelector((state) =>
    selectAppliedFilters(state, filterKey)
  );

  // Track previous filter key to detect route changes
  const prevFilterKeyRef = useRef(filterKey);

  useEffect(() => {
    if (
      prevFilterKeyRef.current !== null &&
      prevFilterKeyRef.current !== filterKey
    ) {
      dispatch(clearFiltersByKey({ key: prevFilterKeyRef.current }));

      if (onFiltersChange) {
        onFiltersChange({});
      }
    }
    prevFilterKeyRef.current = filterKey;
  }, [filterKey, dispatch, onFiltersChange]);

  const handleToggleFilter = (group, value) => {
    toggleFilter(group, value);
  };

  const handleApplyFilters = () => {
    // Capture current filters - these are stored in Redux and will stay checked
    const currentFilters = { ...activeFilters };

    // Store applied filters in Redux (separate from activeFilters)
    // This way activeFilters stay checked, but we know what's applied
    dispatch(setAppliedFilters({ key: filterKey, filters: currentFilters }));

    // Notify parent - this triggers API call
    // activeFilters remain in Redux, so checkboxes stay checked!
    if (onFiltersChange) {
      onFiltersChange(currentFilters);
    }
  };

  const handleClearFilters = () => {
    // Clear filters in Redux (this also clears applied filters)
    clearFilters();
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  // Check if there are pending changes (activeFilters != appliedFilters)
  const hasPendingChanges =
    JSON.stringify(activeFilters) !== JSON.stringify(appliedFilters);

  return (
    <TopFilter
      view={view}
      setView={setView}
      filters={filters}
      activeFilters={activeFilters}
      appliedFilters={appliedFilters}
      onToggleFilter={handleToggleFilter}
      onClearFilters={handleClearFilters}
      onApplyFilters={handleApplyFilters}
      isFilterActive={isFilterActive}
      getActiveCount={getActiveCount}
      hasPendingChanges={hasPendingChanges}
    />
  );
};

export default DynamicAside;
