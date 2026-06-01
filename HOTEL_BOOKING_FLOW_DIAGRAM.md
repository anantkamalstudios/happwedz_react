# Hotel Booking Flow - Data Structure Diagram

## Before Fix (Issue)

```
┌─────────────────────────────────────────────────────────────────┐
│ TripJack API Response                                           │
│ {                                                               │
│   bookingId: "ABC123",                                         │
│   option: {                                                    │
│     pricing: {                                                 │
│       totalPrice: 5000,                                        │
│       basePrice: 4500,                                         │
│       taxes: 500                                               │
│     }                                                          │
│   }                                                            │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend: normalizeOfficialReviewResponse()                     │
│ {                                                               │
│   bookingId: "ABC123",                                         │
│   priceSummary: {                    ← CREATED HERE            │
│     amount: 5000,                                              │
│     baseFare: 4500,                                            │
│     taxesAndFees: 500,                                         │
│     currency: "INR"                                            │
│   },                                                           │
│   selectedOption: { ... },                                     │
│   bookingRequirements: { ... }                                 │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend: normalizeReviewResponseForUi() - BEFORE FIX          │
│                                                                 │
│ Looks for: option.pricing.totalPrice                           │
│ But finds: priceSummary.amount (different structure!)          │
│                                                                 │
│ Result: Rebuilds priceSummary from option.pricing             │
│         option.pricing doesn't exist in normalized response!   │
│                                                                 │
│ {                                                              │
│   priceSummary: {                    ← OVERWRITTEN TO 0!       │
│     amount: 0,                       ← PROBLEM!                │
│     baseFare: 0,                                               │
│     taxesAndFees: 0,                                           │
│     currency: "INR"                                            │
│   }                                                            │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend: handleProceedToBook()                                │
│                                                                 │
│ if (payableAmount <= 0) {              ← VALIDATION FAILS!     │
│   toast.error("Booking amount is unavailable");                │
│   return;                                                      │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

## After Fix (Solution)

```
┌─────────────────────────────────────────────────────────────────┐
│ TripJack API Response                                           │
│ {                                                               │
│   bookingId: "ABC123",                                         │
│   option: {                                                    │
│     pricing: {                                                 │
│       totalPrice: 5000,                                        │
│       basePrice: 4500,                                         │
│       taxes: 500                                               │
│     }                                                          │
│   }                                                            │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend: normalizeOfficialReviewResponse()                     │
│ {                                                               │
│   bookingId: "ABC123",                                         │
│   priceSummary: {                    ← CREATED HERE            │
│     amount: 5000,                    ✓ VALID                   │
│     baseFare: 4500,                                            │
│     taxesAndFees: 500,                                         │
│     currency: "INR"                                            │
│   },                                                           │
│   selectedOption: { ... },                                     │
│   bookingRequirements: { ... }                                 │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend: normalizeReviewResponseForUi() - AFTER FIX           │
│                                                                 │
│ Check: Does priceSummary.amount exist and > 0?                 │
│ Answer: YES! amount = 5000                                     │
│                                                                 │
│ Action: PRESERVE existing priceSummary                         │
│         Don't rebuild it!                                      │
│                                                                 │
│ {                                                              │
│   priceSummary: {                    ← PRESERVED! ✓            │
│     amount: 5000,                    ← CORRECT!                │
│     baseFare: 4500,                                            │
│     taxesAndFees: 500,                                         │
│     currency: "INR"                                            │
│   }                                                            │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ Frontend: handleProceedToBook()                                │
│                                                                 │
│ if (payableAmount <= 0) {              ← VALIDATION PASSES! ✓  │
│   // Not executed                                              │
│ }                                                              │
│                                                                 │
│ // Continue to payment...                                      │
│ openRazorpayModal(5000);               ← SUCCESS!              │
└─────────────────────────────────────────────────────────────────┘
```

## Key Changes in Code

### hotelbedsDetailHelpers.js

```javascript
// BEFORE FIX
priceSummary: {
  amount: normalizeAmount(pricing?.totalPrice),  // pricing doesn't exist!
  baseFare: normalizeAmount(pricing?.basePrice),
  taxesAndFees: normalizeAmount(pricing?.taxes),
  currency: pricing?.currency || "INR",
}

// AFTER FIX
const existingPriceSummary = reviewResponse?.priceSummary;
const hasValidExistingAmount = existingPriceSummary && normalizeAmount(existingPriceSummary.amount) > 0;

priceSummary: hasValidExistingAmount
  ? existingPriceSummary  // ← PRESERVE if valid
  : {                     // ← REBUILD only if missing
      amount: normalizeAmount(pricing?.totalPrice),
      baseFare: normalizeAmount(pricing?.basePrice),
      taxesAndFees: normalizeAmount(pricing?.taxes),
      currency: pricing?.currency || "INR",
    }
```

## Data Structure Reference

### Backend Response Structure (from normalizeOfficialReviewResponse)
```javascript
{
  success: true,
  bookingId: "string",
  correlationId: "string",
  searchQuery: null,
  hotelInfo: { ... },
  selectedOption: {
    id: "string",
    optionId: "string",
    tp: 5000,
    totalPrice: 5000,
    pricing: {
      totalPrice: 5000,
      basePrice: 4500,
      taxes: 500,
      currency: "INR"
    },
    // ... other fields
  },
  bookingRequirements: {
    panRequired: false,
    passportRequired: false,
    isRefundable: true,
    // ... other fields
  },
  priceSummary: {           // ← THIS IS THE KEY FIELD
    amount: 5000,           // ← THIS MUST BE PRESERVED
    baseFare: 4500,
    taxesAndFees: 500,
    currency: "INR",
    managementFee: 0,
    managementFeeTax: 0
  },
  roomSummary: { ... },
  hotelSummary: { ... },
  metaData: { ... }
}
```

### Frontend Expected Structure (for UI rendering)
```javascript
{
  bookingId: "string",
  priceSummary: {           // ← MUST HAVE THIS
    amount: 5000,           // ← MUST BE > 0
    baseFare: 4500,
    taxesAndFees: 500,
    currency: "INR"
  },
  selectedOption: { ... },
  bookingRequirements: { ... },
  searchQuery: { ... },
  hotelSummary: { ... }
}
```

## Amount Resolution Priority

When `handleProceedToBook()` calculates the payable amount, it tries these sources in order:

```javascript
const payableAmount =
  normalizeAmount(reviewResponse?.priceSummary?.amount) ||              // 1. PRIMARY (from backend)
  normalizeAmount(reviewResponse?.selectedOption?.pricing?.totalPrice) || // 2. FALLBACK 1
  normalizeAmount(reviewResponse?.selectedOption?.totalPrice) ||          // 3. FALLBACK 2
  normalizeAmount(reviewResponse?.selectedOption?.tp);                    // 4. FALLBACK 3
```

**With the fix:**
- Source #1 (`priceSummary.amount`) is now preserved correctly ✓
- Fallbacks are still available for edge cases ✓

## Debugging Tips

### Check Console Logs

1. **After Review API Call:**
```
[TripJack Review] Raw response from backend: {
  hasPriceSummary: true,
  priceSummaryAmount: 5000,  ← Should be > 0
  hasOption: true,
  optionPricing: { totalPrice: 5000, ... }
}
```

2. **After Normalization:**
```
[TripJack Review] Normalized response: {
  hasPriceSummary: true,
  priceSummaryAmount: 5000,  ← Should match above
  hasSelectedOption: true
}
```

3. **Before Payment:**
```
[TripJack Payment] Resolving payable amount: {
  fromPriceSummary: 5000,           ← Should be > 0
  fromSelectedOptionPricing: 5000,
  fromSelectedOptionTotalPrice: 5000,
  fromSelectedOptionTp: 5000,
  finalAmount: 5000                 ← Should be > 0
}
```

### If Error Still Occurs

Check the error log:
```
[TripJack Payment] Booking amount unavailable {
  reviewResponse: {
    hasPriceSummary: false,  ← Problem: missing priceSummary
    priceSummaryAmount: undefined,
    hasSelectedOption: true,
    selectedOptionKeys: [...]
  }
}
```

This indicates the backend response didn't include priceSummary, which means:
- Backend normalization failed
- API response was incomplete
- Network error occurred

## Summary

**Problem:** Frontend was overwriting valid backend pricing data with zeros
**Solution:** Preserve existing valid pricing data, only rebuild if missing
**Result:** Booking amount is correctly maintained throughout the flow
