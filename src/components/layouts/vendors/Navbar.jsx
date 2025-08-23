import React, { useEffect, useState } from "react";
import { FaGift, FaStore, FaEnvelope, FaStar, FaCog } from "react-icons/fa";
import { LiaHomeSolid } from "react-icons/lia";
import { FaRegStar } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    {
      id: "home",
      slug: "vendor-home",
      label: "Home",
      icon: <LiaHomeSolid size={20} />,
    },
    {
      id: "storefront",
      slug: "vendor-store-front",
      label: "Storefront",
      icon: <IoStorefrontOutline size={20} />,
    },
    {
      id: "enquiries",
      slug: "vendor-enquiries",
      label: "Enquiries",
      icon: <GoMail size={20} />,
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
      icon: <IoSettingsOutline size={20} />,
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
    <div className="tabs-container border-bottom py-2 px-3 mt-3">
      <div className="d-flex gap-4 flex-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn border-0 d-flex flex-column align-items-center p-0 ${
              activeTab === tab.id ? "text-primary" : "text-dark"
            }`}
            style={{
              background: "transparent",
              fontSize: "14px",
              minWidth: "70px",
            }}
            onClick={() => handleTabClick(tab)}
          >
            {tab.icon}
            <span className="mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
