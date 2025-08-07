import VenuesAsideview from "./VenuesAsideview";
import VendorAsideview from "./VendorAsideview";
import PhotoGraphyAsideView from "./PhotoGraphyAsideView";

const DynamicAside = ({ section }) => {
  switch (section) {
    case "venues":
      return <VenuesAsideview />;
    case "vendors":
      return <VendorAsideview />;
    case "photography":
      return <PhotoGraphyAsideView />;
    default:
      return null;
  }
};

export default DynamicAside;
