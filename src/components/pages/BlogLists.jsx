import React, { useEffect, useState } from "react";
import { FaTag, FaEye, FaHeart, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { IMAGE_BASE_URL } from "../../config/constants";

const BlogLists = ({ onPostClick }) => {
  // const [blogs, setBlogs] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [sortBy, setSortBy] = useState("latest");
  // const [likedPosts, setLikedPosts] = useState(new Set());
  // const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  // const [blogs, setBlogs] = useState([
  //   {
  //     id: 1,
  //     title: "50+ Stunning Wedding Photography Ideas for Your Big Day",
  //     description:
  //       "Discover creative photography ideas that will make your wedding album absolutely magical. From candid moments to artistic shots, we've got you covered.",
  //     image:
  //       "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  //     author: "Sarah Johnson",
  //     authorImage:
  //       "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  //     date: "December 15, 2024",
  //     readTime: "8 min read",
  //     views: 1250,
  //     likes: 89,
  //     category: "Photography",
  //     tags: ["Photography", "Wedding Tips", "Creative Ideas"],
  //     featured: true,
  //     trending: true,
  //   },
  // ]);

  // const filteredBlogs = blogs.filter((blog) => {
  //   const matchesSearch =
  //     blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     blog.tags.some((tag) =>
  //       tag.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   const matchesCategory =
  //     !selectedCategory || blog.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });

  // const sortedBlogs = [...filteredBlogs].sort((a, b) => {
  //   switch (sortBy) {
  //     case "latest":
  //       return new Date(b.date) - new Date(a.date);
  //     case "popular":
  //       return b.views - a.views;
  //     case "trending":
  //       return b.likes - a.likes;
  //     default:
  //       return 0;
  //   }
  // });

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetch("https://happywedz.com/api/blog-deatils/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.data);
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const categories = [
    { name: "All", value: "", count: blogs.length },
    {
      name: "Photography",
      value: "Photography",
      count: blogs.filter((b) => b.category === "Photography").length,
    },
    {
      name: "Venues",
      value: "Venues",
      count: blogs.filter((b) => b.category === "Venues").length,
    },
    {
      name: "Beauty",
      value: "Beauty",
      count: blogs.filter((b) => b.category === "Beauty").length,
    },
    {
      name: "Planning",
      value: "Planning",
      count: blogs.filter((b) => b.category === "Planning").length,
    },
    {
      name: "Decor",
      value: "Decor",
      count: blogs.filter((b) => b.category === "Decor").length,
    },
    {
      name: "Fashion",
      value: "Fashion",
      count: blogs.filter((b) => b.category === "Fashion").length,
    },
  ];

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? blog.category === selectedCategory : true)
  );

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.postDate) - new Date(a.postDate);
    if (sortBy === "popular") return b.views - a.views;
    if (sortBy === "trending") return b.likes - a.likes;
    return 0;
  });

  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop"; // A fallback image
    }
    if (path.startsWith("https://happywedz.com:4000/")) {
      return path.replace("https://happywedz.com:4000/", "https://happywedzbackend.happywedz.com/");
    }
    return `https://happywedzbackend.happywedz.com/${path}`;
  };

  const featuredBlogs = blogs.filter((blog) => blog.featured);
  const trendingBlogs = blogs.filter((blog) => blog.trending);

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="blog-hero-title">Wedding Inspiration & Tips</h1>
              <p className="blog-hero-subtitle">
                Discover the latest trends, expert advice, and creative ideas
                for your perfect wedding day
              </p>

              {/* Search Bar */}
              <div className="blog-search-container">
                <div className="search-input-group">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search articles, tips, and inspiration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid blog-main-container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 blog-sidebar">
            <div className="sidebar-content">
              {/* Categories */}
              <div className="sidebar-section">
                <h4 className="sidebar-title">Categories</h4>
                <div className="category-list">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className={`category-item ${selectedCategory === category.value ? "active" : ""
                        }`}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="sidebar-section">
                <h4 className="sidebar-title">Sort By</h4>
                <div className="sort-options">
                  <button
                    className={`sort-option ${sortBy === "latest" ? "active" : ""
                      }`}
                    onClick={() => setSortBy("latest")}
                  >
                    <FaCalendarAlt className="sort-icon" />
                    Latest
                  </button>
                  <button
                    className={`sort-option ${sortBy === "popular" ? "active" : ""
                      }`}
                    onClick={() => setSortBy("popular")}
                  >
                    <FaEye className="sort-icon" />
                    Most Popular
                  </button>
                  <button
                    className={`sort-option ${sortBy === "trending" ? "active" : ""
                      }`}
                    onClick={() => setSortBy("trending")}
                  >
                    <FaHeart className="sort-icon" />
                    Trending
                  </button>
                </div>
              </div>

              {/* Trending Articles */}
              <div className="sidebar-section">
                <h4 className="sidebar-title">Trending Now</h4>
                <div className="trending-list">
                  {trendingBlogs.slice(0, 3).map((blog) => (
                    <div key={blog.id} className="trending-item">
                      <img
                        src={getImageUrl(blog.images?.[0])}
                        alt={blog.title}
                        className="trending-image"
                      />
                      <div className="trending-content">
                        <h6 className="trending-title">{blog.title}</h6>
                        <div className="trending-meta">
                          <span className="trending-views">
                            {blog.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container col-lg-9 blog-main-content">
            {featuredBlogs.length > 0 && (
              <section className="featured-section">
                <h3 className="fw-bold text-dark mb-2">Featured Articles</h3>
                <div className="row">
                  {sortedBlogs.map((blog) => (
                    <div key={blog.id} className="col-md-6 mb-5">
                      <article
                        className="wedding-article-card"
                        onClick={() => onPostClick(blog)}
                      >
                        <img
                          src={getImageUrl(blog.image)}
                          alt={blog.title}
                          className="wedding-card-image"
                        />
                        <div className="wedding-card-content">
                          <span className="wedding-card-category">
                            {blog.category}
                          </span>
                          <h5 className="wedding-card-title">{blog.title}</h5>
                          <p className="wedding-card-description">
                            {blog.shortDescription}
                          </p>
                          <div className="wedding-card-meta">
                            <span>{blog.author}</span>
                            <span>
                              {new Date(blog.postDate).toLocaleDateString(
                                "en-US"
                              )}
                            </span>
                          </div>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="wedding-articles-section">
              <div className="wedding-articles-header">
                <h3 className="wedding-section-title">All Articles</h3>
                <div className="wedding-results-count">
                  {sortedBlogs.length} articles found
                </div>
              </div>

              <div className="wedding-blog-wrapper">
                <section className="wedding-articles">
                  <div className="row">
                    {sortedBlogs.map((blog) => (
                      <div key={blog.id} className="col-md-6 mb-5">
                        <article
                          className="wedding-article-card"
                          onClick={() => onPostClick(blog)}
                        >
                          {/* Image */}
                          <div className="wedding-card-image-wrapper">
                            <img
                              src={getImageUrl(blog.image)}
                              alt={blog.title}
                              className="wedding-card-image"
                            />
                            {blog.trending && (
                              <div className="wedding-card-badge">Trending</div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="wedding-card-content">
                            {/* Meta */}
                            <div className="wedding-card-meta">
                              <span className="wedding-card-category">
                                {blog.category}
                              </span>
                              <span className="wedding-card-date">
                                {blog.createdDate
                                  ? new Date(
                                    blog.createdDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                  : ""}
                              </span>
                            </div>

                            {/* Title & Short Description */}
                            <h5 className="wedding-card-title">{blog.title}</h5>
                            <p className="wedding-card-description">
                              {blog.shortDescription}
                            </p>

                            {/* Tags */}
                            <div className="wedding-card-tags">
                              {blog.tags?.slice(0, 2).map((tag, index) => (
                                <span key={index} className="wedding-card-tag">
                                  <FaTag className="wedding-tag-icon" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>

            <div className="text-center mt-5">
              <button className="load-more-btn">Load More Articles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogLists;
