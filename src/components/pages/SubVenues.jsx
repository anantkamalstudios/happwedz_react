import React from "react";
import { useParams } from "react-router-dom";
import GridView from "../layouts/venus/GridView";

const SubVenues = () => {
  const { slug } = useParams();

  return (
    <>
      <GridView />
    </>
  );
};

export default SubVenues;
