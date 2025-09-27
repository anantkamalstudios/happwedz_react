
import React, { useState, useEffect } from "react";

const sampleRows = [
    {
        id: 1,
        name: "Riya",
        email: "riya@gmail.com",
        phone: "1233455233",
        date: "25/05/2025",
        message: "Welcome to happy..",
    },
    {
        id: 2,
        name: "Cell text",
        email: "Cell text",
        phone: "Cell text",
        date: "Cell text",
        message: "Cell text",
    },
    {
        id: 3,
        name: "Cell text",
        email: "Cell text",
        phone: "Cell text",
        date: "Cell text",
        message: "Cell text",
    },
    {
        id: 4,
        name: "Cell text",
        email: "Cell text",
        phone: "Cell text",
        date: "Cell text",
        message: "Cell text",
    },
    {
        id: 5,
        name: "Cell text",
        email: "Cell text",
        phone: "Cell text",
        date: "Cell text",
        message: "Cell text",
    },
];

export default function VendorLeadsPage() {
    const [rows] = useState(sampleRows);
    const [showModal, setShowModal] = useState(false);
    const [activeRow, setActiveRow] = useState(null);
    const [formData, setFormData] = useState({
        price: "",
        service: "",
        date: "",
        message: "",
    });

    // prevent background scroll when modal open
    useEffect(() => {
        document.body.style.overflow = showModal ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showModal]);

    const openModal = (row) => {
        setActiveRow(row);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setActiveRow(null);
        setFormData({ price: "", service: "", date: "", message: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // replace this alert with API call when ready
        alert(
            `Quotation sent to ${activeRow?.name} (${activeRow?.email})\n\nDetails:\n` +
            `Price: ${formData.price}\nService: ${formData.service}\nValid Till: ${formData.date}\nMessage: ${formData.message}`
        );
        closeModal();
    };

    return (
        <div className="container my-5">
            <div className="table-responsive shadow-sm bg-white rounded">
                <table className="table align-middle mb-0">
                    <thead>
                        <tr className="table-header">
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Event Date</th>
                            <th>Message</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.name}</td>
                                <td>{row.email}</td>
                                <td>{row.phone}</td>
                                <td>{row.date}</td>
                                <td className="text-wrap" style={{ maxWidth: 240 }}>
                                    {row.message}
                                </td>
                                <td className="text-end">
                                    <button
                                        className="btn btn-pink"
                                        onClick={() => openModal(row)}
                                    >
                                        Send quotation
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* React-controlled modal */}
            {showModal && (
                <>
                    <div className="custom-backdrop" onClick={closeModal}></div>

                    <div className="custom-modal" role="dialog" aria-modal="true">
                        <div
                            className="modal-content custom-modal-card"
                            style={{ borderRadius: "15px" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header custom-modal-header">
                                <div className="text-center w-100 mb-4">
                                    <h5 className="modal-title mb-0 text-danger">Quotations</h5>
                                    <small className="text-light d-block text-dark">
                                        Fill up details
                                    </small>
                                </div>
                                <button
                                    type="button"
                                    className="close-circle"
                                    onClick={closeModal}
                                    aria-label="Close"
                                >
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Price</label>
                                        <input
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            type="number"
                                            className="form-control"
                                            placeholder="0"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Services</label>
                                        <input
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            type="text"
                                            className="form-control"
                                            placeholder="Service Name"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Valid Till Date</label>
                                        <input
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            type="date"
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="5"
                                            maxLength="2000"
                                            placeholder="Your Message"
                                        />
                                        <div className="form-text text-end">
                                            Max. 2000 characters
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 p-3">
                                    <button type="submit" className="btn btn-pink w-100">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}