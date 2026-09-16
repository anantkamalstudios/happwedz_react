# Vendor Facilities & Features Workflow Guide

This document explains the end-to-end workflow of how vendor-specific "Facilities & Features" (like the Venue or Wedding Planner Master Profile) are structured, fetched, rendered, and saved in the HappyWedz application. 

Follow this exact process when adding a new vendor type (e.g., Photography, Makeup Artist, Decorator) based on the requirement documents (DOCX files).

---

## 1. Requirement Analysis (DOCX to Data Structure)

Before writing any code, analyze the provided DOCX file for the specific vendor (e.g., `Decorators.docx`). Identify the following for each question:
- **Data Type:** Is it a single-select (Dropdown/Radio), multi-select (Checkboxes), yes/no toggle, or text/number input?
- **Grouping:** How are the questions logically grouped (e.g., Identity, Services Offered, Pricing, Workflow)?
- **"Other" Option:** Does the field require a custom "Please specify" text input if the user selects "Other"?

---

## 2. Create the Constants File

Create a file named `[vendorType]MasterConstants.js` (e.g., `weddingPlannerMasterConstants.js` or `decoratorMasterConstants.js`) in the `src/components/pages/adminVendor/subVendors/` directory.

### Step 2.1: Define Option Arrays
Export arrays for every single-select or multi-select question found in the DOCX.
```javascript
export const PLANNER_TYPES = ["Full Service", "Partial Planning", "Day of Coordination", "Consultation only"];
```

### Step 2.2: Define the Empty State Structure
Create and export a function that returns the default JSON structure for this vendor's data. This ensures the UI never crashes due to undefined nested properties.
```javascript
export function emptyDecoratorMaster() {
  return {
    identity: {
      brand_artist_name: "",
      years_of_experience: "",
    },
    // ... other sections mapped exactly to DOCX
  };
}
```

---

## 3. Create the UI Component

Create a file named `[VendorType]MasterProfile.jsx` (e.g., `DecoratorMasterProfile.jsx`) in `src/components/pages/adminVendor/subVendors/`.

### Step 3.1: Reusable Form Controls
Use the reusable helper components that handle standard UI patterns (found in existing master profiles):
- `<MultiCheck>` for multi-select arrays.
- `<SelectField>` for single-select dropdowns.
- `<YesNoField>` for quick boolean-like radios.

### Step 3.2: State Management & Merging
Use a `mergeDeep` function and `useMemo` to safely merge the data fetched from the API with your empty state structure.
```javascript
  const dm = useMemo(() => {
    const raw = formData.decorator_master || formData.attributes?.decorator_master;
    if (raw && typeof raw === "object") return mergeDeep(emptyDecoratorMaster(), raw);
    return emptyDecoratorMaster();
  }, [formData.decorator_master, formData.attributes?.decorator_master]);
```

### Step 3.3: The `patch` Update Function
Create a `patch` function that immutably updates the nested vendor master object inside the global `formData`. Match the exact logic used in other master profiles.
```javascript
  const patchDm = useCallback(
    (partial) => {
      setFormData((prev) => {
        const current =
          prev.decorator_master ||
          prev.attributes?.decorator_master ||
          emptyDecoratorMaster();
        const next = mergeDeep(current, partial);
        return {
          ...prev,
          decorator_master: next,
          attributes: { ...(prev.attributes || {}), decorator_master: next },
        };
      });
    },
    [setFormData]
  );
```

### Step 3.4: Build the Accordion UI
Map over your constants and use the helper components inside Bootstrap `<Accordion>` wrappers.

---

## 4. Register the Component in `VendorFacilities.jsx`

Open `src/components/pages/adminVendor/subVendors/VendorFacilities.jsx`.

### Step 4.1: Add the Logic Check
Add a string matching check to determine if the logged-in vendor matches your new type.
```javascript
  const isDecorator =
    normalizedType.includes("decorator") ||
    normalizedType.includes("decor") ||
    normalizedType.includes("event styling");
```

### Step 4.2: Add to `hasMasterProfile`
Include the new check in the `hasMasterProfile` boolean.
```javascript
  const hasMasterProfile = isVenue || isCaterer || isPhotographer || isMakeupArtist || isWeddingPlanner || isDecorator;
```

### Step 4.3: Render the Component
Conditionally render your new component in the return block.
```javascript
      {isDecorator && (
        <DecoratorMasterProfile
          formData={formData}
          setFormData={setFormData}
          onSave={onSave}
          onShowSuccess={onShowSuccess}
        />
      )}
```

---

## 5. Map Data in `Storefront.jsx` (CRITICAL STEP)

Open `src/components/pages/adminVendor/Storefront.jsx`. This acts as the central orchestrator for saving data to the API.

### Step 5.1: Map in `fetchServiceData`
In the `fetchServiceData` function, find where `actualData.attributes` is mapped and ensure your new key is initialized.
```javascript
decorator_master: actualData.attributes.decorator_master || {},
```

### Step 5.2: Map in `buildAttributes`
In the `buildAttributes` function, map your new key so it's included in the JSON payload sent to the backend.
```javascript
      decorator_master:
        formData.decorator_master ||
        formData.attributes?.decorator_master ||
        undefined,
```

---

## Summary Checklist for New Vendor Types:
1. [ ] Parse DOCX into JavaScript Arrays in `[vendor]MasterConstants.js`.
2. [ ] Define `empty[Vendor]Master()` with full JSON hierarchy.
3. [ ] Create `[Vendor]MasterProfile.jsx` UI using Accordions and Helpers.
4. [ ] Implement `mergeDeep` and `patch[Vendor]` for state updates.
5. [ ] Register the conditional logic and component in `VendorFacilities.jsx`.
6. [ ] Map the new `[vendor]_master` key in `Storefront.jsx` (fetch and save payload).
