import React from "react";
const AppDownloadSection = () => {
  return (
    <section
      className="container-fluid rounded py-5 mb-5"
      style={{
        background:
          "linear-gradient(90deg, rgba(237,17,115,0.08) 0%, rgba(237,17,115,0.02) 100%)",
        backgroundImage: "url('/images/home/cta1.jpg')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        overflow: "hidden",
      }}
    >
      <div className="container d-none d-lg-flex align-items-center justify-content-center">
        <div className="col-lg-6">
          <div className="rounded-3 ">
            <h6 className="fw-bold mb-3 fs-20 text-center">
              Download The HappyWedz Mobile App Today
            </h6>
            <p className="mb-4 fs-14">
              Plan your wedding on the go with the easy-to-use HappyWedz app.
              Discover top vendors, get wedding inspiration, and manage
              everything in one place.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-4">
              <a
                // href="https://play.google.com/store/apps/details?id=com.wedmegood.wmgapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/cta/playstore.svg"
                  alt="Google Play"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "contain",
                  }}
                />
              </a>
              <a
                // href="https://apps.apple.com/in/app/wedmegood/id919447453"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/cta/appstore.svg"
                  alt="Apple Store"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "contain",
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
