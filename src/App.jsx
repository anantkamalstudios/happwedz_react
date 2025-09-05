import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import MatrimonialLayout from "./components/layouts/MatrimonialLayout";
import ShimmerLoader from "./components/ui/ShimmerLoader";
import "./App.css";

// Layout components (can be eagerly loaded)
import NotFound from "./components/pages/NotFound";

// Lazy loaded pages
const Home = lazy(() => import("./components/pages/Home"));
const CustomerLogin = lazy(() => import("./components/auth/CustomerLogin"));
const CustomerRegister = lazy(() =>
  import("./components/auth/CustomerRegister")
);
const VendorLogin = lazy(() => import("./components/auth/VendorLogin"));
const VendorRegister = lazy(() => import("./components/auth/VendorRegister"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));

const MainSection = lazy(() => import("./components/pages/MainSection"));
const SubSection = lazy(() => import("./components/pages/SubSection"));
const Detailed = lazy(() => import("./components/layouts/Detailed"));

const Main = lazy(() => import("./components/pages/adminVendor/Main"));
const Search = lazy(() => import("./components/pages/matrimonial/Search"));
const MatrimonialMain = lazy(() =>
  import("./components/pages/matrimonial/MatrimonialMain")
);
const ProfileMatrimonial = lazy(() =>
  import("./components/pages/matrimonial/ProfileMatrimonial")
);
const MatrimonialRegister = lazy(() =>
  import("./components/pages/matrimonial/MatrimonialRegistration")
);
const UserDashboardMain = lazy(() =>
  import("./components/pages/userDashboard/UserDashboardMain")
);
const MatrimonialDashboard = lazy(() =>
  import("./components/pages/matrimonial/dashboard/MatrimonialDashboard")
);
const EditProfile = lazy(() =>
  import("./components/pages/matrimonial/dashboard/EditProfile")
);

const TermsCondition = lazy(() => import("./components/pages/TermsCondition"));
const Blog = lazy(() => import("./components/pages/Blog"));
const CancellationPolicy = lazy(() =>
  import("./components/pages/CancellationPolicy")
);
const CardEditorPage = lazy(() => import("./components/CardEditorPage"));
const ProfileImageSelector = lazy(() =>
  import("./components/pages/ProfileImageSelector")
);
const FinalLookPage = lazy(() => import("./components/pages/FinalLookPage"));

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<ShimmerLoader />}>
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
          <Route path="/terms" element={<TermsCondition />} />
          <Route path="/try" element={<ProfileImageSelector />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/finallook" element={<FinalLookPage />} />
          <Route path="/cancellation" element={<CancellationPolicy />} />
          <Route
            path="/vendor-dashboard"
            element={<Navigate to="/vendor-dashboard/vendor-home" />}
          />
          <Route path="/vendor-dashboard/:slug" element={<Main />} />
          <Route path="/user-dashboard/:slug" element={<UserDashboardMain />} />
          <Route path="/user-dashboard" element={<UserDashboardMain />} />

          <Route path="/editor" element={<CardEditorPage />} />
          <Route path="/editor/:templateId" element={<CardEditorPage />} />
        </Route>

        <Route element={<MatrimonialLayout />}>
          <Route path="/matrimonial" element={<MatrimonialMain />} />
          <Route
            path="/ProfileMatrimonial/:matchType"
            element={<ProfileMatrimonial />}
          />
          <Route path="/matrimonial-search" element={<Search />} />
          <Route
            path="/matrimonial-register"
            element={<MatrimonialRegister />}
          />
          <Route
            path="/matrimonial-Dashboard"
            element={<MatrimonialDashboard />}
          />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
