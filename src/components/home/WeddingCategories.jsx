import React, { useState } from "react";
import categories from "../../data/categories";

// Elegant Category Cards (replaces accordion)
const CategoryAccordion = ({ onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [expandedIndex, setExpandedIndex] = useState(-1); // for mobile tap expand

  const handleEnter = (i) => setHoveredIndex(i);
  const handleLeave = () => setHoveredIndex(-1);
  const toggleExpand = (i) => setExpandedIndex((prev) => (prev === i ? -1 : i));

  return (
    <div className="container py-5 wcg-grid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0 text-dark">Explore by Category</h3>
        <div className="text-muted small">
          Curated for every style and budget
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {categories.map((cat, i) => {
          const isExpanded = expandedIndex === i;
          const previewItems = cat.items.slice(0, 3);
          const remaining = Math.max(cat.items.length - previewItems.length, 0);

          return (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="wcg-card h-100"
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
                onClick={() => toggleExpand(i)}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`Open ${cat.title} category`}
              >
                {/* Image */}
                <div className="wcg-image-wrapper">
                  <img
                    loading="lazy"
                    src={cat.imageSrc}
                    alt={cat.title}
                    className="wcg-image"
                    onError={(e) => {
                      e.currentTarget.src = "logo-no-bg.png";
                      e.currentTarget.style.objectFit = "contain";
                      e.currentTarget.style.padding = "12px";
                      e.currentTarget.style.background = "#fafafa";
                    }}
                  />

                  {/* Soft gradient overlay */}
                  <div className="wcg-overlay" />

                  {/* Title and subtitle over image */}
                  <div className="position-absolute bottom-0 start-0 end-0 p-3 p-md-4 text-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h5 className="mb-1 wcg-heading">{cat.title}</h5>
                        {cat.subtitle && (
                          <div className="small opacity-75">{cat.subtitle}</div>
                        )}
                      </div>
                      <span className="badge wcg-count rounded-pill">
                        {cat.items.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reveal content (hover on desktop, expand on mobile) */}
                <div className="wcg-content">
                  <div className="wcg-pills d-flex flex-wrap gap-2 mb-3">
                    {previewItems.map((it, idx) => (
                      <span key={idx} className="badge rounded-pill px-3 py-2">
                        {it}
                      </span>
                    ))}
                    {remaining > 0 && (
                      <span className="badge bg-white text-muted border rounded-pill px-3 py-2">
                        +{remaining} more
                      </span>
                    )}
                  </div>

                  <div className="wcg-actions d-flex justify-content-between align-items-center">
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(cat);
                      }}
                    >
                      Explore
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(i);
                      }}
                      aria-label="Show subcategories"
                    >
                      {isExpanded ? "Hide" : "Subcategories"}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="wcg-subcats mt-3">
                      <div className="row g-2">
                        {cat.items.map((it, idx) => (
                          <div key={idx} className="col-6">
                            <a href="#" className="wedding-link small">
                              {it}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryAccordion;
