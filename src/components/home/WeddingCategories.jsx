import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://happywedz.com";
import { IMAGE_BASE_URL } from "../../config/constants";

const CategoryAccordion = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);

  const toggleExpand = (i) => setExpandedIndex((prev) => (prev === i ? -1 : i));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/vendor-types/with-subcategories/all`
        );
        const apiData = response.data.map((cat) => ({
          id: cat.id,
          title: cat.name,
          subtitle: cat.description,
          imageSrc: cat.hero_image
            ? `${IMAGE_BASE_URL}${cat.hero_image}`
            : "logo-no-bg.png",
          slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
          items: cat.subcategories.map((sub) => sub.name),
        }));
        setCategories(apiData);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center text-danger">{error}</div>
    );
  }

  // Only show the first 6 cards
  const displayedCategories = categories.slice(0, 6);

  return (
    <div className="container py-5 wcg-grid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0 text-dark">Explore by Category</h3>
        <div className="text-muted small">
          Curated for every style and budget
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {displayedCategories.map((cat, i) => {
          const isExpanded = expandedIndex === i;
          const previewItems = cat.items.slice(0, 3);
          const remaining = Math.max(cat.items.length - previewItems.length, 0);

          return (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="wcg-card h-100"
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

                  {/* Title and subtitle */}
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

                {/* Reveal content */}
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
                    <Link
                      to={`/${cat.slug}`}
                      type="button"
                      className="btn btn-primary rounded-pill px-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(cat);
                      }}
                    >
                      Explore
                    </Link>
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
                            <Link
                              to={`/${cat.slug}`}
                              className="wedding-link small"
                            >
                              {it}
                            </Link>
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
