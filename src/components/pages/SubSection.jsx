import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import VenuesSearch from "../layouts/venus/VenuesSearch";
import VendorsSearch from "../layouts/vendors/VendorsSearch";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import { subVendorsData } from "../../data/subVendorsData";
import { twoSoul } from "../../data/twoSoul";
import ViewSwitcher from "../layouts/Main/ViewSwitcher";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const title = slug ? toTitleCase(slug) : "";
  const [show, setShow] = useState(false);
  const [view, setView] = useState("list");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Filter venues by region if section is venues and slug exists
  const filteredVenuesData = useMemo(() => {
    if (section === "venues" && slug) {
      // Convert slug back to region name for comparison
      const regionName = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      return subVenuesData.filter((venue) =>
        venue.location.toLowerCase().includes(regionName.toLowerCase())
      );
    }
    return subVenuesData;
  }, [section, slug]);

  let dataToSend = filteredVenuesData;
  if (section === "vendors") {
    dataToSend = subVendorsData;
  } else if (section === "twosoul") {
    dataToSend = twoSoul;
  }

  return (
    <div className="container-fluid">
      {section === "venues" && <VenuesSearch title={title} />}
      {section === "vendors" && <VendorsSearch title={title} />}
      {(section === "photography" || section === "twosoul") && (
        <MainSearch title={title} />
      )}

      {section === "photography" ? (
        <Photos title={title} />
      ) : (
        <>
          <ViewSwitcher view={view} setView={setView} />

          {view === "list" && (
            <ListView
              subVenuesData={dataToSend}
              section={section}
              handleShow={handleShow}
            />
          )}

          {view === "images" && (
            <GridView
              subVenuesData={dataToSend}
              section={section}
              handleShow={handleShow}
            />
          )}

          {view === "map" && (
            <MapView subVenuesData={dataToSend} section={section} />
          )}

          <PricingModal show={show} handleClose={handleClose} />
        </>
      )}
    </div>
  );
};

export default SubSection;
