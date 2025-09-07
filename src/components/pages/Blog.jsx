import React, { useState } from "react";
import BlogLists from "./BlogLists";
import BlogDetails from "./BlogDetails";

const Blog = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setCurrentView("detail");
  };

  const handleBackClick = () => {
    setCurrentView("list");
    setSelectedPost(null);
  };

  return (
    <div>
      {currentView === "list" ? (
        <BlogLists onPostClick={handlePostClick} />
      ) : (
        <BlogDetails post={selectedPost} onBackClick={handleBackClick} />
      )}
    </div>
  );
};

export default Blog;
