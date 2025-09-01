# Hooks Documentation

This directory contains custom React hooks for managing API data in the HappyWedz application.

## Structure

```
src/hooks/
├── useVendors.js          # Hook for managing vendors data
├── index.js              # Central export file
└── README.md             # This documentation
```

## Available Hooks

### useVendors

A comprehensive hook for managing vendors data from the API.

#### Usage

```javascript
import { useVendors } from "../hooks/useVendors";

const MyComponent = () => {
  const {
    vendors,
    loading,
    error,
    pagination,
    fetchVendors,
    refreshVendors,
    loadMore,
    hasMore,
  } = useVendors({
    categoryId: 3,
    vendorType: "venue",
    location: "Mumbai",
    search: "banquet hall",
    page: 1,
    limit: 20,
    autoFetch: true,
  });

  // Component logic here
};
```

#### Options

| Option       | Type    | Default     | Description                                      |
| ------------ | ------- | ----------- | ------------------------------------------------ |
| `categoryId` | number  | null        | Filter by category ID                            |
| `vendorType` | string  | null        | Filter by vendor type (venue, photography, etc.) |
| `location`   | string  | null        | Filter by location                               |
| `search`     | string  | null        | Search term                                      |
| `status`     | string  | 'active'    | Filter by status                                 |
| `page`       | number  | 1           | Page number for pagination                       |
| `limit`      | number  | 10          | Number of items per page                         |
| `sortBy`     | string  | 'createdAt' | Sort field                                       |
| `sortOrder`  | string  | 'desc'      | Sort order (asc/desc)                            |
| `autoFetch`  | boolean | true        | Automatically fetch data on mount                |

#### Returns

| Property          | Type     | Description                    |
| ----------------- | -------- | ------------------------------ |
| `vendors`         | array    | Array of vendor objects        |
| `loading`         | boolean  | Loading state                  |
| `error`           | string   | Error message if any           |
| `pagination`      | object   | Pagination information         |
| `fetchVendors`    | function | Manually fetch vendors         |
| `fetchVendorById` | function | Fetch single vendor by ID      |
| `createVendor`    | function | Create new vendor              |
| `updateVendor`    | function | Update existing vendor         |
| `deleteVendor`    | function | Delete vendor                  |
| `refreshVendors`  | function | Refresh current data           |
| `loadMore`        | function | Load next page                 |
| `hasMore`         | boolean  | Whether more data is available |

### useVendor

Hook for fetching a single vendor by ID.

#### Usage

```javascript
import { useVendor } from "../hooks/useVendors";

const VendorDetail = ({ vendorId }) => {
  const { vendor, loading, error, refetch } = useVendor(vendorId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vendor) return <div>Vendor not found</div>;

  return (
    <div>
      <h1>{vendor.name}</h1>
      <p>{vendor.description}</p>
      {/* Rest of component */}
    </div>
  );
};
```

## API Service

The hooks use the `vendorsApi` service located in `src/services/api/vendorsApi.js`.

### Base URL

- Production: `https://happywedz.salesnest.in/api/sub-vendors`

### Available Methods

- `getVendors(params)` - Get all vendors with optional filters
- `getVendorById(id)` - Get single vendor by ID
- `createVendor(data)` - Create new vendor
- `updateVendor(id, data)` - Update existing vendor
- `deleteVendor(id)` - Delete vendor
- `getVendorsByCategory(categoryId, params)` - Get vendors by category
- `getVendorsByType(vendorType, params)` - Get vendors by type
- `searchVendors(searchTerm, params)` - Search vendors
- `getVendorsByLocation(location, params)` - Get vendors by location
- `getFeaturedVendors(params)` - Get featured vendors
- `getAvailableVendors(date, params)` - Get available vendors for date

## Data Transformation

The API response is automatically transformed to match the expected component format using utilities in `src/utils/vendorDataTransform.js`.

### Transformation Features

- Maps API fields to component-expected fields
- Formats location data
- Converts price to readable format (Lakhs/K)
- Handles image URLs with fallbacks
- Preserves all original API data

## Error Handling

All hooks include comprehensive error handling:

- Network errors
- API errors
- Invalid responses
- Loading states
- Retry mechanisms

## Examples

### Basic Usage

```javascript
import { useVendors } from "../hooks/useVendors";

const VendorsList = () => {
  const { vendors, loading, error } = useVendors();

  if (loading) return <div>Loading vendors...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {vendors.map((vendor) => (
        <div key={vendor.id}>
          <h3>{vendor.name}</h3>
          <p>{vendor.location}</p>
          <p>Rating: {vendor.rating}</p>
        </div>
      ))}
    </div>
  );
};
```

### With Search and Filters

```javascript
import { useState } from "react";
import { useVendors } from "../hooks/useVendors";

const SearchableVendorsList = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);

  const { vendors, loading, error } = useVendors({
    search,
    categoryId: category,
    limit: 20,
  });

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search vendors..."
      />

      <select
        value={category || ""}
        onChange={(e) => setCategory(e.target.value || null)}
      >
        <option value="">All Categories</option>
        <option value="1">Venues</option>
        <option value="2">Photography</option>
        <option value="3">Catering</option>
      </select>

      {/* Render vendors */}
    </div>
  );
};
```

### With Pagination

```javascript
import { useVendors } from "../hooks/useVendors";

const PaginatedVendorsList = () => {
  const { vendors, loading, error, loadMore, hasMore, pagination } = useVendors(
    { limit: 10 }
  );

  return (
    <div>
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}

      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      <div>
        Page {pagination.page} of {pagination.totalPages}
      </div>
    </div>
  );
};
```

## Future Hooks

The structure is designed to easily add more hooks for other entities:

- `useVenues` - For venue management
- `usePhotography` - For photography services
- `useEInvites` - For e-invite management
- `useCategories` - For category management

Each hook will follow the same pattern and structure as `useVendors`.
