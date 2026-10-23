// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Six tabs, shown on the Live screen once the profile is verified. Each tab loads its own data when opened.
import { useRef, useState } from "react";
import ImproveTab from "./ImproveTab";
import OverviewTab from "./OverviewTab";
import ReviewsTab from "./ReviewsTab";
import PostsTab from "./PostsTab";
import ProfileTab from "./ProfileTab";
import PhotosTab from "./PhotosTab";
import "./dashboard-d.css";
import "./dashboard-e.css";

// RD-22: "Improve with AI" comes first and holds the AI fixes (the old Fixes tab lives inside it).
const DASHBOARD_TABS = [
  { id: "improve", label: "Improve with AI", Component: ImproveTab },
  { id: "overview", label: "Overview", Component: OverviewTab },
  { id: "reviews", label: "Reviews", Component: ReviewsTab },
  { id: "posts", label: "Posts", Component: PostsTab },
  { id: "profile", label: "Profile", Component: ProfileTab },
  { id: "photos", label: "Photos", Component: PhotosTab },
];

const STORAGE_KEY = "gp-dashboard-tab";

const storedTab = () => {
  try {
    const id = window.localStorage.getItem(STORAGE_KEY);
    return DASHBOARD_TABS.some((t) => t.id === id) ? id : "improve";
  } catch {
    return "improve";
  }
};

export default function Dashboard({ view }) {
  const [active, setActive] = useState(storedTab);
  const tabRefs = useRef({});

  const choose = (id, focus = false) => {
    setActive(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // The remembered tab is a convenience only.
    }
    if (focus) tabRefs.current[id]?.focus();
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event) => {
    const index = DASHBOARD_TABS.findIndex((t) => t.id === active);
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (step) {
      event.preventDefault();
      const next = DASHBOARD_TABS[(index + step + DASHBOARD_TABS.length) % DASHBOARD_TABS.length];
      choose(next.id, true);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      choose(DASHBOARD_TABS[event.key === "Home" ? 0 : DASHBOARD_TABS.length - 1].id, true);
    }
  };

  const current = DASHBOARD_TABS.find((t) => t.id === active) || DASHBOARD_TABS[0];
  const { Component } = current;

  return (
    <div className="gp-card gp-dash">
      <div className="gp-dash-tabs" role="tablist" aria-label="Google profile" onKeyDown={onKeyDown}>
        {DASHBOARD_TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`gp-tab-${tab.id}`}
            aria-selected={tab.id === active}
            aria-controls={`gp-panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            className={`gp-dash-tab${tab.id === active ? " is-active" : ""}`}
            onClick={() => choose(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="gp-dash-panel" role="tabpanel" id={`gp-panel-${current.id}`} aria-labelledby={`gp-tab-${current.id}`}>
        <Component view={view} onOpenTab={choose} />
      </div>
    </div>
  );
}
