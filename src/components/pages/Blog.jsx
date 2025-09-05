import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import {
  FaSearch,
  FaHeart,
  FaBookmark,
  FaClock,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaArrowRight,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "50+ Stunning Wedding Photography Ideas for Your Big Day",
      description:
        "Discover creative photography ideas that will make your wedding album absolutely magical. From candid moments to artistic shots, we've got you covered.",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Sarah Johnson",
      authorImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 15, 2024",
      readTime: "8 min read",
      views: 1250,
      likes: 89,
      category: "Photography",
      tags: ["Photography", "Wedding Tips", "Creative Ideas"],
      featured: true,
      trending: true,
    },
    {
      id: 2,
      title:
        "Top 25 Luxury Wedding Venues in India That Will Take Your Breath Away",
      description:
        "Explore the most exquisite wedding venues across India, from royal palaces to beachfront resorts. Find your perfect venue for the wedding of your dreams.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Priya Sharma",
      authorImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 12, 2024",
      readTime: "12 min read",
      views: 2100,
      likes: 156,
      category: "Venues",
      tags: ["Venues", "Luxury", "Destination Weddings"],
      featured: true,
      trending: false,
    },
    {
      id: 3,
      title: "2024 Bridal Makeup Trends: From Natural Glow to Bold Statements",
      description:
        "Stay ahead of the curve with the latest bridal makeup trends. From dewy skin to bold lips, discover what's trending this wedding season.",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Meera Patel",
      authorImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 10, 2024",
      readTime: "6 min read",
      views: 980,
      likes: 67,
      category: "Beauty",
      tags: ["Makeup", "Bridal Beauty", "Trends"],
      featured: false,
      trending: true,
    },
    {
      id: 4,
      title: "Complete Wedding Planning Checklist: 12 Months to Your Big Day",
      description:
        "Never miss a detail with our comprehensive wedding planning checklist. From venue booking to final preparations, we've got every step covered.",
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Rajesh Kumar",
      authorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 8, 2024",
      readTime: "15 min read",
      views: 3200,
      likes: 234,
      category: "Planning",
      tags: ["Planning", "Checklist", "Timeline"],
      featured: true,
      trending: false,
    },
    {
      id: 5,
      title: "Wedding Decor Ideas: Transform Your Venue into a Fairytale",
      description:
        "Create magical moments with stunning wedding decor ideas. From floral arrangements to lighting, make your venue unforgettable.",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Anita Singh",
      authorImage:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 5, 2024",
      readTime: "10 min read",
      views: 1800,
      likes: 145,
      category: "Decor",
      tags: ["Decor", "Florals", "Styling"],
      featured: false,
      trending: true,
    },
    {
      id: 6,
      title: "Bridal Fashion Trends 2024: What Every Bride Should Know",
      description:
        "Discover the hottest bridal fashion trends for 2024. From traditional lehengas to modern gowns, find your perfect bridal look.",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      author: "Kavya Reddy",
      authorImage:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      date: "December 3, 2024",
      readTime: "9 min read",
      views: 1650,
      likes: 112,
      category: "Fashion",
      tags: ["Fashion", "Bridal Wear", "Trends"],
      featured: false,
      trending: false,
    },
  ]);

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

  const handleLike = (blogId) => {
    setLikedPosts((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(blogId)) {
        newLiked.delete(blogId);
      } else {
        newLiked.add(blogId);
      }
      return newLiked;
    });
  };

  const handleBookmark = (blogId) => {
    setBookmarkedPosts((prev) => {
      const newBookmarked = new Set(prev);
      if (newBookmarked.has(blogId)) {
        newBookmarked.delete(blogId);
      } else {
        newBookmarked.add(blogId);
      }
      return newBookmarked;
    });
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      !selectedCategory || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.date) - new Date(a.date);
      case "popular":
        return b.views - a.views;
      case "trending":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

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
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search articles, tips, and inspiration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="blog-search-btn">Search</button>
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
                      className={`category-item ${
                        selectedCategory === category.value ? "active" : ""
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
                    className={`sort-option ${
                      sortBy === "latest" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("latest")}
                  >
                    <FaCalendarAlt className="sort-icon" />
                    Latest
                  </button>
                  <button
                    className={`sort-option ${
                      sortBy === "popular" ? "active" : ""
                    }`}
                    onClick={() => setSortBy("popular")}
                  >
                    <FaEye className="sort-icon" />
                    Most Popular
                  </button>
                  <button
                    className={`sort-option ${
                      sortBy === "trending" ? "active" : ""
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
                        src={blog.image}
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
          <div className="col-lg-9 blog-main-content">
            {/* Featured Articles */}
            {featuredBlogs.length > 0 && (
              <section className="featured-section">
                <h3 className="fw-bold text-dark mb-2">Featured Articles</h3>
                <div className="row">
                  {featuredBlogs.slice(0, 2).map((blog) => (
                    <div key={blog.id} className="col-md-6 mb-4">
                      <div className="featured-card">
                        <div className="featured-image-container">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="featured-image"
                          />
                          <div className="featured-badge">Featured</div>
                        </div>
                        <div className="featured-content">
                          <div className="featured-meta">
                            <span className="featured-category">
                              {blog.category}
                            </span>
                            <span className="featured-date">{blog.date}</span>
                          </div>
                          <h4 className="featured-title">{blog.title}</h4>
                          <p className="featured-description">
                            {blog.description}
                          </p>
                          <div className="featured-author">
                            <img
                              src={blog.authorImage}
                              alt={blog.author}
                              className="author-avatar"
                            />
                            <div className="author-info">
                              <span className="author-name">{blog.author}</span>
                              <span className="read-time">{blog.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles */}
            <section className="articles-section">
              <div className="section-header">
                <h3 className="fw-bold text-dark mb-2">All Articles</h3>
                <div className="results-count">
                  {sortedBlogs.length} articles found
                </div>
              </div>

              <div className="row">
                {sortedBlogs.map((blog) => (
                  <div key={blog.id} className="col-lg-4 col-md-6 mb-4">
                    <article className="blog-card">
                      <div className="blog-image-container">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="blog-image"
                        />
                        <div className="blog-actions">
                          <button
                            className={`action-btn ${
                              likedPosts.has(blog.id) ? "liked" : ""
                            }`}
                            onClick={() => handleLike(blog.id)}
                          >
                            <FaHeart />
                            <span>{blog.likes}</span>
                          </button>
                          <button
                            className={`action-btn ${
                              bookmarkedPosts.has(blog.id) ? "bookmarked" : ""
                            }`}
                            onClick={() => handleBookmark(blog.id)}
                          >
                            <FaBookmark />
                          </button>
                        </div>
                        {blog.trending && (
                          <div className="trending-badge">Trending</div>
                        )}
                      </div>

                      <div className="blog-content">
                        <div className="blog-meta">
                          <span className="blog-category">{blog.category}</span>
                          <span className="blog-date">{blog.date}</span>
                        </div>

                        <h5 className="blog-title">{blog.title}</h5>
                        <p className="blog-description">{blog.description}</p>

                        <div className="blog-tags">
                          {blog.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="blog-tag">
                              <FaTag className="tag-icon" />
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="blog-footer">
                          <div className="blog-author">
                            <img
                              src={blog.authorImage}
                              alt={blog.author}
                              className="author-avatar"
                            />
                            <div className="author-details">
                              <span className="author-name">{blog.author}</span>
                              <div className="blog-stats">
                                <span className="stat-item">
                                  <FaEye className="stat-icon" />
                                  {blog.views}
                                </span>
                                <span className="stat-item">
                                  <FaClock className="stat-icon" />
                                  {blog.readTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="read-more-btn">
                            Read More <FaArrowRight className="arrow-icon" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center mt-5">
              <button className="load-more-btn">Load More Articles</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
