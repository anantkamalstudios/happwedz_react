# HappyWedz React — Enterprise Mobile Responsiveness Implementation Plan

**Project:** `happwedz_react`
**Analyzed:** 2026-05-13
**Scope:** Frontend-only responsive architecture audit and remediation strategy
**Author:** Senior Frontend Responsive Architecture Engineer

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Mobile Responsiveness Audit](#2-mobile-responsiveness-audit)
3. [Root Cause Analysis](#3-root-cause-analysis)
4. [Responsive Architecture Plan](#4-responsive-architecture-plan)
5. [Mobile UX Improvement Plan](#5-mobile-ux-improvement-plan)
6. [File-by-File Refactoring Plan](#6-file-by-file-refactoring-plan)
7. [Antigravity AI Prompts](#7-antigravity-ai-prompts)
8. [Safe Migration Strategy](#8-safe-migration-strategy)
9. [Responsive Testing Checklist](#9-responsive-testing-checklist)
10. [Enterprise Responsive Recommendations](#10-enterprise-responsive-recommendations)

---

## 1. Executive Summary

HappyWedz React is an extremely large, feature-rich SPA serving as a full wedding commerce and planning platform. It combines a marketplace, user dashboard, vendor CRM, e-invite editor, AI design studio, matrimonial portal, honeymoon travel booking, and Movments+ photo sharing — all under one frontend shell.

The styling architecture mixes **Bootstrap 5, React Bootstrap, Reactstrap, MUI (Material UI), module-level CSS files, and inline styles simultaneously**. There is no unified responsive design system. No single responsive breakpoint standard is enforced. Layout decisions are duplicated across three separate listing layout systems (`layouts/Main`, `layouts/vendors`, `layouts/venus`). Dashboard UX is desktop-first and breaks on tablets and phones.

The most critical responsiveness failures are:

- The **Header** navigation overflows on mobile; no proper mobile hamburger menu integration with the multi-level category hierarchy.
- The **vendor/venue listing pages** use fixed-width filter sidebars that collapse the content area on tablet and simply overflow on mobile.
- The **user and vendor dashboards** use horizontal tab navigation that breaks on 375px devices.
- The **e-invite editor** (Fabric.js canvas) has no touch/mobile adaptation.
- The **matrimonial registration form** is desktop-only in spacing and layout.
- **Tables** in enquiry management, guest list, and budget tracker are not wrapped for mobile scroll.
- **Modals** (pricing, review, claim, share) have fixed widths that exceed mobile viewport.
- The **design studio** AI workflow pages have hardcoded image dimensions and desktop-only layouts.
- **Typography** uses fixed `px` values throughout CSS files without fluid scaling or `clamp()`.
- The **wedding website templates** (floral, modern, royal) have no verified responsive behavior.

This plan delivers: a unified responsive token system, a mobile-first refactoring roadmap prioritized by user impact, production-safe Antigravity prompts for incremental implementation, and a testing matrix covering every device category from 280px fold phones to 3840px ultra-wide.

**Estimated effort:** 6–9 sprint weeks for a two-engineer frontend team following the phased migration plan.

---

## 2. Mobile Responsiveness Audit

### 2.1 Global Layout & CSS Architecture

| Issue | Severity | Details |
|---|---|---|
| Competing CSS systems | Critical | Bootstrap + MUI + Reactstrap + custom CSS coexist with no unified responsive contract. MUI uses its own breakpoint system (`xs/sm/md/lg/xl`). Bootstrap uses `sm/md/lg/xl/xxl`. Custom CSS files use ad-hoc media queries at inconsistent pixel values. |
| No mobile-first CSS baseline | Critical | Global CSS starts with desktop styles and "shrinks down." This creates extensive override debt and missed edge cases at small widths. |
| `index.html` has inline metadata | Low | Static content in HTML head doesn't affect layout but viewport meta should be audited. |
| `src/assets/fonts` missing `font-display` | Medium | Custom fonts can cause layout shift that affects responsive rendering. |
| No CSS container queries | Medium | Dynamic layouts in cards/dashboards require context-aware sizing not achievable with viewport media queries alone. |
| No `env(safe-area-inset-*)` usage | Medium | iOS notch/home indicator areas are not respected on any full-bleed section. |

### 2.2 Header & Navigation

| Issue | Severity | Details |
|---|---|---|
| Multi-level category navigation | Critical | `Header.jsx` renders a full vendor type/subcategory mega-menu. On mobile this almost certainly overflows or collapses incorrectly. The city selector dropdown, search bar, login/auth buttons, and category tabs all fight for horizontal space. |
| No confirmed hamburger pattern | Critical | No `MobileMenu` or `DrawerMenu` component is referenced in the layouts folder. The header uses Bootstrap's `Navbar` component but multi-level nested categories require custom mobile drawer behavior. |
| Location/city selector | High | The city dropdown is a UX-blocking element on mobile when rendered in the top navbar. On small screens it must become a bottom sheet or full-screen overlay. |
| Auth buttons in nav | High | Login/Register buttons alongside search and location create an overflow-prone navbar on 375–414px viewports. |
| Active state of current page | Medium | Tab/category active states rely on desktop hover behavior and may not have visible mobile touch feedback. |

### 2.3 Vendor/Venue Listing Pages

| Issue | Severity | Details |
|---|---|---|
| Fixed-width filter sidebar (`aside/`) | Critical | The filter sidebar in `layouts/aside/` is almost certainly rendered as a fixed-width panel. On tablets it squeezes the listing grid; on phones it either overflows or hides content entirely. |
| Three duplicate listing systems | High | `layouts/Main`, `layouts/vendors`, `layouts/venus` all have separate card and layout components. Each carries its own responsive debt. If one is fixed, the others are not. |
| Map/List/Grid toggle | High | Map view using Leaflet inside a listing layout will break on mobile without explicit height management. Leaflet maps need `height: 100vh` or fixed px; this conflicts with responsive containers. |
| Listing cards grid | High | Vendor service cards likely use `display: flex` or Bootstrap `row/col` but the number of columns at each breakpoint is not standardized. |
| Filter drawer (mobile) | Critical | There is no confirmed mobile filter drawer. On phones the `aside` sidebar must become a bottom sheet or overlay drawer triggered by a "Filter" button. |
| Top filter bar | High | `layouts/aside/TopFilter` likely has a horizontally scrollable filter chip row that either overflows or wraps badly on small screens. |
| Infinite scroll + mobile | Medium | Scroll behavior in `useInfiniteScroll` may conflict with momentum-based mobile scrolling if scroll detection is on `document` rather than a container. |

### 2.4 Vendor/Service Detail Page (`Detailed.jsx`)

| Issue | Severity | Details |
|---|---|---|
| Gallery/media tabs | High | Tab-switching gallery, reviews, pricing, enquiry sections likely use Bootstrap tabs that overflow on 320–375px. |
| Pricing modal (`PricingModal.jsx`) | Critical | Modal has likely fixed/large width. On 375px it will overflow. |
| Similar services row | Medium | `SimilarServices.jsx` horizontal carousel may have fixed item widths. |
| 360° view (`Vendor360View`) | High | Pannellum 360 viewer needs explicit container sizing and touch gesture support. |
| Enquiry form | High | If the enquiry/contact form is inside the detail page, it requires full responsive form treatment. |

### 2.5 User Dashboard (`UserDashboardMain.jsx`)

| Issue | Severity | Details |
|---|---|---|
| Horizontal dashboard navbar | Critical | `UserDashboardNavbar.jsx` renders multiple tabs (My Wedding, Checklist, Vendor, Guest List, Budget, Wishlist, Booking, Message, Real Wedding, Profile). At 375px these 10 tabs will overflow or wrap chaotically. |
| Budget table | Critical | Budget management table (estimated/final/paid columns) is a classic wide-table-on-phone problem. |
| Guest list table | Critical | Guest list management with columns for name, group, RSVP, phone is not scrollable horizontally or card-ified for mobile. |
| Checklist layout | High | Checklist items may use inline flex/grid that breaks on narrow widths. |
| Messages module | High | Conversation list + message thread dual-panel layout collapses on mobile. Must become single-panel with back navigation. |
| Real wedding form | High | Multi-section image upload form with text fields is complex and requires step-by-step mobile treatment. |
| Wishlist grid | Medium | Saved vendor cards need responsive grid columns. |
| Profile form | Medium | Profile editing form sections may be two-column desktop that collapses incorrectly. |

### 2.6 Vendor Dashboard (`adminVendor/Main.jsx`)

| Issue | Severity | Details |
|---|---|---|
| Vendor navbar (`layouts/vendors/Navbar.jsx`) | Critical | The vendor dashboard navigation has tabs plus a storefront completion indicator. Overflows at mobile widths. |
| Storefront editor (`Storefront.jsx`) | Critical | Multi-section storefront form (business details, gallery upload, pricing, policies) is a long-form experience with no confirmed mobile step progression. |
| Enquiry management table | Critical | `EnquiryManagement.jsx` — table of enquiries with date/status/vendor/action columns. Classic non-responsive table. |
| Vendor leads page | High | `VendorLeadsPage.jsx` likely shows a table or card grid of leads. |
| Reviews page | High | Review listings with star ratings, date, respondent details, response form. |
| Gallery upload | High | Multi-image upload with preview grid breaks on mobile if using fixed-width thumbnails. |
| Sub-vendor sections (`subVendors/*`) | High | Venue menu, availability calendar, service details — each a complex form that needs mobile treatment. |
| Availability calendar | High | A calendar component in a vendor dashboard drawer/modal will break on small screens. |

### 2.7 E-Invite System

| Issue | Severity | Details |
|---|---|---|
| Fabric.js canvas editor | Critical | Canvas-based editing is fundamentally desktop-first. Touch events on Fabric.js require explicit `enableTouch` configuration and may still be unusable on phone-sized screens without a dedicated mobile editor mode. |
| E-invite category grid | Medium | Card grid of templates. May use Bootstrap `col` classes or CSS grid without explicit mobile breakpoints. |
| E-invite share page | High | Copy link/social share actions should be thumb-accessible. |
| Video editor | Critical | Same concern as Fabric.js — canvas/video editing on mobile is broken without explicit mobile handling. |
| `CardEditorPage`/`VideoEditorPage` | Critical | These require either a "mobile not supported" graceful fallback or full touch/gesture adaptation. |

### 2.8 Wedding Website Builder & Templates

| Issue | Severity | Details |
|---|---|---|
| Template preview page | High | Desktop template preview in an iframe or full-width render will overflow on mobile. |
| Template customization | High | Color/font pickers and section editors in `TemplateCustomizePage` need responsive drawer/panel treatment. |
| Wedding website form | High | `WeddingWebsiteForm.jsx` multi-section form with image uploads needs full mobile form treatment. |
| Public templates (floral/modern/royal) | High | The three wedding website templates render final websites. Each has its own CSS. Their responsive behavior is completely unknown and must be individually audited. The mobile menu component (`templates/*/MobileMenu.jsx`) exists — it must be verified as functional. |
| RSVP form in templates | High | Guest RSVP form embedded in the public wedding website must be mobile-friendly. |

### 2.9 Design Studio / AI Beauty

| Issue | Severity | Details |
|---|---|---|
| Role selection page (`TryLanding.jsx`) | High | Bride/groom card selection — likely uses fixed card widths. |
| Selfie upload page (`UploadSelfiePage.jsx`) | High | Camera/file upload flow. Mobile must use native camera. Image preview needs responsive container. |
| Filter/outfit page | High | Product filter grid with AI image preview. Fixed dimensions for the processed AI image will overflow phones. |
| Final look display | High | Side-by-side before/after image comparison (`React Compare Image`) needs touch-swipe gesture support. |
| `FiltersPage.jsx` / `OutfitFilterPage.jsx` | High | These are large component pages mixing product grids with image try-on previews. Desktop layout breaks on mobile. |

### 2.10 Matrimonial

| Issue | Severity | Details |
|---|---|---|
| Matrimonial home | Medium | Hero section, plans, search bar layout. |
| Registration form (`MatrimonialRegistration.jsx`) | Critical | Very long multi-section registration with personal, family, photo upload, preferences. Needs step/accordion treatment on mobile. |
| Profile cards (`ProfileMatrimonial.jsx`) | High | Profile grid cards need responsive columns. |
| Dashboard sections | High | Matches, interests, messages, activity — all likely desktop-grid layouts. |
| `MatrimonialHeader.jsx` | High | Dedicated matrimonial layout header. Needs its own mobile menu strategy. |

### 2.11 Travel / Honeymoon

| Issue | Severity | Details |
|---|---|---|
| Hero search bar (`HeroPage.jsx`) | High | Flight/hotel search with origin, destination, dates, passengers — a wide desktop form that wraps badly on mobile. |
| Flight search results | High | Flight result cards with airline, time, price, select button. Need full responsive card treatment. |
| Booking form (`BookingForm.jsx`) | High | Multi-passenger booking form with full personal data. Must be accordion/step pattern on mobile. |
| Hotels page | High | Hotel grid/list with pricing — standard responsive grid needed. |
| Razorpay checkout overlay | High | Razorpay's own hosted checkout overlay must be tested on mobile; button triggers must be 44px minimum. |

### 2.12 Movments+ Photo Sharing

| Issue | Severity | Details |
|---|---|---|
| `MovmentPlusLayout` | High | Dedicated layout with its own header. Needs mobile treatment. |
| Token entry page | Medium | Simple input should be fine but needs large touch targets. |
| Selfie upload / camera | High | Camera access flow must use `capture="user"` on mobile input. |
| Gallery page | High | Photo grid with face recognition results. Fixed thumbnail grid will overflow narrow widths. |

### 2.13 Authentication Pages

| Issue | Severity | Details |
|---|---|---|
| Customer login | High | Two-column layout with large image (`~12.8 MB`) on one side. On mobile, image must be hidden and form must be full-width. |
| Customer register | High | Multi-field form with wedding details. Stacked correctly on mobile? Not confirmed. |
| Vendor register | High | Multi-section vendor registration. Desktop-heavy. |
| Login CMS image | Critical | `public/` contains a ~12.8 MB login image. Even if layout is responsive, the image weight is catastrophic on mobile networks. Use a compressed/smaller variant (`picture` with `srcset`). |

### 2.14 Home Page

| Issue | Severity | Details |
|---|---|---|
| Hero section | High | Full-width hero with text overlay, search, CTA. Must verify `clamp()` typography and background image behavior. |
| Category grid | Medium | Vendor category icons/cards — likely Bootstrap grid. |
| Featured vendor carousel (Swiper/Slick) | High | Multiple carousel libraries are installed. Swiper is touch-native; Slick and Owl Carousel have known mobile issues. If Owl Carousel is used on home, it must be replaced or configured with `touchDrag: true`. |
| Venue slider | High | Same carousel concerns. |
| Statistics section | Medium | Number counters in a row. May overflow on 320px. |
| Testimonials | Medium | Testimonial cards in a carousel or grid. |
| Newsletter section | Medium | Email input + button. Simple responsive but needs full-width stacking on mobile. |
| AI chat widget (`HomeGennie`) | High | The floating AI assistant chat bubble must not overlap critical content on mobile. It must respect `safe-area-inset-bottom` on iOS. |

### 2.15 Modals (Global)

| Issue | Severity | Details |
|---|---|---|
| Bootstrap `Modal` components | High | Bootstrap modals default to `max-width: 500px` centered. On 320–375px devices this often overflows the viewport. Must use `dialog-fullscreen-sm-down` or equivalent. |
| MUI `Dialog` components | High | MUI dialogs have responsive props (`fullScreen`) that must be conditionally applied. |
| SweetAlert2 popups | Medium | SweetAlert2 is mostly responsive but custom widths may overflow. |
| Pricing modal | Critical | `PricingModal.jsx` likely shows a feature table inside a modal. Tables inside modals on mobile = double overflow problem. |

### 2.16 Images

| Issue | Severity | Details |
|---|---|---|
| Missing `max-width: 100%` baseline | Critical | Without a global `img { max-width: 100%; height: auto; }` rule, any image with a natural width larger than the viewport causes horizontal scroll. |
| Large uncompressed assets in `public/` | High | The ~12.8 MB login image is the most critical. Several vendor/home images may also be oversized. |
| Missing `srcset`/`sizes` on hero images | High | Hero images download full resolution on mobile. |
| Vendor portfolio images | High | Portfolio gallery images use normalized URLs from `happywedzbackend`. No responsive image variants confirmed. |
| AI-processed images in design studio | High | Output images from the beauty AI have fixed `<img>` dimensions in the try-on flow. |

---

## 3. Root Cause Analysis

### RC-01: No Unified Responsive Token System

**Root Cause:** The project simultaneously uses Bootstrap breakpoints (`576/768/992/1200/1400px`), MUI breakpoints (`600/900/1200/1536px`), and arbitrary custom breakpoints in individual CSS files (e.g., `@media (max-width: 800px)`, `@media (max-width: 767px)`, `@media (max-width: 480px)`). No central token file defines the project's canonical breakpoint scale.

**Affected Files:** Every CSS file in `src/components/`, every MUI component using `sx` props with breakpoint keys, Bootstrap `col-*` classes throughout JSX.

**Severity:** Critical

**UX Impact:** Layout decisions made in one component become inconsistent with adjacent components at the same viewport width. The 768px "tablet" breakpoint means something different in Bootstrap vs MUI.

**Mobile Impact:** Features styled with Bootstrap `col-md-*` switch layout at 768px; features styled with MUI's `md` switch at 900px. Between 768–900px, layouts fight each other.

**Scalability Concern:** Every new component inherits the confusion. Refactoring one file does not propagate improvements.

---

### RC-02: Desktop-First CSS Strategy

**Root Cause:** All evidence points to desktop-first CSS: large desktop layouts are defined, then partially overridden for smaller screens. `src/components/layouts/MainLayout.jsx` wraps everything in a desktop-oriented shell. Filter sidebars (`aside/`) are built as persistent desktop panels.

**Affected Files:** `MainLayout.jsx`, `Header.jsx`, `Footer.jsx`, `UserDashboardMain.jsx`, `adminVendor/Main.jsx`, all `layouts/aside/*` files.

**Severity:** Critical

**Mobile Impact:** Desktop-first means that at 375px, every layout must fight through layers of `max-width`, `flex-direction`, `display`, and `width` overrides. This is the root of the overflow-and-horizontal-scroll problem.

---

### RC-03: Missing Global Image Baseline

**Root Cause:** There is no confirmed global CSS rule `img, video { max-width: 100%; height: auto; }`. Without this, every image with a natural width wider than the viewport causes horizontal scroll.

**Affected Files:** Global CSS file (imported in `src/main.jsx`), all component CSS files that render `<img>` tags.

**Severity:** Critical

**Horizontal Scroll Impact:** One unsized image in any component can break the entire page layout on mobile.

---

### RC-04: Fixed-Width Sidebar Architecture

**Root Cause:** `layouts/aside/` filter sidebars are designed as fixed-width desktop panels. The listing pages (`MainSection.jsx`, `SubSection.jsx`) render a sidebar + content area flex/grid layout. The sidebar has no responsive collapse behavior because no mobile drawer/sheet component wraps it.

**Affected Files:** `src/components/layouts/aside/FilterSidebar*.jsx` (or equivalent), `MainSection.jsx`, `SubSection.jsx`, `PhotographyDetails.jsx`.

**Severity:** Critical

**Mobile Impact:** Sidebar occupies 250–300px on a 375px screen, leaving 75–125px for content. This makes content unusable and causes overflow.

---

### RC-05: Non-Responsive Dashboard Tab Navigation

**Root Cause:** Both `UserDashboardNavbar.jsx` (10 tabs) and `layouts/vendors/Navbar.jsx` (vendor CRM tabs) are horizontal scrolling tab bars. On mobile, these either truncate, wrap chaotically, or overflow the viewport. There is no confirmed implementation of a mobile-friendly dropdown/drawer navigation for these dashboards.

**Affected Files:** `UserDashboardNavbar.jsx`, `layouts/vendors/Navbar.jsx`, `adminVendor/Main.jsx`, `UserDashboardMain.jsx`.

**Severity:** Critical

**Mobile Impact:** Users on phones cannot access dashboard sections. This is a core business flow breakage — budgets, guest lists, messages, enquiries are all inaccessible.

---

### RC-06: Non-Responsive Data Tables

**Root Cause:** Guest list, budget, enquiry, leads, and review tables use standard HTML `<table>` or MUI `Table` with multiple columns. No `overflow-x: auto` wrapper, no responsive card transformation at mobile widths, no column hiding strategy.

**Affected Files:** `userDashboard/Guests.jsx`, `userDashboard/Budget.jsx`, `adminVendor/EnquiryManagement.jsx`, `adminVendor/VendorLeadsPage.jsx`, `adminVendor/ReviewsPage.jsx`.

**Severity:** Critical

**Mobile Impact:** Tables with 5–8 columns at 375px are completely unreadable and create horizontal scroll that breaks the whole page.

---

### RC-07: Fixed/Oversized Modals

**Root Cause:** Bootstrap modals use `max-width: 500px` centered. On 320–375px screens, the modal with 16px padding on each side leaves only 288–343px for content, and padding may push content outside the viewport. MUI dialogs require explicit `fullScreen` on mobile. Neither appears to be handled globally.

**Affected Files:** `layouts/PricingModal.jsx`, any Bootstrap `Modal` usage in auth flows, review modals, claim forms, share modals in e-invite/wedding website flows.

**Severity:** High–Critical

**Mobile Impact:** Modals that overflow or show incomplete UI prevent users from completing critical actions (enquiry submission, login, sharing e-invites).

---

### RC-08: Typography Without Fluid Scaling

**Root Cause:** Custom CSS files throughout the project use fixed `px` values for font sizes (e.g., `font-size: 36px`, `font-size: 14px`). There is one MUI theme override in `src/theme/muiTheme.js` but it doesn't implement fluid typography. No `clamp()` usage is evidenced.

**Affected Files:** All custom CSS files in `src/components/`, `src/templates/*/template.css`.

**Severity:** High

**Mobile Impact:** Large headings (36px+) in hero sections do not scale down and either overflow their containers or force awkward line breaks on 320–375px.

**Accessibility Impact:** When a user increases browser font size, px values do not scale with user preferences.

---

### RC-09: Canvas-Based Editors Have No Mobile Mode

**Root Cause:** `EinviteEditorPage.jsx` and `VideoEditorPage.jsx` use Fabric.js, a canvas library designed for desktop mouse interactions. The canvas is rendered at a fixed pixel size. Touch interactions are not equivalent to mouse interactions without explicit Fabric.js touch event wiring.

**Affected Files:** `EinviteEditorPage.jsx`, `VideoEditorPage.jsx`, `CardEditorPage.jsx`, all `layouts/eInvite/` and `layouts/einvites/` components.

**Severity:** High (editor features), Medium (browsing features)

**Mobile Impact:** The editor is unusable on mobile. This is a feature parity problem. The resolution is either: (a) detect mobile and show a graceful "Editor works best on desktop" message with limited mobile customization, or (b) implement a touch-optimized mobile editor variant.

---

### RC-10: Multiple Competing Carousel Libraries

**Root Cause:** `react-slick`, `react-owl-carousel`, and `Swiper` are all installed. Swiper has excellent built-in touch support. Slick Carousel requires `swipe: true` and can have issues with responsive breakpoints in React. Owl Carousel for React is outdated and has poor mobile behavior. Which library is used on which component is inconsistent.

**Affected Files:** Home page carousels (`src/components/home/*`), listing gallery sliders, similar services, testimonials.

**Severity:** High

**Mobile Impact:** Carousels that don't swipe on mobile are deeply frustrating. On a wedding platform where photos and vendor galleries are primary discovery surfaces, non-swipeable carousels directly damage conversion.

---

### RC-11: AI Chat Widget (`HomeGennie`) Overlaps Mobile Content

**Root Cause:** `HomeGennie.jsx` is a floating fixed-position chat widget. Its `bottom/right` CSS position does not account for iOS safe-area bottom insets. On iPhone with home indicator, the chat bubble sits behind or partially over the home bar. Additionally, the open chat panel likely expands to a fixed pixel height that overflows the viewport on 667px-height phones.

**Affected Files:** `src/components/common/HomeGennie.jsx`, any CSS controlling its position.

**Severity:** High

**Mobile UX Impact:** The AI chat widget obscuring content or being unreachable is a direct product experience degradation for a core feature.

---

### RC-12: Wedding Website Templates Unverified for Mobile

**Root Cause:** Three template directories (`src/templates/floral`, `modern`, `royal`) each have their own CSS and component structures. Template CSS files are likely designed to produce beautiful desktop websites for the published wedding website. The mobile menu components exist (`MobileMenu.jsx`) but their implementation depth is unknown. Without audit, these published websites may be completely broken on mobile — affecting the couple's wedding guests who receive links on their phones.

**Affected Files:** `src/templates/floral/`, `src/templates/modern/`, `src/templates/royal/`, all subcomponents.

**Severity:** Critical (business impact: wedding guests viewing on mobile)

---

## 4. Responsive Architecture Plan

### 4.1 Unified Breakpoint System

Create a single source of truth for breakpoints. This must be implemented as both CSS custom properties and a JavaScript constants file so both CSS and MUI `sx` props can reference the same values.

**File to create:** `src/styles/breakpoints.css`

```css
:root {
  /* HappyWedz Canonical Breakpoints */
  --bp-xs:    320px;   /* Small phones floor */
  --bp-sm:    480px;   /* Large phones */
  --bp-md:    768px;   /* Tablets */
  --bp-lg:    1024px;  /* Small laptops / large tablets */
  --bp-xl:    1280px;  /* Standard desktop */
  --bp-2xl:   1536px;  /* Large desktop */
  --bp-3xl:   1920px;  /* Full HD */
  --bp-4xl:   2560px;  /* Ultrawide */
}
```

**File to create:** `src/styles/breakpoints.js`

```js
export const breakpoints = {
  xs:   320,
  sm:   480,
  md:   768,
  lg:   1024,
  xl:   1280,
  '2xl': 1536,
  '3xl': 1920,
  '4xl': 2560,
};

// For MUI theme override
export const muiBreakpointValues = {
  xs:  0,
  sm:  480,
  md:  768,
  lg:  1024,
  xl:  1280,
};
```

**Update `src/theme/muiTheme.js`** to include:

```js
import { muiBreakpointValues } from '../styles/breakpoints';

const theme = createTheme({
  breakpoints: {
    values: muiBreakpointValues,
  },
  // ... existing typography override
});
```

This aligns MUI's responsive system with the project's canonical breakpoints, eliminating the 768px vs 900px conflict.

---

### 4.2 Container System

Replace ad-hoc container widths with a standardized fluid container.

**File to create:** `src/styles/containers.css`

```css
.hw-container {
  width: 100%;
  padding-inline: var(--spacing-container-x);
  margin-inline: auto;
  max-width: var(--container-max-width);
}

:root {
  --spacing-container-x: 1rem;           /* 16px on mobile */
  --container-max-width: 100%;
}

@media (min-width: 480px) {
  :root { --spacing-container-x: 1.25rem; }
}

@media (min-width: 768px) {
  :root {
    --spacing-container-x: 2rem;
    --container-max-width: 1400px;
  }
}

@media (min-width: 1280px) {
  :root {
    --spacing-container-x: 3rem;
    --container-max-width: 1600px;
  }
}

@media (min-width: 1920px) {
  :root {
    --spacing-container-x: 4rem;
    --container-max-width: 1800px;
  }
}

/* Ultra-wide: prevent content from stretching across 3840px */
@media (min-width: 2560px) {
  :root {
    --container-max-width: 2000px;
  }
}
```

---

### 4.3 Spacing Scale System

Replace scattered margin/padding px values with a CSS custom property spacing scale.

**File to create:** `src/styles/spacing.css`

```css
:root {
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

---

### 4.4 Typography Scale System

Replace fixed `px` font sizes with fluid `clamp()` values.

**File to create:** `src/styles/typography.css`

```css
:root {
  /* Fluid typography: clamp(min, preferred, max) */
  --text-xs:   clamp(0.75rem,  0.7rem + 0.25vw,  0.875rem);  /* 12–14px */
  --text-sm:   clamp(0.875rem, 0.8rem + 0.37vw,  1rem);       /* 14–16px */
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);   /* 16–18px */
  --text-lg:   clamp(1.125rem, 1rem + 0.5vw,     1.25rem);    /* 18–20px */
  --text-xl:   clamp(1.25rem,  1rem + 1vw,        1.5rem);    /* 20–24px */
  --text-2xl:  clamp(1.5rem,   1rem + 2vw,        2rem);      /* 24–32px */
  --text-3xl:  clamp(1.75rem,  1rem + 3vw,        2.5rem);    /* 28–40px */
  --text-4xl:  clamp(2rem,     1rem + 4vw,        3.5rem);    /* 32–56px */
  --text-5xl:  clamp(2.5rem,   1rem + 5vw,        4.5rem);    /* 40–72px */

  /* Line heights */
  --leading-tight:  1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

---

### 4.5 Global CSS Baseline Additions

Add to the main global CSS file (imported in `src/main.jsx`):

```css
/* Responsive image baseline — prevents horizontal overflow from images */
img,
video,
canvas,
iframe {
  max-width: 100%;
  height: auto;
}

/* Box model consistency */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Prevent horizontal scroll at root */
html,
body {
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%; /* Prevent font scaling in landscape on iOS */
}

/* iOS safe area support */
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.safe-top {
  padding-top: env(safe-area-inset-top, 0px);
}

/* Minimum touch target */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

### 4.6 Responsive Sidebar Pattern

The filter sidebar must become a responsive drawer on mobile and tablet.

**Pattern:** Desktop persistent sidebar (≥1024px) → Tablet/mobile: bottom sheet / overlay drawer triggered by a floating "Filter" button.

**Implementation approach for `layouts/aside/`:**

```jsx
// FilterSidebarWrapper.jsx (new)
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery'; // already in project

export function FilterSidebarWrapper({ children }) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <aside className="filter-sidebar-desktop">
        {children}
      </aside>
    );
  }

  return (
    <>
      <button
        className="filter-fab touch-target"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
      >
        <FilterIcon /> Filters
      </button>
      {open && (
        <div className="filter-drawer-overlay" onClick={() => setOpen(false)}>
          <div
            className="filter-drawer-sheet"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              className="filter-drawer-close touch-target"
              onClick={() => setOpen(false)}
            >✕</button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
```

```css
/* filter-sidebar.css */
.filter-sidebar-desktop {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.filter-fab {
  position: fixed;
  bottom: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
  left: var(--space-4);
  z-index: 100;
  background: var(--color-primary, #e91e8c);
  color: white;
  border: none;
  border-radius: 999px;
  padding: var(--space-3) var(--space-5);
  gap: var(--space-2);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

.filter-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
}

.filter-drawer-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 85vh;
  background: white;
  border-radius: var(--space-4) var(--space-4) 0 0;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4);
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}
```

---

### 4.7 Responsive Dashboard Navigation Pattern

Both `UserDashboardNavbar` and vendor `Navbar` must adapt to mobile.

**Pattern:** Desktop = horizontal tab bar. Mobile = horizontal scroll tabs (with `overflow-x: auto; scrollbar-width: none;`) as the minimum fix, or a "hamburger → dropdown" menu for the full solution.

**Minimum viable mobile fix (Phase 1):**

```css
.dashboard-tab-nav {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  gap: var(--space-1);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid #f0f0f0;
}

.dashboard-tab-nav::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.dashboard-tab-nav .tab-item {
  flex-shrink: 0; /* Prevent tabs from shrinking */
  white-space: nowrap;
  padding: var(--space-3) var(--space-4);
  min-height: 44px; /* Touch target */
  font-size: var(--text-sm);
}
```

**Full solution (Phase 2):**

For mobile, render a `<select>` or MUI `<Select>` dropdown that navigates the dashboard section by slug. This is a 30-line enhancement that dramatically improves mobile UX.

```jsx
// In UserDashboardNavbar.jsx — mobile fallback
const isMobile = useMediaQuery('(max-width: 767px)');

if (isMobile) {
  return (
    <div className="dashboard-mobile-nav">
      <select
        value={currentSlug}
        onChange={e => navigate(`/user-dashboard/${e.target.value}`)}
        className="dashboard-section-select"
        style={{ width: '100%', minHeight: 44, fontSize: '1rem', padding: '8px 12px' }}
      >
        {tabs.map(tab => (
          <option key={tab.slug} value={tab.slug}>{tab.label}</option>
        ))}
      </select>
    </div>
  );
}
```

---

### 4.8 Responsive Table Pattern

Every data table (`Guests`, `Budget`, `Enquiries`, `Leads`) must use this pattern:

**Option A — Horizontal scroll (minimum viable):**

```css
.responsive-table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.responsive-table-container table {
  min-width: 600px; /* Preserve desktop layout inside scroll container */
}
```

**Option B — Card transform at mobile (best UX, Phase 2):**

```css
@media (max-width: 767px) {
  .responsive-table thead {
    display: none; /* Hide headers on mobile */
  }
  .responsive-table tr {
    display: block;
    margin-bottom: var(--space-4);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: var(--space-4);
  }
  .responsive-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2) 0;
    border: none;
    font-size: var(--text-sm);
  }
  .responsive-table td::before {
    content: attr(data-label);
    font-weight: 600;
    margin-right: var(--space-4);
    color: #666;
    flex-shrink: 0;
  }
}
```

---

### 4.9 Responsive Modal Pattern

Add a global modal enhancement. For Bootstrap modals:

```jsx
// In any Bootstrap Modal usage, add:
<Modal
  show={show}
  onHide={onHide}
  dialogClassName="responsive-modal"
  fullscreen="md-down" // Bootstrap 5.1+: fullscreen on anything below md (768px)
>
```

For MUI dialogs:

```jsx
import useMediaQuery from '@mui/material/useMediaQuery';
const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

<Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
```

---

### 4.10 Responsive Grid System for Cards

Listing cards (vendors, e-invites, matrimonial profiles, hotels) should use CSS grid with `auto-fill`:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--space-4);
}

/* For smaller cards */
.card-grid-sm {
  grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
}

/* For large feature cards */
.card-grid-lg {
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
}
```

This single pattern replaces Bootstrap `col-12 col-sm-6 col-md-4 col-lg-3` and works perfectly from 320px to 3840px.

---

### 4.11 Responsive Form Pattern

All multi-column forms must stack to single column on mobile:

```css
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .form-grid .form-field-full {
    grid-column: 1 / -1;
  }
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  min-height: 44px; /* Touch target */
  font-size: max(16px, 1rem); /* Prevent iOS zoom on focus */
  padding: var(--space-3) var(--space-4);
  border: 1px solid #ccc;
  border-radius: 8px;
}
```

**Critical iOS rule:** `font-size` on inputs must be `≥ 16px` to prevent iOS Safari from auto-zooming the viewport on focus. This is one of the most common mobile form bugs.

---

### 4.12 Responsive Navbar Pattern

The `Header.jsx` multi-level navigation requires:

1. **Sticky top** with `position: sticky; top: 0; z-index: 1000;`
2. **Height reduction** on scroll (shrink behavior via CSS `transition`)
3. **Mobile hamburger menu** using Bootstrap's `Navbar.Toggle` + `Navbar.Collapse`, but the multi-level category menu must be replaced with a full-screen drawer on mobile
4. **Category menu on mobile** → becomes a vertically scrollable accordion/list, not a mega-menu hover grid

```jsx
// Header.jsx responsive strategy:
// Desktop (≥1024px): full horizontal nav with category hover mega-menu
// Tablet (768–1023px): condensed nav + hamburger for full menu
// Mobile (<768px): logo + search icon + hamburger
//   Hamburger opens full-screen overlay with:
//     - Auth buttons
//     - City selector
//     - Category list (accordion)
//     - All nav links
```

---

## 5. Mobile UX Improvement Plan

### 5.1 Touch Targets

Enforce 44×44px minimum for all interactive elements:

```css
button,
a,
[role="button"],
input[type="checkbox"],
input[type="radio"],
.nav-link,
.tab-item,
.filter-chip {
  min-height: 44px;
  min-width: 44px;
}
```

Audit and fix specifically:
- Navigation links in Header (likely 32–36px currently)
- Dashboard tab items
- Pagination controls
- Card action buttons ("Enquire", "Wishlist", "View")
- Filter checkboxes in sidebar
- Calendar day cells in availability calendar

### 5.2 iOS Safari Specific Fixes

```css
/* Prevent viewport bounce that breaks full-height layouts */
html {
  height: -webkit-fill-available;
}

/* Prevent input zoom */
input, select, textarea {
  font-size: max(16px, 1rem);
}

/* Fix 100vh bug on iOS */
.full-height {
  height: 100dvh; /* Dynamic viewport height — modern approach */
  height: 100vh;  /* Fallback */
}
```

### 5.3 Bottom Sheet Pattern for City/Filter Selectors

Replace city-selector dropdown in the navbar with a mobile bottom sheet:

- On desktop: dropdown popover below the city button
- On mobile: fixed-position bottom sheet that slides up with the city list, searchable, scrollable, closes on backdrop tap

### 5.4 Swipe Gestures for Carousels

Consolidate all carousel usage to **Swiper.js** (already installed, best touch support). Remove Slick and Owl Carousel from routes that are frequently visited on mobile (home page, vendor detail gallery, e-invite category browsing).

### 5.5 Thumb-Zone Navigation

For dashboards, move primary actions to the bottom of the screen (or use a bottom navigation bar pattern for the user dashboard on mobile). The human thumb reaches the bottom third of the screen easily; the top navigation is difficult to reach on phones larger than 5.5".

**User dashboard mobile nav enhancement:**

```css
@media (max-width: 767px) {
  .user-dashboard-layout {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }
  .user-dashboard-content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  }
  .dashboard-bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(64px + env(safe-area-inset-bottom, 0px));
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: white;
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    z-index: 500;
    overflow-x: auto;
    scrollbar-width: none;
  }
}
```

Show the 5 most important dashboard sections as bottom nav icons. The remaining sections go into a "More" menu.

### 5.6 Mobile Scrolling Performance

```css
/* Smooth native momentum scrolling on iOS for scroll containers */
.scroll-container {
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain; /* Prevents scroll chaining */
}
```

### 5.7 Floating AI Chat Widget Mobile Fix

```css
.home-gennie-trigger {
  position: fixed;
  bottom: calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
  right: var(--space-4);
  z-index: 900;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  /* Ensure it doesn't cover mobile bottom nav */
}

@media (max-width: 767px) {
  /* If bottom nav is present, lift chat button above it */
  .home-gennie-trigger {
    bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  }
  .home-gennie-panel {
    position: fixed;
    inset: 0;
    max-height: 100dvh;
    border-radius: 0;
  }
}
```

### 5.8 E-Invite Editor Mobile Strategy

Since full canvas editing on mobile is impractical:

1. **Detect mobile** using `useMediaQuery('(max-width: 767px)')` or `window.innerWidth < 768` on editor mount.
2. **Show mobile-friendly alternative:** Display a preview of the e-invite with a message "For the best editing experience, use a tablet or desktop. On mobile, you can customize text and colors."
3. **Provide limited mobile customization:** Text fields for couple names, date, venue, and a color picker. Apply changes to a template render (not canvas-based).
4. **This preserves business logic** (instance creation via `/einvites/cards/instances`) while making the feature usable on mobile.

---

## 6. File-by-File Refactoring Plan

### FILE: `src/components/layouts/Header.jsx`

**Current Issue:** Multi-level category navigation, city selector, search, and auth buttons all compete in a single horizontal bar. On mobile, the layout overflows or the Bootstrap collapse doesn't handle the deeply nested category menu.

**Root Cause:** Desktop-first horizontal mega-menu design with no dedicated mobile drawer component.

**Responsive Fix:**
- Extract a `MobileMenuDrawer.jsx` component: full-screen overlay, vertically stacked, accordion-style categories.
- On `< 1024px`: render only logo + search icon + hamburger. All other nav content lives in the drawer.
- City selector: render as inline button on desktop, becomes first item in mobile drawer.
- Auth buttons: always visible in drawer header on mobile.

**Affected Screens:** 280px–1023px (all phones and tablets)

**Implementation Strategy:**
- Keep existing desktop JSX intact.
- Wrap desktop nav elements with `useMediaQuery` conditional: `isDesktop ? <DesktopNav /> : <MobileNav />`
- The `MobileMenuDrawer` is a separate component controlled by a boolean state in `Header.jsx`.
- Preserve all category API calls and Redux location state.

**Mobile UX Improvement:** Users can browse all vendor categories and change city from any mobile device.

**Priority:** P0 — Critical. This is the first thing every user sees.

---

### FILE: `src/components/layouts/Footer.jsx`

**Current Issue:** Multi-column footer links collapse incorrectly on mobile or show tiny text.

**Root Cause:** Bootstrap grid columns without explicit mobile breakpoints.

**Responsive Fix:**

```css
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}
@media (min-width: 480px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr 1fr; }
}
```

**Affected Screens:** 280px–767px

**Priority:** P2 — Important but not blocking.

---

### FILE: `src/components/layouts/aside/` (filter sidebar files)

**Current Issue:** Fixed-width desktop sidebar pushes listing content off-screen on mobile and tablet.

**Root Cause:** `width: 260px; flex-shrink: 0;` on a narrow screen leaves no room for content.

**Responsive Fix:** Implement `FilterSidebarWrapper.jsx` as described in Section 4.6. Replace all `aside` usages with the wrapper component.

**Affected Screens:** 280px–1023px

**Implementation Strategy:** Wrap existing filter content without touching any filter state logic or Redux connections. Only the container changes.

**Priority:** P0 — Critical. Marketplace browsing is the core business flow.

---

### FILE: `src/components/pages/MainSection.jsx` and `SubSection.jsx`

**Current Issue:** Sidebar + content layout uses `display: flex` or Bootstrap `row`. On mobile, sidebar doesn't collapse.

**Root Cause:** No responsive layout system. Desktop grid hardcoded.

**Responsive Fix:**

```css
.listing-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .listing-layout {
    grid-template-columns: 260px 1fr;
  }
}
```

Replace sidebar rendering with `FilterSidebarWrapper`. Use `card-grid` CSS class for vendor cards.

**Affected Screens:** 280px–1023px

**Priority:** P0.

---

### FILE: `src/components/pages/userDashboard/UserDashboardMain.jsx`

**Current Issue:** Dashboard slug-switch layout has no mobile responsive shell. Content sections inside may have desktop-only layouts.

**Root Cause:** Dashboard designed as desktop SPA panel.

**Responsive Fix:**
- Add responsive shell with bottom navigation on mobile (Section 5.5).
- Ensure `UserDashboardNavbar` renders as scrollable tabs on mobile.
- Pass `isMobile` flag to child sections so they can adapt.

**Priority:** P0.

---

### FILE: `src/components/layouts/UserDashboardNavbar.jsx`

**Current Issue:** 10 tabs overflow on 375px.

**Root Cause:** `display: flex` without `flex-wrap` or `overflow-x: auto`.

**Responsive Fix:** Phase 1 = scrollable tabs. Phase 2 = mobile `<select>` dropdown or icon-only bottom bar for 5 priority tabs.

**Priority:** P0.

---

### FILE: `src/components/pages/adminVendor/Main.jsx`

**Current Issue:** Vendor dashboard slug-switch without mobile adaptation.

**Root Cause:** Same as `UserDashboardMain`.

**Responsive Fix:** Same pattern as user dashboard. Vendor dashboard may need a collapsible sidebar rather than a bottom nav (more desktop-leaning users, but must still work on tablet).

**Priority:** P1.

---

### FILE: `src/components/layouts/vendors/Navbar.jsx`

**Current Issue:** Vendor CRM tab nav overflows on mobile.

**Root Cause:** Fixed horizontal tab list without overflow control.

**Responsive Fix:** Same scrollable tab pattern. Storefront completion indicator must reflow below the tab row on mobile.

**Priority:** P1.

---

### FILE: `src/components/pages/userDashboard/Guests.jsx`

**Current Issue:** Guest list table with Name, Group, Phone, RSVP columns.

**Root Cause:** Standard HTML table or MUI Table with no responsive wrapper.

**Responsive Fix:** Wrap in `.responsive-table-container` with `overflow-x: auto`. In Phase 2, add `data-label` attributes and CSS card transformation (Section 4.8 Option B).

**Priority:** P1.

---

### FILE: `src/components/pages/userDashboard/Budget.jsx` (inferred name from `useBudget.js`)

**Current Issue:** Budget table with vendor type, subcategory, estimated, final, paid columns.

**Root Cause:** Same as Guests.

**Responsive Fix:** Same responsive table pattern. Totals row at bottom needs special handling on mobile.

**Priority:** P1.

---

### FILE: `src/components/pages/adminVendor/EnquiryManagement.jsx`

**Current Issue:** Enquiry table with vendor/service/date/status/action columns.

**Root Cause:** Non-responsive table.

**Responsive Fix:** Responsive table container + card transform pattern. Action buttons (Reply, Mark Resolved) must be 44px touch targets.

**Priority:** P1.

---

### FILE: `src/components/layouts/PricingModal.jsx`

**Current Issue:** Modal with pricing table likely has fixed width.

**Root Cause:** Bootstrap modal without `fullscreen="md-down"`.

**Responsive Fix:** Add `fullscreen="md-down"` to Bootstrap `Modal` or `fullScreen` prop to MUI `Dialog`. Pricing table inside modal needs `overflow-x: auto` wrapper.

**Priority:** P1.

---

### FILE: `src/components/auth/CustomerLogin.jsx`

**Current Issue:** Two-column auth layout with ~12.8 MB image on left column.

**Root Cause:** Desktop-only layout with no mobile image hiding logic.

**Responsive Fix:**

```css
.auth-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100dvh;
}

@media (min-width: 768px) {
  .auth-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.auth-hero-image {
  display: none;
}

@media (min-width: 768px) {
  .auth-hero-image {
    display: block;
  }
}
```

Additionally, replace the `<img src="...12.8mb-image.jpg">` with a `<picture>` element serving a compressed WebP variant (50–100 KB) on mobile.

**Priority:** P0 — This image alone will make mobile load useless.

---

### FILE: `src/components/pages/designStudio/FiltersPage.jsx` and `OutfitFilterPage.jsx`

**Current Issue:** Desktop layout mixing product filter grid with AI image preview. Fixed image dimensions.

**Root Cause:** No responsive design for the core AI try-on experience.

**Responsive Fix:**

```css
.design-studio-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .design-studio-layout {
    grid-template-columns: 350px 1fr;
  }
}

.ai-image-preview {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  aspect-ratio: 3/4; /* Portrait photo */
}

.ai-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**Priority:** P1.

---

### FILE: `src/components/pages/designStudio/UploadSelfiePage.jsx`

**Current Issue:** Camera/file upload flow may not use mobile camera properly.

**Root Cause:** `<input type="file">` without `capture` attribute.

**Responsive Fix:**

```jsx
<input
  type="file"
  accept="image/*"
  capture="user"   /* Opens front-facing camera on mobile */
  onChange={handleSelfieUpload}
/>
```

**Priority:** P1.

---

### FILE: `src/components/pages/Travels/honeymoon/HeroPage.jsx`

**Current Issue:** Flight search form with multiple fields in a horizontal row.

**Root Cause:** Desktop-oriented form layout.

**Responsive Fix:**

```css
.flight-search-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .flight-search-form {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1280px) {
  .flight-search-form {
    grid-template-columns: 1fr 1fr 1fr 1fr auto;
    align-items: end;
  }
}
```

**Priority:** P1.

---

### FILE: `src/components/pages/matrimonial/MatrimonialRegistration.jsx`

**Current Issue:** Long multi-section registration form. SweetAlert2 runtime bug also present.

**Root Cause:** Desktop-only form layout. Multi-section forms need accordion/stepper on mobile.

**Responsive Fix:** Wrap form sections in an accordion component (Bootstrap `Accordion` is already installed). Each section (Personal, Family, Partner Preferences, Photos) collapses. On desktop, show all sections expanded. On mobile, use accordion with one section open at a time.

**Priority:** P1.

---

### FILE: `src/templates/floral/`, `modern/`, `royal/`

**Current Issue:** Public wedding website templates. Responsive behavior unverified. Mobile guests viewing these templates on phones need a fully functional experience.

**Root Cause:** Templates have their own CSS that was likely developed in isolation.

**Responsive Fix:** Each template must be audited independently:

1. Check `MobileMenu.jsx` in each template — does the hamburger menu work?
2. Verify hero sections: hero images should use `object-fit: cover` on a responsive container.
3. Verify couple/story sections: two-column layouts must stack on mobile.
4. Verify gallery: photo grid must use responsive CSS grid.
5. Verify RSVP form: all inputs ≥ 16px font-size.
6. Verify countdown timer: numbers must not overflow on 320px.

```css
/* Add to each template's CSS */
img { max-width: 100%; height: auto; }
html { overflow-x: hidden; }
```

**Priority:** P0 — Wedding guests (often not tech-savvy relatives) will view these on mobile on wedding day. Broken templates are a major brand failure.

---

### FILE: `src/components/common/HomeGennie.jsx`

**Current Issue:** Floating AI chat widget. Position doesn't respect iOS safe area. Chat panel may overflow viewport height.

**Root Cause:** `position: fixed` without `env(safe-area-inset-bottom)`.

**Responsive Fix:** (Described in Section 5.7)

**Priority:** P1.

---

### FILE: `src/components/home/` (all home page sections)

**Current Issue:** Hero, categories, carousels, statistics, newsletter.

**Root Cause:** Individual section responsive issues.

**Responsive Fix per section:**
- Hero: `clamp()` typography, background-image on mobile hidden or replaced with smaller version
- Categories: `card-grid-sm` CSS grid class
- Carousels: confirm Swiper.js usage; if Slick/Owl Carousel, configure touch or replace
- Statistics counter row: `flex-wrap: wrap` with `flex: 1 1 120px` for each stat
- Newsletter: input + button stack on mobile with `flex-direction: column` at `< 480px`

**Priority:** P1.

---

### FILE: `src/components/pages/einvite/EinviteEditorPage.jsx`

**Current Issue:** Fabric.js canvas editor, desktop-only.

**Root Cause:** Canvas-based editor requires mouse precision.

**Responsive Fix:** Implement mobile detection and show graceful degradation with limited text/color customization via HTML form. (Section 5.8)

**Priority:** P2 (editor power users are less likely to be mobile-only; but browsing/sharing flows must be P1).

---

### FILE: All `layouts/Main/*`, `layouts/vendors/*`, `layouts/venus/*` card components

**Current Issue:** Three parallel listing card systems, each with its own responsive debt.

**Root Cause:** Duplicate listing architecture.

**Responsive Fix:** Apply `card-grid` CSS class to the grid wrapper in all three systems. Apply consistent card CSS:

```css
.vendor-card {
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.vendor-card-image {
  aspect-ratio: 4/3;
  overflow: hidden;
}

.vendor-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vendor-card-body {
  padding: var(--space-4);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.vendor-card-actions {
  margin-top: auto;
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.vendor-card-actions button,
.vendor-card-actions a {
  flex: 1;
  min-height: 44px;
}
```

**Priority:** P0.

---

## 7. Antigravity AI Prompts

These prompts are ready for use in Antigravity or any AI coding assistant. Each preserves existing business logic.

---

### Prompt 1: Responsive Navbar Fix

```
You are working on the HappyWedz React frontend (Vite, React 19, Bootstrap 5, MUI).

Fix the `src/components/layouts/Header.jsx` for full mobile responsiveness.

REQUIREMENTS:
- Preserve all existing category navigation data, Redux location state, vendor type links, and auth button behavior.
- Do NOT change any API calls, Redux dispatches, or route paths.
- Keep the existing desktop layout intact for screens ≥ 1024px.

MOBILE CHANGES (< 1024px):
1. Show only: logo, search icon button, and a hamburger icon button.
2. Create a new `MobileMenuDrawer` component in the same file or as `Header.MobileMenuDrawer.jsx`.
3. The drawer is a fixed full-screen overlay (z-index: 1000) that slides in from the left.
4. Inside the drawer: auth buttons at top, city selector as a large tappable button, category list as a vertically scrollable accordion (Bootstrap Accordion is available), all nav links.
5. Hamburger button and all drawer interactive elements must be minimum 44px × 44px touch targets.
6. Drawer must close on overlay click and on any nav link click.
7. Add `padding-bottom: env(safe-area-inset-bottom, 0px)` to the drawer.
8. The city selector on mobile should open a separate bottom sheet (a fixed-position div sliding up from bottom) with the city list.

CSS:
- Use CSS variables: --space-4 (1rem), --space-6 (1.5rem).
- Use `position: fixed; inset: 0;` for the overlay.
- Use `transform: translateX(-100%)` / `translateX(0)` with CSS transition for slide-in animation.

DO NOT:
- Remove or change any category API hook calls.
- Change the desktop header rendering.
- Introduce any new state management libraries.
- Change routing logic.
```

---

### Prompt 2: Responsive Layout Fixes (Listing Pages)

```
You are working on the HappyWedz React frontend.

Fix `src/components/pages/MainSection.jsx` and `src/components/pages/SubSection.jsx` for mobile responsiveness.

REQUIREMENTS:
- Preserve all filter Redux state, listing API calls via `useApiData`/`useInfiniteScroll`, route slug behavior, and map/list/grid toggle state.
- Do NOT change any query parameters, filter logic, or data transforms.

LAYOUT CHANGES:
1. The current sidebar + content flex layout must become a CSS Grid layout:
   - Mobile (< 1024px): single column, filter sidebar hidden by default.
   - Desktop (≥ 1024px): `grid-template-columns: 260px 1fr;`

2. Create a `FilterSidebarWrapper` component that:
   - On desktop: renders a sticky sidebar.
   - On mobile/tablet: renders a floating "Filters" button (bottom-left, fixed position) that opens a bottom sheet drawer containing the filter content.
   - The bottom sheet must close on overlay tap and have a close button.

3. The vendor card grid must use:
   `display: grid; grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); gap: 1rem;`

4. All vendor action buttons (Enquire, Wishlist) on cards must be min 44px height.

5. Map view (Leaflet): wrap the map container in a div with `height: 70dvh; width: 100%;` and ensure it's visible on mobile.

PRESERVE:
- Infinite scroll behavior.
- Filter state in Redux.
- All API calls and parameters.
- Route slug behavior.
- Map/List/Grid toggle UI.
```

---

### Prompt 3: Responsive Dashboard Fixes

```
You are working on the HappyWedz React frontend.

Fix `src/components/pages/userDashboard/UserDashboardMain.jsx` and `src/components/layouts/UserDashboardNavbar.jsx` for mobile responsiveness.

REQUIREMENTS:
- Preserve all slug-based section switching, Redux auth state, API calls within dashboard sections.
- Do NOT change any route paths or URL slugs.

CHANGES:

In `UserDashboardNavbar.jsx`:
1. Make the tab nav horizontally scrollable on mobile:
   ```css
   display: flex; overflow-x: auto; scrollbar-width: none; gap: 4px;
   ```
   Each tab: `flex-shrink: 0; white-space: nowrap; min-height: 44px;`

2. Additionally, on screens < 480px, render a `<select>` dropdown above the scrollable tabs (or instead of, your choice) that maps tab labels to slugs and calls `navigate()` on change.

In `UserDashboardMain.jsx`:
3. Add a responsive dashboard shell:
   - On mobile (< 768px): add bottom padding to content area (`padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px))`) to account for potential bottom navigation.
   - Ensure the content area is `overflow-y: auto` and doesn't break the page scroll.

4. Do NOT change any of the slug-switch logic (the if/else or switch statement selecting which module to render).
5. Do NOT change any Redux selectors or dispatch calls.
```

---

### Prompt 4: Responsive Sidebar Fixes (Vendor Dashboard)

```
You are working on the HappyWedz React frontend.

Fix `src/components/layouts/vendors/Navbar.jsx` and `src/components/pages/adminVendor/Main.jsx` for mobile responsiveness.

REQUIREMENTS:
- Preserve all vendor auth state, slug-based routing, storefront completion percentage display, unread enquiry count polling, and all navigation links.
- Do NOT change API calls in the navbar (storefront completion, enquiry count polling).

CHANGES:

In `layouts/vendors/Navbar.jsx`:
1. Make the vendor tab navigation horizontally scrollable on mobile.
2. Storefront completion progress bar/indicator: stack below tabs on mobile (full width).
3. Unread enquiry badge: always visible regardless of scroll position.
4. All tab items: min-height 44px.

In `adminVendor/Main.jsx`:
5. On tablet (768–1023px): consider a collapsible left sidebar variant instead of tab navigation.
6. On mobile (< 768px): same bottom-padding strategy as user dashboard.
7. Preserve all slug-switch rendering logic exactly as-is.
```

---

### Prompt 5: Responsive Modal Fixes

```
You are working on the HappyWedz React frontend (Bootstrap 5, MUI).

Fix all modal components for mobile responsiveness.

FILES TO FIX:
- `src/components/layouts/PricingModal.jsx`
- Any Bootstrap `Modal` component in auth flows (CustomerLogin, VendorLogin, CustomerRegister)
- Any Bootstrap `Modal` used for reviews, shares, claims, gallery

REQUIREMENTS:
- Preserve all modal content, form state, API calls inside modals.
- Do NOT change what modals display or how they submit data.

CHANGES:

For Bootstrap Modals:
1. Add `fullscreen="md-down"` prop to all `<Modal>` components. This makes them fullscreen on phones while keeping normal modal style on tablet+.
2. If the modal contains a `<table>`, wrap the table in `<div style={{overflowX:'auto'}}>`.
3. Modal close buttons must be min 44px × 44px.
4. Modal body `padding: 1rem` on mobile (reduce if currently larger).

For MUI Dialogs (if any):
1. Add `const fullScreen = useMediaQuery(theme.breakpoints.down('md'));`
2. Pass `fullScreen={fullScreen}` to `<Dialog>`.

For ALL modals:
3. Ensure any `<input>`, `<select>`, `<textarea>` inside modals has `font-size: max(16px, 1rem)` to prevent iOS zoom.
```

---

### Prompt 6: Responsive Form Fixes

```
You are working on the HappyWedz React frontend.

Fix all major forms for mobile responsiveness.

FILES TO FIX (apply same pattern to all):
- `src/components/auth/CustomerRegister.jsx`
- `src/components/auth/VendorRegister.jsx`
- `src/components/pages/adminVendor/Storefront.jsx`
- `src/components/pages/matrimonial/MatrimonialRegistration.jsx`
- `src/components/pages/Travels/BookingForm.jsx`
- `src/components/pages/userDashboard/RealWeddingForm.jsx` (or equivalent)

REQUIREMENTS:
- Preserve ALL form field names, validation logic, state variables, API submission calls.
- Do NOT change any field names, validation rules, or form submission handlers.

CHANGES:

1. Wrap form fields in a CSS grid:
   ```css
   .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
   @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
   .form-field-full { grid-column: 1 / -1; }
   ```

2. Apply to inputs/selects/textareas:
   ```css
   font-size: max(16px, 1rem); /* Prevents iOS zoom */
   min-height: 44px;
   width: 100%;
   ```

3. Submit buttons:
   - Full width on mobile (`width: 100%`).
   - Min height 48px.

4. For `MatrimonialRegistration.jsx` specifically:
   - Wrap each major section (Personal Details, Family Background, Partner Preferences, Upload Photos) in a Bootstrap `Accordion.Item`.
   - On mobile, sections are collapsed by default (accordion).
   - On desktop (≥ 768px), expand all sections by default.
   - Preserve all existing state management — only the container wrapping changes.

5. For forms with image upload (gallery, profile photo, real wedding photos):
   - Add `capture="environment"` to file inputs that accept photos.
   - Show upload dropzone full-width on mobile.
   - Image previews: use CSS grid `grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))`.
```

---

### Prompt 7: Responsive Table Fixes

```
You are working on the HappyWedz React frontend.

Fix all data tables for mobile responsiveness.

FILES TO FIX:
- `src/components/pages/userDashboard/Guests.jsx`
- Budget management component (uses `useBudget.js`)
- `src/components/pages/adminVendor/EnquiryManagement.jsx`
- `src/components/pages/adminVendor/VendorLeadsPage.jsx`
- `src/components/pages/adminVendor/ReviewsPage.jsx`

REQUIREMENTS:
- Preserve all table data rendering, sort/filter logic, pagination, API calls, action handlers.
- Do NOT change any state management or API logic.

CHANGES:

Phase 1 (apply to all files — minimum viable):
1. Wrap every `<table>` or MUI `<Table>` in:
   ```html
   <div style={{width:'100%', overflowX:'auto', WebkitOverflowScrolling:'touch'}}>
     {/* table here */}
   </div>
   ```
2. Add `white-space: nowrap` to `<th>` cells to prevent header text wrapping.
3. All action buttons in table rows: `min-height: 44px; min-width: 44px;`

Phase 2 (apply to Guests and Budget — card transform):
4. Add `data-label="Column Name"` attribute to each `<td>`, matching its corresponding `<th>`.
5. Add CSS:
   ```css
   @media (max-width: 767px) {
     .responsive-table thead { display: none; }
     .responsive-table tr { display: block; margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; }
     .responsive-table td { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border: none; font-size: 0.875rem; }
     .responsive-table td::before { content: attr(data-label); font-weight: 600; color: #666; margin-right: 1rem; flex-shrink: 0; }
   }
   ```
6. Add `className="responsive-table"` to each `<table>`.
```

---

### Prompt 8: Responsive Card Fixes

```
You are working on the HappyWedz React frontend.

Fix vendor/venue/matrimonial profile cards for consistent responsive behavior across all three listing systems.

FILES TO FIX:
- All card components in `src/components/layouts/Main/`
- All card components in `src/components/layouts/vendors/`
- All card components in `src/components/layouts/venus/`
- E-invite template cards in `src/components/layouts/einvites/`
- Matrimonial profile cards in `src/components/pages/matrimonial/`

REQUIREMENTS:
- Preserve all card data rendering, wishlist toggle handlers, Redux wishlist state, navigate/link behavior.
- Do NOT change any API data mapping or event handlers.

CHANGES:

1. Card grid wrapper (in parent list components):
   ```css
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
   gap: 1rem;
   ```

2. Individual card CSS:
   ```css
   .hw-card {
     border-radius: 12px;
     overflow: hidden;
     display: flex;
     flex-direction: column;
     box-shadow: 0 2px 8px rgba(0,0,0,0.08);
   }
   .hw-card-image {
     aspect-ratio: 4/3;
     overflow: hidden;
   }
   .hw-card-image img {
     width: 100%; height: 100%; object-fit: cover;
     transition: transform 0.3s;
   }
   .hw-card-body {
     padding: 1rem;
     flex: 1;
     display: flex;
     flex-direction: column;
     gap: 0.5rem;
   }
   .hw-card-actions {
     margin-top: auto;
     display: flex;
     gap: 0.5rem;
     flex-wrap: wrap;
   }
   .hw-card-actions button,
   .hw-card-actions a {
     flex: 1;
     min-height: 44px;
     min-width: 80px;
   }
   ```

3. Add `loading="lazy"` to all `<img>` tags inside cards. This is not a performance optimization feature — it prevents images from blocking mobile paint.

4. Wishlist heart button: ensure it is min 44×44px with padding, not just an icon.
```

---

### Prompt 9: Responsive Image Fixes

```
You are working on the HappyWedz React frontend.

Fix all image rendering for mobile responsiveness.

GLOBAL CHANGES (apply to global CSS file imported in src/main.jsx):
1. Add:
   ```css
   img, video, canvas, iframe { max-width: 100%; height: auto; }
   html, body { overflow-x: hidden; }
   ```

SPECIFIC FIXES:

src/components/auth/CustomerLogin.jsx:
1. The hero/background image on the left column:
   - Hide the image column on screens < 768px (display: none).
   - For the image itself, use a `<picture>` element:
     ```html
     <picture>
       <source srcSet="/images/login-mobile.webp" media="(max-width: 767px)" />
       <source srcSet="/images/login-tablet.webp" media="(max-width: 1023px)" />
       <img src="/images/login-desktop.jpg" alt="Wedding" />
     </picture>
     ```
   Note: This requires creating compressed image variants. Name them login-mobile.webp (max 100KB), login-tablet.webp (max 300KB). Place them in public/images/.

src/components/layouts/Main/* (vendor card images):
2. Use aspect-ratio containers: `aspect-ratio: 4/3; overflow: hidden;`
3. img inside: `width: 100%; height: 100%; object-fit: cover;`

src/components/home/Hero* (hero section):
4. Background hero image: use `background-image` with media-query-based size variants.
5. Text overlay: use clamp() font sizes.

AI Design Studio images (FiltersPage, FinalLookPage):
6. Remove hardcoded width/height on processed AI images.
7. Apply `width: 100%; max-width: 480px; aspect-ratio: 3/4; object-fit: cover;`.

```

---

### Prompt 10: Responsive Mobile Navigation (Bottom Nav)

```
You are working on the HappyWedz React frontend.

Implement a mobile bottom navigation bar for the User Dashboard on screens < 768px.

FILES TO MODIFY:
- `src/components/pages/userDashboard/UserDashboardMain.jsx`
- `src/components/layouts/UserDashboardNavbar.jsx`

REQUIREMENTS:
- Preserve ALL existing tab navigation logic, slug routing, Redux state.
- This is an ADDITIVE change — the existing navigation remains for desktop.
- Do NOT change any route paths or Redux selectors.

IMPLEMENTATION:

1. Create a constant for the 5 primary mobile tabs:
   ```js
   const MOBILE_PRIMARY_TABS = [
     { slug: 'my-wedding', label: 'Home', icon: HomeIcon },
     { slug: 'checklist', label: 'Checklist', icon: CheckIcon },
     { slug: 'budget', label: 'Budget', icon: MoneyIcon },
     { slug: 'guests', label: 'Guests', icon: PeopleIcon },
     { slug: 'message', label: 'Messages', icon: MessageIcon },
   ];
   ```
   Use icons from the already-installed `react-icons` or `lucide-react` packages.

2. Create a `DashboardBottomNav` component:
   - Fixed position: bottom: 0; left: 0; right: 0;
   - Height: calc(60px + env(safe-area-inset-bottom, 0px))
   - Padding-bottom: env(safe-area-inset-bottom, 0px)
   - Background: white; border-top: 1px solid #e0e0e0; z-index: 500;
   - Display 5 icon+label nav items.
   - A "More" item (6th position) opens the existing full tab navigation in a bottom sheet.
   - Active item has brand color highlight.
   - Each item: min-height 44px, flex: 1, display: flex, flex-direction: column, align-items: center.

3. In `UserDashboardMain.jsx`:
   - Render `<DashboardBottomNav>` conditionally when `useMediaQuery('(max-width: 767px)')`.
   - Add `paddingBottom: 'calc(60px + env(safe-area-inset-bottom, 0px))'` to the main content wrapper on mobile.

4. Keep the existing `UserDashboardNavbar` for desktop (≥ 768px). On mobile, it can be hidden (display: none via CSS) or not rendered.
```

---

### Prompt 11: Responsive Spacing System

```
You are working on the HappyWedz React frontend.

Implement a responsive spacing system and apply it to layout components.

STEP 1 — Create `src/styles/spacing.css` with:
```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.25rem;  --space-6: 1.5rem;
  --space-8: 2rem;     --space-10: 2.5rem;  --space-12: 3rem;
  --space-16: 4rem;    --space-20: 5rem;    --space-24: 6rem;

  /* Responsive section padding */
  --section-py: clamp(2rem, 4vw, 5rem);
  --section-px: clamp(1rem, 4vw, 3rem);
}
```

STEP 2 — Import `spacing.css` in `src/main.jsx` (after global CSS, before Bootstrap).

STEP 3 — Apply `--section-py` and `--section-px` to home page section wrappers:
- In `src/components/home/*.jsx`, replace hardcoded `padding: 80px 0` or `py-5` Bootstrap classes with `padding: var(--section-py) var(--section-px)` in the section wrapper style.
- This automatically scales from `2rem` on 320px to `5rem` on 1440px without any media queries.

STEP 4 — Replace large hardcoded margin values:
- Anywhere in home or layout CSS you see `margin-top: 80px` or `padding: 60px 30px`, replace with spacing variables.
- Focus on: `src/components/home/*.css`, `src/components/layouts/Header.css` (if it exists).

DO NOT:
- Change any business logic.
- Change any JavaScript.
- Remove Bootstrap classes from components (those can coexist for now).
- Touch dashboard or listing pages in this prompt (handled separately).
```

---

### Prompt 12: Responsive Typography System

```
You are working on the HappyWedz React frontend.

Implement fluid responsive typography.

STEP 1 — Create `src/styles/typography.css` with:
```css
:root {
  --text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
  --text-sm:   clamp(0.875rem, 0.8rem  + 0.37vw, 1rem);
  --text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
  --text-lg:   clamp(1.125rem, 1rem    + 0.5vw,  1.25rem);
  --text-xl:   clamp(1.25rem,  1rem    + 1vw,    1.5rem);
  --text-2xl:  clamp(1.5rem,   1rem    + 2vw,    2rem);
  --text-3xl:  clamp(1.75rem,  1rem    + 3vw,    2.5rem);
  --text-4xl:  clamp(2rem,     1rem    + 4vw,    3.5rem);
  --text-5xl:  clamp(2.5rem,   1rem    + 5vw,    4.5rem);
}
```

STEP 2 — Import `typography.css` in `src/main.jsx`.

STEP 3 — Update `src/theme/muiTheme.js`:
Add to the theme's `typography` section:
```js
h1: { fontSize: 'var(--text-5xl)', fontWeight: 700 },
h2: { fontSize: 'var(--text-4xl)', fontWeight: 700 },
h3: { fontSize: 'var(--text-3xl)', fontWeight: 600 },
h4: { fontSize: 'var(--text-2xl)', fontWeight: 600 },
h5: { fontSize: 'var(--text-xl)',  fontWeight: 600 },
h6: { fontSize: 'var(--text-lg)',  fontWeight: 500 },
body1: { fontSize: 'var(--text-base)' },
body2: { fontSize: 'var(--text-sm)'  },
```

STEP 4 — Apply to home page hero headings:
In the Hero section component, change hardcoded `font-size: 48px` or similar to `font-size: var(--text-5xl)`.

STEP 5 — Apply to section headings across home page components:
Replace `font-size: 32px` → `var(--text-3xl)`, `font-size: 24px` → `var(--text-2xl)`.

DO NOT:
- Change any content or copy.
- Change any font-family settings.
- Touch non-heading/body typography in dashboard tables or forms (those have their own min 16px requirements handled separately).
```

---

## 8. Safe Migration Strategy

### 8.1 What to Fix First (Priority Order)

**Phase 0 — Foundation (Week 1, 2 days):**
No UI changes. Pure CSS additions that are risk-free:
1. Create `src/styles/breakpoints.css`, `breakpoints.js`, `spacing.css`, `typography.css`.
2. Import them in `src/main.jsx` (after Bootstrap CSS, before app CSS).
3. Add global image baseline (`img { max-width: 100%; height: auto; }`).
4. Add `overflow-x: hidden` to `html, body`.
5. Update `src/theme/muiTheme.js` with aligned breakpoints.

**Risk:** Near zero. These are additive CSS custom properties and a global image rule.

---

**Phase 1 — Critical User Paths (Weeks 1–2):**
Fix issues that directly block users from core actions:

1. **Header mobile navigation** (P0) — 2 days
2. **Login page image** (P0) — 0.5 days (hide image column on mobile)
3. **Filter sidebar → mobile drawer** (P0) — 2 days
4. **Listing card grid** (P0) — 1 day (apply `card-grid` class across all 3 listing systems)
5. **Wedding website templates mobile audit** (P0) — 2 days

---

**Phase 2 — Dashboard Mobile (Weeks 3–4):**
Fix dashboard core functionality on mobile:

1. **User dashboard tab nav** — 1 day
2. **User dashboard bottom nav** — 1.5 days
3. **Vendor dashboard tab nav** — 1 day
4. **Responsive table wrappers** (Phase 1: overflow-x only) — 1 day
5. **Responsive modal fullscreen** — 1 day (add `fullscreen="md-down"` to all Bootstrap modals)
6. **Form font-size fix** (iOS zoom prevention) — 0.5 days

---

**Phase 3 — Feature Areas (Weeks 5–6):**
Fix feature-specific responsive issues:

1. Design studio responsive layout
2. Travel hero search form
3. Matrimonial registration accordion
4. E-invite editor mobile fallback
5. HomeGennie safe-area fix
6. Fluid typography rollout to home page sections

---

**Phase 4 — Polish & Table Card Transforms (Weeks 7–9):**
Advanced mobile UX:

1. Responsive table card transforms (Phase 2 of table fix)
2. Dashboard bottom nav polish
3. Template gallery mobile gestures
4. Ultra-wide (2560px+) container max-width cap
5. Foldable viewport handling
6. Landscape mobile orientation testing

### 8.2 Risky Responsive Areas

These areas require extra care to avoid breaking existing functionality:

| Area | Risk | Mitigation |
|---|---|---|
| Header category navigation | Category links must continue routing to correct sections. Test each vendor type link. | Preserve all `to={...}` props exactly. Only change container/display CSS. |
| Dashboard slug routing | Any change to the navigation must still call `navigate('/user-dashboard/slug')` exactly. | Test every dashboard section navigates correctly after tab nav refactor. |
| Filter sidebar state | Filter Redux state must not be affected by the drawer wrapper. | The `FilterSidebarWrapper` only wraps children; no Redux interaction. |
| Fabric.js canvas editor | Canvas size changes break the editor. | Only detect mobile and render alternative; never resize the canvas on mobile. |
| Wedding website templates | Templates render client-delivered wedding websites. Breaking them has real-world impact. | Test each of the 3 templates (floral, modern, royal) on iOS Safari and Android Chrome before and after changes. |
| Vendor listing URLs | Filter changes that persist to URL must still work correctly on mobile. | Don't touch URL query string logic. |

### 8.3 Regression Prevention

1. **Snapshot testing approach:** Before starting Phase 1, take screenshots of every major page at 375px, 768px, and 1280px using browser DevTools device emulation. Store them as baseline reference.

2. **Test checklist per change:** After each component fix, test at minimum: 375px portrait, 768px portrait, 1280px desktop.

3. **Do not change:** Any JavaScript logic, Redux actions, API calls, route paths, localStorage keys, or form field names in the responsive refactoring PRs. CSS and JSX structural changes only.

4. **Feature flags:** For the mobile drawer filter and dashboard bottom nav — consider wrapping in a feature flag (`VITE_MOBILE_NAV=true`) so it can be toggled off quickly if a regression is discovered in production.

### 8.4 Safe Migration per File

- **Never rewrite** a component to fix its responsive issues. Add responsive CSS classes, wrap elements in responsive containers, use conditional rendering with `useMediaQuery`. Preserve the inner component logic.
- **CSS changes** should always be additive (adding new classes, adding new media queries) rather than modifying existing selectors where possible.
- **When adding `useMediaQuery`** to a component: import from MUI (already a dependency) rather than adding a new hook utility. `import useMediaQuery from '@mui/material/useMediaQuery'`.

---

## 9. Responsive Testing Checklist

### 9.1 Device Simulation Matrix

Test every page category against these breakpoints using browser DevTools:

| Breakpoint | Represents | Bootstrap Class | MUI Key |
|---|---|---|---|
| 320px | Small Android phones, iPhone SE 1st gen | — | xs |
| 375px | iPhone 14 Mini, most common small phone | — | xs |
| 390px | iPhone 14/15 Pro | — | xs |
| 430px | iPhone 14 Plus | sm | sm |
| 480px | Large Android phones | sm | sm |
| 540px | Surface Duo single screen | sm | sm |
| 768px | iPad Mini portrait, Android tablet | md | md |
| 820px | iPad Air portrait | md | md |
| 1024px | iPad Pro portrait, iPad Air landscape | lg | lg |
| 1280px | Small laptops, iPad Pro landscape | xl | xl |
| 1440px | Standard desktop | xl | xl |
| 1920px | Full HD | xxl | — |
| 2560px | Ultrawide | xxl | — |

### 9.2 Browser Testing Matrix

| Browser | Platform | Key Issues to Check |
|---|---|---|
| Safari | iOS 16, 17 | Safe area insets, 100vh bug, input zoom, position:fixed in scroll |
| Chrome | Android 12, 13 | Touch events, bottom nav bar overlap |
| Samsung Internet | Samsung Galaxy | Custom scrollbar, viewport handling |
| Chrome | Desktop | General baseline |
| Safari | macOS | Flex/grid rendering differences from Chrome |
| Firefox | Desktop | Scrollbar width affects layouts |
| Edge | Desktop | Generally close to Chrome |

### 9.3 Page-by-Page Test Cases

**Home Page:**
- [ ] Hero section text fits without overflow at 320px
- [ ] Category grid is 2 columns at 375px, 4 at 768px
- [ ] Carousels swipe on touch
- [ ] Newsletter form stacks vertically at < 480px
- [ ] HomeGennie button doesn't overlap iOS home bar
- [ ] Statistics row wraps at < 480px

**Header Navigation:**
- [ ] Hamburger menu visible at < 1024px
- [ ] Mobile drawer opens and closes correctly
- [ ] All category links work from mobile drawer
- [ ] City selector opens and functions on mobile
- [ ] Auth buttons accessible in mobile drawer
- [ ] No horizontal scroll caused by header

**Vendor Listing:**
- [ ] Sidebar is hidden and "Filters" FAB visible on mobile
- [ ] Filters drawer opens from FAB
- [ ] Filter state applies correctly after closing drawer
- [ ] Vendor cards display 1 column at 375px, 2 at 600px, 3 at 1024px
- [ ] Map view has proper height on mobile
- [ ] Load more / infinite scroll works on touch

**User Dashboard:**
- [ ] All 10 tabs accessible via scroll or select on mobile
- [ ] Budget table: horizontal scroll works
- [ ] Guest list table: horizontal scroll or card view works
- [ ] Messages: conversation list and message thread work on mobile
- [ ] Checklist: items are tappable with 44px targets
- [ ] Profile form: single column on mobile, inputs don't zoom

**Vendor Dashboard:**
- [ ] All vendor tabs accessible on mobile
- [ ] Enquiry table: scrollable on mobile
- [ ] Storefront form: single column on mobile
- [ ] Gallery upload: works on mobile
- [ ] Reviews: readable and actionable on mobile

**Modals:**
- [ ] Pricing modal: fullscreen on mobile, no overflow
- [ ] Auth modals: fullscreen on mobile
- [ ] All modal inputs: no iOS zoom on focus
- [ ] Close button: 44px touch target

**Wedding Templates:**
- [ ] Floral template: mobile menu works, all sections readable
- [ ] Modern template: mobile menu works, RSVP form functional
- [ ] Royal template: mobile menu works, countdown timer fits

**Design Studio:**
- [ ] Upload selfie uses front camera on mobile
- [ ] AI image preview fills width on mobile
- [ ] Product filter chips scrollable on mobile
- [ ] Final look comparison: touch swipeable

**Travel:**
- [ ] Flight search form: stacked vertically on mobile
- [ ] Search results: readable on mobile
- [ ] Razorpay payment: checkout button 44px
- [ ] Hotels page: card grid responsive

**E-Invite:**
- [ ] Template browsing grid responsive
- [ ] Editor: mobile fallback message shown
- [ ] Share page: share buttons accessible
- [ ] Public e-invite: displays on mobile

### 9.4 Horizontal Scroll Check

On every page at every breakpoint:

```js
// In browser console, check for horizontal scroll cause:
document.querySelectorAll('*').forEach(el => {
  if (el.offsetWidth > document.body.offsetWidth) {
    console.log('Overflow:', el, el.offsetWidth);
  }
});
```

Run this script at 375px on every major route. Fix every element that causes overflow.

### 9.5 Orientation Tests

- [ ] All listing pages rotate from portrait to landscape without breaking
- [ ] Dashboard tabs reflow correctly in landscape
- [ ] Modals: in landscape on iPhone (landscape = ~667px wide, ~375px tall), modals must be scrollable vertically
- [ ] Hero sections in landscape: min-height must not force a massive scrollable gap

---

## 10. Enterprise Responsive Recommendations

### 10.1 Establish a Responsive Design Token Standard

Create a `src/styles/` directory as the single source of truth:

```
src/styles/
  breakpoints.css     ← Canonical breakpoints as CSS vars
  breakpoints.js      ← Same breakpoints as JS (for MUI, useMediaQuery)
  spacing.css         ← Spacing scale
  typography.css      ← Fluid clamp() type scale
  containers.css      ← Container width and padding system
  tokens.css          ← Color, radius, shadow design tokens
  reset.css           ← Minimal responsive reset additions
  index.css           ← Imports all style modules
```

Import `src/styles/index.css` once in `src/main.jsx`.

### 10.2 Create a Responsive Component Library

The project already has `src/components/ui/` with loaders, shimmer states, and error states. Extend this with responsive primitives:

```
src/components/ui/
  ResponsiveGrid.jsx        ← Generic auto-fill card grid
  ResponsiveTable.jsx       ← Table with horizontal scroll + card transform
  BottomSheet.jsx           ← Reusable mobile bottom sheet
  Drawer.jsx                ← Reusable overlay drawer (for filter sidebar, mobile nav)
  TouchTarget.jsx           ← Wrapper ensuring 44px minimum targets
  ResponsiveModal.jsx       ← Bootstrap/MUI modal with fullscreen-on-mobile
  MobileSelect.jsx          ← Native select on mobile, custom dropdown on desktop
```

These primitives prevent responsive debt from accumulating in new features.

### 10.3 Responsive Architecture Rules for New Development

Establish these as team standards:

1. **Mobile-first CSS:** All new components start with mobile styles. Desktop styles are added inside `@media (min-width: ...)`.
2. **No fixed widths** on containers. Use `max-width` + `width: 100%`.
3. **No hardcoded heights** except for media elements with aspect-ratio containers.
4. **All inputs ≥ 16px** font-size.
5. **All touch targets ≥ 44px**.
6. **Images always** in aspect-ratio containers with `object-fit: cover`.
7. **Tables always** wrapped in horizontal-scroll containers or using card-transform pattern.
8. **Modals always** use `fullscreen="md-down"` (Bootstrap) or `fullScreen={useMediaQuery(theme.breakpoints.down('md'))}` (MUI).
9. **New carousels** only use Swiper.js.
10. **Spacing** only uses `--space-*` variables, not hardcoded `px`.

### 10.4 Foldable & Split-Screen Support

For Samsung Galaxy Fold and split-screen mode, the layout must not rely on minimum widths. The key rule: every layout must work from 240px. Test at 280px using Chrome DevTools custom device size. The auto-fill grid pattern (`minmax(min(280px, 100%), 1fr)`) naturally handles 280px by collapsing to a single column.

For split-screen (typically 50% of 375px = ~187px), add:

```css
@media (max-width: 280px) {
  :root {
    --spacing-container-x: 0.75rem;
    font-size: 14px;
  }
  .dashboard-tab-nav .tab-item {
    font-size: 0.7rem;
    padding: 0.5rem;
  }
}
```

### 10.5 Ultra-Wide Display Cap

On 3440px and 3840px monitors, content should not stretch across the full width. The container system (Section 4.2) handles this with `max-width: 2000px` at `≥ 2560px`. Additionally:

```css
/* Prevent hero images from stretching on ultra-wide */
.hero-image {
  max-width: 100%;
  object-position: center;
  object-fit: cover;
}

/* Two-column layouts: cap the content columns */
.listing-layout {
  max-width: var(--container-max-width);
  margin: 0 auto;
}
```

### 10.6 Accessibility and Responsive Typography Interaction

When users increase browser font size via accessibility settings (common for elderly wedding planning users), `rem`-based sizes scale correctly. The `clamp()` fluid typography also respects user font size preferences because it uses `rem` as the base unit. Confirm in browser by setting font size to 200% in Chrome Settings and verifying the layout doesn't break.

The `max(16px, 1rem)` rule on inputs is especially important for accessibility: at 200% browser font size, `1rem = 32px`, which keeps the input font large and readable while still preventing iOS zoom (since it's above 16px).

### 10.7 Responsive Testing Automation

While CI/CD is not currently in the project, add this to the future CI pipeline recommendation:

- **Playwright** or **Cypress** with viewport testing: define a test that visits each major route at `[375, 768, 1280]px` widths and checks for `document.body.scrollWidth <= window.innerWidth` (no horizontal scroll).
- **Percy** or **Chromatic** visual regression testing: capture responsive snapshots before and after each PR.

### 10.8 Image Optimization Companion Work

While this plan focuses only on responsiveness (not performance), two image changes are inseparable from responsiveness:

1. The **12.8 MB login image** will make the login page entirely unusable on a 4G mobile connection. Creating a 100KB mobile variant is not a performance optimization — it is making the page functional on mobile. It belongs in this responsive work.

2. **Hero images** on the home page served at 2400px resolution to a 375px device will cause layout instability during load (images pop in and shift layout). Using `srcset` with appropriately sized variants is part of ensuring the layout behaves correctly on mobile, not just loads fast.

These two items should be included in Phase 1 of this migration.

---

*End of HappyWedz React Enterprise Mobile Responsiveness Implementation Plan*

*Version 1.0 | Generated 2026-05-13*
