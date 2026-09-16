TASK: Replace all vendor ID-based navigation with slug-based navigation
Context:

Backend now has a slug field on every vendor record in vendor_subcategory_data table
New API endpoint exists: GET /api/vendor-services/slug/:slug which returns full vendor data
Old endpoint: GET /api/vendor-services/:id still works (do NOT remove)
Slug format example: dreamweavers-new-delhi-1
The slug is returned in every vendor object as venue.slug from the listing API

Files to change:

1. src/components/layouts/Main/GridView.jsx

In handleCardClick function, change navigate('/details/info/${venue.id}') to navigate('/details/info/${venue.slug}')
In the Link component inside card body, same change

2. src/components/layouts/Main/ListView.jsx

In the Card onClick, change navigate('/details/info/${venue.id}') to navigate('/details/info/${venue.slug}')

3. src/components/layouts/Detailed.jsx

Currently it reads id from useParams() and calls /api/vendor-services/${id}
Change it to read slug from useParams() and call /api/vendor-services/slug/${slug} instead
The response shape is identical so no other changes needed in this file

4. Router file (wherever /details/info/:id route is defined)

Change the route param name from :id to :slug — example: /details/info/:slug
Do NOT add a new route, just rename the param

Rules:

Do NOT change any API, backend, or Redux files
Do NOT break the existing listing pages — they just need to pass venue.slug instead of venue.id in navigate
Do NOT remove the old /:id backend route
Test by checking that clicking a card navigates to /details/info/dreamweavers-new-delhi-1 format URL
