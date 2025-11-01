// DynamicAside.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import TopFilter from "./TopFilter";
import useFilters from "../../../hooks/useFilters";

const DynamicAside = ({ view, setView, section, onFiltersChange }) => {
  const { slug } = useParams();
  const {
    filters,
    activeFilters,
    toggleFilter,
    clearFilters,
    isFilterActive,
    getActiveCount,
  } = useFilters({ section, slug });

  // Separate pending filters (user selections) from applied filters (API filters)
  // activeFilters = what user has selected (pending, not yet applied)
  // appliedFilters = what's actually sent to the API
  const [appliedFilters, setAppliedFilters] = useState({});
  const prevActiveFiltersRef = useRef(activeFilters);

  // Preserve activeFilters in ref - keep track of what user has selected
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      prevActiveFiltersRef.current = activeFilters;
    }
  }, [activeFilters]);

  // Handle filter toggle - update pending filters only (don't trigger API)
  const handleToggleFilter = (group, value) => {
    toggleFilter(group, value);
  };

  // Handle apply filters - send pending filters to API but keep them selected
  const handleApplyFilters = () => {
    // Capture current filters - these are what the user has selected
    const currentFilters = { ...activeFilters };
    
    // Store in ref for recovery if needed
    if (Object.keys(currentFilters).length > 0) {
      prevActiveFiltersRef.current = currentFilters;
    }
    
    // Set applied filters and notify parent - this triggers API call
    setAppliedFilters(currentFilters);
    if (onFiltersChange) {
      onFiltersChange(currentFilters);
    }
    
    // The activeFilters in useFilters hook should remain intact
    // since we're not calling clearFilters() - only toggleFilter updates them
  };

  // Handle clear all - clear both pending and applied
  const handleClearFilters = () => {
    clearFilters();
    setAppliedFilters({});
    prevActiveFiltersRef.current = {};
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  // Check if there are pending changes (activeFilters != appliedFilters)
  const hasPendingChanges = JSON.stringify(activeFilters) !== JSON.stringify(appliedFilters);

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
