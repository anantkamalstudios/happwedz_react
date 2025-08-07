import React from "react";
import { useParams } from "react-router-dom";
import Asideview from "../layouts/venus/Asideview";

import VenueSearch from "../../components/layouts/venus/VenuesSearch.jsx";
import ViewSwitcher from "../../components/layouts/venus/ViewSwitcher.jsx";

const SubVenues = () => {
  const { slug } = useParams();

  return (
    <div>
      <VenueSearch />
      <ViewSwitcher />
      <Asideview />

    </div>
  );
};

export default SubVenues;
