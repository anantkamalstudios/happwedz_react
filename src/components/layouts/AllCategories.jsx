import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { List, Grid } from "lucide-react";
import CardComponent from "../../components/home/components/CardComponent";

const API_BASE_URL = "https://happywedz.com";
import { IMAGE_BASE_URL } from "../../config/constants";

const AllCategories = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [view, setView] = useState("list");

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

  return (
    <div className="w-100">
      {/* Grid List layout Start*/}

      <div
        style={{
          width: "full",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          backgroundColor: "#fbcfe3ff",
          marginTop: "10px",
        }}
      >
        <div style={{ width: "full", padding: "1.5rem 2.5rem" }}>
          <div className="d-flex justify-content-end align-items-center gap-4">
            <button
              style={{
                color: "#C31162",
                border: "2px solid #C31162",
                padding: "6px 20px",
                backgroundColor: "#fff",
              }}
            >
              Need Help ? Smart Picks for You.....
            </button>

            <div className="d-flex align-items-center justify-content-center">
              <div
                className="btn-group rounded shadow overflow-hidden"
                role="group"
                style={{
                  backgroundColor: "#fff",
                  padding: "4px",
                }}
              >
                <button
                  type="button"
                  className="btn d-flex align-items-center justify-content-center px-4 py-2"
                  onClick={() => setView("list")}
                  style={{ backgroundColor: "#fff", color: "#C31162" }}
                >
                  <List size={22} />
                </button>

                <button
                  type="button"
                  className="btn d-flex align-items-center justify-content-center px-4 py-2"
                  onClick={() => setView("grid")}
                  style={{ backgroundColor: "#C31162", color: "#fff" }}
                >
                  <Grid size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Grid List layout End*/}
      <div className="container py-5 wcg-grid">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="fw-bold mb-0 text-dark">Wedding Venues in Mumbai</h3>
        </div>

        <div className="row g-3 g-md-4 gap-4">
          {/* {categories.map((cat, i) => {
            const isExpanded = expandedIndex === i;
            const previewItems = cat.items.slice(0, 3);
            const remaining = Math.max(
              cat.items.length - previewItems.length,
              0
            );

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
                    <div className="wcg-  pills d-flex flex-wrap gap-2 mb-3">
                      {previewItems.slice(0, 1).map((it, idx) => (
                        <span
                          key={idx}
                          className="badge rounded-0 px-3 py-2 primary-light-bg text-dark"
                        >
                          {it}
                        </span>
                      ))}

                      {remaining > 0 && (
                        <span className="text-decoration-underline primary-text px-3 py-2 fs-12 text-end">
                          +{remaining} more
                        </span>
                      )}
                    </div>

                    <div className="wcg-actions d-flex flex-column h-100">
                      <div className="mt-auto d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-primary rounded-2 px-3"
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
                    </div>

                    {isExpanded && (
                      <div className="wcg-subcats mt-3">
                        <div className="row g-2">
                          {cat.items.map((it, idx) => (
                            <div key={idx} className="col-6">
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
          })} */}

          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
