// import React, { useState } from "react";
// import { FaCheck, FaPlus, FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Vendors = () => {
//   const navigate = useNavigate();
//   const [vendors, setVendors] = useState({
//     booked: 0,
//     total: 18,
//     saved: 0,
//     hired: 0,
//   });

//   const [categories, setCategories] = useState([
//     {
//       name: "Venues",
//       path: "/venues", // Added path for each category
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Photography and Video",
//       path: "/photography",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Caterers",
//       path: "/caterers",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Wedding Planners",
//       path: "/planners",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Jewellery",
//       path: "/jewellery",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Transportation",
//       path: "/transportation",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Wedding Cards",
//       path: "/cards",
//       items: [],
//       completed: false,
//     },
//     {
//       name: "Flowers and Decoration",
//       path: "/flowers",
//       items: [],
//       completed: false,
//     },
//   ]);

//   const handleFindClick = (categoryPath) => {
//     navigate(categoryPath); // Navigate to the specific category page
//   };

//   return (
//     <div className="vendors-container">
//       <div className="vendors-header">
//         <h1>My Vendors</h1>
//         <div className="vendors-stats">
//           <div className="stat-box">
//             <span className="stat-number">{vendors.booked}</span>
//             <span className="stat-label">
//               OF {vendors.total} VENDORS BOOKED
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="divider"></div>

//       <div className="vendor-categories">
//         {categories.map((category, index) => (
//           <div
//             key={index}
//             className={`category-card ${category.completed ? "completed" : ""}`}
//           >
//             <h3>{category.name}</h3>
//             {category.completed ? (
//               <div className="completed-badge">
//                 <FaCheck /> Booked
//               </div>
//             ) : (
//               <button
//                 className="find-btn"
//                 onClick={() => handleFindClick(category.path)}
//               >
//                 <FaSearch /> Find
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Vendors;
import React, { useState, useEffect } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Vendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState({
    booked: 0,
    total: 25,
    saved: 0,
    hired: 0,
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://happywedz.com/api/vendor-types");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching vendor categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFindClick = (categoryPath) => {
    navigate(categoryPath);
  };

  return (
    <div className="vendors-container">
      <div className="vendors-header">
        <h1>My Vendors</h1>
        <div className="vendors-stats">
          <div className="stat-box">
            <span className="stat-number">{vendors.booked}</span>
            <span className="stat-label">
              OF {vendors.total} VENDORS BOOKED
            </span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="vendor-categories">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-card ${category.completed ? "completed" : ""}`}
          >
            <h3>{category.name}</h3>
            {category.completed ? (
              <div className="completed-badge">
                <FaCheck /> Booked
              </div>
            ) : (
              <button
                className="find-btn"
                onClick={() => handleFindClick(category.path)}
              >
                <FaSearch /> Find
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;
