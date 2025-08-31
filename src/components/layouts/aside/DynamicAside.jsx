import VenuesAsideview from "./VenuesAsideview";
import VendorAsideview from "./VendorAsideview";
import PhotoGraphyAsideView from "./PhotoGraphyAsideView";
import GroomeAsideView from "./GroomeAsideView";

const DynamicAside = ({ section }) => {
  switch (section) {
    case "venues":
      return <VenuesAsideview />;
    case "vendors":
      return <VendorAsideview />;
    case "photography":
      return <PhotoGraphyAsideView />;
    case "two-soul":
      return <GroomeAsideView />;
    default:
      return null;
  }
};

export default DynamicAside;
