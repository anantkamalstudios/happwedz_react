// TopFilter.jsx
import React from "react";
import { Dropdown, Form } from "react-bootstrap";
import { CiFilter } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import ViewSwitcher from "../Main/ViewSwitcher";

const TopFilter = ({
  view,
  setView,
  filters,
  activeFilters,
  appliedFilters = {},
  onToggleFilter,
  onClearFilters,
  onApplyFilters,
  isFilterActive,
  getActiveCount,
  hasPendingChanges = false,
}) => {
  const handleCheckbox = (group, value) => {
    onToggleFilter(group, value);
  };

  const clearFilters = () => onClearFilters();

  // Capitalize helper
  const capitalize = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const renderDropdown = (group, options) => {
    const selectedCount = getActiveCount(group);

    return (
      <Dropdown
        key={group}
        className="main-filter-dropdown filter-dropdown"
        drop="down"
        autoClose="outside"
      >
        <Dropdown.Toggle
          bsPrefix="custom-toggle"
          variant="outline-secondary"
          id={`dropdown-${group}`}
          className="d-flex align-items-center justify-content-between filter-dropdown-toggle"
          style={{
            minWidth: "180px",
            border: "1px solid #dee2e6",
            backgroundColor: "#fff",
            padding: "8px 12px",
            fontSize: "14px",
          }}
        >
          <span className="d-flex align-items-center gap-2 me-2 fs-14 text-capitalize">
            <CiFilter size={16} />
            {capitalize(group)}
            {selectedCount > 0 && (
              <span className="badge primary-bg rounded-circle fs-10">
                {selectedCount}
              </span>
            )}
          </span>
          <FaChevronDown size={12} />
        </Dropdown.Toggle>

        <Dropdown.Menu
          flip={false}
          className="main-filter-dropdown-menu filter-dropdown-menu fs-20"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            minWidth: "250px",
            padding: "5px 2rem",
            zIndex: 1000,
          }}
        >
          {options.map((option) => {
            const key = `${group}-${option}`;
            return (
              <Dropdown.Item
                key={key}
                as="div"
                className="p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Form.Check
                  type="checkbox"
                  id={key}
                  label={
                    <span className="fs-14 text-capitalize">
                      {capitalize(option)}
                    </span>
                  }
                  className="mb-0 px-3 py-2 main-filter-checkbox"
                  checked={isFilterActive(group, option)}
                  onChange={() => handleCheckbox(group, option)}
                />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const isAnyFilterSelected =
    activeFilters && Object.keys(activeFilters).length > 0;

  return (
    <div
      className="aside-filters-container bg-white border-bottom mb-4"
      style={{
        position: "sticky",
        top: "0",
        zIndex: 99,
        backgroundColor: "white",
      }}
    >
      <div className="container-fluid px-3 px-md-4">
        {/* First Row: Filter Dropdowns - Full Width */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2 align-items-center py-3">
              {Object.entries(filters).map(([group, options]) =>
                renderDropdown(group, options)
              )}
            </div>
          </div>
        </div>

        {/* Second Row: Action Buttons and View Switcher */}
        <div className="row pt-3 pb-2">
          <div className="col-12 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            {/* Active Filters Badges */}
            {isAnyFilterSelected && (
              <div className="d-flex flex-wrap gap-2 align-items-center flex-grow-1">
                <small className="text-muted me-2 fw-semibold fs-16">
                  Active filters:
                </small>
                {Object.entries(activeFilters).map(([group, values]) =>
                  values.map((value) => (
                    <span
                      key={`${group}-${value}`}
                      className="badge bg-white text-dark border d-flex align-items-center gap-1 fs-12 text-capitalize py-2 px-2"
                      style={{ cursor: "pointer" }}
                    >
                      {capitalize(value)}
                      <button
                        type="button"
                        className="btn-close btn-close-sm ms-1 fs-12"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => handleCheckbox(group, value)}
                        aria-label="Remove filter"
                      ></button>
                    </span>
                  ))
                )}
              </div>
            )}

            {/* Action Buttons and View Switcher */}
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              {isAnyFilterSelected && (
                <>
                  {hasPendingChanges && onApplyFilters && (
                    <button
                      className="btn btn-primary btn-sm d-flex align-items-center gap-1 px-3"
                      onClick={onApplyFilters}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <MdCheck size={18} />
                      Apply
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3"
                    onClick={clearFilters}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <MdClear size={18} />
                    Clear
                  </button>
                </>
              )}
              <ViewSwitcher view={view} setView={setView} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopFilter;
