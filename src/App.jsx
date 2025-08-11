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
import Detailed from "./components/layouts/Detailed";
// Admin panel pages (corrected path)
import Dashboard from "./components/pages/adminVendor/Dashboard";
import Requests from "./components/pages/adminVendor/Requests";
import Reviews from "./components/pages/adminVendor/Reviews";
// import Notifications from "./components/pages/adminVendor/Notifications";
import Settings from "./components/pages/adminVendor/Settings";

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

          {/* <Route path="/venus" element={<Venus />} />
          <Route path="/venues/:slug" element={<SubVenues />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:slug" element={<SubVendors />} /> */}
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/vendor-register" element={<VendorRegister />} />

          {/* Admin panel routes */}
          <Route path="/admin" element={<Dashboard />}>
            <Route path="requests" element={<Requests />} />
            <Route path="reviews" element={<Reviews />} />
            {/* <Route path="notifications" element={<Notifications />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
