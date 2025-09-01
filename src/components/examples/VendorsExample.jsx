import React, { useState } from "react";
import { useVendors } from "../../hooks/useVendors";

const VendorsExample = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVendorType, setSelectedVendorType] = useState(null);
  const [location, setLocation] = useState("");

  // Use the vendors hook with dynamic parameters
  const {
    vendors,
    loading,
    error,
    pagination,
    refreshVendors,
    loadMore,
    hasMore,
    createVendor,
    updateVendor,
    deleteVendor,
  } = useVendors({
    search: searchTerm,
    categoryId: selectedCategory,
    vendorType: selectedVendorType,
    location: location,
    limit: 10,
    autoFetch: true,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value || null);
  };

  const handleVendorTypeChange = (e) => {
    setSelectedVendorType(e.target.value || null);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleRefresh = () => {
    refreshVendors();
  };

  const handleLoadMore = () => {
    loadMore();
  };

  const handleCreateVendor = async () => {
    const newVendor = {
      name: "New Test Vendor",
      description: "This is a test vendor created via the API",
      vendor_type: "venue",
      category_id: 3,
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        address: "Test Address",
        country: "India",
      },
      starting_price: "100000",
      currency: "INR",
      capacity_min: 100,
      capacity_max: 500,
    };

    const result = await createVendor(newVendor);
    if (result) {
      alert("Vendor created successfully!");
    }
  };

  // Loading state
  if (loading && vendors.length === 0) {
    return (
      <div className="container mt-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading vendors...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Vendors</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-outline-danger" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2>Vendors Example - Dynamic API Integration</h2>
          <p className="text-muted">
            This component demonstrates the useVendors hook with search,
            filtering, and pagination.
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label htmlFor="search" className="form-label">
            Search
          </label>
          <input
            type="text"
            className="form-control"
            id="search"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search vendors..."
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="category"
            value={selectedCategory || ""}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="1">Venues</option>
            <option value="2">Photography</option>
            <option value="3">Catering</option>
            <option value="4">Wedding Planners</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="vendorType" className="form-label">
            Vendor Type
          </label>
          <select
            className="form-select"
            id="vendorType"
            value={selectedVendorType || ""}
            onChange={handleVendorTypeChange}
          >
            <option value="">All Types</option>
            <option value="venue">Venue</option>
            <option value="photography">Photography</option>
            <option value="catering">Catering</option>
            <option value="planner">Wedding Planner</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter location..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row mb-4">
        <div className="col-12">
          <button className="btn btn-primary me-2" onClick={handleRefresh}>
            Refresh Data
          </button>
          <button className="btn btn-success me-2" onClick={handleCreateVendor}>
            Create Test Vendor
          </button>
          <span className="badge bg-info">
            Total: {pagination.total} vendors
          </span>
        </div>
      </div>

      {/* Vendors List */}
      <div className="row">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <img
                src={vendor.image}
                className="card-img-top"
                alt={vendor.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{vendor.name}</h5>
                <p className="card-text text-muted">{vendor.location}</p>
                <p className="card-text">{vendor.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-warning text-dark">
                      ⭐ {vendor.rating} ({vendor.reviews} reviews)
                    </span>
                  </div>
                  <div>
                    <span className="badge bg-success">{vendor.price}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Capacity: {vendor.capacity} | Type: {vendor.vendor_type}
                  </small>
                </div>
              </div>
              <div className="card-footer">
                <button className="btn btn-outline-primary btn-sm w-100">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="row mt-4">
          <div className="col-12 text-center">
            <button
              className="btn btn-outline-primary"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More Vendors"}
            </button>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="text-center text-muted">
            Showing {vendors.length} of {pagination.total} vendors
            {pagination.totalPages > 1 && (
              <span>
                {" "}
                | Page {pagination.page} of {pagination.totalPages}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="row mt-4">
        <div className="col-12">
          <details>
            <summary>Debug Information</summary>
            <pre className="bg-light p-3 mt-2">
              {JSON.stringify(
                {
                  searchTerm,
                  selectedCategory,
                  selectedVendorType,
                  location,
                  pagination,
                  hasMore,
                  loading,
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default VendorsExample;
