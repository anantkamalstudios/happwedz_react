import React, { useState } from "react";
import {
  CheckCircle,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Camera,
  Music,
  Utensils,
  Heart,
  Star,
  Gift,
  Clock,
  Plus,
} from "lucide-react";
import { MdDinnerDining } from "react-icons/md";
import { BsTruck } from "react-icons/bs";
import { TbCards } from "react-icons/tb";
import { PiFlowerLotusThin } from "react-icons/pi";
import { GrPlan } from "react-icons/gr";
import { Link, Links } from "react-router-dom";

const MyWedding = () => {
  const [completedTasks, setCompletedTasks] = useState(new Set([0, 2]));
  const [budget, setBudget] = useState({
    total: 500000,
    spent: 275000,
    remaining: 225000,
  });

  const toSlug = (text) =>
    text
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "";

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

  const vendorCategories = [
    {
      icon: <Camera size={24} />,
      title: "Wedding Photographers",
      subtitle: "Capture your memories",
      count: 12,
    },
    {
      icon: <Utensils size={24} />,
      title: "Wedding Videography",
      subtitle: "Delicious wedding meals",
      count: 8,
    },
    {
      icon: <Music size={24} />,
      title: "Wedding Music",
      subtitle: "Perfect wedding soundtrack",
      count: 15,
    },
    {
      icon: <MdDinnerDining size={24} />,
      title: "Caterers",
      subtitle: "Beautiful ceremony locations",
      count: 6,
    },
    {
      icon: <BsTruck size={24} />,
      title: "Wedding Transportation",
      subtitle: "Make it picture perfect",
      count: 10,
    },
    {
      icon: <TbCards size={24} />,
      title: "Wedding Invitations",
      subtitle: "Thank your guests",
      count: 20,
    },
    {
      icon: <Gift size={24} />,
      title: "Wedding Gifts",
      subtitle: "Thank your guests",
      count: 20,
    },
    {
      icon: <PiFlowerLotusThin size={24} />,
      title: "Florists",
      subtitle: "Thank your guests",
      count: 20,
    },
    {
      icon: <GrPlan size={24} />,
      title: "Wedding Planners",
      subtitle: "Thank your guests",
      count: 20,
    },
  ];

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const completedTasksCount = upcomingTasks.filter((task) =>
    completedTasks.has(task.id)
  ).length;
  const progressPercentage = (completedTasksCount / upcomingTasks.length) * 100;

  return (
    <div className="wedding-dashboard">
      <div className="container-fluid py-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Your Wedding Planning Journey</h1>
              <p className="dashboard-subtitle">
                Find the venue for your ceremonies and Book all your vendors
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Categories Grid */}
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="section-title">Find & Book Your Wedding Vendors</h3>
            <div className="row">
              {vendorCategories.map((category, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-3">
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
                        state={{ title: category }}
                        className="btn-explore"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column - Upcoming Tasks */}
          <div className="col-lg-6 mb-4">
            <div className="dashboard-card">
              <div className="card-header">
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
                  <Plus size={16} />
                  Add new task
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Guest List and Budget */}
          <div className="col-lg-6">
            {/* Guest List Section */}
            <div className="dashboard-card mb-4">
              <div className="card-header">
                <h4 className="card-title">
                  <Users size={20} className="me-2" />
                  Guest List
                </h4>
                <button className="btn-small">Manage</button>
              </div>

              <div className="guest-stats">
                <div className="row">
                  <div className="col-6 col-sm-3">
                    <div className="guest-stat">
                      <div className="stat-number">
                        {guestStats.totalInvited}
                      </div>
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
              </div>

              <div className="guest-actions">
                <button className="btn-action">Send Invitations</button>
                <button className="btn-action-outline">
                  View Seating Chart
                </button>
              </div>
            </div>

            {/* Budget Section */}
            <div className="dashboard-card">
              <div className="card-header">
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

              <div className="budget-categories">
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

        {/* Quick Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="quick-actions-card">
              <h5 className="quick-actions-title">Quick Actions</h5>
              <div className="quick-actions-grid">
                <button className="quick-action-btn">
                  <Calendar size={18} />
                  Wedding Timeline
                </button>
                <button className="quick-action-btn">
                  <Star size={18} />
                  Vendor Reviews
                </button>
                <button className="quick-action-btn">
                  <Gift size={18} />
                  Registry
                </button>
                <button className="quick-action-btn">
                  <Heart size={18} />
                  Wedding Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWedding;
