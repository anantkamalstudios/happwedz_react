import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogLists from "./BlogLists";
import BlogDetails from "./BlogDetails";
import { useLoader } from "../context/LoaderContext";

const Blog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("list");
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const { showLoader, hideLoader } = useLoader();
  useEffect(() => {
    showLoader();
    if (blogId) {
      setSelectedBlogId(blogId);
      setCurrentView("detail");
    } else {
      setCurrentView("list");
      setSelectedBlogId(null);
    }
    hideLoader();
  }, [blogId]);

  const handlePostClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleBackClick = () => {
    navigate("/blog");
  };

  return (
    <div>
      {currentView === "list" ? (
        <BlogLists onPostClick={handlePostClick} />
      ) : (
        <BlogDetails blogId={selectedBlogId} onBackClick={handleBackClick} />
      )}
    </div>
  );
};

export default Blog;
