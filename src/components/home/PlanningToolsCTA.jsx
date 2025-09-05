import React from "react";
import tools from "../../data/planningToolsCTA";

const PlanningToolsCTA = () => {
  return (
    <>
      <section className="planning-tools-section  px-3 py-3">
        <div className="container">
          <div className="text-center mb-6">
            <h3 className="fw-bold mb-4 text-dark">Plan Your Perfect Day</h3>
            <p
              className="h6 text-muted mb-3"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              Streamline your wedding planning with our intuitive tools and
              resources
            </p>
            <div
              className="divider mx-auto mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            ></div>
            <p
              className="text-muted lead"
              data-aos="fade-up"
              data-aos-delay="150"
            ></p>
          </div>

          <div className="row g-5 justify-content-center">
            {tools.map((tool, idx) => (
              <div
                className="col-lg-4 col-md-6"
                key={idx}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="tool-card h-100 text-center p-5 rounded-4 bg-white position-relative overflow-hidden">
                  <div className="decorative-border"></div>
                  <div className="icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-4 bg-light">
                    <img
                      loading="lazy"
                      src={tool.icon}
                      alt={tool.title}
                      className="tool-icon-img"
                    />
                  </div>

                  <h3 className="h5 fw-normal mb-3">{tool.title}</h3>
                  <p className="text-muted mb-4">{tool.description}</p>
                  <a
                    href={tool.url}
                    className="btn btn-link text-decoration-none p-0 wedding-link"
                  >
                    Explore Tool
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="ms-2"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PlanningToolsCTA;
