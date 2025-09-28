// import React, { useState, useMemo, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import ListView from "../layouts/Main/ListView";
// import GridView from "../layouts/Main/GridView";
// import MapView from "../layouts/Main/MapView";
// import { subVenuesData } from "../../data/subVenuesData";
// import { subVendorsData } from "../../data/subVendorsData";
// import { twoSoul } from "../../data/twoSoul";
// import MainSearch from "../layouts/Main/MainSearch";
// import PricingModal from "../layouts/PricingModal";
// import Photos from "../layouts/photography/Photos";
// import DynamicAside from "../layouts/aside/DynamicAside";
// import { IMAGE_BASE_URL } from "../../config/constants";

// const toTitleCase = (str) =>
//   str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

// const SubSection = () => {
//   const { section, slug } = useParams();
//   const title = slug ? toTitleCase(slug) : "";
//   const [show, setShow] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [view, setView] = useState("list");
//   const [isLoading, setIsLoading] = useState(true);
//   const [showDebug, setShowDebug] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // Local vendors state (direct API fetch)
//   const [vendors, setVendors] = useState([]);
//   const [vendorsLoading, setVendorsLoading] = useState(false);
//   const [vendorsError, setVendorsError] = useState(null);
//   const [vendorsRefreshTick, setVendorsRefreshTick] = useState(0);

//   // const handleClose = () => setShow(false);
//   // const handleShow = () => setShow(true);

//   const handleClose = () => {
//     setShow(false);
//     setSelectedId(null);
//   };
//   const handleShow = (id) => {
//     setSelectedId(id);
//     setShow(true);
//   };

//   const [venueApiData, setVenueApiData] = useState(null);
//   const [venueApiLoading, setVenueApiLoading] = useState(false);
//   const [venueApiError, setVenueApiError] = useState(null);

//   useEffect(() => {
//     if (section !== "venues" || !slug) return;

//     setVenueApiLoading(true);
//     setVenueApiError(null);
//     setVenueApiData(null);

//     const subCategory = slug
//       .replace(/-/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());

//     fetch(
//       `https://happywedz.com/api/vendor-services?subCategory=${encodeURIComponent(
//         subCategory
//       )}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const items = Array.isArray(data) ? data : [];
//         const transformed = transformVendorsData(items);
//         setVenueApiData(transformed);
//         console.log("Venues->", transformed);
//       })
//       .catch((err) => {
//         setVenueApiError("Failed to load venues from API.");
//       })
//       .finally(() => {
//         setVenueApiLoading(false);
//       });
//   }, [section, slug]);

//   useEffect(() => {
//     if (section !== "vendors") return;
//     if (slug) {
//       setVendorsLoading(true);
//       setVendorsError(null);
//       setVendors([]);
//       const subCategory = slug
//         .replace(/-/g, " ")
//         .replace(/\b\w/g, (l) => l.toUpperCase());

//       fetch(
//         `https://happywedz.com/api/vendor-services?subCategory=${encodeURIComponent(
//           subCategory
//         )}`
//       )
//         .then((res) => res.json())
//         .then((data) => {
//           const items = Array.isArray(data) ? data : [];
//           const transformed = transformVendorsData(items);
//           setVendors(transformed);
//           console.log("Vendors->", vendors);
//         })
//         .catch(() => {
//           setVendorsError("Failed to load data from API.");
//         })
//         .finally(() => {
//           setVendorsLoading(false);
//         });
//     }
//   }, [section, slug]);

//   useEffect(() => {
//     if (section === "vendors" && Array.isArray(vendors) && vendors.length > 0) {
//       console.log("Transformed vendor sample:", {
//         id: vendors[0].id,
//         name: vendors[0].name,
//         image: vendors[0].image,
//         price: vendors[0].price,
//         location: vendors[0].location,
//         slug: vendors[0].slug,
//         rating: vendors[0].rating,
//         reviews: vendors[0].reviews,
//         capacity: vendors[0].capacity,
//         call: vendors[0].call,
//         within_24hr_available: vendors[0].within_24hr_available,
//       });
//     }
//   }, [section, vendors]);

//   const transformVendorsData = (items) => {
//     return items.map((item) => {
//       const id = item.id;
//       const media = item.media || {};
//       const vendor = item.vendor || {};
//       const attributes = item.attributes || {};
//       const location = item.location || {};
//       const within_24hr_available = item.within_24hr_available || {};

//       const rawGallery = media.gallery || item.gallery || [];
//       const galleryPaths = rawGallery.filter((img) => typeof img === "string");

//       const firstImage = media.coverImage
//         ? IMAGE_BASE_URL + media.coverImage
//         : galleryPaths.length > 0
//         ? IMAGE_BASE_URL + galleryPaths[0]
//         : null;

//       return {
//         id: item.id,
//         name: item.name || vendor.businessName || "Unknown Vendor",
//         subtitle: item.subtitle || "",
//         description: item.description || attributes.description || "",
//         slug: item.slug,

//         // Main image
//         image: firstImage,

//         // Full gallery
//         gallery: galleryPaths.map((img) => IMAGE_BASE_URL + img),

//         videos: media.videos || [],

//         price: attributes.price_range?.min || 0,

//         // price: attributes.price_range?.min
//         //   ? `${attributes.price_range.min} - ${attributes.price_range.max} ${
//         //       attributes.currency || "INR"
//         //     }`
//         //   : null,

//         location: `${location.city || vendor.city || ""}${
//           location.state ? ", " + location.state : ""
//         }`,

//         rating: attributes.rating || 0,
//         slug: attributes.slug || "",
//         reviews: attributes.reviews || 0,
//         within_24hr_available: attributes.within_24hr_available || null,

//         capacity:
//           attributes.capacity_min || attributes.capacity_max
//             ? `${attributes.capacity_min || 0} - ${
//                 attributes.capacity_max || 0
//               }`
//             : null,

//         call: vendor.phone || item.cta_phone || null,
//         whatsapp: vendor.whatsapp || null,
//         website: vendor.website || null,

//         alcohol_policy: attributes.alcohol_policy || null,
//         car_parking: attributes.car_parking || null,
//         rooms: item.rooms || null,
//       };
//     });
//   };

//   const filteredVenuesData = useMemo(() => {
//     if (section === "venues" && slug && venueApiData) {
//       return venueApiData;
//     }
//     if (section === "venues" && slug) {
//       const searchTerm = slug
//         .replace(/-/g, " ")
//         .replace(/\b\w/g, (l) => l.toUpperCase());

//       const venueTypes = [
//         "Banquet Halls",
//         "Marriage Garden / Lawns",
//         "Wedding Resorts",
//         "Small Function / Party Halls",
//         "Destination Wedding Venues",
//         "Kalyana Mandapams",
//         "4 Star & Above Wedding Hotels",
//         "Venue Concierge Services",
//       ];

//       const isVenueType = venueTypes.some(
//         (type) =>
//           type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           searchTerm.toLowerCase().includes(type.toLowerCase())
//       );

//       if (isVenueType) {
//         return subVenuesData.filter(
//           (venue) =>
//             venue.venueType &&
//             venue.venueType.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       } else {
//         return subVenuesData.filter((venue) =>
//           venue.location.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
//     }
//     return subVenuesData;
//   }, [section, slug, venueApiData]);

//   let dataToSend = [];
//   if (section === "vendors") {
//     dataToSend = vendorsError ? subVendorsData : vendors;
//   } else if (section === "venues") {
//     dataToSend = venueApiError ? subVenuesData : venueApiData || [];
//   } else if (section === "twosoul") {
//     dataToSend = twoSoul;
//   }

//   React.useEffect(() => {
//     setIsLoading(true);
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [slug, section]);

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   const handleCategoryChange = (categoryId) => {
//     setSelectedCategory(categoryId);
//   };

//   const handleRefresh = () => {
//     if (section === "vendors") {
//       setVendorsRefreshTick((x) => x + 1);
//     }
//   };

//   if (section === "vendors" && vendorsError) {
//     dataToSend = subVendorsData;
//     return (
//       <div className="container-fluid">
//         <div className="alert alert-danger" role="alert">
//           <h4 className="alert-heading">Error Loading Vendors</h4>
//           <p>{vendorsError}</p>
//           <hr />
//           <button className="btn btn-outline-danger" onClick={handleRefresh}>
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (section === "vendors" && vendorsLoading && vendors.length === 0) {
//     return (
//       <div className="container-fluid">
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ minHeight: "400px" }}
//         >
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid">
//       {section === "venues" && <MainSearch title={title} />}
//       {section === "venues" && venueApiLoading && (
//         <div className="my-5 text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <div className="text-muted mt-2">Loading {title}...</div>
//         </div>
//       )}
//       {section === "venues" && venueApiError && (
//         <div className="alert alert-warning my-4 text-center">
//           {venueApiError} Showing local data instead.
//         </div>
//       )}
//       {section === "vendors" && (
//         <MainSearch
//           title={title}
//           onSearch={handleSearch}
//           onCategoryChange={handleCategoryChange}
//         />
//       )}
//       {(section === "photography" || section === "twosoul") && (
//         <MainSearch title={title} />
//       )}

//       {section === "photography" ? (
//         <Photos title={title} />
//       ) : (
//         <>
//           {isLoading ? (
//             <div className="container my-5">
//               <div className="row justify-content-center">
//                 <div className="col-md-8 text-center">
//                   <div className="bg-light rounded-4 p-5">
//                     <div className="mb-4">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       >
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </div>
//                     <h4 className="text-muted mb-3">Loading...</h4>
//                     <p className="text-muted mb-4">
//                       Please wait while we fetch the data.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : dataToSend.length === 0 ? (
//             <div className="container my-5">
//               <div className="row justify-content-center">
//                 <div className="col-md-8 text-center">
//                   <div className="bg-light rounded-4 p-5">
//                     <div className="mb-4">
//                       <svg
//                         width="80"
//                         height="80"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="mx-auto text-muted"
//                       >
//                         <path
//                           d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
//                           fill="currentColor"
//                         />
//                       </svg>
//                     </div>
//                     <h4 className="text-muted mb-3">
//                       {section === "venues"
//                         ? `No ${title} Available`
//                         : section === "vendors"
//                         ? `No ${title} Available`
//                         : `No ${title} Available`}
//                     </h4>
//                     <p className="text-muted mb-4">
//                       {section === "venues"
//                         ? `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try searching for a different venue type or location.`
//                         : section === "vendors"
//                         ? `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try searching for a different vendor category or location.`
//                         : `We couldn't find any ${title.toLowerCase()} in our database at the moment. Please try a different search.`}
//                     </p>

//                     {/* Suggestions section */}
//                     {section === "venues" && (
//                       <div className="mb-4">
//                         <h6 className="text-muted mb-3">
//                           💡 Try these popular venue types instead:
//                         </h6>
//                         <div className="d-flex flex-wrap justify-content-center gap-2">
//                           {[
//                             "Banquet Halls",
//                             "Wedding Resorts",
//                             "Marriage Garden / Lawns",
//                             "Destination Wedding Venues",
//                           ].map((type) => (
//                             <Link
//                               key={type}
//                               to={`/venues/${type
//                                 .toLowerCase()
//                                 .replace(/\s+/g, "-")
//                                 .replace(/[^a-z0-9\-]/g, "")}`}
//                               className="btn btn-outline-secondary btn-sm"
//                             >
//                               {type}
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {section === "vendors" && (
//                       <div className="mb-4">
//                         <h6 className="text-muted mb-3">
//                           💡 Try these popular vendor categories instead:
//                         </h6>
//                         <div className="d-flex flex-wrap justify-content-center gap-2">
//                           {[
//                             "Wedding Photographers",
//                             "Wedding Videography",
//                             "Caterers",
//                             "Wedding Planners",
//                           ].map((category) => (
//                             <Link
//                               key={category}
//                               to={`/vendors/${category
//                                 .toLowerCase()
//                                 .replace(/\s+/g, "-")
//                                 .replace(/[^a-z0-9\-]/g, "")}`}
//                               className="btn btn-outline-secondary btn-sm"
//                             >
//                               {category}
//                             </Link>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     <div className="d-flex flex-wrap justify-content-center gap-3">
//                       <button
//                         className="btn btn-outline-primary"
//                         onClick={() => window.history.back()}
//                       >
//                         <i className="bi bi-arrow-left me-2"></i>
//                         Go Back
//                       </button>
//                       <Link to="/" className="btn btn-primary">
//                         <i className="bi bi-house me-2"></i>
//                         Browse All
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <>
//               <DynamicAside section={section} view={view} setView={setView} />

//               {/* <ViewSwitcher view={view} setView={setView} /> */}

//               {view === "list" && (
//                 <ListView
//                   subVenuesData={dataToSend}
//                   section={section}
//                   handleShow={handleShow}
//                 />
//               )}

//               {view === "images" && (
//                 <GridView
//                   subVenuesData={dataToSend}
//                   section={section}
//                   handleShow={handleShow}
//                 />
//               )}

//               {view === "map" && (
//                 <MapView subVenuesData={dataToSend} section={section} />
//               )}

//               <PricingModal
//                 show={show}
//                 handleClose={handleClose}
//                 vendorId={selectedId}
//               />
//               {/* <PricingModal subVenuesData={dataToSend} show={show} handleClose={handleClose} /> */}
//               <PricingModal
//                 show={show}
//                 handleClose={handleClose}
//                 selectedId={selectedId}
//               />
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default SubSection;

import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ListView from "../layouts/Main/ListView";
import GridView from "../layouts/Main/GridView";
import MapView from "../layouts/Main/MapView";
import { subVenuesData } from "../../data/subVenuesData";
import { subVendorsData } from "../../data/subVendorsData";
import { twoSoul } from "../../data/twoSoul";
import MainSearch from "../layouts/Main/MainSearch";
import PricingModal from "../layouts/PricingModal";
import Photos from "../layouts/photography/Photos";
import DynamicAside from "../layouts/aside/DynamicAside";
import useApiData from "../../hooks/useApiData";
import EmptyState from "../EmptyState";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";

const toTitleCase = (str) =>
  str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const SubSection = () => {
  const { section, slug } = useParams();
  const title = slug ? toTitleCase(slug) : "";

  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const reduxLocation = useSelector((state) => state.location.selectedLocation);
  const [selectedCity, setSelectedCity] = useState(reduxLocation);

  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useApiData(section, slug, selectedCity);

  // Modal handlers
  const handleClose = () => {
    setShow(false);
    setSelectedId(null);
  };

  const handleShow = (id) => {
    setSelectedId(id);
    setShow(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    console.log("Category changed:", categoryId);
  };

  const handleCityChange = (city) => {
    console.log("City changed to:", city);
    setSelectedCity(city);
  };

  // Sync selectedCity with Redux location state
  useEffect(() => {
    setSelectedCity(reduxLocation);
  }, [reduxLocation]);

  const getFallbackData = (section) => {
    switch (section) {
      case "vendors":
        return subVendorsData;
      case "venues":
        return subVenuesData;
      case "twosoul":
        return twoSoul;
      default:
        return [];
    }
  };

  const dataToSend = useMemo(() => {
    console.log("Determining data source:", {
      section,
      apiData: apiData?.length,
      error,
    });

    if (section === "photography") {
      return [];
    }

    if (error || !apiData || apiData.length === 0) {
      return getFallbackData(section);
    }

    return apiData;
  }, [section, apiData, error]);

  useEffect(() => {
    console.log("SubSection state:", {
      section,
      slug,
      title,
      selectedCity,
      apiDataLength: apiData?.length || 0,
      loading,
      error,
      dataToSendLength: dataToSend.length,
    });
  }, [section, slug, title, selectedCity, apiData, loading, error, dataToSend]);

  if (section === "photography") {
    return (
      <div className="container-fluid">
        <MainSearch
          title={title}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onCityChange={handleCityChange}
        />
        <Photos title={title} />
      </div>
    );
  }

  // Show error state only if no fallback data available
  if (error && (!dataToSend || dataToSend.length === 0)) {
  }

  // Show loading state only when loading and no data
  if (loading && dataToSend.length === 0) {
    return <LoadingState title={title} />;
  }

  return (
    <div className="container-fluid">
      <MainSearch
        title={title}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        onCityChange={handleCityChange}
      />

      {/* Loading indicator when refetching */}
      {loading && dataToSend.length > 0 && (
        <div className="alert alert-info my-4 text-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Updating data...
        </div>
      )}

      {/* Main content */}
      {dataToSend.length === 0 ? (
        <EmptyState section={section} title={title} />
      ) : (
        <>
          <DynamicAside section={section} view={view} setView={setView} />

          {view === "list" && (
            <ListView
              subVenuesData={dataToSend}
              section={section}
              handleShow={handleShow}
            />
          )}

          {view === "images" && (
            <GridView
              subVenuesData={dataToSend}
              section={section}
              handleShow={handleShow}
            />
          )}

          {view === "map" && (
            <MapView subVenuesData={dataToSend} section={section} />
          )}

          <PricingModal
            show={show}
            handleClose={handleClose}
            vendorId={selectedId}
          />
        </>
      )}
    </div>
  );
};

export default SubSection;
