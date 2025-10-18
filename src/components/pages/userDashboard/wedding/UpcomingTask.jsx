import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPlusLg } from "react-icons/bs";
import { useSelector } from "react-redux";
import axios from "axios";

const UpComingTask = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [loading, setLoading] = useState(true);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id || user?.user_id || user?._id;
  const [refresh, setRefresh] = useState(false); // To trigger refetch

  // Fetch real checklist tasks
  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://happywedz.com/api/new-checklist/newChecklist/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const allTasks = res.data?.data || [];
        // Filter for pending tasks and set initial completed state
        const pending = allTasks.filter((task) => task.status === "pending");
        setTasks(pending);

        const completed = {};
        allTasks.forEach((task) => {
          if (task.status === "completed") {
            completed[task.id] = true;
          }
        });
        setCompletedTasks(completed);
      } catch (error) {
        console.error("Failed to fetch upcoming tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId, token, refresh]);

  const handleCheckboxChange = async (event) => {
    const { name: taskId, checked } = event.target;

    if (!checked) return; // Only handle completion, not un-checking

    // Optimistically remove from UI
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== parseInt(taskId)));

    try {
      const newStatus = "completed";
      await axios.put(
        `https://happywedz.com/api/new-checklist/update/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Trigger a full refetch to ensure data consistency
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Failed to update task status:", error);
      // If the API call fails, trigger a refetch to revert the optimistic update
      setRefresh((prev) => !prev);
    }
  };

  const pendingTasksCount = tasks.length;

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Upcoming tasks</h1>
        <p className="text-muted">Loading your checklist...</p>
      </div>
    );
  }

  // UI for when no checklist is found
  if (!loading && tasks.length === 0 && Object.keys(completedTasks).length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ marginBottom: "1.5rem" }}>Start Your Planning</h1>
        <div className="bg-light p-4 p-md-5 rounded-4 d-flex flex-column align-items-center">
          <i className="fa-solid fa-list-check fs-1 text-primary mb-3"></i>
          <h4 className="fw-bold text-dark my-2">
            Your Wedding Checklist is Empty
          </h4>
          <p className="text-muted mb-4">
            Create a personalized checklist to stay organized and on track.
          </p>
          <Link to="/user-dashboard/checklist" className="btn btn-primary rounded-3 px-4">
            <BsPlusLg className="me-2" /> Create Your Checklist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Upcoming tasks</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Show only the first 3 tasks */}
        {tasks.slice(0, 3).map((task, index) => (
          <div
            key={task.id || index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "10px",
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
          >
            <input
              type="checkbox"
              name={`${task.id}`}
              onChange={handleCheckboxChange}
              checked={false} // Checkboxes for pending tasks are always unchecked
              style={{ height: "20px", width: "20px" }}
            />
            <div style={{ marginLeft: "10px" }}>
              <p className="mb-1">{task.text}</p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Tap to open Search
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem 0",
          color: "#C31162",
        }}
      >
        <Link
          to="/user-dashboard/checklist"
          className="text-decoration-none"
          style={{ borderBottom: "2px solid #C31162", color: "#C31162" }}
        >
          {pendingTasksCount} PENDING TASKS{" "}
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default UpComingTask;
