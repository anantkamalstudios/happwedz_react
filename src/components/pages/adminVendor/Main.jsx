import React from "react";
import HomeAdmin from "./homeadmin";
import Navbar from "../../layouts/vendors/Navbar";
import Storefront from "./Storefront";
import { useParams } from "react-router-dom";

const Main = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case "vendor-home":
        return <HomeAdmin />;
      case "vendor-store-front":
        return <Storefront />;
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
