// DynamicAside.jsx
import React from "react";
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

  // Notify parent when filters change
  React.useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(activeFilters);
    }
  }, [activeFilters, onFiltersChange]);

  return (
    <TopFilter
      view={view}
      setView={setView}
      filters={filters}
      activeFilters={activeFilters}
      onToggleFilter={toggleFilter}
      onClearFilters={clearFilters}
      isFilterActive={isFilterActive}
      getActiveCount={getActiveCount}
    />
  );
};

export default DynamicAside;
