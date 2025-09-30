import { Link } from "react-router-dom";

const RecommandedPage = () => {
  return (
    <div
      style={{
        padding: "3rem 5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <div>
        <h1 style={{ color: "#C31162" }}>
          Best Recommandations for Your <br /> Celebration
        </h1>
        <p>
          Manage your wedding costs and stay within your budget with HappyWedz
          easy-to-use budget planner.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Recommanded Vendors for You</h1>
          <Link
            style={{
              color: "#C31162",
              fontWeight: "900",
              letterSpacing: "1px",
              fontSize: "1.25rem",
            }}
          >
            SEE MORE
          </Link>
        </div>
        {/* Card Component Start here */}
        <div
          className="card border-0 shadow-sm rounded-4 overflow-hidden p-2"
          style={{ maxWidth: "400px" }}
        >
          <img
            src="https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=800"
            className="card-img-top w-100"
            alt="Banquet Hall"
            style={{ height: "220px", objectFit: "cover", borderRadius: "10%" }}
          />
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">Royal Banquet Hall</h5>
              <p className="rating text-warning small mb-0 mt-1">
                ★<span className="text-muted">5.0 (2 Reviews)</span>
              </p>
            </div>
            <p
              className=" mb-3"
              style={{
                color: "black",
                fontSize: "12px",
              }}
            >
              Hyderabad, Banjara Hills
            </p>

            <div className="d-flex gap-4 mb-3">
              <div>
                <small className="text-muted" style={{ fontSize: "10px" }}>
                  Veg
                </small>
                <div className="price">
                  ₹ 899 <small className="text-muted">per plate</small>
                </div>
              </div>
              <div>
                <small className="text-muted" style={{ fontSize: "10px" }}>
                  Non Veg
                </small>
                <div className="price">
                  ₹ 899 <small className="text-muted">per plate</small>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between gap-2">
              <div className="d-flex justify-content-center align-items-center gap-2">
                <p
                  style={{
                    backgroundColor: "#fdc2daff",
                    fontSize: "12px",
                    padding: "0.25rem 1.25rem",
                    color: "#C31162",
                  }}
                >
                  600 - 1500 pax
                </p>
                <p
                  style={{
                    backgroundColor: "#fdc2daff",
                    fontSize: "12px",
                    padding: "0.25rem 1.25rem",
                    color: "#C31162",
                  }}
                >
                  112 Rooms
                </p>
                <p>
                  <Link
                    style={{
                      color: "#C31162",
                      fontSize: "12px",
                      borderOffSet: "1px",
                    }}
                  >
                    + 5 more
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Card Component End here */}
      </div>
    </div>
  );
};

export default RecommandedPage;
