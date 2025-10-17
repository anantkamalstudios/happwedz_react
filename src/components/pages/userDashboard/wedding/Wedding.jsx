import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, DollarSign, Plus } from "lucide-react";
import { MdDinnerDining, MdGroups } from "react-icons/md";
import { BsTruck } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import { PiFlowerLotusThin } from "react-icons/pi";
import { GrPlan } from "react-icons/gr";
import { Camera, Music, Utensils, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CtaPanel from "../../../../components/home/CtaPanel";
import logo from "../../../../../public/happywed_white.png";
import image from "../../../../../public/images/home/try.png";
import VenueVendorComponent from "./VenueVendorComponent";
import UpComingTask from "./UpComingTask";
import EInvites from "./EInviteCard";

const Wedding = () => {
  const [budget, setBudget] = useState({ total: 0, spent: 0, remaining: 0 });
  const [guestStats, setGuestStats] = useState({ total: 0, attending: 0 });
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0 });

  // User state will be populated from an API call
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // State for the countdown timer
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    hasPassed: false,
  });

  const [vendorCategories, setVendorCategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Get the token at the top level of the component
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  // Predefined icons for categories
  const iconMapping = [
    <Camera size={24} />,
    <Utensils size={24} />,
    <Music size={24} />,
    <MdDinnerDining size={24} />,
    <BsTruck size={24} />,
    <TbCards size={24} />,
    <Gift size={24} />,
    <PiFlowerLotusThin size={24} />,
    <GrPlan size={24} />,
  ];

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://happywedz.com/api/vendor-types");
        const data = await response.json();

        const mappedCategories = data.map((cat, index) => ({
          icon: iconMapping[index] || <Camera size={24} />,
          title: cat.name,
          subtitle: "Explore this category",
          count: 0,
        }));

        setVendorCategories(mappedCategories);
      } catch (error) {
        console.error("Error fetching vendor categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.error("No user token found.");
          setLoadingUser(false);
          return;
        }
        function parseJwt(token) {
          const base64Url = token.split(".")[1]; // payload part
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );

          return JSON.parse(jsonPayload);
        }

        let userInfo = parseJwt(token);

        // Replace with your actual user profile API endpoint
        const response = await fetch(
          "https://happywedz.com/api/user/" + userInfo.id,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token]); // Re-run the effect if the token changes

  // Fetch dashboard stats (budget, guests, tasks)
  useEffect(() => {
    if (!token || !userId) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch Budget Summary
        const budgetRes = await fetch(
          // This should be user-specific
          `https://happywedz.com/api/expense/summary/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const budgetData = await budgetRes.json();
        if (budgetData.success) {
          const total = parseFloat(budgetData.data.totalEstimated) || 0;
          const spent = parseFloat(budgetData.data.totalPaid) || 0;
          setBudget({
            total: total,
            spent: spent,
            remaining: total - spent,
          });
        }

        // Fetch Guest Summary
        // This should fetch guests for the current user
        const guestsRes = await fetch(
          `https://happywedz.com/api/guestlist/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const guestsData = await guestsRes.json();
        if (guestsData.success) {
          const totalGuests = guestsData.data.length;
          const attendingGuests = guestsData.data.filter(
            (g) => g.status === "Attending"
          ).length;
          setGuestStats({ total: totalGuests, attending: attendingGuests });
        }

        // Fetch Task Summary
        const tasksRes = await fetch(
          `https://happywedz.com/api/checklist_new/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const tasksData = await tasksRes.json();
        if (tasksData.success) {
          const completedTasks = tasksData.data.filter(
            (t) => t.status === "completed"
          ).length;
          setTaskStats({
            total: tasksData.data.length,
            completed: completedTasks,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [token, userId]);

  // Countdown Timer Logic
  useEffect(() => {
    // my setup just uncomment below line
    if (!user?.weddingDate) return;

    const weddingDate = new Date(user.weddingDate);
    // const weddingDate = new Date(2025, 9, 2);
    // My static code

    const MILLISECONDS_IN_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;
    const MINUTES_IN_HOUR = 60;
    const HOURS_IN_DAY = 24;
    const MILLISECONDS_IN_HOUR =
      MILLISECONDS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
    const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * HOURS_IN_DAY;

    const calculateCountdown = () => {
      const now = new Date(Date.now());
      // const difference = weddingDate.getTime() - now.getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / MILLISECONDS_IN_DAY);
        const hours = Math.floor(
          (difference % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR
        );
        setCountdown({ days, hours, hasPassed: false });
      } else {
        setCountdown({ days: 0, hours: 0, hasPassed: true });
      }
    };
    calculateCountdown();

    // Update the countdown every minute. Updating every second is unnecessary if not displaying seconds.
    const interval = setInterval(calculateCountdown, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, [user?.weddingDate]);

  const formatDateWithOrdinal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    const getOrdinal = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinal(day)} of ${month} ${year}`;
  };

  const toggleShowAll = () => setShowAll(!showAll);
  const displayedCategories = showAll
    ? vendorCategories
    : vendorCategories.slice(0, 6);

  if (loadingUser) {
    return <div className="text-center py-5">Loading your dashboard...</div>;
  }

  return (
    <div className="wedding-dashboard">
      <div className="container py-4">
        <div className="card rounded-4 p-2 shadow-sm border-0 mb-4 overflow-hidden">
          <div className="row g-0">
            {/* Left Side Image */}
            <div className="col-md-4 position-relative">
              <img
                src="/images/userDashboard/home-wedding-image.avif"
                alt="Wedding"
                className="img-fluid h-100 w-100 rounded-5 object-fit-cover"
              />

              <div
                className="position-absolute bottom-0 end-0 p-2 m-2 rounded-4"
                style={{
                  background: "rgba(255, 192, 203, 0.85)",
                }}
              >
                <div className="d-flex text-center text-dark fw-bold">
                  <div className="px-3">
                    <h5 className="fw-bold">{countdown.days}</h5>
                    <small>Days</small>
                  </div>
                  <div className="px-3 border-start border-dark-subtle">
                    <h5 className="fw-bold">{countdown.hours}</h5>
                    <small>Hrs</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Content */}
            <div className="col-md-8 p-4 d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-2 text-dark">
                Welcome,{" "}
                {user?.name
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ") || "User"}
                !
              </h4>

              <p className="text-muted mb-4">
                {formatDateWithOrdinal(user?.weddingDate)}
              </p>

              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row text-center g-0">
                  <div className="col py-3 border-end">
                    <h6 className="mb-1 fw-semibold text-dark">
                      Service Hired
                    </h6>
                    <small className="text-muted">0 of 25</small>
                  </div>
                  <div className="col py-3 border-end">
                    <h6 className="mb-1 fw-semibold text-dark">
                      Task Complete
                    </h6>
                    <small className="text-muted">
                      {taskStats.completed} of {taskStats.total || 20}
                    </small>
                  </div>
                  <div className="col py-3">
                    <h6 className="mb-1 fw-semibold text-dark">
                      Guest Attending
                    </h6>
                    <small className="text-muted">
                      {guestStats.attending} of {guestStats.total || 100}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="w-100">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <VenueVendorComponent type="venue" />
            </div>
            <div className="col-12 col-md-6">
              <VenueVendorComponent type="vendor" />
            </div>
          </div>
        </section>

        {/* CTA Panel */}
        <section className="col-lg-12">
          <CtaPanel
            logo={logo}
            img={image}
            heading="Design Studio"
            subHeading="Try Virtual Makeup & Grooming Looks for Your Big Day"
            link="/try"
            title="Create Your Look !"
            subtitle="Experience How You'll Look on Your Wedding Day with AI-Powered Virtual Makeover"
            btnName="Try Virtual Look"
          />
        </section>

        {/* Upcoming, Guest List, Budget, E-invites, Get the app */}
        <section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gridTemplateRows: "repeat(6, 1fr)",
              gap: "2.5rem",
              height: "100%",
            }}
          >
            <div
              className="shadow-lg"
              style={{
                gridColumn: "span 4/span 4",
                gridRow: "span 3/span 3",
                padding: "0 2rem",
              }}
            >
              {/* Question part */}
              <UpComingTask />
            </div>
            <div
              className="shadow-lg"
              style={{
                gridColumn: "span 2/span 2",
                gridRow: "span 4/span 4",
                gridColumnStart: 5,
                height: "100%",
              }}
            >
              {/* E-invites */}
              <EInvites />
            </div>
            {/* add guest */}
            <div
              className="shadow-lg"
              style={{
                gridColumn: "span 2/span 2",
                gridRow: "span 3/span 3",
                gridRowStart: 4,
                padding: "1rem",
                height: "100%",
              }}
            >
              <h3>Add Guest</h3>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80%",
                }}
              >
                {/* logo */}
                <div
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#C31162",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MdGroups size={40} />
                </div>

                <p>You haven't added any guest yet</p>
                <button
                  style={{
                    padding: "0.5rem 2rem",
                    backgroundColor: "#C31162",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Add Guest
                </button>
              </div>
            </div>
            {/* budget */}
            <div
              className="shadow-lg"
              style={{
                gridColumn: "span 2/span 2",
                gridRow: "span 3/span 3",
                gridColumnStart: 3,
                gridRowStart: 4,
                padding: "1rem",
                height: "100%",
              }}
            >
              <h3>Budget</h3>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80%",
                }}
              >
                <button
                  style={{
                    padding: "0.5rem 2rem",
                    backgroundColor: "#C31162",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  + Add Budget
                </button>
              </div>
            </div>
            <div
              className="div5 shadow-lg"
              style={{
                gridColumn: "span 2/span 2",
                gridRow: "span 2/span 2",
                gridColumnStart: 5,
                gridRowStart: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Get Our App Section */}
              <div
                className="text-center"
                style={{
                  padding: "20px",
                }}
              >
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Get the Happywedz app</h6>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#555",
                      marginBottom: "16px",
                    }}
                  >
                    Always bring the best wedding planner for iPhone and Android
                    with you.
                  </p>

                  <div className="d-flex justify-content-center gap-2">
                    <a
                      href="#"
                      style={{
                        display: "inline-block",
                        width: "110px",
                      }}
                    >
                      <img
                        src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                        alt="Download on App Store"
                        style={{ width: "100%" }}
                      />
                    </a>

                    <a
                      href="#"
                      style={{
                        display: "inline-block",
                        width: "110px",
                      }}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                        alt="Get it on Google Play"
                        style={{ width: "100%" }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
        <div className="row my-5">
          <div className="col-12">
            <h5 className="">Find & Book Your Wedding Vendors</h5>
            <div className="row">
              {displayedCategories.map((category, index) => (
                <div
                  key={index}
                  className="col-lg-4 col-md-6 mb-3"
                  onClick={() => {
                    window.location.href = `/vendors/${toSlug(category.title)}`;
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="vendor-card">
                    <div className="vendor-icon">{category.icon}</div>
                    <div className="vendor-content">
                      <h5 className="vendor-title">{category.title}</h5>
                      <p className="vendor-subtitle">{category.subtitle}</p>
                      <span className="vendor-count">
                        {category.count} available
                      </span>
                    </div>
                    <div className="vendor-action">
                      <Link
                        to={`/vendors/${toSlug(category.title)}`}
                        className="btn-explore"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {vendorCategories.length > 6 && (
              <div className="show-more-container text-center mt-3">
                <button
                  className="show-more-btn btn btn-primary"
                  onClick={toggleShowAll}
                >
                  {showAll ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">
                  <Clock size={20} className="me-2" />
                  Upcoming Tasks
                </h4>
                <span className="task-progress">
                  {taskStats.completed}/{taskStats.total} completed
                </span>
              </div>
              <div className="progress-bar-container mb-4">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        taskStats.total > 0
                          ? (taskStats.completed / taskStats.total) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round(
                    taskStats.total > 0
                      ? (taskStats.completed / taskStats.total) * 100
                      : 0
                  )}
                  % complete
                </span>
              </div>
              <div className="tasks-list">
                <div className="task-item">
                  <div className="task-content">
                    <div className="task-name">No tasks found.</div>
                  </div>
                </div>
                <button className="add-task-btn">
                  <Plus size={16} /> Add new task
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="dashboard-card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">
                  <Users size={20} className="me-2" />
                  Guest List
                </h4>
                <button className="btn-small">Manage</button>
              </div>
              <div className="guest-stats row">
                <div className="col-6 col-sm-3">
                  <div className="guest-stat">
                    <div className="stat-number">{guestStats.total}</div>
                    <div className="stat-label">Invited</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="guest-stat">
                    <div className="stat-number">{guestStats.attending}</div>
                    <div className="stat-label">Responded</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="guest-stat">
                    <div className="stat-number text-success">
                      {guestStats.attending}
                    </div>
                    <div className="stat-label">Attending</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="guest-stat">
                    <div className="stat-number text-muted">
                      {guestStats.total - guestStats.attending}
                    </div>
                    <div className="stat-label">Declined</div>
                  </div>
                </div>
              </div>
              <div className="guest-actions mt-2">
                <button className="btn-action">Send Invitations</button>
                <button className="btn-action-outline">
                  View Seating Chart
                </button>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">
                  <DollarSign size={20} className="me-2" />
                  Wedding Budget
                </h4>
                <button className="btn-small">Edit</button>
              </div>
              <div className="budget-overview">
                <div className="budget-total">
                  <div className="budget-amount">
                    ₹{(budget.total / 100000).toFixed(1)}L
                  </div>
                  <div className="budget-label">Total Budget</div>
                </div>
                <div className="budget-breakdown">
                  <div className="budget-item">
                    <span className="budget-spent">
                      ₹{(budget.spent / 100000).toFixed(1)}L spent
                    </span>
                    <span className="budget-remaining">
                      ₹{(budget.remaining / 100000).toFixed(1)}L remaining
                    </span>
                  </div>
                </div>
                <div className="budget-progress">
                  <div className="budget-bar">
                    <div
                      className="budget-fill"
                      style={{
                        width: `${
                          budget.total > 0
                            ? (budget.spent / budget.total) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="budget-percentage">
                    {Math.round(
                      budget.total > 0 ? (budget.spent / budget.total) * 100 : 0
                    )}
                    % used
                  </span>
                </div>
              </div>
              <div className="budget-categories mt-2">
                <div className="category-item">
                  <span>Venue & Catering</span>
                  <span>₹180k</span>
                </div>
                <div className="category-item">
                  <span>Photography</span>
                  <span>₹50k</span>
                </div>
                <div className="category-item">
                  <span>Decoration & Flowers</span>
                  <span>₹45k</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Wedding;
