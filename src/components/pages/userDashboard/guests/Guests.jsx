
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
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
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newGroup, setNewGroup] = useState("Other");
  const [newType, setNewType] = useState("Adult");
  const [newCompanions, setNewCompanions] = useState(0);
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [newMenu, setNewMenu] = useState("Veg");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddGuestForm, setShowAddGuestForm] = useState(false);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 5; // change per page
  const [formError, setFormError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const statusOptions = ["Attending", "Not Attending", "Pending"];
  const typeOptions = ["Adult", "Child"];
  const menuOptions = ["Veg", "Non-Veg", "All"];

  // Fetch guests
  const fetchGuests = async () => {
    if (!token || !userId) return;
    try {
      const res = await axios.get(`https://happywedz.com/api/guestlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetch Guests Response:", res);
      // The API returns an array of guests under the `data` property.
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setGuests(res.data.data);
      } else if (res.data && res.data.success && res.data.guest) {
        // Handle single guest response by wrapping it in an array
        setGuests([res.data.guest]);
      } else {
        setGuests([]);
      }
    } catch (err) {
      console.error("Fetch Guests Error:", err);
      setGuests([]);
    }
  };

  console.log(guests)

  useEffect(() => {
    fetchGuests();
  }, [refresh, token, userId]);

  const filteredGuests = guests.filter(
    (g) =>
      g && // Add a check to ensure the guest object exists
      (selectedGroup === "All" || g.group === selectedGroup) &&
      (selectedStatus === "All" || g.status === selectedStatus) &&
      g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstGuest, indexOfLastGuest);
  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addGuestAPI = async () => {
    setFormError("");
    if (!newGuest.trim()) {
      setFormError("Guest name is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail && !emailRegex.test(newEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(
        "https://happywedz.com/api/guestlist",
        {
          user_id: userId,
          name: newGuest,
          email: newEmail,
          group: newGroup,
          status: "Pending",
          type: newType,
          companions: parseInt(newCompanions, 10) || 0,
          seat_number: newSeatNumber,
          menu: newMenu,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewGuest("");
      setNewEmail("");
      setNewGroup("Other");
      setNewType("Adult");
      setNewCompanions(0);
      setNewSeatNumber("");
      setNewMenu("Veg");
      setRefresh(prev => !prev); // Trigger re-fetch
      setShowAddGuestForm(false);
    } catch (err) {
      console.error("Add Guest Error:", err);
    }
  };

  const updateGuestField = async (id, field, value) => {
    try {
      const res = await axios.put(
        `https://happywedz.com/api/guestlist/${id}`,
        { [field]: value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh(prev => !prev); // Trigger re-fetch
    } catch (err) {
      console.error("Update Guest Error:", err);
    }
  };

  const deleteGuestAPI = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://happywedz.com/api/guestlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh(prev => !prev); // Trigger re-fetch
    } catch (err) {
      console.error("Delete Guest Error:", err);
    }
  };

  const attendingCount = guests.filter((g) => g && g.status === "Attending").length;
  const pendingCount = guests.filter((g) => g && g.status === "Pending").length;
  const declinedCount = guests.filter((g) => g && g.status === "Not Attending").length;
  const adultsCount = guests.filter((g) => g && g.type === "Adult").length;
  const childrenCount = guests.filter((g) => g && g.type === "Children").length;

  const sendMessage = (type) => {
    alert(`Sending ${type} message`);
    setShowMessageOptions(false);
  };

  return (
    <div className="wgl-container">
      {/* Header & Stats */}
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
              <span className="wgl-status-sublabel">Pending: {pendingCount}</span>
              <span className="wgl-status-sublabel">Not Attending: {declinedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="wgl-controls">
        <div className="wgl-search-container">
          <FaSearch className="wgl-search-icon" />
          <input
            type="text"
            className="wgl-search-input"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="wgl-button-group">
          <button
            className="wgl-button wgl-button-primary"
            onClick={() => { setShowAddGuestForm(!showAddGuestForm); setShowAddGroupForm(false); setShowMessageOptions(false); }}
          >
            <FaUserPlus className="wgl-button-icon" /> Add Guest
          </button>
          <button
            className="wgl-button wgl-button-secondary"
            onClick={() => { setShowAddGroupForm(!showAddGroupForm); setShowAddGuestForm(false); setShowMessageOptions(false); }}
          >
            <FaUsers className="wgl-button-icon" /> Create Group
          </button>
          <div className="wgl-message-dropdown">
            <button
              className="wgl-button wgl-button-secondary"
              onClick={() => { setShowMessageOptions(!showMessageOptions); setShowAddGuestForm(false); setShowAddGroupForm(false); }}
            >
              <FaEnvelope className="wgl-button-icon" /> Send Message
              <FaChevronDown className="wgl-dropdown-icon" />
            </button>
            {showMessageOptions && (
              <div className="wgl-dropdown-menu">
                <button onClick={() => sendMessage("Email")}>Email</button>
                <button onClick={() => sendMessage("SMS")}>SMS</button>
                <button onClick={() => sendMessage("WhatsApp")}>WhatsApp</button>
              </div>
            )}
          </div>
          <button className="wgl-button wgl-button-secondary"><FaDownload className="wgl-button-icon" /> Download</button>
          <button className="wgl-button wgl-button-secondary"><FaPrint className="wgl-button-icon" /> Print</button>
        </div>
      </div>

      {/* Add Guest Form */}
      {showAddGuestForm && (
        <div className="wgl-add-form card shadow-sm mb-4">
          <div className="card-body p-4">
            <h3 className="wgl-form-title card-title mb-4">Add New Guest</h3>
            {formError && (
              <div className="alert alert-danger small p-2">{formError}</div>
            )}
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Guest Name</label>
                <input className="form-control" placeholder="e.g., John Doe" value={newGuest} onChange={(e) => setNewGuest(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Guest Email</label>
                <input type="email" className="form-control" placeholder="e.g., john.doe@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Companions</label>
                <input type="number" className="form-control" placeholder="e.g., 2" value={newCompanions} onChange={(e) => setNewCompanions(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Group</label>
                <input className="form-control" placeholder="e.g., Bride's Family" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Type</label>
                <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Menu Preference</label>
                <select className="form-select" value={newMenu} onChange={(e) => setNewMenu(e.target.value)}>
                  {menuOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Seat Number</label>
                <input className="form-control" placeholder="e.g., A12" value={newSeatNumber} onChange={(e) => setNewSeatNumber(e.target.value)} />
              </div>
            </div>
            <div className="wgl-form-actions mt-4 d-flex justify-content-end gap-2">
              <button className="btn btn-light" onClick={() => setShowAddGuestForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addGuestAPI}>
                Save Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Group Form */}
      {showAddGroupForm && (
        <div className="wgl-add-form">
          <h3 className="wgl-form-title">Create New Group</h3>
          <input className="wgl-form-input" placeholder="Group Name" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} />
          <div className="wgl-form-actions">
            <button className="wgl-button wgl-button-cancel" onClick={() => setShowAddGroupForm(false)}>Cancel</button>
            <button className="wgl-button wgl-button-save" onClick={() => { alert(`Group "${newGroup}" created`); setShowAddGroupForm(false); }}>Create Group</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="wgl-filter-container">
        <div className="wgl-filter-group">
          <label className="wgl-filter-label">Group:</label>
          <select className="wgl-filter-select" value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Groups</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Coworkers">Coworkers</option>
          </select>
        </div>
        <div className="wgl-filter-group">
          <label className="wgl-filter-label">Status:</label>
          <select className="wgl-filter-select" value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Statuses</option>
            {statusOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="wgl-guest-list">
        {currentGuests.length > 0 ? (
          <table className="wgl-guest-table">
            <thead>
              <tr>
                <th className="wgl-table-header">Guest</th>
                <th className="wgl-table-header">Group</th>
                <th className="wgl-table-header">Status</th>
                <th className="wgl-table-header">Companions</th>
                <th className="wgl-table-header">Seat</th>
                <th className="wgl-table-header">Type</th>
                <th className="wgl-table-header">Menu</th>
                <th className="wgl-table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGuests.map((g) => (
                <tr key={g.id} className="wgl-guest-row">
                  <td className="wgl-guest-name">{g.name}</td>
                  <td className="wgl-guest-group">{g.group}</td>
                  <td className="wgl-guest-status">
                    <select
                      className={`wgl-status-select wgl-status-${g.status.toLowerCase()}`}
                      value={g.status}
                      onChange={(e) => updateGuestField(g.id, "status", e.target.value)}
                    >
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="wgl-guest-companions">{g.companions}</td>
                  <td className="wgl-guest-seat">{g.seat_number}</td>
                  <td className="wgl-guest-type">
                    <select value={g.type} onChange={(e) => updateGuestField(g.id, "type", e.target.value)}>
                      {typeOptions.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td className="wgl-guest-menu">
                    <select value={g.menu} onChange={(e) => updateGuestField(g.id, "menu", e.target.value)}>
                      {menuOptions.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="wgl-guest-actions">
                    <button className="wgl-action-button wgl-action-delete" onClick={() => deleteGuestAPI(g.id)}>Remove</button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="wgl-pagination">
            <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guests;
