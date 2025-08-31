import React, { useState } from "react";
import { Button, Card, Form, ListGroup } from "react-bootstrap";

// export default function EndorsementForm() {
//   const [form, setForm] = useState({
//     name: "",
//     designation: "",
//     company: "",
//     endorsement: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Use form data as needed
//     console.log("Endorsement submitted:", form);
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 border rounded bg-light"
//       style={{ maxWidth: "600px", margin: "auto" }}
//     >
//       <h5 className="mb-4">Add Endorsement</h5>

//       <div className="mb-3">
//         <label htmlFor="name" className="form-label">
//           Name *
//         </label>
//         <input
//           id="name"
//           name="name"
//           type="text"
//           className="form-control rounded"
//           value={form.name}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label htmlFor="designation" className="form-label">
//           Designation *
//         </label>
//         <input
//           id="designation"
//           name="designation"
//           type="text"
//           className="form-control rounded"
//           value={form.designation}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label htmlFor="company" className="form-label">
//           Company *
//         </label>
//         <input
//           id="company"
//           name="company"
//           type="text"
//           className="form-control rounded"
//           value={form.company}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <div className="mb-3">
//         <label htmlFor="endorsement" className="form-label">
//           Endorsement *
//         </label>
//         <textarea
//           id="endorsement"
//           name="endorsement"
//           className="form-control rounded"
//           rows="5"
//           value={form.endorsement}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <button type="submit" className="btn btn-primary">
//         Submit Endorsement
//       </button>
//     </form>
//   );
// }

export default function EndorsementForm() {
  const allVendors = [
    {
      name: "Music Lovers Musical Group, Kanpur",
      category: "Wedding Music",
      location: "Barra",
    },
    {
      name: "Royal Beats Orchestra, Delhi",
      category: "Wedding Music",
      location: "Connaught Place",
    },
    {
      name: "Golden Strings Band, Mumbai",
      category: "Wedding Music",
      location: "Andheri",
    },
    {
      name: "Elegant Decorators, Jaipur",
      category: "Wedding Decor",
      location: "Bapu Bazaar",
    },
    {
      name: "Delight Caterers, Pune",
      category: "Wedding Catering",
      location: "Shivaji Nagar",
    },
  ];

  const [vendors, setVendors] = useState([]);
  const [vendorInput, setVendorInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Handle typing → show suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setVendorInput(value);

    if (value.trim()) {
      const filtered = allVendors.filter((v) =>
        v.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Add vendor from suggestion click
  const handleAddVendor = (vendor) => {
    setVendors([...vendors, { id: Date.now(), ...vendor }]);
    setVendorInput("");
    setSuggestions([]);
  };

  const handleRemove = (id) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {/* Input Field */}
      <Form className="mb-3 position-relative">
        <Form.Control
          type="text"
          placeholder="Enter vendor name"
          value={vendorInput}
          onChange={handleInputChange}
        />
        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ListGroup
            style={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
            }}
          >
            {suggestions.map((v, i) => (
              <ListGroup.Item key={i} action onClick={() => handleAddVendor(v)}>
                <strong>{v.name}</strong>
                <br />
                <small className="text-muted">
                  {v.category} • {v.location}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Form>

      {/* Preview Cards */}
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="mb-2 shadow-sm">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{vendor.name}</h6>
              <small className="text-muted">{vendor.category}</small>
              <div>{vendor.location}</div>
            </div>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleRemove(vendor.id)}
            >
              Remove
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
