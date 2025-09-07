import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const BlogDetails = ({ post, onBackClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill me-3">
                    {post.category}
                  </span>
                  <span
                    className={`badge ${getStatusBadgeClass(
                      post.status
                    )} px-3 py-2`}
                  >
                    {post.status}
                  </span>
                </div>
                <small className="text-muted">
                  {formatDate(post.createdDate)}
                </small>
              </div>

              {/* Title */}
              <h1 className="display-5 fw-bold mb-4 lh-base">{post.title}</h1>

              {/* Author and Read Time */}
              <div className="d-flex align-items-center mb-4 text-muted">
                <div className="me-4">
                  <i className="bi bi-person-circle me-2"></i>
                  By {post.author}
                </div>
                <div>
                  <i className="bi bi-clock me-2"></i>
                  {post.readTime}
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-5">
                <img
                  src={post.image}
                  alt={post.title}
                  className="img-fluid rounded-3 shadow-sm w-100"
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </div>

              {/* Content */}
              <div className="content-area">
                <div
                  className="lead mb-4 text-muted"
                  style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
                >
                  {post.description}
                </div>

                <div
                  style={{ fontSize: "1rem", lineHeight: "1.8", color: "#333" }}
                >
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>

                  <h2 className="h3 fw-bold mt-5 mb-3">Key Insights</h2>
                  <p className="mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>

                  <blockquote className="blockquote text-center my-5 p-4 bg-light rounded-3">
                    <p className="mb-0 fst-italic">
                      "Innovation distinguishes between a leader and a
                      follower."
                    </p>
                    <footer className="blockquote-footer mt-2">
                      Steve Jobs
                    </footer>
                  </blockquote>

                  <h2 className="h3 fw-bold mt-5 mb-3">
                    Implementation Strategy
                  </h2>
                  <p className="mb-4">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo.
                  </p>

                  <ul className="mb-4">
                    <li className="mb-2">
                      Comprehensive planning and research phase
                    </li>
                    <li className="mb-2">
                      Iterative development with continuous feedback
                    </li>
                    <li className="mb-2">
                      Performance optimization and testing
                    </li>
                    <li className="mb-2">
                      Deployment and monitoring strategies
                    </li>
                  </ul>

                  <p className="mb-4">
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-5 pt-4 border-top">
                <h5 className="fw-bold mb-3">Tags</h5>
                <div>
                  {post.tags.map((tag, index) => (
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;
