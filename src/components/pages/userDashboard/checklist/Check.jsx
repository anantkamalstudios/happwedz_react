// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaCheck, FaPlus, FaDownload, FaPrint, FaTrash } from "react-icons/fa";
// import { FiCheck, FiTrash } from "react-icons/fi";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const API_BASE = "https://happywedz.com/api/checklist";

// const Check = () => {
//   const userId = useSelector((state) => state.auth.user?.id);
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedPeriod, setSelectedPeriod] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [loading, setLoading] = useState(false);

//   // Fetch checklist items for the user
//   useEffect(() => {
//     if (!userId) return;
//     const fetchTasks = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${API_BASE}/${userId}`);
//         setTasks(res.data || []);
//       } catch (err) {
//         setTasks([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTasks();
//   }, [userId]);

//   const categories = [
//     "All",
//     "Essential",
//     "Events",
//     "Catering",
//     "Photography and video",
//     "Planning",
//     "Jewellery",
//     "Transportation",
//     "Wedding cards",
//     "Flowers and Decoration",
//     "Bridal Accessories",
//     "Groom's Accessories",
//     "Health and Beauty",
//     "Entertainment",
//     "Guests",
//     "Honeymoon",
//     "Other",
//   ];
//   const periods = [
//     "All",
//     "10-12 months",
//     "7-9 months",
//     "4-6 months",
//     "2-3 months",
//     "The last month",
//     "2 weeks",
//     "Last week",
//     "After the wedding",
//   ];

//   // Filter tasks based on selected filters
//   const filteredTasks = tasks.filter((task) => {
//     return (
//       (selectedCategory === "All" || task.category === selectedCategory) &&
//       (selectedPeriod === "All" || task.period === selectedPeriod) &&
//       (selectedStatus === "All" ||
//         (selectedStatus === "Pending" && !task.status) ||
//         (selectedStatus === "Completed" && task.status))
//     );
//   });

//   // Toggle task status (PATCH)
//   const toggleTask = async (id) => {
//     const task = tasks.find((t) => t.id === id);
//     if (!task) return;
//     try {
//       await axios.patch(`${API_BASE}/${id}`, { status: !task.status, userId });
//       setTasks(tasks.map((t) => t.id === id ? { ...t, status: !t.status } : t));
//     } catch (err) {
//       // Optionally show error
//     }
//   };

//   // Add new task (POST)
//   const addTask = async () => {
//     if (newTask.trim() === "" || !userId) return;
//     const payload = {
//       userId,
//       text: newTask,
//       category: selectedCategory !== "All" ? selectedCategory : "Planning",
//       startDate: new Date().toISOString().slice(0, 10),
//       dueDate: new Date().toISOString().slice(0, 10),
//       status: false,
//     };
//     try {
//       const res = await axios.post(API_BASE, payload);
//       setTasks([...tasks, res.data]);
//       setNewTask("");
//     } catch (err) {
//       // Optionally show error
//     }
//   };

//   // Delete task (DELETE)
//   const deleteTask = async (id) => {
//     try {
//       await axios.delete(`${API_BASE}/${id}`);
//       setTasks(tasks.filter((task) => task.id !== id));
//     } catch (err) {
//       // Optionally show error
//     }
//   };

//   // Count tasks by status
//   const pendingCount = tasks.filter((task) => !task.status).length;
//   const completedCount = tasks.filter((task) => task.status).length;

//   // Count tasks by category
//   const countByCategory = {};
//   categories.forEach((cat) => {
//     if (cat !== "All") {
//       countByCategory[cat] = tasks.filter(
//         (task) => task.category === cat
//       ).length;
//     }
//   });

//   // Count tasks by period
//   const countByPeriod = {};
//   periods.forEach((period) => {
//     if (period !== "All") {
//       countByPeriod[period] = tasks.filter(
//         (task) => task.period === period
//       ).length;
//     }
//   });

//   return (
//     <div className="wc-container container-fluid py-4">
//       <div className="wc-row row">
//         {/* Left sidebar */}
//         <div className="wc-sidebar col-md-3">
//           <div className="wc-card card mb-4 border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">STATUS</h5>
//             </div>

//             <div className="wc-card-body card-body">
//               <ul className="wc-list-group list-group">
//                 <li
//                   className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedStatus === "All" ? "wc-active" : ""
//                     }`}
//                   onClick={() => setSelectedStatus("All")}
//                 >
//                   All
//                   <span className="wc-badge badge  rounded-pill">
//                     {tasks.length}
//                   </span>
//                 </li>
//                 <li
//                   className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedStatus === "Pending" ? "wc-active" : ""
//                     }`}
//                   onClick={() => setSelectedStatus("Pending")}
//                 >
//                   Pending
//                   <span className="wc-badge badge bg-warning rounded-pill">
//                     {pendingCount}
//                   </span>
//                 </li>
//                 <li
//                   className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedStatus === "Completed" ? "wc-active" : ""
//                     }`}
//                   onClick={() => setSelectedStatus("Completed")}
//                 >
//                   Completed
//                   <span className="wc-badge badge bg-success rounded-pill">
//                     {completedCount}
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           <div className="wc-card card mb-4 border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">DATE</h5>
//             </div>
//             <div className="wc-card-body card-body">
//               <ul className="wc-list-group list-group">
//                 <li
//                   className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedPeriod === "All" ? "wc-active" : ""
//                     }`}
//                   onClick={() => setSelectedPeriod("All")}
//                 >
//                   All
//                 </li>
//                 {periods
//                   .filter(p => p !== "All")
//                   .map(period => (
//                     <li
//                       key={period}
//                       className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedPeriod === period ? "wc-active" : ""
//                         }`}
//                       onClick={() => setSelectedPeriod(period)}
//                     >
//                       {period}
//                       <span className="wc-badge badge rounded-pill">{countByPeriod[period] || 0}</span>
//                     </li>
//                   ))}
//               </ul>
//             </div>
//           </div>

//           <div className="wc-card card border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">CATEGORY</h5>
//             </div>
//             <div className="wc-card-body card-body">
//               <ul className="wc-list-group list-group">
//                 <li
//                   className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedCategory === "All" ? "wc-active" : ""
//                     }`}
//                   onClick={() => setSelectedCategory("All")}
//                 >
//                   All
//                 </li>
//                 {categories
//                   .filter(cat => cat !== "All")
//                   .map(category => (
//                     <li
//                       key={category}
//                       className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${selectedCategory === category ? "wc-active" : ""
//                         }`}
//                       onClick={() => setSelectedCategory(category)}
//                     >
//                       {category}
//                       <span className="wc-badge badge rounded-pill">{countByCategory[category] || 0}</span>
//                     </li>
//                   ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Main content */}
//         <div className="wc-main-content col-md-9">
//           <div className="wc-card card">
//             <div className="wc-card-header card-header bg-white">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">Checklist</h5>
//                 <div className="d-flex">
//                   <button className="wc-btn btn btn-outline-secondary me-2">
//                     <FaDownload className="me-1" /> Download
//                   </button>
//                   <button className="wc-btn btn btn-outline-secondary">
//                     <FaPrint className="me-1" /> Print
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="wc-card-body card-body">
//               <div className="wc-progress mb-4">
//                 <h5>
//                   You have completed{" "}
//                   <span className="wc-completed text-success">
//                     {completedCount}
//                   </span>{" "}
//                   out of{" "}
//                   <span className="wc-total text-primary">{tasks.length}</span>{" "}
//                   tasks
//                 </h5>
//               </div>

//               {/* Add new task */}
//               <div className="wc-add-task card mb-4">
//                 <div className="wc-card-header card-header bg-light text-black">
//                   <h5 className="mb-0">Add a new task</h5>
//                 </div>
//                 <div className="wc-card-body card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="wc-form-label form-label">
//                         Task Description
//                       </label>
//                       <input
//                         type="text"
//                         className="wc-form-control form-control"
//                         value={newTask}
//                         onChange={(e) => setNewTask(e.target.value)}
//                         placeholder="Enter task description"
//                       />
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label className="wc-form-label form-label">
//                         Category
//                       </label>
//                       <select
//                         className="wc-form-select form-select"
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                       >
//                         {categories
//                           .filter((cat) => cat !== "All")
//                           .map((category) => (
//                             <option key={category} value={category}>
//                               {category}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label className="wc-form-label form-label">
//                         Time Period
//                       </label>
//                       <select
//                         className="wc-form-select form-select"
//                         value={selectedPeriod}
//                         onChange={(e) => setSelectedPeriod(e.target.value)}
//                       >
//                         {periods
//                           .filter((p) => p !== "All")
//                           .map((period) => (
//                             <option key={period} value={period}>
//                               {period}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   </div>
//                   <button className="wc-btn btn btn-primary" onClick={addTask}>
//                     <FaPlus className="me-1" /> Add Task
//                   </button>
//                 </div>
//               </div>

//               {/* Task list */}
//               <div className="wc-task-list">
//                 {filteredTasks.length > 0 ? (
//                   <ul className="wc-list-group list-group">
//                     {filteredTasks.map((task) => (
//                       <li
//                         key={task.id}
//                         className="wc-list-item list-group-item"
//                       >
//                         <div className="d-flex align-items-center">
//                           <div
//                             className={`wc-task-checkbox me-3 ${task.status ? "wc-completed" : ""
//                               }`}
//                             onClick={() => toggleTask(task.id)}
//                           >
//                             {task.status && (
//                               <FiCheck className="text-success" />
//                             )}
//                           </div>
//                           <div className="flex-grow-1">
//                             <div
//                               className={`wc-task-text ${task.status
//                                 ? "text-muted text-decoration-line-through"
//                                 : ""
//                                 }`}
//                             >
//                               {task.text}
//                             </div>
//                             <div className="wc-task-meta text-muted small mt-1">
//                               <span className="me-2">{task.category}</span>
//                               <span>{task.period}</span>
//                             </div>
//                           </div>
//                           <button
//                             className="wc-btn btn btn-outline-danger"
//                             onClick={() => deleteTask(task.id)}
//                           >
//                             <FiTrash />
//                           </button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="wc-alert alert alert-info">
//                     No tasks found matching your filters.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Check;

// import { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
// import { FiCheck, FiTrash } from "react-icons/fi";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import CheckList from "./CheckList";

// const API_BASE = "https://happywedz.com/api/checklist_new"; // For tasks
// const CATEGORY_API =
//   "https://happywedz.com/api/vendor-types/with-subcategories/all"; // For categories

// const Check = () => {
//   const user = useSelector((state) => state.auth.user);
//   const userId = useSelector((state) => state.auth.user?.id);
//   const token = useSelector((state) => state.auth.token);
//   const [tasks, setTasks] = useState([]);
//   const [newTask, setNewTask] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedPeriod, setSelectedPeriod] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);
//   const [error, setError] = useState(null);

//   // Debug user object and try different ID fields
//   console.log("Full user object:", user);
//   console.log("User ID (id):", userId);
//   console.log("User ID (user_id):", user?.user_id);
//   console.log("User ID (_id):", user?._id);
//   console.log("Token:", token ? "Present" : "Missing");

//   // Use the first available ID
//   const actualUserId = userId || user?.user_id || user?._id;
//   console.log("Actual User ID used:", actualUserId);

//   // Axios instance with auth header and timeout
//   const axiosInstance = axios.create({
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     timeout: 10000, // 10 seconds timeout
//   });

//   // Fetch checklist items for the user
//   const fetchTasks = async () => {
//     if (!actualUserId || !token) {
//       setError("User not authenticated. Please login again.");
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     // Create a timeout promise
//     const timeoutPromise = new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("Request timeout")), 15000)
//     );

//     try {
//       const params = { user_id: userId };
//       if (selectedStatus !== "All")
//         params.status = selectedStatus.toLowerCase();
//       if (selectedCategory !== "All") params.category = selectedCategory;
//       if (selectedPeriod !== "All") params.period = selectedPeriod;

//       const response = await axiosInstance.get(`${API_BASE}/${userId}`, {
//         params,
//       });
//       // Handle cases where the data is nested under a 'data' property or is a direct array
//       if (response.data && Array.isArray(response.data.data)) {
//         setTasks(response.data.data || []);
//       } else if (Array.isArray(response.data)) {
//         setTasks(response.data || []);
//       } else {
//         setTasks([]);
//       }
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//       if (err.message === "Request timeout") {
//         setError("Request timed out. Please check your internet connection.");
//       } else if (err.code === "ECONNABORTED") {
//         setError("Request was cancelled or timed out.");
//       } else if (err.response?.status === 404) {
//         setError("Checklist API endpoint not found. Please contact support.");
//       } else if (err.response?.status === 401) {
//         setError("Authentication failed. Please login again.");
//       } else {
//         setError(
//           err.response?.data?.message || err.message || "Failed to load tasks"
//         );
//       }
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [actualUserId, selectedCategory, selectedPeriod, selectedStatus, refresh]);

//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axiosInstance.get(CATEGORY_API);
//         const categoryNames = response.data.map((cat) => cat.name);
//         setCategories(["All", ...categoryNames]);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         // Set default categories if API fails
//         setCategories([
//           "All",
//           "Planning",
//           "Venues",
//           "Catering",
//           "Photography",
//           "Music",
//           "Decorations",
//         ]);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const periods = [
//     "All",
//     "10-12 months",
//     "7-9 months",
//     "4-6 months",
//     "2-3 months",
//     "The last month",
//     "2 weeks",
//     "Last week",
//     "After the wedding",
//   ];

//   // Toggle task status
//   const toggleTask = async (id, currentStatus) => {
//     try {
//       const res = await axiosInstance.put(`${API_BASE}/${id}`, {
//         status: currentStatus === "completed" ? "pending" : "completed",
//       });
//       setRefresh((prev) => !prev); // Trigger re-fetch
//     } catch (err) {
//       console.error("Error toggling task:", err);
//       setError(
//         err.response?.data?.message || err.message || "Failed to update task"
//       );
//     }
//   };

//   // Add new task
//   const addTask = async () => {
//     if (!newTask.trim() || !actualUserId || !token) {
//       setError("Please provide task description and ensure you're logged in.");
//       return;
//     }
//     const payload = {
//       user_id: actualUserId,
//       title: newTask,
//       category: selectedCategory !== "All" ? selectedCategory : "Planning",
//       period: selectedPeriod !== "All" ? selectedPeriod : "10-12 months",
//       status: "pending",
//     };

//     // Create a timeout promise
//     const timeoutPromise = new Promise((_, reject) =>
//       setTimeout(() => reject(new Error("Request timeout")), 15000)
//     );

//     try {
//       console.log("Adding task with payload:", payload);
//       const res = await Promise.race([
//         axiosInstance.post(API_BASE, payload),
//         timeoutPromise,
//       ]);
//       console.log("Add task response:", res.data);
//       setNewTask("");
//       setRefresh((prev) => !prev); // Trigger re-fetch
//     } catch (err) {
//       console.error("Error adding task:", err);
//       if (err.message === "Request timeout") {
//         setError("Request timed out. Please try again.");
//       } else if (err.code === "ECONNABORTED") {
//         setError("Request was cancelled or timed out.");
//       } else if (err.response?.status === 404) {
//         setError("Add task API endpoint not found. Please contact support.");
//       } else if (err.response?.status === 401) {
//         setError("Authentication failed. Please login again.");
//       } else {
//         setError(
//           err.response?.data?.message || err.message || "Failed to add task"
//         );
//       }
//     }
//   };

//   // Delete task
//   const deleteTask = async (id) => {
//     try {
//       await axiosInstance.delete(`${API_BASE}/${id}`);
//       setRefresh((prev) => !prev); // Trigger re-fetch
//     } catch (err) {
//       console.error("Error deleting task:", err);
//       setError(
//         err.response?.data?.message || err.message || "Failed to delete task"
//       );
//     }
//   };

//   // Counts
//   const pendingCount = tasks.filter((t) => t.status === "pending").length;
//   const completedCount = tasks.filter((t) => t.status === "completed").length;

//   const countByCategory = {};
//   categories.forEach((cat) => {
//     if (cat !== "All") {
//       countByCategory[cat] = tasks.filter((t) => t.category === cat).length;
//     }
//   });
//   const countByPeriod = {};
//   periods.forEach((p) => {
//     if (p !== "All")
//       countByPeriod[p] = tasks.filter((t) => t.period === p).length;
//   });

//   // Style for scrollable category list
//   const categoryListStyle = { maxHeight: "250px", overflowY: "auto" };
//   return (
//     <div className="wc-container container-fluid py-4">
//       <div className="wc-row row">
//         {/* Sidebar */}
//         <div className="wc-sidebar col-md-4">
//           {/* STATUS */}
//           <div className="wc-card card mb-4 border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">STATUS</h5>
//             </div>
//             <div className="wc-card-body card-body">
//               <ul className="wc-list-group list-group">
//                 {["All", "Pending", "Completed"].map((status) => (
//                   <li
//                     key={status}
//                     className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
//                       selectedStatus === status ? "wc-active" : ""
//                     }`}
//                     onClick={() => setSelectedStatus(status)}
//                   >
//                     {status}
//                     <span className="wc-badge badge rounded-pill">
//                       {status === "All"
//                         ? tasks.length
//                         : status === "Pending"
//                         ? pendingCount
//                         : completedCount}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* PERIOD */}
//           <div className="wc-card card mb-4 border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">DATE</h5>
//             </div>
//             <div className="wc-card-body card-body">
//               <ul className="wc-list-group list-group">
//                 {periods.map((period) => (
//                   <li
//                     key={period}
//                     className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
//                       selectedPeriod === period ? "wc-active" : ""
//                     }`}
//                     onClick={() => setSelectedPeriod(period)}
//                   >
//                     {period}
//                     {period !== "All" && (
//                       <span className="wc-badge badge rounded-pill">
//                         {countByPeriod[period] || 0}
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* CATEGORY */}
//           <div className="wc-card card border-0">
//             <div className="wc-card-header card-header text-white">
//               <h5 className="mb-0">CATEGORY</h5>
//             </div>
//             <div className="wc-card-body card-body p-0">
//               <ul
//                 className="wc-list-group list-group"
//                 style={categoryListStyle}
//               >
//                 {categories.map((cat) => (
//                   <li
//                     key={cat}
//                     className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
//                       selectedCategory === cat ? "wc-active" : ""
//                     }`}
//                     onClick={() => setSelectedCategory(cat)}
//                   >
//                     {cat}
//                     <span className="wc-badge badge rounded-pill">
//                       {cat === "All" ? tasks.length : countByCategory[cat] || 0}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="wc-main-content col-md-8">
//           {/* <div>
//             <CheckList />
//           </div> */}
//           <div className="wc-card card">
//             <div className="wc-card-header card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Checklist</h5>
//               {/* print and download button */}
//               <div className="d-flex">
//                 <button className="wc-btn btn btn-outline-secondary me-2">
//                   <FaDownload className="me-1" /> Download
//                 </button>
//                 <button className="wc-btn btn btn-outline-secondary">
//                   <FaPrint className="me-1" /> Print
//                 </button>
//               </div>
//             </div>

//             <div className="wc-card-body card-body">
//               <div className="wc-progress mb-4">
//                 <h5>
//                   Completed{" "}
//                   <span className="wc-completed text-success">
//                     {completedCount}
//                   </span>{" "}
//                   out of{" "}
//                   <span className="wc-total text-primary">{tasks.length}</span>{" "}
//                   tasks
//                 </h5>
//               </div>

//               {/* Test API Connection Button */}
//               <div className="mb-3">
//                 <button
//                   className="btn btn-outline-info btn-sm me-2"
//                   onClick={async () => {
//                     try {
//                       console.log("Testing API connection...");
//                       const response = await fetch(
//                         `${API_BASE}/${actualUserId}`,
//                         {
//                           method: "GET",
//                           headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json",
//                           },
//                         }
//                       );
//                       console.log("Test API Response Status:", response.status);
//                       console.log("Test API Response:", await response.text());
//                     } catch (err) {
//                       console.error("Test API Error:", err);
//                     }
//                   }}
//                 >
//                   Test API Connection
//                 </button>
//               </div>

//               {/* Add new task */}
//               <div className="wc-add-task card mb-4">
//                 <div className="wc-card-header card-header bg-light text-black">
//                   <h5 className="mb-0">Add a new task</h5>
//                 </div>
//                 <div className="wc-card-body card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Task Description</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={newTask}
//                         onChange={(e) => setNewTask(e.target.value)}
//                         placeholder="Enter task description"
//                       />
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label className="form-label">Category</label>
//                       <select
//                         className="form-select"
//                         value={selectedCategory}
//                         onChange={(e) => setSelectedCategory(e.target.value)}
//                       >
//                         {categories
//                           .filter((c) => c !== "All")
//                           .map((cat) => (
//                             <option key={cat} value={cat}>
//                               {cat}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                     <div className="col-md-3 mb-3">
//                       <label className="form-label">Time Period</label>
//                       <select
//                         className="form-select"
//                         value={selectedPeriod}
//                         onChange={(e) => setSelectedPeriod(e.target.value)}
//                       >
//                         {periods
//                           .filter((p) => p !== "All")
//                           .map((p) => (
//                             <option key={p} value={p}>
//                               {p}
//                             </option>
//                           ))}
//                       </select>
//                     </div>
//                   </div>
//                   <button
//                     className="btn btn-primary"
//                     onClick={addTask}
//                     disabled={!newTask.trim() || !actualUserId || !token}
//                   >
//                     <FaPlus className="me-1" /> Add Task
//                   </button>
//                 </div>
//               </div>

//               {/* Error display */}
//               {error && <div className="alert alert-danger mb-3">{error}</div>}

//               {/* Authentication check */}
//               {!actualUserId || !token ? (
//                 <div className="alert alert-warning mb-3">
//                   Please login to access your checklist.
//                 </div>
//               ) : null}

//               {/* Task list */}
//               <div className="wc-task-list">
//                 {loading ? (
//                   <div className="text-center py-4">
//                     <div className="spinner-border text-primary" role="status">
//                       <span className="visually-hidden">Loading tasks...</span>
//                     </div>
//                     <div className="mt-2">Loading tasks...</div>
//                   </div>
//                 ) : tasks.length > 0 ? (
//                   <ul className="list-group">
//                     {tasks.map((task) => (
//                       <li
//                         key={task.id}
//                         className="list-group-item d-flex align-items-center"
//                       >
//                         <div
//                           className={`wc-task-checkbox me-3 ${
//                             task.status === "completed" ? "wc-completed" : ""
//                           }`}
//                           onClick={() => toggleTask(task.id, task.status)}
//                         >
//                           {task.status === "completed" && <FiCheck />}
//                         </div>
//                         <div className="flex-grow-1">
//                           <div
//                             className={
//                               task.status === "completed"
//                                 ? "text-muted text-decoration-line-through"
//                                 : ""
//                             }
//                           >
//                             {task.title}
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <span className="me-2">{task.category}</span>
//                             <span>{task.period}</span>
//                           </div>
//                         </div>
//                         <button
//                           className="btn btn-outline-danger"
//                           onClick={() => deleteTask(task.id)}
//                         >
//                           <FiTrash />
//                         </button>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div className="alert alert-info">No tasks found.</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Check;
// import { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
// import { FiCheck, FiTrash } from "react-icons/fi";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const BASE_URL = "https://happywedz.com/api/new-checklist";

// const Check = () => {
//   const user = useSelector((state) => state.auth.user);
//   const token = useSelector((state) => state.auth.token);
//   const userId = user?.id || user?.user_id || user?._id;

//   const [checklists, setChecklists] = useState([]);
//   const [text, setText] = useState("");
//   const [vendorSubId, setVendorSubId] = useState(1);
//   const [startDate, setStartDate] = useState("");
//   const [weddingDate, setWeddingDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [refresh, setRefresh] = useState(false);
//   const [error, setError] = useState(null);

//   // Axios instance
//   const axiosInstance = axios.create({
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   // Fetch checklist data
//   const fetchChecklists = async () => {
//     if (!userId || !token) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axiosInstance.get(
//         `${BASE_URL}/newChecklist/user/${userId}`
//       );
//       setChecklists(res.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching checklists:", err);
//       setError("Failed to load checklist data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchChecklists();
//   }, [userId, refresh]);

//   // Add new checklist
//   const addChecklist = async () => {
//     if (!text || !startDate || !weddingDate) {
//       setError("Please fill all fields");
//       return;
//     }

//     const payload = {
//       userId,
//       vendor_subcategory_id: vendorSubId,
//       text,
//       start_date: startDate,
//       wedding_date: weddingDate,
//       status: "pending",
//     };

//     try {
//       const res = await axiosInstance.post(`${BASE_URL}/create`, payload);
//       console.log("Checklist created:", res.data);
//       setText("");
//       setStartDate("");
//       setWeddingDate("");
//       setRefresh((prev) => !prev);
//     } catch (err) {
//       console.error("Error adding checklist:", err);
//       setError("Failed to create checklist");
//     }
//   };

//   // Toggle checklist status
//   const toggleStatus = async (id, currentStatus) => {
//     try {
//       const newStatus = currentStatus === "completed" ? "pending" : "completed";
//       await axiosInstance.put(`${BASE_URL}/update/${id}`, { status: newStatus });
//       setRefresh((prev) => !prev);
//     } catch (err) {
//       console.error("Error updating checklist:", err);
//       setError("Failed to update checklist");
//     }
//   };

//   // Delete checklist
//   const deleteChecklist = async (id) => {
//     try {
//       await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
//       setRefresh((prev) => !prev);
//     } catch (err) {
//       console.error("Error deleting checklist:", err);
//       setError("Failed to delete checklist");
//     }
//   };

//   const completedCount = checklists.filter(
//     (c) => c.status === "completed"
//   ).length;

//   return (
//     <div className="container-fluid py-4">
//       <div className="row">
//         {/* Sidebar */}
//         <div className="col-md-4">
//           <div className="card mb-4 border-0">
//             <div className="card-header bg-dark text-white">
//               <h5 className="mb-0">STATUS</h5>
//             </div>
//             <div className="card-body">
//               <ul className="list-group">
//                 <li className="list-group-item d-flex justify-content-between">
//                   Pending
//                   <span className="badge bg-warning">
//                     {checklists.filter((c) => c.status === "pending").length}
//                   </span>
//                 </li>
//                 <li className="list-group-item d-flex justify-content-between">
//                   Completed
//                   <span className="badge bg-success">{completedCount}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Calendar Section */}
//           <div className="card border-0">
//             <div className="card-header bg-dark text-white">
//               <h5 className="mb-0">WEDDING DATES</h5>
//             </div>
//             <div className="card-body">
//               <div className="mb-3">
//                 <label className="form-label">Start Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Wedding Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={weddingDate}
//                   onChange={(e) => setWeddingDate(e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="col-md-8">
//           <div className="card">
//             <div className="card-header bg-white d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Wedding Checklist</h5>
//               <div>
//                 <button className="btn btn-outline-secondary me-2">
//                   <FaDownload className="me-1" /> Download
//                 </button>
//                 <button className="btn btn-outline-secondary">
//                   <FaPrint className="me-1" /> Print
//                 </button>
//               </div>
//             </div>

//             <div className="card-body">
//               <h6 className="mb-3">
//                 Completed{" "}
//                 <span className="text-success">{completedCount}</span> /{" "}
//                 <span className="text-primary">{checklists.length}</span>
//               </h6>

//               {error && <div className="alert alert-danger">{error}</div>}

//               {/* Add checklist form */}
//               <div className="card mb-4 border">
//                 <div className="card-header bg-light text-black">
//                   <h6 className="mb-0">Add New Checklist</h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-md-8 mb-3">
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter checklist task"
//                         value={text}
//                         onChange={(e) => setText(e.target.value)}
//                       />
//                     </div>
//                     <div className="col-md-4 mb-3">
//                       <button
//                         className="btn btn-primary w-100"
//                         onClick={addChecklist}
//                       >
//                         <FaPlus className="me-1" /> Add Task
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Checklist list */}
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" role="status" />
//                 </div>
//               ) : checklists.length > 0 ? (
//                 <ul className="list-group">
//                   {checklists.map((item) => (
//                     <li
//                       key={item.id}
//                       className="list-group-item d-flex align-items-center"
//                     >
//                       <div
//                         className={`me-3 ${
//                           item.status === "completed"
//                             ? "text-success"
//                             : "text-secondary"
//                         }`}
//                         style={{
//                           cursor: "pointer",
//                           fontSize: "1.3rem",
//                         }}
//                         onClick={() => toggleStatus(item.id, item.status)}
//                       >
//                         {item.status === "completed" ? <FaCheck /> : <FiCheck />}
//                       </div>
//                       <div className="flex-grow-1">
//                         <div
//                           className={
//                             item.status === "completed"
//                               ? "text-muted text-decoration-line-through"
//                               : ""
//                           }
//                         >
//                           {item.text}
//                         </div>
//                         <div className="text-muted small mt-1">
//                           Start:{" "}
//                           {new Date(item.start_date).toLocaleDateString()} | Wedding:{" "}
//                           {new Date(item.wedding_date).toLocaleDateString()}
//                         </div>
//                       </div>
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => deleteChecklist(item.id)}
//                       >
//                         <FiTrash />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <div className="alert alert-info">No checklist tasks found.</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Check;


import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
import { FiCheck, FiTrash, FiLink, FiEdit } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BASE_URL = "https://happywedz.com/api/new-checklist";
const CATEGORY_API = "https://happywedz.com/api/vendor-types/with-subcategories/all";
const Check = () => {
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
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

  // Fetch checklist data
  const fetchChecklists = async () => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`${BASE_URL}/newChecklist/user/${userId}`);
      const fetchedChecklists = res.data?.data || [];
      setChecklists(fetchedChecklists);
      if (res.data?.data?.length > 0) {
        // Reuse previously set wedding date
        const firstTask = res.data.data[0];
        if (firstTask.start_date) setStartDate(firstTask.start_date.split("T")[0]);
        if (firstTask.wedding_date) setWeddingDate(firstTask.wedding_date.split("T")[0]);
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
      const allSubs = res.data.flatMap((cat) => cat.subcategories.map((sub) => ({
        id: sub.id,
        name: sub.name,
        required_days: sub.required_days || 2, // default if missing
        category: {
          id: cat.id,
          name: cat.name,
        },
      })));
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
    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const perTaskDays = Math.max(1, Math.floor(totalDays / checklists.length));

    const temp = [];
    let current = new Date(start);

    for (let i = 0; i < checklists.length; i++) {
      const taskStart = new Date(current);
      const taskEnd = new Date(current);
      taskEnd.setDate(taskEnd.getDate() + perTaskDays - 1);
      temp.push({ ...checklists[i], days_assigned: perTaskDays, distributed_start_date: taskStart.toLocaleDateString(), distributed_end_date: taskEnd.toLocaleDateString() });
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
      setError("Your wedding is near! Checklist cannot be created (less than 8 days left).");
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
    alert(`Edit functionality for task ID: ${id} is not yet implemented.`);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      await axiosInstance.put(`${BASE_URL}/update/${id}`, { status: newStatus });
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

  const completedCount = checklists.filter((c) => c.status === "completed").length;

  // Pagination logic
  const currentTasks = distributedTasks.length > 0 ? distributedTasks : checklists;
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
                Completed <span className="text-success">{completedCount}</span> /{" "}
                <span className="text-primary">{checklists.length}</span>
              </h6>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
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
                        <th style={{ width: '5%' }}>Status</th>
                        <th>Task</th>
                        <th>Category</th>
                        <th>Days Assigned</th>
                        <th style={{ width: '10%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.id} className={item.status === "completed" ? "table-success-light" : ""}>
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
                          <td className={item.status === "completed" ? "text-muted text-decoration-line-through" : ""}>
                            {item.text}
                          </td>
                          <td>
                            {(() => {
                              const subcategory = categories.find(c => c.id === item.vendor_subcategory_id);
                              return (
                                <>
                                  <Link to={`/category/${subcategory?.category?.id}`} className="text-decoration-none">
                                    {subcategory?.name || 'N/A'}
                                    <FiLink size={12} className="ms-1" />
                                  </Link>
                                  {subcategory?.required_days && (
                                    <span className="badge bg-info-light text-dark ms-2">{subcategory.required_days} days</span>
                                  )}
                                </>
                              );
                            })()}
                          </td>
                          <td>{item.days_assigned || 'N/A'}</td>
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
                <div className="alert alert-info">No checklist tasks found.</div>
              )}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                        <button onClick={() => paginate(i + 1)} className="page-link">
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
