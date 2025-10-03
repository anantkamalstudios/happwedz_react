import { Link } from "react-router-dom";
import CardComponent from "./components/CardComponent";

const RecommandedPage = () => {
  return (
    <div
      style={{
        padding: "3rem 5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <div>
        <h1 style={{ color: "#C31162" }}>
          Best Recommandations for Your <br /> Celebration
        </h1>
        <p>
          Manage your wedding costs and stay within your budget with HappyWedz
          easy-to-use budget planner.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Recommanded Vendors for You</h1>
          <Link
            style={{
              color: "#C31162",
              fontWeight: "900",
              letterSpacing: "1px",
              fontSize: "1.25rem",
            }}
          >
            SEE MORE
          </Link>
        </div>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <CardComponent />
          <CardComponent />
          <CardComponent />
        </div>
      </div>
    </div>
  );
};

export default RecommandedPage;
