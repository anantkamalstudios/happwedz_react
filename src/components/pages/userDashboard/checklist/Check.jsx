import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
import { FiCheck, FiTrash } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE = "https://happywedz.com/api/checklist_new";
const CATEGORY_API = "https://happywedz.com/api/vendor-types/with-subcategories/all"; // For categories

const Check = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = useSelector((state) => state.auth.user?.id);
  const token = useSelector((state) => state.auth.token);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);

  // Debug user object and try different ID fields
  console.log("Full user object:", user);
  console.log("User ID (id):", userId);
  console.log("User ID (user_id):", user?.user_id);
  console.log("User ID (_id):", user?._id);
  console.log("Token:", token ? "Present" : "Missing");

  // Use the first available ID
  const actualUserId = userId || user?.user_id || user?._id;
  console.log("Actual User ID used:", actualUserId);

  // Axios instance with auth header and timeout
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
  });

  // Fetch checklist items for the user
  const fetchTasks = async () => {
    if (!actualUserId || !token) {
      setError("User not authenticated. Please login again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 15000)
    );

    try {
      const params = { user_id: actualUserId };
      if (selectedStatus !== "All") params.status = selectedStatus.toLowerCase();
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedPeriod !== "All") params.period = selectedPeriod;

      console.log("Fetching tasks with params:", params);
      console.log("API URL:", `${API_BASE}/${actualUserId}`);
      console.log("Token:", token ? "Present" : "Missing");

      // Race between API call and timeout
      const response = await Promise.race([
        axiosInstance.get(`${API_BASE}/${actualUserId}`, { params }),
        timeoutPromise
      ]);

      console.log("API Response:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setTasks(response.data.data || []);
      } else if (Array.isArray(response.data)) {
        setTasks(response.data || []);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      if (err.message === 'Request timeout') {
        setError("Request timed out. Please check your internet connection.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request was cancelled or timed out.");
      } else if (err.response?.status === 404) {
        setError("Checklist API endpoint not found. Please contact support.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load tasks");
      }
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [actualUserId, selectedCategory, selectedPeriod, selectedStatus, refresh]);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Create a timeout promise for categories too
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const response = await Promise.race([
          axiosInstance.get(CATEGORY_API),
          timeoutPromise
        ]);
        const categoryNames = response.data.map(cat => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set default categories if API fails
        setCategories(["All", "Planning", "Venues", "Catering", "Photography", "Music", "Decorations"]);
      }
    };
    fetchCategories();
  }, []);

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

  // Toggle task status
  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.put(`${API_BASE}/${id}`, {
        status: currentStatus === "completed" ? "pending" : "completed"
      });
      setError(null);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("Error toggling task:", err);
      setError(err.response?.data?.message || err.message || "Failed to update task");
    }
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.trim() || !actualUserId || !token) {
      setError("Please provide task description and ensure you're logged in.");
      return;
    }
    const payload = {
      user_id: actualUserId,
      title: newTask,
      category: selectedCategory !== "All" ? selectedCategory : "Planning",
      period: selectedPeriod !== "All" ? selectedPeriod : "10-12 months",
      status: "pending",
    };

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), 15000)
    );

    try {
      console.log("Adding task with payload:", payload);
      const res = await Promise.race([
        axiosInstance.post(API_BASE, payload),
        timeoutPromise
      ]);
      console.log("Add task response:", res.data);
      setNewTask("");
      setError(null);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("Error adding task:", err);
      if (err.message === 'Request timeout') {
        setError("Request timed out. Please try again.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Request was cancelled or timed out.");
      } else if (err.response?.status === 404) {
        setError("Add task API endpoint not found. Please contact support.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to add task");
      }
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`${API_BASE}/${id}`);
      setError(null);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete task");
    }
  };

  // Counts
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const countByCategory = {};
  categories.forEach((cat) => {
    if (cat !== "All") {
      countByCategory[cat] = tasks.filter((t) => t.category === cat).length;
    }
  });
  const countByPeriod = {};
  periods.forEach((p) => {
    if (p !== "All") countByPeriod[p] = tasks.filter((t) => t.period === p).length;
  });

  // Style for scrollable category list
  const categoryListStyle = { maxHeight: '250px', overflowY: 'auto' };
  return (
    <div className="wc-container container-fluid py-4">
      <div className="wc-row row">
        {/* Sidebar */}
        <div className="wc-sidebar col-md-3">
          {/* STATUS */}
          <div className="wc-card card mb-4 border-0">
            <div className="wc-card-header card-header text-white">
              <h5 className="mb-0">STATUS</h5>
            </div>
            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                {["All", "Pending", "Completed"].map((status) => (
                  <li
                    key={status}
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedStatus === status ? "wc-active" : ""
                      }`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                    <span className="wc-badge badge rounded-pill">
                      {status === "All"
                        ? tasks.length
                        : status === "Pending"
                          ? pendingCount
                          : completedCount}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PERIOD */}
          <div className="wc-card card mb-4 border-0">
            <div className="wc-card-header card-header text-white">
              <h5 className="mb-0">DATE</h5>
            </div>
            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                {periods.map((period) => (
                  <li
                    key={period}
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedPeriod === period ? "wc-active" : ""
                      }`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                    {period !== "All" && (
                      <span className="wc-badge badge rounded-pill">
                        {countByPeriod[period] || 0}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="wc-card card border-0">
            <div className="wc-card-header card-header text-white">
              <h5 className="mb-0">CATEGORY</h5>
            </div>
            <div className="wc-card-body card-body p-0">
              <ul className="wc-list-group list-group" style={categoryListStyle}>
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedCategory === cat ? "wc-active" : ""
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                    <span className="wc-badge badge rounded-pill">{cat === "All" ? tasks.length : countByCategory[cat] || 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="wc-main-content col-md-9">
          <div className="wc-card card">
            <div className="wc-card-header card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Checklist</h5>
              <div className="d-flex">
                <button className="wc-btn btn btn-outline-secondary me-2">
                  <FaDownload className="me-1" /> Download
                </button>
                <button className="wc-btn btn btn-outline-secondary">
                  <FaPrint className="me-1" /> Print
                </button>
              </div>
            </div>

            <div className="wc-card-body card-body">
              <div className="wc-progress mb-4">
                <h5>
                  Completed{" "}
                  <span className="wc-completed text-success">
                    {completedCount}
                  </span>{" "}
                  out of{" "}
                  <span className="wc-total text-primary">{tasks.length}</span>{" "}
                  tasks
                </h5>
              </div>

              {/* Test API Connection Button */}
              <div className="mb-3">
                <button
                  className="btn btn-outline-info btn-sm me-2"
                  onClick={async () => {
                    try {
                      console.log("Testing API connection...");
                      const response = await fetch(`${API_BASE}/${actualUserId}`, {
                        method: 'GET',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      console.log("Test API Response Status:", response.status);
                      console.log("Test API Response:", await response.text());
                    } catch (err) {
                      console.error("Test API Error:", err);
                    }
                  }}
                >
                  Test API Connection
                </button>
              </div>

              {/* Add new task */}
              <div className="wc-add-task card mb-4">
                <div className="wc-card-header card-header bg-light text-black">
                  <h5 className="mb-0">Add a new task</h5>
                </div>
                <div className="wc-card-body card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Task Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Enter task description"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories
                          .filter((c) => c !== "All")
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Time Period</label>
                      <select
                        className="form-select"
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                      >
                        {periods
                          .filter((p) => p !== "All")
                          .map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={addTask}
                    disabled={!newTask.trim() || !actualUserId || !token}
                  >
                    <FaPlus className="me-1" /> Add Task
                  </button>
                </div>
              </div>

              {/* Error display */}
              {error && (
                <div className="alert alert-danger mb-3">
                  {error}
                </div>
              )}

              {/* Authentication check */}
              {!actualUserId || !token ? (
                <div className="alert alert-warning mb-3">
                  Please login to access your checklist.
                </div>
              ) : null}

              {/* Task list */}
              <div className="wc-task-list">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading tasks...</span>
                    </div>
                    <div className="mt-2">Loading tasks...</div>
                  </div>
                ) : tasks.length > 0 ? (
                  <ul className="list-group">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="list-group-item d-flex align-items-center"
                      >
                        <div
                          className={`wc-task-checkbox me-3 ${task.status === "completed" ? "wc-completed" : ""
                            }`}
                          onClick={() => toggleTask(task.id, task.status)}
                        >
                          {task.status === "completed" && <FiCheck />}
                        </div>
                        <div className="flex-grow-1">
                          <div
                            className={
                              task.status === "completed"
                                ? "text-muted text-decoration-line-through"
                                : ""
                            }
                          >
                            {task.title}
                          </div>
                          <div className="text-muted small mt-1">
                            <span className="me-2">{task.category}</span>
                            <span>{task.period}</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => deleteTask(task.id)}
                        >
                          <FiTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-info">No tasks found.</div>
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
