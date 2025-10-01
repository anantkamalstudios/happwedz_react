import React from "react";
import { FaList, FaTh } from "react-icons/fa";

const ViewSwitcher = ({ view, setView }) => {
  return (
    <div className="view-switcher-wrapper rounded-4">
      <div className="view-switcher d-flex gap-2">
        <button
          onClick={() => setView("images")}
          className={view === "images" ? "switch-btn active" : "switch-btn"}
        >
          <FaTh className="me-1" /> GRID
        </button>
        <button
          onClick={() => setView("list")}
          className={view === "list" ? "switch-btn active" : "switch-btn"}
        >
          <FaList className="me-1" /> LIST
        </button>
      </div>
    </div>
  );
};

export default ViewSwitcher;
