import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import ViewSwitcher from "../layouts/Main/ViewSwitcher";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const title = slug ? toTitleCase(slug) : "";

  const [view, setView] = useState("list");

  return (
    <div className="container-fluid">
      {section === "venues" && <VenuesSearch title={title} />}
      {section === "vendors" && <VendorsSearch title={title} />}

      <ViewSwitcher view={view} setView={setView} />
      {view === "list" && (
        <ListView subVenuesData={subVenuesData} section={section} />
      )}
      {view === "images" && (
        <GridView subVenuesData={subVenuesData} section={section} />
      )}
      {view === "map" && (
        <MapView subVenuesData={subVenuesData} section={section} />
      )}
    </div>
  );
};

export default SubSection;
