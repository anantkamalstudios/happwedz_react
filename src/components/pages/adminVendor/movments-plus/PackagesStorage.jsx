import React from "react";

const PackagesStorage = () => {
  return (
    <div className="p-4">
      <h2 className="mb-4 fw-bold" style={{ color: "#2c3e50" }}>
        Packages & Storage
      </h2>
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">Manage your packages and storage</h5>
          <p className="text-muted mb-0">
            View your current package details and storage usage. Upgrade your
            plan or manage your storage allocation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackagesStorage;
