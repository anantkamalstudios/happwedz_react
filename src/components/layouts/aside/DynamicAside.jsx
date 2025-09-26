import VenuesAsideview from "./VenuesAsideview";
import VendorAsideview from "./VendorAsideview";
import PhotoGraphyAsideView from "./PhotoGraphyAsideView";
import GroomeAsideView from "./GroomeAsideView";

const DynamicAside = ({ section, view, setView }) => {
  switch (section) {
    case "venues":
      return <VenuesAsideview view={view} setView={setView} />;
    case "vendors":
      return <VendorAsideview view={view} setView={setView} />;
    case "photography":
      return <PhotoGraphyAsideView view={view} setView={setView} />;
    case "two-soul":
      return <GroomeAsideView view={view} setView={setView} />;
    default:
      return null;
  }
};

export default DynamicAside;
