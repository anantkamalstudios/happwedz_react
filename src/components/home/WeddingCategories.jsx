
import React, { useState } from "react";
import categories from "../../data/categories";
const CategoryAccordion = () => {


  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4 text-dark">Top Categories</h3>
      <div className="row g-3">
        {categories.map((cat, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="col-12 col-md-6">
              <div className="category-accordion">
                <div
                  role="button"
                  className="header-bar d-flex align-items-center justify-content-between"
                  style={{ background: cat.bgColor }}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <div className="title-block">
                    <div className="title-row d-flex align-items-center">
                      <h5 className="mb-0 me-2">{cat.title}</h5>
                      <div className={`chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="#1f2d3a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="subtitle">{cat.subtitle}</div>
                  </div>
                  <div className="circle-img-wrapper"
                  >
                    <img loading="lazy" src={cat.imageSrc} alt={cat.title} />
                  </div>
                </div>

                <div className={`expandable ${isOpen ? "show" : ""}`}>
                  <div className="row">
                    {cat.items.map((it, idx) => (
                      <div key={idx} className="col-6 col-lg-4 py-2">
                        <a href="#" className="item-link">
                          {it}
                        </a>
                      </div>
                    ))}
                  </div>
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

