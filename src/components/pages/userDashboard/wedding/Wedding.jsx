import { useState, useEffect } from "react";
import { CheckCircle, Clock, Users, DollarSign, Plus } from "lucide-react";
import { MdDinnerDining } from "react-icons/md";
import { BsTruck } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import { PiFlowerLotusThin } from "react-icons/pi";
import { GrPlan } from "react-icons/gr";
import { Camera, Music, Utensils, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Wedding = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set([0, 2]));
  const [budget, setBudget] = useState({
    total: 500000,
    spent: 275000,
    remaining: 225000,
  });

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

  const upcomingTasks = [
    {
      id: 0,
      task: "Book wedding venue",
      deadline: "2 weeks left",
      priority: "high",
      completed: true,
    },
    {
      id: 1,
      task: "Send wedding invitations",
      deadline: "1 week left",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      task: "Final dress fitting",
      deadline: "3 days left",
      priority: "medium",
      completed: true,
    },
    {
      id: 3,
      task: "Confirm catering menu",
      deadline: "5 days left",
      priority: "medium",
      completed: false,
    },
    {
      id: 4,
      task: "Wedding rehearsal",
      deadline: "1 day left",
      priority: "low",
      completed: false,
    },
  ];

  const guestStats = {
    totalInvited: 150,
    responded: 95,
    attending: 87,
    notAttending: 8,
  };

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
        console.log("user", user);
        console.log("userInfo", userInfo);

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
        console.log("user ->", data.user);
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [token]); // Re-run the effect if the token changes

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

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) newCompleted.delete(taskId);
    else newCompleted.add(taskId);
    setCompletedTasks(newCompleted);
  };

  const completedTasksCount = upcomingTasks.filter((task) =>
    completedTasks.has(task.id)
  ).length;
  const progressPercentage = (completedTasksCount / upcomingTasks.length) * 100;

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
                {user?.name
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ") || "User"}
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
                    <small className="text-muted">0 of 20</small>
                  </div>
                  <div className="col py-3">
                    <h6 className="mb-1 fw-semibold text-dark">
                      Guest Attending
                    </h6>
                    <small className="text-muted">0 of 100</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          {/* Upcoming Tasks */}
          <div className="col-lg-6 mb-4">
            <div className="dashboard-card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title">
                  <Clock size={20} className="me-2" />
                  Upcoming Tasks
                </h4>
                <span className="task-progress">
                  {completedTasksCount}/{upcomingTasks.length} completed
                </span>
              </div>
              <div className="progress-bar-container mb-4">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
              <div className="tasks-list">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-item ${
                      completedTasks.has(task.id) ? "completed" : ""
                    }`}
                  >
                    <div
                      className="task-checkbox"
                      onClick={() => toggleTask(task.id)}
                    >
                      {completedTasks.has(task.id) && <CheckCircle size={16} />}
                    </div>
                    <div className="task-content">
                      <div className="task-name">{task.task}</div>
                      <div className="task-meta">
                        <span className="task-deadline">{task.deadline}</span>
                        <span className={`task-priority ${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="add-task-btn">
                  <Plus size={16} /> Add new task
                </button>
              </div>
            </div>
          </div>

          {/* Guest List & Budget */}
          <div className="col-lg-6">
            {/* Guest List */}
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
                    <div className="stat-number">{guestStats.totalInvited}</div>
                    <div className="stat-label">Invited</div>
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="guest-stat">
                    <div className="stat-number">{guestStats.responded}</div>
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
                      {guestStats.notAttending}
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

            {/* Budget */}
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
                    ₹{(budget.total / 1000).toFixed(0)}k
                  </div>
                  <div className="budget-label">Total Budget</div>
                </div>
                <div className="budget-breakdown">
                  <div className="budget-item">
                    <span className="budget-spent">
                      ₹{(budget.spent / 1000).toFixed(0)}k spent
                    </span>
                    <span className="budget-remaining">
                      ₹{(budget.remaining / 1000).toFixed(0)}k remaining
                    </span>
                  </div>
                </div>
                <div className="budget-progress">
                  <div className="budget-bar">
                    <div
                      className="budget-fill"
                      style={{
                        width: `${(budget.spent / budget.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="budget-percentage">
                    {Math.round((budget.spent / budget.total) * 100)}% used
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
        </div>
      </div>
    </div>
  );
};

export default Wedding;
