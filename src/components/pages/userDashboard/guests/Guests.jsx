import React, { useState } from "react";
import {
  FaSearch,
  FaDownload,
  FaPrint,
  FaEnvelope,
  FaUserPlus,
  FaUsers,
  FaChevronDown,
} from "react-icons/fa";

const Guests = () => {
  // Sample guest data
  const initialGuests = [
    {
      id: 1,
      name: "roshan hari bachhav",
      group: "Couple",
      status: "Attending",
      type: "Adults",
      menu: "Regular",
    },
    {
      id: 2,
      name: "Partner's name",
      group: "Couple",
      status: "Pending",
      type: "Adults",
      menu: "Vegetarian",
    },
  ];

  const [guests, setGuests] = useState(initialGuests);
  const [newGuest, setNewGuest] = useState("");
  const [newGroup, setNewGroup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddGuestForm, setShowAddGuestForm] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    return (
      (selectedGroup === "All" || guest.group === selectedGroup) &&
      (selectedStatus === "All" || guest.status === selectedStatus) &&
      guest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Add new guest
  const addGuest = () => {
    if (newGuest.trim() === "") return;

    const newGuestObj = {
      id: guests.length + 1,
      name: newGuest,
      group: selectedGroup !== "All" ? selectedGroup : "Other",
      status: "Pending",
      type: "Adults",
      menu: "Regular",
    };

    setGuests([...guests, newGuestObj]);
    setNewGuest("");
    setShowAddGuestForm(false);
  };

  // Add new group
  const addGroup = () => {
    if (newGroup.trim() === "") return;

    // In a real app, you would add the group to your groups state
    alert(`Group "${newGroup}" created successfully!`);
    setNewGroup("");
    setShowAddGroupForm(false);
  };

  // Update guest status
  const updateGuestStatus = (id, status) => {
    setGuests(
      guests.map((guest) => (guest.id === id ? { ...guest, status } : guest))
    );
  };

  // Count guests
  const attendingCount = guests.filter((g) => g.status === "Attending").length;
  const pendingCount = guests.filter((g) => g.status === "Pending").length;
  const declinedCount = guests.filter((g) => g.status === "Declined").length;
  const adultsCount = guests.filter((g) => g.type === "Adults").length;
  const childrenCount = guests.filter((g) => g.type === "Children").length;

  // Send message
  const sendMessage = (type) => {
    alert(`Sending ${type} message to selected guests`);
    setShowMessageOptions(false);
  };

  return (
    <div className="wgl-container">
      <div className="wgl-header">
        <h1 className="wgl-title">Guest List</h1>

        <div className="wgl-stats-container">
          <div className="wgl-stat-card">
            <h2 className="wgl-stat-number">{guests.length}</h2>
            <p className="wgl-stat-label">Guests</p>
          </div>

          <div className="wgl-stat-card">
            <h2 className="wgl-stat-number">{adultsCount}</h2>
            <p className="wgl-stat-label">Adults</p>
            <p className="wgl-stat-sublabel">Children: {childrenCount}</p>
          </div>

          <div className="wgl-stat-card">
            <h2 className="wgl-stat-number">{attendingCount}</h2>
            <p className="wgl-stat-label">Attending</p>
            <div className="wgl-status-sublabels">
              <span className="wgl-status-sublabel">
                Pending: {pendingCount}
              </span>
              <span className="wgl-status-sublabel">
                Declined: {declinedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="wgl-controls">
        <div className="wgl-search-container">
          <FaSearch className="wgl-search-icon" />
          <input
            type="text"
            className="wgl-search-input"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="wgl-button-group">
          <button
            className="wgl-button wgl-button-primary"
            onClick={() => {
              setShowAddGuestForm(!showAddGuestForm);
              setShowAddGroupForm(false);
              setShowMessageOptions(false);
            }}
          >
            <FaUserPlus className="wgl-button-icon" /> Add Guest
          </button>

          <button
            className="wgl-button wgl-button-secondary"
            onClick={() => {
              setShowAddGroupForm(!showAddGroupForm);
              setShowAddGuestForm(false);
              setShowMessageOptions(false);
            }}
          >
            <FaUsers className="wgl-button-icon" /> Create Group
          </button>

          <div className="wgl-message-dropdown">
            <button
              className="wgl-button wgl-button-secondary"
              onClick={() => {
                setShowMessageOptions(!showMessageOptions);
                setShowAddGuestForm(false);
                setShowAddGroupForm(false);
              }}
            >
              <FaEnvelope className="wgl-button-icon" /> Send Message
              <FaChevronDown className="wgl-dropdown-icon" />
            </button>
            {showMessageOptions && (
              <div className="wgl-dropdown-menu">
                <button onClick={() => sendMessage("email")}>Email</button>
                <button onClick={() => sendMessage("SMS")}>SMS</button>
                <button onClick={() => sendMessage("WhatsApp")}>
                  WhatsApp
                </button>
              </div>
            )}
          </div>

          <button className="wgl-button wgl-button-secondary">
            <FaDownload className="wgl-button-icon" /> Download
          </button>

          <button className="wgl-button wgl-button-secondary">
            <FaPrint className="wgl-button-icon" /> Print
          </button>
        </div>
      </div>

      {showAddGuestForm && (
        <div className="wgl-add-form">
          <h3 className="wgl-form-title">Add New Guest</h3>
          <input
            type="text"
            className="wgl-form-input"
            placeholder="Guest name"
            value={newGuest}
            onChange={(e) => setNewGuest(e.target.value)}
          />
          <div className="wgl-form-actions">
            <button
              className="wgl-button wgl-button-cancel"
              onClick={() => setShowAddGuestForm(false)}
            >
              Cancel
            </button>
            <button className="wgl-button wgl-button-save" onClick={addGuest}>
              Save Guest
            </button>
          </div>
        </div>
      )}

      {showAddGroupForm && (
        <div className="wgl-add-form">
          <h3 className="wgl-form-title">Create New Group</h3>
          <input
            type="text"
            className="wgl-form-input"
            placeholder="Group name"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
          />
          <div className="wgl-form-actions">
            <button
              className="wgl-button wgl-button-cancel"
              onClick={() => setShowAddGroupForm(false)}
            >
              Cancel
            </button>
            <button className="wgl-button wgl-button-save" onClick={addGroup}>
              Create Group
            </button>
          </div>
        </div>
      )}

      <div className="wgl-filter-container">
        <div className="wgl-filter-group">
          <label className="wgl-filter-label">Group:</label>
          <select
            className="wgl-filter-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="All">All Groups</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Coworkers">Coworkers</option>
          </select>
        </div>

        <div className="wgl-filter-group">
          <label className="wgl-filter-label">Status:</label>
          <select
            className="wgl-filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Attending">Attending</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="wgl-guest-list">
        {filteredGuests.length > 0 ? (
          <table className="wgl-guest-table">
            <thead>
              <tr>
                <th className="wgl-table-header">Guest</th>
                <th className="wgl-table-header">Group</th>
                <th className="wgl-table-header">Status</th>
                <th className="wgl-table-header">Type</th>
                <th className="wgl-table-header">Menu</th>
                <th className="wgl-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="wgl-guest-row">
                  <td className="wgl-guest-name">{guest.name}</td>
                  <td className="wgl-guest-group">{guest.group}</td>
                  <td className="wgl-guest-status">
                    <select
                      className={`wgl-status-select wgl-status-${guest.status.toLowerCase()}`}
                      value={guest.status}
                      onChange={(e) =>
                        updateGuestStatus(guest.id, e.target.value)
                      }
                    >
                      <option value="Attending">Attending</option>
                      <option value="Pending">Pending</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                  <td className="wgl-guest-type">{guest.type}</td>
                  <td className="wgl-guest-menu">{guest.menu}</td>
                  <td className="wgl-guest-actions">
                    <button
                      className="wgl-action-button wgl-action-delete"
                      onClick={() => deleteGuest(guest.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="wgl-empty-state">
            <p>No guests found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FaSearch,
//   FaDownload,
//   FaPrint,
//   FaEnvelope,
//   FaUserPlus,
//   FaUsers,
//   FaChevronDown,
// } from "react-icons/fa";

// const API_BASE = "https://happywedz.com/api/guest-list";

// const Guests = () => {
//   const [guests, setGuests] = useState([]);
//   const [summary, setSummary] = useState({});
//   const [newGuest, setNewGuest] = useState("");
//   const [newGroup, setNewGroup] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGroup, setSelectedGroup] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [showAddGuestForm, setShowAddGuestForm] = useState(false);
//   const [showAddGroupForm, setShowAddGroupForm] = useState(false);
//   const [showMessageOptions, setShowMessageOptions] = useState(false);

//   // ✅ Fetch guests + summary
//   const fetchGuests = async () => {
//     try {
//       const res = await axios.get(API_BASE);
//       setGuests(res.data || []);
//     } catch (err) {
//       console.error("Error fetching guests:", err);
//     }
//   };

//   const fetchSummary = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/summary`);
//       setSummary(res.data || {});
//     } catch (err) {
//       console.error("Error fetching summary:", err);
//     }
//   };

//   useEffect(() => {
//     fetchGuests();
//     fetchSummary();
//   }, []);

//   // ✅ Add new guest
//   const addGuest = async () => {
//     if (newGuest.trim() === "") return;

//     try {
//       await axios.post(API_BASE, {
//         name: newGuest,
//         group: selectedGroup !== "All" ? selectedGroup : "Other",
//         status: "Pending",
//         type: "Adults",
//         menu: "Regular",
//       });
//       setNewGuest("");
//       setShowAddGuestForm(false);
//       fetchGuests();
//       fetchSummary();
//     } catch (err) {
//       console.error("Error adding guest:", err);
//     }
//   };

//   // ✅ Delete guest
//   const deleteGuest = async (id) => {
//     try {
//       await axios.delete(`${API_BASE}/${id}`);
//       fetchGuests();
//       fetchSummary();
//     } catch (err) {
//       console.error("Error deleting guest:", err);
//     }
//   };

//   // ✅ Update guest status
//   const updateGuestStatus = async (id, status) => {
//     try {
//       await axios.put(`${API_BASE}/${id}`, { status });
//       fetchGuests();
//       fetchSummary();
//     } catch (err) {
//       console.error("Error updating guest status:", err);
//     }
//   };

//   // ✅ Export data (excel / csv / pdf)
//   const exportData = async (type) => {
//     try {
//       const res = await axios.get(`${API_BASE}/export/${type}`, {
//         responseType: "blob",
//       });

//       // download file
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `guest-list.${type}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("Error exporting data:", err);
//     }
//   };

//   // ✅ Filter guests (UI level)
//   const filteredGuests = guests.filter((guest) => {
//     return (
//       (selectedGroup === "All" || guest.group === selectedGroup) &&
//       (selectedStatus === "All" || guest.status === selectedStatus) &&
//       guest.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   });

//   return (
//     <div className="wgl-container">
//       <div className="wgl-header">
//         <h1 className="wgl-title">Guest List</h1>

//         <div className="wgl-stats-container">
//           <div className="wgl-stat-card">
//             <h2 className="wgl-stat-number">{summary.total || 0}</h2>
//             <p className="wgl-stat-label">Guests</p>
//           </div>

//           <div className="wgl-stat-card">
//             <h2 className="wgl-stat-number">{summary.adults || 0}</h2>
//             <p className="wgl-stat-label">Adults</p>
//             <p className="wgl-stat-sublabel">
//               Children: {summary.children || 0}
//             </p>
//           </div>

//           <div className="wgl-stat-card">
//             <h2 className="wgl-stat-number">{summary.attending || 0}</h2>
//             <p className="wgl-stat-label">Attending</p>
//             <div className="wgl-status-sublabels">
//               <span className="wgl-status-sublabel">
//                 Pending: {summary.pending || 0}
//               </span>
//               <span className="wgl-status-sublabel">
//                 Declined: {summary.declined || 0}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 🔍 Search + Actions */}
//       <div className="wgl-controls">
//         <div className="wgl-search-container">
//           <FaSearch className="wgl-search-icon" />
//           <input
//             type="text"
//             className="wgl-search-input"
//             placeholder="Search guests..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="wgl-button-group">
//           <button
//             className="wgl-button wgl-button-primary"
//             onClick={() => {
//               setShowAddGuestForm(!showAddGuestForm);
//               setShowAddGroupForm(false);
//               setShowMessageOptions(false);
//             }}
//           >
//             <FaUserPlus className="wgl-button-icon" /> Add Guest
//           </button>

//           <button
//             className="wgl-button wgl-button-secondary"
//             onClick={() => {
//               setShowAddGroupForm(!showAddGroupForm);
//               setShowAddGuestForm(false);
//               setShowMessageOptions(false);
//             }}
//           >
//             <FaUsers className="wgl-button-icon" /> Create Group
//           </button>

//           <div className="wgl-message-dropdown">
//             <button
//               className="wgl-button wgl-button-secondary"
//               onClick={() => {
//                 setShowMessageOptions(!showMessageOptions);
//                 setShowAddGuestForm(false);
//                 setShowAddGroupForm(false);
//               }}
//             >
//               <FaEnvelope className="wgl-button-icon" /> Send Message
//               <FaChevronDown className="wgl-dropdown-icon" />
//             </button>
//             {showMessageOptions && (
//               <div className="wgl-dropdown-menu">
//                 <button onClick={() => alert("Send Email API here")}>
//                   Email
//                 </button>
//                 <button onClick={() => alert("Send SMS API here")}>SMS</button>
//                 <button onClick={() => alert("Send WhatsApp API here")}>
//                   WhatsApp
//                 </button>
//               </div>
//             )}
//           </div>

//           <button
//             className="wgl-button wgl-button-secondary"
//             onClick={() => exportData("excel")}
//           >
//             <FaDownload className="wgl-button-icon" /> Download
//           </button>

//           <button
//             className="wgl-button wgl-button-secondary"
//             onClick={() => window.print()}
//           >
//             <FaPrint className="wgl-button-icon" /> Print
//           </button>
//         </div>
//       </div>

//       {/* Add Guest Form */}
//       {showAddGuestForm && (
//         <div className="wgl-add-form">
//           <h3 className="wgl-form-title">Add New Guest</h3>
//           <input
//             type="text"
//             className="wgl-form-input"
//             placeholder="Guest name"
//             value={newGuest}
//             onChange={(e) => setNewGuest(e.target.value)}
//           />
//           <div className="wgl-form-actions">
//             <button
//               className="wgl-button wgl-button-cancel"
//               onClick={() => setShowAddGuestForm(false)}
//             >
//               Cancel
//             </button>
//             <button className="wgl-button wgl-button-save" onClick={addGuest}>
//               Save Guest
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Group Form */}
//       {showAddGroupForm && (
//         <div className="wgl-add-form">
//           <h3 className="wgl-form-title">Create New Group</h3>
//           <input
//             type="text"
//             className="wgl-form-input"
//             placeholder="Group name"
//             value={newGroup}
//             onChange={(e) => setNewGroup(e.target.value)}
//           />
//           <div className="wgl-form-actions">
//             <button
//               className="wgl-button wgl-button-cancel"
//               onClick={() => setShowAddGroupForm(false)}
//             >
//               Cancel
//             </button>
//             <button
//               className="wgl-button wgl-button-save"
//               onClick={() => {
//                 alert(`Group "${newGroup}" created (API needed)`);
//                 setNewGroup("");
//                 setShowAddGroupForm(false);
//               }}
//             >
//               Create Group
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="wgl-filter-container">
//         <div className="wgl-filter-group">
//           <label className="wgl-filter-label">Group:</label>
//           <select
//             className="wgl-filter-select"
//             value={selectedGroup}
//             onChange={(e) => setSelectedGroup(e.target.value)}
//           >
//             <option value="All">All Groups</option>
//             <option value="Couple">Couple</option>
//             <option value="Family">Family</option>
//             <option value="Friends">Friends</option>
//             <option value="Coworkers">Coworkers</option>
//           </select>
//         </div>

//         <div className="wgl-filter-group">
//           <label className="wgl-filter-label">Status:</label>
//           <select
//             className="wgl-filter-select"
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//           >
//             <option value="All">All Statuses</option>
//             <option value="Attending">Attending</option>
//             <option value="Pending">Pending</option>
//             <option value="Declined">Declined</option>
//           </select>
//         </div>
//       </div>

//       {/* Guest Table */}
//       <div className="wgl-guest-list">
//         {filteredGuests.length > 0 ? (
//           <table className="wgl-guest-table">
//             <thead>
//               <tr>
//                 <th className="wgl-table-header">Guest</th>
//                 <th className="wgl-table-header">Group</th>
//                 <th className="wgl-table-header">Status</th>
//                 <th className="wgl-table-header">Type</th>
//                 <th className="wgl-table-header">Menu</th>
//                 <th className="wgl-table-header">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredGuests.map((guest) => (
//                 <tr key={guest.id} className="wgl-guest-row">
//                   <td className="wgl-guest-name">{guest.name}</td>
//                   <td className="wgl-guest-group">{guest.group}</td>
//                   <td className="wgl-guest-status">
//                     <select
//                       className={`wgl-status-select wgl-status-${guest.status?.toLowerCase()}`}
//                       value={guest.status}
//                       onChange={(e) =>
//                         updateGuestStatus(guest.id, e.target.value)
//                       }
//                     >
//                       <option value="Attending">Attending</option>
//                       <option value="Pending">Pending</option>
//                       <option value="Declined">Declined</option>
//                     </select>
//                   </td>
//                   <td className="wgl-guest-type">{guest.type}</td>
//                   <td className="wgl-guest-menu">{guest.menu}</td>
//                   <td className="wgl-guest-actions">
//                     <button
//                       className="wgl-action-button wgl-action-delete"
//                       onClick={() => deleteGuest(guest.id)}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div className="wgl-empty-state">
//             <p>No guests found matching your criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Guests;
