// DynamicAside.jsx
import { useParams } from "react-router-dom";
import TopFilter from "./TopFilter";
import FILTER_CONFIG, { DEFAULT_FILTERS } from "../../../data/filtersConfig";

const DynamicAside = ({ view, setView }) => {
  const { slug } = useParams();

  const filters = FILTER_CONFIG[slug] || DEFAULT_FILTERS;

  return <TopFilter view={view} setView={setView} filters={filters} />;
};

export default DynamicAside;
