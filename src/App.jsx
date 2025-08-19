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

import Main from "./components/pages/adminVendor/Main";
import Search from "./components/pages/matrimonial/Search";
import MatrimonialMain from "./components/pages/matrimonial/MatrimonialMain";
import ProfileMatrimonial from "./components/pages/matrimonial/ProfileMatrimonial";
import MainLayout from "./components/layouts/MainLayout";
import MatrimonialLayout from "./components/layouts/MatrimonialLayout";
import MatrimonialRegister from "./components/pages/matrimonial/MatrimonialRegistration";
import UserDashboardMain from "./components/pages/userDashboard/UserDashboardMain";
import MatrimonialDashboard from "./components/pages/matrimonial/dashboard/MatrimonialDashboard";
import EditProfile from "./components/pages/matrimonial/dashboard/EditProfile";
import ForgotPassword from "./components/auth/ForgotPassword";
// import DashboardLayout from "./components/pages/matrimonial/dashboard/DashboardLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/:section" element={<MainSection />} />
        <Route path="/:section/:slug" element={<SubSection />} />
        <Route path="/details/:section/:slug" element={<Detailed />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-register" element={<CustomerRegister />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-register" element={<VendorRegister />} />
        <Route path="/user-forgot-password" element={<ForgotPassword />} />

        <Route
          path="/vendor-dashboard"
          element={<Navigate to="/vendor-dashboard/vendor-home" />}
        />
        <Route path="/vendor-dashboard/:slug" element={<Main />} />
        <Route path="/user-dashboard/:slug" element={<UserDashboardMain />} />
        <Route path="/user-dashboard" element={<UserDashboardMain />} />
      </Route>

      <Route element={<MatrimonialLayout />}>
        <Route path="/matrimonial" element={<MatrimonialMain />} />
        <Route
          path="/ProfileMatrimonial/:matchType"
          element={<ProfileMatrimonial />}
        />
        <Route path="/matrimonial-search" element={<Search />} />
        <Route path="/matrimonial-register" element={<MatrimonialRegister />} />
        {/* <Route path="/matrimonial-Dashboard" element={<DashboardLayout />} /> */}
        <Route
          path="/matrimonial-Dashboard"
          element={<MatrimonialDashboard />}
        />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
