import React from "react";
import Navbar from "../../layouts/vendors/Navbar";
import HomeAdmin from "./HomeAdmin";
import Storefront from "./Storefront";
import { useParams } from "react-router-dom";
import VendorDashboard from "./VendorDashboard";
import StorefrontPage from "./StorefrontPage";
import ReviewsPage from "./ReviewsPage";
import EnquiryManagement from "./EnquiryManagement";
import Settings from "./Settings";

const Main = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case "vendor-home":
        return <HomeAdmin />;
      case "vendor-store-front":
        return <Storefront />;
      case "vendor-setting":
        return <Settings />;
      case "vendor-enquiries":
        return <EnquiryManagement />;
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
