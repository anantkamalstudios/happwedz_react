# PROJECT_CONTEXT.md

Generated for repository: `happwedz_react`

Last analyzed: 2026-05-13

Important scope note: this repository is a Vite/React frontend application. It does not contain the backend server, database schema, migrations, controllers, models, or deployment infrastructure. Backend and database sections below are therefore split into:

- **Code-confirmed**: behavior directly visible in this frontend repository.
- **Inferred**: backend/database shape inferred from frontend API calls, response transformations, route names, and business workflows.
- **Not present**: items that cannot be verified from this repository.

---

# 1. Project Overview

## What This Project Is

`happwedz_react` is the frontend web application for **HappyWedz**, a multi-domain wedding platform. It combines:

- Wedding vendor marketplace.
- Venue/vendor discovery.
- User wedding planning dashboard.
- Vendor/admin dashboard.
- E-invite and wedding website creation.
- AI wedding assistant/chat.
- AI beauty/design studio flows.
- Movement/Movments+ smart photo sharing.
- Matrimonial discovery and dashboard.
- Honeymoon/travel search and booking flows.
- Blog, real weddings, destination wedding content, policies, and static marketing pages.

The codebase is a large React single-page application using client-side routing and remote production APIs hosted under `happywedz.com`, `www.happywedz.com/ai/api`, and `shaadiai.happywedz.com`.

## Main Business Domain

The business domain is wedding planning and wedding commerce. The platform tries to sit across the full lifecycle:

1. A couple discovers vendors, venues, inspiration, and destination wedding ideas.
2. A user registers/logs in to save vendors, manage budget, checklist, guests, messages, bookings, wedding website, e-invites, and real wedding submissions.
3. Vendors register/log in to manage storefronts, enquiries, reviews, messages, leads, and Movments+.
4. The platform monetizes through vendor visibility, premium vendor plans, leads, bookings, travel/payment flows, and possibly subscription/plan features.
5. AI modules assist with wedding recommendations, makeup/outfit try-on, face recognition/photo discovery, and chat guidance.

## Primary Users

| User Type | Purpose In System | Main UI Areas |
|---|---|---|
| Anonymous visitor | Browse vendors, venues, blogs, destination content, e-invites, travel pages, public wedding pages. | `MainLayout`, listing pages, home, blogs, public wedding/einvite views |
| Customer/user/couple | Wedding planning, checklist, budget, guests, wishlist, messages, bookings, real wedding form, wedding websites, e-invites, design studio. | `UserDashboardMain`, protected routes, e-invite editor, try-on pages |
| Vendor | Vendor registration/login, storefront management, enquiries, messages, reviews, leads, settings, Movments+. | `VendorPrivateRoute`, `adminVendor/*`, vendor dashboard navbar |
| Matrimonial user | Browse/search matrimonial profiles and dashboard sections. | `MatrimonialLayout`, `components/pages/matrimonial/*` |
| Admin-like vendor operator | Manage vendor service data, galleries, policies, pricing, menus, reviews, promotion, availability, business details. | `adminVendor/subVendors/*` |
| Public wedding website visitor | View published wedding website by public URL. | `/wedding/:websiteUrl`, templates |

## Main Problem It Solves

HappyWedz is attempting to consolidate wedding planning workflows that are often fragmented across vendor discovery sites, spreadsheets, WhatsApp, invitation tools, travel portals, photo sharing tools, and wedding website builders. The frontend provides one integrated entry point for discovery, planning, communication, personalization, and vendor operations.

## Platform Classification

| Classification | Applies? | Evidence |
|---|---:|---|
| Marketplace | Yes | Vendor/venue listing, filters, detail pages, wishlist, enquiries, leads |
| SaaS | Partially | Vendor dashboard/storefront tooling and user planning dashboard behave like SaaS modules |
| Booking platform | Partially | Flights, hotels, bookings, vendor booking UI |
| CRM | Partially | Vendor enquiries, messages, leads, reviews, settings |
| Ecommerce/Fintech | Partially | Razorpay flight payment order and verification flow |
| AI system | Partially | AI chat, AI design studio, face recognition models, beauty API |
| Social/content platform | Partially | Real weddings, blogs, testimonials, reviews |
| ERP/internal tool | No clear evidence | No internal back-office app in this repo |

## Overall Workflow Summary

High-level flow:

1. App starts in `src/main.jsx`, mounts React under `BrowserRouter`, Redux `Provider`, MUI theme, Google OAuth provider, and loader context.
2. `src/App.jsx` restores user/vendor sessions from `localStorage`, configures route groups, and renders nested layouts.
3. Public users browse home, listings, blogs, destination weddings, e-invites, travel, and public wedding websites.
4. Authenticated customers access protected planning tools and creation flows.
5. Authenticated vendors access a protected dashboard with storefront, enquiries, messages, reviews, leads, settings, and Movments+.
6. Feature modules call remote REST APIs using a mixture of shared `axiosInstance`, standalone Axios clients, and raw `fetch`.
7. Global state is stored in Redux slices and local browser storage; feature-level state is mostly local React state/hooks.

---

# 2. Tech Stack

## Frontend

| Category | Technology | Why It Is Used |
|---|---|---|
| App framework | React 19 | SPA UI, component model, hooks, concurrent-ready rendering |
| Build tool | Vite 7 | Fast dev server and production bundling |
| Routing | `react-router-dom` 7 | Nested route groups, protected routes, dashboard slugs |
| State management | Redux Toolkit, React Redux | Auth state, vendor auth, location, filters, wishlist, favorites, guest token |
| Local state | React hooks | Component forms, modals, dashboards, editor states |
| Styling | CSS files, Bootstrap, React Bootstrap, MUI, inline styles | Mixed styling strategy across old and new modules |
| UI library | MUI, Bootstrap, Reactstrap | Inputs, date pickers, layout, modals, dashboards |
| Icons | React Icons, FontAwesome, Lucide, MUI icons | Broad icon usage across modules |
| Forms | React Hook Form is installed; many forms are manual state-driven forms | Manual validation dominates current code |
| Date handling | Day.js, date-fns, MUI date pickers, react-datepicker | Wedding dates, bookings, dashboards |
| Charts | Chart.js, react-chartjs-2, Recharts | Dashboard analytics, budget/metrics |
| Rich text | Summernote, jQuery, React Quill New, DOMPurify | Content editing and sanitized HTML display |
| Media/editor | Fabric.js, Pannellum, React Compare Image/Slider | E-invite/card/video editors, 360 views, image comparison |
| Animation | Framer Motion, Swiper, Slick, Owl Carousel, tsparticles | Home/landing UI effects, sliders, interactive presentation |
| PDF/export | `@react-pdf/renderer`, `xlsx` | Checklist/guest PDFs and spreadsheet-like exports/imports |
| AI/vision | `face-api.js` with models under `public/models` | Face recognition/photo sharing and selfie workflows |
| OAuth | `@react-oauth/google`, Firebase Auth config | Google login capability; Firebase config present |
| Notifications | React Toastify, SweetAlert2 | Toasts and modal alerts |

## Backend

Backend runtime/framework are **not present in this repository**.

Code-confirmed frontend API architecture:

- REST-style HTTP APIs.
- Base APIs:
  - `https://happywedz.com/api`
  - `https://www.happywedz.com/ai/api`
  - `https://shaadiai.happywedz.com/api`
  - Some image URLs use `https://happywedzbackend.happywedz.com`.
- Authentication uses bearer tokens stored in `localStorage`.
- Some calls also use `withCredentials: true`, implying cookie/session support or CSRF-sensitive backend behavior.
- File uploads use `multipart/form-data`.

Inferred backend architecture:

- Likely Node/Express or similar REST backend based on endpoint naming, but not verifiable.
- Likely has modules for user auth, vendor auth, vendor services, e-invites, wedding websites, budgets, messages, flight booking/payment, hotels, gallery/photo sharing, CMS, claims, photography, and AI services.

## Database

Database technology is **not present in this repository**.

Inferred entities from frontend API contracts:

- Users.
- Vendors.
- Vendor types.
- Vendor subcategories.
- Vendor services/storefronts.
- Vendor service media.
- Wishlist entries.
- Budgets.
- Checklist tasks.
- Guest list entries/groups.
- Messages/conversations.
- Reviews.
- Enquiries/leads.
- E-invite cards/templates/instances.
- Wedding websites.
- Business claims.
- Flight bookings/payments.
- Hotels/hotel content.
- Gallery/photo collections/tokens.
- Matrimonial profiles/interests/matches/messages.

## DevOps

DevOps configuration is minimal in this repo.

| Area | Status |
|---|---|
| Build | `vite build` via npm script |
| Dev server | `vite` via npm script |
| Preview | `vite preview` |
| CI/CD | Not present |
| Docker | Not present |
| Reverse proxy | Not present |
| CDN | Not configured in repo; public assets are bundled/copied by Vite |
| Monitoring | Not present |
| Hosting | Not specified |

## Third-party Integrations

| Integration | Evidence | Purpose |
|---|---|---|
| Google OAuth | `main.jsx`, `@react-oauth/google`, `userApi.googleAuth` | Customer authentication |
| Firebase | `src/firebase.js` | Firebase Auth/Analytics config; usage not broadly wired in visible routing |
| Razorpay | `VITE_RAZORPAY_KEY`, flight payment UI/API | Flight booking payment |
| Hotel content APIs | `hotelApi.js` | Hotel countries, destinations, search, images |
| Flight booking APIs | `flightApi.js` | Airport search, flight search, verify, book, payment |
| HappyWedz AI API | `beautyApi.js`, `axiosInstance.js` | Makeup/outfit/design studio AI image workflows |
| Shaadi AI API | `HomeGennie.jsx`, `axiosInstance.js` | Chat/wedding assistant |
| Google Recaptcha | dependency installed | Captcha token fields in auth payloads; actual component usage needs further cleanup |
| Maps/geo | Leaflet, React Leaflet | Map views for vendors/venues |
| Face API | `face-api.js`, `public/models` | Face matching/photo discovery |

---

# 3. Complete Folder Structure Analysis

## Root Files

| Path | Purpose |
|---|---|
| `package.json` | Dependencies and scripts. Scripts: `dev`, `build`, `lint`, `preview`. |
| `package-lock.json` | Locked dependency graph. Currently modified in git before this documentation task. |
| `vite.config.js` | Vite config with React plugin and dev proxy `/api -> https://happywedz.com`. |
| `eslint.config.js` | ESLint flat config for JS/JSX, React hooks, React refresh. Current lint fails heavily. |
| `tsconfig.json` | TypeScript-style config with `allowJs: true`; project is JS/JSX but configured for TS checks if adopted. |
| `.env` | Frontend env values for API URLs and Razorpay key. Should not store environment-specific production/test values directly. |
| `index.html` | Vite HTML entry. Also contains significant metadata/HTML content. |
| `sample.json` | Sample data file; not central to app boot. |
| `README.md` | Mostly default Vite README plus a rough e-invite editor sketch. |

## `public/`

Static assets served directly by Vite.

Important contents:

- Brand images/logos.
- Favicons and web manifest.
- Home/category/venue/vendor/travel/design studio images.
- E-invite assets.
- Dashboard icons.
- `models/` face-api model manifests and shards.
- Trust PDFs/images.
- Large assets, including a ~12.8 MB login image.

Responsibilities:

- Browser-accessible static files referenced by `/images/...`, `/models/...`, and other absolute paths.
- Assets here are not tree-shaken; anything deployed in `public` is copied as static output.

## `src/`

Main application source.

### `src/main.jsx`

Application root:

- Imports global CSS and Bootstrap.
- Creates React root.
- Wraps app with:
  - `StrictMode`
  - MUI `ThemeProvider`
  - `GoogleOAuthProvider`
  - `LoaderProvider`
  - Redux `Provider`
  - `BrowserRouter`
  - `App`

Issue: `LoaderProvider` is also mounted inside `App.jsx`, creating nested loader contexts.

### `src/App.jsx`

Main application shell and route registry:

- Restores customer token/user from `localStorage`.
- Expires customer tokens after 2 days using `tokenTimestamp`.
- Restores vendor token/vendor from `localStorage`, using vendor auth slice expiry logic.
- Defines all route groups:
  - Public template/wedding website routes.
  - `MainLayout` public marketplace/content routes.
  - `MatrimonialLayout` routes.
  - `MovmentPlusLayout` routes.
- Uses React lazy loading for many pages but still statically imports some route modules.
- Adds toast container and app-level providers.

### `src/assets/`

Bundled assets imported from source code:

- Fonts under `src/assets/fonts`.
- Dashboard icons.
- Travel city images.
- React/Vite sample assets.
- Hero images.

Assets imported from `src` become part of the build graph and can increase bundle processing memory.

### `src/components/`

Primary UI and feature component tree.

#### `src/components/auth`

Customer/vendor authentication pages:

- `CustomerLogin.jsx`
- `CustomerRegister.jsx`
- `ForgotPassword.jsx`
- `VendorLogin.jsx`
- `VendorRegister.jsx`
- `VendorForgotPassword.jsx`

Responsibilities:

- Collect credentials.
- Call user/vendor APIs or hooks.
- Store tokens/user/vendor into Redux/localStorage.
- Navigate to dashboard routes.

Current concerns:

- Manual validation.
- Undefined loader call in `CustomerRegister`.
- Unused imports and duplicated validation regexes.
- Token storage in `localStorage`.

#### `src/components/common`

Shared feature widgets:

- `HomeGennie.jsx`: floating AI chat assistant for main layout.

Responsibilities:

- Opens chat if user token exists.
- Calls Shaadi AI chat endpoint.
- Stores session ID.
- Displays quick actions and chat messages.

Current concern:

- `handleNewChat` is declared outside the component but uses component setters, causing runtime failure.

#### `src/components/context`

Feature/provider context:

- `LoaderContext.jsx`: exposes `showLoader` and `hideLoader`, renders global `Loader`.

Current concern:

- File exports both hook and component, triggering React refresh lint rule.
- Provider is mounted twice.

#### `src/components/home`

Home page sections:

- Hero, categories, featured vendors, venue slider, real weddings, testimonials, newsletter, planning CTA, popular searches, blogs, statistics, recommended page.

Responsibilities:

- Public marketing/discovery homepage.
- Calls CMS/home hooks and renders static/public API data.

#### `src/components/layouts`

Large layout and domain-specific UI layer:

- `MainLayout.jsx`: wraps public marketplace pages with `Header`, `Footer`, provider contexts, and floating `HomeGennie`.
- `Header.jsx` and `Footer.jsx`: global navigation, category links, city selection, e-invite/category menus.
- `Detailed.jsx`: vendor/service detail page.
- `UserDashboardNavbar.jsx`: user dashboard tab navigation.
- `MovmentPlusLayout.jsx`, `MovmentPlusHeader.jsx`: Movments+ pages.
- `MatrimonialLayout.jsx`: matrimonial wrapper.
- `PricingModal.jsx`, `SimilarServices.jsx`, `SectionTabs.jsx`, etc.

Subfolders:

- `aside/`: filter sidebars for venues/vendors/photography/bride/groom and top filter UI.
- `Main/`: generic listing grid/list/map/search/cards for vendor services.
- `vendors/`: vendor listing-specific cards/search/map/filter/layout.
- `venus/`: venue-specific listing UI; spelling appears to mean "venues".
- `photography/`, `twoSoul/`: specialty listing/gallery sliders.
- `realWedding/`: real wedding detail/list UI.
- `eInvite/`: older e-invite editor/video/card layout components.
- `einvites/`: newer e-invite grid/editor/share/my-cards modules.
- `toasts/`: toast provider.

#### `src/components/movment-plus`

Standalone Movments+ marketing/photo-sharing components:

- Smart photo sharing.
- Event creation tabs.
- Guest token page.
- Gallery.
- Brands.

#### `src/components/pages`

Top-level route pages and feature domains.

Top-level pages include:

- Home, blog, blog details, contact, policy pages.
- Main listing pages: `MainSection`, `SubSection`, `PhotographyDetails`, `Vendor360View`.
- E-invite pages: home/category/editor/share/view.
- Wedding website pages: choose template, preview, customize, form, public view, my websites.
- Destination wedding pages.
- Travel pages.
- Design studio pages.
- Matrimonial pages.
- User dashboard.
- Vendor dashboard/admin.
- Movments+ pages.

Feature folders:

- `adminVendor/`: vendor dashboard and storefront management.
- `userDashboard/`: customer planning dashboard.
- `designStudio/`: AI makeup/outfit try-on flows.
- `matrimonial/`: matrimonial home/search/register/dashboard.
- `Travels/`: honeymoon/travel flights/hotels/city details.
- `movments-plus/`: protected/public Movments+ pages.

#### `src/components/routes`

Route guards:

- `UserPrivateRoute.jsx`: requires `state.auth.user` and `state.auth.isAuthenticated`; redirects to `/customer-login`.
- `VendorPrivateRoute.jsx`: requires `state.vendorAuth.vendor`; redirects to `/vendor-login`.
- `ProtectedRoute.jsx`: combined user/vendor guard but currently not used in `App.jsx`.

#### `src/components/ui`

Reusable UI primitives:

- Loader, shimmer loaders, input, label, checkbox, separator, error state, empty state, email/success modals, 360 image modal, user preference/cookie component, Summernote editor.

### `src/config`

- `constants.js`: hardcoded `API_BASE_URL` and `IMAGE_BASE_URL`.
- `airports.json`: static airport/destination support data.

### `src/context`

Separate from `components/context`.

- `useContext.jsx`: provider for photography/vendor type data used by layouts.
- `realWedding.context.jsx`: filter/provider state for real wedding or listing workflows.

Current concern:

- Context files export non-component hooks/providers in a way that triggers React refresh lint warnings.

### `src/data`

Static content/config arrays:

- Home categories, blogs, hero data.
- City and region lists/images.
- Destination wedding data.
- Venue/subvenue/subvendor data.
- FAQ/factors/aside/filter configuration.
- `filtersConfig.js` is large and central to listing filter behavior.

Responsibility:

- Seed UI with static content and fallback configuration where APIs are absent or incomplete.

### `src/hooks`

Reusable domain/data hooks:

| Hook | Responsibility |
|---|---|
| `useUser` | Customer login/logout with Redux auth slice |
| `useVendorAuth` | Vendor register/login/logout using hardcoded vendor API |
| `useVendors` / `useVendor` | Vendor list/detail CRUD wrappers |
| `useApiData` | Paginated vendor-service listing fetch, filters, transform, local cache |
| `useInfiniteScroll` | Infinite-scroll vendor-service listing fetch, filters, transform, local cache |
| `useBudget` | User budget categories, CRUD, totals |
| `useClaimForm` | Business claim form state, validation, file collection, submit |
| `useFilters` | Filter API/config loading |
| `useRegions` | Region/city data loading |
| `usePhotography` | Photography API data |
| `useMovmentPlus` | Movments+ state/API wrapper |
| `useFaq` | FAQ fetch |
| `useContact` | Contact form submission, currently broken return object |
| `useHome` | Home page CMS/API data |
| `useVendorType` | Vendor type data |

### `src/redux`

Redux Toolkit store and slices:

| Slice | State |
|---|---|
| `authSlice.js` | Customer user/token/isAuthenticated, login/logout, wishlist toggle thunk |
| `vendorAuthSlice.js` | Vendor/token with token expiry support |
| `locationSlice.js` | Selected city/location persisted to localStorage |
| `wishlistSlice.js` | Async wishlist operations |
| `favoriteSlice.js` | Local favorites persisted to localStorage |
| `filterSlice.js` | Active/applied filters by section key |
| `roleSlice.js` | Role/type selection for design studio flows |
| `guestToken.js` | Movments+ guest token |
| `store.js` | Combines reducers |

### `src/services/api`

Remote API abstraction layer. It is not fully centralized; some files use `axiosInstance`, some use raw Axios, and some use raw `fetch`.

Key files:

- `axiosInstance.js`: shared customer/vendor token injection and 401 redirect handling.
- `userApi.js`: user register/login/google auth.
- `vendorAuthApi.js`: vendor auth and vendor CRUD.
- `vendorServicesApi.js`: vendor service CRUD and service lookup.
- `weddingWebsiteApi.js`: wedding website CRUD/publish/public view.
- `einviteApi.js`: e-invite cards/templates/instances.
- `beautyApi.js`: AI image/products/makeup API.
- `flightApi.js`: flight search/book/payment.
- `hotelApi.js`: hotel content/search.
- `messagesApi.js`: user messaging.
- `vendorMessagesApi.js`: vendor messaging.
- `movmentPlusApi.js`: gallery token/upload.
- `cmsApi.js`: CMS banner/content endpoints.
- `claimFormApi.js`: business claim endpoints.
- `photographyApi.js`: photography listing endpoints.

### `src/templates`

Wedding website templates and template components:

- `floral`, `modern`, `royal` template entry/style files.
- Common template components: headers, navbars, hero variants, countdown, couple, story, gallery, people, RSVP, gift, location, footer, comments, mobile menus.
- Template images and CSS.

Responsibility:

- Render configurable/published wedding website pages and previews.

### `src/theme`

- `muiTheme.js`: central MUI typography override using CSS variable `--rubik-font`.

### `src/utils`

Shared helpers:

- `imageUtils.js`: image URL and image fallback handling.
- `apiHelpers.js`: authenticated fetch wrapper.
- `priceFilterUtils.js`: parse/extract price, capacity, room, rating, review, venue subcategory filters.
- `vendorDataTransform.js`: normalize vendor API data into UI-friendly shape.

## Architectural Patterns Used

Actual patterns:

- Single-page application with nested route layouts.
- Feature-folder grouping under `components/pages` and `components/layouts`.
- Redux for coarse global state.
- Hooks for feature-level data fetching and transformation.
- Service modules for remote APIs, but inconsistently applied.
- LocalStorage as persistence layer for auth, preferences, drafts, vendor completion, favorites, guest tokens.
- Lazy route components for partial code splitting.

Mixed/weak areas:

- No strict separation between page, container, presentational component, service, and domain model.
- API base URLs are duplicated.
- Several modules mix UI, validation, network calls, state transforms, and storage side effects.
- Naming is inconsistent: `venus` vs venues, `movment`/`movments`, `Groome`, `buisness`, `recommandation`.

---

# 4. Frontend Architecture Deep Analysis

## Application Flow

### Initialization

1. Browser loads `index.html`.
2. Vite loads `src/main.jsx`.
3. React root is created with `createRoot(document.getElementById("root"))`.
4. Global wrappers are applied:
   - `StrictMode`
   - MUI theme
   - Google OAuth provider
   - Loader provider
   - Redux provider
   - Browser router
5. `App` mounts.
6. `App` reads user/vendor sessions from `localStorage`.
7. Redux auth slices are populated if stored session data is valid.
8. Routes render through layout groups.

### Routing Flow

Primary route groups:

| Group | Layout | Purpose |
|---|---|---|
| Top-level wedding website routes | No main layout | Template preview/customize/form/view/public wedding pages |
| Main public routes | `MainLayout` | Marketplace, content, auth, e-invite, user/vendor dashboard, travel |
| Matrimonial routes | `MatrimonialLayout` | Matrimonial home/search/register/dashboard |
| Movments+ routes | `MovmentPlusLayout` | Photo-sharing guest/selfie/gallery flows |

Important route behavior:

- `/user-dashboard` defaults to `my-wedding`.
- `/user-dashboard/:slug` switches dashboard sections inside `UserDashboardMain`.
- `/vendor-dashboard` redirects to `/vendor-dashboard/vendor-home`.
- `/vendor-dashboard/:slug` switches vendor dashboard sections inside `adminVendor/Main.jsx`.
- `/vendor-dashboard/upgrade/vendor-plan` is declared after `/vendor-dashboard/:slug`; with React Router ranking it should still match specifically, but route ordering should be reviewed.
- `path="*"` is declared before `/travels` and `/travels/:cityName` inside `MainLayout`. React Router ranking usually handles specificity, but keeping wildcard last is cleaner.

### Layout System

`MainLayout`:

- Provides `MyProvider` and `FilterProvider`.
- Renders `Header`, `Outlet`, floating `HomeGennie`, and `Footer`.
- Hides `HomeGennie` when `params.section === "shaadi-ai"`.

`UserDashboardMain`:

- Renders `UserDashboardNavbar`.
- Switches content by URL slug.
- Receives `user` and `token` from Redux and passes to children.

`adminVendor/Main.jsx`:

- Renders vendor navbar.
- Switches vendor dashboard content by URL slug.
- Stores storefront completion in local state/localStorage.

`MatrimonialLayout` and `MovmentPlusLayout`:

- Provide specialized navigation/frame for their domains.

## State Management

### Global State

Redux is used for:

- Customer auth.
- Vendor auth.
- Location.
- Wishlist.
- Role/type selection.
- Favorites.
- Listing filters.
- Movments+ guest token.

Store path: `src/redux/store.js`

### LocalStorage State

LocalStorage is heavily used:

- Customer `user`, `token`, `tokenTimestamp`.
- Vendor `vendor`, `vendorToken`, `vendorTokenExpiry`.
- Location.
- Favorites.
- Guest token.
- E-invite drafts.
- Video/card project data.
- Vendor storefront completion and service IDs.
- Cookie consent.
- Design studio `userInfo`.
- Wedding form drafts.

Risk: localStorage creates broad XSS exposure for bearer tokens and sensitive workflow state.

### API Caching

There is no global query cache like React Query.

Local caches exist in:

- `useApiData`: `cacheRef` map keyed by generated vendor-service URL.
- `useInfiniteScroll`: `cacheRef` plus loaded page tracking.

No automatic stale invalidation, background refresh, deduplication across components, or persistence.

### Context Providers

- `LoaderContext`: global loading overlay state.
- `MyProvider`: likely shared photography/vendor type context.
- `FilterProvider`: filter state for real wedding/listing contexts.

## Component Architecture

Actual architecture is page-heavy:

- Many files are large route/page components with internal state, validation, network calls, and rendering.
- Reusable UI components exist but are not consistently used.
- Domain layout components (`layouts/Main`, `layouts/vendors`, `layouts/venus`) duplicate listing/card/map concerns.
- Dashboards use slug-switching rather than nested route modules.

Smart/dumb separation:

- Not consistently applied.
- Components such as `Storefront.jsx`, `FiltersPage.jsx`, `OutfitFilterPage.jsx`, `Guests.jsx`, `RealWeddingForm.jsx`, `HeroPage.jsx`, `Activity.jsx`, and `VenueMasterProfile.jsx` are large smart components.

## Forms System

Form handling patterns:

- Mostly manual `useState`.
- Manual validation functions and regexes.
- Some `react-hook-form` dependency exists but usage is not central.
- File uploads use `FormData`.
- Errors are shown with `toast`, inline `errors` state, or SweetAlert.

Examples:

- Customer/vendor register forms validate names, email, password, phone, event/wedding data.
- Claim form validates email, text, phone, files, and declaration.
- Budget form performs CRUD and derived totals.
- Wedding website form likely posts multipart form data.
- Real wedding form is a large multi-section user-generated content workflow.

## Authentication Flow

### Customer Auth

Code paths:

- UI pages: `CustomerLogin.jsx`, `CustomerRegister.jsx`
- Hook/API: `useUser.js`, `userApi.js`
- Redux: `authSlice.js`
- Guard: `UserPrivateRoute.jsx`
- Axios: `axiosInstance.js`

Flow:

1. User submits login/register.
2. Request goes to `/user/login`, `/user/register`, or `/user/google-auth`.
3. On success, user and token are stored in Redux and localStorage.
4. `tokenTimestamp` is stored.
5. `App.jsx` restores session on reload.
6. `App.jsx` expires customer token after 2 days.
7. `UserPrivateRoute` checks `user && isAuthenticated`.
8. `axiosInstance` injects `Authorization: Bearer <token>`.
9. On 401, interceptor logs out and redirects to `/customer-login?session=expired`.

### Vendor Auth

Code paths:

- UI pages: `VendorLogin.jsx`, `VendorRegister.jsx`
- Hook/API: `useVendorAuth.js`, `vendorAuthApi.js`
- Redux: `vendorAuthSlice.js`
- Guard: `VendorPrivateRoute.jsx`

Flow:

1. Vendor submits login/register.
2. Request goes to `/vendor/login` or `/vendor/register`.
3. Vendor and token are stored in Redux/localStorage.
4. `vendorAuthSlice` decodes JWT `exp` if present; otherwise defaults to 1 hour.
5. `vendorTokenExpiry` is stored.
6. `App.jsx` restores vendor session.
7. `VendorPrivateRoute` checks `vendor`.
8. `axiosInstance` injects vendor token only if no customer token exists.
9. On expired vendor token, interceptor dispatches `vendorLogout` and redirects to `/vendor-login?session=expired`.

### OAuth

- Google OAuth provider is configured in `main.jsx`.
- `userApi.googleAuth` posts to `/user/google-auth`.
- Firebase auth config also exists, but broad usage was not confirmed in the inspected code.

## API Communication

### Shared Axios Instance

Path: `src/services/api/axiosInstance.js`

Features:

- Base URL from `VITE_API_URL`, fallback `https://happywedz.com/api`.
- AI base from `VITE_API_BASE_URL`.
- `withCredentials: true`.
- Request interceptor:
  - Adds customer token if present.
  - Else adds vendor token if present and not expired.
- Response interceptor:
  - Handles 401.
  - Redirects to login pages.

Issues:

- `config.withCredentials = true` is duplicated.
- Response interceptors are registered multiple times on `axiosInstance`.
- Global `axios.interceptors.response` is also modified, which can affect standalone Axios calls.
- `SHADI_AI_API_BASE_URL` is declared but not exported/used.

### Raw Fetch/Axios APIs

Several services bypass shared interceptors:

- `einviteApi.js`
- `vendorServicesApi.js`
- `claimFormApi.js`
- `photographyApi.js`
- `useBudget.js`
- `useApiData.js`
- `useInfiniteScroll.js`
- `useVendorAuth.js`
- `flightApi.js` uses `axiosInstance` but also hardcodes full production base URL.

Impact:

- Inconsistent auth behavior.
- Inconsistent 401 handling.
- Harder staging/local testing.
- More duplicated error handling.

## Performance Optimization

Implemented:

- `React.lazy` and `Suspense` for many routes.
- Local request caching in listing hooks.
- AbortController and timeouts in listing hooks.
- Infinite scroll for listing pages.
- Some `useMemo` and `useCallback`.

Problems:

- Default production build runs out of Node heap.
- Large chunks after successful high-memory build.
- Some static imports defeat lazy chunks.
- Very large public and bundled assets.
- Many heavy dependencies are globally installed.
- No route-level bundle strategy/manual chunks.

## Frontend Security

Implemented:

- DOMPurify is used for some `dangerouslySetInnerHTML` rendering in blog/detail/real wedding/list view.
- Protected routes guard user/vendor dashboard sections.
- 401 interceptor logs out and redirects.

Risks:

- Tokens stored in `localStorage`.
- Firebase config, Google client ID, Razorpay test key, API URLs are committed in frontend code/env. Public client IDs are not secret by themselves, but environment management is weak.
- Some direct `innerHTML` usage exists in `TryLanding.jsx` image error fallback.
- Broad localStorage usage for draft/vendor/customer data increases impact of XSS.
- No visible CSRF token strategy despite `withCredentials: true`.
- No client-side central sanitization for all rich content.

---

# 5. Backend Architecture Deep Analysis

## Code-Confirmed Backend Presence

No backend code is present in this repository.

Not present:

- Server entry point.
- Controllers.
- Backend routes.
- Middleware.
- Models.
- ORM/ODM.
- Database migrations.
- Queue workers.
- Cron jobs.
- Socket server.
- Docker/infra.

## Inferred API Architecture

The frontend talks to REST endpoints. Naming suggests resource-oriented backend modules:

- `/user/*`
- `/vendor/*`
- `/vendor-services/*`
- `/vendor-types/*`
- `/photography-*`
- `/einvites/*`
- `/weddingwebsite/*`
- `/messages/user/*`
- `/messages/vendor/*`
- `/budgets/*`
- `/Flight_booking/*`
- `/flight_payment/*`
- `/hotels/*`
- `/hotelcontent/*`
- `/gallery/*`
- `/business/claims`
- `/faq`
- `/inbox`
- CMS endpoints like `/design-studio-banner`, `/login-cms`

## Request Lifecycle Inferred

For protected endpoints:

1. Frontend sends `Authorization: Bearer <token>`.
2. Backend authenticates user or vendor.
3. Backend returns JSON response with either:
   - `success`, `data`, `message`, `pagination`
   - raw arrays
   - specific entity payloads
4. On 401, frontend redirects user/vendor to relevant login.

For multipart endpoints:

1. Frontend constructs `FormData`.
2. Sends `Content-Type: multipart/form-data`.
3. Backend stores files and returns entity data.

## Middleware System

Not present. Inferred backend likely has:

- JWT auth middleware for customer/vendor routes.
- Multipart upload middleware for vendor services, wedding websites, claims, galleries.
- CORS configured for frontend.
- Payment verification middleware/logic for Razorpay.

## Realtime Architecture

No websocket/socket client usage is visible. Messaging is HTTP polling/request-response:

- User messages: `/messages/user/conversations`, `/messages/user/conversations/:id/messages`
- Vendor messages: `/messages/vendor/conversations`, `/messages/vendor/conversations/:id/messages`

Vendor enquiry count is polled every 30 seconds in vendor navbar.

## Background Jobs

Not present. Inferred:

- `image_exists=true` filter comments mention a backend batch job `verify-vendor-images.js` that sets `image_exists = TRUE`.
- Face/gallery and AI processing may require async backend jobs, but no client queue code is present.

---

# 6. Database Deep Analysis

## Database Status

No database schema exists in this repo. The following model map is inferred from frontend API contracts.

## Inferred Entity Relationship Overview

### Users and Wedding Planning

Likely relationships:

- `User` has many `Budgets`.
- `User` has many `Wishlist` items.
- `User` has many `Guest` entries and guest groups.
- `User` has many checklist tasks.
- `User` has many wedding websites.
- `User` has many e-invite instances/cards.
- `User` participates in conversations/messages.
- `User` may submit real wedding stories.

### Vendor Marketplace

Likely relationships:

- `Vendor` belongs to a `VendorType`.
- `VendorType` has many `VendorSubcategories`.
- `Vendor` has one or many `VendorService` records.
- `VendorService` belongs to `Vendor` and `VendorSubcategory`.
- `VendorService` has attributes JSON/dynamic fields.
- `VendorService` has many media images/videos.
- `VendorService` has reviews, enquiries, leads, storefront completion.
- `BusinessClaim` references vendor/vendor service.

### E-Invites and Wedding Websites

Likely relationships:

- `EinviteCard` can be a template or user-created card.
- `EinviteInstance` references a card/template and stores customization payload.
- `WeddingWebsite` references user and template ID, has public `websiteUrl`.
- Templates are frontend-rendered but data is backend-provided.

### Travel/Payments

Likely relationships:

- `FlightBooking` stores offer/provider/passengers/contact/payment state.
- `PaymentOrder` stores Razorpay order info.
- `HotelSearch` may be stateless or persisted only after booking.

### Movments+

Likely relationships:

- `Gallery` or `Event` identified by guest/vendor token.
- `Collection` groups media.
- Uploaded images are matched through face recognition against guest selfie/photo.

## Important Inferred Data Structures

### Vendor Service API Shape

Observed transformation uses:

```js
{
  id,
  status,
  vendor_id,
  vendor: {
    id,
    businessName,
    phone,
    city,
    vendorType
  },
  subcategory: {
    id,
    name,
    vendorType
  },
  media: [],
  attributes: {
    vendor_name,
    Name,
    about_us,
    Portfolio,
    city,
    latitude,
    longitude,
    veg_price,
    non_veg_price,
    photo_package_price,
    rating,
    review_count,
    rooms,
    Phone,
    Whatsapp,
    Website
  }
}
```

This suggests flexible/dynamic vendor service attributes, likely stored as JSON or a key-value table.

### Budget API Shape

Observed fields:

```js
{
  id,
  userId,
  vendor_type_id,
  vendor_subcategory_id,
  estimated_budget,
  final_cost,
  paid_amount
}
```

### Wedding Website API Shape

Inferred:

- Multipart form fields.
- Authenticated create/update/delete/publish.
- Public view by `websiteUrl`.
- Template ID in route/form.

---

# 7. Authentication & User Flow

## Customer Registration

Code path:

- Route: `/customer-register`
- Component: `src/components/auth/CustomerRegister.jsx`
- API: `/user/register`
- Redux: `authSlice.setCredentials`

Workflow:

1. User fills name, email, password, phone, wedding venue/country/city/wedding date.
2. Component validates fields manually.
3. Payload is sent to user registration API.
4. On success, user/token are stored in Redux and localStorage.
5. `tokenTimestamp` is stored for 2-day expiry.
6. User is redirected to an authenticated area.

Issue:

- `hideLoader()` is called but not defined.

## Customer Login

Code path:

- Route: `/customer-login`
- Component: `CustomerLogin.jsx`
- Hook/API: `useUser` or direct API usage depending component implementation.

Workflow:

1. User submits email/password/captcha token.
2. `/user/login` returns `{ success, user, token }` or similar.
3. Redux auth state is populated.
4. LocalStorage persists user/token/timestamp.
5. Protected routes become accessible.

## Customer Logout

Code path:

- `authSlice.logout`
- `useUser.logout`

Workflow:

1. Redux clears user/token/isAuthenticated.
2. LocalStorage removes user/token/tokenTimestamp.
3. `useUser.logout` attempts `/auth/logout` best-effort.

## Customer Session Restore

Code path: `App.jsx`

1. Read `user`, `token`, `tokenTimestamp`.
2. If timestamp exists and age < 2 days, dispatch `setCredentials`.
3. If expired, remove stored values.
4. If no timestamp, old token is considered expired.

## Vendor Registration/Login

Code paths:

- Routes: `/vendor-register`, `/vendor-login`
- Components: `VendorRegister.jsx`, `VendorLogin.jsx`
- APIs: `/vendor/register`, `/vendor/login`
- Redux: `vendorAuthSlice`

Workflow:

1. Vendor submits business/auth fields.
2. Backend returns vendor and token.
3. Token expiry is decoded from JWT `exp` or defaulted to one hour.
4. Vendor, token, and expiry are stored.
5. Vendor dashboard routes become accessible.

## Vendor Logout

Vendor logout clears:

- `vendor`
- `vendorToken`
- `vendorTokenExpiry`

Issue:

- `MovmentPlusHeader.jsx` has broken logout because `dispatch` is not initialized and `Navigate` is misused.

## Password Reset

Routes/components exist:

- `/user-forgot-password` -> `ForgotPassword.jsx`
- `/vendor-forgot-password` -> `VendorForgotPassword.jsx`

Detailed backend flow is not fully visible from inspected files. Lint flags unused `storedOtp` in `ForgotPassword`.

## Authorization/Permissions

Current frontend guards:

- `UserPrivateRoute`: user-only.
- `VendorPrivateRoute`: vendor-only.
- `ProtectedRoute`: combined user/vendor, not currently central in route registry.

Role system:

- `roleSlice` stores `role` and `type`, used mainly in design studio flows.
- Vendor type ID controls display of Movments+ tab for photographers.

---

# 8. API Documentation Summary

## API Base URLs

| Name | Value/Source | Usage |
|---|---|---|
| Main API | `VITE_API_URL` fallback `https://happywedz.com/api` | Most business APIs |
| AI API | `VITE_API_BASE_URL` fallback `https://www.happywedz.com/ai/api` | Beauty/design studio |
| Shaadi AI | `VITE_SHADI_AI_API_BASE_URL` fallback in code, and hardcoded in `HomeGennie` | AI chat |
| Image base | `https://happywedzbackend.happywedz.com` | Vendor service media URL normalization |

## Important API Endpoints

### User Auth

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/user/register` | Register customer | No |
| POST | `/user/login` | Login customer | No |
| POST | `/user/google-auth` | Google OAuth login/register | No |
| POST | `/auth/logout` | Best-effort logout | Likely yes/cookie |

### Vendor Auth/Vendor CRUD

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/vendor/register` | Register vendor | No |
| POST | `/vendor/login` | Login vendor | No |
| POST | `/vendor/change-password` | Change vendor password | Vendor token |
| GET | `/vendor/list` | List vendors | Optional/unknown |
| GET | `/vendor/:id` | Vendor detail | Optional/unknown |
| POST | `/vendor/create` | Create vendor | Unknown |
| PUT | `/vendor/:id` | Update vendor | Unknown/vendor token |
| DELETE | `/vendor/:id` | Delete vendor | Unknown/vendor token |

### Vendor Services/Marketplace

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/vendor-services` | Listing with filters, pagination, city, vendorType, image_exists |
| GET | `/vendor-services/:id` | Vendor service detail |
| GET | `/vendor-services/vendor/:vendorId` | Vendor service(s) owned by vendor |
| POST | `/vendor-services` | Create vendor service/storefront |
| PUT | `/vendor-services/:id` | Update vendor service/storefront |
| GET | `/vendor-services/:serviceId/storefront-completion` | Fetch storefront completion percent |

### Vendor Types/Filters

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/vendor-types/with-subcategories/all` | Vendor type/subcategory tree |
| GET | `/vendor-types/with-subcategories` | Header/category structure |
| GET | `/filters?...` | Dynamic filters, partially commented |

### Wishlist

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/wishlist/toggle` | Toggle wishlist item |
| GET | `/wishlist/toggle/user/:userId` | Intended user wishlist path in slice, likely incorrect because base already includes toggle |
| PUT | `/wishlist/toggle/:id` | Intended update wishlist entry |
| DELETE | `/wishlist/toggle/:id` | Intended remove wishlist entry |

Potential issue: `wishlistSlice.js` sets `API_URL = https://happywedz.com/api/wishlist/toggle`, then appends `/user/:userId`, which may not match backend REST design.

### Budgets

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/budgets/user/:userId` | Fetch user budget rows | User token |
| POST | `/budgets/` | Create budget row | User token |
| PUT | `/budgets/:id` | Update budget row | User token |
| DELETE | `/budgets/:id` | Delete budget row | User token |

### Messages

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/messages/user/conversations` | User conversations |
| POST | `/messages/user/conversations` | Create user conversation |
| GET | `/messages/user/conversations/:id/messages` | User conversation messages |
| POST | `/messages/user/conversations/:id/messages` | Send user message |
| GET | `/messages/vendor/conversations` | Vendor conversations |
| GET | `/messages/vendor/conversations/:id/messages` | Vendor messages |
| POST | `/messages/vendor/conversations/:id/messages` | Vendor sends message |

### E-Invites

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/einvites/cards` | Fetch all card templates/cards |
| GET | `/einvites/cards/:id` | Card detail |
| POST | `/einvites/cards` | Create card |
| PUT | `/einvites/cards/:id` | Update card |
| DELETE | `/einvites/:id` | Delete e-invite |
| GET | `/einvites/:userId/einvites` | User e-invites |
| GET | `/einvites/search?q=` | Search e-invites |
| POST | `/einvites/cards/instances` | Create customized instance |
| PUT | `/einvites/cards/:id/instance` | Update instance |
| GET | `/einvites/cards/instances/:id` | Public/customized instance |

### Wedding Websites

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/weddingwebsite/wedding-websites` | Create wedding website | User token |
| GET | `/weddingwebsite/wedding-websites` | User's websites | User token |
| GET | `/weddingwebsite/wedding-websites/:id` | Website detail | User token |
| PUT | `/weddingwebsite/wedding-websites/:id` | Update website | User token |
| DELETE | `/weddingwebsite/wedding-websites/:id` | Delete website | User token |
| POST | `/weddingwebsite/wedding-websites/:id/publish` | Publish website | User token |
| GET | `/weddingwebsite/wedding/:websiteUrl` | Public website view | No |

### Travel/Flights

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/Flight_booking/airports?keyword=` | Search airports |
| POST | `/Flight_booking/search` | Search flights |
| GET | `/Flight_booking/flight/:offerId` | Flight detail |
| POST | `/Flight_booking/book` | Book flight |
| GET | `/Flight_booking/booking/:bookingId` | Booking detail |
| POST | `/Flight_booking/booking/:bookingId/cancel` | Cancel booking |
| GET | `/Flight_booking/popular-routes` | Popular routes |
| GET | `/Flight_booking/deals` | Flight deals |
| POST | `/Flight_booking/verify` | Verify offer |
| POST | `/flight_payment/create_order` | Create Razorpay payment order |
| POST | `/flight_payment/verify_and_book` | Verify payment and book |

### Hotels

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/hotelcontent/countries` | Hotel country list |
| GET | `/hotelcontent/destinations?countryCode=` | Hotel destinations |
| POST | `/hotels/search` | Hotel search |
| GET | `/hotelcontent/images?hotelCode=` | Hotel images |

### AI/Beauty

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/products/filter_products` | Filter makeup/outfit/jewelry products |
| POST | `/images` | Upload source image |
| POST | `/images/apply-makeup` | Apply makeup/filter |
| GET | `/images/:imageId` | Retrieve processed image |

### Shaadi AI Chat

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `https://shaadiai.happywedz.com/api/user_chat` | AI chat response with optional session |

Payload includes:

```js
{
  user_query,
  user_id,
  session_id // optional
}
```

### Movments+

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/gallery/:token` | Load gallery by token |
| POST | `/gallery/:token/upload` | Upload guest/gallery file |

### CMS

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/design-studio-banner` | Design studio banner |
| GET | `/einvite-banner` | E-invite banner |
| GET | `/real-wedding-photo-cms` | Real wedding photo CMS |
| GET | `/what-couples-says-route` | Testimonials |
| GET | `/login-cms` | Login page CMS |
| GET | `/sign-in-cms` | Sign-in page CMS |

---

# 9. Core Business Logic

## Marketplace Discovery

Files:

- `MainSection.jsx`
- `SubSection.jsx`
- `Detailed.jsx`
- `layouts/Main/*`
- `layouts/vendors/*`
- `layouts/venus/*`
- `useApiData.js`
- `useInfiniteScroll.js`
- `priceFilterUtils.js`
- `vendorDataTransform.js`

Workflow:

1. User lands on a section route like `/:section` or `/:section/:slug`.
2. Header/category navigation and route slug determine the listing context.
3. Filters are loaded from static config/API and stored in Redux keyed by section/slug.
4. `useApiData` or `useInfiniteScroll` builds query parameters:
   - `vendorType`
   - `city`
   - `subCategory`
   - `page`
   - `limit`
   - `minPrice/maxPrice`
   - `minCapacity/maxCapacity`
   - `minFoodPrice/maxFoodPrice`
   - `minRooms/maxRooms`
   - `minRating/maxRating`
   - `minReviews/maxReviews`
   - `filters` JSON for remaining filters
   - `image_exists=true`
5. API returns vendor services.
6. Transform functions normalize dynamic attributes into card/detail fields.
7. UI renders grid/list/map and detail pages.

Critical logic:

- Slugs are converted into human-readable subcategory names.
- Venue and non-venue prices are treated differently.
- Portfolio/media URLs are normalized against `happywedzbackend.happywedz.com`.
- Only services with verified images are requested.

## User Planning Dashboard

Files:

- `UserDashboardMain.jsx`
- `UserDashboardNavbar.jsx`
- `userDashboard/*`
- `useBudget.js`
- `messagesApi.js`
- `weddingWebsiteApi.js`

Sections:

- My Wedding.
- Checklist.
- Vendor.
- Guest list.
- Budget.
- Wishlist.
- Booking.
- Message.
- Real wedding.
- Profile.

Workflow:

1. User logs in.
2. User visits `/user-dashboard` or `/user-dashboard/:slug`.
3. `UserPrivateRoute` verifies auth.
4. Slug selects a dashboard module.
5. Modules interact with remote APIs and localStorage.

Important business functions:

- Budget planning by vendor type/subcategory with estimated/final/paid amounts.
- Guest list management and PDF export.
- Checklist management and PDF export.
- Vendor wishlist and saved vendor workflow.
- User/vendor messaging.
- Real wedding submission.
- Profile management.

## Vendor Dashboard / Vendor CRM

Files:

- `adminVendor/Main.jsx`
- `layouts/vendors/Navbar.jsx`
- `adminVendor/HomeAdmin.jsx`
- `Storefront.jsx`
- `EnquiryManagement.jsx`
- `VendorLeadsPage.jsx`
- `ReviewsPage.jsx`
- `Settings.jsx`
- `messages/VendorMessages.jsx`
- `subVendors/*`

Workflow:

1. Vendor logs in.
2. Vendor is redirected to `/vendor-dashboard/vendor-home`.
3. Vendor dashboard navbar fetches storefront completion and unread enquiries.
4. Vendor navigates by slug.
5. Storefront module creates/updates vendor service data.
6. Vendor manages enquiries, messages, reviews, settings, leads.
7. Photographers get Movments+ tab based on vendor type ID.

Revenue/operations logic:

- Vendor premium plan route exists at `/vendor-dashboard/upgrade/vendor-plan`.
- Leads/enquiries are core CRM/revenue surfaces.
- Storefront completion encourages vendors to fill listings.

## E-Invite Workflow

Files:

- `EinviteHomePage.jsx`
- `EinviteCategoryPage.jsx`
- `EinviteEditorPage.jsx`
- `EinviteSharePage.jsx`
- `EinviteViewPage.jsx`
- `layouts/einvites/*`
- `layouts/eInvite/*`
- `einviteApi.js`
- `CardEditorPage.jsx`
- `VideoEditorPage.jsx`

Workflow:

1. User browses e-invite categories.
2. Templates/cards are fetched from `/einvites/cards`.
3. Category filtering maps display categories to backend `cardType` values.
4. Authenticated user opens editor for selected template.
5. Editor stores customization data locally and/or creates an instance through `/einvites/cards/instances`.
6. User previews/shares public e-invite.
7. Public viewer loads instance/card by ID.

Editor technologies:

- Fabric.js for canvas-like editing.
- Video/card editor components.
- LocalStorage project data for draft persistence.

## Wedding Website Workflow

Files:

- `ChooseTemplate.jsx`
- `TemplatePreviewPage.jsx`
- `TemplateCustomizePage.jsx`
- `WeddingWebsiteForm.jsx`
- `WeddingWebsiteView.jsx`
- `WeddingPublicView.jsx`
- `MyWeddingWebsites.jsx`
- `templates/*`
- `weddingWebsiteApi.js`

Workflow:

1. User chooses a template.
2. User previews/customizes.
3. User fills wedding website form.
4. Form posts multipart data to backend.
5. User can view, update, delete, publish.
6. Public website is available under `/wedding/:websiteUrl`.
7. Frontend templates render final/public content.

## Design Studio / AI Beauty Workflow

Files:

- `TryLanding.jsx`
- `BrideMakeupChoose.jsx`
- `GroomeMakeupChoose.jsx`
- `TryMakeupLanding.jsx`
- `UploadSelfiePage.jsx`
- `FiltersPage.jsx`
- `OutfitFilterPage.jsx`
- `FinalLookPage.jsx`
- `beautyApi.js`
- `favoriteSlice.js`
- `roleSlice.js`

Workflow:

1. User selects bride/groom and category.
2. Role/type data is stored in Redux/localStorage `userInfo`.
3. User uploads selfie/image.
4. Products are fetched by category/detailed category and role.
5. User applies makeup/outfit/jewelry filters via AI image API.
6. Processed image is retrieved and shown.
7. Favorites can be stored locally.

## Movments+ Smart Photo Sharing

Files:

- `MovementPlusHome.jsx`
- `MovmentPlusGuestToken.jsx`
- `MovmentPlusUploadSelfie.jsx`
- `MovmentPlusGalleryPage.jsx`
- `movmentPlusApi.js`
- `public/models/*`
- `face-api.js` dependency

Workflow:

1. User/guest enters or receives a gallery token.
2. Guest token is stored in Redux/localStorage.
3. User uploads selfie or uses camera.
4. Face recognition/photo matching flow uses face-api models and/or backend gallery APIs.
5. Gallery is fetched by token.
6. Upload endpoint accepts guest/gallery uploads.

Current implementation issues:

- Hook ordering bug in upload selfie modal.
- Some endpoints are marked placeholder.

## Travel / Honeymoon Booking

Files:

- `Travels/*`
- `honeymoon/HeroPage.jsx`
- `FlightSearchResults.jsx`
- `BookingForm.jsx`
- `HoneymoonHotelsPage.jsx`
- `HotelbedsHotelsPage.jsx`
- `flightApi.js`
- `hotelApi.js`

Workflow:

1. User enters honeymoon/travel search.
2. Airport search and flight search call backend.
3. Flight results can be filtered.
4. User selects offer and booking data.
5. Payment order is created through `/flight_payment/create_order`.
6. Razorpay Checkout is loaded.
7. Payment success response is verified through `/flight_payment/verify_and_book`.
8. Hotels are searched through hotel content/search APIs.

## Matrimonial Workflow

Files:

- `MatrimonialMain.jsx`
- `MatrimonialHome.jsx`
- `MatrimonialHeader.jsx`
- `MatrimonialRegistration.jsx`
- `Search.jsx`
- `ProfileMatrimonial.jsx`
- `dashboard/*`

Workflow:

1. Public matrimonial home/search pages show profiles and plans.
2. Registration collects profile, personal, family, phone, preferences.
3. Dashboard has home, edit profile, profile cards, search, matches, interests, messages, activity.

Current limitation:

- Many matrimonial dashboard modules appear frontend/static-heavy; backend persistence is not clearly wired from inspected APIs.

---

# 10. Environment Variables Analysis

## Present `.env`

Values are masked here:

| Variable | Current Purpose | Required? | Sensitivity | Notes |
|---|---|---:|---|---|
| `VITE_API_BASE_URL` | AI API base, currently points to `https://www.happywedz.com/ai/api` | Yes for AI design studio | Public config | Should vary by env |
| `VITE_API_URL` | Main REST API base, currently points to `https://happywedz.com/api` | Yes | Public config | Used by shared API clients |
| `VITE_RAZORPAY_KEY` | Razorpay Checkout key | Yes for flight payment | Public key but environment-specific | Currently test key; should not be committed as default production config |

## Other Env Usage In Code

| Variable | Usage |
|---|---|
| `VITE_SHADI_AI_API_BASE_URL` | Declared fallback in `axiosInstance.js`, but chat widget directly hardcodes Shaadi AI URL |

## Hardcoded Config That Should Become Env

- `src/config/constants.js`
- `src/firebase.js`
- `src/services/api/einviteApi.js`
- `src/services/api/vendorServicesApi.js`
- `src/services/api/claimFormApi.js`
- `src/services/api/photographyApi.js`
- `src/services/api/beautyApi.js`
- `src/hooks/useBudget.js`
- `src/hooks/useApiData.js`
- `src/hooks/useInfiniteScroll.js`
- `src/components/common/HomeGennie.jsx`
- `src/components/layouts/vendors/Navbar.jsx`
- `vite.config.js` proxy target

## Security Guidance

- Frontend `VITE_*` values are embedded into browser bundles and are not secret.
- Do not put server secrets in Vite env.
- Use `.env.example` with placeholders.
- Use `.env.local` for local developer overrides.
- Move production/staging/test values into deployment environment config.

---

# 11. Dependencies Deep Analysis

## Critical Runtime Dependencies

| Dependency | Role |
|---|---|
| `react`, `react-dom` | Core UI runtime |
| `vite`, `@vitejs/plugin-react` | Build/dev tooling |
| `react-router-dom` | SPA routing |
| `@reduxjs/toolkit`, `react-redux` | Global state |
| `axios` | HTTP client |
| `bootstrap`, `react-bootstrap`, `reactstrap` | UI/layout |
| `@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers` | Material UI components and date pickers |
| `react-toastify`, `sweetalert2` | Notifications/alerts |
| `firebase`, `@react-oauth/google` | Auth/analytics/OAuth |
| `fabric` | E-invite/card editor canvas |
| `face-api.js` | Face detection/recognition |
| `leaflet`, `react-leaflet` | Maps |
| `chart.js`, `react-chartjs-2`, `recharts` | Analytics/dashboard charts |
| `@react-pdf/renderer`, `xlsx` | PDF and spreadsheet exports |
| `dompurify` | HTML sanitization |
| `summernote`, `jquery`, `react-quill-new` | Rich text editing |
| `swiper`, `react-slick`, `slick-carousel`, `react-owl-carousel` | Sliders/carousels |
| `framer-motion`, `tsparticles`, `@tsparticles/react` | Motion/visual effects |

## Heavy Dependencies / Bundle Considerations

Likely contributors to large bundles:

- MUI ecosystem.
- Bootstrap + React Bootstrap + Reactstrap all together.
- Multiple chart libraries.
- Multiple carousel libraries.
- Fabric.js.
- face-api.js.
- Summernote + jQuery + React Quill.
- xlsx.
- tsparticles and react-tsparticles packages.

## Potentially Unused or Duplicative Dependencies

Needs formal verification before removal:

- `react-tsparticles` and `@tsparticles/react` both installed.
- `tsparticles` plus specific wrapper packages.
- `react-bootstrap` and `reactstrap` both installed.
- Multiple icon libraries.
- Multiple carousel libraries.
- `inherits`, `randomcolor`, `reactjs-countdown`, `react-animated-css`, `react-sticky-header`, `react-fancybox` may be legacy.
- `rollup`, `@rollup/plugin-commonjs`, `@rollup/plugin-node-resolve` are dev dependencies but Vite already manages Rollup internally unless custom plugin usage exists.

## Dev Dependencies

- ESLint 9 flat config.
- React hooks/refresh lint plugins.
- Type definitions for React.
- Vite React plugin.

Current issue:

- Lint configuration is active but codebase fails with 481 errors and 64 warnings.

---

# 12. Development Workflow

## Local Setup

Expected:

```bash
npm install
npm run dev
```

PowerShell note:

- On this machine, `npm run ...` through `npm.ps1` was blocked by execution policy.
- `npm.cmd run ...` works.

## Scripts

| Script | Command | Purpose | Current Status |
|---|---|---|---|
| `dev` | `vite` | Start local dev server | Not run in analysis |
| `build` | `vite build` | Production build | Fails by default with Node heap OOM |
| `lint` | `eslint .` | Static analysis | Fails with 545 problems |
| `preview` | `vite preview` | Preview built app | Requires successful build |

## Build Flow

Default:

```bash
npm.cmd run build
```

Observed result:

- Fails with Node heap out-of-memory around 2 GB.

Workaround:

```powershell
$env:NODE_OPTIONS='--max-old-space-size=8192'
npm.cmd run build
```

Observed with workaround:

- Build succeeds.
- Vite warns about chunks above 500 KB.

## Deployment Flow

Not present in repository.

Inferred:

1. Install dependencies.
2. Configure frontend env values.
3. Build with Vite.
4. Serve `dist/` as static SPA.
5. Configure server rewrite fallback to `index.html`.

Required deployment details to add:

- Hosting provider.
- Environment matrix.
- Cache headers for static assets.
- SPA fallback config.
- CI build memory config.
- Secrets/key management.

## Branching/CI/CD

No evidence in repo. No GitHub Actions, Dockerfile, deployment scripts, or pipeline config found during inspection.

---

# 13. Reusable Systems & Shared Logic

## Shared API Logic

- `axiosInstance.js`: intended central API client.
- `apiHelpers.js`: authenticated `fetch` wrapper.
- `services/api/index.js`: exports only a subset of APIs.

Recommended direction:

- Move all service files to shared `axiosInstance` or a small set of configured clients.
- Export all API modules from `services/api/index.js`.
- Standardize response parsing and errors.

## Shared Data Transformations

- `vendorDataTransform.js`: normalize vendor API data.
- `useApiData.js` and `useInfiniteScroll.js`: contain duplicated transform logic.
- `priceFilterUtils.js`: central filter parsing/extraction.
- `imageUtils.js`: image URL and fallback logic.

Recommended direction:

- Extract listing API query builder and transform into reusable domain service.
- Avoid duplicate transform logic in hooks.

## Shared UI

- `components/ui`: loaders, shimmer states, inputs, modals, error states.
- `components/EmptyState.jsx`, `LoadingState.jsx`, `ErrorState.jsx`.
- Dashboard navbars.

Recommended direction:

- Normalize UI primitives and remove duplicate error/empty/loading components.

## Shared Providers

- Loader context.
- Listing/filter contexts.
- Redux store.
- MUI theme.

Issue:

- Provider hierarchy is inconsistent and duplicated in places.

---

# 14. Current Issues & Technical Debt

## Critical

| Issue | Evidence | Impact | Recommended Fix |
|---|---|---|---|
| Default production build OOM | `npm.cmd run build` fails with heap limit | CI/deploy unreliable | Reduce bundle/build graph, split chunks, remove heavy unused deps, set temporary `NODE_OPTIONS` in build env |
| Lint has 545 problems | `npm.cmd run lint` | Hidden runtime bugs, poor DX | Fix no-undef/rules-of-hooks first, then unused/deps |
| `HomeGennie` runtime error | `handleNewChat` outside component uses setters | Chat new session crashes | Move function inside component or pass setters |
| `useContact` returns undefined vars | `r,erro` | Contact hook consumers crash | Return `{ submitContact, loading, error }` |
| `MovmentPlusHeader` logout broken | missing `dispatch`, misuse `Navigate` | Logout/navigation fails | Use `const dispatch = useDispatch()` and `useNavigate()` |
| Conditional hooks | `MovmentPlusUploadSelfie` early return before hooks | React hook order bugs | Move hooks before conditional return or split component |
| Undefined `Swal` | `MatrimonialRegistration.jsx` | Submit crashes | Import SweetAlert2 or replace |
| Undefined `hideLoader` | `CustomerRegister.jsx` | Registration may crash | Use `useLoader` or remove call |

## High

| Issue | Impact | Recommended Fix |
|---|---|---|
| Hardcoded production URLs across codebase | Cannot safely use staging/local; duplicated config | Centralize env config |
| Tokens in localStorage | XSS can exfiltrate auth | Prefer secure HttpOnly cookies or hardened token strategy |
| Duplicated API clients/interceptors | Inconsistent auth/error handling | Use central clients |
| Large chunks/assets | Slow load, memory-heavy build | Route-level splitting, image optimization, dependency pruning |
| Provider duplication | Confusing global loader state | Single app-level provider |
| Duplicate `HomeGennie` on home page | Duplicate floating chat/state | Render only in layout or page, not both |
| Static and lazy import same component | Code splitting defeated | Remove static import for `WriteReviewPage` or lazy duplicate |

## Medium

| Issue | Impact | Recommended Fix |
|---|---|---|
| Naming inconsistencies | Harder onboarding/refactors | Standardize names and aliases |
| Empty catch blocks | Silent failures | Log/report or handle intentionally |
| Excessive console logs | Production noise/data leakage | Remove or guard by env |
| Manual validation repeated | Inconsistent UX | Adopt shared validation schemas |
| Large page components | Hard to maintain/test | Split into containers/hooks/presentational components |
| Missing tests | Regression risk | Add unit/integration tests for auth/API transforms/forms |
| No typed API contracts | Runtime shape assumptions | Introduce TypeScript or Zod schemas gradually |

## Build/Lint Results

Observed:

- `npm.cmd run lint`: failed with 481 errors and 64 warnings.
- `npm.cmd run build`: failed with JavaScript heap OOM.
- `vite build --minify false`: failed with heap OOM.
- `NODE_OPTIONS=--max-old-space-size=8192 npm.cmd run build`: succeeded with chunk warnings.

---

# 15. Scalability Analysis

## Current Scalability Level

The platform has broad feature coverage but frontend architecture is at a scaling stress point. The main bottlenecks are not React itself; they are code organization, bundle weight, inconsistent API abstractions, and missing typed/domain boundaries.

## Frontend Bottlenecks

- Very large route/page files.
- Multiple heavy UI/editor/chart/media libraries.
- Duplicated listing logic.
- Duplicated API clients.
- LocalStorage as broad persistence bus.
- No query cache layer.
- No consistent feature module boundaries.
- Large static public assets.
- Build memory exhaustion.

## Backend/API Bottlenecks Inferred

- Flexible vendor `attributes` shape increases frontend normalization burden.
- Search/filter endpoint accepts many query params and JSON filters; needs strong indexing server-side.
- Image verification is handled by batch job and `image_exists=true`; stale image data could affect listings.
- Messaging uses request-response/polling rather than realtime.
- Travel/payment flows depend on multiple external systems and need idempotency.

## Database Scaling Concerns Inferred

- Vendor listing filters need indexes on city, vendor type, subcategory, price, capacity, rooms, rating, review count, image_exists, status.
- Dynamic attributes JSON can be hard to index.
- Full-text search should be explicit rather than ad hoc string filtering.
- Messaging and enquiry counts need efficient unread count aggregation.
- Media-heavy workflows require object storage/CDN and optimized variants.

## Enterprise-Level Improvements

1. Establish domain modules:
   - `features/auth`
   - `features/vendors`
   - `features/user-dashboard`
   - `features/vendor-dashboard`
   - `features/einvites`
   - `features/wedding-websites`
   - `features/design-studio`
   - `features/travel`
   - `features/matrimonial`
2. Add a typed API client and contracts.
3. Adopt React Query/TanStack Query for caching, invalidation, retries, and deduping.
4. Add route-level chunk boundaries and manual vendor chunks.
5. Consolidate UI libraries.
6. Optimize assets and enforce image budgets.
7. Move auth to secure cookie/session model if backend supports it.
8. Add CI checks for build, lint, tests, bundle size.
9. Add observability: frontend error reporting, performance metrics, API error tracing.

---

# 16. AI Understanding Section

## Critical Entry Points

| File | Why It Matters |
|---|---|
| `src/main.jsx` | App root/providers |
| `src/App.jsx` | Route map and session restore |
| `src/redux/store.js` | Global state structure |
| `src/services/api/axiosInstance.js` | Central auth/error HTTP behavior |
| `src/components/layouts/MainLayout.jsx` | Public app frame |
| `src/components/pages/userDashboard/UserDashboardMain.jsx` | User dashboard slug switch |
| `src/components/pages/adminVendor/Main.jsx` | Vendor dashboard slug switch |
| `src/hooks/useApiData.js` | Marketplace listing query/transform |
| `src/hooks/useInfiniteScroll.js` | Infinite marketplace listing query/transform |
| `src/utils/priceFilterUtils.js` | Filter business logic |
| `src/utils/vendorDataTransform.js` | Vendor data normalization |
| `src/services/api/einviteApi.js` | E-invite API flow |
| `src/services/api/weddingWebsiteApi.js` | Wedding website API flow |
| `src/services/api/beautyApi.js` | AI beauty API flow |
| `src/services/api/flightApi.js` | Travel/payment flow |

## Most Important Workflows

1. **Customer session**: auth component -> user API -> `authSlice` -> localStorage -> `UserPrivateRoute` -> `axiosInstance`.
2. **Vendor session**: vendor auth component -> vendor API -> `vendorAuthSlice` -> localStorage expiry -> `VendorPrivateRoute`.
3. **Vendor listing**: route slug -> filters -> `useApiData`/`useInfiniteScroll` -> `/vendor-services` -> transform -> cards/list/map/detail.
4. **Vendor storefront**: vendor dashboard slug -> `Storefront.jsx` -> `vendorServicesApi` -> local completion state -> navbar.
5. **E-invite**: category/template -> editor -> `einviteApi` -> instance/share/public view.
6. **Wedding website**: choose template -> form -> `weddingWebsiteApi` -> publish -> public `/wedding/:websiteUrl`.
7. **Design studio**: role/type -> upload -> product filters -> AI apply makeup -> final look.
8. **Travel payment**: search flights -> create Razorpay order -> verify and book.

## Key State Flow

- Redux holds identity and cross-route state.
- LocalStorage persists identity, drafts, preferences, and some vendor dashboard state.
- Hooks own feature API state.
- No global API cache.

## When Modifying Code

AI tools should:

- Check whether an API module uses `axiosInstance` or hardcoded URL before editing.
- Preserve auth token expectations for customer vs vendor flows.
- Avoid changing dynamic vendor `attributes` mappings casually; many cards/details depend on fallback keys.
- Keep route slugs stable because dashboards use slug switches.
- Be careful with localStorage keys because many workflows depend on them.
- Run lint/build after fixes; default build currently may require increased Node heap.

---

# 17. Developer Onboarding Guide

## Start Project

```bash
npm install
npm.cmd run dev
```

If PowerShell blocks `npm.ps1`, use `npm.cmd`.

## Build Project

```powershell
$env:NODE_OPTIONS='--max-old-space-size=8192'
npm.cmd run build
```

Default `npm.cmd run build` currently fails with heap OOM on this machine.

## Files To Read First

1. `src/main.jsx`
2. `src/App.jsx`
3. `src/services/api/axiosInstance.js`
4. `src/redux/store.js`
5. `src/redux/authSlice.js`
6. `src/redux/vendorAuthSlice.js`
7. `src/components/layouts/MainLayout.jsx`
8. `src/components/pages/userDashboard/UserDashboardMain.jsx`
9. `src/components/pages/adminVendor/Main.jsx`
10. `src/hooks/useApiData.js`
11. `src/hooks/useInfiniteScroll.js`
12. `src/utils/priceFilterUtils.js`

## Common Pitfalls

- Some files are named or spelled inconsistently (`venus`, `movment`, `Groome`, `buisness`, `recommandation`).
- Not every API call uses the shared Axios instance.
- Backend/database code is not in this repo.
- `.env` values are frontend-exposed.
- `localStorage` is part of business flow; deleting keys can break session/drafts.
- Some routes are generic (`/:section`, `/:section/:slug`) and may catch unexpected paths.
- Build may require high memory until bundle optimization is done.
- Lint errors include real runtime bugs.

## Debugging Tips

- For auth bugs, inspect Redux state and localStorage keys.
- For listing bugs, inspect generated `/vendor-services?...` URL in `useApiData` or `useInfiniteScroll`.
- For vendor dashboard bugs, inspect `vendor`, `vendorToken`, `vendorTokenExpiry`, `vendorServiceId`, `storefrontCompletion`.
- For e-invite bugs, inspect whether code is using old `layouts/eInvite` or newer `layouts/einvites`.
- For AI/design studio bugs, inspect `userInfo` localStorage and API base URL.
- For travel payment bugs, trace `createFlightPaymentOrder` and `verifyAndBookFlight`.

## Best Practices For Future Development

- Prefer `axiosInstance` for normal HappyWedz API calls.
- Keep new API modules in `src/services/api`.
- Keep reusable query/data logic in hooks or feature services.
- Avoid adding more top-level hardcoded production URLs.
- Avoid storing new sensitive data in localStorage.
- Split large pages before adding complex new features.
- Add tests around transforms and business-critical flows.

---

# 18. Future Recommendations

## Refactoring Roadmap

### Phase 1: Stabilize

- Fix critical runtime bugs:
  - `HomeGennie`
  - `CustomerRegister`
  - `useContact`
  - `MovmentPlusHeader`
  - `MovmentPlusUploadSelfie`
  - `MatrimonialRegistration`
- Fix no-undef and rules-of-hooks lint errors first.
- Add `.env.example`.
- Remove duplicate providers/widgets.

### Phase 2: API and Auth Consolidation

- Centralize config in `src/config/env.js`.
- Move all API calls to central Axios/fetch clients.
- Normalize API response shapes.
- Remove global Axios interceptor side effects.
- Introduce React Query for data fetching.
- Review token strategy with backend team.

### Phase 3: Performance

- Add manual chunks in Vite.
- Lazy-load heavy editors only on editor routes.
- Lazy-load face-api only on Movments+/selfie routes.
- Remove unused dependencies.
- Consolidate carousels/charts/UI libraries.
- Optimize images and generate responsive variants.
- Track bundle size in CI.

### Phase 4: Architecture

- Move from broad `components/pages` to feature modules.
- Extract business logic from large UI files.
- Create shared form validation system.
- Introduce TypeScript incrementally, starting with API contracts and utilities.
- Add tests for auth, listings, filters, e-invite, budget, payment flows.

### Phase 5: DevOps/Production Readiness

- Add CI pipeline:
  - install
  - lint
  - test
  - build
  - bundle budget
- Add deployment docs.
- Add environment matrix.
- Add frontend error reporting.
- Add web performance monitoring.
- Add security scanning/dependency audit.

## Security Improvements

- Prefer HttpOnly secure cookies for auth if backend can support.
- Add CSP headers at hosting layer.
- Remove direct `innerHTML` mutation.
- Sanitize all backend rich text at one boundary.
- Remove console logging of business/user data.
- Ensure Razorpay key is environment-specific.
- Avoid production API in local dev by default.

## Product Improvements

- Clarify primary nav hierarchy; platform has many domains.
- Improve route naming consistency.
- Make dashboard workflows more modular.
- Add loading/error/empty states consistently.
- Add analytics events for conversion workflows:
  - vendor lead click
  - enquiry submission
  - e-invite creation
  - wedding website publish
  - Razorpay payment success/failure
  - AI try-on completion

---

# 19. Executive Summary

HappyWedz React is a large, feature-rich frontend for a wedding marketplace and planning platform. It includes public marketplace browsing, customer wedding planning tools, vendor CRM/storefront management, e-invite and wedding website creation, AI beauty/chat/photo workflows, matrimonial pages, and travel/payment modules.

The architecture is a Vite React SPA with React Router, Redux Toolkit, mixed UI libraries, feature hooks, and many remote REST API integrations. The backend and database are not part of this repository; their structure is inferred from API contracts. The frontend currently depends heavily on production HappyWedz APIs and localStorage persistence.

The most important technical flows are:

- Customer/vendor authentication and route protection.
- Vendor-service listing/filtering/transformation.
- User dashboard planning modules.
- Vendor dashboard storefront/enquiry/review/lead modules.
- E-invite and wedding website creation/publishing.
- AI design studio and Shaadi AI chat.
- Travel flight/hotel/payment workflows.

The project is powerful but carries significant technical debt:

- Default production build fails due to heap exhaustion.
- Lint reports hundreds of errors.
- Several runtime bugs are visible from static analysis.
- API configuration is duplicated and hardcoded.
- Bundles and assets are heavy.
- Large page components mix UI, state, validation, API, and business logic.

The recommended strategic direction is to stabilize runtime errors, centralize API/env/auth behavior, modularize by feature domain, reduce bundle weight, introduce typed contracts and tests, and add CI/deployment guardrails. Once stabilized, the codebase can scale into a maintainable multi-product wedding platform with clearer boundaries between marketplace, planning SaaS, vendor CRM, AI tools, e-invites, matrimonial, and travel.

