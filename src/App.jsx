import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import "./App.css";

// Public pages
import Home from "./components/pages/Home";
import CustomerLogin from "./components/auth/CustomerLogin";
import CustomerRegister from "./components/auth/CustomerRegister";
import VendorLogin from "./components/auth/VendorLogin";
import VendorRegister from "./components/auth/VendorRegister";
import NotFound from "./components/pages/NotFound";
import MainSection from "./components/pages/MainSection";
import SubSection from "./components/pages/SubSection";
import HomeAdmin from "./components/pages/adminVendor/homeadmin";
import Main from "./components/pages/adminVendor/Main";

function App() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/:section" element={<MainSection />} />
          <Route path="/:section/:slug" element={<SubSection />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/vendor-register" element={<HomeAdmin />} />
          {/* Vendor */}
          <Route path="/vendor-dashboard" element={<Main />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
