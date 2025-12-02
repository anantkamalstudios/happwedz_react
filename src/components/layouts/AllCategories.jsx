import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = "https://happywedz.com";
import ShimmerCards from "../ui/ShimmerCards";
import ErrorState from "../ui/ErrorState";

const AllCategories = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const navigate = useNavigate();

  const toggleExpand = (i) => setExpandedIndex((prev) => (prev === i ? -1 : i));

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/vendor-types/with-subcategories/all`
      );
      const apiData = response.data.map((cat) => {
        const imageSrc = cat.hero_image
          ? "https://happywedzbackend.happywedz.com" + cat.hero_image
          : "logo-no-bg.png";
        return {
          id: cat.id,
          title: cat.name,
          subtitle: cat.description,
          imageSrc,
          slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
          items: cat.subcategories.map((sub) => sub.name),
        };
      });
      setCategories(apiData);
    } catch (err) {
      setError("Failed to load categories. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return <ShimmerCards count={12} />;
  }

  if (error) {
    return (
      <ErrorState
        title="We couldn’t load the categories"
        message={`${error} Check your connection and try again in a moment.`}
        onRetry={fetchCategories}
      />
    );
  }

  return (
    <div className="container py-5 wcg-grid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0 text-dark">Explore by Category</h3>
      </div>

      <div className="row g-3 g-md-4">
        {categories.map((cat, i) => {
          const isExpanded = expandedIndex === i;
          const previewItems = cat.items.slice(0, 3);
          const remaining = Math.max(cat.items.length - previewItems.length, 0);

          return (
            <div key={i} className="col-12 col-sm-6 col-lg-4">
              <div
                className="wcg-card h-100 p-2"
                onClick={() => toggleExpand(i)}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`Open ${cat.title} category`}
              >
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                  <div className="ratio ratio-4x3 position-relative">
                    <img
                      src={cat.imageSrc}
                      alt={cat.title}
                      loading="lazy"
                      className="card-img-top rounded-4"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src = "logo-no-bg.png";
                        e.currentTarget.style.objectFit = "contain";
                        e.currentTarget.style.padding = "12px";
                        e.currentTarget.style.background = "#fafafa";
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="d-flex align-items-center justify-content-between my-2">
                    <div>
                      <h5 className="my-2">{cat.title}</h5>
                    </div>
                  </div>
                  <div className=" pills d-flex flex-wrap gap-2 mb-3">
                    {previewItems.slice(0, 1).map((it, idx) => (
                      <span
                        key={idx}
                        className="badge rounded-0 px-3 py-2 primary-light-bg text-dark"
                      >
                        {/* {it} */}
                      </span>
                    ))}
                    {/*
                    {remaining > 0 && (
                      <span className="text-decoration-underline primary-text px-3 py-2 fs-12 text-end">
                        +{remaining} more
                      </span>
                    )} */}
                  </div>

                  <div className="wcg-actions d-flex justify-content-between align-items-center mb-2">
                    <button
                      type="button"
                      className="btn btn-primary rounded-2 px-3 fs-16"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelect) onSelect(cat);
                        if (cat.title) {
                          const encoded = encodeURIComponent(cat.title);
                          navigate(`/vendors/all?vendorType=${encoded}`);
                        }
                      }}
                    >
                      Explore {cat.title}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="wcg-subcats mt-3">
                      <div className="d-flex flex-wrap justify-content-start gap-2">
                        {cat.items.map((it, idx) => (
                          <div key={idx} className="">
                            <Link
                              to={
                                cat.title.toLowerCase() === "venues"
                                  ? `/venues/${it
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`
                                  : `/vendor/${it
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`
                              }
                              className="badge rounded-0 primary-light-bg text-dark fs-12 px-3 py-2"
                              style={{ textDecoration: "none" }}
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

export default AllCategories;
