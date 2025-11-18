import React, { useEffect, useState } from "react";
import { FaGift, FaStore, FaEnvelope, FaStar, FaCog } from "react-icons/fa";
import { LiaHomeSolid } from "react-icons/lia";
import { FaRegStar } from "react-icons/fa";
import { PiOfficeChairLight } from "react-icons/pi";
import { GoMail } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { IoStorefrontOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";

const Navbar = ({ storefrontCompletion }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [storedCompletion, setStoredCompletion] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("storefrontCompletion");
    if (stored) {
      setStoredCompletion(parseInt(stored, 10));
    }
  }, []);

  useEffect(() => {
    if (storefrontCompletion !== undefined) {
      setStoredCompletion(storefrontCompletion);
    }
  }, [storefrontCompletion]);

  const tabs = [
    {
      id: "home",
      slug: "vendor-home",
      label: "Home",
      icon: "/images/vendorsDashboard/homeico.png",
    },
    {
      id: "storefront",
      slug: "vendor-store-front",
      label: "Storefront",
      icon: "/images/vendorsDashboard/storefrontico.png",
    },
    {
      id: "enquiries",
      slug: "vendor-enquiries",
      label: "Enquiries",
      icon: "/images/vendorsDashboard/enquireico.png",
    },
    {
      id: "message",
      slug: "vendor-messages",
      label: "Messages",
      icon: "/images/vendorsDashboard/chat.png",
    },
    {
      id: "reviews",
      slug: "vendor-reviews",
      label: "Reviews",
      icon: "/images/vendorsDashboard/reviewico.png",
    },
    {
      id: "settings",
      slug: "vendor-setting",
      label: "Settings",
      icon: "/images/vendorsDashboard/settingsico.png",
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
    <div className="adminNav">
      <div className="wrapper tabs-container py-2 px-3 px-lg-5 mt-3 vendor-dashboard-navbar">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
          <div className="d-flex gap-3 gap-lg-4 flex-wrap justify-content-center justify-content-lg-start">
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
                <img
                  src={tab.icon}
                  alt={tab.label}
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "cover",
                  }}
                />
                <span className="mt-3">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Right side: Go Premium + small storefront completion (label above bar) */}
          <div
            className="d-flex align-items-center gap-2 bg-light px-3 rounded-3"
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
                {/* Compact progress bar */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: "#2c3e50",
                      fontWeight: "600",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      marginBottom: 2,
                    }}
                  >
                    Storefront Setup Progress
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 120,
                        height: 8,
                        background: "#e9ecef",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${
                            storefrontCompletion !== undefined
                              ? storefrontCompletion
                              : storedCompletion
                          }%`,
                          height: "100%",
                          background: "#f12d85",
                          transition: "width 250ms ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#2c3e50",
                        minWidth: 36,
                        textAlign: "right",
                      }}
                    >
                      {storefrontCompletion !== undefined
                        ? storefrontCompletion
                        : storedCompletion}
                      %
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      color: "#2c3e50",
                      fontWeight: "600",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      marginBottom: 2,
                    }}
                  >
                    Grow Your Business
                  </span>
                  <Link className="btn upgrade-btn border-0 p-0">
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
