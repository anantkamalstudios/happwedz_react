import React from "react";
import UserDashboardNavbar from "../../layouts/UserDashboardNavbar";
import { useParams } from "react-router-dom";
import MyWedding from "./myWedding/MyWedding";
import Vendors from "./vendors/Vendors";
import Guest from "./guestList/Guest";
import Budget from "./budget/Budget";
import CheckList from "./checklist/CheckList";

const UserDashboardMain = () => {
  const { slug } = useParams();

  const renderContent = () => {
    switch (slug) {
      case "my-wedding":
        return <MyWedding />;
      case "checklist":
        return <CheckList />;
      case "vendor":
        return <Vendors />;
      case "guest-list":
        return <Guest />;
      case "guest-list":
        return <Budget />;
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
S;
