# PROJECT_CONTEXT.md

## 1. Project Overview

**HappyWedz** is a comprehensive, multi-faceted wedding platform that operates as a hybrid between a vendor marketplace, SaaS utility, AI-driven assistant, and travel aggregator. Its primary purpose is to serve as an all-in-one ecosystem for couples planning their weddings, vendors offering wedding services, and guests participating in the events.

### Primary Users
1. **Customers (Couples/Families):** Individuals planning their weddings, searching for vendors, creating e-invites, managing guest lists, finding honeymoon packages, and using AI-powered planning tools.
2. **Vendors (Businesses):** Service providers managing their profiles, tracking leads, responding to messages, upgrading to premium plans, and managing their business visibility.

### Key Functionality & Main Business Domains
- **Vendor Marketplace:** A directory for discovering, reviewing, and booking vendors (venues, photography, etc.). Includes business claiming, 360-degree vendor views, and full vendor dashboards.
- **Matrimonial Platform:** A built-in matchmaking service with specialized profiles, search functionality, and dashboards for finding partners.
- **Shaadi AI & Smart Features:** A suite of AI tools including a Timeline Generator, Culture Blender, Personality Quiz, Conflict Resolver, and an AI Features Hub (`/shaadi-ai`).
- **Design Studio (Virtual Try-on):** AI-powered tools (`face-api.js`) for virtual try-on of bridal/groom makeup, outfits, and filters.
- **E-Invites & Wedding Websites:** Creation tools for personalized digital invitation cards, video templates (`fabric.js`), and full custom wedding websites.
- **Travel & Honeymoon:** Integrated flight and hotel search (Hotelbeds integration) for booking honeymoons and destination weddings.
- **Movement Plus:** A guest interaction system featuring token-based access, selfie uploads, and real-time shared galleries.

---

## 2. Tech Stack

### Frontend
- **Core Framework:** React 19.1.0 with Vite.
- **State Management:** Redux Toolkit (modular slices for `auth`, `vendorAuth`, `location`, `wishlist`, `filters`, `guestToken`, etc.).
- **Styling System:** Hybrid approach combining pure CSS/CSS Modules, Bootstrap 5.3, Material-UI (MUI v7), and custom themes (`src/theme/muiTheme.js`).
- **Routing:** React Router DOM v7 (Lazy loaded routes with extensive nested layouts).
- **Forms & Validation:** React Hook Form.
- **UI & Animations:** Framer Motion, React Animated CSS, React Slick, Swiper, tsParticles.
- **Advanced Capabilities:**
  - `face-api.js` (Facial recognition/manipulation for Design Studio).
  - `fabric.js` (Canvas manipulation for E-invites/Card Editors).
  - `@react-pdf/renderer` (Document generation).
  - `leaflet` & `react-leaflet` (Mapping for destination weddings).
  - `chart.js` & `recharts` (Analytics for Vendor Dashboards).

### Backend (Inferred via Frontend Architecture)
- **API Architecture:** RESTful endpoints separated into distinct services (Main API, AI API, Shaadi AI API).
- **Authentication:** Dual JWT-based authentication (distinct flows for Users and Vendors).
- **Payment Gateway:** Razorpay (defined via `VITE_RAZORPAY_KEY`).

### Third-party Integrations
- **Google OAuth:** For seamless customer login (`@react-oauth/google`).
- **Google reCAPTCHA:** Form protection and bot mitigation.
- **Hotelbeds / Flight APIs:** For the Travel & Honeymoon aggregator modules.
- **Firebase:** Integrated for real-time capabilities or push notifications (`firebase.js` in src).

---

## 3. Complete Folder Structure Analysis

### `src/components/pages`
- **Purpose:** Houses all route-level components for the application.
- **Contents:** Divided into business domains:
  - `/adminVendor`: Vendor dashboard views, lead tracking, premium upgrade flows.
  - `/designStudio`: AI makeup, outfit filters, selfie uploads.
  - `/matrimonial`: Matchmaking search, registration, and profiles.
  - `/Travels`: Honeymoon searches, city details, flight/hotel results.
  - `/movments-plus`: Guest token validation and gallery.
  - `/userDashboard`: Customer tools like budget, checklist, wishlist, real wedding form.

### `src/components/layouts`
- **Purpose:** Shared layout wrappers that inject sidebars, headers, footers, and context providers.
- **Contents:** `MainLayout.jsx`, `MatrimonialLayout.jsx`, `MovmentPlusLayout.jsx`. Also contains domain-specific UI sections like `eInvite`, `vendors`, `realWedding`.

### `src/redux`
- **Purpose:** Global state management configuration.
- **Contents:** `store.js` combining slices like `authSlice`, `vendorAuthSlice`, `wishlistSlice`, `filterSlice`, `locationSlice`. Manages localized syncing with `localStorage`.

### `src/services/api`
- **Purpose:** Centralized Axios instances and modular API interaction files.
- **Contents:** `axiosInstance.js` (with interceptors for token refresh/expiry handling), and specific domain APIs like `beautyApi.js`, `einviteApi.js`, `flightApi.js`, `weddingWebsiteApi.js`.

### `src/hooks`
- **Purpose:** Custom React Hooks abstracting complex logic and API calls.
- **Contents:** `useVendors.js`, `useFilters.js`, `useInfiniteScroll.js`, `useMovmentPlus.js`, etc.

### `src/utils`
- **Purpose:** Pure functions and data transformers.
- **Contents:** `vendorDataTransform.js` (normalizes complex vendor API responses), `priceFilterUtils.js`, `imageUtils.js`.

### `src/templates`
- **Purpose:** Contains static HTML/CSS/JS template assets likely used as base themes for the Wedding Website builder or E-Invites.

---

## 4. Frontend Architecture Deep Analysis

### Application Flow
The app uses React Router with heavy `React.lazy` implementation for code splitting. The root `App.jsx` checks `localStorage` for both User and Vendor tokens, computing timestamp expiration locally. Based on the URL, one of three main layouts is rendered (`MainLayout`, `MatrimonialLayout`, or `MovmentPlusLayout`), wrapped in a `LoaderProvider` and `ToastProvider`.

### State Management
Redux Toolkit handles critical, cross-component states:
- **Authentication:** `authSlice.js` and `vendorAuthSlice.js` manage JWT tokens and user objects independently. Token expiration is manually tracked via timestamps stored in `localStorage`.
- **E-commerce/Directory:** `wishlistSlice` and `favoritesSlice` track user preferences. `filterSlice` handles complex search states for the vendor directory.

### API Communication
All requests flow through `src/services/api/axiosInstance.js`. 
- **Interceptors:** A request interceptor injects the correct `Bearer` token (checking user first, then vendor). A response interceptor catches `401 Unauthorized` errors, automatically dispatches logout actions, clears local storage, and forcefully redirects the user to the appropriate login page with a `?session=expired` query parameter.
- Two distinct Axios instances are exported: `axiosInstance` for standard backend calls, and `aiAxiosInstance` for the dedicated AI backend.

### Performance Optimization
- **Code Splitting:** Over 60+ routes are wrapped in `React.lazy()` inside `App.jsx`.
- **Infinite Scrolling:** Implemented via `react-infinite-scroll-component` and customized hooks (`useInfiniteScroll.js`) to handle massive vendor lists.

---

## 5. Backend Architecture (Inferred)

### API Architecture
The backend is a multi-service REST architecture. Based on `.env` and `axiosInstance.js`, there are distinct base URLs:
1. Main API: `https://happywedz.com/api`
2. AI Services API: `https://www.happywedz.com/ai/api`
3. Shaadi AI API: `https://shaadiai.happywedz.com/api`

### Database & Resource Models
- **Vendor:** Highly complex entity encompassing capacity, policies (alcohol, DJ), pricing packages, gallery arrays, and SEO meta.
- **User / Matrimonial Profile:** Distinct entities. Matrimonial requires specific matchmaking attributes.
- **Wedding Website:** Users can generate and map templates, storing domain slugs.
- **Movement Plus (Gallery):** Token-based entity linking physical events to uploaded S3 media.

### Security & Authentication
- Stateless JWT authentication.
- Dual-role system. Vendors and Users cannot share the same token or dashboard. 

---

## 6. Authentication & User Flow

The platform maintains a strict separation between Customers and Vendors.

### Customer Flow:
1. User navigates to `/customer-login` or `/customer-register`.
2. Can use Email/Password or Google OAuth.
3. Upon success, API returns JWT and User Object.
4. Frontend `authSlice` saves to Redux and sets `token`, `user`, and a `tokenTimestamp` in `localStorage`.
5. User gains access to `/user-dashboard/*`, E-invite creation, and Wishlists.

### Vendor Flow:
1. Vendor navigates to `/vendor-login` or `/vendor-register`.
2. Registration likely involves a business verification step (claiming a business).
3. API returns a separate Vendor JWT.
4. Frontend `vendorAuthSlice` saves to Redux and sets `vendorToken`, `vendor`, and `vendorTokenExpiry` in `localStorage`.
5. Access granted to `/vendor-dashboard/*` to manage leads, update 360-views, and buy premium packages.

### Expiration Logic:
The frontend defensively evaluates token age on mount (`App.jsx`). Customer tokens are valid for 2 days (`2 * 24 * 60 * 60 * 1000`). Vendor tokens fallback to 1 hour if the JWT payload lacks an `exp` field.

---

## 7. Core Business Logic

### Vendor Discovery & Booking Workflow
Customers filter vendors by type, location, and budget. `useVendors.js` handles data fetching, pushing results through `transformVendorData.js` to normalize the varying API structures. Users can add vendors to their Wishlist or submit a direct lead inquiry. Vendors see these inquiries in their `/vendor-dashboard/total-leads` panel.

### Virtual Design Studio & Beauty AI
Users navigate to `/try/bride` or `/try/makeup`. The system uses `face-api.js` to analyze facial landmarks on an uploaded selfie. Users can overlay makeup, filters, or outfits. The final composition is rendered via HTML5 Canvas/Fabric.js and can be saved or shared.

### Wedding Website Builder
Users select a template (`/choose-template`), fill out a detailed configuration form (`/wedding-form/:templateId`), and the system provisions a public URL (`/wedding/:websiteUrl`). The backend maps the configuration JSON to predefined React/HTML templates.

### Movement Plus (Interactive Gallery)
Event hosts generate a unique Guest Token. Guests visit `/movment-plus/guest-token`, enter the code, and unlock a shared gallery (`/movment-plus/gallery/:token`). Guests can upload selfies directly to the event's live album.

---

## 8. Environment Variables Analysis

```env
VITE_API_BASE_URL=https://www.happywedz.com/ai/api
VITE_API_URL=https://happywedz.com/api
VITE_RAZORPAY_KEY=rzp_test_***
```
- **`VITE_API_URL`**: Core backend operations (auth, vendors, user profiles).
- **`VITE_API_BASE_URL`**: AI infrastructure (Shaadi AI, Beauty tools).
- **`VITE_RAZORPAY_KEY`**: Client-side initialization for payment capture (Vendor premium upgrades, possible customer bookings).

*Note: All secrets are appropriately prefixed with `VITE_` allowing Vite to bundle them. The Razorpay key is currently a test key (`rzp_test_`).*

---

## 9. Dependencies Deep Analysis

### Critical Runtime Libraries:
- **`@mui/material` & `@mui/x-date-pickers`**: Used heavily for robust admin and user dashboards.
- **`fabric`**: Essential for the E-invite card editor and virtual try-on manipulations.
- **`face-api.js`**: Core driver of the AI makeup and selfie analysis features.
- **`react-redux` & `@reduxjs/toolkit`**: Backbone of complex local state.
- **`axios`**: Centralized networking.

### Heavy/Potential Bloat:
- **UI Framework Mixing:** The app imports `bootstrap`, `react-bootstrap`, `reactstrap`, `Material-UI`, AND raw CSS. This drastically increases bundle size and introduces CSS specificity conflicts.
- **Carousel Overload:** `react-slick`, `swiper`, and `react-owl-carousel` are all installed. Standardizing on one (e.g., Swiper) would greatly improve performance.
- **Animation Overload:** `framer-motion` and `react-animated-css`.

---

## 10. Development Workflow

- **Local Server:** Run via `npm run dev` (Vite).
- **Vite Proxy:** Configured in `vite.config.js` to proxy `/api` requests to `https://happywedz.com` to bypass CORS during local development.
- **Linting:** ESLint configured via `eslint.config.js` for React hooks and globals.
- **Deployment:** Standard `npm run build` outputs a static bundle. The presence of `dist.zip` indicates manual uploads or a CI/CD pipeline that zips artifacts.

---

## 11. Current Issues & Technical Debt

1. **CSS Framework Collision:** Mixing Bootstrap, MUI, and global CSS modules causes unpredictable UI bugs and bloats the DOM.
   - *Fix:* Deprecate Bootstrap gradually in favor of MUI or pure Tailwind/CSS Modules.
2. **Token Management:** Manually tracking expiration timestamps in `localStorage` alongside JWTs is an anti-pattern.
   - *Fix:* Rely on decoding the JWT payload for expiration or handle refresh tokens strictly via HttpOnly cookies.
3. **Redundant Libraries:** Multiple libraries doing the same thing (Carousels, Data fetching, Styling).
   - *Fix:* Audit `package.json` and prune unused or redundant packages.
4. **Massive Component Files:** Files like `WeddingWebsiteForm.jsx` and `Header.jsx` (nearly 100KB) are dangerously large.
   - *Fix:* Abstract form steps into smaller micro-components.

---

## 12. Scalability Analysis

### Frontend Scalability
- **Pros:** Vite and `React.lazy()` ensure the initial payload remains small despite the massive feature set.
- **Cons:** Redux is tracking too much granular data that might be better suited for a server-cache tool like React Query (TanStack Query), which would eliminate manual loading/error states in Redux slices.

### Infrastructure Limitations
- Serving high-resolution vendor images, user selfies, and 360-degree panoramas (`pannellum` dependency) requires aggressive CDN caching. The hardcoded AWS S3 bucket/backend image URLs in `constants.js` need rigorous optimization (WebP formats, lazy loading).

---

## 13. AI Understanding Section (For AI Agents)

**To AI Agents parsing this repo:**
- **Entry Point:** `src/main.jsx` and `src/App.jsx`. All routing logic and layout definitions live here.
- **API Flow:** Never use native `fetch`. ALWAYS import `axiosInstance` or `aiAxiosInstance` from `src/services/api/axiosInstance.js`.
- **State Flow:** Use Redux Toolkit hooks (`useDispatch`, `useSelector`). If updating Auth state, ensure `localStorage` is updated synchronously as defined in `authSlice.js`.
- **Vendor Data:** Vendor payloads are highly erratic. If writing components that consume Vendor data, ALWAYS pass the raw API response through `transformVendorData` in `src/utils/vendorDataTransform.js` to prevent undefined reference crashes.

---

## 14. Developer Onboarding Guide

1. **Setup:** Run `npm install`, ensure the `.env` file contains the correct API URLs. Run `npm run dev`.
2. **Routing:** If creating a new user-facing page, add the route inside `<Route element={<MainLayout />}>` in `App.jsx`. Make sure to `lazy()` load the component.
3. **Protection:** Use `<UserPrivateRoute>` or `<VendorPrivateRoute>` wrappers for sensitive routes.
4. **Styling:** Prefer CSS Modules (`Component.module.css`) to prevent global style leaks. Do not add raw Bootstrap classes unless maintaining legacy components.
5. **API Calls:** Use the pre-built hook abstractions in `src/hooks/` (e.g., `useVendors()`) rather than writing raw Axios calls in components.

---

## 15. Future Recommendations

- **Refactoring:** Migrate from Redux Thunks for data fetching to **React Query**. This will eliminate thousands of lines of boilerplate code and handle API caching natively.
- **Performance:** Standardize the Image strategy. Build a global `<OptimizedImage />` component that appends CDN parameters for resizing, as image weight is currently the biggest threat to this platform's UX.
- **Architecture:** Consolidate the E-invite, Video Editor, and Wedding Website builder into a unified "Studio" module to share generic canvas/fabric.js logic.

---

## 16. Executive Summary

HappyWedz is a highly ambitious, feature-rich React application that pushes the boundaries of a standard directory by incorporating complex Canvas editors, facial recognition AI, and comprehensive dual-role dashboards. The architecture relies heavily on Vite for performance, Redux for state, and a robust routing hierarchy. While highly functional, the primary challenge moving forward is managing technical debt—specifically pruning overlapping third-party libraries and standardizing the UI framework. For new development, strict adherence to the existing Axios interceptor patterns, Vendor Data transformers, and lazy-loading boundaries is critical for maintaining stability.
