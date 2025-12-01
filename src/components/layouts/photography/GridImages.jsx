import React from "react";
import { Link } from "react-router-dom";

const GridImages = ({ category, searchQuery, photos }) => {
  const filteredImages = photos
    .map((img) => {
      let url = img.images?.[0]?.trim();
      let fallbackUrl = null;

      if (url?.startsWith("http://happywedz.com/uploads/photography/")) {
        url = url.replace(
          "http://happywedz.com",
          "https://happywedzbackend.happywedz.com"
        );
        // Extract filename and create fallback URL for blogs folder
        const filename = url.split("/").pop();
        fallbackUrl = `https://happywedzbackend.happywedz.com/uploads/blogs/${filename}`;
      }
      if (url?.startsWith("https://happywedz.com/uploads/photography/")) {
        url = url.replace(
          "https://happywedz.com",
          "https://happywedzbackend.happywedz.com"
        );
        // Extract filename and create fallback URL for blogs folder
        const filename = url.split("/").pop();
        fallbackUrl = `https://happywedzbackend.happywedz.com/uploads/blogs/${filename}`;
      }
      if (url?.startsWith("https://happywedz.com/uploads/blogs/")) {
        url = url.replace(
          "https://happywedz.com",
          "https://happywedzbackend.happywedz.com"
        );
      }

      return { ...img, url, fallbackUrl };
    })
    .filter((img) => {
      const matchesCategory =
        category === "all" ||
        img.photography_type_id === category ||
        img.photography_type_id === Number(category);

      const searchLower = searchQuery?.toLowerCase() || "";
      const matchesSearch =
        !searchQuery ||
        img.title?.toLowerCase().includes(searchLower) ||
        img.description?.toLowerCase().includes(searchLower) ||
        img.photographer_name?.toLowerCase().includes(searchLower) ||
        img.city_name?.toLowerCase().includes(searchLower) ||
        img.tags?.some((tag) => tag.toLowerCase().includes(searchLower));

      return matchesCategory && matchesSearch;
    });

  return (
    <div className="py-5 container">
      <div className="masonry">
        {filteredImages.length === 0 && (
          <div className="text-center text-muted">No images found.</div>
        )}
        {filteredImages
          .filter((img) => img.status === "active")
          .map((img, index) => (
            <div key={index} className="masonry-item">
              <Link
                to={`/photography/details/${img.id}`}
                className="text-decoration-none"
                style={{ cursor: "pointer" }}
              >
                <div className="card border-0 shadow-sm">
                  <img
                    src={
                      img.url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={img.title || "No Title"}
                    className="card-img-top"
                    loading="lazy"
                    onError={(e) => {
                      if (img.fallbackUrl && e.target.src !== img.fallbackUrl) {
                        e.target.src = img.fallbackUrl;
                      } else {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }
                    }}
                  />
                  <div className="card-body p-2">
                    <h6 className="mb-1 fs-16">{img.title || "No Title"}</h6>
                    <small className="text-muted fs-14">
                      {img.city_name || "No City"}
                    </small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GridImages;
