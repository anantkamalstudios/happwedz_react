// import React from "react";
// import UserDashboardNavbar from "../../layouts/UserDashboardNavbar";
// import { useParams } from "react-router-dom";
// import MyWedding from "./myWedding/MyWedding";
// import Vendors from "./vendors/Vendors";
// import Budget from "./budget/Budget";
// import Check from "./checklist/Check";
// import Guests from "./guests/Guests";
// import WishList from "./wishlist/WishList";
// import Booking from "./booking/Booking";
// import Messages from "./messages/Messages";
// import RealWeddingForm from "./realWeddingForm/RealWeddingForm";

// const UserDashboardMain = () => {
//   const { slug } = useParams();

//   const renderContent = () => {
//     switch (slug) {
//       case "my-wedding":
//         return <MyWedding />;
//       case "checklist":
//         return <Check />;
//       case "vendor":
//         return <Vendors />;
//       case "guest-list":
//         return <Guests />;
//       case "budget":
//         return <Budget />;
//       case "wishlist":
//         return <WishList />;
//       case "booking":
//         return <Booking />;
//       case "message":
//         return <Messages />;
//       case "real-wedding":
//         return <RealWeddingForm />;
//       default:
//         return <MyWedding />;
//     }
//   };

//   return (
//     <div>
//       <UserDashboardNavbar />
//       {renderContent()}
//     </div>
//   );
// };

// export default UserDashboardMain;

import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import UserDashboardNavbar from "../../layouts/UserDashboardNavbar";
import Wedding from "./wedding/Wedding";
import Vendors from "./vendors/Vendors";
import Budget from "./budget/Budget";
import Check from "./checklist/Check";
import Guests from "./guests/Guests";
import WishList from "./wishlist/WishList";
import Booking from "./booking/Booking";
import Messages from "./messages/Messages";
import RealWeddingForm from "./realWeddingForm/RealWeddingForm";

const UserDashboardMain = () => {
  const { slug } = useParams();

  // ✅ Get user and token from Redux
  const { user, token } = useSelector((state) => state.auth);

  // console.log("Logged-in user:", user);
  // console.log("Token:", token);

  const renderContent = () => {
    switch (slug) {
      case "my-wedding":
        return <Wedding user={user} token={token} />;
      case "checklist":
        return <Check user={user} token={token} />;
      case "vendor":
        return <Vendors user={user} token={token} />;
      case "guest-list":
        return <Guests user={user} token={token} />;
      case "budget":
        return <Budget user={user} token={token} />;
      case "wishlist":
        return <WishList user={user} token={token} />;
      case "booking":
        return <Booking user={user} token={token} />;
      case "message":
        return <Messages user={user} token={token} />;
      case "real-wedding":
        return <RealWeddingForm user={user} token={token} />;
      default:
        return <Wedding user={user} token={token} />;
    }
  };

  return (
    <div>
      <UserDashboardNavbar user={user} />
      {renderContent()}
    </div>
  );
};

export default UserDashboardMain;
