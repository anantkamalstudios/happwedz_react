import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const UpComingTask = () => {
  const [answer, SetAnswer] = useState({});

  const tasks = [
    "Do you want a destination wedding",
    "Short list date options for all pre-wedding functions",
    "Delegate responsibilities",
  ];

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    SetAnswer({ ...answer, [name]: checked });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Upcoming tasks</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks.map((task, index) => (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              padding: "10px",
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
          >
            <input
              type="checkbox"
              name={`${task}`}
              onChange={handleCheckboxChange}
              checked={answer[task]}
              style={{ height: "20px", width: "20px" }}
            />
            <div style={{ marginLeft: "10px" }}>
              <p>{task}</p>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                Tap to open Search
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem 0",
          color: "#C31162",
        }}
      >
        <a style={{ borderBottom: "2px solid #C31162", placeItems: "end" }}>
          6 PENDING TAKS{" "}
          <i class="fa-solid fa-arrow-right" style={{ color: "#C31162" }}></i>
        </a>
      </div>
    </div>
  );
};

export default UpComingTask;
