# Airport Dropdown Debug Guide

## Changes Made to Fix Dropdown Issues

### 1. CSS Fixes

#### Fixed Overflow Issues
```css
/* Before */
.tj-search-row {
  overflow: hidden;  /* This was clipping the dropdown! */
}

/* After */
.tj-search-row {
  overflow: visible;  /* Allows dropdown to show outside */
  position: relative;
}

.tj-search-card {
  overflow: visible;  /* Parent also needs visible overflow */
}
```

#### Enhanced Dropdown Visibility
```css
.tj-suggestions-dropdown {
  position: absolute;
  top: calc(100% + 4px);  /* 4px gap below input */
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--tj-orange);  /* Orange border for visibility */
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);  /* Stronger shadow */
  max-height: 300px;
  overflow-y: auto;
  z-index: 2000;  /* Very high z-index */
  min-width: 300px;  /* Minimum width */
}
```

#### Fixed Swap Button Alignment
```css
.tj-swap-btn {
  align-self: center;  /* Vertically center in flex container */
  margin: 0 8px;  /* Add horizontal spacing */
}
```

### 2. Component Fixes

#### Removed Manual State Management
- Deleted `showFromSuggestions` and `showToSuggestions` states
- Dropdown now shows automatically when `suggestions.length > 0`

#### Added Debug Logging
```javascript
// In onChange handlers
console.log('From input changed:', e.target.value);

// In render
{fromSearch.suggestions.length > 0 && (
  <div className="tj-suggestions-dropdown">
    {console.log('Rendering FROM suggestions:', fromSearch.suggestions)}
    ...
  </div>
)}
```

## How to Test

### 1. Open Browser Console
Press F12 to open DevTools and go to Console tab

### 2. Type in From Field
1. Type "pune" in the From field
2. Check console for logs:
   ```
   From input changed: p
   From input changed: pu
   From input changed: pun
   From input changed: pune
   ```

### 3. Wait for API Response
After ~350ms debounce, you should see:
```
Rendering FROM suggestions: [{code: "PNQ", city: "Pune", ...}]
```

### 4. Check Dropdown Visibility
- Dropdown should appear below the From field
- Should have orange border (2px solid)
- Should have strong shadow
- Should show "Lohegaon Arpt" for Pune

### 5. Click Suggestion
```
Selecting from airport: {code: "PNQ", city: "Pune", ...}
```

## Troubleshooting

### Dropdown Not Showing

#### Check 1: Are suggestions being loaded?
Look in console for: `Rendering FROM suggestions: [...]`
- **If NO**: API call might be failing. Check Network tab for `/tj/meta/locations?q=pune`
- **If YES**: Continue to Check 2

#### Check 2: Is dropdown being rendered?
Right-click on the From field → Inspect Element
- Look for `<div class="tj-suggestions-dropdown">` in the DOM
- **If NO**: React conditional rendering issue
- **If YES**: Continue to Check 3

#### Check 3: Is dropdown visible but hidden?
In DevTools Elements tab, find `.tj-suggestions-dropdown` and check:
- `display`: should be `block` (not `none`)
- `visibility`: should be `visible` (not `hidden`)
- `opacity`: should be `1` (not `0`)
- `z-index`: should be `2000`
- `position`: should be `absolute`
- `overflow` on parents: should be `visible` (not `hidden`)

#### Check 4: Is dropdown positioned correctly?
In DevTools, hover over `.tj-suggestions-dropdown` element
- Should highlight area below the From field
- If it's positioned elsewhere, check parent `position: relative`

### Dropdown Shows But Can't Click

#### Check: onBlur timing
The `onBlur` has 200ms delay to allow clicks:
```javascript
onBlur={() => {
  setTimeout(() => {
    fromSearch.setSuggestions([]);
  }, 200);
}}
```

If clicking doesn't work:
- Increase delay to 300ms or 500ms
- Or use `onMouseDown` instead of `onClick` on suggestions

### Swap Button Not Centered

#### Check: Parent flex alignment
```css
.tj-search-row {
  display: flex;
  align-items: stretch;  /* Should be stretch, not center */
}

.tj-swap-btn {
  align-self: center;  /* This centers the button */
}
```

## API Response Structure

The TripJack API returns:
```json
{
  "payload": {
    "suggestions": [
      {
        "country": "India",
        "code": "PNQ",
        "city": "Pune",
        "countryCode": "IN",
        "cityCode": "PNQ",
        "name": "Lohegaon Arpt",
        "id": 7593,
        "priority": 10,
        "enabled": true
      }
    ]
  }
}
```

The `useAirportSearch` hook normalizes this to:
```javascript
{
  iata: "PNQ",
  name: "Lohegaon Arpt",
  city: "Pune",
  country: "India",
  countryCode: "IN",
  cityCode: "PNQ",
  id: 7593,
  priority: 10
}
```

## Expected Console Output

When typing "pune":
```
From input changed: p
From input changed: pu
From input changed: pun
From input changed: pune
Rendering FROM suggestions: [{iata: "PNQ", city: "Pune", name: "Lohegaon Arpt", ...}]
```

When clicking suggestion:
```
Selecting from airport: {iata: "PNQ", city: "Pune", name: "Lohegaon Arpt", ...}
```

## Visual Indicators

The dropdown now has:
- ✅ **Orange border** (2px solid) - Very visible
- ✅ **Strong shadow** (0 8px 24px rgba(0,0,0,0.25))
- ✅ **High z-index** (2000)
- ✅ **White background**
- ✅ **Minimum width** (300px)

## Files Modified

1. `src/components/pages/Travels/honeymoon/components/FlightSearchForm.jsx`
   - Added console.log statements
   - Removed manual state management
   - Simplified dropdown visibility logic

2. `src/components/pages/Travels/honeymoon/tripjack-styles.css`
   - Changed `overflow: hidden` to `overflow: visible`
   - Enhanced dropdown border and shadow
   - Fixed swap button alignment
   - Increased z-index to 2000

## Next Steps

1. **Test in browser** - Type "pune" and check console
2. **Verify dropdown appears** - Should see orange-bordered dropdown
3. **Click suggestion** - Should populate field with "Pune (PNQ)"
4. **Remove debug logs** - Once confirmed working, remove console.log statements
5. **Test other cities** - Try "delhi", "mumbai", "bangalore"

## Remove Debug Logs Later

Once confirmed working, remove these lines:
```javascript
// Remove from onChange
console.log('From input changed:', e.target.value);
console.log('To input changed:', e.target.value);

// Remove from render
{console.log('Rendering FROM suggestions:', fromSearch.suggestions)}
{console.log('Rendering TO suggestions:', toSearch.suggestions)}

// Remove from select functions
console.log('Selecting from airport:', airport);
console.log('Selecting to airport:', airport);
```
