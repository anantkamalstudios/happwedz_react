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
}) => {
  return (
    <div className="home-cta-section my-5">
      <div className="container ui-card">
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
              <h3 className="mb-1 fw-bold home-cta-section-heading">
                {heading}
              </h3>
            )}
            {subHeading && (
              <p className="mb-2 home-cta-section-sub-heading">{subHeading}</p>
            )}
            <hr />
            {title && <h5 className="fw-bold mb-2">{title}</h5>}
            {subtitle && <p className="mb-3">{subtitle}</p>}
            {btnName && link && (
              <Link to={link}>
                <button className="btn cta-btn">{btnName}</button>
              </Link>
            )}
          </div>

          {/* Image - col-4 */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <img
              src={img}
              alt="CTA"
              className="img-fluid rounded"
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaPanel;
