import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsPersonHeart } from "react-icons/bs";
import { PiPiggyBankLight } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineChecklist } from "react-icons/md";
import { GiBigDiamondRing } from "react-icons/gi";

const UserDashboardNavbar = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wedding");

  const tabs = [
    {
      id: "wedding",
      slug: "my-wedding",
      label: "My Wedding",
      icon: <GiBigDiamondRing size={20} />,
    },
    {
      id: "checklist",
      slug: "checklist",
      label: "checklist",
      icon: <MdOutlineChecklist size={20} />,
    },
    {
      id: "vendors",
      slug: "vendor",
      label: "vendors",
      icon: <IoLocationOutline size={20} />,
    },
    {
      id: "guest-list",
      slug: "guest-list",
      label: "Guest List",
      icon: <BsPersonHeart size={20} />,
    },
    {
      id: "budget",
      slug: "Budget",
      label: "budget",
      icon: <PiPiggyBankLight size={20} />,
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
    navigate(`/user-dashboard/${tab.slug}`);
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

export default UserDashboardNavbar;
