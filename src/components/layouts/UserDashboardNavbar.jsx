import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaRing,
  FaClipboardList,
  FaStore,
  FaUsers,
  FaPiggyBank,
  FaHeart,
  FaShoppingCart,
  FaEnvelopeOpenText,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";

const tabs = [
  {
    id: "wedding",
    slug: "my-wedding",
    label: "My Wedding",
    icon: <FaRing />,
  },
  {
    id: "checklist",
    slug: "checklist",
    label: "Checklist",
    icon: <FaClipboardList />,
  },
  { id: "vendors", slug: "vendor", label: "Vendor", icon: <FaStore /> },
  {
    id: "guest-list",
    slug: "guest-list",
    label: "Guest list",
    icon: <FaUsers />,
  },
  { id: "budget", slug: "budget", label: "Budget", icon: <FaPiggyBank /> },
  { id: "wishlist", slug: "wishlist", label: "Wishlist", icon: <FaHeart /> },
  { id: "booking", slug: "booking", label: "Booking", icon: <FaShoppingCart /> },
  {
    id: "message",
    slug: "message",
    label: "Message",
    icon: <FaEnvelopeOpenText />,
  },
  {
    id: "real-wedding",
    slug: "real-wedding",
    label: "Real wedding",
    icon: <FaUserFriends />,
  },
  {
    id: "user-profile",
    slug: "user-profile",
    label: "Profile",
    icon: <FaUser />,
  },
];

const UserDashboardNavbar = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wedding");

  useEffect(() => {
    const foundTab = tabs.find((tab) => tab.slug === slug);
    if (foundTab) {
      setActiveTab(foundTab.id);
    } else {
      setActiveTab("wedding");
    }
  }, [slug]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(`/user-dashboard/${tab.slug}`);
  };

  return (
    <div className="container border-bottom py-3 px-3 mt-3">
      <div
        className="d-flex gap-4 flex-nowrap"
        style={{
          justifyContent: window.innerWidth > 768 ? "center" : "flex-start",
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="btn border-0 d-flex flex-column align-items-center p-0"
            style={{
              background: "transparent",
              fontSize: "19px",
              minWidth: "80px",
              color: activeTab === tab.id ? "#ed1173" : "#212529",
            }}
            onClick={() => handleTabClick(tab)}
          >
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "#ed1173",
                color: "#fff",
                fontSize: "24px",
              }}
            >
              {tab.icon}
            </div>
            <span
              className="mt-2"
              style={{
                fontWeight: activeTab === tab.id ? "600" : "400",
              }}
            >
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div
                style={{
                  marginTop: "4px",
                  height: "3px",
                  width: "40px",
                  backgroundColor: "#ed1173",
                  borderRadius: "2px",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserDashboardNavbar;