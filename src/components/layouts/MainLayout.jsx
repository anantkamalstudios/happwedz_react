import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { MyProvider } from "../../context/useContext";

export default function MainLayout() {
  return (
    <>
      <MyProvider>
        <Header />
        <main style={{ minHeight: "70vh" }}>
          <Outlet />
        </main>
        <Footer />
      </MyProvider>
    </>
  );
}
