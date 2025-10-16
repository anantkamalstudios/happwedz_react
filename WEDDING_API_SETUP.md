# Wedding Website API Integration

## What's Been Done

✅ **API Configuration Updated**
- Updated `src/config/constants.js` to use `localhost:4000` for testing
- API Base URL: `http://localhost:4000/api`
- Image Base URL: `http://localhost:4000/uploads`

✅ **Wedding Website API Service Created**
- Created `src/services/api/weddingWebsiteApi.js`
- Handles all CRUD operations for wedding websites
- Supports file uploads with FormData
- Integrated with existing API service structure

✅ **WeddingWebsiteForm.jsx Updated**
- Integrated with the new API service
- Form submission now saves data to database via API
- Edit mode loads existing data from API
- Proper error handling and user feedback

## How to Test

### 1. Start Your Backend
Make sure your backend is running on `localhost:4000` with the wedding website endpoints.

### 2. Test the Form
1. Navigate to your wedding website form page
2. Fill out the form with test data:
   - Wedding Date
   - Bride & Groom details
   - Love Story entries
   - Wedding Party members
   - When & Where events
   - Upload some images
3. Click "Create Wedding Website"
4. The form should now save to your database!

### 3. Test Edit Mode
1. After creating a website, you can edit it by adding `?edit=<website_id>` to the URL
2. The form should load existing data from the database
3. Make changes and submit to update the database

## API Endpoints Used

- `POST /api/wedding-websites` - Create new website
- `GET /api/wedding-websites` - List user's websites  
- `GET /api/wedding-websites/:id` - Get specific website
- `PUT /api/wedding-websites/:id` - Update website
- `DELETE /api/wedding-websites/:id` - Delete website
- `POST /api/wedding-websites/:id/publish` - Publish website
- `GET /api/wedding/:websiteUrl` - Public view

## File Structure

```
src/
├── config/
│   └── constants.js (updated with localhost:4000)
├── services/
│   └── api/
│       ├── index.js (updated to export weddingWebsiteApi)
│       └── weddingWebsiteApi.js (new API service)
└── components/
    └── pages/
        └── WeddingWebsiteForm.jsx (updated to use API)
```

## Data Flow

1. **Form Submission**: User fills form → `handleSubmit()` → `weddingWebsiteApi.createWebsite()` → API call to backend
2. **Edit Mode**: URL with `?edit=id` → `useEffect()` → `weddingWebsiteApi.getWebsiteById()` → Load existing data
3. **File Uploads**: Files are handled via FormData and sent to backend for processing

## Troubleshooting

- **Authentication Error**: Make sure you have a valid JWT token in localStorage
- **Network Error**: Ensure backend is running on localhost:4000
- **File Upload Issues**: Check that files are proper image formats (JPEG, PNG, etc.)
- **Database Errors**: Check backend logs for any database connection issues

## Next Steps

1. Test the form with real data
2. Verify images are being uploaded and stored correctly
3. Test the public view endpoint
4. Add any additional validation or error handling as needed
