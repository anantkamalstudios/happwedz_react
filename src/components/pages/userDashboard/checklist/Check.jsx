import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaPlus, FaDownload, FaPrint, FaTrash } from "react-icons/fa";

const Check = () => {
  const initialTasks = [
    {
      id: 1,
      text: "Check if your wedding date is on an auspicious day",
      category: "Planning",
      period: "10-12 months",
      status: false,
    },
    {
      id: 2,
      text: "Do you want a destination wedding?",
      category: "Planning",
      period: "10-12 months",
      status: false,
    },
    {
      id: 3,
      text: "Short list date options for all pre-wedding functions",
      category: "Planning",
      period: "10-12 months",
      status: false,
    },
    {
      id: 4,
      text: "Delegate responsibilities",
      category: "Other",
      period: "10-12 months",
      status: false,
    },
    {
      id: 5,
      text: "Decide whether or not you'd like to use a wedding planner",
      category: "Planning",
      period: "10-12 months",
      status: true,
    },
    {
      id: 6,
      text: "Download the WeddingWire App",
      category: "Planning",
      period: "10-12 months",
      status: true,
    },
    {
      id: 7,
      text: "Create initial guest list using our guest list tool",
      category: "Planning",
      period: "10-12 months",
      status: true,
    },
    {
      id: 8,
      text: "Confirm venue budget",
      category: "Events",
      period: "10-12 months",
      status: true,
    },
    {
      id: 9,
      text: "Confirm wedding style",
      category: "Planning",
      period: "10-12 months",
      status: true,
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const categories = [
    "All",
    "Essential",
    "Events",
    "Catering",
    "Photography and video",
    "Planning",
    "Jewellery",
    "Transportation",
    "Wedding cards",
    "Flowers and Decoration",
    "Bridal Accessories",
    "Groom's Accessories",
    "Health and Beauty",
    "Entertainment",
    "Guests",
    "Honeymoon",
    "Other",
  ];
  const periods = [
    "All",
    "10-12 months",
    "7-9 months",
    "4-6 months",
    "2-3 months",
    "The last month",
    "2 weeks",
    "Last week",
    "After the wedding",
  ];

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedCategory === "All" || task.category === selectedCategory) &&
      (selectedPeriod === "All" || task.period === selectedPeriod) &&
      (selectedStatus === "All" ||
        (selectedStatus === "Pending" && !task.status) ||
        (selectedStatus === "Completed" && task.status))
    );
  });

  // Toggle task status
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: !task.status } : task
      )
    );
  };

  // Add new task
  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObj = {
      id: tasks.length + 1,
      text: newTask,
      category: selectedCategory !== "All" ? selectedCategory : "Planning",
      period: selectedPeriod !== "All" ? selectedPeriod : "10-12 months",
      status: false,
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Count tasks by status
  const pendingCount = tasks.filter((task) => !task.status).length;
  const completedCount = tasks.filter((task) => task.status).length;

  // Count tasks by category
  const countByCategory = {};
  categories.forEach((cat) => {
    if (cat !== "All") {
      countByCategory[cat] = tasks.filter(
        (task) => task.category === cat
      ).length;
    }
  });

  // Count tasks by period
  const countByPeriod = {};
  periods.forEach((period) => {
    if (period !== "All") {
      countByPeriod[period] = tasks.filter(
        (task) => task.period === period
      ).length;
    }
  });

  return (
    <div className="wc-container container-fluid py-4">
      <div className="wc-row row">
        {/* Left sidebar */}
        <div className="wc-sidebar col-md-3">
          <div className="wc-card card mb-4">
            <div
              className="wc-card-header card-header text-white"
              style={{ backgroundColor: "#e24582" }}
            >
              <h5 className="mb-0">STATUS</h5>
            </div>

            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                <li
                  className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                    selectedStatus === "All" ? "wc-active" : ""
                  }`}
                  onClick={() => setSelectedStatus("All")}
                >
                  All
                  <span className="wc-badge badge bg-primary rounded-pill">
                    {tasks.length}
                  </span>
                </li>
                <li
                  className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                    selectedStatus === "Pending" ? "wc-active" : ""
                  }`}
                  onClick={() => setSelectedStatus("Pending")}
                >
                  Pending
                  <span className="wc-badge badge bg-warning rounded-pill">
                    {pendingCount}
                  </span>
                </li>
                <li
                  className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                    selectedStatus === "Completed" ? "wc-active" : ""
                  }`}
                  onClick={() => setSelectedStatus("Completed")}
                >
                  Completed
                  <span className="wc-badge badge bg-success rounded-pill">
                    {completedCount}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="wc-card card mb-4">
            <div
              className="wc-card-header card-header text-white"
              style={{ backgroundColor: "#e24582" }}
            >
              <h5 className="mb-0">DATE</h5>
            </div>
            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                {periods
                  .filter((p) => p !== "All")
                  .map((period) => (
                    <li
                      key={period}
                      className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                        selectedPeriod === period ? "wc-active" : ""
                      }`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period}
                      <span className="wc-badge badge bg-primary rounded-pill">
                        {countByPeriod[period] || 0}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="wc-card card">
            <div
              className="wc-card-header card-header text-white"
              style={{ backgroundColor: "#e24582" }}
            >
              <h5 className="mb-0">CATEGORY</h5>
            </div>
            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                {categories
                  .filter((cat) => cat !== "All")
                  .map((category) => (
                    <li
                      key={category}
                      className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                        selectedCategory === category ? "wc-active" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                      <span className="wc-badge badge bg-primary rounded-pill">
                        {countByCategory[category] || 0}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="wc-main-content col-md-9">
          <div className="wc-card card">
            <div className="wc-card-header card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Checklist</h2>
                <div className="d-flex">
                  <button className="wc-btn btn btn-outline-secondary me-2">
                    <FaDownload className="me-1" /> Download
                  </button>
                  <button className="wc-btn btn btn-outline-secondary">
                    <FaPrint className="me-1" /> Print
                  </button>
                </div>
              </div>
            </div>
            <div className="wc-card-body card-body">
              <div className="wc-progress mb-4">
                <h5>
                  You have completed{" "}
                  <span className="wc-completed text-success">
                    {completedCount}
                  </span>{" "}
                  out of{" "}
                  <span className="wc-total text-primary">{tasks.length}</span>{" "}
                  tasks
                </h5>
              </div>

              {/* Add new task */}
              <div className="wc-add-task card mb-4">
                <div className="wc-card-header card-header bg-light">
                  <h5 className="mb-0">Add a new task</h5>
                </div>
                <div className="wc-card-body card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="wc-form-label form-label">
                        Task Description
                      </label>
                      <input
                        type="text"
                        className="wc-form-control form-control"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="wc-form-label form-label">
                        Category
                      </label>
                      <select
                        className="wc-form-select form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories
                          .filter((cat) => cat !== "All")
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="wc-form-label form-label">
                        Time Period
                      </label>
                      <select
                        className="wc-form-select form-select"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        {periods
                          .filter((p) => p !== "All")
                          .map((period) => (
                            <option key={period} value={period}>
                              {period}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <button className="wc-btn btn btn-primary" onClick={addTask}>
                    <FaPlus className="me-1" /> Add Task
                  </button>
                </div>
              </div>

              {/* Task list */}
              <div className="wc-task-list">
                {filteredTasks.length > 0 ? (
                  <ul className="wc-list-group list-group">
                    {filteredTasks.map((task) => (
                      <li
                        key={task.id}
                        className="wc-list-item list-group-item"
                      >
                        <div className="d-flex align-items-center">
                          <div
                            className={`wc-task-checkbox me-3 ${
                              task.status ? "wc-completed" : ""
                            }`}
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.status && (
                              <FaCheck className="text-success" />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <div
                              className={`wc-task-text ${
                                task.status
                                  ? "text-muted text-decoration-line-through"
                                  : ""
                              }`}
                            >
                              {task.text}
                            </div>
                            <div className="wc-task-meta text-muted small mt-1">
                              <span className="me-2">{task.category}</span>
                              <span>{task.period}</span>
                            </div>
                          </div>
                          <button
                            className="wc-btn btn btn-sm btn-outline-danger"
                            onClick={() => deleteTask(task.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="wc-alert alert alert-info">
                    No tasks found matching your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Check;
