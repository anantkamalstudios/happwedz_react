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
          backgroundImage:
            background === "bigleaf"
              ? `linear-gradient(to bottom, #fbcfe8, #f7e0ed, #f8defc), url(${background})`
              : `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="row">
          <div className="col-12 col-md-2 col-lg-1 text-md-end mb-3 mb-md-0">
            <img
              src={logo}
              alt="Logo"
              className="object-fit-cover"
              style={{ maxWidth: "120px", objectFit: "contain" }}
            />
          </div>

          <div className="col-12 col-md-7 mb-3 mb-md-0 d-flex flex-column">
            {heading && (
              <h3 className="mb-3 fw-bold home-cta-section-heading text-decoration-none">
                {heading}
              </h3>
            )}
            {subHeading && (
              <h6 className="my-3 home-cta-section-sub-heading fs-18">
                {subHeading}
              </h6>
            )}
            {title && <h5 className="fw-bold mb-2 mt-2 fs-18">{title}</h5>}
            {subtitle && <p className="mb-3 fs-16">{subtitle}</p>}
            {btnName && link && (
              <div className="d-flex justify-content-center justify-content-md-end w-100 mt-auto mt-3">
                <Link to={link} className="w-100" style={{ maxWidth: "400px" }}>
                  <button
                    className="btn w-100 px-4 py-2"
                    style={{
                      backgroundColor: "#C31162",
                      color: "#fff",
                      minWidth: "200px",
                    }}
                  >
                    {btnName}
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="col-12 col-md-3 text-center text-md-start">
            <img
              src={img}
              alt="CTA"
              className="img-fluid rounded w-100"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaPanel;
