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
  const [appliedFilters, setAppliedFilters] = useState({});
  const prevActiveFiltersRef = useRef(activeFilters);
  useEffect(() => {
    if (Object.keys(activeFilters).length > 0) {
      prevActiveFiltersRef.current = activeFilters;
    }
  }, [activeFilters]);

  const handleToggleFilter = (group, value) => {
    toggleFilter(group, value);
  };

  const handleApplyFilters = () => {
    const currentFilters = { ...activeFilters };

    if (Object.keys(currentFilters).length > 0) {
      prevActiveFiltersRef.current = currentFilters;
    }

    setAppliedFilters(currentFilters);
    if (onFiltersChange) {
      onFiltersChange(currentFilters);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setAppliedFilters({});
    prevActiveFiltersRef.current = {};
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
