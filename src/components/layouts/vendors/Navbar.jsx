import React, { useEffect, useState } from "react";
import { FaGift, FaStore, FaEnvelope, FaStar, FaCog } from "react-icons/fa";
import { LiaHomeSolid } from "react-icons/lia";
import { FaRegStar } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    {
      id: "home",
      slug: "vendor-home",
      label: "Home",
      icon: <LiaHomeSolid size={30} />,
    },
    {
      id: "storefront",
      slug: "vendor-store-front",
      label: "Storefront",
      icon: <IoStorefrontOutline size={30} />,
    },
    {
      id: "enquiries",
      slug: "vendor-enquiries",
      label: "Enquiries",
      icon: <GoMail size={30} />,
    },
    // {
    //   id: "reviews",
    //   slug: "vendor-reviews",
    //   label: "Reviews",
    //   icon: <FaRegStar size={20} />,
    // },
    {
      id: "settings",
      slug: "vendor-setting",
      label: "Settings",
      icon: <IoSettingsOutline size={30} />,
    },
  ];

  useEffect(() => {
    const foundTab = tabs.find((tab) => tab.slug === slug);
    if (foundTab) {
      setActiveTab(foundTab.id);
    }
  }, [slug]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(`/vendor-dashboard/${tab.slug}`);
  };
  return (
    <div className="tabs-container border-bottom py-2 px-3 px-lg-5 mt-3 vendor-dashboard-navbar">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
        {/* Left side: Tabs */}
        <div className="d-flex gap-3 gap-lg-4 flex-wrap justify-content-center justify-content-lg-start ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`btn border-0 d-flex flex-column align-items-center p-0 ${
                activeTab === tab.id ? "active-tab" : ""
              }`}
              style={{
                background: "transparent",
                fontSize: "14px",
                minWidth: "70px",
                color:
                  activeTab === tab.id ? "var(--primary-color)" : "#2c3e50",
              }}
              onClick={() => handleTabClick(tab)}
            >
              {tab.icon}
              <span className="mt-1">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right side: Go Premium */}
        <div className="d-flex align-items-center gap-2 bg-light px-3 rounded-3">
          <span
            style={{
              color: "#2c3e50",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            Grow Your Business ·
          </span>
          <Link
            to="/vendor-dashboard/upgrade/vendor-plan"
            className="btn upgrade-btn border-0 p-0"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
