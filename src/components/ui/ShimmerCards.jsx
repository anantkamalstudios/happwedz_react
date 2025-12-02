import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ShimmerCards = ({ count = 6 }) => {
  return (
    <div className="container py-5 wcg-grid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Skeleton width={200} height={32} />
      </div>

      <div className="row g-3 g-md-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-4">
            <div className="wcg-card h-100 p-2">
              <div className="shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="ratio ratio-4x3 position-relative">
                  <Skeleton height="100%" borderRadius="1rem" />
                </div>
              </div>

              <div className="pt-2">
                <div className="d-flex align-items-center justify-content-between my-2">
                  <div style={{ width: "70%" }}>
                    <Skeleton height={24} width="80%" className="my-2" />
                  </div>
                </div>

                <div className="pills d-flex flex-wrap gap-2 mb-3">
                  <Skeleton width={100} height={32} borderRadius="0" />
                </div>

                <div className="wcg-actions d-flex justify-content-between align-items-center mb-2">
                  <Skeleton width={140} height={38} borderRadius="0.375rem" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShimmerCards;
