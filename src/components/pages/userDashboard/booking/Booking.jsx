// import React from "react";
// import { Row, Col, Card } from "react-bootstrap";
// import { CiBookmarkCheck } from "react-icons/ci";
// import { FaCheckSquare } from "react-icons/fa";

// const bookings = {
//   venues: [
//     {
//       id: 1,
//       title: "Fort Jadhavgadh, Pune",
//       price: "₹ 50000",
//       date: "20/09/2025",
//       address: "Banquet Halls, Marriage Garden Saswad, Pune",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//     {
//       id: 2,
//       title: "Blue Lagoon Resort, Nashik",
//       price: "₹ 60000",
//       date: "25/09/2025",
//       address: "Trimbak Road, Nashik",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//     {
//       id: 3,
//       title: "Royal Palace, Mumbai",
//       price: "₹ 80000",
//       date: "28/09/2025",
//       address: "Bandra, Mumbai",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//   ],
//   vendors: [
//     {
//       id: 1,
//       title: "Fort Jadhavgadh, Pune",
//       price: "₹ 50000",
//       date: "20/09/2025",
//       address: "Banquet Halls, Marriage Garden Saswad, Pune",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//     {
//       id: 2,
//       title: "Blue Lagoon Resort, Nashik",
//       price: "₹ 60000",
//       date: "25/09/2025",
//       address: "Trimbak Road, Nashik",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//     {
//       id: 3,
//       title: "Royal Palace, Mumbai",
//       price: "₹ 80000",
//       date: "28/09/2025",
//       address: "Bandra, Mumbai",
//       image:
//         "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
//     },
//   ],
// };

// const Booking = () => {
//   return (
//     <div className="container my-5">
//       {Object.keys(bookings).map((category) => (
//         <div key={category} className="mb-5">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h4 className="fw-bold text-capitalize mb-0">{category}</h4>
//             <a href="#" className="text-danger fw-bold small">
//               View All
//             </a>
//           </div>
//           <Row>
//             {bookings[category].map((item) => (
//               <Col md={4} className="mb-4" key={item.id}>
//                 <Card className="shadow-sm border-0 h-100">
//                   <Card.Img
//                     variant="top"
//                     src={item.image}
//                     alt={item.title}
//                     style={{ height: "200px", objectFit: "cover" }}
//                   />
//                   <Card.Body>
//                     <h5 className="fw-bold">{item.title}</h5>
//                     <p className="mb-1">
//                       <span className="fw-bold">Price </span> {item.price}
//                     </p>
//                     <p className="mb-1 text-muted">
//                       <span className="fw-bold text-dark">Booking date </span>
//                       {item.date}
//                     </p>
//                     <p className="mb-3 text-muted">
//                       <span className="fw-bold text-dark">Address </span>
//                       {item.address}
//                     </p>
//                     <div className="d-flex justify-content-between align-items-center mt-3">
//                       <div className="text-danger fw-bold d-flex align-items-center">
//                         <CiBookmarkCheck className="me-2" /> Service Booked
//                       </div>
//                       <a href="#" className="text-danger fw-bold small">
//                         View All
//                       </a>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Booking;
// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Dropdown, Spinner } from "react-bootstrap";
// import { CiBookmarkCheck } from "react-icons/ci";
// import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
// import axios from "axios";

// const Quotations = () => {
//   const [quotations, setQuotations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchQuotations = async () => {
//       try {
//         const response = await axios.get(
//           "https://happywedz.com/api/request-pricing/user/quotations"
//         );
//         if (response.data.success) {
//           setQuotations(response.data.quotations);
//         }
//       } catch (error) {
//         console.error("Error fetching quotations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchQuotations();
//   }, []);

//   return (
//     <div className="container my-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="fw-bold mb-0">My Quotations</h4>
//         <a href="#" className="text-danger fw-bold small">
//           View All
//         </a>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="danger" />
//         </div>
//       ) : quotations.length === 0 ? (
//         <div className="text-center text-muted py-5">
//           No quotations found.
//         </div>
//       ) : (
//         <Row>
//           {quotations.map((item) => (
//             <Col md={6} lg={4} key={item.id} className="mb-4">
//               <Card className="shadow-sm border-0 h-100">
//                 <Card.Img
//                   variant="top"
//                   src={
//                     item.vendor?.profileImage ||
//                     "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
//                   }
//                   alt={item.vendor?.businessName || "Vendor"}
//                   style={{ height: "200px", objectFit: "cover" }}
//                 />
//                 <Card.Body>
//                   <h5 className="fw-bold text-danger mb-2">
//                     {item.vendor?.businessName || "Unknown Vendor"}
//                   </h5>

//                   <p className="mb-1 text-muted">
//                     <FaUser className="me-2 text-danger" />
//                     {item.firstName} {item.lastName}
//                   </p>
//                   <p className="mb-1 text-muted">
//                     <FaEnvelope className="me-2 text-danger" />
//                     {item.email}
//                   </p>
//                   <p className="mb-1 text-muted">
//                     <FaPhone className="me-2 text-danger" />
//                     {item.phone}
//                   </p>
//                   <p className="mb-1 text-muted">
//                     <FaCalendarAlt className="me-2 text-danger" />
//                     Event Date:{" "}
//                     <span className="fw-bold text-dark">{item.eventDate}</span>
//                   </p>

//                   <div className="border-top my-3"></div>

//                   <p className="mb-1">
//                     <span className="fw-bold">Quote Price:</span>{" "}
//                     {item.quote?.price
//                       ? `₹ ${item.quote.price}`
//                       : "Not provided"}
//                   </p>
//                   <p className="mb-1">
//                     <span className="fw-bold">Quote Message:</span>{" "}
//                     {item.quote?.message || "N/A"}
//                   </p>
//                   <p className="mb-1">
//                     <span className="fw-bold">Valid Till:</span>{" "}
//                     {item.quote?.validTill || "N/A"}
//                   </p>

//                   <div className="border-top my-3"></div>

//                   <p className="mb-1">
//                     <span className="fw-bold">Plan Type:</span>{" "}
//                     <span className="text-capitalize">{item.planType}</span>
//                   </p>
//                   <p className="mb-1">
//                     <span className="fw-bold">Status:</span>{" "}
//                     <span
//                       className={`text-${
//                         item.status === "replied"
//                           ? "success"
//                           : item.status === "pending"
//                           ? "warning"
//                           : "secondary"
//                       } fw-bold text-capitalize`}
//                     >
//                       {item.status}
//                     </span>
//                   </p>
//                   <p className="mb-1">
//                     <span className="fw-bold">Payment:</span>{" "}
//                     <span className="text-capitalize">{item.paymentStatus}</span>
//                   </p>

//                   <div className="d-flex justify-content-between align-items-center mt-4">
//                     <div className="text-danger fw-bold d-flex align-items-center">
//                       <CiBookmarkCheck className="me-2" /> Quotation Sent
//                     </div>

//                     <Dropdown>
//                       <Dropdown.Toggle
//                         variant="outline-danger"
//                         size="sm"
//                         id={`dropdown-${item.id}`}
//                       >
//                         Action
//                       </Dropdown.Toggle>
//                       <Dropdown.Menu>
//                         <Dropdown.Item href="#">Booked</Dropdown.Item>
//                         <Dropdown.Item href="#">Pending</Dropdown.Item>
//                         <Dropdown.Item href="#">Discussed</Dropdown.Item>
//                       </Dropdown.Menu>
//                     </Dropdown>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </div>
//   );
// };

// export default Quotations;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Row, Col, Card, Spinner, Dropdown, Badge } from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { CiBookmarkCheck } from "react-icons/ci";

const Booking = () => {
  const { token, user } = useSelector((state) => state.auth); // 👈 get from Redux
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch Quotations using token
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        console.warn("No token found, redirecting...");
        window.location.href = "/customer-login";
        return;
      }

      try {
        const res = await axios.get(
          "https://happywedz.com/api/request-pricing/user/quotations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setBookings(res.data.quotations);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  // 🧠 Handle Action change
  const handleActionChange = (id, newStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, localStatus: newStatus } : b
      )
    );
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0 text-danger">My Bookings</h4>
        <a href="#" className="text-danger fw-bold small">
          View All
        </a>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-muted py-5">
          No bookings found.
        </div>
      ) : (
        <Row>
          {bookings.map((item) => (
            <Col md={6} lg={4} key={item.id} className="mb-4">
              <Card className="shadow border-0 h-100 rounded-4 overflow-hidden">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={
                      item.vendor?.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={item.vendor?.businessName}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <Badge
                    bg={
                      item.status === "replied"
                        ? "success"
                        : item.status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                    className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill"
                  >
                    {item.status}
                  </Badge>
                </div>

                <Card.Body>
                  <h5 className="fw-bold text-danger mb-2">
                    {item.vendor?.businessName || "Unknown Vendor"}
                  </h5>
                  <p className="text-muted small mb-3">
                    <FaMapMarkerAlt className="me-2 text-danger" />
                    {item.vendor?.city || "Unknown"}, {item.vendor?.state}
                  </p>

                  <div className="p-3 bg-light rounded mb-3">
                    <p className="mb-1">
                      <FaUser className="me-2 text-danger" />
                      {item.firstName} {item.lastName}
                    </p>
                    <p className="mb-1">
                      <FaEnvelope className="me-2 text-danger" />
                      {item.email}
                    </p>
                    <p className="mb-1">
                      <FaPhone className="me-2 text-danger" />
                      {item.phone}
                    </p>
                    <p className="mb-0">
                      <FaCalendarAlt className="me-2 text-danger" />
                      Event Date:{" "}
                      <span className="fw-bold">{item.eventDate}</span>
                    </p>
                  </div>

                  <div className="bg-white rounded border p-3 mb-3">
                    <p className="mb-1">
                      <span className="fw-bold">Quote Price:</span>{" "}
                      {item.quote?.price
                        ? `₹ ${item.quote.price}`
                        : "Not provided"}
                    </p>
                    <p className="mb-1">
                      <span className="fw-bold">Message:</span>{" "}
                      {item.quote?.message || "No message"}
                    </p>
                    <p className="mb-0">
                      <span className="fw-bold">Valid Till:</span>{" "}
                      {item.quote?.validTill || "N/A"}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-danger fw-bold d-flex align-items-center">
                      <CiBookmarkCheck className="me-2" /> Service Booked
                    </div>

                    <Dropdown onSelect={(key) => handleActionChange(item.id, key)}>
                      <Dropdown.Toggle
                        variant="outline-danger"
                        size="sm"
                        className="rounded-pill"
                      >
                        {item.localStatus || "Action"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey="Booked">Booked</Dropdown.Item>
                        <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
                        <Dropdown.Item eventKey="Discussed">
                          Discussed
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Booking;
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Row, Col, Card, Spinner, Dropdown, Badge } from "react-bootstrap";

// const Booking = () => {
//   const { token, user } = useSelector((state) => state.auth);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch quotations using token
//   useEffect(() => {
//     const fetchBookings = async () => {
//       if (!token) {
//         window.location.href = "/customer-login";
//         return;
//       }

//       try {
//         const res = await axios.get(
//           "https://happywedz.com/api/request-pricing/user/quotations",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (res.data.success) {
//           setBookings(res.data.quotations);
//         }
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, [token]);

//   // Local dropdown action
//   const handleActionChange = (id, newStatus) => {
//     setBookings((prev) =>
//       prev.map((b) =>
//         b.id === id ? { ...b, localStatus: newStatus } : b
//       )
//     );
//   };

//   return (
//     <div className="container my-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="fw-bold mb-0 text-danger">My Service Quotations</h4>
//         <a href="#" className="text-danger fw-bold small">
//           View All
//         </a>
//       </div>

//       {loading ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="danger" />
//         </div>
//       ) : bookings.length === 0 ? (
//         <div className="text-center text-muted py-5">No bookings found.</div>
//       ) : (
//         <Row>
//           {bookings.map((item) => (
//             <Col md={6} lg={4} key={item.id} className="mb-4">
//               <Card className="shadow-sm border-0 h-100 rounded-4 p-3">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="fw-bold text-danger mb-0">
//                     {item.vendor?.businessName || "Unknown Vendor"}
//                   </h5>
//                   <Badge
//                     bg={
//                       item.status === "replied"
//                         ? "success"
//                         : item.status === "pending"
//                         ? "warning"
//                         : "secondary"
//                     }
//                     className="text-uppercase"
//                   >
//                     {item.status}
//                   </Badge>
//                 </div>

//                 <div className="border-bottom pb-2 mb-3">
//                   <p className="mb-1">
//                     <strong>City:</strong> {item.vendor?.city || "N/A"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>State:</strong> {item.vendor?.state || "N/A"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Vendor Email:</strong> {item.vendor?.email || "N/A"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Vendor Phone:</strong> {item.vendor?.phone || "N/A"}
//                   </p>
//                 </div>

//                 <div className="border-bottom pb-2 mb-3">
//                   <p className="mb-1">
//                     <strong>Customer:</strong> {item.firstName} {item.lastName}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Email:</strong> {item.email}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Phone:</strong> {item.phone}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Event Date:</strong> {item.eventDate}
//                   </p>
//                 </div>

//                 <div className="border-bottom pb-2 mb-3">
//                   <p className="mb-1">
//                     <strong>Quote Price:</strong>{" "}
//                     {item.quote?.price
//                       ? `₹ ${item.quote.price}`
//                       : "Not provided"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Quote Message:</strong>{" "}
//                     {item.quote?.message || "No message"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Valid Till:</strong> {item.quote?.validTill || "N/A"}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Payment Status:</strong> {item.paymentStatus}
//                   </p>
//                   <p className="mb-1">
//                     <strong>Plan Type:</strong>{" "}
//                     {item.planType?.toUpperCase() || "Free"}
//                   </p>
//                 </div>

//                 <div className="d-flex justify-content-between align-items-center mt-3">
//                   <span className="fw-bold text-secondary">
//                     {item.localStatus || "Service Status"}
//                   </span>
//                   <Dropdown onSelect={(key) => handleActionChange(item.id, key)}>
//                     <Dropdown.Toggle
//                       variant="outline-danger"
//                       size="sm"
//                       className="rounded-pill"
//                     >
//                       {item.localStatus || "Action"}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       <Dropdown.Item eventKey="Booked">Booked</Dropdown.Item>
//                       <Dropdown.Item eventKey="Pending">Pending</Dropdown.Item>
//                       <Dropdown.Item eventKey="Discussed">
//                         Discussed
//                       </Dropdown.Item>
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       )}
//     </div>
//   );
// };

// export default Booking;
