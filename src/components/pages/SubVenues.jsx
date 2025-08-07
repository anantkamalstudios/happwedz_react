import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GridView from "../layouts/venus/GridView";
import ListView from "../layouts/venus/ListView";
import { subVenuesData } from "../../data/subVenuesData";
import { Button } from "react-bootstrap";

const SubVenues = () => {
  const { slug } = useParams();
  const [toggleSwitch, setToggleSwitch] = useState("list");

  const toggleView = () => {
    setToggleSwitch(toggleSwitch === "grid" ? "list" : "grid");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-primary" onClick={toggleView}>
          Switch to {toggleSwitch === "grid" ? "List" : "Grid"} View
        </Button>
      </div>

      {toggleSwitch === "list" ? (
        subVenuesData.map((subVenue) => (
          <ListView subVenuesData={subVenue} key={subVenue.id} />
        ))
      ) : (
        <GridView subVenuesData={subVenuesData} />
      )}
    </div>
  );
};

export default SubVenues;
