// TopFilter.jsx
import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { CiFilter } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { MdClear } from "react-icons/md";
import ViewSwitcher from "../Main/ViewSwitcher";

const TopFilter = ({ view, setView, filters }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleCheckbox = (group, value) => {
    const key = `${group}-${value}`;
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const clearFilters = () => setSelectedFilters({});

  const getSelectedCount = (group) =>
    Object.keys(selectedFilters).filter(
      (k) => k.startsWith(group) && selectedFilters[k]
    ).length;

  // Capitalize helper
  const capitalize = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const renderDropdown = (group, options) => {
    const selectedCount = getSelectedCount(group);

    return (
      <Dropdown key={group} className="main-filter-dropdown filter-dropdown">
        <Dropdown.Toggle
          bsPrefix="custom-toggle"
          variant="outline-secondary"
          id={`dropdown-${group}`}
          className="d-flex align-items-center justify-content-between filter-dropdown-toggle"
          style={{ minWidth: "180px" }}
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
          className="main-filter-dropdown-menu filter-dropdown-menu fs-20"
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            minWidth: "250px",
            padding: "5px 2rem",
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
                  checked={!!selectedFilters[key]}
                  onChange={() => handleCheckbox(group, option)}
                />
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const isAnyFilterSelected = Object.values(selectedFilters).some(Boolean);

  return (
    <div className="aside-filters-container bg-white border-bottom py-3 mb-4">
      <div className="container-fluid">
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between flex-md-nowrap flex-wrap">
          {/* Filters Dropdowns */}
          <div className="d-flex flex-wrap gap-3 align-items-center flex-grow-1">
            {Object.entries(filters).map(([group, options]) =>
              renderDropdown(group, options)
            )}
          </div>

          {/* Cancel Button and View Switcher */}
          <div className="d-flex align-items-center gap-2 ms-auto mt-2 mt-md-0">
            {isAnyFilterSelected && (
              <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                onClick={clearFilters}
              >
                <MdClear size={18} />
                Clear All
              </button>
            )}
            <ViewSwitcher view={view} setView={setView} />
          </div>
        </div>

        {isAnyFilterSelected && (
          <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
            <small className="text-muted me-2">Active filters:</small>
            {Object.entries(selectedFilters)
              .filter(([_, selected]) => selected)
              .map(([key]) => {
                const [group, value] = key.split("-");
                return (
                  <span
                    key={key}
                    className="badge bg-light text-dark border d-flex align-items-center gap-1 fs-14 text-capitalize"
                  >
                    {capitalize(value)}
                    <button
                      type="button"
                      className="btn-close btn-close-sm"
                      style={{ fontSize: "0.6rem" }}
                      onClick={() => handleCheckbox(group, value)}
                    ></button>
                  </span>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopFilter;
