// HappyWedz x GrowthOS AI — Google Profile dashboard (GrowthOS plan RD-21, docs/partner-api-gbp-contract.md §3).
// Six tabs, shown on the Live screen once the profile is verified. Each tab loads its own data the first time it is
// opened and is then kept (hidden) while another tab shows, so going back does not load it again (2026-10-27).
import { useCallback, useRef, useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
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
  { id: "improve", label: "Improve with AI", Component: ImproveTab, Icon: HiOutlineSparkles },
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
  const [visited, setVisited] = useState(() => [storedTab()]);
  // After the AI assistant changed something, the other tabs load again when next opened (a new key).
  const [stale, setStale] = useState([]);
  const [versions, setVersions] = useState({});
  const tabRefs = useRef({});
  // 2026-10-27: "Improve with AI" puts its score and next steps in this column beside the tabs (a portal), so the
  // chat and the steps fit on one screen.
  const [sideSlot, setSideSlot] = useState(null);

  const onChanged = useCallback(() => setStale(DASHBOARD_TABS.map((t) => t.id).filter((x) => x !== "improve")), []);

  const choose = (id, focus = false) => {
    setActive(id);
    setVisited((list) => (list.includes(id) ? list : [...list, id]));
    if (stale.includes(id)) {
      setVersions((v) => ({ ...v, [id]: (v[id] || 0) + 1 }));
      setStale((list) => list.filter((x) => x !== id));
    }
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

  return (
    <div className={`gp-dash-wrap${active === "improve" ? " has-side" : ""}`}>
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
              {tab.Icon && <tab.Icon size={16} aria-hidden="true" />}
              {tab.label}
            </button>
          ))}
        </div>
        {DASHBOARD_TABS.filter((tab) => tab.id === active || visited.includes(tab.id)).map((tab) => {
          const { id } = tab;
          const TabPanel = tab.Component;
          return (
            <div
              key={`${id}-${versions[id] || 0}`}
              className="gp-dash-panel"
              role="tabpanel"
              id={`gp-panel-${id}`}
              aria-labelledby={`gp-tab-${id}`}
              hidden={id !== active}
            >
              <TabPanel view={view} onOpenTab={choose} onChanged={onChanged} sideSlot={sideSlot} />
            </div>
          );
        })}
      </div>
      <div className="gp-dash-side" ref={setSideSlot} hidden={active !== "improve"} />
    </div>
  );
}
