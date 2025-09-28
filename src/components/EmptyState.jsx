import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({ section, title }) => {
  const getSuggestions = (section) => {
    switch (section) {
      case "venues":
        return [
          "Banquet Halls",
          "Wedding Resorts",
          "Marriage Garden / Lawns",
          "Destination Wedding Venues",
        ];
      case "vendors":
        return [
          "Wedding Photographers",
          "Wedding Videography",
          "Caterers",
          "Wedding Planners",
        ];
      default:
        return [];
    }
  };

  const suggestions = getSuggestions(section);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="bg-light rounded-4 p-5">
            <div className="mb-4">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto text-muted"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h4 className="text-muted mb-3">No {title} Available</h4>
            <p className="text-muted mb-4">
              We couldn't find any {title.toLowerCase()} in our database at the
              moment. Please try searching for a different category or location.
            </p>

            {suggestions.length > 0 && (
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  💡 Try these popular options instead:
                </h6>
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  {suggestions.map((suggestion) => (
                    <Link
                      key={suggestion}
                      to={`/${section}/${suggestion
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9\-]/g, "")}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </button>
              <Link to="/" className="btn btn-primary">
                <i className="bi bi-house me-2"></i>
                Browse All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
