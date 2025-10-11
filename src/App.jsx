import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import MatrimonialLayout from "./components/layouts/MatrimonialLayout";
import ShimmerLoader from "./components/ui/ShimmerLoader";
import "./App.css";

import NotFound from "./components/pages/NotFound";
import BlogDetails from "./components/pages/BlogDetails";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/authSlice";
import { setVendorCredentials } from "./redux/vendorAuthSlice";
import ToastProvider from "./components/layouts/toasts/Toast";
import LoaderProvider from "./components/context/LoaderContext";
import VendorPrivateRoute from "./components/routes/VendorPrivateRoute";
import UserPrivateRoute from "./components/routes/UserPrivateRoute";
import VendorLeadsPage from "./components/pages/adminVendor/VendorLeadsPage";
import RecommandedPage from "./components/home/RecommandedPage";

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
const VideoEditorPage = lazy(() => import("./components/VideoEditorPage"));
const VideoTemplates = lazy(() =>
  import("./components/layouts/eInvite/VideoTemplates")
);
const VideoEditorDemo = lazy(() =>
  import("./components/layouts/eInvite/VideoEditorDemo")
);
const ProfileImageSelector = lazy(() =>
  import("./components/pages/ProfileImageSelector")
);

// E-Invite Pages
const EinviteHomePage = lazy(() => import("./components/pages/EinviteHomePage"));
const EinviteCategoryPage = lazy(() => import("./components/pages/EinviteCategoryPage"));
const EinviteEditorPage = lazy(() => import("./components/pages/EinviteEditorPage"));
const EinviteSharePage = lazy(() => import("./components/pages/EinviteSharePage"));
const EinviteMyCards = lazy(() => import("./components/layouts/einvites/EinviteMyCards"));
const TryLanding = lazy(() => import("./components/pages/TryLanding"));
const BrideMakeupChoose = lazy(() =>
  import("./components/pages/BrideMakeupChoose")
);
const TryMakeupLanding = lazy(() =>
  import("./components/pages/TryMakeupLanding")
);
const UploadSelfiePage = lazy(() =>
  import("./components/pages/UploadSelfiePage")
);
const FiltersPage = lazy(() => import("./components/pages/FiltersPage"));

const FinalLookPage = lazy(() => import("./components/pages/FinalLookPage"));

const VendorPremium = lazy(() =>
  import("./components/pages/adminVendor/VendorPremium")
);

const RecommandPage = lazy(() => import("./components/home/RecommandedPage"));

function App() {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      dispatch(setCredentials({ user: JSON.parse(user), token }));
    }
    const vendor = localStorage.getItem("vendor");
    const vendorToken = localStorage.getItem("vendorToken");
    if (vendor && vendorToken) {
      dispatch(
        setVendorCredentials({ vendor: JSON.parse(vendor), token: vendorToken })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<ShimmerLoader />}>
      <LoaderProvider>
        <ToastProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/:section" element={<MainSection />} />
              <Route path="/:section/:slug" element={<SubSection />} />
              <Route path="/details/:section/:id" element={<Detailed />} />

              {/* Recommandation */}
              <Route path="/ai-recommandation" element={<RecommandPage />} />

              {/* Auth Pages */}
              <Route path="/customer-login" element={<CustomerLogin />} />
              <Route path="/customer-register" element={<CustomerRegister />} />
              <Route path="/vendor-login" element={<VendorLogin />} />
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route
                path="/user-forgot-password"
                element={<ForgotPassword />}
              />

              {/* Blog */}
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog-details" element={<BlogDetails />} />

              {/* Static Pages */}
              <Route path="/terms" element={<TermsCondition />} />
              <Route path="/cancellation" element={<CancellationPolicy />} />

              {/* Try Flow */}
              <Route path="/try" element={<TryLanding />} />
              <Route
                path="/try/bride"
                element={
                  <UserPrivateRoute>
                    <BrideMakeupChoose />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/try/upload"
                element={
                  <UserPrivateRoute>
                    <UploadSelfiePage />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/try/filters"
                element={
                  <UserPrivateRoute>
                    <FiltersPage />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/try/makeup"
                element={
                  <UserPrivateRoute>
                    <TryMakeupLanding />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/finallook"
                element={
                  <UserPrivateRoute>
                    <FinalLookPage />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/vendor-dashboard/total-leads"
                element={<VendorLeadsPage />}
              />

              {/* Editors / Video */}
              <Route path="/editor" element={<CardEditorPage />} />
              <Route path="/editor/:templateId" element={<CardEditorPage />} />
              <Route path="/video-templates" element={<VideoTemplates />} />
              <Route path="/video-editor" element={<VideoEditorPage />} />
              <Route
                path="/video-editor/:templateId"
                element={<VideoEditorPage />}
              />
              <Route path="/video-demo" element={<VideoEditorDemo />} />

              {/* E-Invite Routes */}
              <Route path="/einvites" element={<EinviteHomePage />} />
              <Route path="/einvites/category/:category" element={<EinviteCategoryPage />} />
              <Route path="/einvites/editor/:id" element={<EinviteEditorPage />} />
              <Route path="/einvites/preview/:id" element={<EinviteSharePage />} />
              <Route path="/einvites/share/:id" element={<EinviteSharePage />} />
              <Route path="/einvites/my-cards" element={<EinviteMyCards />} />

              {/*  User Protected Routes  */}
              <Route
                path="/user-dashboard"
                element={
                  <UserPrivateRoute>
                    <UserDashboardMain />
                  </UserPrivateRoute>
                }
              />
              <Route
                path="/user-dashboard/:slug"
                element={
                  <UserPrivateRoute>
                    <UserDashboardMain />
                  </UserPrivateRoute>
                }
              />

              {/*  Vendor Protected Routes  */}
              <Route
                path="/vendor-dashboard"
                element={
                  <VendorPrivateRoute>
                    <Navigate to="/vendor-dashboard/vendor-home" />
                  </VendorPrivateRoute>
                }
              />
              <Route
                path="/vendor-dashboard/:slug"
                element={
                  <VendorPrivateRoute>
                    <Main />
                  </VendorPrivateRoute>
                }
              />
              <Route
                path="/vendor-dashboard/upgrade/vendor-plan"
                element={
                  <VendorPrivateRoute>
                    <VendorPremium />
                  </VendorPrivateRoute>
                }
              />
            </Route>

            {/*  Matrimonial Routes  */}
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

            {/*  Fallback  */}
            <Route path="*" element={<NotFound />} />
            {/* just for recommanded items route for demo */}
          </Routes>
        </ToastProvider>
      </LoaderProvider>
    </Suspense>
  );
}

export default App;
