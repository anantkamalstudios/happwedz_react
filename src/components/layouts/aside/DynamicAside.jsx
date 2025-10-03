// DynamicAside.jsx
import { useParams } from "react-router-dom";
import TopFilter from "./TopFilter";
import useFilters from "../../../hooks/useFilters";

const DynamicAside = ({ view, setView, section }) => {
  const { slug } = useParams();
  const { filters } = useFilters({ section, slug });
  return <TopFilter view={view} setView={setView} filters={filters} />;
};

export default DynamicAside;
