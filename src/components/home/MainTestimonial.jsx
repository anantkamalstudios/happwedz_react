import React from "react";

const MainTestimonial = () => {
  return (
    <div className="container my-5 custom-testimonial-section">
      <div className="row">
        {/* Left Side */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="custom-testimonial-box text-center shadow p-4">
            <h2 className="custom-heading">What Our Couples Say</h2>
            <p className="custom-subtext">
              Real stories from real couples who made their dream wedding come
              true
            </p>
            <div className="custom-floral-graphic"></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-md-6 d-flex flex-column gap-5">
          {/* Testimonial Item */}
          <div className="custom-image-card-wrapper position-relative">
            <img
              src="https://images.unsplash.com/photo-1597427681188-3ef80f2631ff?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Bride"
              className="custom-image real-image"
            />
            <div className="custom-testimonial-card shadow">
              <h5 className="mb-1">Daniella O’Niel</h5>
              <div className="custom-stars">★★★★★</div>
              <p className="mb-0 small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                dapibus placerat velit. Donec in porttitor elit. Suspendisse
                accumsan iaculis tincidunt.
              </p>
            </div>
          </div>

          {/* Duplicate second card */}
          <div className="custom-image-card-wrapper position-relative">
            <img
              src="https://images.unsplash.com/photo-1743685102554-ef8e4eb11415?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Bride"
              className="custom-image real-image"
            />
            <div className="custom-testimonial-card shadow">
              <h5 className="mb-1">Daniella O’Niel</h5>
              <div className="custom-stars">★★★★★</div>
              <p className="mb-0 small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                dapibus placerat velit. Donec in porttitor elit. Suspendisse
                accumsan iaculis tincidunt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainTestimonial;
