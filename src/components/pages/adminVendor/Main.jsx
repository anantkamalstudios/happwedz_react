import React from "react";
import HomeAdmin from "./homeadmin";
import Navbar from "../../layouts/vendors/Navbar";
import Storefront from "./Storefront";
import { useParams } from "react-router-dom";
import VendorDashboard from "./VendorDashboard";
import StorefrontPage from "./StorefrontPage";
import ReviewsPage from "./ReviewsPage";

const Main = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case "vendor-home":
        return <HomeAdmin />;
      case "vendor-store-front":
        return <Storefront />;
      case "vendor-reviews":
        return <ReviewsPage />;
      default:
        return <HomeAdmin />;
    }
  };

  return (
    <div>
      <Navbar />
      {renderContent()}
    </div>
  );
};

export default Main;
