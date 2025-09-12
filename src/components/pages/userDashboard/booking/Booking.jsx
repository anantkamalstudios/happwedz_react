import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { CiBookmarkCheck } from "react-icons/ci";
import { FaCheckSquare } from "react-icons/fa";

const bookings = {
  venues: [
    {
      id: 1,
      title: "Fort Jadhavgadh, Pune",
      price: "₹ 50000",
      date: "20/09/2025",
      address: "Banquet Halls, Marriage Garden Saswad, Pune",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
    {
      id: 2,
      title: "Blue Lagoon Resort, Nashik",
      price: "₹ 60000",
      date: "25/09/2025",
      address: "Trimbak Road, Nashik",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
    {
      id: 3,
      title: "Royal Palace, Mumbai",
      price: "₹ 80000",
      date: "28/09/2025",
      address: "Bandra, Mumbai",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
  ],
  vendors: [
    {
      id: 1,
      title: "Fort Jadhavgadh, Pune",
      price: "₹ 50000",
      date: "20/09/2025",
      address: "Banquet Halls, Marriage Garden Saswad, Pune",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
    {
      id: 2,
      title: "Blue Lagoon Resort, Nashik",
      price: "₹ 60000",
      date: "25/09/2025",
      address: "Trimbak Road, Nashik",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
    {
      id: 3,
      title: "Royal Palace, Mumbai",
      price: "₹ 80000",
      date: "28/09/2025",
      address: "Bandra, Mumbai",
      image:
        "https://media.istockphoto.com/id/2168707889/photo/indian-couple-holding-hand-close-up-in-wedding-ceremony.jpg?s=612x612&w=0&k=20&c=5UYeZvhXO3vu3lWcuNlnzKvn0mMEfLGH77Yk27wWa3w=",
    },
  ],
};

const Booking = () => {
  return (
    <div className="container my-5">
      {Object.keys(bookings).map((category) => (
        <div key={category} className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold text-capitalize mb-0">{category}</h4>
            <a href="#" className="text-danger fw-bold small">
              View All
            </a>
          </div>
          <Row>
            {bookings[category].map((item) => (
              <Col md={4} className="mb-4" key={item.id}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <h5 className="fw-bold">{item.title}</h5>
                    <p className="mb-1">
                      <span className="fw-bold">Price </span> {item.price}
                    </p>
                    <p className="mb-1 text-muted">
                      <span className="fw-bold text-dark">Booking date </span>
                      {item.date}
                    </p>
                    <p className="mb-3 text-muted">
                      <span className="fw-bold text-dark">Address </span>
                      {item.address}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-danger fw-bold d-flex align-items-center">
                        <CiBookmarkCheck className="me-2" /> Service Booked
                      </div>
                      <a href="#" className="text-danger fw-bold small">
                        View All
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
};

export default Booking;
