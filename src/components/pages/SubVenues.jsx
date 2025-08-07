import React from "react";
import { useParams } from "react-router-dom";

const SubVenues = () => {
  const { slug } = useParams();

  return (
    <div>
      <h2>Sub Venue Page</h2>
      <p>Slug: {slug}</p>
    </div>
  );
};

export default SubVenues;
