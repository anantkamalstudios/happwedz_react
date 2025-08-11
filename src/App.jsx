import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import "./App.css";
import Home from "./components/pages/Home";
import CustomerLogin from "./components/auth/CustomerLogin";
import CustomerRegister from "./components/auth/CustomerRegister";
import VendorLogin from "./components/auth/VendorLogin";
import VendorRegister from "./components/auth/VendorRegister";
import Venus from "./components/pages/Venus";
import SubVenues from "./components/pages/SubVenues";
import NotFound from "./components/pages/NotFound";
import Vendors from "./components/pages/Vendors";
import SubVendors from "./components/pages/SubVendors";
import MainSection from "./components/pages/MainSection";
import SubSection from "./components/pages/SubSection";
import Detailed from "./components/layouts/Detailed";

function App() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:section" element={<MainSection />} />
          <Route path="/:section/:slug" element={<SubSection />} />
          <Route path="/details/:section/:slug" element={<Detailed />} />

          {/* <Route path="/venus" element={<Venus />} />
          <Route path="/venues/:slug" element={<SubVenues />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:slug" element={<SubVendors />} /> */}
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
