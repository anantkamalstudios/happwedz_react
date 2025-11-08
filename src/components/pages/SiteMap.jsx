// import { useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MyContext } from "../../context/useContext";
// import { useDispatch } from "react-redux";
// import { setLocation } from "../../redux/locationSlice";

// const SiteMap = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { setSelectedCategory, setSelectedCategoryName, types } =
//     useContext(MyContext);

//   const findCategoryIdByName = (categoryName) => {
//     if (!types || !Array.isArray(types)) return null;
//     const category = types.find(
//       (type) => type.name?.toLowerCase() === categoryName.toLowerCase()
//     );
//     return category ? category.id : null;
//   };

//   const siteLinks = [
//     { name: "About Us", slug: "about-us" },
//     { name: "Contact Us", slug: "contact-us" },
//     { name: "Terms & Conditions", slug: "terms" },
//     { name: "Privacy Policy", slug: "privacy" },
//     { name: "Cancellation Policy", slug: "cancellation" },
//     { name: "Submit Your Wedding", slug: "submit-your-wedding" },
//     { name: "Careers", slug: "careers" },
//     { name: "Register as a Vendor", slug: "register-as-vendor" },
//     { name: "Sign Up", slug: "sign-up" },
//     { name: "Login", slug: "login" },
//   ];

//   const mainLinks = [
//     { name: "Home", slug: "/" },
//     { name: "Vendors", slug: "/vendors" },
//     { name: "Real Weddings", slug: "/real-wedding" },
//     { name: "Gallery", slug: "/photography" },
//     { name: "Blogs", slug: "/blog" },
//   ];

//   const topCities = [
//     "Delhi NCR",
//     "Mumbai",
//     "Bangalore",
//     "Chennai",
//     "Pune",
//     "Lucknow",
//     "Jaipur",
//     "Kolkata",
//     "Hyderabad",
//   ];

//   const categories = [
//     { name: "Accessories", slug: "/vendor/accessories" },
//     { name: "Jewellery", slug: "/vendor/jewellery" },
//     { name: "Bridal Makeup Artists", slug: "/vendor/bridal-makeup-artists" },
//     { name: "Catering Services", slug: "/vendor/catering-services" },
//     {
//       name: "Pre Wedding Photographers",
//       slug: "/vendor/pre-wedding-photographers-",
//     },
//     { name: "Trousseau Packers", slug: "/vendor/trousseau-packers" },
//     { name: "DJs", slug: "/vendor/djs" },
//     { name: "Venues", slug: "/vendor/venues" },
//     { name: "Groom Wear", slug: "/vendor/groom-wear" },
//     { name: "Photographers", slug: "/vendor/photographers" },
//     { name: "Bridal Wear", slug: "/vendor/bridal-wear" },
//     { name: "Wedding Pandits", slug: "/vendor/wedding-pandits" },
//     { name: "Mehendi Artists", slug: "/vendor/mehendi-artists" },
//     { name: "Favors", slug: "/vendor/favors" },
//     { name: "Wedding Planners", slug: "/vendor/wedding-planners" },
//     { name: "Invitations", slug: "/vendor/invitations" },
//     { name: "Sangeet Choreographer", slug: "/vendor/sangeet-choreographer" },
//     { name: "Cake", slug: "/vendor/cake" },
//     { name: "Cinema/Video", slug: "/vendor/cinema-video" },
//     { name: "Decorators", slug: "/vendor/decorators" },
//     { name: "Wedding Entertainment", slug: "/vendor/wedding-entertainment" },
//     { name: "Family Makeup", slug: "/vendor/family-makeup" },
//     { name: "Beauty and Wellness", slug: "/vendor/beauty-and-wellness" },
//   ];

//   const shuffleArray = (array) =>
//     array
//       .map((item) => ({ item, sort: Math.random() }))
//       .sort((a, b) => a.sort - b.sort)
//       .map(({ item }) => item);

//   const cityCategoryMap = topCities.map((city) => ({
//     city,
//     categories: shuffleArray(categories),
//   }));

//   return (
//     <div style={{ background: "#fafafa" }}>
//       <h1
//         style={{
//           textAlign: "center",
//           color: "#C31162",
//           marginBottom: "30px",
//           fontWeight: "700",
//           fontSize: "2rem",
//         }}
//       >
//         Site Map
//       </h1>

//       <div
//         style={{
//           maxWidth: "900px",
//           margin: "0 auto",
//           lineHeight: "1.8",
//           color: "#555",
//         }}
//       >
//         <section style={{ marginBottom: "20px" }}>
//           <h4 style={{ color: "#C31162", marginBottom: "8px" }}>
//             HappyWedz Links
//           </h4>
//           <div>
//             {mainLinks.map((link, index) => (
//               <Link
//                 key={link.slug}
//                 to={link.slug}
//                 style={{
//                   textDecoration: "none",
//                   color: "#555",
//                   marginRight: "8px",
//                 }}
//               >
//                 {link.name}
//                 {index !== mainLinks.length - 1 && ","}
//               </Link>
//             ))}
//           </div>
//         </section>

//         <section style={{ marginBottom: "20px" }}>
//           <h4 style={{ color: "#C31162", marginBottom: "8px" }}>Photos</h4>
//           <div>
//             {types?.map((type, index) => (
//               <span key={type.id}>
//                 <span
//                   onClick={() => handleCategoryClick(type.name)}
//                   style={{
//                     cursor: "pointer",
//                     color: "#555",
//                     marginRight: "8px",
//                     textDecoration: "none",
//                   }}
//                 >
//                   {type.description}
//                 </span>
//                 {index !== types.length - 1 && ","}
//               </span>
//             ))}
//           </div>
//         </section>

//         <section style={{ marginBottom: "20px" }}>
//           <h4 style={{ color: "#C31162", marginBottom: "8px" }}>Other Links</h4>
//           <div>
//             {siteLinks.map((link, index) => (
//               <Link
//                 key={link.slug}
//                 to={`/${link.slug}`}
//                 style={{
//                   textDecoration: "none",
//                   color: "#555",
//                   marginRight: "8px",
//                 }}
//               >
//                 {link.name}
//                 {index !== siteLinks.length - 1 && ","}
//               </Link>
//             ))}
//           </div>
//         </section>

//         <section style={{ marginTop: "40px" }}>
//           <h4 style={{ color: "#C31162", marginBottom: "15px" }}>
//             Explore Vendors in Cities
//           </h4>

//           {cityCategoryMap.map(({ city, categories }, index) => (
//             <div
//               key={index}
//               style={{
//                 marginBottom: "25px",
//                 borderBottom: "1px solid #eee",
//                 paddingBottom: "15px",
//               }}
//             >
//               <h5
//                 style={{
//                   fontWeight: "600",
//                   color: "#333",
//                   marginBottom: "10px",
//                 }}
//               >
//                 {city}
//               </h5>

//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: "10px",
//                 }}
//               >
//                 {categories.map((cat, index) => (
//                   <span
//                     key={index}
//                     onClick={() => {
//                       dispatch(setLocation(city));
//                       navigate(cat.slug);
//                     }}
//                     style={{
//                       cursor: "pointer",
//                       backgroundColor: "#fff",
//                       border: "1px solid #ddd",
//                       borderRadius: "20px",
//                       padding: "6px 14px",
//                       fontSize: "0.9rem",
//                       color: "#555",
//                       transition: "all 0.2s ease",
//                     }}
//                     onMouseOver={(e) => (
//                       (e.target.style.backgroundColor = "#C31162"),
//                       (e.target.style.color = "#fff"),
//                       (e.target.style.borderColor = "#C31162")
//                     )}
//                     onMouseOut={(e) => (
//                       (e.target.style.backgroundColor = "#fff"),
//                       (e.target.style.color = "#555"),
//                       (e.target.style.borderColor = "#ddd")
//                     )}
//                   >
//                     {cat.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default SiteMap;

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../context/useContext";
import { useDispatch } from "react-redux";
import { setLocation } from "../../redux/locationSlice";

const SiteMap = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { setSelectedCategory, setSelectedCategoryName, types } =
    useContext(MyContext);

  const findCategoryIdByName = (categoryName) => {
    if (!types || !Array.isArray(types)) return null;
    const category = types.find(
      (type) => type.name?.toLowerCase() === categoryName.toLowerCase()
    );
    return category ? category.id : null;
  };

  const siteLinks = [
    { name: "About Us", slug: "about-us" },
    { name: "Contact Us", slug: "contact-us" },
    { name: "Terms & Conditions", slug: "terms" },
    { name: "Privacy Policy", slug: "privacy" },
    { name: "Cancellation Policy", slug: "cancellation" },
    { name: "Submit Your Wedding", slug: "user-dashboard/real-wedding" },
    { name: "Careers", slug: "careers" },
    { name: "Register as a Vendor", slug: "vendor-register" },
    { name: "Sign Up", slug: "customer-register" },
    { name: "Login", slug: "customer-login" },
  ];

  const mainLinks = [
    { name: "Home", slug: "/" },
    { name: "Vendors", slug: "/vendors" },
    { name: "Real Weddings", slug: "/real-wedding" },
    { name: "Gallery", slug: "/photography" },
    { name: "Blogs", slug: "/blog" },
  ];

  const topCities = [
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Pune",
    "Lucknow",
    "Jaipur",
    "Kolkata",
    "Hyderabad",
  ];

  const categories = [
    { name: "Accessories", slug: "/vendor/accessories" },
    { name: "Jewellery", slug: "/vendor/jewellery" },
    { name: "Bridal Makeup Artists", slug: "/vendor/bridal-makeup-artists" },
    { name: "Catering Services", slug: "/vendor/catering-services" },
    {
      name: "Pre Wedding Photographers",
      slug: "/vendor/pre-wedding-photographers-",
    },
    { name: "Trousseau Packers", slug: "/vendor/trousseau-packers" },
    { name: "DJs", slug: "/vendor/djs" },
    { name: "Venues", slug: "/vendor/venues" },
    { name: "Groom Wear", slug: "/vendor/groom-wear" },
    { name: "Photographers", slug: "/vendor/photographers" },
    { name: "Bridal Wear", slug: "/vendor/bridal-wear" },
    { name: "Wedding Pandits", slug: "/vendor/wedding-pandits" },
    { name: "Mehendi Artists", slug: "/vendor/mehendi-artists" },
    { name: "Favors", slug: "/vendor/favors" },
    { name: "Wedding Planners", slug: "/vendor/wedding-planners" },
    { name: "Invitations", slug: "/vendor/invitations" },
    { name: "Sangeet Choreographer", slug: "/vendor/sangeet-choreographer" },
    { name: "Cake", slug: "/vendor/cake" },
    { name: "Cinema/Video", slug: "/vendor/cinema-video" },
    { name: "Decorators", slug: "/vendor/decorators" },
    { name: "Wedding Entertainment", slug: "/vendor/wedding-entertainment" },
    { name: "Family Makeup", slug: "/vendor/family-makeup" },
    { name: "Beauty and Wellness", slug: "/vendor/beauty-and-wellness" },
  ];

  const shuffleArray = (array) =>
    array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);

  const cityCategoryMap = topCities.map((city) => ({
    city,
    categories: shuffleArray(categories),
  }));

  const styles = {
    container: {
      background: "#fafafa",
      padding: "30px 16px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    title: {
      textAlign: "center",
      color: "#C31162",
      marginBottom: "24px",
      fontWeight: "700",
      fontSize: "1.8rem",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    card: {
      background: "white",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      transition: "all 0.3s ease",
    },
    cardTitle: {
      color: "#C31162",
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "10px",
      paddingBottom: "8px",
      borderBottom: "2px solid #C31162",
    },
    linkContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      fontSize: "0.85rem",
      lineHeight: "1.4",
    },
    link: {
      textDecoration: "none",
      color: "#555",
      transition: "color 0.2s ease",
    },
    separator: {
      color: "#ccc",
      margin: "0 2px",
    },
    citiesSection: {
      background: "white",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    citiesSectionTitle: {
      color: "#C31162",
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "16px",
      textAlign: "center",
    },
    cityBlock: {
      marginBottom: "20px",
      paddingBottom: "16px",
      borderBottom: "1px solid #f0f0f0",
    },
    cityName: {
      fontWeight: "600",
      color: "#333",
      fontSize: "0.95rem",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    cityIcon: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#C31162",
    },
    categoryTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
    },
    tag: {
      cursor: "pointer",
      backgroundColor: "#fff",
      border: "1px solid #e0e0e0",
      borderRadius: "16px",
      padding: "5px 12px",
      fontSize: "0.8rem",
      color: "#555",
      transition: "all 0.2s ease",
      fontWeight: "500",
    },
  };

  const handleCategoryClick = (categoryName) => {
    const categoryId = findCategoryIdByName(categoryName);
    if (categoryId) {
      setSelectedCategory(categoryId);
      setSelectedCategoryName(categoryName);
      navigate("/photography");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h1 style={styles.title}>Site Map</h1>

        <div style={styles.gridContainer}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>HappyWedz Links</h4>
            <div style={styles.linkContainer}>
              {mainLinks.map((link, index) => (
                <span key={link.slug}>
                  <Link
                    to={link.slug}
                    style={styles.link}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#ed1173")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    {link.name}
                  </Link>
                  {index !== mainLinks.length - 1 && (
                    <span style={styles.separator}>•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Photos</h4>
            <div style={styles.linkContainer}>
              {types?.map((type, index) => (
                <span key={type.id}>
                  <span
                    onClick={() => handleCategoryClick(type.name)}
                    style={{
                      ...styles.link,
                      cursor: "pointer",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#ed1173")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    {type.description}
                  </span>
                  {index !== types.length - 1 && (
                    <span style={styles.separator}>•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Other Links */}
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Other Links</h4>
            <div style={styles.linkContainer}>
              {siteLinks.map((link, index) => (
                <span key={link.slug}>
                  <Link
                    to={`/${link.slug}`}
                    style={styles.link}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#ed1173")
                    }
                    onMouseOut={(e) => (e.currentTarget.style.color = "#555")}
                  >
                    {link.name}
                  </Link>
                  {index !== siteLinks.length - 1 && (
                    <span style={styles.separator}>•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div style={styles.citiesSection}>
          <h4 style={styles.citiesSectionTitle}>Explore Vendors in Cities</h4>

          {cityCategoryMap.map(({ city, categories }, index) => (
            <div key={index} style={styles.cityBlock}>
              <h5 style={styles.cityName}>
                <span style={styles.cityIcon}></span>
                {city}
              </h5>

              <div style={styles.categoryTags}>
                {categories.map((cat, catIndex) => (
                  <span
                    key={catIndex}
                    onClick={() => {
                      dispatch(setLocation(city));
                      navigate(cat.slug);
                    }}
                    style={styles.tag}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#C31162";
                      e.target.style.color = "#fff";
                      e.target.style.borderColor = "#C31162";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#fff";
                      e.target.style.color = "#555";
                      e.target.style.borderColor = "#e0e0e0";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
