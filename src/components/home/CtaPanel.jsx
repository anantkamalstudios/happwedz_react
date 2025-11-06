import { Link } from "react-router-dom";

const CtaPanel = ({
  logo,
  img,
  title,
  link,
  subtitle,
  btnName,
  heading,
  subHeading,
  background,
}) => {
  return (
    <div className="home-cta-section my-5">
      <div
        className="container ui-card"
        style={{
          background:
            background === "bigleaf"
              ? `linear-gradient(to bottom, #fbcfe8, #f7e0ed, #f8defc), url(${background})`
              : `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="row ">
          {/* Logo - col-2 */}
          <div className="col-12 col-md-1 text-md-end mb-3 mb-md-0">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "100px", objectFit: "contain" }}
            />
          </div>

          {/* Text content - col-6 */}
          <div className="col-12 col-md-7 mb-3 mb-md-0">
            {heading && (
              <h3 className="mb-1 fw-bold home-cta-section-heading text-decoration-underline">
                {heading}
              </h3>
            )}
            {subHeading && (
              <p className="my-4 home-cta-section-sub-heading fs-36">
                {subHeading}
              </p>
            )}
            {title && <h5 className="fw-bold mb-2 fs-24">{title}</h5>}
            {subtitle && <p className="mb-0 fs-20">{subtitle}</p>}
            {btnName && link && (
              <div className="d-flex justify-content-end w-100">
                <Link to={link}>
                  <button
                    className="btn"
                    style={{
                      padding: "10px 8rem",
                      backgroundColor: "#C31162",
                      color: "#fff",
                    }}
                  >
                    {btnName}
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Image - col-4 */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <img
              src={img}
              alt="CTA"
              className="img-fluid rounded w-100 object-fit-cover"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaPanel;
