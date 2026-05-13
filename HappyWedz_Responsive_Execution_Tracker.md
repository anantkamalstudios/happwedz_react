# HappyWedz Responsive Execution Tracker

Use this tracker with `HappyWedz_Mobile_Responsiveness_Plan.md` to ensure execution completeness.

---

## 1) Rules of Execution

- One task = one file/component scope with clear acceptance criteria.
- Do not mark complete without screenshot/video evidence.
- Validate each task across required breakpoints and UI states.
- Phase order: `P0 (Critical)` -> `P1 (High)` -> `P2 (Medium/Polish)`.

---

## 2) Required Breakpoints Matrix

| Category | Widths |
|---|---|
| Small phones | 240, 280, 320, 360 |
| Standard phones | 375, 390, 414, 430 |
| Large phones | 480, 540, 600 |
| Tablets | 768, 820, 853, 912, 1024 |
| Desktop/Laptop | 1280, 1366, 1440, 1536, 1600, 1728, 1920 |
| Ultra-wide | 2560, 3440, 3840 |

---

## 3) Required State Coverage

| State | Required |
|---|---|
| Default | Yes |
| Loading | Yes |
| Empty | Yes |
| Error | Yes |
| Modal open | Yes (where applicable) |
| Drawer/sidebar open | Yes (where applicable) |
| Table long-content | Yes (where applicable) |
| Authenticated | Yes (where applicable) |
| Unauthenticated | Yes (where applicable) |
| Admin/Vendor/User role variants | Yes (where applicable) |

---

## 4) Phase Plan (Tailored to current codebase)

## Phase P0 - Critical Blocking Responsive Issues

| ID | File/Component | Issue Theme | Owner | Status | PR/Commit |
|---|---|---|---|---|---|
| P0-01 | `src/components/layouts/Header.jsx` | Navbar + mega menu overflow/collapse |  | Not Started |  |
| P0-02 | `src/components/layouts/MainLayout.jsx` | Fixed floating widget overlap (`HomeGennie`) |  | Not Started |  |
| P0-03 | `src/components/pages/userDashboard/guests/Guests.jsx` + `src/App.css` | Guest table + controls mobile usability |  | Not Started |  |
| P0-04 | `src/components/pages/designStudio/TryLanding.jsx` | Hero height/CTA clipping + modal layout |  | Not Started |  |
| P0-05 | `src/components/pages/Travels/honeymoon/FlightSearchResults.jsx` | Flight result card/mobile modal responsiveness |  | Not Started |  |

## Phase P1 - High Priority Structural Issues

| ID | File/Component | Issue Theme | Owner | Status | PR/Commit |
|---|---|---|---|---|---|
| P1-01 | `src/components/layouts/vendors/Navbar.jsx` | Vendor dashboard nav compression |  | Not Started |  |
| P1-02 | `src/components/pages/adminVendor/movments-plus/tokens-sharing.css` | Duplicate modal/table responsive rules |  | Not Started |  |
| P1-03 | `src/components/layouts/LocationModalWithCategories.jsx` | Modal content density on phones |  | Not Started |  |
| P1-04 | `src/components/pages/WeddingWebsiteView.jsx` | Share modal + template wrapper responsiveness |  | Not Started |  |
| P1-05 | `src/templates/components/MobileMenu/style.css` | Conflicting drawer definitions |  | Not Started |  |

## Phase P2 - Consistency and UX Polish

| ID | File/Component | Issue Theme | Owner | Status | PR/Commit |
|---|---|---|---|---|---|
| P2-01 | `src/components/pages/matrimonial/dashboard/MatrimonialDashboard.jsx` | Sidebar-to-mobile adaptation quality |  | Not Started |  |
| P2-02 | Cross-dashboard forms | Touch target and spacing standardization |  | Not Started |  |
| P2-03 | Global modals | Unified responsive modal shell standards |  | Not Started |  |
| P2-04 | Image sections/templates | Overflow/stretch consistency |  | Not Started |  |

---

## 5) File-Level Task Card Template

Copy this block for every implementation ticket.

```md
### Task ID: P0-XX

**File(s):**
- `path/to/file`

**Issue:**
- 

**Root cause:**
- 

**Implementation steps (precise):**
1. 
2. 
3. 

**Breakpoint acceptance criteria:**
- [ ] 240-360: no horizontal scroll, controls usable
- [ ] 375-430: no overlap, text readable
- [ ] 768-1024: tablet layout stable
- [ ] 1280+: no over-stretch/awkward whitespace

**State acceptance criteria:**
- [ ] Default
- [ ] Loading
- [ ] Empty
- [ ] Error
- [ ] Modal/Drawer open (if any)
- [ ] Role-based variants (if any)

**Non-functional checks:**
- [ ] Touch targets >= 44x44
- [ ] Keyboard/zoom accessibility not broken
- [ ] No regression in routing/business logic

**Evidence:**
- Before screenshots:
- After screenshots:
- Video (optional):

**Result:**
- Status: Not Started / In Progress / Blocked / Done
- PR:
- Reviewer:
```

---

## 6) Breakpoint QA Run Sheet

Use per page/component after each task.

| Screen/Page | 240 | 320 | 375 | 430 | 768 | 912 | 1024 | 1280 | 1920 | 3440 | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Home + Header | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Listing + Filters | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| User Dashboard | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Vendor Dashboard | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Design Studio | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Travels (Flights) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Wedding Website View | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Modals (Global) | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |  |

Legend: `⬜ Not tested` `🟨 Partial` `✅ Pass` `❌ Fail`

---

## 7) State-by-State QA Matrix

| Component/Page | Default | Loading | Empty | Error | Modal Open | Drawer Open | Auth | Admin | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Header/Nav | ⬜ | N/A | N/A | N/A | ⬜ | ⬜ | ⬜ | ⬜ |  |
| Guests | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | N/A | ⬜ | N/A |  |
| Vendor Navbar | ⬜ | N/A | N/A | N/A | N/A | ⬜ | N/A | ⬜ |  |
| Tokens & Sharing | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | N/A | N/A | ⬜ |  |
| Flights Results | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | N/A |  |
| Wedding Website View | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | N/A | ⬜ | N/A |  |

---

## 8) Browser and Device Matrix

| Browser | Desktop | Mobile | Status | Notes |
|---|---|---|---|---|
| Chrome | Yes | Android Chrome | ⬜ |  |
| Safari | macOS Safari | iOS Safari | ⬜ |  |
| Firefox | Yes | Android Firefox (optional) | ⬜ |  |
| Edge | Yes | N/A | ⬜ |  |
| Samsung Internet | N/A | Yes | ⬜ |  |

---

## 9) Regression Checklist (Must Pass Before Phase Closure)

- [ ] No horizontal scrolling on key pages at required breakpoints
- [ ] No clipped modal content or inaccessible modal actions
- [ ] No broken nav/drawer behavior after responsive changes
- [ ] Tables readable and operable on mobile
- [ ] Auth pages still submit and validate correctly
- [ ] Admin/vendor dashboards keep all existing business logic
- [ ] Loading/empty/error states remain visible and aligned
- [ ] Touch targets >= 44px for primary actions
- [ ] No new console errors from responsive refactors
- [ ] Existing routing and API integrations unchanged

---

## 10) Weekly Execution Summary

| Week | Planned | Completed | Blockers | Carry Forward |
|---|---|---|---|---|
| Week 1 |  |  |  |  |
| Week 2 |  |  |  |  |
| Week 3 |  |  |  |  |

---

## 11) Final Sign-Off

- Engineering Lead:  
- QA Lead:  
- Product Sign-off:  
- Date:  
- Release tag:  

