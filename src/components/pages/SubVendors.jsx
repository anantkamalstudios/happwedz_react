import React, { useState } from "react";
import { useParams } from "react-router-dom";
import GridView from "../layouts/vendors/GridView";
import ListView from "../layouts/vendors/ListView";
import { subVendorsData } from "../../data/subVendorsData";
import ViewSwitcher from "../layouts/vendors/ViewSwitcher";
import MapView from "../layouts/vendors/MapView";
import VendorsSearch from "../layouts/vendors/VendorsSearch";

const SubVendors = () => {
  const { slug } = useParams();
  const toTitleCase = (slug) => {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const [view, setView] = useState("list");

  const toggleView = () => {
    setToggleSwitch(toggleSwitch === "grid" ? "list" : "grid");
  };

  const title = slug ? toTitleCase(slug) : "Wedding Venues";

  return (
    <div className="container-fluid">
      <VendorsSearch title={title} />
      <ViewSwitcher view={view} setView={setView} />
      {view === "list" && <ListView subVendorsData={subVendorsData} />}
      {view === "images" && <GridView subVendorsData={subVendorsData} />}
      {view === "map" && <MapView subVendorsData={subVendorsData} />}
    </div>
  );
};

export default SubVendors;
