import React, { useState } from "react";
import BlogLists from "./BlogLists";
import BlogDetails from "./BlogDetails";

const Blog = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  const handlePostClick = (blogId) => {
    setSelectedBlogId(blogId);
    setCurrentView("detail");
  };

  const handleBackClick = () => {
    setCurrentView("list");
    setSelectedBlogId(null);
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
