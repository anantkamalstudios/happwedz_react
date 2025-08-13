import {
  BarChart3,
  Calendar,
  Camera,
  Home,
  Menu,
  Music,
  Star,
  Users,
  Utensils,
  X,
} from "lucide-react";
import React from "react";

const ReviewsSidebar = ({
  isCollapsed,
  onToggle,
  activeSection,
  onSectionChange,
}) => {
  const menuItems = [
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "review-collector", label: "Review Collector", icon: Home },
    // { id: "bookings", label: "Bookings", icon: Calendar },
    // { id: "gallery", label: "Gallery", icon: Camera },
    // { id: "services", label: "Services", icon: Utensils },
    // { id: "music", label: "Music & DJ", icon: Music },
    // { id: "customers", label: "Customers", icon: Users },
    // { id: "analytics", label: "Analytics", icon: BarChart3 },
    // { id: "messages", label: "Messages", icon: MessageCircle },
    // { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className={`vendor-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="vendor-sidebar__header">
        <div className="vendor-sidebar__logo">
          {/* <div className="vendor-sidebar__logo-icon">❤️</div> */}
          {!isCollapsed && (
            <div className="vendor-sidebar__logo-text">
              <h4>WeddingPro</h4>
              <p>Vendor Dashboard</p>
            </div>
          )}
        </div>
        <button className="vendor-sidebar__toggle" onClick={onToggle}>
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className="vendor-sidebar__nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`vendor-sidebar__nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => onSectionChange(item.id)}
              title={isCollapsed ? item.label : ""}
            >
              <IconComponent size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="vendor-sidebar__footer">
        <div className="vendor-sidebar__profile">
          <div className="vendor-sidebar__avatar">VP</div>
          {!isCollapsed && (
            <div className="vendor-sidebar__profile-info">
              <p className="vendor-sidebar__profile-name">Vendor Pro</p>
              <p className="vendor-sidebar__profile-role">Premium Member</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSidebar;
