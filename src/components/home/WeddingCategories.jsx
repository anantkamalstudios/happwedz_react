// // import React from 'react'

// // function WeddingCategories() {
// //     return (
// //         <div>

// //         </div>
// //     )
// // }

// // export default WeddingCategories
// import React from "react";

// /**
//  * Single component: renders wedding category cards in a grid.
//  */
// const CategoryGrid = () => {
//     const sampleData = [
//         {
//             title: "Venues",
//             subtitle: "Banquet Halls, Marriage Garden / Lawns",
//             imageSrc: "/images/venue.jpg", // replace with your actual image path
//             bgColor: "#e3ecff",
//             items: [
//                 "View All Venues",
//                 "Banquet Halls",
//                 "Marriage Garden / Lawns",
//                 "Wedding Resorts",
//                 "Small Function / Party Halls",
//                 "Destination Wedding Venues",
//                 "Kalyana Mandapams",
//                 "4 Star & Above Wedding Hotels",
//             ],
//         },
//         {
//             title: "Photographers",
//             subtitle: "Photographers",
//             imageSrc: "/images/photographer.jpg",
//             bgColor: "#f9d8c8",
//             items: ["View All Photographers", "Wedding Photographers", "Pre Wedding Shoot"],
//         },
//         {
//             title: "Makeup",
//             subtitle: "Bridal Makeup",
//             imageSrc: "/images/makeup.jpg",
//             bgColor: "#e8c2bf",
//             items: ["Bridal Makeup", "Groom Makeup", "Trial Sessions"],
//         },
//         {
//             title: "Planning & Decor",
//             subtitle: "Wedding Planners, Decorators",
//             imageSrc: "/images/decor.jpg",
//             bgColor: "#f9d8c2",
//             items: ["Wedding Planning", "Decor Themes", "Floral Arrangements"],
//         },
//         // add more categories as needed
//     ];

//     return (
//         <div className="container py-5">
//             <h2 className="mb-4">Wedding Categories</h2>
//             <div className="row g-4">
//                 {sampleData.map((cat, i) => (
//                     <div key={i} className="col-12 col-md-6">
//                         <div className="category-card mb-4">
//                             <div
//                                 className="card-header d-flex align-items-center"
//                                 style={{ background: cat.bgColor || "#f4d7c4" }}
//                             >
//                                 <div className="flex-grow-1">
//                                     <h5 className="mb-1">{cat.title}</h5>
//                                     <div className="text-muted small">{cat.subtitle}</div>
//                                 </div>
//                                 <div className="image-wrapper ms-3">
//                                     <img src={cat.imageSrc} alt={cat.title} />
//                                 </div>
//                             </div>
//                             <div className="card-body">
//                                 <div className="row gy-3">
//                                     {cat.items.map((it, idx) => (
//                                         <div key={idx} className="col-6 col-md-4">
//                                             <a href="#" className="text-decoration-none category-link">
//                                                 {it}
//                                             </a>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Embedded styles */}
//             <style>{`
//         .category-card {
//           border: none;
//           background: #fff;
//           border-radius: 8px;
//           overflow: hidden;
//           box-shadow: 0 4px 18px rgba(0,0,0,0.06);
//           position: relative;
//         }
//         .card-header {
//           padding: 1rem;
//           position: relative;
//           border-radius: 8px 8px 0 0;
//           display: flex;
//           align-items: center;
//         }
//         .card-header h5 {
//           margin: 0;
//           font-weight: 600;
//           font-size: 1.1rem;
//         }
//         .card-header .small {
//           font-size: 0.8rem;
//         }
//         .image-wrapper {
//           width: 64px;
//           height: 64px;
//           flex-shrink: 0;
//           position: relative;
//           overflow: hidden;
//           border-radius: 50%;
//           background: #fff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .image-wrapper img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           border-radius: 50%;
//         }
//         .card-body {
//           padding: 1rem;
//         }
//         .category-link {
//           color: #1f2d3a;
//           display: inline-block;
//           transition: color .15s;
//           font-size: 0.9rem;
//         }
//         .category-link:hover {
//           color: #e83581;
//           text-decoration: underline;
//         }
//         @media (max-width: 767px) {
//           .card-header {
//             flex-direction: column;
//             align-items: flex-start;
//           }
//           .image-wrapper {
//             margin-top: 8px;
//           }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default CategoryGrid;
// import React, { useState } from "react";

// /**
//  * CategoryGrid with expandable cards (chevron icon toggles items).
//  */
// const CategoryGrid = () => {
//     const sampleData = [
//         {
//             title: "Venues",
//             subtitle: "Banquet Halls, Marriage Garden / Lawns",
//             imageSrc: "/images/venue.jpg", // replace with your actual image path
//             bgColor: "#e3ecff",
//             items: [
//                 "View All Venues",
//                 "Banquet Halls",
//                 "Marriage Garden / Lawns",
//                 "Wedding Resorts",
//                 "Small Function / Party Halls",
//                 "Destination Wedding Venues",
//                 "Kalyana Mandapams",
//                 "4 Star & Above Wedding Hotels",
//             ],
//         },
//         {
//             title: "Photographers",
//             subtitle: "Photographers",
//             imageSrc: "https://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/1/venues.jpg",
//             bgColor: "#f9d8c8",
//             items: ["View All Photographers", "Wedding Photographers", "Pre Wedding Shoot"],
//         },
//         {
//             title: "Makeup",
//             subtitle: "Bridal Makeup",
//             imageSrc: "/images/makeup.jpg",
//             bgColor: "#e8c2bf",
//             items: ["Bridal Makeup", "Groom Makeup", "Trial Sessions"],
//         },
//         {
//             title: "Planning & Decor",
//             subtitle: "Wedding Planners, Decorators",
//             imageSrc: "/images/decor.jpg",
//             bgColor: "#f9d8c2",
//             items: ["Wedding Planning", "Decor Themes", "Floral Arrangements"],
//         },
//         // more categories if needed...
//     ];

//     // track which card is expanded; store set of indices
//     const [expanded, setExpanded] = useState(new Set([0])); // default open first (Venues)

//     const toggle = (i) => {
//         setExpanded((prev) => {
//             const copy = new Set(prev);
//             if (copy.has(i)) copy.delete(i);
//             else copy.add(i);
//             return copy;
//         });
//     };

//     return (
//         <div className="container py-5">
//             <h2 className="mb-4">Wedding Categories</h2>
//             <div className="row g-4">
//                 {sampleData.map((cat, i) => {
//                     const isOpen = expanded.has(i);
//                     return (
//                         <div key={i} className="col-12 col-md-6">
//                             <div className="category-card mb-4">
//                                 <button
//                                     type="button"
//                                     className="card-header d-flex align-items-center w-100"
//                                     style={{ background: cat.bgColor || "#f4d7c4" }}
//                                     aria-expanded={isOpen}
//                                     onClick={() => toggle(i)}
//                                 >
//                                     <div className="flex-grow-1 text-start">
//                                         <h5 className="mb-1">{cat.title}</h5>
//                                         <div className="text-muted small">{cat.subtitle}</div>
//                                     </div>
//                                     <div className="d-flex align-items-center">
//                                         <div className="image-wrapper me-3">
//                                             <img src={cat.imageSrc} alt={cat.title} />
//                                         </div>
//                                         <div className={`chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
//                                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                                 <path
//                                                     d="M6 8l4 4 4-4"
//                                                     stroke="#1f2d3a"
//                                                     strokeWidth="2"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                 />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                 </button>

//                                 <div className={`card-body collapse-content ${isOpen ? "show" : ""}`}>
//                                     <div className="row gy-3">
//                                         {cat.items.map((it, idx) => (
//                                             <div key={idx} className="col-6 col-md-4">
//                                                 <a href="#" className="text-decoration-none category-link">
//                                                     {it}
//                                                 </a>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Embedded styles */}
//             <style>{`
//         .category-card {
//           border: none;
//           background: #fff;
//           border-radius: 8px;
//           overflow: hidden;
//           box-shadow: 0 4px 18px rgba(0,0,0,0.06);
//           position: relative;
//         }
//         .card-header {
//           padding: 1rem;
//           position: relative;
//           border: none;
//           border-radius: 8px 8px 0 0;
//           display: flex;
//           align-items: center;
//           cursor: pointer;
//           gap: 0.5rem;
//         }
//         .card-header h5 {
//           margin: 0;
//           font-weight: 600;
//           font-size: 1.1rem;
//         }
//         .card-header .small {
//           font-size: 0.8rem;
//         }
//         .image-wrapper {
//           width: 64px;
//           height: 64px;
//           flex-shrink: 0;
//           position: relative;
//           overflow: hidden;
//           border-radius: 50%;
//           background: #fff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }
//         .image-wrapper img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           border-radius: 50%;
//         }
//         .chevron {
//           transition: transform .25s;
//           display: flex;
//           align-items: center;
//         }
//         .chevron.open {
//           transform: rotate(180deg);
//         }
//         .card-body {
//           padding: 1rem;
//           max-height: 0;
//           overflow: hidden;
//           transition: max-height .3s ease, padding .3s ease;
//         }
//         .collapse-content.show {
//           max-height: 1000px; /* large enough to contain content */
//           padding: 1rem;
//         }
//         .category-link {
//           color: #1f2d3a;
//           display: inline-block;
//           transition: color .15s;
//           font-size: 0.9rem;
//         }
//         .category-link:hover {
//           color: #e83581;
//           text-decoration: underline;
//         }
//         button.card-header {
//           background: none;
//           border: none;
//           width: 100%;
//           text-align: left;
//         }
//         @media (max-width: 767px) {
//           .card-header {
//             flex-direction: column;
//             align-items: flex-start;
//           }
//           .image-wrapper {
//             margin-top: 8px;
//             margin-right: 0;
//           }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default CategoryGrid;
// CategoryAccordion.jsx
import React, { useState } from "react";

/**
 * CategoryAccordion: shows category headers with circular image and expandable item list.
 */
const CategoryAccordion = () => {
    const categories = [
        {
            title: "Venues",
            subtitle: "Banquet Halls, Marriage Garden / Lawns",
            imageSrc: "/images/venue.jphttps://image.wedmegood.com/resized/250X/uploads/m_v_cat_image/1/venues.jpg",
            bgColor: "#d9e4ff", // light periwinkle
            items: [
                "View All Venues",
                "Banquet Halls",
                "Marriage Garden / Lawns",
                "Wedding Resorts",
                "Small Function / Party Halls",
                "Destination Wedding Venues",
                "Kalyana Mandapams",
                "4 Star & Above Wedding Hotels",
            ],
        },
        {
            title: "Photographers",
            subtitle: "Photographers",
            imageSrc: "/images/photographer.jpg",
            bgColor: "#f7d8c3", // peach
            items: ["View All Photographers", "Wedding Photographers", "Pre Wedding Shoot"],
        },
        {
            title: "Makeup",
            subtitle: "Bridal Makeup",
            imageSrc: "/images/makeup.jpg",
            bgColor: "#e8c2bf", // dusty rose
            items: ["Bridal Makeup", "Groom Makeup", "Trial Sessions"],
        },
        {
            title: "Planning & Decor",
            subtitle: "Wedding Planners, Decorators",
            imageSrc: "/images/decor.jpg",
            bgColor: "#f7cfa3", // light apricot
            items: ["Wedding Planning", "Decor Themes", "Floral Arrangements"],
        },
        {
            title: "Virtual Planning",
            subtitle: "Virtual planning",
            imageSrc: "/images/virtual.jpg",
            bgColor: "#f0e2d0", // beige
            items: ["Online Consultation", "Budget Tools", "Checklist"],
        },
        {
            title: "Mehndi",
            subtitle: "Mehendi Artist",
            imageSrc: "/images/mehndi.jpg",
            bgColor: "#e8dcc9", // light tan
            items: ["Artist Profiles", "Design Ideas", "Booking"],
        },
    ];

    const [openIndex, setOpenIndex] = useState(0); // first open by default

    const toggle = (i) => {
        setOpenIndex((prev) => (prev === i ? -1 : i));
    };

    return (
        <div className="container py-5">
            <div className="row g-3">
                {categories.map((cat, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div key={i} className="col-12 col-md-6">
                            <div className="category-accordion">
                                <div
                                    role="button"
                                    className="header-bar d-flex align-items-center justify-content-between"
                                    style={{ background: cat.bgColor }}
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                >
                                    <div className="title-block">
                                        <div className="title-row d-flex align-items-center">
                                            <h5 className="mb-0 me-2">{cat.title}</h5>
                                            <div className={`chevron ${isOpen ? "open" : ""}`} aria-hidden="true">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M6 9l6 6 6-6"
                                                        stroke="#1f2d3a"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="subtitle">{cat.subtitle}</div>
                                    </div>
                                    <div className="circle-img-wrapper">
                                        <img src={cat.imageSrc} alt={cat.title} />
                                    </div>
                                </div>

                                <div className={`expandable ${isOpen ? "show" : ""}`}>
                                    <div className="row">
                                        {cat.items.map((it, idx) => (
                                            <div key={idx} className="col-6 col-lg-4 py-2">
                                                <a href="#" className="item-link">
                                                    {it}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Styles */}
            <style>{`
        .category-accordion {
          background: white;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .header-bar {
          padding: 14px 18px;
          position: relative;
          cursor: pointer;
          gap: 16px;
        }
        .title-block h5 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          display: inline-block;
        }
        .subtitle {
          font-size: 0.85rem;
          color: #4f5d75;
          margin-top: 4px;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .chevron {
          transition: transform .25s ease;
          display: inline-flex;
          margin-left: 4px;
        }
        .chevron.open {
          transform: rotate(180deg);
        }
        .circle-img-wrapper {
          width: 110px;
          height: 110px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          border-radius: 50%;
          margin-left: auto;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .circle-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .expandable {
          max-height: 0;
          overflow: hidden;
          transition: max-height .35s ease, padding .35s ease;
          padding: 0 18px;
        }
        .expandable.show {
          padding: 16px 18px 18px;
          max-height: 800px;
        }
        .item-link {
          color: #1f2d3a;
          font-size: 0.9rem;
          text-decoration: none;
          transition: color .15s;
        }
        .item-link:hover {
          color: #e83581;
          text-decoration: underline;
        }
        @media (max-width: 767px) {
          .circle-img-wrapper {
            width: 80px;
            height: 80px;
            margin-top: 8px;
          }
          .header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .title-row {
            margin-bottom: 4px;
          }
        }
      `}</style>
        </div>
    );
};

export default CategoryAccordion;
