import React from "react";
import tools from "../../data/planningToolsCTA";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

const PlanningToolsCTA = () => {
  return (
    <>
      <section className="planning-tools-section px-3 py-3">
        <div className="container">
          <div className="text-center mb-6">
            <h3 className="fw-bold mb-4 display-5 primary-text">
              Plan Your Perfect Day
            </h3>
            <p className="fs-26 mb-3" data-aos="fade-up" data-aos-delay="50">
              Streamline your wedding planning with our intuitive tools and
              resources
            </p>
            {/* <div
              className="divider mx-auto mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            ></div> */}
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
                <div className="tool-card h-100 text-start p-5 rounded-1 bg-white position-relative overflow-hidden d-flex flex-column">
                  <div className="decorative-border"></div>

                  <div className="tool-card-icon-wrapper d-inline-flex align-items-center justify-content-center rounded-circle mb-4">
                    <img
                      loading="lazy"
                      src={tool.icon}
                      alt={tool.title}
                      className="tool-icon-img"
                    />
                  </div>

                  <h3 className="h5 fw-normal mb-3">{tool.title}</h3>
                  <p className="text-muted mb-4">{tool.description}</p>

                  {/* Button always bottom-right */}
                  <div className="mt-auto d-flex justify-content-end">
                    <Link
                      to={`/user-dashboard/${tool.url}`}
                      className="btn btn-link  d-flex justify-content-end text-decoration-none p-0 wedding-link d-flex align-items-center gap-2 text-decoration-underline"
                    >
                      Explore Tool
                      <HiArrowRight size={18} />
                    </Link>
                  </div>
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
