import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

const BlogDetails = ({ post, onBackClick }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post?.id) {
      setLoading(true);
      fetch(`https://happywedz.com/api/blog-deatils/${post.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBlog(data.data);
          }
        })
        .catch((err) => console.error("Error fetching blog details:", err))
        .finally(() => setLoading(false));
    }
  }, [post]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"; // A fallback image
    }
    if (path.startsWith("https://happywedz.com:4000/")) {
      return path.replace("https://happywedz.com:4000/", "https://happywedzbackend.happywedz.com/");
    }
    return `https://happywedzbackend.happywedz.com/${path}`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Published":
        return "bg-success";
      case "Draft":
        return "bg-warning";
      case "Archived":
        return "bg-secondary";
      default:
        return "bg-primary";
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading blog...</p>;
  }

  if (!blog) {
    return <p className="text-center py-5 text-danger">Blog not found.</p>;
  }

  return (
    <div style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
      {/* Hero Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Meta Information */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <div className="d-flex align-items-center mb-4 gap-3">
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                      style={{
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        padding: 0,
                        fontSize: "1.2rem",
                      }}
                      onClick={onBackClick}
                      aria-label="Back"
                    >
                      <FaChevronLeft />
                    </button>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                      {blog.category}
                    </span>
                  </div>
                  <span
                    className={`badge ${getStatusBadgeClass(
                      blog.status
                    )} px-3 py-2`}
                  >
                    {blog.status}
                  </span>
                </div>
                <small className="text-muted">
                  {formatDate(blog.createdDate)}
                </small>
              </div>

              {/* Title */}
              <h1 className="display-5 fw-bold mb-4 lh-base">{blog.title}</h1>

              {/* Author and Read Time */}
              <div className="d-flex align-items-center mb-4 text-muted">
                <div className="me-4">
                  <i className="bi bi-person-circle me-2"></i>
                  By {blog.author}
                </div>
                <div>
                  <i className="bi bi-clock me-2"></i>
                  {blog.readTime}
                </div>
              </div>

              {/* Featured Image */}
              {blog.images?.length > 0 && (
                <div className="mb-5">
                  <img
                    src={getImageUrl(blog.images?.[0])}
                    alt={blog.title}
                    className="img-fluid rounded-3 shadow-sm w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="content-area">
                <div
                  className="lead mb-4 text-muted"
                  style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
                >
                  {blog.shortDescription}
                </div>

                <div
                  dangerouslySetInnerHTML={{ __html: blog.fullDescription }}
                  style={{ fontSize: "1rem", lineHeight: "1.8", color: "#333" }}
                >
                </div>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="mt-5 pt-4 border-top">
                  <h5 className="fw-bold mb-3">Tags</h5>
                  <div>
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-light text-dark me-2 mb-2 px-3 py-2 rounded-pill border"
                        style={{ fontSize: "0.9rem" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
