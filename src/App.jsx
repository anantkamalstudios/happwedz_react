import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import Detailed from "./components/layouts/Detailed";
import HomeAdmin from "./components/pages/adminVendor/homeadmin";

import Main from "./components/pages/adminVendor/Main";
import MatrimonialHome from "./components/pages/matrimonial/MatrimonialHome";
import Search from "./components/pages/matrimonial/Search";
import MatrimonialMain from "./components/pages/matrimonial/MatrimonialMain";
import ProfileMatrimonial from "./components/pages/matrimonial/ProfileMatrimonial";

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
          <Route path="/details/:section/:slug" element={<Detailed />} />

          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/vendor-register" element={<VendorRegister />} />

          {/* Vendor Admin panel routes */}
          {/* <Route path="/vendor-dashboard" element={<Main />} /> */}
          <Route path="/matrimonial" element={<MatrimonialMain />} />
          <Route path="/matrimonial-search" element={<Search />} />
          <Route path="/ProfileMatrimonial" element={<ProfileMatrimonial />} />

          <Route path="/" element={<Search />} />
          <Route
            path="/vendor-dashboard"
            element={<Navigate to="/vendors/vendor-home" />}
          />
          <Route path="/vendors/:slug" element={<Main />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
