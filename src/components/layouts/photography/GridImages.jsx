import React from "react";

const GridImages = ({ category, searchQuery, photos }) => {
  const filteredImages = photos
    .map((img) => {
      // Take first image from the `images` array
      let url = img.images?.[0]?.trim();

      // Replace old URL prefix with backend prefix
      if (url?.startsWith("http://happywedz.com/uploads/photography/")) {
        url = url.replace(
          "http://happywedz.com",
          "https://happywedzbackend.happywedz.com"
        );
      }
      if (url?.startsWith("https://happywedz.com/uploads/photography/")) {
        url = url.replace(
          "https://happywedz.com",
          "https://happywedzbackend.happywedz.com"
        );
      }

      return { ...img, url }; // add `url` property for rendering
    })
    .filter((img) => {
      const matchesCategory = category === "all" || img.type === category;
      const matchesSearch = img.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="py-5 container">
      <div className="masonry">
        {filteredImages.length === 0 && (
          <div className="text-center text-muted">No images found.</div>
        )}
        {filteredImages.map((img, index) => (
          <div key={index} className="masonry-item">
            <div className="card border-0 shadow-sm">
              <img
                src={
                  img.url || "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={img.title || "No Title"}
                className="card-img-top"
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div className="card-body p-2">
                <h6 className="mb-1">{img.title || "No Title"}</h6>
                <small className="text-muted">{img.type || "No Type"}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridImages;
