import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import { FaSearch, FaHeart, FaBookmark, FaClock, FaEye } from "react-icons/fa";

const Blog = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Wedding Photography Tips",
      description:
        "Capture your special moments with these expert photography tips.",
      image: "/public/images/categories/photo.jpg",
      author: "John Doe",
      date: "September 1, 2025",
      tags: ["Photography", "Tips"],
    },
    {
      id: 2,
      title: "Top Wedding Venues",
      description: "Explore the most stunning venues for your dream wedding.",
      image: "/public/images/categories/venues.jpg",
      author: "Jane Smith",
      date: "August 28, 2025",
      tags: ["Venues", "Planning"],
    },
    {
      id: 3,
      title: "Bridal Makeup Trends",
      description: "Stay updated with the latest bridal makeup trends.",
      image: "/public/images/categories/makeup.jpg",
      author: "Emily Johnson",
      date: "August 15, 2025",
      tags: ["Makeup", "Trends"],
    },
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section text-center text-white d-flex align-items-center justify-content-center">
        <div
          className="overlay"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        ></div>
        <div style={{ zIndex: 1 }}>
          <h1 className="display-3">Welcome to Our Blog</h1>
          <p className="lead">
            Your ultimate guide to wedding inspiration and ideas.
          </p>
        </div>
      </section>

      <div className="container mt-5">
        <div className="row mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search blogs..."
            />
          </div>
          <div className="col-md-4">
            <select className="form-select">
              <option value="">All Categories</option>
              <option value="Photography">Photography</option>
              <option value="Venues">Venues</option>
              <option value="Makeup">Makeup</option>
            </select>
          </div>
        </div>

        {/* Blog Cards Section */}
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-md-4 mb-4" key={blog.id}>
              <div className="card h-100">
                <img
                  src={blog.image}
                  className="card-img-top"
                  alt={blog.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.description}</p>
                  <p className="text-muted small">
                    By {blog.author} on {blog.date}
                  </p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="badge bg-secondary text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a href="#" className="btn btn-primary">
                    Read More
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-5">
        <p>&copy; 2025 HappyWedz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Blog;
