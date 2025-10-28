import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
import { FiCheck, FiTrash, FiLink, FiEdit } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const BASE_URL = "https://happywedz.com/api/new-checklist";
const CATEGORY_API =
  "https://happywedz.com/api/vendor-types/with-subcategories/all";
const Check = () => {
  console.log("[Check Component] Mounting/Rendering");

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userId = user?.id || user?.user_id || user?._id;

  const [checklists, setChecklists] = useState([]);
  const [text, setText] = useState("");
  const [vendorSubId, setVendorSubId] = useState(""); // Used for adding new tasks
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [requiredDays, setRequiredDays] = useState(0);
  const [timeOptions, setTimeOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Fetch checklist data
  const fetchChecklists = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/newChecklist/user/${userId}`
      );
      const fetchedChecklists = res.data?.data || [];
      setChecklists(fetchedChecklists);
      if (res.data?.data?.length > 0) {
        // Reuse previously set wedding date
        const firstTask = res.data.data[0];
        if (firstTask.start_date)
          setStartDate(firstTask.start_date.split("T")[0]);
        if (firstTask.wedding_date)
          setWeddingDate(firstTask.wedding_date.split("T")[0]);
      }
    } catch (err) {
      console.error("Error fetching checklists:", err);
      setError("Failed to load checklist data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      const allSubs = res.data.flatMap((cat) =>
        cat.subcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          required_days: sub.required_days || 2, // default if missing
          category: {
            id: cat.id,
            name: cat.name,
          },
        }))
      );
      setCategories(allSubs);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Calculate remaining days
  useEffect(() => {
    if (weddingDate) {
      const today = new Date();
      const wedding = new Date(weddingDate);
      const diffTime = wedding - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(diffDays);
    }
  }, [weddingDate]);

  useEffect(() => {
    fetchChecklists();
    fetchCategories();
  }, [userId, refresh]);

  // When category changes, set required days
  useEffect(() => {
    if (vendorSubId && categories.length) {
      const selected = categories.find((c) => c.id === parseInt(vendorSubId));
      setRequiredDays(selected?.required_days || 0);
    }
  }, [vendorSubId, categories]);

  // Auto-calculate available time periods
  useEffect(() => {
    if (startDate && weddingDate && requiredDays > 0) {
      const s = new Date(startDate);
      const w = new Date(weddingDate);
      const totalDays = Math.ceil((w - s) / (1000 * 60 * 60 * 24));

      if (totalDays < 8) {
        setTimeOptions(["Wedding too near (<8 days)"]);
        return;
      }

      // Calculate ideal completion window
      const endDate = new Date(s);
      endDate.setDate(endDate.getDate() + requiredDays);

      setTimeOptions([
        `${requiredDays} days required`,
        `Start: ${s.toLocaleDateString()}`,
        `End: ${endDate.toLocaleDateString()}`,
        `Remaining buffer: ${totalDays - requiredDays} days`,
      ]);
    }
  }, [startDate, weddingDate, requiredDays]);

  // Logic for auto-distribution of the main checklist
  const [distributedTasks, setDistributedTasks] = useState([]);

  useEffect(() => {
    if (!startDate || !weddingDate || checklists.length === 0) {
      setDistributedTasks([]);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(weddingDate);
    const totalDays = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    );
    const perTaskDays = Math.max(1, Math.floor(totalDays / checklists.length));

    const temp = [];
    let current = new Date(start);

    for (let i = 0; i < checklists.length; i++) {
      const taskStart = new Date(current);
      const taskEnd = new Date(current);
      taskEnd.setDate(taskEnd.getDate() + perTaskDays - 1);
      temp.push({
        ...checklists[i],
        days_assigned: perTaskDays,
        distributed_start_date: taskStart.toLocaleDateString(),
        distributed_end_date: taskEnd.toLocaleDateString(),
      });
      current.setDate(current.getDate() + perTaskDays);
    }
    setDistributedTasks(temp);
  }, [checklists, startDate, weddingDate]);

  // Add checklist with validation
  const addChecklist = async () => {
    setError(null);

    if (!text || !vendorSubId) {
      setError("Please fill all fields before adding a task.");
      return;
    }

    if (!startDate || !weddingDate) {
      setError("Please select start and wedding dates first.");
      return;
    }

    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffDays = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 8) {
      setError(
        "Your wedding is near! Checklist cannot be created (less than 8 days left)."
      );
      return;
    }

    const payload = {
      userId,
      vendor_subcategory_id: vendorSubId,
      text,
      start_date: startDate,
      wedding_date: weddingDate,
      status: "pending",
    };

    try {
      await axiosInstance.post(`${BASE_URL}/create`, payload);
      setText("");
      setVendorSubId("");
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error adding checklist:", err);
      setError("Failed to create checklist.");
    }
  };

  // Handle edit click
  const handleEdit = (id) => {
    // alert(`Edit functionality for task ID: ${id} is not yet implemented.`);
    Swal.fire({
      icon: "info",
      text: `Edit functionality for task ID: ${id} is not yet implemented.`,
      confirmButtonText: "OK",
      confirmButtonColor: "#C31162",
      timer: "3000",
    });
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await axiosInstance.put(`${BASE_URL}/update/${id}`, {
        status: newStatus,
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      setError("Failed to update checklist.");
    }
  };

  const deleteChecklist = async (id) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
      setRefresh((prev) => !prev);
    } catch (err) {
      setError("Failed to delete checklist.");
    }
  };

  const completedCount = checklists.filter(
    (c) => c.status === "completed"
  ).length;

  // Pagination logic
  const currentTasks =
    distributedTasks.length > 0 ? distributedTasks : checklists;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentTasks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4">
          <div className="card mb-4 border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">STATUS</h5>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  Pending
                  <span className="badge bg-warning">
                    {checklists.filter((c) => c.status === "pending").length}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  Completed
                  <span className="badge bg-success">{completedCount}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="card border-0">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">WEDDING DATES</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  disabled={checklists.length > 0 && !!startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Wedding Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={weddingDate}
                  disabled={checklists.length > 0 && !!weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                />
              </div>

              {daysLeft !== null && (
                <div
                  className={`alert ${
                    daysLeft > 0 ? "alert-info" : "alert-success"
                  } mt-2 mb-0`}
                >
                  {daysLeft > 0
                    ? `${daysLeft} days to go`
                    : daysLeft === 0
                    ? "Wedding Day!"
                    : "Wedding date has passed!"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Wedding Checklist</h5>
              <div>
                <button className="btn btn-outline-secondary me-2">
                  <FaDownload className="me-1" /> Download
                </button>
                <button className="btn btn-outline-secondary">
                  <FaPrint className="me-1" /> Print
                </button>
              </div>
            </div>

            <div className="card-body">
              <h6 className="mb-3">
                Completed <span className="text-success">{completedCount}</span>{" "}
                / <span className="text-primary">{checklists.length}</span>
              </h6>

              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Add checklist form */}
              <div className="card mb-4 border">
                <div className="card-header bg-light text-black">
                  <h6 className="mb-0">Add New Checklist</h6>
                </div>
                <div className="card-body">
                  {/* This is the new UI for auto-distribution, adapted to add to the main checklist */}
                  <div className="row align-items-end">
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={vendorSubId}
                        onChange={(e) => setVendorSubId(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {categories.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Task Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter checklist task"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2 mb-3 d-grid">
                      <button
                        className="btn btn-primary w-100"
                        onClick={addChecklist}
                      >
                        <FaPlus className="me-1" /> Add
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="font-semibold">Time Period</label>
                    {timeOptions.length > 0 ? (
                      <ul className="mt-2 text-sm text-gray-600">
                        {timeOptions.map((t, i) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Select category and dates first
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Checklist list */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : checklists.length > 0 ? (
                <ul className="list-group">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "5%" }}>Status</th>
                        <th>Task</th>
                        <th>Category</th>
                        <th>Days Assigned</th>
                        <th style={{ width: "10%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr
                          key={item.id}
                          className={
                            item.status === "completed"
                              ? "table-success-light"
                              : ""
                          }
                        >
                          <td className="text-center align-middle">
                            <div
                              style={{ cursor: "pointer", fontSize: "1.3rem" }}
                              onClick={() => toggleStatus(item.id, item.status)}
                            >
                              {item.status === "completed" ? (
                                <FaCheck className="text-success" />
                              ) : (
                                <FiCheck className="text-secondary" />
                              )}
                            </div>
                          </td>
                          <td
                            className={
                              item.status === "completed"
                                ? "text-muted text-decoration-line-through"
                                : ""
                            }
                          >
                            {item.text}
                          </td>
                          <td>
                            {(() => {
                              const subcategory = categories.find(
                                (c) => c.id === item.vendor_subcategory_id
                              );
                              return (
                                <>
                                  <Link
                                    to={`/category/${subcategory?.category?.id}`}
                                    className="text-decoration-none"
                                  >
                                    {subcategory?.name || "N/A"}
                                    <FiLink size={12} className="ms-1" />
                                  </Link>
                                  {subcategory?.required_days && (
                                    <span className="badge bg-info-light text-dark ms-2">
                                      {subcategory.required_days} days
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </td>
                          <td>{item.days_assigned || "N/A"}</td>
                          <td className="text-center align-middle d-flex justify-content-center">
                            <div className="btn-group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleEdit(item.id)}
                              >
                                <FiEdit />
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => deleteChecklist(item.id)}
                              >
                                <FiTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ul>
              ) : (
                <div className="alert alert-info">
                  No checklist tasks found.
                </div>
              )}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i + 1}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          onClick={() => paginate(i + 1)}
                          className="page-link"
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Check;
