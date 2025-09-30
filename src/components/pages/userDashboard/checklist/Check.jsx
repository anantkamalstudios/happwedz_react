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

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheck, FaPlus, FaDownload, FaPrint } from "react-icons/fa";
import { FiCheck, FiTrash } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE = "https://happywedz.com/api/checklist";

const Check = () => {
  const userId = useSelector((state) => state.auth.user?.id);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);

  // Fetch checklist items for the user
  const fetchTasks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus !== "All")
        params.status = selectedStatus.toLowerCase();
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedPeriod !== "All") params.timePeriod = selectedPeriod;

      const res = await axios.get(`${API_BASE}/${userId}`, { params });
      setTasks(res.data || []);
    } catch (err) {
      setTasks([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId, selectedCategory, selectedPeriod, selectedStatus]);

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

  // Toggle task status
  const toggleTask = async (id, currentStatus) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`, {
        status: currentStatus === "completed" ? "pending" : "completed",
      });
      setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!newTask.trim() || !userId) return;
    const payload = {
      userId,
      text: newTask,
      category: selectedCategory !== "All" ? selectedCategory : "Planning",
      timePeriod: selectedPeriod !== "All" ? selectedPeriod : "10-12 months",
      status: "pending",
    };
    try {
      const res = await axios.post(API_BASE, payload);
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
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
    if (p !== "All") {
      countByPeriod[p] = tasks.filter((t) => t.timePeriod === p).length;
    }
  });

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
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                      selectedStatus === status ? "wc-active" : ""
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
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                      selectedPeriod === period ? "wc-active" : ""
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
            <div className="wc-card-body card-body">
              <ul className="wc-list-group list-group">
                {categories.map((cat) => (
                  <li
                    key={cat}
                    className={`wc-list-item list-group-item d-flex justify-content-between align-items-center ${
                      selectedCategory === cat ? "wc-active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                    {cat !== "All" && (
                      <span className="wc-badge badge rounded-pill">
                        {countByCategory[cat] || 0}
                      </span>
                    )}
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
                  <button className="btn btn-primary" onClick={addTask}>
                    <FaPlus className="me-1" /> Add Task
                  </button>
                </div>
              </div>

              {/* Task list */}
              <div className="wc-task-list">
                {loading ? (
                  <div>Loading tasks...</div>
                ) : tasks.length > 0 ? (
                  <ul className="list-group">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="list-group-item d-flex align-items-center"
                      >
                        <div
                          className={`wc-task-checkbox me-3 ${
                            task.status === "completed" ? "wc-completed" : ""
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
                            {task.text}
                          </div>
                          <div className="text-muted small mt-1">
                            <span className="me-2">{task.category}</span>
                            <span>{task.timePeriod}</span>
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
