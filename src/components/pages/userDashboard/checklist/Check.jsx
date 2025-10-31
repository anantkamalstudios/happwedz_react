import { useState, useEffect } from "react";
import {
  FaCheck,
  FaPlus,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaHeart,
} from "react-icons/fa";
import { FiCheck, FiTrash, FiLink, FiEdit, FiClock } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const BASE_URL = "https://happywedz.com/api/new-checklist";
const CATEGORY_API =
  "https://happywedz.com/api/vendor-types/with-subcategories/all";

const Check = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userId = user?.id || user?.user_id || user?._id;

  const [checklists, setChecklists] = useState([]);
  const [text, setText] = useState("");
  const [vendorSubId, setVendorSubId] = useState("");
  const [categories, setCategories] = useState([]);
  const [startDate, setStartDate] = useState("");
  // Initialize wedding date from Redux user data
  const [weddingDate, setWeddingDate] = useState(
    user?.weddingDate ? String(user.weddingDate).slice(0, 10) : ""
  );
  const [loading, setLoading] = useState(false);

  // Handler for start date change
  const handleStartDateChange = (newDate) => {
    const formattedDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : '';
    setStartDate(formattedDate);
  };

  // Handler for wedding date change
  const handleWeddingDateChange = (newDate) => {
    const formattedDate = newDate ? dayjs(newDate).format('YYYY-MM-DD') : '';
    setWeddingDate(formattedDate);
  };
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

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_API);
      const allSubs = res.data.flatMap((cat) =>
        cat.subcategories.map((sub) => ({
          id: sub.id,
          name: sub.name,
          required_days: sub.required_days || 2,
          category: { id: cat.id, name: cat.name },
        }))
      );
      setCategories(allSubs);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Sync wedding date from Redux when user data changes
  useEffect(() => {
    if (user?.weddingDate) {
      const formattedDate = String(user.weddingDate).slice(0, 10);
      setWeddingDate(formattedDate);
    }
  }, [user?.weddingDate]);

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

  useEffect(() => {
    if (vendorSubId && categories.length) {
      const selected = categories.find((c) => c.id === parseInt(vendorSubId));
      setRequiredDays(selected?.required_days || 0);
    }
  }, [vendorSubId, categories]);

  useEffect(() => {
    if (startDate && weddingDate && requiredDays > 0) {
      const s = new Date(startDate);
      const w = new Date(weddingDate);
      const totalDays = Math.ceil((w - s) / (1000 * 60 * 60 * 24));

      if (totalDays < 8) {
        setTimeOptions(["Wedding too near (<8 days)"]);
        return;
      }

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

  const handleEdit = (id) => {
    Swal.fire({
      icon: "info",
      text: `Edit functionality for task ID: ${id} is not yet implemented.`,
      confirmButtonText: "OK",
      confirmButtonColor: "#C31162",
      timer: 3000,
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
  const progressPercentage =
    checklists.length > 0 ? (completedCount / checklists.length) * 100 : 0;

  const currentTasks =
    distributedTasks.length > 0 ? distributedTasks : checklists;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = currentTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(currentTasks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <style>{`
        .checklist-container {
          background: linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%);
          min-height: 100vh;
          padding: 2.5rem 0;
        }

        .stat-card {
          background: white;
          height: auto;
          border-radius: 16px;
          padding: 1.75rem;
          box-shadow: 0 4px 20px rgba(195, 17, 98, 0.08);
          border: none;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(195, 17, 98, 0.15);
        }

        .stat-card-header {
          background: linear-gradient(135deg, #C31162 0%, #e91e8c 100%);
          color: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-item {
          background: #fafafa;
          border: none;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 0.75rem;
          transition: all 0.3s ease;
        }

        .status-item:hover {
          background: #f5f5f5;
          transform: translateX(5px);
        }

        .status-badge {
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .badge-pending {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
        }

        .badge-completed {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .date-input-group {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .date-input-group label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-input-group input {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.75rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .date-input-group input:focus {
          border-color: #C31162;
          box-shadow: 0 0 0 3px rgba(195, 17, 98, 0.1);
          outline: none;
        }

        .days-countdown {
          background: linear-gradient(135deg, #C31162 0%, #e91e8c 100%);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          margin-top: 1.5rem;
        }

        .days-countdown .days-number {
          font-size: 2.5rem;
          font-weight: 700;
          display: block;
          line-height: 1;
        }

        .days-countdown .days-text {
          font-size: 0.9rem;
          opacity: 0.9;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .main-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(195, 17, 98, 0.08);
          overflow: hidden;
        }

        .main-card-header {
          background: linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%);
          padding: 1.75rem 2rem;
          border-bottom: 2px solid #fce7f3;
        }

        .main-card-header h5 {
          color: #C31162;
          font-weight: 700;
          font-size: 1.5rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-actions .btn {
          border-radius: 10px;
          padding: 0.6rem 1.25rem;
          font-weight: 600;
          transition: all 0.3s ease;
          border: 2px solid #e5e7eb;
          color: #374151;
          background: white;
        }

        .header-actions .btn:hover {
          background: #C31162;
          border-color: #C31162;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(195, 17, 98, 0.3);
        }

        .progress-section {
          background: #fafafa;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .progress-section h6 {
          color: #374151;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .progress-bar-wrapper {
          background: #e5e7eb;
          border-radius: 20px;
          height: 12px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-bar-fill {
          background: linear-gradient(90deg, #C31162 0%, #e91e8c 100%);
          height: 100%;
          transition: width 0.6s ease;
          border-radius: 20px;
        }

        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .add-task-card {
          background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%);
          border: 2px solid #fce7f3;
          border-radius: 14px;
          padding: 1.75rem;
          margin-bottom: 2rem;
        }

        .add-task-card h6 {
          color: #C31162;
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .form-select, .form-control {
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.75rem;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .form-select:focus, .form-control:focus {
          border-color: #C31162;
          box-shadow: 0 0 0 3px rgba(195, 17, 98, 0.1);
          outline: none;
        }

        .btn-add-task {
          background: linear-gradient(135deg, #C31162 0%, #e91e8c 100%);
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          height: 100%;
        }

        .btn-add-task:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(195, 17, 98, 0.4);
          background: linear-gradient(135deg, #a80f51 0%, #d1177a 100%);
        }

        .time-info {
          background: white;
          border: 2px solid #fce7f3;
          border-radius: 10px;
          padding: 1rem;
          margin-top: 1rem;
        }

        .time-info label {
          font-weight: 600;
          color: #C31162;
          display: block;
          margin-bottom: 0.5rem;
        }

        .time-info ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .time-info li {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .checklist-table {
          margin-bottom: 0;
        }

        .checklist-table thead {
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
        }

        .checklist-table thead th {
          color: #C31162;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          padding: 1.25rem 1rem;
          border: none;
        }

        .checklist-table tbody tr {
          transition: all 0.3s ease;
          border-bottom: 1px solid #f3f4f6;
        }

        .checklist-table tbody tr:hover {
          background: #fdf2f8;
          transform: scale(1.01);
        }

        .checklist-table tbody td {
          padding: 1.25rem 1rem;
          vertical-align: middle;
        }

        .status-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 auto;
        }

        .status-icon.completed {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .status-icon.pending {
          background: #f3f4f6;
          color: #9ca3af;
          border: 2px solid #e5e7eb;
        }

        .status-icon:hover {
          transform: scale(1.15);
        }

        .category-link {
          color: #C31162;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .category-link:hover {
          color: #a80f51;
          text-decoration: underline;
        }

        .days-badge {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .action-btn {
          border: 2px solid #e5e7eb;
          background: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          color: #6b7280;
        }

        .action-btn:hover.btn-edit {
          border-color: #C31162;
          background: #C31162;
          color: white;
        }

        .action-btn:hover.btn-delete {
          border-color: #ef4444;
          background: #ef4444;
          color: white;
        }

        .pagination {
          margin-top: 2rem;
        }

        .pagination .page-link {
          border: 2px solid #e5e7eb;
          color: #6b7280;
          border-radius: 8px;
          margin: 0 0.25rem;
          padding: 0.5rem 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .pagination .page-link:hover {
          background: #fdf2f8;
          border-color: #C31162;
          color: #C31162;
        }

        .pagination .page-item.active .page-link {
          background: linear-gradient(135deg, #C31162 0%, #e91e8c 100%);
          border-color: #C31162;
          color: white;
        }

        .alert-custom {
          border-radius: 12px;
          border: none;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }

        .alert-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .alert-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .spinner-custom {
          color: #C31162;
          width: 3rem;
          height: 3rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        .empty-state svg {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .checklist-container {
            padding: 1.5rem 0;
          }

          .stat-card, .main-card {
            border-radius: 12px;
          }

          .main-card-header h5 {
            font-size: 1.25rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .header-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="checklist-container">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-4 mb-4">
              {/* Status Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <FiClock size={20} />
                  <span>Task Status</span>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    Pending Tasks
                  </span>
                  <span className="status-badge badge-pending">
                    {checklists.filter((c) => c.status === "pending").length}
                  </span>
                </div>
                <div className="status-item d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: "600", color: "#374151" }}>
                    Completed Tasks
                  </span>
                  <span className="status-badge badge-completed">
                    {completedCount}
                  </span>
                </div>
              </div>

              {/* Wedding Dates Card */}
              <div className="stat-card">
                <div className="stat-card-header">
                  <FaCalendarAlt size={18} />
                  <span>Wedding Timeline</span>
                </div>
                <div className="date-input-group">
                  <label>
                    <FaCalendarAlt size={14} />
                    Start Date
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={startDate ? dayjs(startDate) : null}
                      onChange={handleStartDateChange}
                      disabled={checklists.length > 0 && !!startDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          placeholder: 'Select start date',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="date-input-group">
                  <label>
                    <FaHeart size={14} />
                    Wedding Date
                  </label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={weddingDate ? dayjs(weddingDate) : null}
                      onChange={handleWeddingDateChange}
                      disabled={checklists.length > 0 && !!weddingDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          placeholder: 'Select wedding date',
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>

                {daysLeft !== null && (
                  <div className="days-countdown">
                    <span className="days-number">{Math.abs(daysLeft)}</span>
                    <span className="days-text">
                      {daysLeft > 0
                        ? "Days Until Wedding"
                        : daysLeft === 0
                          ? "Wedding Day!"
                          : "Days Since Wedding"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-8">
              <div className="main-card">
                <div className="main-card-header d-flex justify-content-between align-items-center flex-wrap">
                  <h5>
                    <FaHeart />
                    Wedding Checklist
                  </h5>
                  <div className="header-actions d-flex gap-2">
                    <button className="btn">
                      <FaDownload className="me-1" /> Download
                    </button>
                    <button className="btn">
                      <FaPrint className="me-1" /> Print
                    </button>
                  </div>
                </div>

                <div className="card-body p-4">
                  {/* Progress Section */}
                  <div className="progress-section">
                    <h6>Overall Progress</h6>
                    <div className="progress-bar-wrapper">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="progress-stats">
                      <span>
                        <strong>{completedCount}</strong> completed
                      </span>
                      <span>
                        <strong>{checklists.length}</strong> total tasks
                      </span>
                      <span>
                        <strong>{Math.round(progressPercentage)}%</strong>{" "}
                        complete
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="alert alert-danger alert-custom alert-dismissible fade show"
                      role="alert"
                    >
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                      />
                    </div>
                  )}

                  {/* Add Task Form */}
                  <div className="add-task-card">
                    <h6>Add New Task</h6>
                    <div className="row align-items-end">
                      <div className="col-md-5 mb-3">
                        <label
                          className="form-label"
                          style={{ fontWeight: "600", color: "#374151" }}
                        >
                          Category
                        </label>
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
                        <label
                          className="form-label"
                          style={{ fontWeight: "600", color: "#374151" }}
                        >
                          Task Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter task description"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                      <div className="col-md-2 mb-3">
                        <button
                          className="btn btn-add-task w-100"
                          onClick={addChecklist}
                        >
                          <FaPlus className="me-1" />
                        </button>
                      </div>
                    </div>
                    {timeOptions.length > 0 && (
                      <div className="time-info">
                        <label>Time Allocation</label>
                        <ul>
                          {timeOptions.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border spinner-custom"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : checklists.length > 0 ? (
                    <>
                      <div className="table-responsive">
                        <table className="table checklist-table">
                          <thead>
                            <tr>
                              <th style={{ width: "80px" }}>Status</th>
                              <th>Task</th>
                              <th>Category</th>
                              <th style={{ width: "140px" }}>Days Assigned</th>
                              <th style={{ width: "120px" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentItems.map((item) => (
                              <tr key={item.id}>
                                <td className="text-center">
                                  <div
                                    className={`status-icon ${item.status === "completed"
                                      ? "completed"
                                      : "pending"
                                      }`}
                                    onClick={() =>
                                      toggleStatus(item.id, item.status)
                                    }
                                  >
                                    {item.status === "completed" ? (
                                      <FaCheck size={16} />
                                    ) : (
                                      <FiCheck size={16} />
                                    )}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    textDecoration:
                                      item.status === "completed"
                                        ? "line-through"
                                        : "none",
                                    color:
                                      item.status === "completed"
                                        ? "#9ca3af"
                                        : "#374151",
                                    fontWeight:
                                      item.status === "completed"
                                        ? "400"
                                        : "600",
                                  }}
                                >
                                  {item.text}
                                </td>
                                <td>
                                  {(() => {
                                    const subcategory = categories.find(
                                      (c) => c.id === item.vendor_subcategory_id
                                    );
                                    return (
                                      <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <Link
                                          to={`/category/${subcategory?.category?.id}`}
                                          className="category-link"
                                        >
                                          {subcategory?.name || "N/A"}
                                          <FiLink size={12} />
                                        </Link>
                                        {subcategory?.required_days && (
                                          <span className="days-badge">
                                            <FiClock size={12} />
                                            {subcategory.required_days}d
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })()}
                                </td>
                                <td>
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {item.days_assigned || "N/A"}{" "}
                                    {item.days_assigned ? "days" : ""}
                                  </span>
                                </td>
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
                                    <button
                                      className="btn p-2 w-25 border rounded-circle"
                                      onClick={() => handleEdit(item.id)}
                                    >
                                      <FiEdit size={15} />
                                    </button>
                                    <button
                                      className="btn p-2 w-25 border rounded-circle"
                                      onClick={() => deleteChecklist(item.id)}
                                    >
                                      <FiTrash size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalPages > 1 && (
                        <nav>
                          <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => (
                              <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? "active" : ""
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
                    </>
                  ) : (
                    <div className="empty-state">
                      <FaHeart
                        style={{
                          fontSize: "4rem",
                          opacity: 0.3,
                          color: "#C31162",
                        }}
                      />
                      <h5 style={{ color: "#6b7280", marginTop: "1rem" }}>
                        No tasks yet
                      </h5>
                      <p style={{ color: "#9ca3af" }}>
                        Start planning your dream wedding by adding your first
                        task!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Check;
