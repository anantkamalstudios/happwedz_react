import React from "react";
import UserDashboardNavbar from "../../layouts/UserDashboardNavbar";
import { useParams } from "react-router-dom";
import MyWedding from "./myWedding/MyWedding";
import Vendors from "./vendors/Vendors";
import Budget from "./budget/Budget";
import Check from "./checklist/Check";
import Guests from "./guests/Guests";
import WishList from "./wishlist/WishList";

const UserDashboardMain = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case "my-wedding":
        return <MyWedding />;
      case "checklist":
        return <Check />;
      case "vendor":
        return <Vendors />;
      case "guest-list":
        return <Guests />;
      case "budget":
        return <Budget />;
      case "wishlist":
        return <WishList />;
      default:
        return <MyWedding />;
    }
  };

  return (
    <div>
      <UserDashboardNavbar />
      {renderContent()}
    </div>
  );
};

export default UserDashboardMain;
