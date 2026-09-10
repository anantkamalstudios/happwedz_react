import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { MyProvider } from "../../context/useContext";
import { FilterProvider } from "../../context/realWedding.context.jsx";
import MovmentPlusHeader from "./MovmentPlusHeader.jsx";
import SEO from "../common/SEO";

export default function MovmentPlusLayout() {

  return (
    <>
      <SEO />
      <MyProvider>
        <FilterProvider>
          {/* Homepage navbar */}
          <Header />
          {/* Movments Plus right sidebar navbar */}
          <MovmentPlusHeader />
          <main style={{ minHeight: "70vh" }}>
            <Outlet />
          </main>
          <Footer />
        </FilterProvider>
      </MyProvider>
    </>
  );
}
