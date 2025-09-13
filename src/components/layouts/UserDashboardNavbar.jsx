import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsPersonHeart } from "react-icons/bs";
import { PiPiggyBankLight } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { MdEventAvailable, MdOutlineChecklist } from "react-icons/md";
import { GiBigDiamondRing } from "react-icons/gi";
import {
  FaCalendarCheck,
  FaCameraRetro,
  FaHeart,
  FaRegCommentDots,
} from "react-icons/fa";

const UserDashboardNavbar = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("wedding");

  // const tabs = [
  //   {
  //     id: "wedding",
  //     slug: "my-wedding",
  //     label: "My Wedding",
  //     icon: <GiBigDiamondRing size={20} />,
  //   },
  //   {
  //     id: "checklist",
  //     slug: "checklist",
  //     label: "checklist",
  //     icon: <MdOutlineChecklist size={20} />,
  //   },
  //   {
  //     id: "vendors",
  //     slug: "vendor",
  //     label: "vendors",
  //     icon: <IoLocationOutline size={20} />,
  //   },
  //   {
  //     id: "guest-list",
  //     slug: "guest-list",
  //     label: "Guest List",
  //     icon: <BsPersonHeart size={20} />,
  //   },
  //   {
  //     id: "budget",
  //     slug: "budget",
  //     label: "budget",
  //     icon: <PiPiggyBankLight size={20} />,
  //   },
  //   {
  //     id: "wishlist",
  //     slug: "wishlist",
  //     label: "wishlist",
  //     icon: <FaHeart size={20} />,
  //   },
  //   {
  //     id: "booking",
  //     slug: "booking",
  //     label: "booking",
  //     icon: <MdEventAvailable size={20} />,
  //   },
  //   {
  //     id: "message",
  //     slug: "message",
  //     label: "message",
  //     icon: <FaRegCommentDots size={20} />,
  //   },
  //   {
  //     id: "Real Wedding",
  //     slug: "real-wedding",
  //     label: "real-wedding",
  //     icon: (
  //       <img
  //         src="/images/userDashboard/realwedding.svg"
  //         alt="Real Wedding"
  //         style={{ width: 40, height: 40 }}
  //       />
  //     ),
  //   },
  // ];

  const tabs = [
    {
      id: "wedding",
      slug: "my-wedding",
      label: "My Wedding",
      icon: (
        <img
          src="/images/userDashboard/wedding.png"
          alt="My Wedding"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "checklist",
      slug: "checklist",
      label: "checklist",
      icon: (
        <img
          src="/images/userDashboard/checklist.png"
          alt="Checklist"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "vendors",
      slug: "vendor",
      label: "vendors",
      icon: (
        <img
          src="/images/userDashboard/vendors.png"
          alt="Vendors"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "guest-list",
      slug: "guest-list",
      label: "Guest List",
      icon: (
        <img
          src="/images/userDashboard/guests.png"
          alt="Guest List"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "budget",
      slug: "budget",
      label: "budget",
      icon: (
        <img
          src="/images/userDashboard/budget.png"
          alt="budget"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "wishlist",
      slug: "wishlist",
      label: "wishlist",
      icon: (
        <img
          src="/images/userDashboard/wishlist.png"
          alt="Wishlist"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "booking",
      slug: "booking",
      label: "booking",
      icon: (
        <img
          src="/images/userDashboard/booking.png"
          alt="Booking"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "message",
      slug: "message",
      label: "message",
      icon: (
        <img
          src="/images/userDashboard/message.png"
          alt="message"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
    },
    {
      id: "Real Wedding",
      slug: "real-wedding",
      label: "real-wedding",
      icon: (
        <img
          src="/images/userDashboard/rw.png"
          alt="Real Wedding"
          style={{ width: 44, height: 44, objectFit: "contain" }}
        />
      ),
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
      <div
        className="d-flex gap-5 flex-nowrap"
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
              fontSize: "14px",
              minWidth: "70px",
              color: activeTab === tab.id ? "#ed1173" : "#212529",
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
