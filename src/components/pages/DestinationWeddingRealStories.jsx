

export default function RealWeddingsStatic() {
  return (
    <div className="real-weddings">



      {/* STATIC GALLERY */}
      <section className="gallery-section py-5">
        <div className="container">

          <div className="d-flex justify-content-center align-items-center m-2">
            <h1 className="mb-4" style={{ color: "#e91e63" }}>
              Real People: Real Stories
            </h1>
          </div>


          <div className="row justify-content-center">

            {/* CARD 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="wedding-card h-100 shadow-sm rounded-3 overflow-hidden">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop"

                    alt="Wedding 1"
                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 end-0 text-white p-3"
                    style={{ background: "rgba(195, 17, 98, 0.7)" }}
                  >
                    18 Photos
                  </div>
                </div>

                <div className="p-3 text-center">
                  <h3 className="fw-bold mb-0">Aarav</h3>
                  <h4 className="fw-bold mb-0">And</h4>
                  <h3 className="fw-bold mb-0">Riya</h3>

                  <h4 className="mt-3 primary-text">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    Jaipur
                  </h4>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="wedding-card h-100 shadow-sm rounded-3 overflow-hidden">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=300&fit=crop"
                    alt="Wedding 2"
                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 end-0 text-white p-3"
                    style={{ background: "rgba(195, 17, 98, 0.7)" }}
                  >
                    22 Photos
                  </div>
                </div>

                <div className="p-3 text-center">
                  <h3 className="fw-bold mb-0">Kabir</h3>
                  <h4 className="fw-bold mb-0">And</h4>
                  <h3 className="fw-bold mb-0">Sana</h3>

                  <h4 className="mt-3 primary-text">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    Goa
                  </h4>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="wedding-card h-100 shadow-sm rounded-3 overflow-hidden">
                <div className="position-relative">
                  <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop"
                    alt="Wedding 3"
                    style={{ width: "100%", height: "400px", objectFit: "cover" }}
                  />
                  <div
                    className="position-absolute bottom-0 end-0 text-white p-3"
                    style={{ background: "rgba(195, 17, 98, 0.7)" }}
                  >
                    30 Photos
                  </div>
                </div>

                <div className="p-3 text-center">
                  <h3 className="fw-bold mb-0">Rohan</h3>
                  <h4 className="fw-bold mb-0">And</h4>
                  <h3 className="fw-bold mb-0">Meera</h3>

                  <h4 className="mt-3 primary-text">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    Udaipur
                  </h4>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
