import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { MyProvider } from "../../context/useContext";
import HomeGennie from "../common/HomeGennie";
import { FilterProvider } from "../../context/realWedding.context";

export default function MainLayout() {
  const params = useParams();

  return (
    <>
      <MyProvider>
        <FilterProvider >
        <Header />
        <main style={{ minHeight: "70vh" }}>
          <Outlet />
        </main>
        {params.section !== "genie" && (
          <div
            style={{
              position: "fixed",
              bottom: "10vh",
              right: "60px",
              zIndex: "99",
            }}
          >
            <HomeGennie />
          </div>
        )}
        <Footer />
        </FilterProvider>
      </MyProvider>
    </>
  );
}
