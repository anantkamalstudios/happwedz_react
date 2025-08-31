import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./matrimonial/Navbar";

export default function MatrimonialLayout() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
