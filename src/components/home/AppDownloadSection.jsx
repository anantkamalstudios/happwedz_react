import React from "react";
const AppDownloadSection = () => {
  return (
    <section
      className="container rounded py-5 my-5"
      style={{ background: "#ffaacfff" }}
    >
      <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
        <div className="col-lg-6 text-center text-lg-start">
          <h5 className="fw-bold mb-3">
            Download The HappyWedz Mobile App Today
          </h5>
          <p className="mb-4 text-muted">
            Plan your wedding on the go with the easy-to-use HappyWedz app.
            Discover top vendors, get wedding inspiration, and manage everything
            in one place.
          </p>

          <div className="d-flex justify-content-center align-content-center justify-content-lg-start gap-3">
            <a
              href="https://play.google.com/store/apps/details?id=com.wedmegood.wmgapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/cta/google_play_download.png"
                alt="Google Play"
                className="mt-1"
                style={{ height: "85px" }}
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/wedmegood/id919447453"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/cta/app_store_download.png"
                alt="Apple Store"
                style={{ height: "93px" }}
              />
            </a>
          </div>
        </div>
        <div className="col-lg-5 text-center">
          <img
            src="images/download_app.avif"
            alt="Mobile App"
            className="img-fluid"
            style={{ maxHeight: "200px" }}
          />
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
