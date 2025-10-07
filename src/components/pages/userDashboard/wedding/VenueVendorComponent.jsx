import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

const VenueVendorComponent = () => {
  return (
    <div
      style={{
        maxWidth: "100%",
        boxShadow:
          " rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        flex: 1,
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h2>Book all your Vendors</h2>
        <div className="d-flex justify-content-around align-items-center">
          <h5 style={{ width: "66%" }}>
            Here are some gems we recommand for you
          </h5>
          <div
            style={{
              width: "30%",
              border: "2px solid #C31162",
              borderColor: "#C31162",
              outline: "none",
            }}
          >
            <select
              name="vendors"
              id="vendor"
              style={{ border: "2px solid transparent" }}
            >
              <option value="vendor">Vendor</option>
            </select>
          </div>
        </div>
        <div
          className="d-flex justify-content-around align-items-center"
          style={{ position: "relative" }}
        >
          {/* Cards */}
          <div
            className="card border-0 shadow-sm overflow-hidden p-2"
            style={{ maxWidth: "30%" }}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1759528278887-71c168973ad1?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top w-100"
                alt="Banquet Hall"
                style={{
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Name</h5>
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
                location, state
              </p>
            </div>
          </div>
          {/* Icons */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <FaAngleLeft
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            />
            <FaAngleRight
              style={{
                height: "25px",
                width: "25px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            />
          </div>
          <div
            className="card border-0 shadow-sm overflow-hidden p-2"
            style={{ maxWidth: "30%" }}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1759528278887-71c168973ad1?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top w-100"
                alt="Banquet Hall"
                style={{
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Name</h5>
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
                location, state
              </p>
            </div>
          </div>
          <div
            className="card border-0 shadow-sm overflow-hidden p-2"
            style={{ maxWidth: "30%" }}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1759528278887-71c168973ad1?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top w-100"
                alt="Banquet Hall"
                style={{
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Name</h5>
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
                location, state
              </p>
            </div>
          </div>
        </div>
        <div
          style={{ display: "flex", justifyContent: "end", marginTop: "2rem" }}
        >
          <button
            style={{
              padding: "5px 3.5rem",
              border: "1px solid #C31162",
              backgroundColor: "#C31162",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueVendorComponent;
