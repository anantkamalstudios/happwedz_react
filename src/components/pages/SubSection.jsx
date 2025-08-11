import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import ViewSwitcher from "../layouts/Main/ViewSwitcher";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const title = slug ? toTitleCase(slug) : "";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [view, setView] = useState("list");

  return (
    <div className="container-fluid">
      {section === "venues" && <VenuesSearch title={title} />}
      {section === "vendors" && <VendorsSearch title={title} />}
      {section === "photography" && <MainSearch title={title} />}
      {section === "twosoul" && <MainSearch title={title} />}
      <ViewSwitcher view={view} setView={setView} />
      {view === "list" && (
        <ListView
          subVenuesData={subVenuesData}
          section={section}
          handleShow={handleShow}
        />
      )}
      {view === "images" && (
        <GridView
          subVenuesData={subVenuesData}
          section={section}
          handleShow={handleShow}
        />
      )}
      {view === "map" && (
        <MapView subVenuesData={subVenuesData} section={section} />
      )}
      +
      <PricingModal show={show} handleClose={handleClose} />
    </div>
  );
};

export default SubSection;
