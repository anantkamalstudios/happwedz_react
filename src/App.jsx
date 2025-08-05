
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Home from "./components/pages/Home";
import CustomerRegister from "./components/auth/CustomerRegister";
import CustomerLogin from "./components/auth/CustomerLogin";
import VendorLogin from "./components/auth/VendorLogin";
import VendorRegister from "./components/auth/VendorRegister";


function App() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer-register" element={<CustomerRegister />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;

